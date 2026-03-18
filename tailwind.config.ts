import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind가 클래스 사용 여부를 스캔할 경로
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 전역 spacing 토큰: 숫자 단위 + semantic spacing 포함
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      7.5: "30px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      15: "60px",
      16: "64px",
      18: "72px",
      20: "80px",
      24: "96px",
      30: "120px",
      "footer-gap": "120px",
      "page-top": "120px",
    },
    extend: {
      // 컬러 토큰: UI 전반에서 공통으로 사용하는 의미 기반 색상
      colors: {
        fg: "var(--color-fg)",
        "mute-fg": "var(--color-mute-fg)",
        "bg-content": "var(--color-bg-content)",
        "bg-deep": "var(--color-bg-deep)",
        bg: "var(--color-bg)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        white: "var(--color-white)",
        point: "var(--color-point)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        brand: "var(--color-brand)",
      },
      // 라운드 토큰
      borderRadius: {
        thumb: "10px",
        box: "10px",
        button: "8px",
        modal: "20px",
      },
      // 공통 애니메이션 정의
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      // 폰트 패밀리 토큰
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "SF Pro Display",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Open Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        pretendard: ["Pretendard Variable"],
        "pretendard-ja": ["Pretendard JP"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
