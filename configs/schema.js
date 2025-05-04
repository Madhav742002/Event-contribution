import { serial, text, pgTable, uuid , numeric,varchar, timestamp} from "drizzle-orm/pg-core";

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

// db/schema/users.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerkId").notNull().unique(), // Clerk User ID
  name: text("name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("imageUrl"), // Optional: Profile Image URL
});

// db/schema/events.ts

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  ticketPrice: text("ticket_price").notNull(),
  imageUrls: text("image_urls").array(), // Array of URLs
  clerkId: text("clerk_id").notNull(), // 👈 Important: link to user
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull(), // Link to event
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  paymentId: text("payment_id").notNull(),
  amount: numeric("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

