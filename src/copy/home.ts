import type { Locale } from "@/constants/i18n";

export const homeHeroCopyByLocale = {
  en: {
    heroPrimaryCtaLabel: "Contact Us",
    heroHeading: "One platform. Secure every access.",
    heroDescription:
      "Unify access to databases, systems, Kubernetes, and web applications with QueryPie ACP.\nManage permissions, monitor activity, and stay ready for every audit.",
    heroImageAlt: "QueryPie ACP access control platform overview",
    heroVideoSrc: "/assets/pages/home/features/Home-ACP.mp4",
  },
  ko: {
    heroPrimaryCtaLabel: "문의하기",
    heroHeading: "모든 접근을 하나로, 보안은 더 확실하게",
    heroDescription:
      "데이터베이스부터 시스템, Kubernetes, 웹 애플리케이션까지 QueryPie ACP로 안전하게 연결하세요.\n권한 관리부터 활동 모니터링, 감사 대응까지 하나의 플랫폼에서.",
    heroImageAlt: "QueryPie ACP 접근 제어 플랫폼 소개",
    heroVideoSrc: "/assets/pages/home/features/Home-ACP.mp4",
  },
} satisfies Record<Exclude<Locale, "ja">, {
  heroHeading: string;
  heroPrimaryCtaLabel: string;
  heroDescription: string;
  heroImageAlt: string;
  heroVideoSrc: string;
}>;
