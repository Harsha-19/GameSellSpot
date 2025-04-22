import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  discountPercentage: integer("discount_percentage").default(0),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").default(0), // Rating out of 500 (for half stars)
  category: text("category").notNull(),
  isNewRelease: boolean("is_new_release").default(false),
  isFeatured: boolean("is_featured").default(false),
  edition: text("edition").default("Standard Edition"),
  additionalImages: jsonb("additional_images").default([]),
  releaseDate: timestamp("release_date").notNull(),
});

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameId: integer("game_id").references(() => games.id).notNull(),
  quantity: integer("quantity").default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type Cart = typeof cart.$inferSelect;

// For frontend use
export type CartItem = {
  id: number;
  gameId: number;
  title: string;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
  edition: string;
  quantity: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};
