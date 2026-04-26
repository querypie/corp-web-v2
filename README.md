# corp-web-v2

QueryPie의 회사 홍보·소개 웹사이트입니다. 제품 소개, Features Demo, Documentation, Company 정보, Plans, Legal 문서 등을 다국어(en/ko/ja)로 제공합니다.

현재 운영 중인 두 레포지토리(`corp-web-app` + `corp-web-contents`)를 하나의 Next.js 15 앱으로 통합·대체하는 것이 목표이며, Admin CMS(Demo / Documentation / News 편집·게시)가 보조 기능으로 포함되어 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버 주소: `http://localhost:3000`

기타 스크립트:

```bash
npm run typecheck
npm run build
npm run start
npm run audit:public-assets
```

## 기술 스택

→ [구현 현황 — 기술 스택](docs/reference/corp-web-v2-implementation-status.md#기술-스택)

## 폴더 구조

→ [구현 현황 — 디렉토리 구조](docs/reference/corp-web-v2-implementation-status.md#디렉토리-구조)

## 콘텐츠 동작 방식

→ [구현 현황 — CMS 데이터 흐름](docs/reference/corp-web-v2-implementation-status.md#cms-데이터-흐름)

## Source Of Truth

→ [AGENTS.md — Source of Truth](AGENTS.md#source-of-truth)

## SEO 동작 방식

→ [AGENTS.md — SEO](AGENTS.md#seo)

## 라우팅 규칙

→ [AGENTS.md — 라우팅](AGENTS.md#라우팅)

## 법무 문서

→ [AGENTS.md — 법무 문서](AGENTS.md#법무-문서)

## 작업 시 기준 · 체크리스트

→ [AGENTS.md — 작업 규칙](AGENTS.md#작업-규칙)

## MDX 작성 규칙

- `src/content/mdx/**` 아래 Blog / White Paper MDX는 본문 단락을 **한 줄에 한 문장(one sentence per line)** 형식으로 작성합니다.
- 새 문장을 추가하거나 기존 문장을 수정할 때는 같은 문단 안에서도 문장마다 줄바꿈합니다.
- 리스트 항목이나 JSX 기반 본문 텍스트(`Table.Td`, `InfoNote` 등)도 여러 문장을 한 줄에 몰아 쓰지 않고 문장 단위 줄바꿈을 유지합니다.

## 빠른 진단 포인트

→ [AGENTS.md — 빠른 진단](AGENTS.md#빠른-진단)

---

## AI 에이전트 작업 가이드

Claude Code / Codex 등 AI 에이전트가 이 레포지토리에서 작업할 때의 흐름입니다.

**시작 전 필독:** [AGENTS.md](AGENTS.md) — 프로젝트 목적, Source of Truth, 작업 규칙, 주의사항, 빠른 진단

### 작업 흐름

프롬프트 앞에 아래 문장을 추가하면 CC가 worktree를 생성하고 그 안에서 작업합니다.

```
새 worktree에서 작업해줘. <작업 내용>
```

### 테스트 코드

코드 변경이 포함된 작업에는 테스트를 함께 요청하세요. 프롬프트에 명시하지 않으면 작성되지 않을 수 있습니다.

```
새 worktree에서 작업해줘. <작업 내용> 테스트 코드도 함께 작성하고 PR을 작성해줘.
```

### 예시 프롬프트

```
새 worktree에서 작업해줘. QueryPie가 ISO 27001 인증을 획득했어. 뉴스 콘텐츠를 새로 추가하고 PR을 작성해줘.
```

```
새 worktree에서 작업해줘. Features Documentation에 "데이터 접근 제어 설정" 문서를 새로 추가해줘. 테스트 코드를 충실하게 작성하고 PR을 작성해줘.
```

```
새 worktree에서 작업해줘. Plans 페이지의 Enterprise 플랜 설명 문구를 수정하고 PR을 작성해줘.
```

```
새 worktree에서 작업해줘. About Us 페이지의 회사 소개 문구를 수정해줘. 한국어·일본어도 함께 반영해서 PR을 작성해줘.
```

```
새 worktree에서 작업해줘. 개인정보처리방침 한국어 버전을 새 버전(v3)으로 추가하고 PR을 작성해줘.
```

```
Staging 서버에서 에러가 발생하고 있어. Vercel CLI로 로그를 조회해서 원인을 파악하고 수정 PR을 작성해줘. 테스트 코드를 충실하게 작성해줘.
```

### Claude Code 스킬

`.claude/skills/` 아래 단계별 스킬이 제공됩니다.

| 스킬 | 설명 |
|------|------|
| `worktree` | worktree 생성·정리 |
| `branch` | 브랜치 생성 |
| `commit` | 커밋 메시지 작성 규칙 |
| `pr` | PR 생성 — scope gate, 테스트 확인, 워크플로우 실행 |
| `vercel` | Vercel 배포 로그 조회 |

---

## 관련 문서

| 문서 | 설명 |
|------|------|
| [AGENTS.md](AGENTS.md) | AI 에이전트 작업 가이드 — Source of Truth, 작업 규칙, 라우팅·SEO·법무 주의사항, 빠른 진단 |
| [구현 현황](docs/reference/corp-web-v2-implementation-status.md) | 기술 스택, 폴더 구조, 공개 페이지·Admin CMS·API 라우트 완성도, CMS 데이터 흐름 |
| [Vercel 배포](docs/reference/vercel-deployment.md) | GitHub Actions 워크플로우, 배포 환경, 환경변수, DNS 설정 |
| [테스트 커버리지](docs/reference/test-coverage.md) | 테스트 파일 목록, Mock 패턴, 환경 설정 |
| [Community License](docs/reference/community-license.md) | 라이선스 신청/발급 기능 상세 |
| [GitHub 설정](docs/reference/github-settings.md) | CI 워크플로우, 브랜치 보호 규칙 |
