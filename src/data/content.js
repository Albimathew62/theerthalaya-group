// Theerthalaya Group of Companies — centralized content. Edit here to update the whole site.
// NOTE: figures, leadership names and contact details below are PLACEHOLDERS —
// swap them for the real values when the client provides them.

// Curated Unsplash imagery (verified). Swap the photo IDs for brand photography later.
// NOTE: the ten division images no longer come from here — they are graded and
// served locally from /public/ventures/. See the Venture imagery section of the README.
const u = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Locally-served assets live under /public. Root-relative "/x" strings break once the
// app is deployed under a sub-path (e.g. GitHub Pages' /<repo>/), so route them through
// Vite's BASE_URL instead of hardcoding a leading slash.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const companyInfo = {
  name: "THEERTHALAYA",
  tagline: "Group of Companies",
  fullName: "Theerthalaya Group of Companies",
  description:
    "A diversified group with operations across ten divisions, including construction, mineral water, micro-finance, dairy, agriculture, hospitality, tea processing, tea estates, dining and construction materials, all delivering quality, trust and sustainable growth.",
  founded: "1984", // PLACEHOLDER
  headquarters: "Kerala, India",
  cin: "U00000KL0000PLC000000", // PLACEHOLDER
  gstin: "32AAAAA0000A1Z5", // PLACEHOLDER
};

// Hero — a scroll-scrubbed construction film. `stages` label the four beats of
// the sequence and are keyed to normalized scroll progress (0–1); the heading
// holds across all four so the type never competes with the building.
// Thresholds are scroll progress, not video time — they account for the 6.1s
// usable segment of hero-v2.mp4 and Hero's LEAD_IN hold:
// p = LEAD_IN + (t/6.1) * (1 - LEAD_IN). Re-derive if any of those change.
export const heroContent = {
  heading: ["Built with", "purpose."],
  support: "Every great structure begins with a strong foundation and a clear vision.",
  stages: [
    { at: 0.0, label: "The beginning" },   // concrete frame, ground floor clad
    { at: 0.22, label: "Construction" },   // cladding climbs the lower floors
    { at: 0.46, label: "Transformation" }, // facade and glazing resolve upward
    { at: 0.74, label: "Completion" },     // finished building, held
  ],
};

export const navigation = [
  { label: "Group", href: "#group" },
  { label: "Ventures", href: "#companies" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: "1984", suffix: "", label: "Year founded" }, // PLACEHOLDER
  { value: "10", suffix: "", label: "Business divisions" },
  { value: "2500", suffix: "+", label: "People employed" }, // PLACEHOLDER
  { value: "40", suffix: "yr", label: "Years of trust" }, // PLACEHOLDER
];

// Footprint numbers. Net worth is client-supplied; the rest are PLACEHOLDERS.
// AnimatedCounter splits any leading non-digits off `value` as a prefix and
// groups the number with en-IN, so "₹1500" renders as ₹1,500.
export const footprint = [
  { value: "10", suffix: "", label: "Divisions in operation" },
  { value: "₹1500", suffix: "Cr", label: "Total net worth" },
  { value: "2500", suffix: "+", label: "People employed" },
  { value: "40", suffix: "yr", label: "Years of trust" },
];

