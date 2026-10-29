import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Media, ProjectKind } from "@/lib/types";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  client: text("client"),
  year: integer("year"),
  kind: text("kind").$type<ProjectKind>().notNull().default("kiosk"),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  built: jsonb("built").$type<string[]>().notNull().default([]),
  skills: jsonb("skills").$type<string[]>().notNull().default([]),
  thumbnail: jsonb("thumbnail").$type<Media>().notNull(),
  video: jsonb("video").$type<Media>(),
  gallery: jsonb("gallery").$type<Media[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  headline: text("headline").notNull(),
  subhead: text("subhead").notNull().default(""),
  intro: text("intro").notNull().default(""),
  aboutShort: text("about_short").notNull().default(""),
  email: text("email").notNull(),
  location: text("location").notNull().default(""),
  socialLinks: jsonb("social_links").$type<{ label: string; url: string }[]>().notNull().default([]),
  heroReelSlug: text("hero_reel_slug").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  heroImage: jsonb("hero_image").$type<Media>(),
  projectSlugs: jsonb("project_slugs").$type<string[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<Media[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
