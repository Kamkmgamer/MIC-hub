import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  varchar,
  text,
  decimal,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `mic-hub_${name}`);

export const userRole = pgEnum("user_role", ["business", "influencer"]);

export const users = createTable("user", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  role: userRole("role").notNull(),
  bio: text("bio"),
  website: varchar("website", { length: 256 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const campaigns = createTable("campaign", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  targetAudience: text("target_audience"),
  goals: text("goals"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const campaignStatus = pgEnum("campaign_status", ["pending", "accepted", "rejected"]);

export const applications = createTable("application", {
    id: serial("id").primaryKey(),
    campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
    influencerId: integer("influencer_id").references(() => users.id).notNull(),
    status: campaignStatus("status").default("pending").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});


export const contractStatus = pgEnum("contract_status", ["pending", "active", "completed", "terminated"]);

export const contracts = createTable("contract", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  influencerId: integer("influencer_id").references(() => users.id).notNull(),
  terms: text("terms").notNull(),
  status: contractStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "failed"]);

export const payments = createTable("payment", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatus("status").default("pending").notNull(),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const contentStatus = pgEnum("content_status", ["draft", "approved", "published"]);

export const content = createTable("content", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id).notNull(),
  title: varchar("title", { length: 256 }),
  description: text("description"),
  url: varchar("url", { length: 512 }),
  status: contentStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const analytics = createTable("analytics", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  engagement: integer("engagement"),
  reach: integer("reach"),
  roi: decimal("roi", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});