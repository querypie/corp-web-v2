import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
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
} as const;

export default metadataByLocale;
