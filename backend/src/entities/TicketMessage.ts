import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import type { Ticket } from "./Ticket.js";

export enum MessageType {
  USER = "user",
  SUPPORT = "support",
  SYSTEM = "system",
}

@Entity("ticket_messages")
export class TicketMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  ticketId!: string;

  @ManyToOne("Ticket", "messages", { onDelete: "CASCADE" })
  @JoinColumn({ name: "ticketId" })
  ticket!: Ticket;

  @Column({ type: "uuid", nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column({ type: "text" })
  content!: string;

  @Column({
    type: "enum",
    enum: MessageType,
    default: MessageType.USER,
  })
  type!: MessageType;

  @Column({ type: "simple-array", nullable: true })
  attachments?: string[];

  @Column({ type: "boolean", default: false })
  isInternal!: boolean; // Internal notes visible only to support staff

  @CreateDateColumn()
  createdAt!: Date;
}
