interface GenericMenuItem {
  title: string;

  href?: string;
  target?: string;

  disabled?: boolean;
}

export interface MenuItem extends GenericMenuItem {
  group?: string;
  icon?: string;
  restrictedTo?: string[];
  visibleToAnonymous?: boolean;
}

export interface SubMenuItem extends GenericMenuItem {
  badge?: string;
}

export interface ParentMenuItem extends MenuItem {
  items: SubMenuItem[];
}

export interface MenuDivider {
  divider: boolean;
}

export interface MenuHeader {
  header: string;
}

export type MenuItemsType = Array<
  MenuItem | SubMenuItem | ParentMenuItem | MenuDivider | MenuHeader
>;
