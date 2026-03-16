type AdminHeaderProps = {
  description?: string;
  title: string;
};

export default function AdminHeader({
  description,
  title,
}: AdminHeaderProps) {
  return (
    /* 어드민 페이지 상단 제목 + 설명 블록 */
    <header className="flex flex-col gap-2 border-b border-border pb-5">
      <h1 className="m-0 type-h2 text-fg">{title}</h1>
      {description ? <p className="m-0 type-body-md text-mute-fg">{description}</p> : null}
    </header>
  );
}
