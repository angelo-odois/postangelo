import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Page } from "./Page.js";
import { Asset } from "./Asset.js";
import { Profile } from "./Profile.js";
import { Experience } from "./Experience.js";
import { Education } from "./Education.js";
import { Skill } from "./Skill.js";
import { Project } from "./Project.js";

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", unique: true, length: 100, nullable: true })
  username?: string;

  @Column({ type: "varchar", unique: true, length: 255 })
  email!: string;

  @Column({ type: "varchar", name: "password_hash" })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role!: UserRole;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Page, (page) => page.createdBy)
  pages!: Page[];

  @OneToMany(() => Asset, (asset) => asset.uploadedBy)
  assets!: Asset[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile?: Profile;

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences!: Experience[];

  @OneToMany(() => Education, (education) => education.user)
  educations!: Education[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills!: Skill[];

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];
}
