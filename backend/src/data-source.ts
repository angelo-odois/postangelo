import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  User,
  Page,
  BlockTemplate,
  Asset,
  Setting,
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  PageTemplate,
} from "./entities/index.js";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  synchronize: !isProduction,
  logging: !isProduction,
  entities: [User, Page, BlockTemplate, Asset, Setting, Profile, Experience, Education, Skill, Project, PageTemplate],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
