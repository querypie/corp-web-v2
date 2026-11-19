import type { AnniversaryMilestoneTitle } from "./anniversaryHistory";

type Story = readonly [title: string, description: string];
type LocalizedStory = { en: Story; ja: Story };

export const megazonePhotoAlt = {
  en: "CHEQUER CEO Brant Hwang and MegazoneCloud CEO Joo-wan Lee pose after signing the agreement",
  ja: "業務協約の締結後に記念撮影するCHEQUERのBrant Hwang代表とMegazoneCloudのイ・ジュワン代表",
};

export const anniversaryHistoryLocales = {
  "체커 설립": {
    en: ["CHEQUER is founded", "CHEQUER, the company that would become QueryPie, opens its doors."],
    ja: ["CHEQUER設立", "現在のQueryPieの前身となるCHEQUERを設立しました。"],
  },
  "카카오인베스트먼트 투자 유치": {
    en: ["Investment from Kakao Investment", "We secured funding from Kakao Investment and began building an SQL client for developers."],
    ja: ["Kakao Investmentから資金調達", "Kakao Investmentから出資を受け、開発者向けSQLクライアントの開発を始めました。"],
  },
  "QueryPie SQL Client 출시": {
    en: ["QueryPie SQL Client launches", "We released a tool that lets developers connect to databases, write queries, and run them."],
    ja: ["QueryPie SQL Clientをリリース", "開発者がデータベースに接続し、クエリの作成と実行を行えるツールを公開しました。"],
  },
  "LG Startup Competition 수상": {
    en: ["LG Startup Competition award", "In the year we released our first product, we won an award at the LG Startup Competition."],
    ja: ["LG Startup Competitionで受賞", "最初の製品をリリースした年に、LG Startup Competitionで受賞しました。"],
  },
  "Y Combinator W20 선정": {
    en: ["Selected for Y Combinator W20", "We received investment from U.S. startup accelerator Y Combinator. That same year, we shifted our focus from SQL developer tools to protecting enterprise data."],
    ja: ["Y Combinator W20に採択", "米国のスタートアップ支援機関Y Combinatorから出資を受けました。同年、SQL開発ツールから企業のデータ保護へ製品の軸足を移しました。"],
  },
  "데이터 거버넌스 솔루션 출시": {
    en: ["Data governance solution launches", "We released QueryPie to help companies manage who can access data and track how it’s used. Yanolja and Kakao Pay were among its first customers."],
    ja: ["データガバナンス製品をリリース", "企業がデータへのアクセス権限と利用履歴を管理できるQueryPieをリリースしました。YanoljaやKakao Payが初期の導入企業となりました。"],
  },
  "Okta Integration Network 합류": {
    en: ["Joining the Okta Integration Network", "As an integration partner, we connected Okta’s identity authentication with QueryPie’s data access controls."],
    ja: ["Okta Integration Networkに参画", "連携パートナーとして、Oktaの認証機能とQueryPieのデータアクセス制御をつなぎました。"],
  },
  "1,775만 달러 시드 투자 유치": {
    en: ["$17.75 million in seed funding", "Atinum Investment and Murex Partners co-led the seed round, which raised about KRW 21 billion."],
    ja: ["シードラウンドで1,775万ドルを調達", "Atinum InvestmentとMurex Partnersが共同で主導したラウンドで、約210億ウォンを調達しました。"],
  },
  "고위드에 데이터 거버넌스 구축": {
    en: ["Gowid adopts QueryPie", "Gowid, a financial platform for startups, gained a single place to manage access to data on its own servers and in the cloud."],
    ja: ["Gowidのデータガバナンス基盤を構築", "スタートアップ向け金融プラットフォームGowidは、社内サーバーとクラウドに分散するデータのアクセス権限を一元管理できるようになりました。"],
  },
  "신용보증기금 혁신아이콘 선정": {
    en: ["Named a KODIT Innovation Icon", "The Korea Credit Guarantee Fund selected us for Innovation Icon, its program for startups with high growth potential."],
    ja: ["韓国信用保証基金の「Innovation Icon」に選定", "成長が期待されるスタートアップを支援する韓国信用保証基金の「Innovation Icon」に選ばれました。"],
  },
  "메가존클라우드와 데이터 보안 업무협약": {
    en: ["Data security agreement with MegazoneCloud", "We agreed to bring QueryPie to enterprise customers with MegazoneCloud, helping them manage data access permissions and track usage."],
    ja: ["MegazoneCloudとデータセキュリティで業務協約", "データのアクセス権限と利用履歴を管理するQueryPieを、MegazoneCloudとともに企業向けに提供することで合意しました。"],
  },
  "DAC에 이어 서버 접근 제어 제품 SAC 출시": {
    en: ["From DAC to SAC: access control expands to servers", "After building DAC to manage database access, we released SAC to control server access and record user activity."],
    ja: ["DACに続き、サーバーアクセス制御製品SACをリリース", "データベースへの接続を管理するDACに続き、サーバーへのアクセス権限を管理し、操作履歴を記録するSACをリリースしました。"],
  },
  "Salesforce Ventures·Z Venture Capital 투자 유치": {
    en: ["Salesforce Ventures and Z Venture Capital invest", "The two firms joined as strategic investors as QueryPie expanded its business with local partners in Japan."],
    ja: ["Salesforce VenturesとZ Venture Capitalから資金調達", "両社が戦略的投資家として参画しました。QueryPieは現地パートナーとともに日本で事業を拡大しました。"],
  },
  "초격차 스타트업 1000+ 선정": {
    en: ["Selected for Korea’s Super Gap Startup 1000+ program", "Korea’s Ministry of SMEs and Startups selected QueryPie as a cybersecurity company for its deep tech startup program."],
    ja: ["韓国「超格差スタートアップ1000+」に選定", "韓国の中小ベンチャー企業部が先端技術を持つスタートアップを育成する事業に、サイバーセキュリティ企業として選ばれました。"],
  },
  "일본 법인 QueryPie Japan 출범": {
    en: ["QueryPie Japan opens", "We established a local presence to better support customers and partners in Japan."],
    ja: ["日本法人QueryPie Japanを設立", "日本のお客様とパートナーを現地で支援する事業拠点を設けました。"],
  },
  "쿠버네티스 접근 제어 제품 KAC 출시": {
    en: ["KAC launches for Kubernetes access control", "KAC brings role and access policy management across Kubernetes environments together and makes API activity visible for each user."],
    ja: ["Kubernetesアクセス制御製品KACをリリース", "複数のKubernetes環境のロールとアクセスポリシーを一元管理し、ユーザーごとのAPI操作を確認できる製品を公開しました。"],
  },
  "민감정보 탐지 솔루션 AIDD 출시": {
    en: ["AIDD launches for sensitive data discovery", "AIDD finds personal and other sensitive information in enterprise data and systems, so teams can use the findings in security policies and audits."],
    ja: ["機密情報検出ソリューションAIDDをリリース", "企業のデータやシステム資産から個人情報などの機密データを検出し、その結果をセキュリティポリシーや監査に活用できるようにしました。"],
  },
  "레알 마드리드 액셀러레이터 선정": {
    en: ["Selected for the Real Madrid accelerator", "The Real Madrid Next Accelerator for Asia selected QueryPie for a program that brings Asian startups and the sports industry together."],
    ja: ["レアル・マドリードのアクセラレーターに採択", "アジアのスタートアップとスポーツ業界との技術連携を目指す「Real Madrid Next Accelerator for Asia」に選ばれました。"],
  },
  "글로벌 소프트웨어 기업 100곳에 이름을 올리다": {
    en: ["Named a top 100 software company", "The Software Report included QueryPie in its Top 100 Software Companies of 2024."],
    ja: ["世界のソフトウェア企業トップ100に選出", "米国のメディアThe Software Reportが発表した「The Top 100 Software Companies of 2024」に選ばれました。"],
  },
  "웹 애플리케이션 접근 제어 WAC 초기 버전 공개": {
    en: ["First version of WAC released", "With QueryPie 10.2.0, we introduced the first version of WAC, which controls who can access internal web applications."],
    ja: ["Webアプリケーションアクセス制御WACの初期版を公開", "社内のWebアプリケーションに誰がアクセスできるかを管理するWACの初期版を、QueryPie 10.2.0で公開しました。"],
  },
  "황인서 대표, 소프트웨어 CEO 50인 선정": {
    en: ["Brant Hwang named a top 50 software CEO", "The Software Report included QueryPie founder Brant Hwang in its Top 50 Software CEOs of 2024."],
    ja: ["創業者Brant HwangがソフトウェアCEOトップ50に選出", "The Software Reportが選ぶ2024年のソフトウェアCEOトップ50に、QueryPie創業者のBrant Hwangが選ばれました。"],
  },
  "싱가포르 CyberBoost Catalyse 선정": {
    en: ["Selected for Singapore’s CyberBoost Catalyse", "The Singapore government-backed program for cybersecurity companies gave us an opportunity to connect with the local market."],
    ja: ["シンガポールのCyberBoost Catalyseに採択", "シンガポール政府が支援するサイバーセキュリティ企業の育成プログラムに選ばれ、現地市場との接点を得ました。"],
  },
  "조달청 디지털서비스몰 등록": {
    en: ["Listed on Korea’s public procurement marketplace", "Korean public institutions could procure QueryPie’s security software for managing database and server access and tracking activity through the government’s Digital Service Mall."],
    ja: ["韓国調達庁のデジタルサービスモールに登録", "韓国の公共機関が、データベースやサーバーのアクセス権限と操作履歴を管理するQueryPieを、調達庁のデジタルサービスモールから導入できるようになりました。"],
  },
  "접근 제어 커뮤니티 버전 공개": {
    en: ["Community edition of access control released", "We released a free edition for startups and small businesses to try access control and auditing for databases, servers, Kubernetes, and web applications."],
    ja: ["アクセス制御製品のコミュニティ版を公開", "スタートアップや中小企業が、データベース、サーバー、Kubernetes、Webアプリケーションのアクセス制御と監査を試せる無償版を公開しました。"],
  },
  "일본 HR 기업 Payroll과 보안 협력": {
    en: ["Security partnership with Japan’s Payroll", "We began working with Japanese payroll provider Payroll on AI security technology to help protect HR data."],
    ja: ["日本のペイロールとAIセキュリティで協業", "給与計算サービスを提供するペイロールと、人事データを安全に扱うためのAIセキュリティ技術で協業を始めました。"],
  },
  "QueryPie AIP와 FDE 서비스 출시": {
    en: ["QueryPie AIP and FDE Services launch", "We launched AIP to connect AI with enterprise tools. We also introduced FDE Services, where engineers work with customers on site to put AI into practice."],
    ja: ["QueryPie AIPとFDEサービスの提供開始", "企業の業務ツールとAIをつなぐプラットフォームAIPをリリースしました。エンジニアがお客様の現場で導入と実装を支援するFDEサービスも始めました。"],
  },
  "TerraSky, mitoco Buddy에 AIP 채택": {
    en: ["TerraSky chooses AIP for mitoco Buddy", "Japanese cloud provider TerraSky announced mitoco Buddy, an AI agent for work. It uses QueryPie AIP to connect AI with enterprise tools and data."],
    ja: ["テラスカイがmitoco BuddyにAIPを採用", "テラスカイが業務向けAIエージェント「mitoco Buddy」を発表しました。AIを企業のツールやデータにつなぐQueryPie AIPが基盤となっています。"],
  },
  "AIP 주소록 앱 LinkPie 미리보기": {
    en: ["Preview of LinkPie, the AIP contacts app", "We introduced LinkPie in an AIP apps preview. It lets teams organize business cards and contacts, share them with colleagues, and use them in AIP conversations."],
    ja: ["AIPの連絡先管理アプリLinkPieをプレビュー", "AIPアプリのプレビューでLinkPieを紹介しました。名刺や連絡先を整理し、同僚と共有したり、AIPのチャットで活用したりできます。"],
  },
  "AI 경영시스템 국제표준 인증 취득": {
    en: ["ISO/IEC 42001 certification", "We earned ISO/IEC 42001 certification for our system for identifying and managing risks in AI development and operations."],
    ja: ["AIマネジメントシステムの国際認証を取得", "AIの開発・運用に伴うリスクを特定し管理する体制について、ISO/IEC 42001認証を取得しました。"],
  },
  "실시간 통역 서비스 Lingo 공개": {
    en: ["Lingo introduces real-time interpretation", "Lingo provides live captions and translation for multilingual meetings, then helps teams summarize the discussion and follow up afterward."],
    ja: ["リアルタイム通訳サービスLingoを公開", "多言語の会議でリアルタイム字幕と翻訳を提供し、終了後は要約やフォローアップにつなげます。"],
  },
  "문서 기반 AI 어시스턴트 NotePie 공개": {
    en: ["NotePie introduces a source-based AI assistant", "NotePie finds answers in the documents and web sources users select, shows where those answers come from, and helps turn them into reports or slides."],
    ja: ["資料をもとに回答するAIアシスタントNotePieを公開", "ユーザーが選んだ文書やWeb資料から根拠付きで答えを探し、レポートやスライドにまとめられるNotePieを公開しました。"],
  },
  "ACP AI Pack 출시": {
    en: ["ACP AI Pack launches", "We added AI capabilities to ACP, which controls access to databases, servers, and Kubernetes. AI agents can analyze data and operate systems under existing approval and audit policies."],
    ja: ["ACP AI Packをリリース", "データベース、サーバー、Kubernetesのアクセス権限を管理するACPにAI機能を追加しました。AIエージェントも、既存の承認・監査ポリシーのもとでデータ分析やシステム運用を行えます。"],
  },
  "일본에서 FDE 기반 AI 전환 지원 확대": {
    en: ["Expanding AI adoption support in Japan with FDE Services", "We expanded local support by placing engineers on site to design, build, and help Japanese companies adopt AI for their day-to-day work."],
    ja: ["日本でFDEサービスによるAI導入支援を拡大", "日本企業の現場にエンジニアを配置し、業務に合わせたAI環境の設計・構築から定着まで支援する事業を本格化しました。"],
  },
  "AI Terasu와 일본 기업의 AI 도입 지원": {
    en: ["Helping Japanese companies adopt AI with AI Terasu", "We agreed to work with Japanese AI consultancy AI Terasu to sell and implement AIP, the platform that connects enterprise tools to AI agents."],
    ja: ["AIテラスと日本企業のAI導入を支援", "AIコンサルティングを手がけるAIテラスと、企業の業務ツールをAIエージェントにつなぐAIPの販売・構築で協業することを決めました。"],
  },
  "다국어 DLP 모델 공개": {
    en: ["Multilingual DLP models released", "We published data loss prevention models on Hugging Face that identify sensitive information in text across multiple languages."],
    ja: ["多言語DLPモデルを公開", "複数の言語のテキストから機密情報を識別するデータ漏えい防止（DLP）モデルを、Hugging Faceで公開しました。"],
  },
  "데스크톱 AI 에이전트 Aru 제공 시작": {
    en: ["Aru launches as a desktop AI agent", "Announced in Japan, Aru lets users delegate research, writing, and development tasks in natural language on their own computers."],
    ja: ["デスクトップAIエージェントAruの提供開始", "調査、文書作成、開発作業などを自然言語で頼めるデスクトップAIエージェントAruの提供開始を、日本で発表しました。"],
  },
  "민감정보를 판별하는 AI 모델 QEV 발표": {
    en: ["QEV announced for sensitive-data detection", "We unveiled QEV, our AI model for deciding whether text contains information that should be protected, and released its evaluation results."],
    ja: ["機密情報を判定するAIモデルQEVを発表", "テキスト中の情報を保護すべきか判定する自社開発AIモデルQEVと、その評価結果を公開しました。"],
  },
  "AI Gateway 독립 제품화 계획 공개": {
    en: ["Plans for a standalone AI Gateway", "We announced plans to offer AIP’s AI Gateway as a standalone product. It gives organizations one place to manage connections between AI models and agents."],
    ja: ["AI Gatewayの単独製品化計画を発表", "AIPに組み込まれていたAI Gatewayを、AIモデルやエージェントとの接続を一元管理する独立した製品として提供する計画を公表しました。"],
  },
  "기업 재무 데이터 플랫폼 CorpNavi 연동 공개": {
    en: ["CorpNavi financial data integration unveiled", "We shared how to connect CorpNavi via MCP so AIP chats and agents can use disclosures, financial statements, prices, and investor materials from listed Japanese companies."],
    ja: ["企業財務データ基盤CorpNaviの連携を公開", "日本の上場企業の開示情報、財務諸表、株価、IR資料をAIPのチャットやエージェントで使えるよう、CorpNaviのMCP連携方法を公開しました。"],
  },
  "일본 기업 대상 AI 모의침투 테스트 시작": {
    en: ["AI Penetration Testing launches in Japan", "We began assessing the security of Japanese companies’ websites and APIs. Our in-house security AI model QLM supports reporting, remediation, and retesting."],
    ja: ["日本企業向けにAIペネトレーションテストを提供開始", "日本企業のWebサービスやAPIのセキュリティ診断を開始しました。自社のセキュリティAIモデルQLMを活用し、結果報告から修正支援、再検証まで対応します。"],
  },
  "Hito-Q 전사 파일럿 시작": {
    en: ["Company-wide Hito-Q pilot begins", "We began an internal pilot of Hito-Q, which uses employee surveys and interviews to help teams understand how their organizations are doing."],
    ja: ["Hito-Qの全社パイロットを開始", "従業員アンケートや面談を通じて、組織やチームの状態の把握を支援するHito-Qの社内試験運用を始めました。"],
  },
} satisfies Record<AnniversaryMilestoneTitle, LocalizedStory>;
