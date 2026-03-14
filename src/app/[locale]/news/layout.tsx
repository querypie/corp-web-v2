import type { ReactNode } from "react";

type NewsLayoutProps = {
  children: ReactNode;
};

export default function NewsLayout({ children }: NewsLayoutProps) {
  return (
    <>{children}</>
  );
}
