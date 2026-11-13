export const SPARE_TYPES = [
  "Pump Spare Parts",
  "Motor Spare Parts",
  "Valve Spare Parts",
  "Mechanical Seals",
  "Bearings",
  "Impellers",
  "Shafts",
  "Couplings",
  "Other Components",
] as const;

export const DOC_TYPES = [
  "Product Catalogue",
  "Brochure",
  "Technical Document",
  "Product Datasheet",
  "Installation / Maintenance",
] as const;

export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_TYPES = ["quote", "spare", "contact"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_TYPE_LABEL: Record<EnquiryType, string> = {
  quote: "Quote",
  spare: "Spare part",
  contact: "Contact",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "KSB", href: "/ksb" },
  { label: "Spare Parts", href: "/spare-parts" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;
