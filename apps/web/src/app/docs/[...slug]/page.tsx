import type { Metadata } from "next";

import { source } from "@/lib/docs/source";

import { getDocsMetadata, renderDocsPage } from "../page.shared";

export default async function Page(props: PageProps<"/docs/[...slug]">) {
  const params = await props.params;
  return renderDocsPage(params.slug);
}

export async function generateStaticParams() {
  return source.generateParams().filter((params) => params.slug?.length);
}

export async function generateMetadata(
  props: PageProps<"/docs/[...slug]">,
): Promise<Metadata> {
  const params = await props.params;
  return getDocsMetadata(params.slug);
}
