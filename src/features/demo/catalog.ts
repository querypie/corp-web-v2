import { getLocalePath, type Locale } from "@/constants/i18n";

export type DemoMdxCategorySlug = "acp-features" | "aip-features" | "use-cases" | "webinars";
export type DemoPublicSegment = "acp" | "aip" | "use-cases" | "webinars";
export type DemoMdxEntry = {
  categorySlug: DemoMdxCategorySlug;
  segment: DemoPublicSegment;
  id: string;
  slug: string;
  mdxSlug: string;
  locales: Locale[];
  title: Partial<Record<Locale, string>>;
  description: Partial<Record<Locale, string>>;
  imageSrc: Partial<Record<Locale, string>>;
  date: string;
};

export const demoMdxEntries: readonly DemoMdxEntry[] = [
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "1",
    "slug": "integrating-querypie-with-redash",
    "mdxSlug": "acp/1",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "QueryPie x Redash",
      "ko": "QueryPie x Redash",
      "ja": "QueryPie x Redash"
    },
    "description": {
      "en": "QueryPie x Redash",
      "ko": "QueryPie x Redash",
      "ja": "QueryPie x Redash"
    },
    "imageSrc": {
      "en": "/demo/acp/1/thumbnail.webp",
      "ko": "/demo/acp/1/thumbnail.webp",
      "ja": "/demo/acp/1/thumbnail.webp"
    },
    "date": "2025-02-01"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "2",
    "slug": "integrating-querypie-with-metabase",
    "mdxSlug": "acp/2",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "QueryPie x metabase",
      "ko": "QueryPie x metabase",
      "ja": "QueryPie x metabase"
    },
    "description": {
      "en": "QueryPie x metabase",
      "ko": "QueryPie x metabase",
      "ja": "QueryPie x metabase"
    },
    "imageSrc": {
      "en": "/demo/acp/2/thumbnail.webp",
      "ko": "/demo/acp/2/thumbnail.webp",
      "ja": "/demo/acp/2/thumbnail.webp"
    },
    "date": "2025-02-01"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "3",
    "slug": "integrating-querypie-with-tableau",
    "mdxSlug": "acp/3",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "QueryPie x tableau",
      "ko": "QueryPie x tableau",
      "ja": "QueryPie x tableau"
    },
    "description": {
      "en": "QueryPie x tableau",
      "ko": "QueryPie x tableau",
      "ja": "QueryPie x tableau"
    },
    "imageSrc": {
      "en": "/demo/acp/3/thumbnail.webp",
      "ko": "/demo/acp/3/thumbnail.webp",
      "ja": "/demo/acp/3/thumbnail.webp"
    },
    "date": "2025-02-01"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "4",
    "slug": "connect-kubernetes-agent",
    "mdxSlug": "acp/4",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Connect to Kubernetes via the QueryPie Agent",
      "ko": "How to Connect to Kubernetes via the QueryPie Agent",
      "ja": "How to Connect to Kubernetes via the QueryPie Agent"
    },
    "description": {
      "en": "Installing the QueryPie Agent allows you to use third-party Kubernetes client tools such as kubectl, Lens, and k9s.",
      "ko": "Installing the QueryPie Agent allows you to use third-party Kubernetes client tools such as kubectl, Lens, and k9s.",
      "ja": "Installing the QueryPie Agent allows you to use third-party Kubernetes client tools such as kubectl, Lens, and k9s."
    },
    "imageSrc": {
      "en": "/demo/acp/4/thumbnail.webp",
      "ko": "/demo/acp/4/thumbnail.webp",
      "ja": "/demo/acp/4/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "5",
    "slug": "grant-roles-users",
    "mdxSlug": "acp/5",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Grant Roles to Users",
      "ko": "How to Grant Roles to Users",
      "ja": "How to Grant Roles to Users"
    },
    "description": {
      "en": "You can manage access policies for Kubernetes clusters within your organization.",
      "ko": "You can manage access policies for Kubernetes clusters within your organization.",
      "ja": "You can manage access policies for Kubernetes clusters within your organization."
    },
    "imageSrc": {
      "en": "/demo/acp/5/thumbnail.webp",
      "ko": "/demo/acp/5/thumbnail.webp",
      "ja": "/demo/acp/5/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "6",
    "slug": "register-kubernetes-protect",
    "mdxSlug": "acp/6",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Register the Kubernetes You Need to Protect",
      "ko": "How to Register the Kubernetes You Need to Protect",
      "ja": "How to Register the Kubernetes You Need to Protect"
    },
    "description": {
      "en": "This tutorial explains how to synchronize Kubernetes clusters using the cloud synchronization feature or manually register clusters for management.",
      "ko": "This tutorial explains how to synchronize Kubernetes clusters using the cloud synchronization feature or manually register clusters for management.",
      "ja": "This tutorial explains how to synchronize Kubernetes clusters using the cloud synchronization feature or manually register clusters for management."
    },
    "imageSrc": {
      "en": "/demo/acp/6/thumbnail.webp",
      "ko": "/demo/acp/6/thumbnail.webp",
      "ja": "/demo/acp/6/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "7",
    "slug": "review-audit-logs",
    "mdxSlug": "acp/7",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Review Audit Logs",
      "ko": "데이터 영역의 감사 로그를 확인하는 방법",
      "ja": "監査ログを確認する方法"
    },
    "description": {
      "en": "You can view logs related to Database Access Control in the Databases section of QueryPie Audit.",
      "ko": "QueryPie의 Database Access Control에서 발생하는 로그들을 Database Logs에서 확인할 수 있습니다.",
      "ja": "監査ログを確認する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/7/thumbnail.webp",
      "ko": "/demo/acp/7/thumbnail.webp",
      "ja": "/demo/acp/7/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "8",
    "slug": "connect-servers-agent",
    "mdxSlug": "acp/8",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Connect to Servers via the QueryPie Agent",
      "ko": "에이전트를 통해 서버 접속하기",
      "ja": "QueryPieエージェントを使用してサーバーに接続する方法"
    },
    "description": {
      "en": "Installing the QueryPie Agent allows you to use SSH clients like iTerm and SecureCRT.",
      "ko": "QueryPie Agent를 설치하면, iTerm/SecureCRT와 같은 3rd Party 애플리케이션을 사용할 수 있습니다.",
      "ja": "QueryPieエージェントを使用してサーバーに接続する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/8/thumbnail.webp",
      "ko": "/demo/acp/8/thumbnail.webp",
      "ja": "/demo/acp/8/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "9",
    "slug": "submit-role-access-workflow",
    "mdxSlug": "acp/9",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Submit a Workflow for Role Access Request",
      "ko": "사용자 역할 기반의 권한 요청하기",
      "ja": "ロールアクセスリクエストのワークフローを提出する方法"
    },
    "description": {
      "en": "An Access Role Request allows you to conveniently request a role for the required server or Kubernetes cluster.",
      "ko": "Access Role Request는 접근이 필요한 서버에 대해 역할(Role)을 간편하게 요청할 수 있습니다.",
      "ja": "ロールアクセスリクエストのワークフローを提出する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/9/thumbnail.webp",
      "ko": "/demo/acp/9/thumbnail.webp",
      "ja": "/demo/acp/9/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "10",
    "slug": "submit-server-access-workflow",
    "mdxSlug": "acp/10",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Submit a Workflow for Servers Access Requests",
      "ko": "서버 접근 권한 요청하기",
      "ja": "サーバーアクセスリクエストのワークフローを提出する方法"
    },
    "description": {
      "en": "Follow the steps below to request Direct Permission for the server you need access to.",
      "ko": "아래 순서에 따라 접근이 필요한 서버에 대한 Direct Permission을 요청합니다.",
      "ja": "サーバーアクセスリクエストのワークフローを提出する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/10/thumbnail.webp",
      "ko": "/demo/acp/10/thumbnail.webp",
      "ja": "/demo/acp/10/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "11",
    "slug": "use-web-terminal",
    "mdxSlug": "acp/11",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Use the Web Terminal",
      "ko": "웹 터미널 사용 방법",
      "ja": "Webターミナルを使用する方法"
    },
    "description": {
      "en": "QueryPie provides a web terminal for executing commands and a web SFTP for performing various tasks through a web browser.",
      "ko": "QueryPie에서는 웹 브라우저를 통해 명령어를 실행할 수 있는 웹 터미널과 여러 작업을 수행할 수 있는 웹 SFTP를 제공합니다.",
      "ja": "Webターミナルを使用する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/11/thumbnail.webp",
      "ko": "/demo/acp/11/thumbnail.webp",
      "ja": "/demo/acp/11/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "12",
    "slug": "grant-permissions-users-2",
    "mdxSlug": "acp/12",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Grant Permissions to Users",
      "ko": "권한 생성 및 부여 방법",
      "ja": "ユーザーに権限を付与する方法"
    },
    "description": {
      "en": "To maintain a high level of database access control and security, QueryPie provides versatile access control mechanisms based on roles and attributes.",
      "ko": "높은 수준으로 데이터베이스 접근 및 보안을 관리하기 위해 역할과 속성을 기반으로 한 다양한 형태의 액세스 제어를 제공합니다.",
      "ja": "ユーザーに権限を付与する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/12/thumbnail.webp",
      "ko": "/demo/acp/12/thumbnail.webp",
      "ja": "/demo/acp/12/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "13",
    "slug": "grant-permissions-users",
    "mdxSlug": "acp/13",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Grant Permissions to Users",
      "ko": "서버 접근 권한을 직접 부여하는 방법",
      "ja": "ユーザーに権限を付与する方法"
    },
    "description": {
      "en": "Administrators can manage templates for restricted commands that are not allowed on servers and can directly grant or revoke access permissions to servers.",
      "ko": "관리자는 서버에 사용 불가능한 명령어 템플릿을 관리할 수 있으며, 서버에 대한 접근 권한(Permission)을 직접 부여하거나 회수할 수 있습니다.",
      "ja": "ユーザーに権限を付与する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/13/thumbnail.webp",
      "ko": "/demo/acp/13/thumbnail.webp",
      "ja": "/demo/acp/13/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "14",
    "slug": "register-servers",
    "mdxSlug": "acp/14",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Register the Servers You Need to Protect",
      "ko": "관리 대상의 서버 등록 및 AWS 동기화하기",
      "ja": "保護する必要があるサーバーを登録する方法"
    },
    "description": {
      "en": "The cloud synchronization feature enables you to synchronize servers from multiple cloud platforms at once or manually register them.",
      "ko": "클라우드 동기화 기능을 통해 다양한 클라우드의 서버를 한 번에 동기화 해올 수 있는 방법과 수동으로 데이터베이스를 등록하는 방법을 확인할 수 있습니다.",
      "ja": "保護する必要があるサーバーを登録する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/14/thumbnail.webp",
      "ko": "/demo/acp/14/thumbnail.webp",
      "ja": "/demo/acp/14/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "15",
    "slug": "review-audit-logs",
    "mdxSlug": "acp/15",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Review Audit Logs",
      "ko": "데이터 영역의 감사 로그를 확인하는 방법",
      "ja": "監査ログを確認する方法"
    },
    "description": {
      "en": "You can view logs related to Database Access Control in the Databases section of QueryPie Audit.",
      "ko": "QueryPie의 Database Access Control에서 발생하는 로그들을 Database Logs에서 확인할 수 있습니다.",
      "ja": "監査ログを確認する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/15/thumbnail.webp",
      "ko": "/demo/acp/15/thumbnail.webp",
      "ja": "/demo/acp/15/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "16",
    "slug": "connect-database-querypie-agent",
    "mdxSlug": "acp/16",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Connect to Database via the QueryPie Agent",
      "ko": "에이전트를 통해 데이터베이스 접속하기",
      "ja": "QueryPieエージェントを使用してデータベースに接続する方法"
    },
    "description": {
      "en": "Installing the QueryPie Agent allows you to use SQL clients like DataGrip and DBeaver.",
      "ko": "QueryPie Agent를 설치하면, DataGrip, DBeaver와 같은 3rd Party 애플리케이션을 사용할 수 있습니다.",
      "ja": "QueryPieエージェントを使用してデータベースに接続する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/16/thumbnail.webp",
      "ko": "/demo/acp/16/thumbnail.webp",
      "ja": "/demo/acp/16/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "17",
    "slug": "submit-sql-export-workflow",
    "mdxSlug": "acp/17",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Submit a Workflow for SQL Export Requests",
      "ko": "쿼리 결과 및 특정 데이터 다운로드 요청하기",
      "ja": "SQLエクスポートリクエストのワークフローを提出する方法"
    },
    "description": {
      "en": "Follow the steps below to submit an SQL Export Request.",
      "ko": "아래 순서에 따라 SQL Export Request를 상신할 수 있습니다.",
      "ja": "SQLエクスポートリクエストのワークフローを提出する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/17/thumbnail.webp",
      "ko": "/demo/acp/17/thumbnail.webp",
      "ja": "/demo/acp/17/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "18",
    "slug": "submit-sql-request-workflow",
    "mdxSlug": "acp/18",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Submit a Workflow for SQL Requests",
      "ko": "쿼리 실행 요청하기",
      "ja": "SQLリクエストのワークフローを提出する方法"
    },
    "description": {
      "en": "SQL requests allow users to execute queries on specific DB connections for which they do not have permissions.",
      "ko": "특정 DB 커넥션에 대해 권한이 없는 쿼리 실행을 요청할 수 있습니다.",
      "ja": "SQLリクエストのワークフローを提出する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/18/thumbnail.webp",
      "ko": "/demo/acp/18/thumbnail.webp",
      "ja": "/demo/acp/18/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "19",
    "slug": "submit-db-access-workflow",
    "mdxSlug": "acp/19",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Submit a Workflow for DB Access Requests",
      "ko": "데이터베이스 접근 권한 요청하기",
      "ja": "DBアクセスリクエストのワークフローを提出する方法"
    },
    "description": {
      "en": "By requesting privileges for required DB connections, users can gain immediate access upon approval.",
      "ko": "접근이 필요한 DB 커넥션에 대한 Privilege를 요청하고, 승인이 완료될 경우 즉시 권한이 부여되며 QueryPie Web에 있는 SQL Editor 또는 Agent를 통해 권한을 받은 커넥션에 접속할 수 있습니다.",
      "ja": "DBアクセスリクエストのワークフローを提出する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/19/thumbnail.webp",
      "ko": "/demo/acp/19/thumbnail.webp",
      "ja": "/demo/acp/19/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "20",
    "slug": "apply-data-masking-policies",
    "mdxSlug": "acp/20",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Apply Data Masking Policies",
      "ko": "데이터 마스킹 정책 설정하기",
      "ja": "データマスキングポリシーを適用する方法"
    },
    "description": {
      "en": "In an organization, sensitive data like personal or confidential information can be protected by configuring policies that mask such data upon retrieval.",
      "ko": "조직 내에서 개인정보 또는 민감정보와 같이 관리가 필요한 데이터는 조회 시 마스킹되어 표시하도록 정책을 설정할 수 있습니다.",
      "ja": "データマスキングポリシーを適用する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/20/thumbnail.webp",
      "ko": "/demo/acp/20/thumbnail.webp",
      "ja": "/demo/acp/20/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "21",
    "slug": "apply-data-access-policies",
    "mdxSlug": "acp/21",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Apply Data Access Policies",
      "ko": "데이터 접근 제한 정책 설정하기",
      "ja": "データアクセスポリシーを適用する方法"
    },
    "description": {
      "en": "Within your organization, sensitive data that requires access restrictions—such as personal or confidential information—can be protected by setting policies that prevent unauthoriz",
      "ko": "조직 내에서 개인정보 또는 민감정보와 같이 접근 제한이 필요한 데이터는 조회시 해당 데이터를 확인할 수 없도록 정책을 설정할 수 있습니다.",
      "ja": "データアクセスポリシーを適用する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/21/thumbnail.webp",
      "ko": "/demo/acp/21/thumbnail.webp",
      "ja": "/demo/acp/21/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "22",
    "slug": "use-web-editor",
    "mdxSlug": "acp/22",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Use the Web Editor",
      "ko": "웹 SQL 에디터 사용 방법",
      "ja": "Webエディターを使用する方法"
    },
    "description": {
      "en": "QueryPie offers a web SQL editor that allows users to execute queries and retrieve data directly through a web browser.",
      "ko": "QueryPie에서는 웹 브라우저를 통해 쿼리를 실행하고 데이터를 조회할 수 있는 웹 SQL 에디터를 제공합니다.",
      "ja": "Webエディターを使用する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/22/thumbnail.webp",
      "ko": "/demo/acp/22/thumbnail.webp",
      "ja": "/demo/acp/22/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "23",
    "slug": "grant-permissions-users",
    "mdxSlug": "acp/23",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Grant Permissions to Users",
      "ko": "서버 접근 권한을 직접 부여하는 방법",
      "ja": "ユーザーに権限を付与する方法"
    },
    "description": {
      "en": "Administrators can manage templates for restricted commands that are not allowed on servers and can directly grant or revoke access permissions to servers.",
      "ko": "관리자는 서버에 사용 불가능한 명령어 템플릿을 관리할 수 있으며, 서버에 대한 접근 권한(Permission)을 직접 부여하거나 회수할 수 있습니다.",
      "ja": "ユーザーに権限を付与する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/23/thumbnail.webp",
      "ko": "/demo/acp/23/thumbnail.webp",
      "ja": "/demo/acp/23/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "24",
    "slug": "register-databases",
    "mdxSlug": "acp/24",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Register the Databases You Need to Protect",
      "ko": "관리 대상의 데이터베이스 등록 및 AWS 동기화하기",
      "ja": "保護する必要があるデータベースを登録する方法"
    },
    "description": {
      "en": "The cloud synchronization feature enables you to synchronize databases from multiple cloud platforms at once or manually register them.",
      "ko": "클라우드 동기화 기능을 통해 다양한 클라우드의 데이터베이스를 한 번에 동기화 해올 수 있는 방법과 수동으로 데이터베이스를 등록하는 방법을 확인할 수 있습니다.",
      "ja": "保護する必要があるデータベースを登録する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/24/thumbnail.webp",
      "ko": "/demo/acp/24/thumbnail.webp",
      "ja": "/demo/acp/24/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "25",
    "slug": "review-audit-logs",
    "mdxSlug": "acp/25",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Review Audit Logs",
      "ko": "데이터 영역의 감사 로그를 확인하는 방법",
      "ja": "監査ログを確認する方法"
    },
    "description": {
      "en": "You can view logs related to Database Access Control in the Databases section of QueryPie Audit.",
      "ko": "QueryPie의 Database Access Control에서 발생하는 로그들을 Database Logs에서 확인할 수 있습니다.",
      "ja": "監査ログを確認する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/25/thumbnail.webp",
      "ko": "/demo/acp/25/thumbnail.webp",
      "ja": "/demo/acp/25/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "acp-features",
    "segment": "acp",
    "id": "26",
    "slug": "integrate-sso-with-okta",
    "mdxSlug": "acp/26",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "How to Integrate SSO with Okta",
      "ko": "SSO 통합 환경을 위한 Okta 연동 가이드",
      "ja": "OktaでSSOを統合する方法"
    },
    "description": {
      "en": "QueryPie supports Okta integration, allowing you to synchronize users and groups from Okta to grant access and enforce policies.",
      "ko": "QueryPie에서는 Okta 연동을 지원합니다.",
      "ja": "OktaでSSOを統合する方法"
    },
    "imageSrc": {
      "en": "/demo/acp/26/thumbnail.webp",
      "ko": "/demo/acp/26/thumbnail.webp",
      "ja": "/demo/acp/26/thumbnail.webp"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "aip-features",
    "segment": "aip",
    "id": "1",
    "slug": "google-oauth-demo",
    "mdxSlug": "aip/1",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Google OAuth Demo",
      "ja": "AIP Google OAuth デモ"
    },
    "description": {
      "en": "",
      "ja": ""
    },
    "imageSrc": {
      "en": "/demo/aip/1/de-thumb-google-oauth.png",
      "ja": "/demo/aip/1/de-thumb-google-oauth.png"
    },
    "date": "2025-09-23"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "1",
    "slug": "allganize-changsu-lee",
    "mdxSlug": "use-cases/1",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "\"I envision a bright future, similar to the global business outcomes of QueryPie.\"",
      "ko": "\"QueryPie처럼 글로벌 비즈니스 성과를 내는 미래를 상상합니다.\"",
      "ja": "「QueryPie のようにグローバルビジネスでの成果を出す未来を描いています。」"
    },
    "description": {
      "en": "In today's video, we have the privilege of featuring Changsu Lee, the CEO and Founder of Allganize.",
      "ko": "이번 영상에서 이창수 대표는 기업들을 위한 종합적인 사이버 보안 솔루션으로서 QueryPie가 제공하는 중요한 가치를 나눕니다.",
      "ja": "AllganizeのCEO兼創設者であるChangsu Lee氏を特集することができます。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/1/cs-thumb-allganize.png",
      "ko": "/demo/use-cases/1/cs-thumb-allganize.png",
      "ja": "/demo/use-cases/1/cs-thumb-allganize.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "2",
    "slug": "lovo-ai-tom-lee",
    "mdxSlug": "use-cases/2",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "\"QueryPie' s like a tailor shop almost for security.\"",
      "ko": "\"QueryPie는 마치 보안을 위한 맞춤 테일러샵 같아요.\"",
      "ja": "「QueryPieはまるでセキュリティのためのオーダーメードテイラーショップのようです。」"
    },
    "description": {
      "en": "Today, we have a special guest with us: Tom Lee, the CEO and Co-founder of LOVO AI.",
      "ko": "이 영상에서 Tom은 통합 사이버보안 솔루션으로서 QueryPie가 기업에 제공하는 중요한 가치를 공유합니다.",
      "ja": "LOVO AIのCEO兼共同創設者であるTom Lee氏をご招待します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/2/cs-thumb-lovo.png",
      "ko": "/demo/use-cases/2/cs-thumb-lovo.png",
      "ja": "/demo/use-cases/2/cs-thumb-lovo.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "3",
    "slug": "air-company-mori-takeshi",
    "mdxSlug": "use-cases/3",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "\"Beyond monitoring, it’s true governance.\"",
      "ko": "\"단순 모니터링을 넘어선, 진정한 거버넌스입니다.\"",
      "ja": "「監視を超えて、それは真の統治です。」"
    },
    "description": {
      "en": "In today's video, we have the privilege of featuring Mori Takeshi, the CEO of AIR Company Limited in Japan. AIR, also as one of QueryPie Japan's partners, they have been lead IT & software market in Japan for last decades.",
      "ko": "이번 영상에서 Mori 대표님은 AIR가 QueryPie Japan을 전 세계 솔루션 파트너로 선택한 이유와, QueryPie가 일본 기업들에게 제공하는 종합적인 사이버 보안 솔루션으로서의 가치를 공유합니다.",
      "ja": "AIRがQueryPie Japanを世界中のソリューションパートナーの1つに選んだ理由について、森氏はこう語っています。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/3/cs-thumb-air.png",
      "ko": "/demo/use-cases/3/cs-thumb-air.png",
      "ja": "/demo/use-cases/3/cs-thumb-air.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "4",
    "slug": "superb-ai-hyun-kim",
    "mdxSlug": "use-cases/4",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "\"The adoption of AI in traditional industries hinges on data and security as the keys to success.\"",
      "ko": "\"전통 산업에서의 AI 도입은 데이터와 보안이 성공의 핵심 요소입니다.\"",
      "ja": "「伝統産業のAI導入、データとセキュリティが成功の核心要素です。」"
    },
    "description": {
      "en": "In this video, we have the privilege of featuring Hyun Kim, the CEO and Founder of Superb AI.",
      "ko": "MLOps 솔루션을 제공하는 Superb AI의 CEO Hyun Kim은 AI와 컴플라이언스 관계를 재차 강조했습니다. 그 이유는 무엇일까요? 지금 바로 만나보세요!",
      "ja": "このビデオでは、Superb AIのCEO兼創設者であるHyun Kim氏をお迎えし、彼のインサイトをお届けします。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/4/cs-thumb-superb.png",
      "ko": "/demo/use-cases/4/cs-thumb-superb.png",
      "ja": "/demo/use-cases/4/cs-thumb-superb.png"
    },
    "date": "2025-01-06"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "5",
    "slug": "lg-uplus-daniel-ku",
    "mdxSlug": "use-cases/5",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "\"The solution that best fit our automation strategy was undoubtedly QueryPie!\"",
      "ko": "“검토했던 솔루션 중 저희의 자동화 계획과 가장 일치했던 솔루션은 단연 QueryPie였습니다!”",
      "ja": "「私たちの自動化計画と最も一致したソリューションは間違いなくQueryPieでした！」"
    },
    "description": {
      "en": "How did LG U+ implement Zero Trust in a public cloud environment? Discover how QueryPie helped automate security & access control!",
      "ko": "LG U+는 어떻게 퍼블릭 클라우드 환경에서 Zero Trust를 구현했을까요? QueryPie를 활용한 보안 자동화 & 접근 제어 성공사례를 지금 확인하세요!",
      "ja": "LG U+はどのようにパブリッククラウド環境でゼロトラストを実現したのか？ QueryPieを活用したセキュリティ自動化 & アクセス制御の成功事例をご紹介！"
    },
    "imageSrc": {
      "en": "/demo/use-cases/5/cs-thumb-lguplus.png",
      "ko": "/demo/use-cases/5/cs-thumb-lguplus.png",
      "ja": "/demo/use-cases/5/cs-thumb-lguplus.png"
    },
    "date": "2025-03-24"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "6",
    "slug": "querypie-ai-agent-demo",
    "mdxSlug": "use-cases/6",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Control Your AWS Infrastructure with Just One Prompt!",
      "ko": "말 한마디로 AWS 인프라 제어! 🤖 QueryPie AI 실전 데모 최초 공개!",
      "ja": "たった一言でAWSインフラを操作！"
    },
    "description": {
      "en": "See how QueryPie AI transforms cloud operations in our exclusive demo.",
      "ko": "LLM 기반 프로토콜 MCP를 통해, AWS에 직접 접속하지 않고도 인프라를 제어하는 모습을 확인해보세요!",
      "ja": "QueryPie AIがクラウド運用をどう変えるのか、デモ動画でご覧ください。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/6/querypie-ai-agent-en.png",
      "ko": "/demo/use-cases/6/querypie-ai-agent-ko.png",
      "ja": "/demo/use-cases/6/querypie-ai-agent-en.png"
    },
    "date": "2025-04-10"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "7",
    "slug": "data-analytics-agent",
    "mdxSlug": "use-cases/7",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Data Analytics Agent",
      "ja": "AIP活用事例：データ分析エージェント"
    },
    "description": {
      "en": "An AI agent that turns natural language questions into instant data insights and visualizations, empowering teams to analyze data without writing SQL.",
      "ja": "自然言語による質問を瞬時にデータインサイトと可視化に変換するAIエージェント。SQLを書くことなく、チームがデータ分析を行えるようサポートします。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/7/aip-use-case-thumb-1-en.png",
      "ja": "/demo/use-cases/7/aip-use-case-thumb-1-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "8",
    "slug": "data-analytics-agent-2",
    "mdxSlug": "use-cases/8",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Data Analytics Agent 2",
      "ja": "AIP活用事例：データ分析エージェント2"
    },
    "description": {
      "en": "An AI agent that turns natural language questions into instant data insights and visualizations, empowering teams to analyze data without writing SQL.",
      "ja": "自然言語での質問を瞬時にデータインサイトと可視化に変換するAIエージェント。SQLを書くことなく、チームがデータ分析を行えるよう支援します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/8/aip-use-case-thumb-2-en.png",
      "ja": "/demo/use-cases/8/aip-use-case-thumb-2-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "9",
    "slug": "server-access-agent",
    "mdxSlug": "use-cases/9",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Server Access Agent",
      "ja": "AIP活用事例：サーバーアクセスエージェント"
    },
    "description": {
      "en": "An AI agent that automates server access requests and management through natural language, streamlining privileged access while maintaining strict security controls.",
      "ja": "自然言語を通じてサーバーアクセスリクエストと管理を自動化するAIエージェント。厳格なセキュリティ管理を維持しながら、特権アクセスを効率化します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/9/aip-use-case-thumb-3-en.png",
      "ja": "/demo/use-cases/9/aip-use-case-thumb-3-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "10",
    "slug": "kubernetes-manager-agent",
    "mdxSlug": "use-cases/10",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Kubernetes Manager Agent",
      "ja": "AIP活用事例：Kubernetes管理エージェント"
    },
    "description": {
      "en": "An AI agent that simplifies Kubernetes cluster management through conversational commands, enabling teams to deploy, monitor, and troubleshoot without complex kubectl syntax.",
      "ja": "会話形式のコマンドを通じてKubernetesクラスター管理を簡素化するAIエージェント。複雑なkubectl構文を使わずに、チームがデプロイ、監視、トラブルシューティングを実行できるようにします。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/10/aip-use-case-thumb-4-en.png",
      "ja": "/demo/use-cases/10/aip-use-case-thumb-4-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "11",
    "slug": "security-audit-agent",
    "mdxSlug": "use-cases/11",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Security Audit Agent",
      "ja": "AIP活用事例：セキュリティ監査エージェント"
    },
    "description": {
      "en": "An AI agent that transforms security audit analysis through natural language queries, enabling teams to investigate access patterns, detect anomalies, and generate compliance reports instantly.",
      "ja": "自然言語クエリを通じてセキュリティ監査分析を変革するAIエージェント。チームがアクセスパターンの調査、異常検知、コンプライアンスレポートの生成を即座に実行できるようにします。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/11/aip-use-case-thumb-5-en.png",
      "ja": "/demo/use-cases/11/aip-use-case-thumb-5-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "12",
    "slug": "work-collaboration-agent",
    "mdxSlug": "use-cases/12",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Work Collaboration Agent",
      "ja": "AIP活用事例：ワークコラボレーションエージェント"
    },
    "description": {
      "en": "An AI agent that streamlines team workflows by integrating with collaboration tools like Slack, Jira, and Confluence, automating routine tasks and information sharing across platforms.",
      "ja": "複数のプラットフォームにまたがるチームの業務調整を変革するAIエージェント。自然言語でのやり取りを通じて、ワークフローの自動化、情報共有、タスク実行をアプリケーション間の切り替えなしで実現します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/12/aip-use-case-thumb-6-en.png",
      "ja": "/demo/use-cases/12/aip-use-case-thumb-6-ja.png"
    },
    "date": "2025-05-18"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "13",
    "slug": "m365-ai-agent",
    "mdxSlug": "use-cases/13",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: M365 AI Agent",
      "ja": "AIP活用事例： M365 AIエージェント"
    },
    "description": {
      "en": "An AI agent that automates everyday Microsoft 365 work—emails, documents, schedules, and reports—through natural language, streamlining productivity across Outlook, Teams, SharePoint, and more.",
      "ja": "Outlook、Teams、SharePoint、OneDrive、Excelに会話型オートメーションをもたらし、複数のインターフェイスを行き来することなく、社員がより速く業務を進められるようにします。自然言語で、メールの下書き・整理、会議のスケジュール・要約、ドキュメントの整理、スプレッドシートの更新、ステータスレポートの作成を、日々の業務フローの中で直接行えます。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/13/aip-use-case-thumb-7-en.png",
      "ja": "/demo/use-cases/13/aip-use-case-thumb-7-ja.png"
    },
    "date": "2025-10-02"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "14",
    "slug": "credit-check-ai-agent",
    "mdxSlug": "use-cases/14",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Credit Check AI Agent",
      "ja": "AIP活用事例： クレジット審査AIエージェント"
    },
    "description": {
      "en": "An AI agent that automates creditworthiness checks by retrieving applicant data, scoring risk, and generating decision-ready summaries—faster approvals with consistent policy enforcement.",
      "ja": "申込者データの取得、リスクスコアリング、意思決定用サマリーの生成を自動化し、ポリシーを一貫適用しながら審査の迅速化を実現するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/14/aip-use-case-thumb-8-en.png",
      "ja": "/demo/use-cases/14/aip-use-case-thumb-8-ja.png"
    },
    "date": "2025-10-03"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "15",
    "slug": "factory-iot-ai-agent",
    "mdxSlug": "use-cases/15",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Factory IoT AI Agent",
      "ja": "AIP活用事例： ファクトリーIoT AIエージェント"
    },
    "description": {
      "en": "An AI agent that monitors factory IoT signals, detects anomalies, and orchestrates maintenance workflows through natural language—bridging OT data with IT systems for faster, safer operations.",
      "ja": "ファクトリーIoTシグナルを監視し、異常を検知し、自然言語でメンテナンスワークフローをオーケストレーションするAIエージェント。OTデータとITシステムを橋渡しし、より迅速で安全なオペレーションを実現します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/15/aip-use-case-thumb-9-en.png",
      "ja": "/demo/use-cases/15/aip-use-case-thumb-9-ja.png"
    },
    "date": "2025-10-03"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "16",
    "slug": "dev-insight-ai-agent",
    "mdxSlug": "use-cases/16",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Development Insight AI Agent",
      "ja": "AIP活用事例： 開発インサイトAIエージェント"
    },
    "description": {
      "en": "An AI agent that turns engineering exhaust—code, PRs, issues, builds, and incidents—into actionable insights and summaries through natural language.",
      "ja": "コード、PR、課題、ビルド、インシデントといったエンジニアリングのエグゾーストを、自然言語で行動可能なインサイトとサマリーに変換するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/16/aip-use-case-thumb-10-en.png",
      "ja": "/demo/use-cases/16/aip-use-case-thumb-10-ja.png"
    },
    "date": "2025-10-14"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "17",
    "slug": "aircraft-maintenance-ai-agent",
    "mdxSlug": "use-cases/17",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Aircraft Maintenance AI Agent",
      "ja": "AIP活用事例： 航空機整備AIエージェント"
    },
    "description": {
      "en": "An AI agent that accelerates aircraft maintenance by turning logs, manuals, and sensor data into diagnostic insights and work orders—improving safety, uptime, and compliance.",
      "ja": "ログ、マニュアル、センサーデータを診断インサイトと作業指示（ワークオーダー）に変換し、航空機の安全性、稼働率、コンプライアンスを向上させるAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/17/aip-use-case-thumb-11-en.png",
      "ja": "/demo/use-cases/17/aip-use-case-thumb-11-ja.png"
    },
    "date": "2025-10-15"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "18",
    "slug": "baggage-operations-ai-agent",
    "mdxSlug": "use-cases/18",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Baggage Operations AI Agent",
      "ja": "AIP活用事例： 手荷物業務AIエージェント"
    },
    "description": {
      "en": "An AI agent that delivers real-time baggage visibility, predicts disruptions, and automates recovery workflows across airlines, airports, and ground handling teams.",
      "ja": "リアルタイムの手荷物可視化を提供し、混乱を予測し、航空会社・空港・グランドハンドリング間のリカバリーワークフローを自動化するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/18/aip-use-case-thumb-12-en.png",
      "ja": "/demo/use-cases/18/aip-use-case-thumb-12-ja.png"
    },
    "date": "2025-10-15"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "19",
    "slug": "aircrew-scheduler-ai-agent",
    "mdxSlug": "use-cases/19",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: AirCrew Scheduler AI Agent",
      "ja": "AIP活用事例： 乗務員スケジューリングAIエージェント"
    },
    "description": {
      "en": "An AI agent that optimizes crew pairing, rostering, and recovery from disruptions—turning policies, qualifications, and schedules into fast, compliant decisions through natural language.",
      "ja": "ポリシー、資格、スケジュールを自然言語で迅速かつ準拠した意思決定に変換し、クルーペアリング、ロスタリング、ディスラプションからの復旧を最適化するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/19/aip-use-case-thumb-13-en.png",
      "ja": "/demo/use-cases/19/aip-use-case-thumb-13-ja.png"
    },
    "date": "2025-10-15"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "20",
    "slug": "military-hr-ai-agent",
    "mdxSlug": "use-cases/20",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Military Service & HR AI Agent",
      "ja": "AIP活用事例： 兵役・人事AIエージェント"
    },
    "description": {
      "en": "An AI agent that streamlines military personnel management—assignments, leave, evaluations, and records—through natural language, ensuring faster administration with full oversight.",
      "ja": "配置、休暇、評価、記録管理を自然言語で効率化し、完全な監督体制のもとで軍人事業務を迅速化するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/20/aip-use-case-thumb-14-en.png",
      "ja": "/demo/use-cases/20/aip-use-case-thumb-14-ja.png"
    },
    "date": "2025-10-29"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "21",
    "slug": "incident-mgmt-ai-agent",
    "mdxSlug": "use-cases/21",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Reporting & Incident Management AI Agent",
      "ja": "AIP活用事例： 報告・インシデント管理AIエージェント"
    },
    "description": {
      "en": "An AI agent that consolidates operational status, generates standard reports, and orchestrates alerts and actions—streamlining situation management through natural language.",
      "ja": "運用ステータスを統合し、標準レポートを生成し、アラートとアクションをオーケストレーションするAIエージェント。自然言語で状況管理を効率化します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/21/aip-use-case-thumb-15-en.png",
      "ja": "/demo/use-cases/21/aip-use-case-thumb-15-ja.png"
    },
    "date": "2025-10-29"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "22",
    "slug": "aws-log-analytics-agent",
    "mdxSlug": "use-cases/22",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: AWS Log Analytics AI Agent",
      "ja": "AIP活用事例： AWSログ分析AIエージェント"
    },
    "description": {
      "en": "An AI agent that investigates AWS logs with natural language—correlating CloudWatch, CloudTrail, and service logs to speed up incident triage and root-cause analysis.",
      "ja": "自然言語でAWSログを調査し、CloudWatch、CloudTrail、各種サービスログを相関して、インシデントのトリアージと根本原因分析を加速するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/22/aip-use-case-thumb-16-en.png",
      "ja": "/demo/use-cases/22/aip-use-case-thumb-16-ja.png"
    },
    "date": "2025-11-03"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "23",
    "slug": "aws-inspector-ai-agent",
    "mdxSlug": "use-cases/23",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: AWS Inspector Insight AI Agent",
      "ja": "AIP活用事例： AWSインサイトAIエージェント"
    },
    "description": {
      "en": "An AI agent that turns AWS Inspector findings into prioritized remediation plans—summarizing risk, owners, and fixes with one conversational request.",
      "ja": "AWS Inspectorの検出結果を、優先度付きの是正計画へ変換するAIエージェント。リスク、担当者、修正内容を、1回の会話型リクエストで要約します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/23/aip-use-case-thumb-17-en.png",
      "ja": "/demo/use-cases/23/aip-use-case-thumb-17-ja.png"
    },
    "date": "2025-11-03"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "24",
    "slug": "aws-solutions-architect-ai-agent",
    "mdxSlug": "use-cases/24",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: AWS Solutions Architect AI Agent",
      "ja": "AIP活用事例： AWSソリューションアーキテクトAIエージェント"
    },
    "description": {
      "en": "An AI agent that designs and validates AWS architectures—proposing patterns, estimating cost, and checking best practices through natural language.",
      "ja": "自然言語でパターン提案、コスト見積もり、ベストプラクティス検証を行い、AWSアーキテクチャを設計・妥当性確認するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/24/aip-use-case-thumb-18-en.png",
      "ja": "/demo/use-cases/24/aip-use-case-thumb-18-ja.png"
    },
    "date": "2025-11-05"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "25",
    "slug": "portfolio-insight-ai-agent",
    "mdxSlug": "use-cases/25",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Portfolio Insight AI Agent",
      "ja": "AIP活用事例： 投資ポートフォリオ・インサイトAIエージェント"
    },
    "description": {
      "en": "An AI agent that turns market and account data into portfolio insights—performance, allocation, and risk—delivered through natural language with actionable next steps.",
      "ja": "市場データと口座データを自然言語での会話を通じて、パフォーマンス、アロケーション、リスクのポートフォリオインサイトに変換し、行動可能な次の一手まで提示するAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/25/aip-use-case-thumb-19-en.png",
      "ja": "/demo/use-cases/25/aip-use-case-thumb-19-ja.png"
    },
    "date": "2025-11-11"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "26",
    "slug": "investment-analyst-ai-agent",
    "mdxSlug": "use-cases/26",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Investment Analyst AI Agent",
      "ja": "AIP活用事例： 投資アナリストAIエージェント"
    },
    "description": {
      "en": "An AI agent that accelerates investment research—screening, modeling, and coverage updates—by turning natural language into analyst-grade insights and artifacts.",
      "ja": "自然言語で指示するだけで、スクリーニングからモデル更新、決算要約、レポート作成までを自動化する投資リサーチ向けAIエージェント。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/26/aip-use-case-thumb-20-en.png",
      "ja": "/demo/use-cases/26/aip-use-case-thumb-20-ja.png"
    },
    "date": "2025-11-11"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "27",
    "slug": "quotation-ai-agent",
    "mdxSlug": "use-cases/27",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Quotation AI Agent",
      "ja": "AIP活用事例： 見積AIエージェント"
    },
    "description": {
      "en": "No matter how complex your quotation logic is, AIP structures it as a Skill and delivers error-free quotes instantly.",
      "ja": "どれほど複雑な見積ロジックでも、AIPがスキルとして構造化し、正確な見積書を即時出力します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/27/aip-use-case-thumb-27-en.png",
      "ja": "/demo/use-cases/27/aip-use-case-thumb-27-ja.png"
    },
    "date": "2026-02-26"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "28",
    "slug": "quotation-analyze-ai-agent",
    "mdxSlug": "use-cases/28",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: Quotation Analysis AI Agent",
      "ja": "AIP活用事例： 見積分析AIエージェント"
    },
    "description": {
      "en": "Are you spending valuable time opening and organizing hundreds of local files and password-protected quotations one by one? With AIP, analysis is completed on the spot — without uploads and without data exposure.",
      "ja": "数百におよぶローカルファイルや、パスワード付きの見積書を一つひとつ開いて整理する作業に、貴重な時間を費やしていませんか？AIPなら、アップロード不要・データ流出なしで、その場で分析を完了します。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/28/aip-use-case-thumb-28-en.png",
      "ja": "/demo/use-cases/28/aip-use-case-thumb-28-ja.png"
    },
    "date": "2026-03-02"
  },
  {
    "categorySlug": "use-cases",
    "segment": "use-cases",
    "id": "29",
    "slug": "seo-analyst",
    "mdxSlug": "use-cases/29",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "AIP Use Case: SEO Analysis AI Agent",
      "ja": "AIP活用事例： SEO分析AIエージェント"
    },
    "description": {
      "en": "High-cost SEO tools are no longer a requirement. With QueryPie AIP, you can perform in-depth website analysis, identify actionable improvement points, and generate intuitive visual dashboards — all within minutes.",
      "ja": "高額なSEOツールに頼ることなく、QueryPie AIPを活用することでWebサイトの詳細な分析と改善ポイントの整理、そして視覚的に分かりやすいダッシュボード作成までを短時間で実現できます。"
    },
    "imageSrc": {
      "en": "/demo/use-cases/29/aip-use-case-thumb-29-en.png",
      "ja": "/demo/use-cases/29/aip-use-case-thumb-29-ja.png"
    },
    "date": "2026-03-02"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "1",
    "slug": "cloud-certification-shortest-path",
    "mdxSlug": "webinars/1",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Discover the shortest path to getting certified in the cloud era with our best practices",
      "ko": "클라우드 시대에서 ISMS 인증을 빠르게 취득할 수 있는 최단 경로를 알아보세요!",
      "ja": "ベストプラクティスで探るクラウド時代における認定資格を取得する最善の方法"
    },
    "description": {
      "en": "Are you going round in circles trying to get certified? Discover the shortest path to getting certified in the cloud era with our best practices.",
      "ko": "ISMS 인증을 받기 위해 계속 방황하고 계신가요? 우리의 베스트 프랙티스로 클라우드 시대에서 인증을 빠르게 취득할 수 있는 최단 경로를 확인하세요.",
      "ja": "ISMS悪夢をご覧になっていますか？ 認証を受けるためにぐるぐる回っているなら、ここAWSウェビナーの核心整理内容を確認してみてください！"
    },
    "imageSrc": {
      "en": "/demo/webinar/1/wb-thumb-1.png",
      "ko": "/demo/webinar/1/wb-thumb-1.png",
      "ja": "/demo/webinar/1/wb-thumb-1.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "2",
    "slug": "okta-paloalto-querypie-webinar",
    "mdxSlug": "webinars/2",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Okta x PaloAlto Networks x QueryPie: The OPQ Webinar",
      "ko": "Okta x PaloAlto Networks x QueryPie: The OPQ Webinar",
      "ja": "Okta x Palo Alto Networks x QueryPie: OPQ ウェビナー"
    },
    "description": {
      "en": "Going beyond cloud security to cloud-native security, the OPQ Alliance (Okta x Palo Alto Networks x QueryPie) will show you the way. Watch this three-part webinar to learn more!",
      "ko": "클라우드 보안을 넘어 클라우드 네이티브 보안으로, OPQ 얼라이언스(Okta x Palo Alto Networks x QueryPie)가 그 길을 안내합니다. 이 3부작 웨비나를 시청하고 더 많은 정보를 확인하세요!",
      "ja": "技術が高度化するにつれて、ハッカーの攻撃方法もまた精巧になり、複雑になっています。このような状況の中で、新しいセキュリティ標準を設けるために、Okta、Palo Alto Networks、そしてQueryPieが力を合わせてOPQアライアンスを結成しました。"
    },
    "imageSrc": {
      "en": "/demo/webinar/2/wb-thumb-2.png",
      "ko": "/demo/webinar/2/wb-thumb-2.png",
      "ja": "/demo/webinar/2/wb-thumb-2.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "3",
    "slug": "device-security-mdm-kandji",
    "mdxSlug": "webinars/3",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Achieving device security through MDM: Kandji x QueryPie",
      "ko": "MDM을 통한 디바이스 보안의 완성: Kandji x QueryPie",
      "ja": "MDM によるデバイスセキュリティの実現: Kandji x QueryPie"
    },
    "description": {
      "en": "In this webinar, our security experts Brant Hwang (CEO, QueryPie) and Kenny Park (CISO, QueryPie) discuss how to secure your Apple devices and utilize Kandji’s powerful, purpose-built tools to create an intuitive, streamlined experience for admins and users alike.",
      "ko": "이번 웨비나에서는 보안 전문가인 Brant(CEO, QueryPie)와 Kenny(CISO, QueryPie)가 Apple 디바이스를 보안하는 방법과 Kandji의 강력한 맞춤형 도구를 활용해 관리자가 사용자에게 직관적이고 효율적인 경험을 제공하는 방법을 다룹니다.",
      "ja": "Iこのウェビナーでは、QueryPieのセキュリティ専門家であるBrant Hwang(CEO)とKenny Park(CISO)がApple機器のセキュリティ強化方法とKandjiの強力で特化されたツールを活用して管理者とユーザーの両方に直観的で簡素化された経験を提供する方法について議論します。"
    },
    "imageSrc": {
      "en": "/demo/webinar/3/wb-thumb-3.png",
      "ko": "/demo/webinar/3/wb-thumb-3.png",
      "ja": "/demo/webinar/3/wb-thumb-3.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "4",
    "slug": "flex-querypie-secrets",
    "mdxSlug": "webinars/4",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Flex Unveils the Secrets of QueryPie",
      "ko": "flex가 찾아낸 QueryPie의 비밀을 폭로합니다!",
      "ja": "Flexが公開するQueryPieの秘密！"
    },
    "description": {
      "en": "Flex, Korea's top HR platform, unveils the surprising revelations they discovered after integrating QueryPie into their system. What hidden magic in QueryPie completely captivated the Flex team and transformed the way they work?",
      "ko": "Flex, 한국 최고의 HR 플랫폼, QueryPie를 도입한 후 발견한 놀라운 비밀을 공개합니다. QueryPie 속 숨겨진 마법이 어떻게 Flex 팀을 사로잡아 업무 방식을 완전히 변화시켰을까요?",
      "ja": "韓国最高のHRプラットフォームであるFlexがQueryPieをシステムに導入した後に発見した驚くべき事実を公開します。 果たしてFlexチームを魅了し、業務方式を革新的に変化させたQueryPieの隠された魔法は何でしょうか？"
    },
    "imageSrc": {
      "en": "/demo/webinar/4/wb-thumb-4.png",
      "ko": "/demo/webinar/4/wb-thumb-4.png",
      "ja": "/demo/webinar/4/wb-thumb-4.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "5",
    "slug": "ztna-security-prisma-access",
    "mdxSlug": "webinars/5",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Achieve Perfect ZTNA Security with Prisma Access!",
      "ko": "ZTNA보안, Prisma Access로 완벽하게!",
      "ja": "Prisma Accessで完璧なZTNAセキュリティを実現！"
    },
    "description": {
      "en": "Why Did QueryPie Choose Prisma Access? Dive into the details of how QueryPie identified Prisma Access as the ultimate choice for their security needs.",
      "ko": "제로트러스트 노하우 공개! 왜 QueryPie는 프리즈마 액세스(Prisma Access)를 선택했을까? 간단하지만 중요한 핵심 비밀을 공유합니다!",
      "ja": "QueryPieがPrismaアクセスを選択した理由？ QueryPieがPrisma Accessをセキュリティニーズのための最終的な選択肢として特定した方法の詳細をご覧ください。"
    },
    "imageSrc": {
      "en": "/demo/webinar/5/wb-thumb-5.png",
      "ko": "/demo/webinar/5/wb-thumb-5.png",
      "ja": "/demo/webinar/5/wb-thumb-5.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "6",
    "slug": "querypie-side-kick-teaser-ko",
    "mdxSlug": "webinars/6",
    "locales": [
      "en",
      "ko"
    ],
    "title": {
      "en": "본격 고객 소통 콘텐츠 [Ch.쿼리파이: 3단 옆차기]가 찾아옵니다!",
      "ko": "본격 고객 소통 콘텐츠 [Ch.쿼리파이: 3단 옆차기]가 찾아옵니다!"
    },
    "description": {
      "en": "쿼리파이에 대해 알고 싶고 궁금한 것이 많은 분들을 위해 준비하였습니다. DB접근제어, 시스템 접근제어, 쿠버네티스 접근제어, 웹 어플리케이션 접근제어, 그리고 데이터 디스커버리에 이르기까지....클라우드와 온프레미스에서 기업의 인프라를 아우르는 접근제어와 감사 솔루션을 아우르는 쿼리파이의 핵심만 쏙쏙 뽑았습니다.",
      "ko": "쿼리파이에 대해 알고 싶고 궁금한 것이 많은 분들을 위해 준비하였습니다. DB접근제어, 시스템 접근제어, 쿠버네티스 접근제어, 웹 어플리케이션 접근제어, 그리고 데이터 디스커버리에 이르기까지....클라우드와 온프레미스에서 기업의 인프라를 아우르는 접근제어와 감사 솔루션을 아우르는 쿼리파이의 핵심만 쏙쏙 뽑았습니다."
    },
    "imageSrc": {
      "en": "/demo/webinar/6/3dk-intro-ko.png",
      "ko": "/demo/webinar/6/3dk-intro-ko.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "7",
    "slug": "querypie-integrations-scim-slack-vault-ko",
    "mdxSlug": "webinars/7",
    "locales": [
      "en",
      "ko"
    ],
    "title": {
      "en": "Ep.1 QueryPie Integrations: 자동화 핵심만 찌르기!—SCIM, 얍! Vault, 얍! Slack 결재 워크플로 연동, 얍!",
      "ko": "Ep.1 QueryPie Integrations: 자동화 핵심만 찌르기!—SCIM, 얍! Vault, 얍! Slack 결재 워크플로 연동, 얍!"
    },
    "description": {
      "en": "쿼리파이 제품에는 어떤 기능들이 있고 해당 기능들은 각기 어떤 역할을 하는지 궁금하시죠? Ep. 1에서는 고객을 대변하여 쿼리파이 제품의 주요 기능들에 대해 파헤쳐 보았습니다.",
      "ko": "쿼리파이 제품에는 어떤 기능들이 있고 해당 기능들은 각기 어떤 역할을 하는지 궁금하시죠? Ep. 1에서는 고객을 대변하여 쿼리파이 제품의 주요 기능들에 대해 파헤쳐 보았습니다."
    },
    "imageSrc": {
      "en": "/demo/webinar/7/3dk-ep1-ko.png",
      "ko": "/demo/webinar/7/3dk-ep1-ko.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "8",
    "slug": "querypie-integrations-scim-slack-vault-ja",
    "mdxSlug": "webinars/8",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "エピソード 1 QueryPie の統合: 自動化の核心を突く！- SCIM、Vault、Slack承認ワークフロー連携",
      "ja": "エピソード 1 QueryPie の統合: 自動化の核心を突く！- SCIM、Vault、Slack承認ワークフロー連携"
    },
    "description": {
      "en": "QueryPieにはどんな機能があり、それらの機能はそれぞれどんな役割を果たすのか気になりますよね？エピソード1では、お客様に代わってQueryPie製品の主要な機能について探ってみました。",
      "ja": "QueryPieにはどんな機能があり、それらの機能はそれぞれどんな役割を果たすのか気になりますよね？エピソード1では、お客様に代わってQueryPie製品の主要な機能について探ってみました。"
    },
    "imageSrc": {
      "en": "/demo/webinar/8/3dk-ep1-ja.png",
      "ja": "/demo/webinar/8/3dk-ep1-ja.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "9",
    "slug": "querypie-databases-nosql-ledger-ko",
    "mdxSlug": "webinars/9",
    "locales": [
      "en",
      "ko"
    ],
    "title": {
      "en": "Ep. 2 쿼리파이 DAC: DB 고민 뿌시기!—DB 통합 관리, 얍! NoSQL, 얍! 원장 데이터, 얍!",
      "ko": "Ep. 2 쿼리파이 DAC: DB 고민 뿌시기!—DB 통합 관리, 얍! NoSQL, 얍! 원장 데이터, 얍!"
    },
    "description": {
      "en": "축적된 민감정보에 대해 보안은 강화하고, 접근 제어와 관리를 편리하게 하여 보안 안정성을 확보할 수 있도록 쿼리파이의 DB접근제어(쿼리파이 DAC)가 중추적 역할을 해 주고 있는데요,  멀티 클라우드 환경 속에서 방대한 민감정보와 데이터를 안정적으로 관리할 수 있는 방법에 대해 살펴보았습니다.",
      "ko": "축적된 민감정보에 대해 보안은 강화하고, 접근 제어와 관리를 편리하게 하여 보안 안정성을 확보할 수 있도록 쿼리파이의 DB접근제어(쿼리파이 DAC)가 중추적 역할을 해 주고 있는데요,  멀티 클라우드 환경 속에서 방대한 민감정보와 데이터를 안정적으로 관리할 수 있는 방법에 대해 살펴보았습니다."
    },
    "imageSrc": {
      "en": "/demo/webinar/9/3dk-ep2-ko.png",
      "ko": "/demo/webinar/9/3dk-ep2-ko.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "10",
    "slug": "querypie-databases-nosql-ledger-ja",
    "mdxSlug": "webinars/10",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "エピソード 2 QueryPie DAC: データベースの悩みを解決！- データベース統合管理、NoSQL、元帳データ",
      "ja": "エピソード 2 QueryPie DAC: データベースの悩みを解決！- データベース統合管理、NoSQL、元帳データ"
    },
    "description": {
      "en": "蓄積された機密情報に対して、セキュリティを強化し、アクセス制御と管理を簡便に行い、セキュリティの安定性を確保できるように、QueryPieのDBアクセス制御 (QueryPie DAC) が中枢的な役割を果たしています。マルチクラウド環境の中で、膨大な機密情報とデータを安全に管理する方法について説明いたします。",
      "ja": "蓄積された機密情報に対して、セキュリティを強化し、アクセス制御と管理を簡便に行い、セキュリティの安定性を確保できるように、QueryPieのDBアクセス制御 (QueryPie DAC) が中枢的な役割を果たしています。マルチクラウド環境の中で、膨大な機密情報とデータを安全に管理する方法について説明いたします。"
    },
    "imageSrc": {
      "en": "/demo/webinar/10/3dk-ep2-ja.png",
      "ja": "/demo/webinar/10/3dk-ep2-ja.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "11",
    "slug": "querypie-server-management-ko",
    "mdxSlug": "webinars/11",
    "locales": [
      "en",
      "ko"
    ],
    "title": {
      "en": "Ep. 3 쿼리파이 SAC: 서버 관리 허들 박살내기!—대량 서버 관리, 얍! Auto-Scaling, 얍! 권한 및 정책, 얍!",
      "ko": "Ep. 3 쿼리파이 SAC: 서버 관리 허들 박살내기!—대량 서버 관리, 얍! Auto-Scaling, 얍! 권한 및 정책, 얍!"
    },
    "description": {
      "en": "3편에서는 쿼리파이의 시스텝 접근제어 솔루션인 ‘쿼리파이 SAC(System Access Controller)’를 활용해 다량의 서버와 멀티 클라우드 환경 속에서 수많은 권한을 효율적으로 관리할 수 있는 방법에 대해 깐깐하게 살펴봤습니다.",
      "ko": "3편에서는 쿼리파이의 시스텝 접근제어 솔루션인 ‘쿼리파이 SAC(System Access Controller)’를 활용해 다량의 서버와 멀티 클라우드 환경 속에서 수많은 권한을 효율적으로 관리할 수 있는 방법에 대해 깐깐하게 살펴봤습니다."
    },
    "imageSrc": {
      "en": "/demo/webinar/11/3dk-ep3-ko.png",
      "ko": "/demo/webinar/11/3dk-ep3-ko.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "12",
    "slug": "querypie-server-management-ja",
    "mdxSlug": "webinars/12",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "エピソード 3 QueryPie SAC: サーバー管理のハードルを打ち破る！- 大規模サーバー管理、自動スケーリング、権限とポリシー",
      "ja": "エピソード 3 QueryPie SAC: サーバー管理のハードルを打ち破る！- 大規模サーバー管理、自動スケーリング、権限とポリシー"
    },
    "description": {
      "en": "エピソード3では、QueryPieのシステムアクセス制御ソリューションである「QueryPie SAC (System Access Controller)」を活用し、大量のサーバとマルチクラウド環境にわたる多数の権限を効率的に管理する方法について詳しく説明します。",
      "ja": "エピソード3では、QueryPieのシステムアクセス制御ソリューションである「QueryPie SAC (System Access Controller)」を活用し、大量のサーバとマルチクラウド環境にわたる多数の権限を効率的に管理する方法について詳しく説明します。"
    },
    "imageSrc": {
      "en": "/demo/webinar/12/3dk-ep3-ja.png",
      "ja": "/demo/webinar/12/3dk-ep3-ja.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "13",
    "slug": "querypie-kubernetes-management-ko",
    "mdxSlug": "webinars/13",
    "locales": [
      "en",
      "ko"
    ],
    "title": {
      "en": "Ep. 4 쿼리파이 KAC: 쿠버네티스 일격필살!—멀티 K8s 클러스터, 얍! K8s 리소스, 얍! Pod 접근 이력, 얍!",
      "ko": "Ep. 4 쿼리파이 KAC: 쿠버네티스 일격필살!—멀티 K8s 클러스터, 얍! K8s 리소스, 얍! Pod 접근 이력, 얍!"
    },
    "description": {
      "en": "4편에서는 쿼리파이의 쿠버네티스 접근 제어 솔루션인 ‘쿼리파이 KAC(Kubernetes Access Controller)’를 활용해 쿠버네티스 환경에서도 탄탄한 보안 환경을 유지할 수 있는 방법에 대해 파헤쳐 보았습니다.",
      "ko": "4편에서는 쿼리파이의 쿠버네티스 접근 제어 솔루션인 ‘쿼리파이 KAC(Kubernetes Access Controller)’를 활용해 쿠버네티스 환경에서도 탄탄한 보안 환경을 유지할 수 있는 방법에 대해 파헤쳐 보았습니다."
    },
    "imageSrc": {
      "en": "/demo/webinar/13/3dk-ep4-ko.png",
      "ko": "/demo/webinar/13/3dk-ep4-ko.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "14",
    "slug": "querypie-kubernetes-management-ja",
    "mdxSlug": "webinars/14",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "エピソード 4 QueryPie KAC: クーバネティスをノックアウト！ - マルチ クーバネティス クラスタ、クーバネティス リソース、Podアクセス履歴",
      "ja": "エピソード 4 QueryPie KAC: クーバネティスをノックアウト！ - マルチ クーバネティス クラスタ、クーバネティス リソース、Podアクセス履歴"
    },
    "description": {
      "en": "エピソード 4では、QueryPie のクーバネティスアクセス制御ソリューションである “QueryPie KAC (Kubernetes Access Controller)” を活用して、クーバネティス環境でも堅固なセキュリティ環境を維持する方法について掘り下げてみました。",
      "ja": "エピソード 4では、QueryPie のクーバネティスアクセス制御ソリューションである “QueryPie KAC (Kubernetes Access Controller)” を活用して、クーバネティス環境でも堅固なセキュリティ環境を維持する方法について掘り下げてみました。"
    },
    "imageSrc": {
      "en": "/demo/webinar/14/3dk-ep4-ja.png",
      "ja": "/demo/webinar/14/3dk-ep4-ja.png"
    },
    "date": "2024-11-29"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "15",
    "slug": "querypie-japan-webinar-security",
    "mdxSlug": "webinars/15",
    "locales": [
      "en",
      "ja"
    ],
    "title": {
      "en": "ウェビナー参加申し込み情報漏洩対策、内部セキュリティ対策セミナー",
      "ja": "ウェビナー参加申し込み情報漏洩対策、内部セキュリティ対策セミナー"
    },
    "description": {
      "en": "情報漏洩対策は十分にされていますか？事故が起きてからは遅い！",
      "ja": "情報漏洩対策は十分にされていますか？事故が起きてからは遅い！"
    },
    "imageSrc": {
      "en": "/demo/webinar/15/wb-thumb-15.png",
      "ja": "/demo/webinar/15/wb-thumb-15.png"
    },
    "date": "2024-12-05"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "16",
    "slug": "air-company-querypie-zerotrust-webinar",
    "mdxSlug": "webinars/16",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "【5/29（木）開催】ウェビナー「今さら聞けないゼロトラストのはじめかた」"
    },
    "description": {
      "ja": "近年クラウド環境の普及に伴い、企業内部からの情報漏えいのリスクが高まっています。クラウドは簡単に構築が可能な性質上、リソース管理が煩雑になってしまうことが多いのが現状です。本ウェビナーでは、そうした企業が持つクラウドセキュリティの関する課題に対して効率的にアプローチする方法についてご紹介いたします！"
    },
    "imageSrc": {
      "ja": "/demo/webinar/16/air-company-zerotrust.png"
    },
    "date": "2025-05-15"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "17",
    "slug": "findy-querypie-mcp-webinar",
    "mdxSlug": "webinars/17",
    "locales": [
      "en",
      "ko",
      "ja"
    ],
    "title": {
      "en": "Join FINDY's CTO and QueryPie for an AI & MCP Online Seminar",
      "ko": "Findy의 CTO와 QueryPie가 함께하는 AI & MCP 온라인 세미나에 초대합니다.",
      "ja": "FindyのCTOとQueryPieが共演！AI & MCP オンラインセミナー開催のお知らせ"
    },
    "description": {
      "en": "Learn how to build an MCP server in just 10 minutes! We'll walk you through it with a live coding session in Korean. If you're curious about AI or MCP, don't miss out!",
      "ko": "단 10분 만에 MCP 서버를 구현하는 방법! 당일 라이브 코딩으로 보여드립니다. 라이브 코딩은 한국어로 진행되니 AI와 MCP에 대해 궁금하셨던 분들, 이번 기회를 절대 놓치지 마세요!",
      "ja": "たった10分でMCPサーバーを構築する方法を、当日のライブコーディングでご紹介します。ライブコーディングは韓国語で実施されます。AIやMCPにご興味のある方は、ぜひこの機会をお見逃しなく！"
    },
    "imageSrc": {
      "en": "/demo/webinar/17/findy-querypie-mcp-webinar.png",
      "ko": "/demo/webinar/17/findy-querypie-mcp-webinar.png",
      "ja": "/demo/webinar/17/findy-querypie-mcp-webinar.png"
    },
    "date": "2025-05-19"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "18",
    "slug": "air-company-querypie-mcp-webinar",
    "mdxSlug": "webinars/18",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "【7/3（木）開催】ウェビナー「「MCP」の基礎がわかる”超”入門講座 」"
    },
    "description": {
      "ja": "AIが世界を動かす時代が、いよいよ現実に。その中心にあるのが、革新的なプロトコル「MCP」です。従来の常識を覆し、AI活用を一気に加速させました。今こそ、AI時代の必須スキル「MCP」を、しっかり学んでみませんか？ 生成AI / MCPをフル活用し、自律型セキュリティ運用を実現する 「QueryPie Secure Enterprise AI Hub」の最新情報をお届けします。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/18/air-company-mcp.png"
    },
    "date": "2025-06-05"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "19",
    "slug": "air-company-querypie-mcp-webinar",
    "mdxSlug": "webinars/19",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "【8/5（火）開催】ウェビナー「「MCP」の基礎がわかる”超”入門講座 」"
    },
    "description": {
      "ja": "AIが世界を動かす時代が、いよいよ現実に。その中心にあるのが、革新的なプロトコル「MCP」です。従来の常識を覆し、AI活用を一気に加速させました。今こそ、AI時代の必須スキル「MCP」を、しっかり学んでみませんか？"
    },
    "imageSrc": {
      "ja": "/demo/webinar/19/air-company-mcp2.png"
    },
    "date": "2025-07-08"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "20",
    "slug": "air-company-querypie-mcp-webinar",
    "mdxSlug": "webinars/20",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "【9/25(木)ウェビナー】「成果に直結！MCP活用事例」"
    },
    "description": {
      "ja": "「AIを活用したいけれど、何から始めればいいかわからない」「AIを導入したのに、思ったような成果が出ない」その壁を突破する鍵となるのが、MCP（Model Context Protocol）です。なぜMCPが成果につながるのか、実際にどのように活用されているのか、活用事例をもとにわかりやすくご紹介します。AI活用の次の一手として、ぜひこの機会にご参加ください。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/20/air-company-mcp-20250925.png"
    },
    "date": "2025-09-25"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "21",
    "slug": "air-company-querypie-ai-webinar",
    "mdxSlug": "webinars/21",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "AIエージェントってウチの会社でも使えるの？30分でわかる入門編 【10/23(木)開催｜参加費無料】"
    },
    "description": {
      "ja": "AI活用は競争力の鍵。今や企業にとって避けて通れないテーマとなっています。​しかし「どの業務に取り入れればよいのか分からない」「人材やノウハウが足りない」「セキュリティやガバナンスが不安」といった理由から、導入が進まない企業も少なくありません。​本セミナーでは、こうした課題を整理し、実際にAIを業務へ取り込み成果を上げている実例を紹介します。​​"
    },
    "imageSrc": {
      "ja": "/demo/webinar/21/air-company-ai-webinar20251023.png"
    },
    "date": "2025-10-08"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "22",
    "slug": "air-company-querypie-mcp-webinar",
    "mdxSlug": "webinars/22",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "成果に直結！MCP活用事例｜11/20(木)開催"
    },
    "description": {
      "ja": "「AIを活用したいけれど、何から始めればいいかわからない」「生成AIを導入したのに、思ったような成果が出ない」「ChatGPTやCopilot、Geminiを使いこなせていない」そんなふうに課題を感じている方は多いのではないでしょうか？その壁を突破する鍵となるのが、MCP（Model Context Protocol）です。本ウェビナーでは、MCPを活用事例をもとに、なぜMCPが成果につながるのか、実際にどのように活用されているのかを具体的かつわかりやすくご紹介します。​​"
    },
    "imageSrc": {
      "ja": "/demo/webinar/22/air-company-mcp-20251120.png"
    },
    "date": "2025-11-10"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "23",
    "slug": "air-company-querypie-ai-webinar",
    "mdxSlug": "webinars/23",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "AIエージェント活用事例 -使えないAIからの脱却-｜12/18(木)開催"
    },
    "description": {
      "ja": "「AIで成果を出す」これは、多くの企業にとって新しい課題ではないでしょうか？他社より一歩抜け出す鍵となるのは、“AIエージェント”をいかに活用するかです。それには、AIエージェントが日常業務を自律的に実行できるような仕組みを、構築していく必要があります。本ウェビナーでは、構成図で全体像をわかりやすく解説。企業でも安心してAIを使えるセキュリティの実現策についてもご紹介します。​"
    },
    "imageSrc": {
      "ja": "/demo/webinar/23/air-company-ai-webinar20251218.png"
    },
    "date": "2025-12-1"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "24",
    "slug": "air-company-querypie-ai-webinar",
    "mdxSlug": "webinars/24",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "2026年を迷わず走るための「AIの教科書」｜1/22(木)開催"
    },
    "description": {
      "ja": "AIは今、驚異的なスピードで進化を続けています。しかし、その情報量の多さに圧倒され、「結局、何を押さえればいいのか分からない」「情報が散らばっていて追いきれない」と感じていませんか？本ウェビナーでは、AIに関する様々な情報を体系的に整理することにフォーカスし、押さえるべきAIの本質／情報収集先の候補／ビジネスや業務にどう活かすかの視点をまとめてお届けします。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/24/air-company-ai-webinar20260122.png"
    },
    "date": "2026-1-15"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "25",
    "slug": "air-company-querypie-ai-usecase-webinar",
    "mdxSlug": "webinars/25",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "AI、社内で使ってみた。活用事例を30分で｜2/19(木)開催"
    },
    "description": {
      "ja": "AIはどんどん便利になっていますが、大切なのは「どう活用するか」を具体的に見つけること。本ウェビナーでは、社内の試行錯誤から生まれたリアルなAI活用事例を、成功までの過程とともに30分でご紹介します。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/25/air-company-querypie-ai-usecase-webinar-20260219.png"
    },
    "date": "2026-02-13"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "26",
    "slug": "air-company-querypie-ai-usecase-webinar",
    "mdxSlug": "webinars/26",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "AI、社内で使ってみた。活用事例を30分で｜3/19(木)開催"
    },
    "description": {
      "ja": "好評につき、再放送決定！AIはどんどん便利になっていますが、大切なのは「どう活用するか」を具体的に見つけること。本ウェビナーでは、社内の試行錯誤から生まれたリアルなAI活用事例を、成功までの過程とともに30分でご紹介します。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/26/air-company-querypie-ai-usecase-webinar-20260319.png"
    },
    "date": "2026-03-02"
  },
  {
    "categorySlug": "webinars",
    "segment": "webinars",
    "id": "27",
    "slug": "air-company-ai-agent-security-webinar",
    "mdxSlug": "webinars/27",
    "locales": [
      "ja"
    ],
    "title": {
      "ja": "AIエージェントセキュリティガイド｜4/16(木)開催"
    },
    "description": {
      "ja": "AIエージェントの「暴走」や「権限悪用」を防ぐには？本ウェビナーでは、実際のインシデント事例を読み解きながら、AIエージェントに付与する権限をどう設計すれば安全に使い続けられるのかを解説します。安全性と実用性を両立する実践的なフレームワークをご紹介する、実務直結型の30分です。"
    },
    "imageSrc": {
      "ja": "/demo/webinar/27/air-company-ai-agent-security-webinar-20260416.png"
    },
    "date": "2026-04-09"
  }
] as const;

