import { CategoryEnum, StateEnum, StatusEnum } from "./enums";

export interface ItemUpdate {
  name?: string;
  active?: boolean;
  status?: StatusEnum;
  state?: StateEnum;
  category?: CategoryEnum;
  description?: string;
}
export interface ItemCreate extends ItemUpdate {
  giverId: number;
  name: string;
  category: CategoryEnum;
}

export interface ItemSearch {
  input: {
    skip?: number;
    first?: number;
    status?: string;
    name?: string;
    userId?: number;
    taken?: boolean;
  };
}
