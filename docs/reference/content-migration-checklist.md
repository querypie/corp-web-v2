# 콘텐츠 이관 검증 체크리스트

**기준 사이트맵**: `https://www.querypie.com/sitemap.xml` (조회일: 2026-04-16)  
**검증 대상**: corp-web-v2 (`src/content/`) 및 페이지 라우팅

범례: ✅ 이관 완료 | ❌ 누락 | ⚠️ 슬러그 불일치 | ❓ 확인 필요

## MDX 마이그레이션 파일 규칙

- `src/content/mdx/blog/<id>/<locale>.mdx`와 `src/content/mdx/white-papers/<id>/<locale>.mdx`는 corp-web-v2의 저장 구조다.
- 원본 `corp-web-contents/pages/features/documentation/{blog,white-paper}/<id>/<slug>/<locale>/content.mdx` 경로의 `<slug>`는 번역 공통 canonical slug로 보고, 각 locale MDX frontmatter에 명시적으로 `slug` 필드로 기록한다.
- 따라서 v2 MDX는 디렉터리명으로는 콘텐츠 ID를 유지하고, URL/원본 경로 식별에 필요한 slug는 frontmatter에서 읽을 수 있어야 한다.

---

## 1. 정적 페이지

| 구 URL | v2 라우팅 | 상태 |
|--------|-----------|------|
| `/` | `/[locale]/page.tsx` | ✅ |
| `/company/about-us` | `/[locale]/company/about-us/` | ✅ |
| `/company/certifications` | `/[locale]/company/certifications/` | ✅ |
| `/company/contact-us` | `/[locale]/company/contact-us/` | ✅ |
| `/company/news` | `/[locale]/company/news/` | ✅ |
| `/cookie-preference` | `/[locale]/cookie-preference/` | ✅ |
| `/eula` | `/[locale]/eula/` | ✅ |
| `/features/demo` | `/[locale]/features/demo/` | ✅ |
| `/features/documentation` | `/[locale]/features/documentation/` | ✅ |
| `/features/documentation/acp-introduction-download` | `/[locale]/features/documentation/[slug]` | ❓ CMS 콘텐츠 항목 확인 필요 |
| `/features/documentation/aip-introduction-download` | `src/content/documentation/introduction/cnt_000001` | ✅ |
| `/features/documentation/glossary-items` | `src/content/documentation/glossary/cnt_000170` | ✅ |
| `/features/documentation/querypie-install-guide` | `src/content/documentation/manuals/cnt_000001` | ✅ |

> **주의**: `acp-introduction-download`는 공개 sitemap에는 존재하지만, `src/content/documentation/introduction/`에서 대응 CMS 콘텐츠 항목을 찾지 못했습니다. 라우팅이 `[slug]` 동적 경로를 통해 처리되는지, 혹은 별도 콘텐츠 항목이 필요한지 확인 필요.

---

## 2. Demo — ACP Features (26개 URL → 23개 고유 슬러그)

