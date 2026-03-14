import type { ReactNode } from "react";

type DocsLayoutProps = {
  children: ReactNode;
};

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <>{children}</>
  );
}
