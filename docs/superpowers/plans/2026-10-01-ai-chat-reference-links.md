# AI Chat 참고자료 링크 표기 개선 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI Chat 참고자료가 문서 제목과 출처 FQDN을 함께 표시하고, 제목이 없는 URL은 전체 URL로 표시되게 한다.

**Architecture:** Hermes 응답 파서가 Markdown 제목을 보존하고 일반 URL을 정규화된 전체 URL로 보존한다. `AiChatPanel`은 source title이 URL인지 판별해 URL이면 한 줄로, 제목이면 제목과 hostname을 같은 링크 안에 두 줄로 렌더링한다. 기존 URL 검증·중복 제거·8개 제한·locale href 변환은 유지한다.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.8, Vitest, Testing Library, Tailwind utilities.

---

## Chunk 1: Source extraction contract

**Files:**
- Modify: `src/features/ai-chat/answer.server.test.ts:10-25`
- Modify: `src/features/ai-chat/reply.ts:9-45`

- [ ] **Step 1: Write failing parser assertions**

  Update the existing parser test so a plain URL source expects its normalized full URL instead of `www.querypie.com`. Use a raw URL without a trailing slash (for example `https://docs.querypie.com`) and expect the normalized `https://docs.querypie.com/` value. Add a case for an empty Markdown label and assert its source title is the normalized full URL.

- [ ] **Step 2: Run parser tests and verify RED**

  Run: `npm run test:run -- src/features/ai-chat/answer.server.test.ts`

  Expected: the source extraction assertion fails because current `extractHermesSources` converts URL-like titles to a hostname.

- [ ] **Step 3: Implement the minimal parser fix**

  Change `markdownLinkPattern` to accept an empty label. Remove the `title.startsWith("http")` hostname replacement in `extractHermesSources`. In `findHermesLinks`, use the normalized URL (`url`) both as the fallback for empty Markdown labels and as the title of plain URLs. Keep protocol validation, punctuation trimming, duplicate filtering, and the eight-source cap unchanged.

- [ ] **Step 4: Run parser tests and verify GREEN**

  Run: `npm run test:run -- src/features/ai-chat/answer.server.test.ts`

  Expected: all tests in the file pass.

- [ ] **Step 5: Commit the parser contract**

  ```bash
  git add src/features/ai-chat/reply.ts src/features/ai-chat/answer.server.test.ts
  git commit -m "fix: AI Chat 출처 URL 전체 표시 보존"
  ```

## Chunk 2: Reference list presentation

**Files:**
- Modify: `src/components/site/ai-chat/AiChatPanel.tsx:200-206`
- Modify: `src/components/site/ai-chat/AiChatPanel.test.tsx:39-68`

- [ ] **Step 1: Write failing UI assertions**

  Extend the reference response fixture with a titled source and assert its link accessible name contains both the document title and `aip-docs.app.querypie.com`. Assert the link retains `target="_blank"` and `rel="noopener noreferrer"`. Add a response with a URL-only source and assert the full URL remains the accessible name. Keep the existing Markdown body link test to ensure answer-body rendering remains unchanged.

- [ ] **Step 2: Run the panel test and verify RED**

  Run: `npm run test:run -- src/components/site/ai-chat/AiChatPanel.test.tsx`

  Expected: the new title-plus-FQDN assertion fails because the panel currently renders only `source.title`.

- [ ] **Step 3: Implement the minimal UI change**

  Use the exact identity check `source.title === source.url` in `AiChatPanel`. When it is true, render only that full URL. Otherwise render the title and `new URL(source.url).hostname` as a muted second line within the same anchor. Preserve the existing href transformation, link security attributes, key, wrapping utility, and accessible text order.

- [ ] **Step 4: Run the panel test and verify GREEN**

  Run: `npm run test:run -- src/components/site/ai-chat/AiChatPanel.test.tsx`

  Expected: all panel tests pass, including the new reference display assertions.

- [ ] **Step 5: Commit the UI change**

  ```bash
  git add src/components/site/ai-chat/AiChatPanel.tsx src/components/site/ai-chat/AiChatPanel.test.tsx
  git commit -m "fix: AI Chat 참고자료 제목과 도메인 표시"
  ```

## Chunk 3: Scope, PR, and full verification

**Files:**
- No additional source files expected.

- [ ] **Step 1: Inspect the implementation diff and pass the PR scope gate**

  Run: `git diff --check`, `git status --short`, `git fetch origin --prune`, `git log --oneline origin/main..HEAD`, and `git diff --name-status origin/main...HEAD`.

  Expected: only the approved design/plan docs and the two AI Chat source/test pairs are changed.

- [ ] **Step 2: Run targeted tests**

  Run: `npm run test:run -- src/features/ai-chat/answer.server.test.ts src/components/site/ai-chat/AiChatPanel.test.tsx`

  Expected: all targeted tests pass.

- [ ] **Step 3: Create the first implementation PR**

  Push the branch and invoke the repository workflow, not `gh pr create` directly:

  ```bash
  git push -u origin fix/ai-chat-reference-links
  gh workflow run create-pr.yml \
    -f branch="fix/ai-chat-reference-links" \
    -f title="fix: AI Chat 참고자료 링크 표기 개선" \
    -f body="$(cat <<'EOF'
  ## Summary
  - AI Chat 참고자료에서 문서 제목과 출처 FQDN을 함께 표시
  - 제목이 없는 URL은 FQDN 축약 없이 전체 URL 표시

  ## Test plan
  - [ ] `npm run test:run -- src/features/ai-chat/answer.server.test.ts src/components/site/ai-chat/AiChatPanel.test.tsx`
  EOF
  )"
  ```

  Poll `gh pr list --head fix/ai-chat-reference-links --json number,url` until the workflow-created PR appears, then record its URL and number before starting the full local verification.

- [ ] **Step 4: Run full local verification**

  Run sequentially: `npm run typecheck`, `npm run test:run`, and `npm run build` (with no dev server running).

  Expected: each command exits 0. If verification finds an issue, fix it in a new commit, rerun the relevant checks, and push the follow-up commit to the existing PR.

- [ ] **Step 5: Reconfirm PR scope and status**

  Run `git fetch origin --prune`, `git log --oneline origin/main..HEAD`, `git diff --name-status origin/main...HEAD`, then query the PR URL and checks with `gh pr list --head fix/ai-chat-reference-links --json number,url` and `gh pr checks <number>`.
