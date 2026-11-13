/**
 * Seeds starter content from the Shakti Pumps blueprint.
 *   npm run db:seed          -> categories, KSB brand, industries, FAQs, default settings
 *   npm run db:seed:demo     -> also adds a few clearly-labelled DEMO products/spares for local testing
 * Safe to re-run: existing rows are left untouched.
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { count } from "drizzle-orm";
import { brands, categories, faqs, industries, products, settings } from "../src/lib/db/schema";
import { DEFAULT_SETTINGS } from "../src/lib/site-defaults";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (.env.local).");
  process.exit(1);
}
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const client = postgres(url, { prepare: false, max: 1, ssl: local ? false : "require" });
const db = drizzle(client);
const demo = process.argv.includes("--demo");

async function main() {
  await db
    .insert(categories)
    .values([
      { slug: "pumps", name: "Pumps", description: "Pumping solutions for a range of water and industrial applications.", ctaLabel: "View Products", sortOrder: 1 },
      { slug: "motors", name: "Motors", description: "Motor solutions for pumping and equipment requirements.", ctaLabel: "View Products", sortOrder: 2 },
      { slug: "valves", name: "Valves", description: "Solutions for fluid control and flow management.", ctaLabel: "View Products", sortOrder: 3 },
      { slug: "ksb-products", name: "KSB Products", description: "KSB pumps, valves and related product requirements.", href: "/ksb", ctaLabel: "Explore KSB", selectable: false, sortOrder: 4 },
      { slug: "spare-parts", name: "Spare Parts", description: "Pump, motor and valve spare parts and components.", href: "/spare-parts", ctaLabel: "Explore Spare Parts", selectable: false, sortOrder: 5 },
      { slug: "industrial-components", name: "Industrial Components", description: "Selected components and accessories for maintenance and replacement requirements.", ctaLabel: "View Components", sortOrder: 6 },
    ])
    .onConflictDoNothing();

  await db
    .insert(brands)
    .values({
      slug: "ksb",
      name: "KSB",
      description: "KSB pumps, valves and related spare parts. Add the official KSB logo only where permitted.",
      sortOrder: 1,
    })
    .onConflictDoNothing();

  await db
    .insert(industries)
    .values([
      { slug: "water-and-irrigation", name: "Water & Irrigation", description: "Pumping solutions for water movement and irrigation requirements.", sortOrder: 1 },
      { slug: "agriculture", name: "Agriculture", description: "Relevant pumping and equipment solutions for agricultural applications.", sortOrder: 2 },
      { slug: "industrial", name: "Industrial", description: "Products supporting industrial pumping and fluid-handling requirements.", sortOrder: 3 },
      { slug: "building-services", name: "Building Services", description: "Pumps, valves and related equipment for building-service applications.", sortOrder: 4 },
      { slug: "manufacturing", name: "Manufacturing", description: "Relevant pumping and component requirements for manufacturing environments.", sortOrder: 5 },
      { slug: "wastewater", name: "Wastewater", description: "Products and components for relevant wastewater and sewage applications.", sortOrder: 6 },
    ])
    .onConflictDoNothing();

  const [{ n: faqCount }] = await db.select({ n: count() }).from(faqs);
  if (faqCount === 0) {
    await db.insert(faqs).values([
      { question: "Which KSB products do you supply?", answer: "We supply KSB pumps, valves and related spare parts for customers in Haryana. Contact us with your requirement and we will confirm availability.", sortOrder: 1 },
      { question: "Do you supply pump spare parts?", answer: "Yes. We supply pump spare parts such as mechanical seals, bearings, impellers, shafts and couplings, subject to availability.", sortOrder: 2 },
      { question: "Can I enquire for a specific pump model?", answer: "Yes. Send the model number through the enquiry form, call or WhatsApp and we will confirm availability.", sortOrder: 3 },
      { question: "Do you supply valve spare parts?", answer: "Yes. Share the valve make, model and the part you need and we will check availability.", sortOrder: 4 },
      { question: "How can I request a quotation?", answer: "Use the Get a Quote form, or call or WhatsApp us with the product, model and quantity.", sortOrder: 5 },
      { question: "Where is Shakti Pumps located?", answer: "Shakti Pumps is located in Karnal, Haryana. See the Contact page for details and map.", sortOrder: 6 },
    ]);
  }

  await db.insert(settings).values({ key: "site", value: { ...DEFAULT_SETTINGS } }).onConflictDoNothing();

  if (demo) {
    const [{ n }] = await db.select({ n: count() }).from(products);
    if (n === 0) {
      const cats = Object.fromEntries((await db.select().from(categories)).map((c) => [c.slug, c.id]));
      const note = "Demo entry for testing — replace or delete from the admin panel.";
      await db.insert(products).values([
        { slug: "demo-centrifugal-pump", kind: "product", name: "Demo Centrifugal Pump", categoryId: cats.pumps, shortDescription: note, overview: note, applications: ["Water & Irrigation", "Industrial"], models: ["DEMO-100"], featured: true },
        { slug: "demo-electric-motor", kind: "product", name: "Demo Electric Motor", categoryId: cats.motors, shortDescription: note, applications: ["Industrial"], featured: true },
        { slug: "demo-gate-valve", kind: "product", name: "Demo Gate Valve", categoryId: cats.valves, shortDescription: note, applications: ["Building Services"], featured: true },
        { slug: "demo-industrial-component", kind: "product", name: "Demo Industrial Component", categoryId: cats["industrial-components"], shortDescription: note },
        { slug: "demo-mechanical-seal", kind: "spare", name: "Demo Mechanical Seal", partType: "Mechanical Seals", shortDescription: note, compatibleEquipment: "Demo pump", models: ["DEMO-100"], applications: ["Industrial"] },
        { slug: "demo-bearing", kind: "spare", name: "Demo Bearing", partType: "Bearings", shortDescription: note },
        { slug: "demo-impeller", kind: "spare", name: "Demo Impeller", partType: "Impellers", shortDescription: note },
      ]);
      console.log("✓ demo products added");
    }
  }

  console.log("✓ seed complete");
  await client.end();
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});
