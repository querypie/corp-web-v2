// Source: https://querypie.ai/solutions/as400-cobol
// Japanese source copy and reference links are preserved; section eyebrows are omitted.
export type As400CobolText = {
  text: string;
  reference?: { href: string; label: string; text: string };
};

export type As400CobolCard = {
  title: string;
  body: As400CobolText;
  label: string;
};

export type As400CobolSection = {
  id: string;
  title: string;
  description: As400CobolText;
  stats: { value: string; title: string; body: As400CobolText }[];
  paragraphs: string[];
  insights: As400CobolCard[];
  stages: { title: string; label: string; items: string[] }[];
  cards: As400CobolCard[];
};

export const as400CobolMenuLabel = "AS/400・COBOLモダナイゼーション";

export const as400CobolCopy = {
  "metadata": {
    "title": "IBM i（AS/400）モダナイゼーション | AS400 / COBOL マイグレーション | QueryPie AI",
    "description": "QueryPie AIは、IBM i（AS/400）上のCOBOL/RPG資産を分析し、設計書・テストケース生成からJava/API/クラウド移行、DB2 / Oracle分析、PostgreSQL移行まで段階的に支援します。"
  },
  "hero": {
    "title": "IBM i（AS/400）モダナイゼーション",
    "subtitle": "AS400 / COBOL マイグレーションを、現状分析から Java/API/クラウド移行、運用安定化まで支援",
    "description": "QueryPie AIは、COBOL/RPG資産の解析・可視化、 設計書・テストケース生成、DB2 / Oracle分析、 PostgreSQL移行、Linux / OCI / AWS環境への移行まで、 既存業務を止めない段階的な刷新を支援します。",
    "action": "相談する",
    "imageAlt": "AS/400とCOBOL資産を分析し、Java、API、クラウド環境へ段階的に移行する流れ",
    "labels": [
      [
        "AS/400・COBOL資産",
        "長年運用されてきた基幹システムを可視化"
      ],
      [
        "解析・設計・テスト",
        "AIを活用して設計書とテストケースを生成"
      ],
      [
        "Java / API / クラウド移行",
        "段階的な変換と運用安定化まで支援"
      ]
    ]
  },
  "sections": [
    {
      "id": "market-background",
      "title": "AS/400とCOBOL資産は、今も基幹システムの重要テーマです",
      "description": {
        "text": "AS/400（現在のIBM i）は、IBM Power上で動作する統合型の基幹業務プラットフォームです。\nRPG、COBOL、CL、Db2 for i、ジョブ、帳票、5250画面などが業務と深く結びついているため、単なるサーバー更改ではなく、業務ロジックを理解したうえでの段階的なモダナイゼーションが必要です。"
      },
      "stats": [
        {
          "value": "国内約2万社",
          "title": "国内IBM i利用企業",
          "body": {
            "text": "日本IBM関係者の公開資料では、世界約15万社、国内約2万社で利用されると説明されています。",
            "reference": {
              "href": "https://community.ibm.com/community/user/blogs/hirotsugu-hara/2024/09/03/ibm-i-developer-task-blog",
              "label": "IBM Community Japan 2024を参照",
              "text": "(参考)"
            }
          }
        },
        {
          "value": "約70%",
          "title": "基幹業務の過半をIBM iで運用",
          "body": {
            "text": "Fortraの2026年調査では、IBM i利用企業の約70%が基幹業務アプリケーションの半数以上をIBM iで運用しています。",
            "reference": {
              "href": "https://power.fortra.com/resources/guides/outlook-ibm-i-2026-ibm-i-marketplace-survey-results",
              "label": "Fortra 2026 IBM i Marketplace Surveyを参照",
              "text": "(参考)"
            }
          }
        },
        {
          "value": "最大12兆円/年",
          "title": "2025年以降の経済損失リスク",
          "body": {
            "text": "経済産業省のDXレポートが示した、レガシーシステムの複雑化・ブラックボックス化に関する警告です。",
            "reference": {
              "href": "https://www.meti.go.jp/policy/it_policy/dx/20180907_02.pdf",
              "label": "経済産業省 DXレポート本文を参照",
              "text": "(参考)"
            }
          }
        },
        {
          "value": "1兆3,044億円",
          "title": "2025年ITモダナイゼーション市場",
          "body": {
            "text": "IDCの日本ITモダナイゼーションサービス市場予測を、全体市場の背景として扱います。",
            "reference": {
              "href": "https://www.idc.com/resource-center/press-releases/%E5%9B%BD%E5%86%85it%E3%83%A2%E3%83%80%E3%83%8A%E3%82%A4%E3%82%BC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E5%B8%82%E5%A0%B4%E4%BA%88%E6%B8%AC%E3%82%92%E7%99%BA%E8%A1%A8/",
              "label": "IDC Japan 2026を参照",
              "text": "(参考)"
            }
          }
        }
      ],
      "paragraphs": [
        "日本企業に残るIBM i（AS/400）やCOBOL/RPGの基幹システムは、 古いから残っているのではありません。\n受発注、在庫、会計、決済、 給与、顧客管理といった止められない業務を、長期間安定して 支えてきたからこそ、簡単には置き換えられない資産になっています。",
        "一方で、長年の改修で仕様が属人化し、プログラム、テーブル、 ジョブ、帳票、外部連携の関係が見えにくくなると、改修や移行の 影響範囲を判断しにくくなります。\n経済産業省のDXレポートが 指摘した「2025年の崖」も、レガシーシステムの複雑化と ブラックボックス化を放置するリスクを考えるうえで重要な文脈です。"
      ],
      "insights": [
        {
          "title": "IBM iは統合型プラットフォーム",
          "body": {
            "text": "OS、Db2 for i、ジョブ管理、セキュリティ、5250画面、RPG/COBOL/CLが 一体で運用されるため、Linux移行やデータベース移行だけでは全体像を説明できません。"
          },
          "label": ""
        },
        {
          "title": "データと業務ロジックが近い",
          "body": {
            "text": "Db2 for i、DB2 / Oracle、帳票、バッチ、周辺システム連携まで含めて、 どの業務がどの資産に依存しているかを整理する必要があります。"
          },
          "label": ""
        },
        {
          "title": "AI分析の入口が明確",
          "body": {
            "text": "コード説明、仕様書生成、依存関係整理、影響度分析、テスト範囲の抽出は、 段階的な移行判断の前提になります。"
          },
          "label": ""
        }
      ],
      "stages": [],
      "cards": []
    },
    {
      "id": "why-modernize",
      "title": "なぜ今、AS400 / COBOL モダナイゼーションが必要なのか",
      "description": {
        "text": "課題は、システムが動かないことではありません。\n安定して動いているからこそ、変える判断が遅れ、保守人材、コスト、仕様のブラックボックス化、DX施策との接続が同時に難しくなることです。",
        "reference": {
          "href": "https://www.ipa.go.jp/digital/chousa/dx-trend/dx-trend-2025.html",
          "label": "IPA DX動向2025を参照",
          "text": "(参考)"
        }
      },
      "stats": [],
      "paragraphs": [],
      "insights": [
        {
          "title": "「動いているから触らない」が限界に近づく",
          "body": {
            "text": "長年稼働してきた基幹システムは、業務に深く組み込まれています。 しかし担当者の退職、ベンダー依存、改修履歴の蓄積が進むほど、 触らない判断そのものが将来のリスクになります。",
            "reference": {
              "href": "https://techtarget.itmedia.co.jp/tt/news/2407/16/news04.html",
              "label": "TechTarget Japan 2024を参照",
              "text": "(参考)"
            }
          },
          "label": ""
        },
        {
          "title": "影響範囲が分からず、改修判断が遅れる",
          "body": {
            "text": "1つの画面や帳票の変更でも、プログラム、ファイル、ジョブ、外部連携、 テスト範囲が連鎖します。見えない依存関係を可視化しなければ、 小さな改修も大きなリスクになります。"
          },
          "label": ""
        },
        {
          "title": "クラウド、API、データ活用につながりにくい",
          "body": {
            "text": "既存IBM iを残しながらAPIで外部化するのか、Java化するのか、 PostgreSQLやLinux / OCI / AWSへ移すのか。選択肢を比較するには、 現行資産の構造理解が必要です。",
            "reference": {
              "href": "https://prtimes.jp/main/html/rd/p/000001509.000011650.html",
              "label": "TIS発表 2024を参照",
              "text": "(参考)"
            }
          },
          "label": ""
        }
      ],
      "stages": [],
      "cards": []
    },
    {
      "id": "ai-approach",
      "title": "全面再開発ではなく、まずAIで現行システムを理解する",
      "description": {
        "text": "QueryPie AIは、既存資産をただ置き換えるのではなく、コード、データベース、ジョブ、帳票、外部連携を読み解き、\n移行判断に必要な情報へ変換します。"
      },
      "stats": [],
      "paragraphs": [],
      "insights": [],
      "stages": [
        {
          "title": "既存資産を集める",
          "label": "入力情報",
          "items": [
            "COBOL / RPG / CLプログラム",
            "Db2 for i、DB2 / Oracle、ファイル定義",
            "ジョブ、帳票、画面、外部連携"
          ]
        },
        {
          "title": "AIで構造化する",
          "label": "分析",
          "items": [
            "業務ロジックと処理フローの説明",
            "テーブル、プログラム、バッチの依存関係整理",
            "改修・移行時の影響度分析"
          ]
        },
        {
          "title": "判断材料に変える",
          "label": "出力",
          "items": [
            "現行仕様書、データモデル、移行対象分類",
            "テストケース、テスト範囲、優先順位",
            "PoC計画、移行ロードマップ、実装方針"
          ]
        }
      ],
      "cards": []
    },
    {
      "id": "deliverables",
      "title": "設計書、影響度、テストケースまで移行判断に必要な成果物をそろえる",
      "description": {
        "text": "AI分析の目的は、単にコードを説明することではありません。\n現行業務を止めずに、どこから着手し、何を残し、何を移すかを判断できる状態を作ることです。"
      },
      "stats": [],
      "paragraphs": [],
      "insights": [],
      "stages": [],
      "cards": [
        {
          "title": "現行仕様書の生成",
          "body": {
            "text": "COBOL/RPGプログラムの処理内容、入力、出力、例外処理、業務ルールを読み解き、担当者が確認できる現行仕様として整理します。"
          },
          "label": "仕様書"
        },
        {
          "title": "依存関係と影響度の整理",
          "body": {
            "text": "プログラム、テーブル、ジョブ、帳票、外部連携の関係を可視化し、改修や移行時に影響を受ける範囲を確認します。"
          },
          "label": "依存関係"
        },
        {
          "title": "データベース・データモデル分析",
          "body": {
            "text": "Db2 for i、DB2 / Oracle、ファイル定義、データ項目の関係を整理し、PostgreSQL移行やAPI化の前提を作ります。"
          },
          "label": "データモデル"
        },
        {
          "title": "テストケース生成",
          "body": {
            "text": "業務ロジックとデータ整合性を確認するためのテスト観点、正常系・例外系、移行後の比較検証範囲を整理します。"
          },
          "label": "テスト"
        },
        {
          "title": "移行対象の分類",
          "body": {
            "text": "残す機能、外部化する機能、Java化する機能、データベース移行が必要な領域を分け、PoCと段階移行の優先順位を作ります。"
          },
          "label": "ロードマップ"
        },
        {
          "title": "業務知識の検索・継承",
          "body": {
            "text": "属人化した仕様やベテラン担当者の知識を、検索・確認しやすい形に変換し、新しい担当者のオンボーディングを支援します。"
          },
          "label": "知識継承"
        }
      ]
    },
    {
      "id": "migration-architecture",
      "title": "Java / PostgreSQL / Linux / クラウドへ、状況に応じた移行ルートを設計する",
      "description": {
        "text": "最初から全体を置き換えるのではなく、既存IBM iを残す選択肢も含めて、\nAPI化、Java化、データ移行、クラウド移行を段階的に組み合わせます。"
      },
      "stats": [],
      "paragraphs": [],
      "insights": [],
      "stages": [
        {
          "title": "IBM i（AS/400）",
          "label": "現行",
          "items": [
            "RPG / COBOL / CL",
            "Db2 for i、DB2 / Oracle",
            "5250画面、ジョブ、帳票"
          ]
        },
        {
          "title": "AI分析とPoC",
          "label": "橋渡し",
          "items": [
            "業務影響と移行難易度を評価",
            "変換精度とテスト可能性を検証",
            "優先順位と実装単位を決定"
          ]
        },
        {
          "title": "次世代アーキテクチャ",
          "label": "移行先",
          "items": [
            "Java / API / クラウド",
            "PostgreSQL / Linux",
            "OCI / AWS / オンプレミス併用"
          ]
        }
      ],
      "cards": [
        {
          "title": "APIで外部化",
          "body": {
            "text": "既存IBM iをすぐに置き換えず、必要な機能からAPIで外部システムと接続します。"
          },
          "label": ""
        },
        {
          "title": "COBOL/RPGからJavaへ",
          "body": {
            "text": "変換対象を絞り、PoCで精度、例外処理、テスト可能性を確認しながら進めます。",
            "reference": {
              "href": "https://it.impress.co.jp/articles/-/26675",
              "label": "LAC MAJALIS Modernization Service IT Leaders 2024を参照",
              "text": "(参考)"
            }
          },
          "label": ""
        },
        {
          "title": "PostgreSQLへデータ移行",
          "body": {
            "text": "テーブル、ファイル、データ項目、整合性チェックを整理し、段階的に移行します。"
          },
          "label": ""
        },
        {
          "title": "Linux / OCI / AWSへ展開",
          "body": {
            "text": "運用、監視、権限、接続方式を含めて、移行後に使い続けられる基盤を設計します。"
          },
          "label": ""
        }
      ]
    },
    {
      "id": "service-scope",
      "title": "現行理解から段階移行まで、サービス範囲を一つの流れで支援",
      "description": {
        "text": "受発注、在庫、請求、バッチ、帳票、外部連携といった業務単位に沿って現行資産を理解し、\nAI分析、PoC、移行設計、実装、並行稼働、運用安定化までつなげます。"
      },
      "stats": [],
      "paragraphs": [],
      "insights": [],
      "stages": [],
      "cards": [
        {
          "title": "現行業務と技術資産の棚卸し",
          "body": {
            "text": "受発注、在庫、請求、給与などの業務単位で、COBOL/RPGプログラム、DB2 / Oracle、ジョブ、帳票、ファイル連携を整理し、移行の全体像を把握します。"
          },
          "label": "01 棚卸し"
        },
        {
          "title": "AI分析と影響度整理",
          "body": {
            "text": "コード構造、業務ロジック、データモデル、依存関係、改修時の影響範囲をAIで整理し、仕様書、データモデル、テスト観点として確認できる状態にします。"
          },
          "label": "02 分析"
        },
        {
          "title": "移行対象と残す領域の切り分け",
          "body": {
            "text": "Java化、API化、PostgreSQL移行、クラウド移行に進める領域と、当面IBM i上に残す領域を分け、業務影響と優先度に基づいて段階的なロードマップを作ります。"
          },
          "label": "03 計画"
        },
        {
          "title": "小さく検証するPoC",
          "body": {
            "text": "在庫照会、取引先マスタ、請求状況など、業務影響を抑えやすい範囲から、変換精度、データ整合性、API連携、移行後の運用イメージを検証します。"
          },
          "label": "04 検証"
        },
        {
          "title": "変換・実装と基盤移行",
          "body": {
            "text": "PoCで確認した範囲から、COBOL/RPGのJava化、API連携、PostgreSQL移行、Linux / OCI / AWS環境への展開、周辺システム連携を進めます。"
          },
          "label": "05 実装"
        },
        {
          "title": "テスト、並行稼働、運用安定化",
          "body": {
            "text": "新旧システムの照合テスト、性能確認、並行稼働、切り戻し、監視、障害対応、運用ドキュメント整備まで、現場が使い続けられる状態を目指します。"
          },
          "label": "06 安定化"
        }
      ]
    }
  ],
  "contact": {
    "title": "AS/400・COBOLモダナイゼーションを相談する",
    "description": "既存資産の棚卸しからPoC、変換、実装、運用安定化まで、 現在の状況に合わせて段階的な進め方を整理します。",
    "action": "相談する"
  }
} satisfies {
  metadata: { title: string; description: string };
  hero: { title: string; subtitle: string; description: string; action: string; imageAlt: string; labels: string[][] };
  sections: As400CobolSection[];
  contact: { title: string; description: string; action: string };
};
