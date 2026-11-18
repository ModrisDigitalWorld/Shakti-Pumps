export interface SiteSettings {
  businessName: string;
  tagline: string;
  ksbDesignation: string;
  phone: string;
  enquiryPhone: string;
  supportPhone: string;
  email: string;
  whatsapp: string;
  address: string;
  mapEmbedUrl: string;
  heroImageUrl: string;
  ksbImageUrl: string;
  aboutImageUrl: string;
  establishedYear: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: "Shakti Pumps",
  tagline: "Reliable Products. Practical Solutions. Responsive Support.",
  // Must match official KSB dealership documentation.
  ksbDesignation: "KSB Dealer in Haryana",
  phone: "1234567890",
  enquiryPhone: "1234567890",
  supportPhone: "1234567890",
  email: "info@abc.com",
  whatsapp: "1234567890",
  address:
    "Plot No. 46, Sector 3, Industrial Area, HSIIDC, Karnal, Haryana 132001",
  mapEmbedUrl: "https://www.google.com/maps?q=Karnal%2C%20Haryana&output=embed",
  heroImageUrl: "",
  ksbImageUrl: "",
  aboutImageUrl: "",
  establishedYear: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
};
