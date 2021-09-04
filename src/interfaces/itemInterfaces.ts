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
  skip?: number;
  first?: number;
  status?: string;
  name?: string;
}

export interface TakenItems {
  userId: number;
  skip?: number;
  first?: number;
}
