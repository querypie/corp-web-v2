---
name: pr
description: 작업 완료 후 PR 생성 — scope 검증, 테스트 확인, GHA workflow로 PR 작성
tags: [git, pr, github, workflow]
---

# PR 생성 규칙

## 핵심 규칙

| 항목 | O | X |
|------|---|---|
| PR 생성 | `gh workflow run create-pr.yml` | `gh pr create` 직접 실행 |
| PR 승인 | 사람이 수행 | Claude가 수행 |
| PR 병합 | 사람이 수행 | Claude가 수행 |
| PR 닫기 | 명시적 지시 있을 때만 | 임의로 닫기 |

## ⛔ 절대 금지

- `gh pr review --approve` — 코드 리뷰는 사람이 수행
- `gh pr merge` — 병합 결정은 사람이 수행
- `gh pr close` — 명시적 지시 없이 닫기 금지

## 수행 절차

### 1. Scope Gate (필수)

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

### 2. 테스트 통과 확인

```bash
npm run test:run
```

모든 테스트가 통과해야 한다. 코드 변경이 포함된 PR은 다음을 확인한다:

| 변경 유형 | 필요한 테스트 |
|-----------|--------------|
| 새 함수·유틸리티 | 해당 파일의 유닛 테스트 |
| 새 API 라우트 | Mock 기반 통합 테스트 |
| 새 컴포넌트 | 렌더링·인터랙션 테스트 |
| 기존 로직 변경 | 영향받는 테스트 수정 |

### 3. 커밋 및 푸시

```bash
git add <files>
git commit -m "$(cat <<'EOF'
<type>: <subject>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push -u origin <branch>
```

### 4. PR 생성

```bash
gh workflow run create-pr.yml \
  -f branch="<branch>" \
  -f title="<type>: <subject>" \
  -f body="$(cat <<'EOF'
## Summary
- <변경 내용 요약>

## Test plan
- [ ] <테스트 항목>
EOF
)"
```

PR 생성 후 URL 확인:

```bash
sleep 5
gh pr list --head <branch> --json number,url --jq '.[0].url'
```

### 5. Vercel Preview 확인

PR이 생성되면 Vercel이 자동으로 Preview URL을 발급한다.

```bash
# PR에 달린 Vercel deployment 상태 확인
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
git push --force-with-lease origin <branch>

gh pr edit <pr-number> \
  --title "..." \
  --body "..."
```

## 체크리스트

- [ ] main 브랜치가 아닌지 확인
- [ ] `git log --oneline origin/main..HEAD` — 의도한 커밋만 포함
- [ ] `git diff --name-status origin/main...HEAD` — 의도한 파일만 포함
- [ ] `npm run test:run` — 모든 테스트 통과
- [ ] 코드 변경에 대응하는 테스트 작성 완료
- [ ] `gh workflow run create-pr.yml` 로 PR 생성 (직접 `gh pr create` 금지)

## 관련 스킬

- [branch](../branch/SKILL.md) — 브랜치 생성
- [worktree](../worktree/SKILL.md) — 격리 작업 환경
