# Blog inline image rename survey

- Scope: generic inline images referenced from `src/content/mdx/blog/**`
- Goal: identify semantic filenames and rename only high-confidence cases first
- Confidence rule: high = caption/alt/context together provide a stable meaning; low = not enough evidence yet

| Post ID | Current file | Recommended file | Confidence | Evidence |
| --- | --- | --- | --- | --- |
| 1 | `blog1-image-1.png` | `(keep generic for now)` | low | alt: Demonstration / context: In particular, for database access control, QueryPie’s solution thoroughly analyzes SQL syntax executed by users via a parser. It ensures that users have the... |
| 1 | `blog1-image-2.png` | `(keep generic for now)` | low | alt: Demonstration / context: QueryPie supports over 20 different types of databases, parsing SQL syntax accurately and checking permissions to determine whether users have access to... |
| 1 | `blog1-image-3.png` | `(keep generic for now)` | low | alt: Demonstration / context: For this approach, we designed QSI (Query Structural Interface), which analyzes SSH/SFTP/Telnet/VNC, Kubernetes APIs, and all other infrastructure... |
| 10 | `blog10-image-1.png` | `issue-review-and-daily-planning.png` | high | alt: Day of TPM / context: We provide comprehensive training on the installation, operation, and usage of QueryPie to our partners. Additionally, we are always by their side, assisting... |
| 10 | `blog10-image-2.png` | `customer-communication-and-response.png` | high | alt: Day of TPM / context: Once the plan is organized based on priority, it is shared with the team right away, and customers are notified quickly, so they can track the progress and... |
| 10 | `blog10-image-3.png` | `on-call-developer-collaboration.png` | high | alt: Day of TPM / context: /> / Additionally, through the ‘On-Call channel,’ the TPM team actively communicates with weekly ‘on-call’ developers. Each week, a new developer is assigned... |
| 10 | `blog10-image-4.png` | `twenty-four-seven-support-system.png` | high | alt: Day of TPM / context: An indispensable part of the QueryPie TPM team’s day is our 24/7 support system. With our on-call developers available during the week and the entire team... |
| 11 | `blog11-image-2.png` | `design-file-version-chaos.png` | high | caption: Which One is the Final Version? Let’s Leave it to Chance.  /  어떤게 최종본일까? 운에 맡겨본다. / alt: QueryPie x Figma / context: Sharing and reviewing differences between the design mockups and the actual implementation involved significant time and stress. The process of documenting... |
| 11 | `blog11-image-3.png` | `design-system-token-structure.png` | high | caption: QueryPie Design System Token Structure  /  쿼리파이 디자인 시스템 토큰 구조 / alt: QueryPie x Figma / context: - Figma's reusable design elements help maintain consistency across designs while also promoting efficiency and cost-effectiveness. / - Figma generates code... |
| 11 | `blog11-image-4.png` | `advanced-design-system.png` | high | caption: Advanced QueryPie Design System  /  고도화된 쿼리파이 디자인 시스템 / alt: QueryPie x Figma / context: /> / <SplitView gapSize="lg" breakpoint="md" reverse> / <SplitView.View> |
| 11 | `blog11-image-5.png` | `dev-mode-for-qa.png` | high | caption: Dev-mode that Eases QA Burden  /  QA 부담을 덜어주는 dev-mode / alt: QueryPie x Figma / context: /> / </SplitView.View> / <SplitView.View> |
| 12 | `blog12-image-1.png` | `ibm-2024-data-breach-cost.png` | high | alt: 2024 IBM Global Average Total Cost of a Data Breach  /  IBM 2024 데이터 유출 보고서 데이터 유출의 글로벌 평균 총 비용 / context: --- / # The Seriousness and Real Impact of Personal Data Leaks / In the digital age, personal data is a critical asset, not only for individuals but also for... |
| 13 | `blog13-image-1.png` | `(keep generic for now)` | low | caption: Which One is the Final Version? Let’s Leave it to Chance. / alt: QueryPie x Figma / context: The rule-based analysis uses human-created rules to identify subjectivity or polarity. The rules can range from "Categorize the opinions based on positive... |
| 13 | `blog13-image-2.png` | `(keep generic for now)` | low | caption: Which One is the Final Version? Let’s Leave it to Chance. / alt: QueryPie x Figma / context: /> / Initially, the model is trained to associate a particular text to the corresponding output. Then, the input text is transformed into a feature vector... |
| 18 | `blog18-image-1.png` | `(keep generic for now)` | low | alt: Integrated with Essential Email Services  /  업무에 필수적인 Email 서비스와 결합된 방식 / context: 1. Integrated with Essential Email Services / 2. Specialized SSO Independent of Email Services / ## 1. Integrated with Essential Email Services |
| 19 | `blog19-image-1.png` | `(keep generic for now)` | low | alt: Cost Optimization through EC2 Automation / context: - "/en/blog/16" / - "/en/blog/18" / --- |
| 2 | `blog2-image-1.png` | `(keep generic for now)` | low | alt: Global Interest / context: In this article, we will focus on "a precise understanding of the market and clear market positioning." / # QueryPie: The Hidden Gem Poised for Global... |
| 2 | `blog2-image-2.png` | `(keep generic for now)` | low | caption: Comparison Table of QueryPie’s Competitiveness  /  QueryPie競争力比較表 / alt: Comparison Table of QueryPie’s Competitiveness / context: Responding quickly to different data security regulations and compliance requirements in each country is another crucial challenge. To establish credibility... |
| 20 | `blog20-image-1.png` | `(keep generic for now)` | low | alt: Next.js Server Action and Frontend Security  /  Next.js Server Actionとフロントエンドセキュリティ / context: In the early days of web development, the boundaries between server and client were less distinct. However, with the rise of SPA(Single Page Application) and... |
| 21 | `blog21-image-1.png` | `(keep generic for now)` | low | alt: AI Ignores Shutdown Command  /  AIがシャットダウン命令を無視 / context: It wasn’t that the model didn’t understand — it seemed to recognize the commands but kept responding anyway. Even more strangely, it continued the... |
| 21 | `blog21-image-2.png` | `(keep generic for now)` | low | context: Since 2024, tools like AutoGPT, GPT-based multi-tool agents, and OpenAI API-integrated Assistants have evolved past just generating sentences. They are now... |
| 22 | `blog22-image-2.png` | `(keep generic for now)` | low | context: This incident is not just a happening of one startup. / It is an important case that reveals the **true nature of security risks we must accept when AI is... |
| 22 | `blog22-image-3.png` | `(keep generic for now)` | low | context: These reactions are not just criticisms of Replit. / Recently, it is a warning message to many SaaS companies and startups adopting AI Agents. / # Security... |
| 25 | `blog25-image-1.png` | `querypie-ai-mitoco-buddy-announcement.png` | high | caption: QueryPie AI x mitoco / alt: QueryPie AI x mitoco / context: **(2025年11月7日 QueryPie AI合同会社)** / QueryPie AI合同会社（本社：東京都港区、共同代表：Brant Hwang、以下「QueryPie AI」）は、株式会社テラスカイ（本社：東京都中央区、代表取締役CEO 社長執行役員：佐藤... |
| 25 | `blog25-image-2.png` | `mitoco-buddy-chat-screen.png` | high | caption: mitoco Buddyのチャット画面 / alt: mitoco Buddyのチャット画面 / context: </div> / **【参考】mitoco Buddyのチャット画面**<br /> / チャット画面から依頼するとBuddyが回答。グラフ描画なども可能。 |
| 25 | `blog25-image-3.png` | `llm-model-selection-screen.png` | high | caption: LLMモデルの選択画面 / alt: LLMモデルの選択画面 / context: /> / **【参考】LLMモデルの選択画面**<br /> / 各モデルの特長に合わせて選択することが可能 |
| 3 | `blog3-image-1.png` | `(keep generic for now)` | low | alt: Hello from QueryPie / context: - "/en/blog/10" / - "/en/blog/2" / --- |
| 3 | `blog3-image-2.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > *“With Okta's integrated single sign-on, I can access all of the company's solutions without the hassle of remembering multiple accounts and passwords. I... |
| 3 | `blog3-image-3.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > - *Kyle, Security Team* / > *“It’s incredibly convenient that the progress of other departments is shared on Slack, Jira, and Confluence, making it easy to... |
| 3 | `blog3-image-4.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > *“The tech organization at QueryPie is built on a horizontal culture that encourages open communication. When discussing collaboration or technical topics,... |
| 3 | `blog3-image-5.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > *“At QueryPie, we have a remote culture that allows us to ask questions, share ideas, have some discussions, and even have some chats without hesitation.... |
| 3 | `blog3-image-6.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > *“When I’m jogging, around the 10km mark, I often feel like I want to stop. But if I take a 10-minute walk, I can usually get back into running. For me,... |
| 3 | `blog3-image-7.png` | `(keep generic for now)` | low | alt: Work like QueryPie / context: > *“Random Lunches create opportunities to naturally connect with crew members from different departments who we don’t often get to share meals with. In... |
| 4 | `blog4-image-1.png` | `(keep generic for now)` | low | alt: Kubernetes Innovation / context: # Challenges in Kubernetes Operations / While Kubernetes is highly convenient and efficient for deploying and automating applications, its operation can pose... |
| 4 | `blog4-image-2.png` | `(keep generic for now)` | low | alt: Kubernetes Innovation / context: # Solutions to the Challenges / I have summarized the core strategies necessary to address the management and security challenges in Kubernetes operations.... |
| 4 | `blog4-image-3.png` | `(keep generic for now)` | low | alt: Kubernetes Innovation / context: - **Audit Logging and Centralized Audit Policy Management** / - **Real-Time Validation of Kubernetes Requests** / <Box marginTopSize="xs"> |
| 5 | `blog5-image-1.png` | `(keep generic for now)` | low | alt: Jobs / context: This vision aligns with the philosophy of Steve Jobs, the founder of Apple (["Steve Jobs" by Walter Issacson, 2011](https://www.amazon.com/Steve-Jobs-Walter-... |
| 5 | `blog5-image-2.png` | `(keep generic for now)` | low | alt: QueryPie / context: As Jobs emphasized, technology can only move people’s hearts when it’s combined with the humanities. He said, "The combination of technology and the... |
| 6 | `blog6-image-1.png` | `(keep generic for now)` | low | alt: Integration / context: QueryPie aims to shift from a closed, rigid security environment to one based on integration and connectivity. Rather than confining data and users within... |
| 6 | `blog6-image-2.png` | `(keep generic for now)` | low | alt: Integration / context: For example, when A Company’s HR team marks an employee as "inactive" in the HR system after their departure, QueryPie automatically detects the status... |
| 6 | `blog6-image-3.png` | `(keep generic for now)` | low | alt: Integration / context: For example, Company C, which had to manually register 100,000 servers in their access control system, estimated that this task would take at least 3 months.... |
| 6 | `blog6-image-4.png` | `(keep generic for now)` | low | alt: Integration / context: For example, Company C, when attempting to investigate and analyze an inappropriate use of access rights by a specific user, was previously only able to view... |
| 7 | `blog7-image-1.png` | `(keep generic for now)` | low | alt: Command Bypass / context: By using this approach, QueryPie can prevent the execution of bypass commands before they are executed, based on the pre-defined blocklist, even if the user... |
| 7 | `blog7-image-2.png` | `(keep generic for now)` | low | caption: QueryPie 独自の3つのコマンドブロック方法論  /  QueryPie’s 3 Unique Command Blocking Methodologies / alt: Command Blocking Methodologies  /  QueryPie 独自の3つのコマンドブロック方法論 / context: # Next-Generation Command Blocking Features: Enhancing QueryPie's Security and Usability / QueryPie continues to improve both security and usability, and it... |
| 8 | `blog8-image-1.png` | `(keep generic for now)` | low | alt: QueryPie PM / context: QueryPie is positioning itself as a leader driving innovation in the field of database and server access control. We strive to offer the best experience for... |
| 8 | `blog8-image-2.png` | `(keep generic for now)` | low | alt: QueryPie PM / context: /> / The first step in addressing customer needs is through Jira. Customers can directly report improvement issues or bugs via the Jira Customer Portal.... |
| 8 | `blog8-image-3.png` | `(keep generic for now)` | low | alt: QueryPie PM / context: As QueryPie’s customer base grows, particularly with larger-scale clients, the volume of requirements discovered during product introductions and PoCs is... |
| 8 | `blog8-image-4.png` | `(keep generic for now)` | low | alt: QueryPie PM / context: Once the requirements have been gathered through various methods, it's crucial to act quickly to incorporate them into the product. PMs play the role of... |
| 8 | `blog8-image-5.png` | `(keep generic for now)` | low | alt: QueryPie PM / context: QueryPie offers various opportunities to support PM growth. These include in-house technical study groups, where PMs can learn about product-specific... |
| 9 | `blog9-image-1.png` | `personal-data-policy-database-access-control.png` | high | caption: QueryPie Database 접근제어의 개인정보 정책  /  QueryPie データベース アクセス コントロールの個人情報ポリシー / alt: Data Discovery  /  データディスカバリー / context: --- / In today’s society, both businesses and individuals are increasingly aware of the importance of information protection, a focus that has only grown... |
| 9 | `blog9-image-2.png` | `personal-data-regex-and-ai-patterns.png` | high | caption: QueryPieが提供するさまざまなパターン  /  QueryPie에서 제공하는 다양한 패턴 / alt: Data Discovery  /  データディスカバリー / context: ## Maximizing the Efficiency of Personal Data Identification with Regular Expressions and AI / Just like a soldier with a powerful weapon can do nothing if... |
| 9 | `blog9-image-3.png` | `discovery-job-personal-data-scans.png` | high | caption: Discovery Job을 통한 쉽고 지속적인 개인정보 탐색 수행  /  Easy and Ongoing Personal Data Discovery Through Discovery Job / alt: Data Discovery  /  データディスカバリー / context: ## Automating Data Discovery: A Path to Cost Savings and Enhanced Security / Manually accessing and searching individual data sources to identify whether... |
| 9 | `blog9-image-4.png` | `identified-results-review.png` | high | caption: Easy and Ongoing Personal Data Discovery Through Discovery Job  /  識別結果の確認 / alt: Data Discovery  /  データディスカバリー / context: ## AI and Regular Expressions Limitations: The Current and Future of Personal Data Identification / No matter how sophisticated a regular expression is or... |

## High-confidence rename set

- Post 10: `blog10-image-1.png` → `issue-review-and-daily-planning.png`
- Post 10: `blog10-image-2.png` → `customer-communication-and-response.png`
- Post 10: `blog10-image-3.png` → `on-call-developer-collaboration.png`
- Post 10: `blog10-image-4.png` → `twenty-four-seven-support-system.png`
- Post 11: `blog11-image-2.png` → `design-file-version-chaos.png`
- Post 11: `blog11-image-3.png` → `design-system-token-structure.png`
- Post 11: `blog11-image-4.png` → `advanced-design-system.png`
- Post 11: `blog11-image-5.png` → `dev-mode-for-qa.png`
- Post 12: `blog12-image-1.png` → `ibm-2024-data-breach-cost.png`
- Post 25: `blog25-image-1.png` → `querypie-ai-mitoco-buddy-announcement.png`
- Post 25: `blog25-image-2.png` → `mitoco-buddy-chat-screen.png`
- Post 25: `blog25-image-3.png` → `llm-model-selection-screen.png`
- Post 9: `blog9-image-1.png` → `personal-data-policy-database-access-control.png`
- Post 9: `blog9-image-2.png` → `personal-data-regex-and-ai-patterns.png`
- Post 9: `blog9-image-3.png` → `discovery-job-personal-data-scans.png`
- Post 9: `blog9-image-4.png` → `identified-results-review.png`

## Notes

- Most generic names (`blogNN-image-N.png`) are inherited from `corp-web-contents/public/blog`, not newly invented during migration.
- Thumbnails were already normalized separately to `public/blog/{id}/thumbnail.png`.
