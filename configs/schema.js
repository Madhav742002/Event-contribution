import { serial, text, pgTable, varchar, jsonb, timestamp, numeric, boolean } from "drizzle-orm/pg-core";

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

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  ticketPrice: text("ticketPrice"),
  imageUrls: jsonb("imageUrls"), // Store multiple image URLs as JSON array
  createdBy: text("createdBy").notNull(), // organizationName
  createdAt: text("createdAt").notNull(),
});

// Payment details table
export const paymentDetails = pgTable("paymentDetails", {
  id: serial("id").primaryKey(),
  eventId: text("eventId").notNull(),
  eventTitle: text("eventTitle").notNull(),
  studentName: text("studentName").notNull(),
  studentEmail: varchar("studentEmail", { length: 255 }).notNull(),
  studentAddress: text("studentAddress").notNull(),
  studentMobile: varchar("studentMobile", { length: 10 }).notNull(),
  enrollmentNo: varchar("enrollmentNo", { length: 20 }).notNull(),
  paymentId: varchar("paymentId", { length: 100 }).notNull().unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("paymentDate").defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  razorpayOrderId: varchar("razorpayOrderId", { length: 100 }),
  razorpaySignature: varchar("razorpaySignature", { length: 255 }),
  ticketDownloaded: boolean("ticketDownloaded").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
