# 개인 GitHub 계정 PR 생성 전환 설계

## 배경

현재 `.github/workflows/create-pr.yml`은 `GITHUB_TOKEN`으로 `gh pr create`를 실행하므로 PR 작성자가 `github-actions[bot]`으로 기록된다. `.claude/skills/pr/SKILL.md`도 이 workflow 실행을 필수 경로로 안내하고 있다.

로컬 GitHub CLI는 개인 계정 `jk-kim0`으로 인증되어 있다. PR 생성 주체를 개인 계정으로 일관되게 유지하려면 workflow를 우회하는 수준이 아니라 Bot 생성 경로 자체를 제거하고, 로컬 `gh` 인증을 사용하도록 작업 절차를 바꿔야 한다.

## 목표

- Bot 권한으로 PR을 만드는 `create-pr.yml` workflow를 삭제한다.
- PR 스킬이 활성화된 개인 `gh` 계정을 확인한 뒤 `gh pr create`를 직접 실행하도록 한다.
- 생성된 PR의 URL뿐 아니라 작성자 계정도 확인한다.
- 삭제된 workflow가 배포 문서에 남지 않도록 한다.

## 비목표

- PR 승인, 병합, 닫기 권한에 관한 기존 제한은 변경하지 않는다.
- CI와 Vercel 배포 workflow의 트리거 또는 권한은 변경하지 않는다.
- 개인 토큰을 GitHub Actions secret으로 추가하지 않는다.

## 설계

### Workflow

`.github/workflows/create-pr.yml`을 삭제한다. 이에 따라 `workflow_dispatch`와 저장소 `GITHUB_TOKEN`을 이용해 `github-actions[bot]` 명의로 PR을 생성하는 진입점이 사라진다.

### PR 스킬

`.claude/skills/pr/SKILL.md`의 생성 절차를 다음 순서로 변경한다.

1. `gh auth status`로 GitHub CLI 인증 상태를 확인한다.
2. `gh api user`로 실제 PR 작성자가 될 활성 계정의 login과 `User` 유형을 확인한다.
3. scope gate를 거쳐 1차 구현을 커밋하고 브랜치를 push한다.
4. `gh pr create --base main --head <branch>`로 PR을 직접 생성한다.
5. `gh pr view --json author,url`로 URL과 `author.login`을 확인한다.
6. 로컬 전체 검증을 수행하고 수정 사항이 있으면 별도 커밋으로 push한다.

인증이 없거나 의도한 개인 계정이 아니면 PR 생성을 중단하고 계정 전환을 요청한다. 토큰 값은 출력하거나 문서에 기록하지 않는다.

### 문서

`docs/reference/vercel-deployment.md`의 GitHub Actions 파일 목록에서 삭제된 `create-pr.yml` 항목을 제거한다. 다른 workflow 설명은 그대로 유지한다.

## 검증

- 활성 workflow·PR 스킬·운영 참고 문서에 Bot PR 생성 경로나 안내가 남지 않았는지 검색한다. 설계·계획 문서의 제거 대상 설명은 검색 결과에서 제외한다.
- PR 스킬에 인증 계정 확인, 직접 생성, 작성자 확인 절차가 모두 있는지 검토한다.
- `npm run typecheck`와 `npm run test:run`을 순차 실행한다.
- 실제 PR을 만든 뒤 `author.login`이 현재 활성 개인 계정과 일치하는지 확인한다.
