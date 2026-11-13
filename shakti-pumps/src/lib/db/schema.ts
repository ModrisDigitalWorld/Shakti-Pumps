import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type Spec = { label: string; value: string };

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  /** Custom link target, e.g. /ksb. Empty → /products?category=<slug> */
  href: text("href").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default("View Products"),
  /** Whether products can be assigned to this category in the admin. */
  selectable: boolean("selectable").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  logoUrl: text("logo_url").notNull().default(""),
  website: text("website").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    /** "product" | "spare" */
    kind: text("kind").notNull().default("product"),
    name: text("name").notNull(),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
    partType: text("part_type").notNull().default(""),
    shortDescription: text("short_description").notNull().default(""),
    overview: text("overview").notNull().default(""),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    specs: jsonb("specs").$type<Spec[]>().notNull().default([]),
    applications: jsonb("applications").$type<string[]>().notNull().default([]),
    models: jsonb("models").$type<string[]>().notNull().default([]),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    compatibleEquipment: text("compatible_equipment").notNull().default(""),
    material: text("material").notNull().default(""),
    availability: text("availability").notNull().default("On request"),
    imageUrl: text("image_url").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_kind_idx").on(t.kind, t.published),
    index("products_category_idx").on(t.categoryId),
    index("products_brand_idx").on(t.brandId),
  ],
);

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Product Catalogue"),
  description: text("description").notNull().default(""),
  fileUrl: text("file_url").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    /** "quote" | "spare" | "contact" */
    type: text("type").notNull().default("quote"),
    name: text("name").notNull(),
    company: text("company").notNull().default(""),
    mobile: text("mobile").notNull(),
    email: text("email").notNull().default(""),
    product: text("product").notNull().default(""),
    model: text("model").notNull().default(""),
    spare: text("spare").notNull().default(""),
    quantity: text("quantity").notNull().default(""),
    message: text("message").notNull().default(""),
    productId: integer("product_id"),
    sourcePage: text("source_page").notNull().default(""),
    /** "new" | "contacted" | "closed" */
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("enquiries_status_idx").on(t.status, t.createdAt)],
);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
