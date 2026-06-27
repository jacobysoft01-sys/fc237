export const FC237_PROJECT_NAME = "FC237";
export const FC237_PRODUCT_TAGLINE = "AI Compliance & Governance";
export const FC237_WORKFLOW_SEQUENCE =
  "Initial Questionnaire -> Dashboard -> Inventory -> Risk Assessment -> Controls -> Evidence -> Maturity -> Reports -> Continuous Improvement";
export const FC237_DEFAULT_LOGO_URL = "/fc237-logo.png";

export function resolveBrandLogoUrl(logoUrl?: string | null) {
  return typeof logoUrl === "string" && logoUrl.trim().length > 0 ? logoUrl.trim() : FC237_DEFAULT_LOGO_URL;
}
