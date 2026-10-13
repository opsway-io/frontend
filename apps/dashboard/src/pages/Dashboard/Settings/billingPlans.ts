import { IGetProductsResponse } from "../../../api/endpoints/teams";

export interface BillingPlan {
  /** Plan identifier sent to the API (the Stripe price lookup key). */
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

export const FREE_PLAN: BillingPlan = {
  id: "FREE",
  title: "Free",
  description: "For small hobby projects",
  price: "$0",
  features: ["3 Team Members", "5 Monitors", "1 Status Page"],
};

type Product = IGetProductsResponse["products"][number];

const formatPrice = (product: Product) => {
  const currency = (product.currency ?? "").toUpperCase();
  return currency === "USD" || !currency
    ? `$${product.price}`
    : `${product.price} ${currency}`;
};

/** The free plan followed by the paid products the API offers. */
export const toBillingPlans = (products: Product[] = []): BillingPlan[] => [
  FREE_PLAN,
  ...products
    .map((product) => ({
      product,
      id: (product.lookupKey ?? product.name ?? "").toUpperCase(),
    }))
    // FREE_PLAN is listed already; skip any free product the API returns too.
    .filter(({ product, id }) => Number(product.price) !== 0 && id !== "FREE")
    .map(({ product, id }) => ({
      id,
      title: product.name,
      description: "For your organization",
      price: formatPrice(product),
      features: product.marketing_features ?? [],
    })),
];