// Ten business divisions — one structure, many ventures. Brand names, locations
// and activities are client-supplied; `children` are the activities each covers
// and `locations` the districts it operates in.
export const subsidiaries = [
  {
    id: 1,
    name: "Shikha Builders",
    category: "Construction & Infrastructure",
    sector: "Infrastructure",
    tagline: "Where the group was built.",
    description:
      "Residential and commercial building projects, and infrastructure development, delivered with engineering discipline and a refusal to cut corners.",
    icon: "Building2",
    children: ["Residential", "Commercial", "Infrastructure"],
    locations: ["Pathanamthitta", "Kollam", "Ernakulam", "Thrissur", "Idukki"],
    image: asset("/ventures/shikha-builders.webp"),
  },
  {
    id: 2,
    name: "Theertham Pure Water",
    category: "Mineral Water",
    sector: "Consumer",
    tagline: "Clean water, every day.",
    description:
      "Purified drinking water production and distribution, at scale, under a single trusted label.",
    icon: "Droplets",
    children: ["Production", "Bottling", "Distribution"],
    locations: ["Konni, Pathanamthitta", "Idukki"],
    image: asset("/ventures/theertham-pure-water.webp"),
  },
  {
    id: 3,
    name: "TLM Finance",
    category: "Micro Finance",
    sector: "Financial",
    tagline: "Backing local ambition.",
    description:
      "Small loans, financial support and community development that help families and small businesses grow.",
    icon: "Coins",
    children: ["Micro-loans", "Financial support", "Community development"],
    locations: ["Pathanamthitta", "Kollam", "Ernakulam", "Thrissur", "Idukki"],
    image: asset("/ventures/tlm-finance.webp"),
  },
  {
    id: 4,
    name: "Ramagiri Dairy Farm",
    category: "Dairy Farm & Butterfly Garden",
    sector: "Agribusiness",
    tagline: "From the herd, fresh.",
    description:
      "Milk production, dairy products and livestock management, alongside a butterfly garden open to visitors.",
    icon: "Milk",
    children: ["Milk", "Dairy products", "Livestock", "Butterfly garden"],
    locations: ["Rajagiri, Koodal, Pathanamthitta"],
    image: asset("/ventures/ramagiri-dairy-farm.webp"),
  },
  {
    id: 5,
    name: "Ramagiri Green Farms",
    category: "Agriculture Farm",
    sector: "Agribusiness",
    tagline: "Rooted in the land.",
    description:
      "Crop cultivation, organic farming and agricultural activities across the group's estates.",
    icon: "Sprout",
    children: ["Crops", "Organic farming", "Estates"],
    locations: ["Vandiperiyar, Idukki"],
    image: asset("/ventures/ramagiri-green-farms.webp"),
  },
  {
    id: 6,
    name: "GowriRamam Retreat",
    category: "Resort",
    sector: "Consumer",
    tagline: "Stay, unwind, return.",
    description:
      "Hospitality, tourism, luxury stays and leisure services, designed around comfort and place.",
    icon: "Palmtree",
    children: ["Resorts", "Tourism", "Leisure"],
    locations: ["Thekkady, Idukki", "Aymanam, Kottayam"],
    image: asset("/ventures/gowriramam-retreat.webp"),
  },
  {
    id: 7,
    name: "Theertham Premium Tea",
    category: "Tea Factory",
    sector: "Agribusiness",
    tagline: "Leaf to cup.",
    description:
      "Tea processing, packaging and distribution, bringing estate-grade tea from the highlands to the shelf.",
    icon: "Leaf",
    children: ["Processing", "Packaging", "Distribution"],
    locations: [], // PLACEHOLDER — location not supplied
    image: asset("/ventures/theertham-premium-tea.webp"),
  },
  {
    id: 8,
    name: "Ramagiri Estate",
    category: "Tea Estate",
    sector: "Agribusiness",
    tagline: "Grown on our own slopes.",
    description:
      "Premium tea cultivation, processing, packaging and distribution, from the plantation behind the label.",
    icon: "Leaf",
    children: ["Cultivation", "Processing", "Packaging", "Distribution"],
    locations: [], // PLACEHOLDER — location not supplied
    image: asset("/ventures/ramagiri-estate.webp"),
  },
  {
    id: 9,
    name: "GowriRamam Dine",
    shortName: "GRm Dine",
    category: "Restaurant",
    sector: "Consumer",
    tagline: "A table worth returning to.",
    description:
      "Food and beverage services with a quality dining experience, bringing the group's hospitality to street level.",
    icon: "UtensilsCrossed",
    children: ["Dining", "Catering", "Beverage"],
    locations: ["Konni", "Kundara", "Adoor", "Kottayam", "Ernakulam", "Thiruvananthapuram"],
    image: asset("/ventures/gowriramam-dine.webp"),
  },
  {
    id: 10,
    name: "Shikha BuildMart & Metals",
    category: "Construction Materials",
    sector: "Infrastructure",
    tagline: "Everything the build needs.",
    description:
      "Supply of cement, steel, bricks and construction materials, delivered reliably to sites across the region.",
    icon: "Warehouse",
    children: ["Cement & steel", "Bricks", "Supply"],
    locations: ["Ernakulam", "Kollam", "Pathanamthitta"],
    image: asset("/ventures/shikha-buildmart-and-metals.webp"),
  },
];

