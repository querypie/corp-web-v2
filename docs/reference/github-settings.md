# GitHub 저장소 설정

**최종 업데이트**: 2026-04-16

corp-web-v2의 CI 워크플로우 및 GitHub 저장소 보호 설정을 기술한다.

---

## CI 워크플로우

파일: `.github/workflows/ci.yml`  
트리거: `main` 브랜치를 대상으로 하는 PR open/sync

| 잡 ID | 표시 이름 | 실행 명령 |
|-------|-----------|-----------|
| `validate-next-build` | Validate Next Build | `npm run build` |
| `validate-typecheck` | Validate Typecheck | `npm run typecheck` |
| `validate-test` | Validate Test | `npm run test:run` |

> `validate-lint` 잡은 lint 스크립트 구현 전까지 주석 처리 상태이다.

---

## 브랜치 보호 (main)

Ruleset 방식으로 관리한다. Classic branch protection은 사용하지 않는다.

**Ruleset 이름**: `main-branch-protection`  
**대상**: `refs/heads/main`

### 적용 규칙

| 규칙 | 설명 |
|------|------|
| `deletion` | main 브랜치 삭제 차단 |
| `non_fast_forward` | force push 차단 |
| `pull_request` | PR 없이 직접 push 차단 |
| `required_status_checks` | 아래 CI 잡 3개 통과 필수, 브랜치 최신 상태 요구 (`strict: true`) |

**Required status checks**

- `Validate Next Build`
- `Validate Typecheck`
- `Validate Test`

### 관리자 bypass

| 항목 | 설정 |
|------|------|
| Bypass 대상 | Organization Admin |
| Bypass 모드 | `pull_request` — PR UI에서만 명시적 bypass 버튼 노출 |
| CLI bypass | 차단 (`gh pr merge` 등 API 경유 우회 불가) |

> bypass 모드가 `pull_request`이므로, CI 실패 시 관리자는 GitHub PR 화면에서 명시적인 "bypass rules and merge" 버튼을 통해서만 강제 병합할 수 있다.

---

## 설정 변경 방법

Ruleset은 GitHub API 또는 웹 UI(`Settings → Rules → Rulesets`)에서 수정한다.

```bash
# 현재 ruleset 조회
gh api repos/querypie/corp-web-v2/rulesets

# ruleset 상세 조회 (ID: 15091161)
gh api repos/querypie/corp-web-v2/rulesets/15091161
```

새 status check 잡을 추가할 경우, ruleset의 `required_status_checks` 배열에 잡 표시 이름을 추가해야 한다. CI 워크플로우 잡의 `name:` 필드 값과 일치해야 한다.
