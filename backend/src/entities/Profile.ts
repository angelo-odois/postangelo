import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import type { User } from "./User.js";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  coverImageUrl?: string;

  // Social Links
  @Column({ type: "varchar", length: 255, nullable: true })
  linkedinUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  githubUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  twitterUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  websiteUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  dribbbleUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  behanceUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instagramUrl?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  youtubeUrl?: string;

  // Contact
  @Column({ type: "varchar", length: 255, nullable: true })
  contactEmail?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  // Availability
  @Column({ type: "boolean", default: true })
  isAvailableForWork!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  availabilityStatus?: string;

  // Tags (stored as comma-separated string)
  @Column({ type: "text", nullable: true })
  tags?: string;

  // Template/Theme
  @Column({ type: "varchar", length: 50, default: "modern" })
  template!: string;

  @Column({ type: "varchar", length: 50, default: "amber" })
  accentColor!: string;

  @Column({ type: "varchar", length: 50, default: "inter" })
  fontFamily!: string;

  // User relation
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @OneToOne("User", "profile")
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
