import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Define a tabela goals
export const goals = pgTable('goals', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  weekFrequency: integer('week_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Define a tabela completions
export const completions = pgTable('completions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  goalId: text('goal_id').references(() => goals.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})