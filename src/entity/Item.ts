import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { CategoryEnum, StateEnum, StatusEnum } from "../interfaces/enums";
import { Image } from "./Image";

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

  @OneToMany(() => Image, (image) => image.item, {
    nullable: true,
    cascade: true,
  })
  images: Image[];

  @Column({ name: "description", length: 200, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
