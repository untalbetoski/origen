export type Theme = {
  paper: string; card: string; ink: string; muted: string; olive: string; clay: string; line: string;
  fontDisplay: string; fontBody: string; radius: string; logoUrl: string;
};
export type Contact = {
  whatsapp: string; phone: string; email: string; instagram: string; hours: string; area: string; responseTime: string; tagline: string;
};
export type Settings = { theme: Theme; contact: Contact };

export type Section = {
  key: string; eyebrow: string; title: string; subtitle: string; body: string; image_url: string | null;
  data: Record<string, unknown>; visible: boolean; sort: number;
};
export type Service = {
  id: string; slug: string; name: string; tagline: string; description: string; price_from: number; min_people: number;
  duration: string; includes: string; cover_url: string | null; sort: number; visible: boolean;
};
export type Package = {
  id: string; service_id: string; name: string; price: number; min_people: number; duration: string; description: string;
  dishes: string[]; badge: string | null; sort: number; visible: boolean;
};
export type Photo = { id: string; service_id: string; storage_path: string; url: string; caption: string; sort: number };
export type Reservation = {
  id: string; folio: string; service_slug: string; package_name: string; event_date: string | null; event_time: string | null;
  guests: number | null; location: string | null; notes: string | null; name: string; email: string; phone: string;
  status: "nueva" | "cotizada" | "confirmada" | "cancelada"; created_at: string;
};

export const DEFAULT_THEME: Theme = {
  paper: "#F3ECE6", card: "#FBF8F4", ink: "#2A2521", muted: "#5E5650", olive: "#5F6B4A", clay: "#A6522F", line: "#D9CFC4",
  fontDisplay: "Cormorant Garamond", fontBody: "Manrope", radius: "2px", logoUrl: "",
};
export const DEFAULT_CONTACT: Contact = {
  whatsapp: "", phone: "", email: "", instagram: "", hours: "", area: "", responseTime: "48 h", tagline: "El gusto de reunirnos.",
};
