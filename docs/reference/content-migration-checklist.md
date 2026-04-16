# 콘텐츠 이관 검증 체크리스트

**기준 사이트맵**: `https://www.querypie.com/sitemap.xml` (조회일: 2026-04-16)  
**검증 대상**: corp-web-v2 (`src/content/`) 및 페이지 라우팅

범례: ✅ 이관 완료 | ❌ 누락 | ⚠️ 슬러그 불일치 | ❓ 확인 필요

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
| `/features/documentation/acp-introduction-download` | `/[locale]/features/documentation/[slug]` | ❓ 콘텐츠 항목 없음 (아래 참고) |
| `/features/documentation/aip-introduction-download` | `src/content/documentation/introduction/cnt_000001` | ✅ |
| `/features/documentation/glossary-items` | `src/content/documentation/glossary/cnt_000170` | ✅ |
| `/features/documentation/querypie-install-guide` | `src/content/documentation/manuals/cnt_000001` | ✅ |

> **주의**: `acp-introduction-download`에 해당하는 CMS 콘텐츠 항목이 없음. 라우팅이 `[slug]` 동적 경로를 통해 처리되는지, 혹은 별도 콘텐츠 항목이 필요한지 확인 필요.

---

## 2. Demo — ACP Features (26개 URL → 23개 고유 슬러그)

> 구 사이트에서 동일 슬러그가 여러 번 등장: `review-audit-logs` (#7, #15, #25), `grant-permissions-users` (#13, #23)  
> v2에서는 각각 1개 항목으로 통합됨. 의도적 통합인지 확인 필요.

| # | 구 슬러그 | v2 콘텐츠 ID | 상태 |
|---|-----------|-------------|------|
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

## 7. Documentation — White Paper (26개)

> **사이트맵 주의**: 조회 시 #3~#9 항목이 잘려서 로드되지 않음. 해당 항목의 슬러그는 기존 사이트에서 직접 확인 필요.
> 또한 #24, #25가 동일 슬러그(`ai-tranformation-japan`)로 등록되어 있음.

| # | 구 슬러그 | v2 슬러그 | 상태 |
|---|-----------|-----------|------|
| 1 | `personal-data-identification-analysis-ai` | 동일 | ✅ |
| 2 | `shell-native-command-control-ssh-proxy-architecture` | 동일 | ✅ |
| 3 | ❓ 확인 필요 | — | ❓ |
| 4 | ❓ 확인 필요 | — | ❓ |
| 5 | ❓ 확인 필요 | — | ❓ |
| 6 | ❓ 확인 필요 | — | ❓ |
| 7 | ❓ 확인 필요 | — | ❓ |
| 8 | ❓ 확인 필요 | — | ❓ |
| 9 | ❓ 확인 필요 | — | ❓ |
| 10 | `querypie-devsecops-pipeline` | 동일 | ✅ |
| 11 | `efficient-audit-log-management` | 동일 | ✅ |
| 12 | `querypie-grpc-dast-security` | 동일 | ✅ |
| 13 | `seamless-ssh-connection` | 동일 | ✅ |
| 14 | `reverse-tunneling-jumphost-solution` | 동일 | ✅ |
| 15 | `redefining-pam-for-the-mcp-era` | 동일 | ✅ |
| 16 | `next-step-mcp-pam` | 동일 | ✅ |
| 17 | `ai-autonomous-access-control` | 동일 | ✅ |
| 18 | `uncovering-mcp-security` | 동일 | ✅ |
| 19 | `google-agentspace-vs-querypie-mcp-pam` | 동일 | ✅ |
| 20 | `beyond-mcp-to-mcps` | 동일 | ✅ |
| 21 | `welcome-to-the-age-of-agentsecops` | 동일 | ✅ |
| 22 | `your-architect-vs-ai-agents` | 동일 | ✅ |
| 23 | `rag-security-querypie-builds-the-bridge` | `rag-security-querypie-builds-the-bridge--23` | ⚠️ 슬러그 다름 |
| 24 | `ai-tranformation-japan` (+ `/download`) | `ai-tranformation-japan` | ✅ |
| 25 | `ai-tranformation-japan` (+ `/download`, #24와 동일 슬러그) | — | ❓ 구 사이트 중복 슬러그 |
| 26 | `llm-evaluation-agentic-rag-part1` | 동일 | ✅ |

**v2 추가 항목** (구 사이트맵에 없는 신규 콘텐츠 또는 #3~9):

| v2 슬러그 | 비고 |
|-----------|------|
| `saas-end-or-evolution` | 신규 또는 #3~9 중 하나 |
| `ai-agent-guardrails-governance-2026` | 신규 또는 #3~9 중 하나 |
| `ai-agent-guardrails-governance-2026-implementation` | 신규 또는 #3~9 중 하나 |
| `llm-evaluation-agentic-rag-part2` | 신규 또는 #3~9 중 하나 |
| `kubernetes-access-control` | 신규 또는 #3~9 중 하나 |
| `pac-policy-as-code` | 신규 또는 #3~9 중 하나 |
| `parsing-sql-query-structural-interface` | 신규 또는 #3~9 중 하나 |
| `penetration-testing-standard` | 신규 또는 #3~9 중 하나 |
| `preventing-command-bypass` | 신규 또는 #3~9 중 하나 |
| `secure-login-token-management` | 신규 또는 #3~9 중 하나 |
| `transaction-free-change-data-capture-system` | 신규 또는 #3~9 중 하나 |
| `saas-end-or-evolution-2` (hidden) | 신규 또는 #3~9 중 하나 |

---

## 요약 및 후속 조치

### 이관 누락 (즉시 확인 필요)

| 항목 | 내용 |
|------|------|
| ❌ Webinar #27 | `air-company-ai-agent-security-webinar` — v2에 없음 |
| ❓ White Paper #3~9 | 사이트맵 조회 시 잘려서 슬러그 미확인 |
| ❓ `acp-introduction-download` | CMS 콘텐츠 항목 없음, 라우팅 처리 방식 확인 필요 |

### 슬러그 불일치 (URL 리다이렉트 필요 여부 검토)

| 구 슬러그 | v2 슬러그 |
|-----------|-----------|
| `rag-security-querypie-builds-the-bridge` | `rag-security-querypie-builds-the-bridge--23` |

### 정리 필요 항목

| 항목 | 내용 |
|------|------|
| `test-영어` (blog) | 테스트 항목, 삭제 필요 |
| `google-oauth-demo-2` (aip-features, hidden) | 용도 확인 후 삭제 또는 유지 |
| `saas-end-or-evolution-2` (white-paper, hidden) | 용도 확인 후 삭제 또는 유지 |

### White Paper #3~9 수동 확인 방법

```
https://www.querypie.com/features/documentation/white-paper/3/{slug}
https://www.querypie.com/features/documentation/white-paper/4/{slug}
...
https://www.querypie.com/features/documentation/white-paper/9/{slug}
```

브라우저에서 각 URL 접근 후 슬러그 확인 → v2 white-paper 목록과 대조.
