import { IGetProductsResponse } from "../../../api/endpoints/teams";

export interface BillingPlan {
  /** Plan identifier sent to the API ("FREE", "PRO", "ENTERPRISE"). */
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

export const FREE_PLAN: BillingPlan = {
  id: "FREE",
  title: "Free",
  description: "For small teams & standalone product trials",
  price: "€0",
  features: [
    "Up to 3 team members",
    "5 monitors & 1 status page",
    "1 GB / month Log Search",
    "3 Managed AI investigations / mo",
    "1 Agent Context repository",
  ],
};

type Product = IGetProductsResponse["products"][number];

const formatPrice = (product: Product) => {
  const currency = (product.currency ?? "EUR").toUpperCase();
  if (currency === "EUR" || !currency) return `€${product.price}`;
  if (currency === "USD") return `$${product.price}`;
  if (currency === "GBP") return `£${product.price}`;
  return `${product.price} ${currency}`;
};

export function normalizePlanId(raw?: string): string {
  const upper = (raw ?? "FREE").trim().toUpperCase();
  if (upper === "TEAM") return "PRO";
  return upper || "FREE";
}

/** The free plan followed by the paid products the API offers. */
export const toBillingPlans = (products: Product[] = []): BillingPlan[] => [
  FREE_PLAN,
  ...products
    .map((product) => ({
      product,
      id: normalizePlanId(product.lookupKey || product.name),
    }))
    // FREE_PLAN is listed already; skip any free product the API returns too.
    .filter(({ product, id }) => Number(product.price) !== 0 && id !== "FREE")
    .map(({ product, id }) => ({
      id,
      title: id === "PRO" && product.name.toUpperCase() === "TEAM" ? "Pro" : product.name,
      description:
        id === "ENTERPRISE"
          ? "For organizations running full-suite operations"
          : "For growing engineering teams",
      price: formatPrice(product),
      features: product.marketing_features ?? [],
    })),
];
