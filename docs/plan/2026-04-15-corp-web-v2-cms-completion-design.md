# corp-web-v2 CMS 완성 계획

**작성일**: 2026-04-15  
**목표**: CMS 기능 완성 및 corp-web-contents 콘텐츠의 안전한 이관

---

## 배경

corp-web-v2는 파일 기반 CMS를 내장하고 있다. 콘텐츠는 `src/content/` 디렉토리에 콘텐츠 항목별로 저장되고(`meta.json` + locale별 본문 파일), Admin 대시보드를 통해 편집·관리된다.

현재 상태:
- Demo, Documentation, News 콘텐츠의 Admin 편집 기능은 구현되어 있음
- Admin 라우팅·캐싱·삭제·에디터 dirty-state 등 주요 버그 수정 완료 (2026-04-15)
- 레거시 `content-state.json` 기반 state 레이어 제거 완료 (2026-04-16, #19) — 콘텐츠 조회/저장 흐름이 authored 파일 기준으로 단순화됨
- Stage 미리보기 → Production 릴리즈 워크플로우가 없음
- Blog, Whitepaper 등 corp-web-contents의 콘텐츠가 이관되지 않음

---

## Phase 1 — 현황 파악 및 기능 완성

> **완료 기준**: CMS로 콘텐츠를 안전하게 작성·편집·게시할 수 있는 상태

### 1-1. 현재 CMS 구현 감사

⚠️ 부분 완료. Admin 주요 버그가 수정되었으나 Blog·Whitepaper·Webinar 에디터 검증은 미수행.

- [x] Admin 라우팅·캐싱·삭제·에디터 dirty-state 버그 수정
- [x] Demo, Documentation, News CRUD 동작 확인
- [ ] Blog, Whitepaper, Webinar 에디터 동작 검증
- [ ] 파일 업로드 (`/api/admin/uploads`) 동작 확인
- [ ] SEO 메타데이터 저장 방식 전환 (현재 localStorage → 서버 영속화 필요)

### 1-2. SEO 서버 영속화

현재 SEO 상태가 브라우저 localStorage에만 저장된다. 서버 측 영속화로 전환한다.

- SEO 상태를 파일 또는 별도 JSON으로 서버에 저장
- Admin에서 수정한 SEO 설정이 빌드/배포 시 반영되도록 처리

### 1-3. 콘텐츠 타입 확장

현재 Admin이 지원하지 않는 콘텐츠 타입을 추가한다.

- Blog 관리 (목록, 작성, 편집, 삭제)
- Whitepaper 관리
- Webinar 관리

---

## Phase 2 — Stage/Production 워크플로우 구현

> **완료 기준**: Stage에서 작성한 콘텐츠를 미리보고, 승인 후 Production에 반영할 수 있는 상태

### 2-1. 환경 분리 전략

Stage와 Production 환경에서 콘텐츠 상태를 독립적으로 관리한다.

- Stage: 작성·편집 중인 콘텐츠 (draft 상태 포함)
- Production: 릴리즈 승인된 콘텐츠만 노출
- 각 환경별 콘텐츠 상태 관리 구조 설계 (콘텐츠는 `meta.json`·본문 파일 기준)

### 2-2. 릴리즈 워크플로우

Stage에서 검토 완료된 콘텐츠를 Production으로 승격하는 절차를 구현한다.

- Admin UI에서 "릴리즈" 액션 제공
- Stage → Production 콘텐츠 상태 전파 방식 결정 (파일 복사, API, Git 커밋 등)
- 릴리즈 이력 추적

### 2-3. 미리보기 기능

Stage 환경에서 실제 공개 페이지와 동일한 UI로 콘텐츠를 미리볼 수 있도록 한다.

- Admin 에디터에서 "미리보기" 버튼 → Stage URL로 이동
- 비공개(draft) 콘텐츠도 Stage에서는 렌더링

---

## Phase 3 — 안전한 이관 체계 구축

> **완료 기준**: 데이터 손실 없이 이관을 수행하고 롤백할 수 있는 체계 확보

### 3-1. 이관 전 백업 전략

- corp-web-contents 전체 스냅샷 보관
- `src/content/**` 파일 버전 이력 관리 방안 (Git 히스토리 기반, 필요 시 추가 백업)
- 이관 전/후 콘텐츠 수량·체크섬 비교 검증 도구

### 3-2. 이관 도구 개발

corp-web-contents의 MDX 콘텐츠를 corp-web-v2 CMS 포맷으로 변환하는 스크립트를 작성한다.

- MDX frontmatter → `meta.json` 변환
- MDX body → Tiptap JSON 또는 HTML 변환
- 미디어 에셋 경로 재매핑 (Vercel Blob → `public/`)
- 다국어(en/ko/ja) 콘텐츠 처리

### 3-3. 롤백 계획

이관 중 문제 발생 시 원복할 수 있는 절차를 정의한다.

- 이관 전 상태로 되돌리는 방법 문서화
- corp-web-contents는 이관 완료 검증 전까지 유지

---

## Phase 4 — 콘텐츠 이관 실행

> **완료 기준**: 모든 콘텐츠가 corp-web-v2 CMS로 이관되고 검증됨

이관 순서 (데이터 복잡도 낮은 순):

1. **News** — 이미 corp-web-v2에 구조 존재, 상태 정합성 확인
2. **Blog** — MDX 본문 변환 포함
3. **Whitepaper** — 파일 첨부 및 다운로드 연동 포함
4. **Webinar** — 메타데이터 + 미디어 에셋
5. **Documentation** — 볼륨이 크므로 카테고리별 분할 이관
6. **Demo/Use Cases** — 마지막 이관 (가장 많은 파일 수)

각 콘텐츠 타입 이관 후:
- Stage에서 렌더링 및 링크 검증
- SEO 메타데이터 보존 확인
- 이관 전 원본과 수량 비교

---

## Phase 5 — 검증 및 마무리

> **완료 기준**: corp-web-contents 의존성 제거 완료

- 전체 이관 후 누락 콘텐츠 없음 확인
- 이관된 콘텐츠 Production 릴리즈 승인
- corp-web-contents 역할 종료 선언 및 아카이브 처리
- CMS 운영 가이드 문서 업데이트

---

## 관련 문서

- [프로젝트 메인 계획](./2026-04-15-corp-web-v2-project-plan-design.md)
