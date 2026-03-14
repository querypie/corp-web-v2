# 🎯 홈페이지 리뉴얼 가이드 (AI용 핵심 지침)

## 🎨 스타일 규칙 (Styling)
- **Framework:** Next.js (App Router), Tailwind CSS
- **Design Tokens:** 모든 수치는 임의의 px 대신 Tailwind 기본 유틸리티 클래스(또는 설정된 테마 값)를 사용한다.
- **Icons:** SVG 코드를 직접 넣지 말고 `src/components/common/` 내의 독립된 컴포넌트로 분리한다.

## 📂 구조 및 네이밍 (Structure)
- **Atomic Design:** - `common/`: 버튼, 입력창 등 기초 UI
  - `sections/`: Hero, Features 등 페이지 구성 섹션 단위
- **Naming:** 파일명과 컴포넌트명은 반드시 `PascalCase`를 사용한다. (예: `PrimaryButton.tsx`)

## 📄 데이터 관리
- 여러 컴포넌트에서 **공유**되는 데이터만 `src/constants/`로 분리한다. 한 컴포넌트에서만 쓰이는 데이터는 해당 컴포넌트 파일 안에 둔다.

## 💬 주석 규칙 (Comments)
- 한글로 친절한 주석처리 추가