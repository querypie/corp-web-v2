type McpSectionProps = {
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

export default function McpSection({
  className,
  description,
  items,
  title,
}: McpSectionProps) {
  return (
    /* MCP 설명 + 아이콘 그리드 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col gap-8">
        {/* 상단 카피 영역 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <h2 className="m-0 type-h2 leading-7 tracking-[-0.3px] text-fg">
            {title}
          </h2>
          <div className="w-full type-body-lg leading-6 text-mute-fg md:w-[360px]">
            {description.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* MCP 아이콘 카드 그리드 */}
        <div className="flex flex-wrap gap-[10px]">
          {items.map((item) => (
            <div key={item.label} className="flex items-center rounded-box bg-bg-content p-[30px]">
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