const demoMdxEntryBySegmentAndId = new Map(demoMdxEntries.map((entry) => [`${entry.segment}:${entry.id}`, entry]));
const demoMdxEntryByCategoryAndId = new Map(demoMdxEntries.map((entry) => [`${entry.categorySlug}:${entry.id}`, entry]));
const demoMdxEntriesByCategory = new Map<DemoMdxCategorySlug, DemoMdxEntry[]>();
for (const entry of demoMdxEntries) {
  const current = demoMdxEntriesByCategory.get(entry.categorySlug) ?? [];
  current.push(entry);
  demoMdxEntriesByCategory.set(entry.categorySlug, current);
}

export function getDemoMdxEntry(segment: DemoPublicSegment, id: string) {
  return demoMdxEntryBySegmentAndId.get(`${segment}:${id}`) ?? null;
}

export function getDemoMdxEntryByCategoryAndId(categorySlug: DemoMdxCategorySlug, id: string) {
  return demoMdxEntryByCategoryAndId.get(`${categorySlug}:${id}`) ?? null;
}

export function getDemoMdxEntriesByCategory(categorySlug: DemoMdxCategorySlug) {
  return demoMdxEntriesByCategory.get(categorySlug) ?? [];
}

function getDemoMdxPathname(entry: DemoMdxEntry) {
  if (entry.segment === "webinars") {
    return `/webinars/${entry.id}/${entry.slug}`;
  }

  if (entry.segment === "use-cases") {
    return `/demo/use-cases/${entry.id}/${entry.slug}`;
  }

  return `/demo/${entry.segment}/${entry.id}/${entry.slug}`;
}

