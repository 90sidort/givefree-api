import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Item } from "./Item";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "username", length: 200, unique: true })
  username: string;

  @Column({ name: "name", length: 200 })
  name: string;

  @Column({ name: "surname", length: 200 })
  surname: string;

  @Column({ name: "password", length: 200 })
  password: string;

  @Column({ name: "email", length: 200, unique: true })
  email: string;

  @Column({ name: "about", length: 2000, nullable: true })
  about: string;

  @OneToMany(() => Item, (item) => item.giver, {
    nullable: true,
    cascade: true,
  })
  gave: Item[];

  @Column({ name: "active", default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
