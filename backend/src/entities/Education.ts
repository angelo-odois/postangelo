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

@Entity("educations")
export class Education {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  institution!: string;

  @Column({ type: "varchar", length: 255 })
  degree!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  field?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "date", name: "start_date" })
  startDate!: Date;

  @Column({ type: "date", name: "end_date", nullable: true })
  endDate?: Date;

  @Column({ type: "boolean", name: "is_current", default: false })
  isCurrent!: boolean;

  @Column({ type: "varchar", length: 500, nullable: true })
  institutionLogoUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  institutionUrl?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  grade?: string;

  @Column({ type: "int", default: 0 })
  order!: number;

  // User relation
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.educations)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
