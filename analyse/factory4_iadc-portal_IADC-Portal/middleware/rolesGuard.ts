import { Middleware } from '@nuxt/types';
import { MenuItem } from '~/api/models/menu-item.model';
import global from '~/mixins/global';

export function stringToArray(input: string) {
  return input.replace('[', '').replace(']', '').split(', ');
}

export function checkCommonAccess(userRoles: string[], restrictedTo: string[]) {
  return userRoles.some((role: string) => restrictedTo.includes(role));
}

export function handlePostLoginRedirection(ctx) {
  const cachedRoute = localStorage.getItem('cachedRoute');
  if (cachedRoute) {
    localStorage.removeItem('cachedRoute');
    if (cachedRoute !== ctx.route.path) {
      ctx.redirect(cachedRoute);
    }
  }
}

export function checkUserProfile(user, MenuItem) {
  if (user.profile) {
    const userRoles = stringToArray(user.profile);
    return checkCommonAccess(userRoles, MenuItem?.restrictedTo);
  }
  return false;
}

export function checkAccess(ctx, user) {
  // by default all routes are accessible
  let accessGranted = true;
  let menu: MenuItem | undefined;

  // We retrieve the portalId and load the dynamic menus
  const portalId = global.methods.getPortalIdFromPath(ctx.route.path);

  const portalData = global.methods.checkPortal(
    ctx.store.state.landingPageData,
    portalId,
  );

  if (portalData) {
    menu = portalData.menus?.find((element) => element.href === ctx.route.path);
  }
  // if the route as an restrictedTo attribute, it's not accessible by default
  if (menu?.restrictedTo) {
    accessGranted = checkUserProfile(user, menu);
    // If the access is not granted, we display an error message
    if (!accessGranted) {
      adAccessError(ctx);
    }
  }
}

export function adAccessError(ctx) {
  ctx.error({
    statusCode: 403,
    message: 'Unauthorized: access restricted by AD groups',
  });
}

export function userAutoLogin(ctx) {
  localStorage.setItem('cachedRoute', ctx.from.fullPath);
  return ctx.$auth.loginWith('cognito', {
    params: {
      identity_provider: (process.env.iadc as any).cognitoProviderName,
    },
  });
}

const rolesGuard: Middleware = async (ctx) => {
  // we make sure the route name is not callback to avoid callback loop
  if (ctx.route.name !== 'callback') {
    const user = ctx.$auth.$state.user;
    try {
      await checkAccess(ctx, user);
    } catch (e) {
      adAccessError(ctx);
    }
    // if the user is not authentified, we auto login
    if (!user) {
      try {
        await userAutoLogin(ctx);
      } catch (e) {
        ctx.error({ message: 'Error on auto login:  {e.message}' });
      }
    } else {
      handlePostLoginRedirection(ctx);
    }
  }
};

export default rolesGuard;
