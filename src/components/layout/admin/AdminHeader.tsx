type AdminHeaderProps = {
  description?: string;
  title: string;
};

export default function AdminHeader({
  title,
}: AdminHeaderProps) {
  return (
    /* 어드민 페이지 공통 상단 헤더: 본문보다 가로로 넓게 bleed 처리 */
    <header className="-mx-5 mb-4 border-b border-border px-5 py-2.5 md:-mx-10 md:mb-5 md:px-10">
      <h1 className="m-0 type-body-md text-fg">{title}</h1>
    </header>
  );
}
