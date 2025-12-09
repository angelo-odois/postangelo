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

export enum ProjectStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  longDescription?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  thumbnailUrl?: string;

  @Column({ type: "simple-array", nullable: true })
  images?: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  liveUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  repositoryUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  figmaUrl?: string;

  @Column({ type: "simple-array", nullable: true })
  technologies?: string[];

  @Column({ type: "simple-array", nullable: true })
  tags?: string[];

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.COMPLETED,
  })
  status!: ProjectStatus;

  @Column({ type: "date", name: "start_date", nullable: true })
  startDate?: Date;

  @Column({ type: "date", name: "end_date", nullable: true })
  endDate?: Date;

  @Column({ type: "boolean", name: "is_featured", default: false })
  isFeatured!: boolean;

  @Column({ type: "int", default: 0 })
  order!: number;

  // User relation
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
