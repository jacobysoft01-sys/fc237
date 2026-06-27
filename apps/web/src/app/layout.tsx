import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";

import "../index.css";

import Providers from "@/components/providers";
import { FC237_DEFAULT_LOGO_URL, FC237_PRODUCT_TAGLINE, FC237_PROJECT_NAME } from "@/lib/branding";

const metadataBaseUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  title: FC237_PROJECT_NAME,
  description: `${FC237_PROJECT_NAME} is a web-first guided compliance workspace for cloud readiness, AI governance, evidence, vendor review, and reporting.`,
  metadataBase: new URL(metadataBaseUrl),
  icons: {
    icon: FC237_DEFAULT_LOGO_URL,
    apple: FC237_DEFAULT_LOGO_URL,
  },
  openGraph: {
    title: FC237_PROJECT_NAME,
    description: FC237_PRODUCT_TAGLINE,
    images: [{ url: FC237_DEFAULT_LOGO_URL, width: 1280, height: 1280, alt: `${FC237_PROJECT_NAME} logo` }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClerkProvider
          appearance={{ theme: shadcn }}
          signInUrl="/auth/sign-in"
          signUpUrl="/auth/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/onboarding"
        >
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
