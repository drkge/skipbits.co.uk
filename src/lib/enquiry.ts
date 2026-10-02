import { BUSINESS } from "@/consts";

type Enquirable = {
  name: string;
  code?: string;
  options?: { name: string };
};

/** A mailto: link with the part already filled in, so the customer only adds a quantity. */
export function enquiryMailto(product: Enquirable) {
  const label = product.code ? `${product.name} (${product.code})` : product.name;
  const lines = [
    "Hello,",
    "",
    "Could you let me know the price and availability of:",
    "",
    `Part: ${product.name}`,
    ...(product.code ? [`Code: ${product.code}`] : []),
    ...(product.options ? [`${product.options.name}: `] : []),
    "Quantity: ",
    "Delivery postcode: ",
    "",
    "Thanks,",
  ];
  const params = `subject=${encodeURIComponent(`Price enquiry: ${label}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return `mailto:${BUSINESS.email}?${params}`;
}
