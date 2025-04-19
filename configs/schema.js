import { primaryKey } from "drizzle-orm/gel-core";
import { serial, text, pgTable, varchar } from "drizzle-orm/pg-core";

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});

export const contact = pgTable("contact",{
  id: serial("id", { length: 255 }).primaryKey().notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message", { length: 1000 }).notNull(),
});

// Admins 
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  organizationName: text("organizationName").notNull(),
  eventName: text("eventName").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  gender: text("gender").notNull(),
});

// users 
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  organizationName: text("organizationName").notNull(),
  eventName: text("eventName").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  gender: text("gender").notNull(),
});

//volunteers

export const volunteers = pgTable("volunteers", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email").unique().notNull(),
  post: text("post").notNull(),
});
