---
name: pr
description: Use when 저장소 변경을 개인 GitHub 계정으로 Pull Request로 제출해야 할 때
---

# PR 생성 규칙

## 핵심 규칙

| 항목 | O | X |
|------|---|---|
| PR 생성 | 활성 개인 계정으로 `gh pr create` 직접 실행 | GitHub Actions 또는 Bot 토큰으로 생성 |
| PR 승인 | 사람이 수행 | Claude가 수행 |
| PR 병합 | 사람이 수행 | Claude가 수행 |
| PR 닫기 | 명시적 지시 있을 때만 | 임의로 닫기 |

## ⛔ 절대 금지

- `gh pr review --approve` — 코드 리뷰는 사람이 수행
- `gh pr merge` — 병합 결정은 사람이 수행
- `gh pr close` — 명시적 지시 없이 닫기 금지
- `gh workflow run`으로 PR 생성 — `github-actions[bot]` 등 Bot 작성자가 되므로 금지

## 수행 절차

### 1. 개인 계정 확인 (필수)

로컬 GitHub CLI에서 현재 활성화된 계정을 확인한다.

```bash
gh auth status
gh api user --jq '{login: .login, type: .type}'
```

판정:
- 의도한 개인 계정이며 `type`이 `User` → 계속 진행
- 인증되지 않았거나 다른 계정 또는 Bot 계정 → **PR 생성 중단**, 사용자가 계정을 인증·전환한 뒤 재시도

토큰 값은 출력하거나 PR 본문과 로그에 기록하지 않는다.

### 2. Scope Gate (필수)

PR 생성 전 base 대비 변경 범위를 반드시 검증한다.

```bash
git fetch origin --prune

# 커밋 범위 확인
git log --oneline origin/main..HEAD

# 파일 범위 확인
git diff --name-status origin/main...HEAD
```

판정:
- 의도한 커밋/파일만 포함 → 계속 진행
- 무관한 커밋/파일 포함 → **PR 생성 중단**, 범위 수정 후 재시도

### 3. 1차 구현 커밋 및 푸시

PR은 1차 구현이 완료되면 로컬 전체 검증 전에 먼저 생성한다.

```bash
git add <files>
git commit -m "<type>: <subject>"
git push -u origin <branch>
```

### 4. PR 직접 생성

활성화된 개인 계정 권한으로 `gh pr create`를 직접 실행한다.

```bash
gh pr create \
  --base main \
  --head "<branch>" \
  --title "<type>: <subject>" \
  --body "$(cat <<'EOF'
## Summary
- <변경 내용 요약>

## Test plan
- [ ] <테스트 항목>
EOF
)"
```

PR 생성 직후 URL과 작성자를 확인한다.

```bash
gh pr view "<branch>" \
  --json author,url \
  --jq '{url: .url, author: .author.login}'
```

`author`가 1단계에서 확인한 개인 계정과 다르면 이후 작업을 중단하고 사용자에게 알린다.

### 5. 로컬 검증 및 후속 푸시

```bash
npm run typecheck
npm run test:run
```

모든 검증이 통과해야 한다. 코드 변경이 포함된 PR은 다음을 확인한다:

| 변경 유형 | 필요한 테스트 |
|-----------|--------------|
| 새 함수·유틸리티 | 해당 파일의 유닛 테스트 |
| 새 API 라우트 | Mock 기반 통합 테스트 |
| 새 컴포넌트 | 렌더링·인터랙션 테스트 |
| 기존 로직 변경 | 영향받는 테스트 수정 |

검증 과정에서 수정한 사항은 별도 커밋으로 작성해 같은 PR에 푸시한다.

```bash
git add <files>
git commit -m "<type>: <검증 후 수정 내용>"
git push
```

### 6. GitHub Checks와 Vercel Preview 확인

PR이 생성되면 Vercel이 자동으로 Preview URL을 발급한다.

```bash
gh pr checks <pr-number>
```

Preview URL은 PR 댓글에서 확인한다.

## 커밋 메시지 type

| Type | 설명 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `refactor` | 리팩토링 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드·설정 변경 |

## PR 수정 (커밋 추가 후)

```bash
git push origin <branch>

gh pr edit <pr-number> \
  --title "..." \
  --body "..."
```

## 체크리스트

- [ ] main 브랜치가 아닌지 확인
- [ ] `gh auth status`, `gh api user` — 활성 개인 계정 확인
- [ ] `git log --oneline origin/main..HEAD` — 의도한 커밋만 포함
- [ ] `git diff --name-status origin/main...HEAD` — 의도한 파일만 포함
- [ ] 1차 구현 커밋과 push 후 `gh pr create`로 직접 PR 생성
- [ ] `gh pr view --json author,url` — 개인 계정 작성자와 URL 확인
- [ ] `npm run typecheck` — 타입 검사 통과
- [ ] `npm run test:run` — 모든 테스트 통과
- [ ] 코드 변경에 대응하는 테스트 작성 완료
- [ ] 검증 후 수정 사항을 별도 커밋으로 push

## 관련 스킬

- [branch](../branch/SKILL.md) — 브랜치 생성
- [worktree](../worktree/SKILL.md) — 격리 작업 환경
