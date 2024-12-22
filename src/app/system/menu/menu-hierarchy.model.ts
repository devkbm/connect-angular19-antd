export interface MenuHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  key: string;
  title: string;
  menuGroupId: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  menuType: string;
  sequence: number;
  level: number;
  url: string;
  selected: boolean;
  expanded: boolean;
  children: MenuHierarchy[]
}
