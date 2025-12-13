import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import type { TicketMessage } from "./TicketMessage.js";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  WAITING_RESPONSE = "waiting_response",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TicketCategory {
  TECHNICAL = "technical",
  BILLING = "billing",
  ACCOUNT = "account",
  FEATURE_REQUEST = "feature_request",
  BUG_REPORT = "bug_report",
  OTHER = "other",
}

// SLA deadlines in hours based on priority
export const SLA_DEADLINES: Record<TicketPriority, number> = {
  [TicketPriority.LOW]: 72, // 3 days
  [TicketPriority.MEDIUM]: 48, // 2 days
  [TicketPriority.HIGH]: 24, // 1 day
  [TicketPriority.URGENT]: 4, // 4 hours
};

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid", nullable: true })
  assignedToId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assignedToId" })
  assignedTo?: User;

  @Column({ type: "varchar", length: 200 })
  subject!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status!: TicketStatus;

  @Column({
    type: "enum",
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority!: TicketPriority;

  @Column({
    type: "enum",
    enum: TicketCategory,
    default: TicketCategory.OTHER,
  })
  category!: TicketCategory;

  @Column({ type: "timestamp" })
  slaDeadline!: Date;

  @Column({ type: "boolean", default: false })
  slaBreach!: boolean;

  @OneToMany("TicketMessage", "ticket", { cascade: true })
  messages!: TicketMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  firstResponseAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  closedAt?: Date;
}
