type AdminHeaderProps = {
  description?: string;
  title: string;
};

export default function AdminHeader({
  title,
}: AdminHeaderProps) {
  return (
    /* 어드민 페이지 공통 상단 헤더: 본문보다 가로로 넓게 bleed 처리 */
    <header className="-mx-5 mb-0 px-5 pb-3.5 pt-4 md:-mx-10 md:mb-0 md:px-10">
      <h1 className="m-0 type-h3 text-fg">{title}</h1>
    </header>
  );
}
