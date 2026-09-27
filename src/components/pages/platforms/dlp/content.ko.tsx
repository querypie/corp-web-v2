import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie 데이터 손실 방지 (DLP)",
  description:
    "QueryPie의 다국어 DLP 연구는 규칙 검사와 경량 AI 선별, 정밀 원문 추출을 결합해 AI 입력의 민감정보 위험을 식별합니다.",
  keywords: ["QueryPie DLP", "다국어 DLP", "데이터 손실 방지", "민감정보 탐지", "AI 보안"],
} as const;

export default function DlpKOSolutionContent({ locale }: Props) {
  return (
    <DlpSolutionContent
      locale={locale}
      copy={{
        benefitItems: [
          {
            title: "규칙과 경량 AI로 빠르게 선별",
            body: "형식이 분명한 값은 정규식·키워드 규칙으로 먼저 확인하고, 규칙에 맞지 않는 입력은 CPU 환경에서도 대량 처리 가능한 ELECTRA 기반 경량 모델이 위험 점수로 선별합니다.",
          },
          {
            title: "유형과 원문 문구를 정밀 추출",
            body: "정밀 소형언어모델은 민감정보 유형과 원문에 나타난 문구를 찾고, 별도 프로그램은 원문과 대조해 정확한 위치를 계산합니다.",
          },
          {
            title: "다국어 업무 환경을 위한 연구",
            body: "한국어·영어·일본어 업무 문장과 코드, 표기 변형 사례를 반영해 21개 민감정보 유형을 정리했습니다. 내부 평가에서 한국어 경량 모델은 약 17.3ms의 평균 응답 시간과 약 94% F1을 기록했습니다.",
          },
        ],
        demoDescription:
          "이중 스크롤 없이 다국어 민감정보 탐지 데모를 전용 전체 화면으로 실행할 수 있습니다.",
        demoLaunchLabel: "전체 화면 데모 실행",
        demoTitle: "DLP 탐지 데모 바로 사용하기",
        description:
          "생성형 AI를 업무에 활용할수록 대화, 문서, 코드, 프롬프트에 섞인 민감정보를 맥락 속에서 찾아야 합니다. QueryPie는 빠른 위험 선별과 정확한 원문 문구 추출을 분리한 다국어 DLP 연구로, 필요한 입력에만 정밀 분석을 적용하는 구조를 설계했습니다.",
        featureBody:
          "고정된 규칙만으로 찾기 어려운 이름, 코드 속 인증정보, 공백·특수문자로 변형된 표현까지 고려합니다. 낮은 위험은 통과하고, 높은 위험과 애매한 그레이존은 추가 판단·정밀 추출로 이어져 민감정보 유형과 실제 원문 문구를 확인합니다.",
        featureImageAlt: "데이터 손실 방지 탐지 아키텍처",
        featureImageSrc: "/resources/white-papers/dlp-detection-architecture-ko.png",
        featureTitle: "빠른 위험 선별과 정밀 원문 추출을 함께 설계합니다.",
        heading: "데이터 손실 방지",
        label: "QueryPie DLP Research",
        tutorialTitle: "DLP 데모 영상",
      }}
    />
  );
}
