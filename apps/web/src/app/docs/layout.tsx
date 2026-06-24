import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import { baseOptions } from "@/lib/docs/layout.shared";
import { source } from "@/lib/docs/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider>
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