// Group-level promise: quality, trust, sustainable growth.
export const services = [
  {
    id: 1,
    title: "Find quality you can trust",
    label: "Quality",
    description:
      "Every venture is measured against the same bar: the standard that earned the Theerthalaya name its trust.",
    image: asset("/services/quality-control.webp"),
  },
  {
    id: 2,
    title: "Built on lasting relationships",
    label: "Trust",
    description:
      "Partners, banks and communities have relied on the group for generations. We protect that the way we protect any asset.",
    image: asset("/services/lasting-trust.webp"),
  },
  {
    id: 3,
    title: "Grow, responsibly",
    label: "Sustainable growth",
    description:
      "We build ventures to outlast a cycle, diversified across sectors, rooted locally, and grown responsibly.",
    image: asset("/services/sustainable-growth.webp"),
  },
];

// Brand words for the scrolling marquee behind the showcase image.
export const marqueeWords = [
  "Diverse Ventures", "One Vision", "Quality", "Trust", "Sustainable Growth",
];

// PLACEHOLDER testimonials — replace quotes and names with real ones.
export const testimonials = [
  {
    id: 1,
    quote:
      "Theerthalaya delivered on every commitment, on time and to spec. Working across their divisions has been refreshingly straightforward.",
    name: "Partner, Infrastructure",
  },
  {
    id: 2,
    quote:
      "A group you can actually rely on. The same standard runs through their construction arm and their consumer brands alike.",
    name: "Long-standing Client",
  },
  {
    id: 3,
    quote:
      "Diverse on paper, but one team in practice. Quality and trust show up in every interaction we've had.",
    name: "Banking Partner",
  },
];

// PLACEHOLDER leadership — replace names and photos with the real team.
export const leadership = [
  { id: 1, name: "Founder & Chairman", role: "Founder & Chairman", image: "" },
  { id: 2, name: "Group Managing Director", role: "Managing Director", image: "" },
  { id: 3, name: "Director, Operations", role: "Director, Operations", image: "" },
  { id: 4, name: "Director, Strategy", role: "Director, Strategy", image: "" },
];

export const certifications = ["ISO 9001:2015", "FSSAI", "BIS Certified", "Rainforest Alliance"];

export const faqs = [
  {
    question: "What sectors does Theerthalaya Group operate in?",
    answer:
      "Theerthalaya is a diversified group spanning ten divisions, including construction, mineral water, micro-finance, dairy farming, agriculture, resorts, tea processing, tea estates, dining and construction materials.",
  },
  {
    question: "What does “Diverse Ventures, One Vision” mean?",
    answer:
      "Each division runs in its own sector, but all are held to one standard of quality and trust. The group's strength is its breadth: many ventures supporting a single, shared vision of sustainable growth.",
  },
  {
    question: "How can partners or investors learn more about the group?",
    answer:
      "Reach our team through the contact form below and we'll share an overview of the group's divisions and how to work with us.",
  },
  {
    question: "Where is the group based?",
    answer:
      "Theerthalaya Group is headquartered in Kerala, India, with operations across its ten divisions.",
  },
];

export const contact = {
  office: "Theerthalaya House, Kerala, India", // PLACEHOLDER
  email: "theerthalayagroup@gmail.com",
  investorEmail: "partners@theerthalayagroup.in", // PLACEHOLDER
  phone: "+91 000 000 0000", // PLACEHOLDER
};

export const images = {
  hero: u("1496307653780-42ee777d4833", 1920),
  heroBuilding: u("1486406146926-c627a92ad1ab", 1920), // wide glass towers — rises into the hero cloud
  about: u("1487958449943-2429e8be8625", 1600),
  cta: u("1431576901776-e539bd916ba2", 1600),
  // Poster / fallback for the enlarging showcase — a real frame of the video,
  // so it no longer duplicates the photo used by `cta`.
  showcase: asset("/showcase-poster.jpg"),
  // Local brand showcase video (served from /public). Generated for Theerthalaya.
  showcaseVideo: asset("/showcase.mp4"),
  // flagship / projects sequence
  gallery: [
    u("1541888946425-d81bb19240f5", 1600),
    u("1431576901776-e539bd916ba2", 1600),
    u("1487958449943-2429e8be8625", 1600),
  ],
};
