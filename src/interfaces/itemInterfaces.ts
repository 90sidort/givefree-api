import { CategoryEnum, StateEnum, StatusEnum } from "./enums";

export interface ItemCreate {
  name: string;
  active?: boolean;
  status?: StatusEnum;
  state?: StateEnum;
  category: CategoryEnum;
  description?: string;
  file: any;
  giverId: number;
}
