import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

type Props = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "outline";
};

export default function SolutionActionLink({ children, href, variant = "primary" }: Props) {
  return (
    <Button href={href} size="large" style="full" variant={variant}>
      {children}
    </Button>
  );
}
