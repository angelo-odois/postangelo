import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ContentJSON } from "./Page.js";

export enum PageTemplateCategory {
  CV = "cv",
  LANDING = "landing",
  LINKS = "links",
  OTHER = "other",
}

@Entity("page_templates")
export class PageTemplate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 50, unique: true })
  slug!: string;

  @Column({ type: "varchar", name: "thumbnail_url", length: 500, nullable: true })
  thumbnailUrl?: string;

  @Column({
    type: "enum",
    enum: PageTemplateCategory,
    default: PageTemplateCategory.OTHER,
  })
  category!: PageTemplateCategory;

  @Column({ name: "content_json", type: "jsonb", default: { blocks: [] } })
  contentJSON!: ContentJSON;

  @Column({ name: "default_title", type: "varchar", length: 255, nullable: true })
  defaultTitle?: string;

  @Column({ name: "is_premium", type: "boolean", default: false })
  isPremium!: boolean;

  @Column({ type: "int", default: 0 })
  order!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
