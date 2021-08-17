import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEnum, StateEnum, StatusEnum } from "../interfaces/enums";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", length: 400 })
  name: string;

  @Column({ name: "active", default: true })
  active: boolean;

  @Column("enum", {
    enum: StatusEnum,
    default: StatusEnum.DRAFT,
  })
  status: StatusEnum;

  @Column("enum", {
    enum: StateEnum,
    default: StateEnum.GOOD,
  })
  state: StateEnum;

  @Column("enum", {
    enum: CategoryEnum,
  })
  category: CategoryEnum;

  @Column({ name: "description", length: 200, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
