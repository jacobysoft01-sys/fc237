import { getDocsMetadata, renderDocsPage } from "./page.shared";

export default function DocsIndexPage() {
  return renderDocsPage();
}

export function generateMetadata() {
  return getDocsMetadata();
}
