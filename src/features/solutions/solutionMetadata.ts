import type { Locale } from "@/constants/i18n";
import type { SolutionEntry } from "./routes";

export type SolutionStaticMetadata = {
  title: string;
  description: string;
  keywords?: string[];
};

const solutionStaticMetadata: Record<
  SolutionEntry["id"],
  Record<Locale, SolutionStaticMetadata>
> = {
  "aip": {
    "en": {
      "title": "QueryPie AI Platform (AIP)",
      "description": "QueryPie AIP is the platform that delivers enterprise AI transformation through economical, enterprise-ready solutions—featuring usage-based LLM deployment and comprehensive MCP gateway.Complete transformation through Forward Deployed Engineers (FDE) delivering tailored AI agents.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ko": {
      "title": "QueryPie: Secure Enterprise AI Hub",
      "description": "보안 때문에 망설였던 AI, 이젠 쉽고 안전하게 사용하세요. AI가 데이터를 분석하고, 인프라를 운영하며, 보안을 강화하는 하나의 자율 보안 운영 플랫폼. 당신의 AI는 더 스마트해지고 보안은 더 강력해집니다.",
      "keywords": [
        "쿼리파이",
        "QueryPie",
        "AI PAM",
        "PAM",
        "AI",
        "MCP 보안",
        "Zero Trust",
        "접근 제어",
        "보안 자동화",
        "자율 보안",
        "인프라 운영",
        "QueryPie AI Agent"
      ]
    },
    "ja": {
      "title": "QueryPie AIプラットフォーム (AIP)",
      "description": "経済的でエンタープライズ対応のソリューションを通じてエンタープライズAI変革を実現するプラットフォーム—使用量ベースのLLM導入と包括的なMCPゲートウェイを特徴とする。カスタマイズされたAIエージェントを提供するフォワードデプロイドエンジニア（FDE）による完全な変革。",
      "keywords": [
        "クエリパイ AI",
        "QueryPie AI",
        "AI Platform",
        "AIP",
        "AI",
        "MCPゲートウェイ",
        "アクセス制御",
        "カスタムAIエージェント",
        "インフラ運用",
        "QueryPie AI Agent",
        "使用量ベース",
        "フォワードデプロイドエンジニア",
        "FDE"
      ]
    }
  },
  "aip-usage-based-llm": {
    "en": {
      "title": "QueryPie AIP: Usage-Based Enterprise AI That Works",
      "description": "Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to 90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ko": {
      "title": "QueryPie AIP: Usage-Based Enterprise AI That Works",
      "description": "Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to 90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ja": {
      "title": "QueryPie AIP：実際使用量ベースエンタープライズAI",
      "description": "ブラウザベースプラットフォームで即座にアクセス—ダウンロード不要、セットアップ不要、固定費用なし。ChatGPTと比較して最大90%のコスト削減により、企業全体でのAI導入がついに実現可能に。",
      "keywords": [
        "クエリパイ AI",
        "QueryPie AI",
        "AI Platform",
        "AIP",
        "AI",
        "MCPゲートウェイ",
        "アクセス制御",
        "カスタムAIエージェント",
        "インフラ運用",
        "QueryPie AI Agent",
        "使用量ベース",
        "フォワードデプロイドエンジニア",
        "FDE"
      ]
    }
  },
  "aip-mcp-gateway": {
    "en": {
      "title": "QueryPie AIP: MCP Hub That Connects Everything",
      "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ko": {
      "title": "QueryPie AIP: MCP Hub That Connects Everything",
      "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ja": {
      "title": "QueryPie AIP：すべてを接続するMCPハブ",
      "description": "すべてのMCPサーバーとツールを一元管理する単一プラットフォーム—分散なし、複雑さなし、制限なし。舞台裏の複雑さは私たちが処理し、技術スタック全体のAIワークフローを効率化。",
      "keywords": [
        "クエリパイ AI",
        "QueryPie AI",
        "AI Platform",
        "AIP",
        "AI",
        "MCPゲートウェイ",
        "アクセス制御",
        "カスタムAIエージェント",
        "インフラ運用",
        "QueryPie AI Agent",
        "使用量ベース",
        "フォワードデプロイドエンジニア",
        "FDE"
      ]
    }
  },
  "aip-fde-services": {
    "en": {
      "title": "QueryPie AIP: AI Transformation Expert at Your Service",
      "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ko": {
      "title": "QueryPie AIP: AI Transformation Expert at Your Service",
      "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
      "keywords": [
        "QueryPie AI",
        "AI Platform",
        "MCP management",
        "access control",
        "QueryPie",
        "streamlined operations",
        "MCP servers",
        "Usage-based Enterprise AI",
        "MCP Gateway",
        "FDE Service"
      ]
    },
    "ja": {
      "title": "QueryPie AIP：あなたのためのAI変革エキスパート",
      "description": "組織に組み込まれたフォワードデプロイドエンジニア（FDE）が、戦略と開発から本番運用まで包括的なAI変革を提供し、AIイニシアチブの成功を保証。",
      "keywords": [
        "クエリパイ AI",
        "QueryPie AI",
        "AI Platform",
        "AIP",
        "AI",
        "MCPゲートウェイ",
        "アクセス制御",
        "カスタムAIエージェント",
        "インフラ運用",
        "QueryPie AI Agent",
        "使用量ベース",
        "フォワードデプロイドエンジニア",
        "FDE"
      ]
    }
  },
  "aip-integrations": {
    "en": {
      "title": "QueryPie AIP Integrations",
      "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
      "keywords": [
        "QueryPie AIP integrations",
        "MCP integrations",
        "QueryPie AI"
      ]
    },
    "ko": {
      "title": "QueryPie AIP Integrations",
      "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
      "keywords": [
        "QueryPie AIP integrations",
        "MCP integrations",
        "QueryPie AI"
      ]
    },
    "ja": {
      "title": "QueryPie AI: インテグレーション",
      "description": "MCPサーバーを通じてお気に入りのビジネスツールに接続し、システム、アプリ、サービス全体のワークフローを自動化。",
      "keywords": [
        "QueryPie AIの統合",
        "MCPサーバーの統合",
        "QueryPie AI"
      ]
    }
  },
  "acp": {
    "en": {
      "title": "QueryPie Access Control Platform (ACP)",
      "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
      "keywords": [
        "QueryPie ACP",
        "Access Control Platform",
        "database access control",
        "data access control",
        "system access control",
        "kubernetes access control",
        "web access control",
        "data protection",
        "SQL editor",
        "AI Agent connectivity",
        "RBAC",
        "ABAC",
        "audit"
      ]
    },
    "ko": {
      "title": "QueryPie Access Control Platform (ACP)",
      "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
      "keywords": [
        "QueryPie ACP",
        "Access Control Platform",
        "database access control",
        "data access control",
        "system access control",
        "kubernetes access control",
        "web access control",
        "data protection",
        "SQL editor",
        "AI Agent connectivity",
        "RBAC",
        "ABAC",
        "audit"
      ]
    },
    "ja": {
      "title": "QueryPie アクセス制御プラットフォーム (ACP)",
      "description": "アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。",
      "keywords": [
        "クエリパイ ACP",
        "Access Control Platform",
        "ACP",
        "データベースアクセス制御",
        "システムアクセス制御",
        "Kubernetesアクセス制御",
        "Webアクセス制御",
        "SQLエディター",
        "AIエージェント",
        "RBAC",
        "ABAC",
        "リアルタイム監視"
      ]
    }
  },
  "acp-database-access-controller": {
    "en": {
      "title": "QueryPie DAC, Database Access Controller",
      "description": "QueryPie DAC is crafted for data protection, seamlessly connectiong various cloud ecosystems. ",
      "keywords": [
        "QueryPie DAC",
        "database access controller",
        "DB access control",
        "data protection",
        "SQL editor",
        "RBAC",
        "ABAC",
        "audit"
      ]
    },
    "ko": {
      "title": "QueryPie DAC, Database Access Controller",
      "description": "QueryPie DAC는 데이터 보호를 위해 설계되었으며, 다양한 클라우드 생태계를 원활하게 연결합니다.",
      "keywords": [
        "QueryPie DAC",
        "데이터베이스 접근 제어기",
        "DB 접근 제어",
        "데이터 보호",
        "SQL 편집기",
        "RBAC",
        "ABAC",
        "감사"
      ]
    },
    "ja": {
      "title": "QueryPie DAC: Database Access Controller",
      "description": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
      "abstract": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
      "keywords": [
        "QueryPie DAC",
        "データベースアクセスコントローラ",
        "DBアクセス制御",
        "データ保護",
        "SQLエディタ",
        "RBAC",
        "ABAC",
        "データ監査"
      ]
    }
  },
  "acp-system-access-controller": {
    "en": {
      "title": "QueryPie SAC, System Access Controller",
      "description": "QueryPie SAC is designed for cloud instance protection on AWS, GCP, Azure supporting on-premises as well. ",
      "keywords": [
        "QueryPie SAC",
        "system access controller",
        "AWS",
        "GCP",
        "Azure",
        "on-premise",
        "cloud security",
        "web terminal",
        "QueryPie Proxy",
        "web SFTP",
        "access control"
      ]
    },
    "ko": {
      "title": "QueryPie SAC, System Access Controller",
      "description": "QueryPie SAC는 AWS, GCP, Azure와 같은 클라우드 인스턴스 보호를 위해 설계되었으며, 온프레미스 또한 지원합니다.",
      "keywords": [
        "QueryPie SAC",
        "시스템 접근 제어",
        "AWS",
        "GCP",
        "Azure",
        "온프레미스",
        "클라우드 보안",
        "웹 터미널",
        "QueryPie Proxy",
        "웹 SFTP",
        "System Access Controller",
        "접근 제어"
      ]
    },
    "ja": {
      "title": "QueryPie SAC: System Access Controller",
      "description": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
      "abstract": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
      "keywords": [
        "QueryPie SAC",
        "システムアクセスコントローラ",
        "AWS",
        "GCP",
        "Azure",
        "オンプレミス",
        "クラウドセキュリティ"
      ]
    }
  },
  "acp-kubernetes-access-controller": {
    "en": {
      "title": "QueryPie KAC, Kubernetes Access Controller",
      "description": "QueryPie KAC is for Kubernetes API protection, managing  AWS Eks and on-premises clusters. ",
      "keywords": [
        "QueryPie KAC",
        "Kubernetes access controller",
        "AWS Eks",
        "Kubernetes API protection",
        "automation",
        "ABAC",
        "RBAC",
        "session recording",
        "Kubernetes cluster",
        "SSH connection"
      ]
    },
    "ko": {
      "title": "QueryPie KAC, Kubernetes Access Controller",
      "description": "QueryPie KAC는 AWS EKS와 온프레미스 클러스터를 관리하며, 쿠버네티스 API 보호를 위한 솔루션입니다.",
      "keywords": [
        "QueryPie KAC",
        "쿠버네티스 접근 제어기",
        "AWS EKS",
        "쿠버네티스 API 보호",
        "자동화",
        "ABAC",
        "RBAC",
        "세션 기록",
        "쿠버네티스 클러스터",
        "SSH 연결"
      ]
    },
    "ja": {
      "title": "QueryPie KAC:  Kubernetes Access Controller",
      "description": "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
      "abstract": "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
      "keywords": [
        "QueryPie KAC",
        "Kubernetes アクセスコントローラ",
        "AWS Eks",
        "Kubernetes API 保護",
        "自動化",
        "ABAC",
        "RBAC",
        "セッション録音",
        "Kubernetes クラスタ",
        "SSH 接続",
        "クーバネティス",
        "クバネティス"
      ]
    }
  },
  "acp-web-access-controller": {
    "en": {
      "title": "QueryPie WAC, Web Access Controller",
      "description": "QueryPie WAC secures access and log activities for web applications including admin portals and SaaS platforms.",
      "keywords": [
        "QueryPie WAC",
        "web access controller",
        "SaaS",
        "sensitive data",
        "data protection",
        "integrated access control",
        "permission management",
        "HTTP request",
        "web application compliance",
        "SIEM integration"
      ]
    },
    "ko": {
      "title": "QueryPie WAC, Web Access Controller",
      "description": "QueryPie WAC는 사내 관리자 사이트 및 SaaS 플랫폼을 포함한 웹 애플리케이션의 접근을 보호하고 로그 활동을 관리합니다.",
      "keywords": [
        "QueryPie WAC",
        "웹 접근 제어기",
        "SaaS",
        "민감 데이터",
        "데이터 보호",
        "통합 접근 제어",
        "권한 관리",
        "HTTP 요청",
        "웹 애플리케이션 준수",
        "SIEM 통합"
      ]
    },
    "ja": {
      "title": "QueryPie KAC:  Kubernetes Access Controller",
      "description": "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
      "abstract": "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
      "keywords": [
        "QueryPie WAC",
        "Webアプリケーションアクセスコントローラ",
        "SaaS",
        "機密データ",
        "データ保護",
        "統合アクセス制御権限管理",
        "HTTP要求",
        "Webアプリケーションコンプライアンス",
        "SIEM統合"
      ]
    }
  },
  "acp-integrations": {
    "en": {
      "title": "QueryPie Integrations",
      "description": "Connect straight to your data sources and get full visibility across all your systems, apps, and services.",
      "keywords": [
        "QueryPie integrations",
        "integrate data source",
        "system integration",
        "QueryPie"
      ]
    },
    "ko": {
      "title": "QueryPie Integrations",
      "description": "데이터 소스에 직접 연결하여 모든 시스템, 앱, 서비스에 걸쳐 완벽한 가시성을 확보하세요.",
      "keywords": [
        "QueryPie integrations",
        "데이터 소스 연동",
        "시스템 연동",
        "QueryPie"
      ]
    },
    "ja": {
      "title": "QueryPie: インテグレーション",
      "description": "データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。",
      "keywords": [
        "QueryPieの統合",
        "データソースの統合",
        "システムの統合",
        "QueryPie"
      ]
    }
  }
};

export function getSolutionStaticMetadata(
  id: SolutionEntry["id"],
  locale: Locale,
): SolutionStaticMetadata | null {
  return solutionStaticMetadata[id]?.[locale] ?? null;
}
