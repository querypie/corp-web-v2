import TextButton from "@/components/ui/TextButton";

type McpsProps = {
  action?: {
    href: string;
    label: string;
  };
  className?: string;
  description: string[];
  items: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Mcps({
  action,
  className,
  description,
  items,
  title,
}: McpsProps) {
  return (
    /* MCP 설명 + 아이콘 그리드 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col gap-8">
        {/* 상단 카피 영역 */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h2 className="m-0 type-h2 leading-7 tracking-[-0.3px] text-fg">
            {title}
          </h2>
          <div className="flex max-w-[720px] flex-col items-start gap-4">
            <p className="m-0 type-body-lg leading-6 text-mute">
              {description.join(" ")}
            </p>
            {action ? (
              <TextButton href={action.href} className="type-body-md">
                {action.label}
              </TextButton>
            ) : null}
          </div>
        </div>

        {/* MCP 아이콘 카드 그리드 */}
        <div className="grid grid-cols-5 gap-2 md:flex md:flex-wrap md:gap-[10px]">
          {items.map((item) => (
            <div key={item.label} className="flex aspect-square min-w-0 items-center justify-center rounded-box bg-bg-content p-1 md:aspect-auto md:p-[30px]">
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
