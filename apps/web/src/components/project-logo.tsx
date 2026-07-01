import { cn } from "@FC237/ui/lib/utils";

import { FC237_PROJECT_NAME, resolveBrandLogoUrl } from "@/lib/branding";

export function ProjectLogo({
  alt = `${FC237_PROJECT_NAME} logo`,
  className,
  src,
}: {
  alt?: string;
  className?: string;
  src?: string | null;
}) {
  return <img alt={alt} className={cn("h-auto w-full object-contain object-left", className)} src={resolveBrandLogoUrl(src)} />;
}