> 구 사이트에서 동일 슬러그가 여러 번 등장: `review-audit-logs` (#7, #15, #25), `grant-permissions-users` (#13, #23)  
> v2에서는 각각 1개 항목으로 통합됨. 의도적 통합인지 확인 필요.

| # | 구 슬러그 | 상태 |
|---|-----------|------|
| 1 | `integrating-querypie-with-redash` | ✅ |
| 2 | `integrating-querypie-with-metabase` | ✅ |
| 3 | `integrating-querypie-with-tableau` | ✅ |
| 4 | `connect-kubernetes-agent` | ✅ |
| 5 | `grant-roles-users` | ✅ |
| 6 | `register-kubernetes-protect` | ✅ |
| 7 | `review-audit-logs` | ✅ (통합) |
| 8 | `connect-servers-agent` | ✅ |
| 9 | `submit-role-access-workflow` | ✅ |
| 10 | `submit-server-access-workflow` | ✅ |
| 11 | `use-web-terminal` | ✅ |
| 12 | `grant-permissions-users-2` | ✅ |
| 13 | `grant-permissions-users` | ✅ (통합) |
| 14 | `register-servers` | ✅ |
| 15 | `review-audit-logs` | ✅ (통합, #7과 동일 슬러그) |
| 16 | `connect-database-querypie-agent` | ✅ |
| 17 | `submit-sql-export-workflow` | ✅ |
| 18 | `submit-sql-request-workflow` | ✅ |
| 19 | `submit-db-access-workflow` | ✅ |
| 20 | `apply-data-masking-policies` | ✅ |
| 21 | `apply-data-access-policies` | ✅ |
| 22 | `use-web-editor` | ✅ |
| 23 | `grant-permissions-users` | ✅ (통합, #13과 동일 슬러그) |
| 24 | `register-databases` | ✅ |
| 25 | `review-audit-logs` | ✅ (통합, #7, #15와 동일 슬러그) |
| 26 | `integrate-sso-with-okta` | ✅ |

**결과**: 26개 URL → 23개 고유 슬러그, 전체 이관 완료. status는 현재 전부 `hidden`.

---

## 3. Demo — AIP Features (1개)

| # | 구 슬러그 | v2 상태 |
|---|-----------|---------|
| 1 | `google-oauth-demo` | ✅ (published) |
| — | — | `google-oauth-demo-2` (v2 추가, hidden) |

---

## 4. Demo — Use Cases (29개)

| # | 구 슬러그 | 상태 |
|---|-----------|------|
| 1 | `allganize-changsu-lee` | ✅ |
| 2 | `lovo-ai-tom-lee` | ✅ |
| 3 | `air-company-mori-takeshi` | ✅ |
| 4 | `superb-ai-hyun-kim` | ✅ |
| 5 | `lg-uplus-daniel-ku` | ✅ |
| 6 | `querypie-ai-agent-demo` | ✅ |
| 7 | `data-analytics-agent` | ✅ |
| 8 | `data-analytics-agent-2` | ✅ |
| 9 | `server-access-agent` | ✅ |
| 10 | `kubernetes-manager-agent` | ✅ |
| 11 | `security-audit-agent` | ✅ |
| 12 | `work-collaboration-agent` | ✅ |
| 13 | `m365-ai-agent` | ✅ |
| 14 | `credit-check-ai-agent` | ✅ |
| 15 | `factory-iot-ai-agent` | ✅ |
| 16 | `dev-insight-ai-agent` | ✅ |
| 17 | `aircraft-maintenance-ai-agent` | ✅ |
| 18 | `baggage-operations-ai-agent` | ✅ |
| 19 | `aircrew-scheduler-ai-agent` | ✅ |
| 20 | `military-hr-ai-agent` | ✅ |
| 21 | `incident-mgmt-ai-agent` | ✅ |
| 22 | `aws-log-analytics-agent` | ✅ |
| 23 | `aws-inspector-ai-agent` | ✅ |
| 24 | `aws-solutions-architect-ai-agent` | ✅ |
| 25 | `portfolio-insight-ai-agent` | ✅ |
| 26 | `investment-analyst-ai-agent` | ✅ |
| 27 | `quotation-ai-agent` | ✅ |
| 28 | `quotation-analyze-ai-agent` | ✅ |
| 29 | `seo-analyst` | ✅ |

**결과**: 29/29 전체 이관 완료.

---

## 5. Demo — Webinars (27개)

| # | 구 슬러그 | 상태 |
|---|-----------|------|
| 1 | `cloud-certification-shortest-path` | ✅ |
| 2 | `okta-paloalto-querypie-webinar` | ✅ |
| 3 | `device-security-mdm-kandji` | ✅ |
| 4 | `flex-querypie-secrets` | ✅ |
| 5 | `ztna-security-prisma-access` | ✅ |
| 6 | `querypie-side-kick-teaser-ko` | ✅ |
| 7 | `querypie-integrations-scim-slack-vault-ko` | ✅ |
| 8 | `querypie-integrations-scim-slack-vault-ja` | ✅ |
| 9 | `querypie-databases-nosql-ledger-ko` | ✅ |
| 10 | `querypie-databases-nosql-ledger-ja` | ✅ |
| 11 | `querypie-server-management-ko` | ✅ |
| 12 | `querypie-server-management-ja` | ✅ |
| 13 | `querypie-kubernetes-management-ko` | ✅ |
| 14 | `querypie-kubernetes-management-ja` | ✅ |
| 15 | `querypie-japan-webinar-security` | ✅ |
| 16 | `air-company-querypie-zerotrust-webinar` | ✅ |
| 17 | `findy-querypie-mcp-webinar` | ✅ |
| 18 | `air-company-querypie-mcp-webinar` | ✅ (통합) |
| 19 | `air-company-querypie-mcp-webinar` | ✅ (통합, #18과 동일 슬러그) |
| 20 | `air-company-querypie-mcp-webinar` | ✅ (통합, #18, #19와 동일 슬러그) |
| 21 | `air-company-querypie-ai-webinar` | ✅ (통합) |
| 22 | `air-company-querypie-mcp-webinar` | ✅ (통합, 4번째) |
| 23 | `air-company-querypie-ai-webinar` | ✅ (통합, #21과 동일 슬러그) |
| 24 | `air-company-querypie-ai-webinar` | ✅ (통합, 3번째) |
| 25 | `air-company-querypie-ai-usecase-webinar` | ✅ (통합) |
| 26 | `air-company-querypie-ai-usecase-webinar` | ✅ (통합, #25와 동일 슬러그) |
| 27 | `air-company-ai-agent-security-webinar` | ❌ v2에 없음 |

**결과**: 27개 중 26개 이관 완료. **`air-company-ai-agent-security-webinar` (#27) 누락**.

---

## 6. Documentation — Blog (29개)

| # | 구 슬러그 | 상태 |
|---|-----------|------|
| 1 | `agentless-philosophy` | ✅ |
| 2 | `querypie-cracking-global-markets` | ✅ |
| 3 | `querypie-team-success-secrets` | ✅ |
| 4 | `multi-cloud-kubernetes-access-control` | ✅ |
| 5 | `technology-humanity-convergence` | ✅ |
| 6 | `integration-connection-paradigm` | ✅ |
| 7 | `command-bypass-prevention-control` | ✅ |
| 8 | `querypie-product-managers` | ✅ |
| 9 | `data-discovery-privacy-management` | ✅ |
| 10 | `customer-centric-tpm-life` | ✅ |
| 11 | `seamless-figma-querypie-collaboration` | ✅ |
| 12 | `internal-data-leaks` | ✅ |
| 13 | `what-businesses-can-learn-from-sentiment-analysis` | ✅ |
| 14 | `data-observability` | ✅ |
| 15 | `zero-trust-security` | ✅ |
| 16 | `healthcare-data-security` | ✅ |
| 17 | `privileged-access-management-pam` | ✅ |
| 18 | `why-is-sso-important` | ✅ |
| 19 | `optimize-ec2-costs` | ✅ |
| 20 | `nextjs-server-action-security` | ✅ |
| 21 | `why-we-need-ai-red-teaming` | ✅ |
| 22 | `ai-agent-security-replit-case` | ✅ |
| 23 | `querypie-payroll-partnership` | ✅ |
| 24 | `top-pam-solutions` | ✅ |
| 25 | `terrasky-mitoco-buddy` | ✅ |
| 26 | `mitoco-buddy-release` | ✅ |
| 27 | `shadow-ai-risk-cxo-countermeasures` | ✅ |
| 28 | `ai-security-threat-map-2026-cxo` | ✅ |
| 29 | `ai-attack-tool-firewall-breach-data-protection` | ✅ |

**결과**: 29/29 전체 이관 완료.  
v2 추가 항목: `test-영어` (테스트 항목, 삭제 필요)

---

## 7. Documentation — White Paper (30개)

> **사이트맵 기준**: 현재 공개 sitemap에는 30개 URL이 확인됩니다.
> #24와 #25는 동일 슬러그(`ai-tranformation-japan`)를 공유하며, 각각 `/download` 경로도 존재합니다.
> #23은 public URL slug와 CMS 저장 ID가 다릅니다.

| # | 구 슬러그 | v2 슬러그 | 상태 |
|---|-----------|-----------|------|
| 1 | `personal-data-identification-analysis-ai` | `1/personal-data-identification-analysis-ai` | ✅ |
| 2 | `shell-native-command-control-ssh-proxy-architecture` | `2/shell-native-command-control-ssh-proxy-architecture` | ✅ |
| 3 | `parsing-sql-query-structural-interface` | `3/parsing-sql-query-structural-interface` | ✅ |
| 4 | `transaction-free-change-data-capture-system` | `4/transaction-free-change-data-capture-system` | ✅ |
| 5 | `preventing-command-bypass` | `5/preventing-command-bypass` | ✅ |
| 6 | `kubernetes-access-control` | `6/kubernetes-access-control` | ✅ |
| 7 | `pac-policy-as-code` | `7/pac-policy-as-code` | ✅ |
| 8 | `secure-login-token-management` | `8/secure-login-token-management` | ✅ |
| 9 | `penetration-testing-standard` | `9/penetration-testing-standard` | ✅ |
| 10 | `querypie-devsecops-pipeline` | `10/querypie-devsecops-pipeline` | ✅ |
| 11 | `efficient-audit-log-management` | `11/efficient-audit-log-management` | ✅ |
| 12 | `querypie-grpc-dast-security` | `12/querypie-grpc-dast-security` | ✅ |
| 13 | `seamless-ssh-connection` | `13/seamless-ssh-connection` | ✅ |
| 14 | `reverse-tunneling-jumphost-solution` | `14/reverse-tunneling-jumphost-solution` | ✅ |
| 15 | `redefining-pam-for-the-mcp-era` | `15/redefining-pam-for-the-mcp-era` | ✅ |
| 16 | `next-step-mcp-pam` | `16/next-step-mcp-pam` | ✅ |
| 17 | `ai-autonomous-access-control` | `17/ai-autonomous-access-control` | ✅ |
| 18 | `uncovering-mcp-security` | `18/uncovering-mcp-security` | ✅ |
| 19 | `google-agentspace-vs-querypie-mcp-pam` | `19/google-agentspace-vs-querypie-mcp-pam` | ✅ |
| 20 | `beyond-mcp-to-mcps` | `20/beyond-mcp-to-mcps` | ✅ |
| 21 | `welcome-to-the-age-of-agentsecops` | `21/welcome-to-the-age-of-agentsecops` | ✅ |
| 22 | `your-architect-vs-ai-agents` | `22/your-architect-vs-ai-agents` | ✅ |
| 23 | `rag-security-querypie-builds-the-bridge` | `23/rag-security-querypie-builds-the-bridge` | ⚠️ CMS 저장 ID는 `rag-security-querypie-builds-the-bridge--23` |
| 24 | `ai-tranformation-japan` (+ `/download`) | `24/ai-tranformation-japan` | ✅ |
| 25 | `ai-tranformation-japan` (+ `/download`, #24와 동일 슬러그) | `25/ai-tranformation-japan` | ✅ |
| 26 | `llm-evaluation-agentic-rag-part1` | `26/llm-evaluation-agentic-rag-part1` | ✅ |
| 27 | `llm-evaluation-agentic-rag-part2` | `27/llm-evaluation-agentic-rag-part2` | ✅ |
| 28 | `ai-agent-guardrails-governance-2026` | `28/ai-agent-guardrails-governance-2026` | ✅ |
| 29 | `ai-agent-guardrails-governance-2026-implementation` | `29/ai-agent-guardrails-governance-2026-implementation` | ✅ |
| 30 | `saas-end-or-evolution` (+ `/download`) | `30/saas-end-or-evolution` | ✅ |

**v2 추가 항목** (사이트맵에 없는 항목):

| v2 슬러그 | 비고 |
|-----------|------|
| `test-영어` | 테스트용 블로그 항목, 정리 필요 |
| `saas-end-or-evolution-2` (hidden) | 동일 제목의 hidden 중복 항목으로 보임 |

---

## 요약 및 후속 조치

### 이관 누락 (즉시 확인 필요)

| 항목 | 내용 |
|------|------|
| ❌ Webinar #27 | `air-company-ai-agent-security-webinar` — v2에 없음 |
| ❓ `acp-introduction-download` | 공개 sitemap에는 존재하지만, repo의 CMS 콘텐츠 항목은 아직 확인되지 않음 |

### 슬러그 불일치 (URL 리다이렉트 필요 여부 검토)

| 구 슬러그 | v2 슬러그 |
|-----------|-----------|
| `rag-security-querypie-builds-the-bridge` | `23/rag-security-querypie-builds-the-bridge` |
