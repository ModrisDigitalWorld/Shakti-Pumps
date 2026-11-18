// Pure data (safe for client + server): describes every admin-editable resource.
import { z } from "zod";
import { DOC_TYPES, SPARE_TYPES } from "./constants";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "file"
  | "lines" // string[] edited one-per-line
  | "specs" // {label,value}[] edited as "Label: Value" lines
  | "relation";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: readonly string[];
  relation?: "brands" | "categories";
  /** Occupy half the form width on desktop. */
  half?: boolean;
}

export interface Column {
  name: string;
  label: string;
  type?: "text" | "image" | "bool" | "relation" | "date";
  relation?: "brands" | "categories";
}

export interface ResourceConfig {
  key: string;
  label: string;
  singular: string;
  description: string;
  fields: Field[];
  columns: Column[];
  /** Whether the resource has a unique slug generated from `slugFrom`. */
  slugFrom?: string;
}

const publishFields: Field[] = [
  { name: "published", label: "Published (visible on website)", type: "boolean", half: true },
  { name: "sortOrder", label: "Sort order", type: "number", half: true, help: "Lower numbers appear first." },
];

export const RESOURCES: Record<string, ResourceConfig> = {
  products: {
    key: "products",
    label: "Products",
    singular: "Product",
    description: "Pumps, motors, valves, KSB products and industrial components.",
    slugFrom: "name",
    columns: [
      { name: "imageUrl", label: "", type: "image" },
      { name: "name", label: "Name" },
      { name: "categoryId", label: "Category", type: "relation", relation: "categories" },
      { name: "brandId", label: "Brand", type: "relation", relation: "brands" },
      { name: "featured", label: "Featured", type: "bool" },
      { name: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Product name", type: "text", required: true },
      { name: "categoryId", label: "Category", type: "relation", relation: "categories", half: true },
      { name: "brandId", label: "Brand", type: "relation", relation: "brands", half: true },
      { name: "shortDescription", label: "Short description", type: "textarea", required: true, help: "One or two lines shown on cards." },
      { name: "overview", label: "Overview", type: "textarea", help: "Short professional description for the detail page." },
      { name: "features", label: "Key features", type: "lines", help: "One per line (3–6 recommended)." },
      { name: "specs", label: "Technical specifications", type: "specs", help: "One per line as “Label: Value”. Enter verified specifications only." },
      { name: "applications", label: "Applications", type: "lines", help: "One per line. Use the same names as your Industries so filters match." },
      { name: "models", label: "Available models", type: "lines", help: "One model / variant per line." },
      { name: "availability", label: "Availability", type: "text", half: true, placeholder: "On request" },
      { name: "imageUrl", label: "Main image", type: "image", half: true, help: "Clean background, consistent 4:3 ratio works best." },
      { name: "gallery", label: "Additional image URLs", type: "lines", help: "One image URL per line (upload images above, or paste Cloudinary URLs)." },
      { name: "featured", label: "Featured on home page", type: "boolean", half: true },
      ...publishFields,
    ],
  },
  "spare-parts": {
    key: "spare-parts",
    label: "Spare Parts",
    singular: "Spare part",
    description: "Spare parts and components for pumps, motors and valves.",
    slugFrom: "name",
    columns: [
      { name: "imageUrl", label: "", type: "image" },
      { name: "name", label: "Part name" },
      { name: "partType", label: "Type" },
      { name: "brandId", label: "Brand", type: "relation", relation: "brands" },
      { name: "availability", label: "Availability" },
      { name: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Spare part name", type: "text", required: true },
      { name: "partType", label: "Part type", type: "select", options: SPARE_TYPES, half: true },
      { name: "brandId", label: "Brand", type: "relation", relation: "brands", half: true },
      { name: "shortDescription", label: "Short description", type: "textarea", required: true },
      { name: "compatibleEquipment", label: "Compatible equipment", type: "text", placeholder: "e.g. Pump make / series" },
      { name: "models", label: "Model(s)", type: "lines", help: "One per line." },
      { name: "applications", label: "Application", type: "lines", help: "One per line." },
      { name: "material", label: "Material / specification", type: "text", half: true },
      { name: "availability", label: "Availability", type: "text", half: true, placeholder: "On request" },
      { name: "overview", label: "Additional notes", type: "textarea" },
      { name: "specs", label: "Specifications", type: "specs", help: "“Label: Value” per line. Verified details only." },
      { name: "imageUrl", label: "Main image", type: "image", half: true },
      { name: "gallery", label: "Additional image URLs", type: "lines", half: true },
      { name: "featured", label: "Featured", type: "boolean", half: true },
      ...publishFields,
    ],
  },
  brands: {
    key: "brands",
    label: "Brands",
    singular: "Brand",
    description: "Only list brands you genuinely deal with and are permitted to display. The brand with slug “ksb” powers the KSB page.",
    slugFrom: "name",
    columns: [
      { name: "logoUrl", label: "", type: "image" },
      { name: "name", label: "Brand" },
      { name: "slug", label: "Slug" },
      { name: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "description", label: "Short description", type: "textarea" },
      { name: "logoUrl", label: "Logo", type: "image", help: "Use only officially permitted logos." },
      { name: "website", label: "Website", type: "text", placeholder: "https://" },
      ...publishFields,
    ],
  },
  categories: {
    key: "categories",
    label: "Categories",
    singular: "Category",
    description: "Product categories shown on the home page and used for filtering.",
    slugFrom: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug" },
      { name: "href", label: "Link" },
      { name: "selectable", label: "Assignable", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Category name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Image (optional)", type: "image" },
      { name: "ctaLabel", label: "Button label", type: "text", half: true, placeholder: "View Products" },
      { name: "href", label: "Custom link", type: "text", half: true, help: "Leave empty to link to the filtered product list." },
      { name: "selectable", label: "Products can be assigned to this category", type: "boolean", half: true },
      { name: "sortOrder", label: "Sort order", type: "number", half: true },
    ],
  },
  industries: {
    key: "industries",
    label: "Industries",
    singular: "Industry",
    description: "Publish only applications Shakti Pumps actually serves.",
    slugFrom: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Application / industry", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "imageUrl", label: "Image (optional)", type: "image" },
      ...publishFields,
    ],
  },
  resources: {
    key: "resources",
    label: "Resources",
    singular: "Document",
    description: "Catalogues, brochures, datasheets and technical documents. Upload only documents that exist.",
    columns: [
      { name: "title", label: "Title" },
      { name: "type", label: "Type" },
      { name: "published", label: "Live", type: "bool" },
      { name: "createdAt", label: "Added", type: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: DOC_TYPES, half: true },
      { name: "fileUrl", label: "File (PDF / document)", type: "file", required: true, half: true },
      { name: "description", label: "Description", type: "textarea" },
      ...publishFields,
    ],
  },
  faqs: {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Base these on real customer enquiries. Keep answers short and factual.",
    columns: [
      { name: "question", label: "Question" },
      { name: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      ...publishFields,
    ],
  },
};

export const SETTINGS_FIELDS: Field[] = [
  { name: "businessName", label: "Business name", type: "text", required: true, half: true },
  { name: "ksbDesignation", label: "KSB designation", type: "text", required: true, half: true, help: "Must match your official KSB dealership documentation." },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "phone", label: "Main phone", type: "text", required: true, half: true },
  { name: "enquiryPhone", label: "Enquiries phone", type: "text", half: true },
  { name: "supportPhone", label: "Complaints / support phone", type: "text", half: true },
  { name: "whatsapp", label: "WhatsApp number", type: "text", required: true, half: true, help: "10-digit number, or full number with country code." },
  { name: "email", label: "Email", type: "text", required: true, half: true },
  { name: "address", label: "Address", type: "textarea", required: true },
  { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "text", help: "Google Maps → Share → Embed a map → copy the src URL." },
  { name: "establishedYear", label: "Established year (optional)", type: "text", half: true, help: "Only if verified. Leave empty to hide." },
  // { name: "heroImageUrl", label: "Home hero image", type: "image", help: "One high-quality industrial / product photograph." },
    { name: "facebook", label: "Facebook page URL", type: "text", half: true, placeholder: "https://www.facebook.com/yourpage", help: "Leave empty to hide the icon." },
  { name: "instagram", label: "Instagram URL", type: "text", half: true, placeholder: "https://www.instagram.com/yourhandle" },
  { name: "twitter", label: "X (Twitter) URL", type: "text", half: true, placeholder: "https://x.com/yourhandle" },
  { name: "linkedin", label: "LinkedIn URL", type: "text", half: true, placeholder: "https://www.linkedin.com/company/yourcompany" },
  { name: "youtube", label: "YouTube channel URL", type: "text", half: true, placeholder: "https://www.youtube.com/@yourchannel" },
  { name: "ksbImageUrl", label: "KSB section image", type: "image", help: "Use only KSB-permitted imagery." },
  { name: "aboutImageUrl", label: "About section image", type: "image" },
];

/** Build a zod schema from field definitions (used by API routes for validation). */
export function buildSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const url = z
    .string()
    .trim()
    .max(1000)
    .refine((v) => v === "" || /^https?:\/\//i.test(v) || v.startsWith("/"), "Must be an http(s) URL");
  for (const f of fields) {
    let s: z.ZodTypeAny;
    switch (f.type) {
      case "number":
        s = z.coerce.number().int().min(-100000).max(100000);
        break;
      case "boolean":
        s = z.boolean();
        break;
      case "relation":
        s = z.number().int().nullable();
        break;
      case "image":
      case "file":
        s = f.required ? url.refine((v) => v !== "", "Required") : url;
        break;
      case "lines":
        s = z.array(z.string().trim().min(1).max(500)).max(80);
        break;
      case "specs":
        s = z.array(z.object({ label: z.string().trim().min(1).max(150), value: z.string().trim().max(400) })).max(80);
        break;
      case "select":
        s = f.options ? z.enum(f.options as unknown as [string, ...string[]]).or(z.literal("")) : z.string().trim().max(200);
        break;
      case "textarea":
        s = z.string().trim().max(10000);
        if (f.required) s = (s as z.ZodString).min(1, "Required");
        break;
      default:
        s = z.string().trim().max(1000);
        if (f.required) s = (s as z.ZodString).min(1, "Required");
    }
    shape[f.name] = s;
  }
  return z.object(shape);
}
