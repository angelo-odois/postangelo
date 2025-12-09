import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User.js";
import { Page } from "./Page.js";

export enum ViewType {
  PORTFOLIO = "portfolio",
  PAGE = "page",
}

@Entity("page_views")
@Index(["userId", "createdAt"])
@Index(["pageId", "createdAt"])
export class PageView {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "uuid", name: "page_id", nullable: true })
  pageId?: string;

  @ManyToOne(() => Page, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "page_id" })
  page?: Page;

  @Column({ type: "varchar", name: "view_type", length: 20, default: ViewType.PORTFOLIO })
  viewType!: ViewType;

  @Column({ type: "varchar", length: 500, nullable: true })
  referrer?: string;

  @Column({ type: "varchar", name: "user_agent", length: 500, nullable: true })
  userAgent?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  country?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  device?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  browser?: string;

  @Column({ type: "varchar", name: "ip_hash", length: 64, nullable: true })
  ipHash?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
