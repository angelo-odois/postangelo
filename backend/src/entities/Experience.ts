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

@Entity("experiences")
export class Experience {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  company!: string;

  @Column({ type: "varchar", length: 255 })
  position!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  employmentType?: string; // full-time, part-time, contract, freelance, internship

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "date", name: "start_date" })
  startDate!: Date;

  @Column({ type: "date", name: "end_date", nullable: true })
  endDate?: Date;

  @Column({ type: "boolean", name: "is_current", default: false })
  isCurrent!: boolean;

  @Column({ type: "varchar", length: 500, nullable: true })
  companyLogoUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  companyUrl?: string;

  @Column({ type: "simple-array", nullable: true })
  technologies?: string[];

  @Column({ type: "int", default: 0 })
  order!: number;

  // User relation
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
