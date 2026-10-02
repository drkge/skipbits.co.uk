// Global site data. Anything that appears both as visible copy and in
// structured data lives here so the two can't drift apart.

export const SITE_URL = "https://skipbits.co.uk";

export const SITE_TITLE = "Skip Bits";
export const SITE_DESCRIPTION =
  "Your one-stop shop for skip and container parts: rollers, hinges, lugs, door locks, bin lids and spares. Call or email for prices and availability.";

/** Default social sharing card. 1200x630, lives in `public/`. */
export const OG_IMAGE = {
  src: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Skip Bits — skip and container parts",
};

export const BUSINESS = {
  name: "Skip Bits",
  legalName: "Caledonia Containers Limited",
  email: "skipbits@outlook.com",
  /** As a UK visitor would read it. */
  telephoneDisplay: "07981 883340",
  /** E.164, for tel: links and structured data. */
  telephoneIntl: "+447981883340",
  address: {
    street: "3 Irvine Road, Lugton Bridge",
    locality: "Lugton",
    region: "Ayrshire",
    postalCode: "KA3 4ED",
    country: "GB",
  },
  /** Address as display lines, for the contact page and footer. */
  addressLines: ["c/o Caledonia Containers Ltd", "3 Irvine Road", "Lugton Bridge", "Lugton, Ayrshire", "KA3 4ED"],
  companyNumber: "SC737857",
  vatNumber: "517282393",
  parent: { name: "Caledonia Containers", href: "https://caledoniacontainers.co.uk" },
};

export const TEL_HREF = `tel:${BUSINESS.telephoneIntl}`;
export const MAILTO_HREF = `mailto:${BUSINESS.email}`;

/**
 * Product groups. Every category file in `src/content/categories/` names one
 * of these as its `group`.
 */
export const GROUPS = [
  {
    id: "skip-parts",
    title: "Skip & container parts",
    short: "Skip parts",
    blurb: "Rollers, hinges, lugs, profiles, door locks and fittings for building and repairing skips.",
  },
  {
    id: "lids",
    title: "Lids & doors",
    short: "Lids & doors",
    blurb: "Replacement lids and doors for trade waste bins, skips, FEL, REL and RORO containers.",
  },
  {
    id: "bin-spares",
    title: "Bin spares",
    short: "Bin spares",
    blurb: "Locks, keys, hinge bars, castors and the small parts that keep trade waste bins in service.",
  },
] as const;

export type GroupId = (typeof GROUPS)[number]["id"];

export const NAV = [
  ...GROUPS.map((group) => ({ label: group.short, href: `/collections/#${group.id}` })),
  { label: "Contact", href: "/contact/" },
];

/** Categories shown on the home page, in this order. */
export const FEATURED_CATEGORIES = [
  "skip-rollers",
  "skip-hinges",
  "skip-lugs",
  "door-lock-components",
  "trade-waste-lids",
  "closed-body-rigging-screws",
];