export function getDemoMdxHref(locale: Locale, segment: DemoPublicSegment, id: string) {
  const entry = getDemoMdxEntry(segment, id);
  return entry ? getLocalePath(locale, getDemoMdxPathname(entry)) : null;
}

export function getDemoMdxHrefByCategoryAndId(locale: Locale, categorySlug: DemoMdxCategorySlug, id: string) {
  const entry = getDemoMdxEntryByCategoryAndId(categorySlug, id);
  return entry ? getLocalePath(locale, getDemoMdxPathname(entry)) : null;
}

export function getDemoMdxSlug(segment: DemoPublicSegment, id: string) {
  const entry = getDemoMdxEntry(segment, id);
  return entry?.mdxSlug ?? null;
}

export function resolveDemoMdxRoute(locale: Locale, segment: DemoPublicSegment, id: string, _rest?: string[]) {
  const entry = getDemoMdxEntry(segment, id);
  if (!entry) return { canonicalHref: null, entry: null, shouldRedirect: false };
  const canonicalHref = getLocalePath(locale, getDemoMdxPathname(entry));
  return { canonicalHref, entry, shouldRedirect: false };
}

export function isDemoMdxVisibleInLocale(entry: DemoMdxEntry, locale: Locale) {
  return locale === "en" ? entry.locales.includes("en") : entry.locales.includes(locale) || entry.locales.includes("en");
}

export function getDemoMdxLocalizedValue(values: Partial<Record<Locale, string>>, locale: Locale) {
  return values[locale] ?? values.en ?? null;
}

export function getVisibleDemoMdxEntries(locale: Locale) {
  return demoMdxEntries.filter((entry) => isDemoMdxVisibleInLocale(entry, locale));
}
