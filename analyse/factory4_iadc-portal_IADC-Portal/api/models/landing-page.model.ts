import { MenuItem } from './menu-item.model';

export interface LandingPageModel {
  title?: string;
  targetUrl: string;
  img?: string;
  icon?: String;
  logo?: string;
  responsible?: string;
  description?: string;
  disabled: boolean;
  search: boolean;
  spaceKeys: string[];
  spaceTitles: string[];
  glisten: boolean;
  structurePageId?: string;
  menus?: MenuItem[];
  homepageId?: string;
}
