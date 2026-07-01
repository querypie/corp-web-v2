import type { Metadata } from "next";
import CommunityLicenseApplyPage from "@/components/pages/community-license/apply/CommunityLicenseApplyPage";
import { getCommunityLicenseApplyPageCopy } from "@/copy/communityLicense";
import { pageTopPaddingClassName } from "@/constants/layout";

export const metadata: Metadata = {
  title: "QueryPie Community License 신청",
  description: "QueryPie ACP Community Edition 라이선스를 신청하세요.",
};

export default function QueryPieCommunityLicenseApplyRoute() {
  return (
    <main className={`min-h-screen ${pageTopPaddingClassName} text-fg`}>
      <CommunityLicenseApplyPage {...getCommunityLicenseApplyPageCopy()} />
    </main>
  );
}
