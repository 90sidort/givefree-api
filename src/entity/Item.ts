import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

import { CategoryEnum, StateEnum, StatusEnum } from "../interfaces/enums";
import { Image } from "./Image";
import { User } from "./User";

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

  @ManyToOne(() => User, (user) => user.gave)
  giver: User;

  @Column({ name: "description", length: 200, nullable: true })
  description: string;

  @Column()
  giverId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
