import {
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Check,
  FileText,
  FolderKanban,
  Headphones,
  Languages,
  Layers3,
  MessageSquareText,
  Network,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

type IconName = "analysis" | "brain" | "calendar" | "check" | "connect" | "document" | "folder" | "headphones" | "knowledge" | "languages" | "layers" | "message" | "people" | "search" | "shield" | "spark";

type Props = {
  className?: string;
  name: IconName;
};

const icons: Record<IconName, LucideIcon> = {
  analysis: BarChart3,
  brain: BrainCircuit,
  calendar: CalendarDays,
  check: Check,
  connect: Network,
  document: FileText,
  folder: FolderKanban,
  headphones: Headphones,
  knowledge: ScanSearch,
  languages: Languages,
  layers: Layers3,
  message: MessageSquareText,
  people: Users,
  search: Search,
  shield: ShieldCheck,
  spark: Sparkles,
};

export default function SolutionIcon({ className = "h-5 w-5", name }: Props) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.5} />;
}
