import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { Item } from "./Item";

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "alt", length: 400, default: "image" })
  alt: string;

  @Column({ name: "url" })
  url: string;

  @ManyToOne(() => Item, (item) => item.images)
  item: Item;

  @Column()
  itemId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
