export interface TreeEntity {
  title: string;
  key: string;
  icon: string;
  isLeaf?: boolean;
  children?: TreeEntity[];
}