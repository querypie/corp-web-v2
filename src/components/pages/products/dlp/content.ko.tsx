import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie 데이터 손실 방지 (DLP)",
  description:
    "QueryPie DLP는 규칙 검사와 경량 AI로 다국어 입력의 민감정보 위험을 빠르게 선별하고, 필요한 입력에서 민감정보의 종류와 실제 내용을 찾아냅니다.",
  keywords: ["QueryPie DLP", "다국어 DLP", "데이터 손실 방지", "민감정보 탐지", "AI 보안"],
} as const;

export default function DlpKOSolutionContent({ locale }: Props) {
  return (
    <DlpSolutionContent
      locale={locale}
      copy={{
        demoItems: [
          {
            title: "ELECTRA 기반 위험 선별 데모",
            description: "문장을 입력하면 경량 모델이 계산한 위험 점수와 차단 판정을 확인할 수 있습니다.",
            imageSrc: "/demo/dlp-electra-thumbnail.png",
          },
          {
            title: "SLM 기반 민감정보 추출 데모",
            description: "문장을 입력하면 이름, 이메일, 전화번호 등 민감정보의 종류와 실제 내용이 어떻게 표시되는지 확인할 수 있습니다.",
            imageSrc: "/demo/dlp-demo-thumbnail.png",
          },
        ],
        demoLinkLabel: "데모 체험하기",
        demoTitle: "DLP 탐지 데모",
        description:
          "생성형 AI를 업무에 활용할수록 대화, 문서, 코드, 프롬프트에 섞인 민감정보를 맥락 속에서 찾아야 합니다. QueryPie DLP는 한국어·영어·일본어 입력의 위험을 빠르게 선별하고, 필요한 입력만 정밀하게 분석해 민감정보의 종류와 실제 내용을 찾아냅니다.",
        heading: "데이터 손실 방지",
        huggingFaceDescription:
          "QueryPie가 공개한 다국어 민감정보 탐지 모델과 모델 카드, 사용 자료를 Hugging Face에서 확인하고 활용할 수 있습니다.",
        huggingFaceLabel: "Hugging Face 바로가기",
        huggingFaceTitle: "Hugging Face에서 DLP 모델 사용하기",
        label: "QueryPie DLP",
        modelSections: [
          {
            label: "ELECTRA",
            sectionTitle: "ELECTRA 기반 DLP",
            role: "빠른 위험 선별",
            title: "수많은 입력에서 위험 신호를 빠르게 골라냅니다.",
            description:
              "ELECTRA 기반 경량 모델이 규칙만으로 판단하기 어려운 문장의 민감정보 위험을 빠르게 평가합니다. 대량의 입력에서도 추가 확인이 필요한 내용을 추려냅니다.",
            flowTitle: "빠른 위험 선별 기능",
            flow: [
              { label: "문맥까지 확인", value: "규칙과 형식만으로 구분하기 어려운 문장도 살펴봅니다." },
              { label: "위험도 표시", value: "민감정보가 포함됐을 가능성을 점수로 나타냅니다." },
              { label: "확인할 입력 선별", value: "위험도가 높거나 판단이 애매한 입력을 추가 검토 대상으로 구분합니다." },
            ],
          },
          {
            label: "SLM",
            sectionTitle: "SLM 기반 DLP",
            role: "정밀 민감정보 추출",
            title: "민감정보의 종류와 실제 내용을 찾아냅니다.",
            description:
              "SLM 기반 정밀 모델이 문맥을 분석해 민감정보의 종류와 입력에 실제로 적힌 내용을 함께 찾아냅니다. 보호가 필요한 부분을 구체적으로 확인할 수 있습니다.",
            flowTitle: "정밀 민감정보 추출 기능",
            flow: [
              { label: "정보 종류 구분", value: "이름·계좌정보·인증정보 등 어떤 민감정보인지 구분합니다." },
              { label: "실제 내용 찾기", value: "민감정보가 입력에 실제로 어떻게 적혀 있는지 찾아냅니다." },
              { label: "문맥을 반영한 판단", value: "정해진 형식에 맞지 않는 표현도 주변 내용을 함께 읽어 민감정보인지 판단합니다." },
            ],
          },
        ],
        processTitle: "규칙 검사부터 위험 선별, 민감정보 추출까지",
        processDescription:
          "정규식으로 확인하고, ELECTRA 기반 모델로 선별하며, SLM 기반 모델로 민감정보를 추출합니다.",
        processSteps: [
          {
            title: "규칙으로 즉시 확인",
            body: "정규식과 키워드로 형식이 분명한 민감정보를 먼저 찾습니다. 확실한 일치는 AI 분석을 기다리지 않고 바로 판단할 수 있습니다.",
          },
          {
            title: "ELECTRA 기반 모델로 위험 선별",
            body: "규칙에 맞지 않는 문장을 경량 분류 모델이 빠르게 읽고 위험 점수를 계산합니다. 위험도가 높거나 애매한 입력을 추가 확인 대상으로 추립니다.",
          },
          {
            title: "SLM 기반 모델로 민감정보 추출",
            body: "정밀 분석이 필요한 입력에서 민감정보의 종류와 실제 내용을 찾습니다. 별도 프로그램이 원문과 대조해 정확한 위치를 계산합니다.",
          },
        ],
      }}
    />
  );
}
