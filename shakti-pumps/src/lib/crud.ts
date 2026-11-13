import "server-only";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { brands, categories, documents, faqs, industries, products } from "./db/schema";
import { RESOURCES, type ResourceConfig } from "./admin-config";

export interface RegistryEntry {
  config: ResourceConfig;
  table: PgTable & Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Restricts rows (e.g. products vs spare parts share a table). */
  where?: SQL;
  /** Values forced on create. */
  fixed?: Record<string, unknown>;
  orderBy: SQL[];
  hasUpdatedAt?: boolean;
}

export const REGISTRY: Record<string, RegistryEntry> = {
  products: {
    config: RESOURCES.products,
    table: products,
    where: eq(products.kind, "product"),
    fixed: { kind: "product" },
    orderBy: [desc(products.id)],
    hasUpdatedAt: true,
  },
  "spare-parts": {
    config: RESOURCES["spare-parts"],
    table: products,
    where: eq(products.kind, "spare"),
    fixed: { kind: "spare" },
    orderBy: [desc(products.id)],
    hasUpdatedAt: true,
  },
  brands: { config: RESOURCES.brands, table: brands, orderBy: [asc(brands.sortOrder), asc(brands.name)] },
  categories: { config: RESOURCES.categories, table: categories, orderBy: [asc(categories.sortOrder), asc(categories.id)] },
  industries: { config: RESOURCES.industries, table: industries, orderBy: [asc(industries.sortOrder), asc(industries.id)] },
  resources: { config: RESOURCES.resources, table: documents, orderBy: [asc(documents.sortOrder), desc(documents.id)] },
  faqs: { config: RESOURCES.faqs, table: faqs, orderBy: [asc(faqs.sortOrder), asc(faqs.id)] },
};

export const getEntry = (key: string) => REGISTRY[key] ?? null;

/** Postgres error code, whether raw or wrapped by Drizzle. */
export function pgCode(e: unknown): string | undefined {
  const x = e as { code?: string; cause?: { code?: string } };
  return x?.code ?? x?.cause?.code;
}
