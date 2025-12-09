import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

export enum SkillCategory {
  TECHNICAL = "technical",
  SOFT = "soft",
  LANGUAGE = "language",
  TOOL = "tool",
  OTHER = "other",
}

export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({
    type: "enum",
    enum: SkillCategory,
    default: SkillCategory.TECHNICAL,
  })
  category!: SkillCategory;

  @Column({
    type: "enum",
    enum: SkillLevel,
    default: SkillLevel.INTERMEDIATE,
  })
  level!: SkillLevel;

  @Column({ type: "int", nullable: true })
  yearsOfExperience?: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  iconUrl?: string;

  @Column({ type: "int", default: 0 })
  order!: number;

  // User relation
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.skills)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
