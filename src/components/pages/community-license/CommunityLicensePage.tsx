import CommunityLicenseForm from "./CommunityLicenseForm";
import type { CommunityLicensePageCopy } from "@/features/community-license/copy";

export default function CommunityLicensePage({
  copy,
}: {
  copy: CommunityLicensePageCopy;
}) {
  return (
    <div className="flex w-full justify-center px-5 md:px-10">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[80px]">
        {/* 좌측 hero */}
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
          <h1 className="m-0 type-h2 text-fg">
            {copy.titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">
            {copy.description}
          </p>
        </div>

        {/* 우측 폼 */}
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
          <CommunityLicenseForm copy={copy} />
        </div>
      </section>
    </div>
  );
}
