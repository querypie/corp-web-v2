import type { Locale } from "./i18n";

export type CookieCategory = {
  description: string;
  detail: string;
  status: "consent" | "optional" | "required";
  title: string;
};

export type CookiePreferenceCopy = {
  ctaActionLabel: string;
  ctaDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  intro: string[];
  preferences: CookieCategory[];
  title: string;
};

export type EulaSubsection = {
  body: string[];
  title: string;
};

export type EulaSection = {
  body?: string[];
  subsections?: EulaSubsection[];
  title: string;
};

export type EulaCopy = {
  intro: string[];
  sections: EulaSection[];
  title: string;
};

export const cookiePreferenceCopy: Record<Locale, CookiePreferenceCopy> = {
  en: {
    ctaActionLabel: "Get Start!",
    ctaDescription: "Sign up in seconds and secure your 14-day free trial now.",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    intro: [
      "We use technologies like cookies to collect data and tailor your online experience. Manage your cookie preferences to enable or disable specific types of cookies, categorized for your convenience.",
    ],
    preferences: [
      {
        description: "Required to keep core website features, security protections, and compliance-related operations running.",
        detail: "These cookies support essential functions such as secure access, session integrity, and other baseline behaviors the site depends on.",
        status: "required",
        title: "Strictly Necessary Cookies",
      },
      {
        description: "Help us understand how the site performs so we can improve speed, responsiveness, and overall usability.",
        detail: "Disabling performance cookies may reduce how well the experience is tuned and can make the site feel slower or less optimized.",
        status: "optional",
        title: "Performance Cookies",
      },
      {
        description: "Remember choices you make and provide more personalized features without tracking your activity across other websites.",
        detail: "These cookies are used to maintain preferences that make the experience more convenient and consistent from visit to visit.",
        status: "optional",
        title: "Functional Cookies",
      },
      {
        description: "Measure visits and traffic sources so we can learn which pages are useful and where the product experience can improve.",
        detail: "The information collected is aggregated and anonymous, helping us monitor usage patterns without identifying individual visitors.",
        status: "consent",
        title: "Analysis Cookies",
      },
      {
        description: "Support advertising measurement by identifying campaign-driven visits and evaluating the performance of channels such as Google Ads.",
        detail: "These are non-essential cookies that require consent and are not used to identify specific individuals.",
        status: "consent",
        title: "Marketing Cookies",
      },
    ],
    title: "Cookie Preference",
  },
  ko: {
    ctaActionLabel: "시작하기",
    ctaDescription: "몇 초 만에 가입하고 14일 무료 체험을 바로 시작하세요.",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    intro: [
      "당사는 쿠키와 같은 기술을 사용해 데이터를 수집하고 온라인 경험을 맞춤화합니다. 편의에 맞게 분류된 항목별로 쿠키 사용 여부를 관리할 수 있습니다.",
    ],
    preferences: [
      {
        description: "사이트의 핵심 기능, 보안 보호, 규정 준수를 위한 기본 동작에 필요한 쿠키입니다.",
        detail: "보안 접속, 세션 유지, 기본 동작 처리 등 사이트 운영에 필수적인 기능을 지원합니다.",
        status: "required",
        title: "필수 쿠키",
      },
      {
        description: "사이트 사용성을 개선하기 위해 속도, 반응성, 전반적인 성능을 파악하는 데 사용됩니다.",
        detail: "비활성화할 경우 맞춤 최적화 수준이 낮아지고 일부 경험이 덜 매끄럽게 느껴질 수 있습니다.",
        status: "optional",
        title: "성능 쿠키",
      },
      {
        description: "사용자가 선택한 설정을 기억해 보다 개인화된 기능을 제공하며, 다른 사이트 활동은 추적하지 않습니다.",
        detail: "반복 방문 시 일관되고 편리한 경험을 제공하기 위한 선호 설정 유지에 활용됩니다.",
        status: "optional",
        title: "기능 쿠키",
      },
      {
        description: "방문 수와 유입 경로를 측정해 어떤 페이지가 효과적인지, 어디를 개선해야 하는지 파악합니다.",
        detail: "수집 정보는 집계 및 익명 처리되어 개별 방문자를 식별하지 않고 사용 패턴을 분석하는 데 쓰입니다.",
        status: "consent",
        title: "분석 쿠키",
      },
      {
        description: "광고 유입 여부와 캠페인 성과를 측정해 Google Ads 같은 채널 운영을 지원합니다.",
        detail: "비필수 쿠키이며 사용자 동의가 필요하고, 특정 개인을 식별하기 위한 용도로 사용되지 않습니다.",
        status: "consent",
        title: "마케팅 쿠키",
      },
    ],
    title: "쿠키 설정",
  },
  ja: {
    ctaActionLabel: "始める",
    ctaDescription: "数秒で登録し、14日間の無料トライアルを今すぐ始めましょう。",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    intro: [
      "当社は Cookie などの技術を使用してデータを収集し、オンライン体験を最適化します。分類ごとに Cookie の利用可否を管理できます。",
    ],
    preferences: [
      {
        description: "サイトの基本機能、セキュリティ保護、コンプライアンス対応を維持するために必要な Cookie です。",
        detail: "安全なアクセス、セッション維持、そのほかサイト運用に必要な基本動作を支えます。",
        status: "required",
        title: "必須 Cookie",
      },
      {
        description: "サイトの速度や応答性、使いやすさを把握し、体験改善に役立てるための Cookie です。",
        detail: "無効化すると最適化の精度が下がり、表示や動作がやや不安定に感じられる場合があります。",
        status: "optional",
        title: "パフォーマンス Cookie",
      },
      {
        description: "ユーザーの選択内容を記憶し、より個別化された機能を提供します。他サイト上の行動は追跡しません。",
        detail: "再訪時にも一貫した便利な体験を提供するため、設定内容の保持に利用されます。",
        status: "optional",
        title: "機能 Cookie",
      },
      {
        description: "訪問数や流入経路を測定し、どのページが有効か、どこを改善すべきかを把握します。",
        detail: "収集情報は集計・匿名化されており、個人を特定せずに利用傾向の把握に活用されます。",
        status: "consent",
        title: "分析 Cookie",
      },
      {
        description: "広告経由の訪問有無やキャンペーン成果を測定し、Google Ads などの運用に役立てます。",
        detail: "非必須 Cookie であり、利用には同意が必要です。特定の個人を識別する目的では使用されません。",
        status: "consent",
        title: "マーケティング Cookie",
      },
    ],
    title: "クッキー設定",
  },
};

export const eulaCopy: EulaCopy = {
  intro: [
    "PLEASE READ THIS END USER LICENSE AGREEMENT (\"EULA\") BEFORE INSTALLING OR USING THE PRODUCT (QueryPie) TO WHICH THIS EULA APPLIES. BY ACCEPTING THIS EULA, COMPLETING THE REGISTRATION PROCESS, AND/OR INSTALLING OR USING THE PRODUCT, YOU AGREE ON BEHALF OF YOURSELF AND YOUR COMPANY (IF APPLICABLE) TO THE TERMS BELOW. IF YOU DO NOT AGREE WITH THESE TERMS, OR DO NOT HAVE THE AUTHORITY TO BIND YOUR COMPANY, DO NOT INSTALL, REGISTER FOR OR USE THE PRODUCT. CHEQUER Global, Inc. IS THE LICENSOR OF THE PRODUCT AND MAY BE REFERRED TO HEREIN AS \"Licensor\", “QueryPie”, \"we\", \"us\", or \"our\". IF YOU ARE AGREEING TO THIS EULA ON BEHALF OF YOURSELF IN YOUR INDIVIDUAL CAPACITY, THEN YOU ARE THE LICENSEE AND YOU MAY BE REFERRED TO HEREIN AS \"Licensee\", \"you\", or \"your\". IF YOU ARE AGREEING TO THIS EULA ON BEHALF OF YOUR COMPANY, THEN YOUR COMPANY IS THE LICENSEE AND ANY REFERENCES TO \"Licensee\", \"you\", or \"your\" WILL MEAN YOUR COMPANY.",
  ],
  sections: [
    {
      title: "PART I: GENERAL TERMS",
      subsections: [
        {
          title: "(1) GENERAL LICENSE TERMS, RESTRICTIONS AND ORDER OF PRECEDENCE",
          body: [],
        },
        {
          title: "(1.1) General License Terms",
          body: [
            "Our proprietary software and applications (\"Product\") are licensed, not sold, to you by us under the scope and terms of this EULA, the Quote, and the Product Specific Terms as applicable. Depending on the type of Product, you may obtain a license from us to use such Product on a limited fixed term basis (\"Subscription License\") or on a perpetual basis (\"Perpetual License\") to the extent available for such Product.",
            "For certain Products that are offered by our licensed partner for use with the partner's solution, your license to such Product is solely for use with the partner's solution notwithstanding anything to the contrary contained in this EULA.",
            "As used herein \"Authorized Reseller\" means a third party who is not our Affiliate and who is authorized by us or our Affiliate to resell the Product; \"Quote\" means an electronic order document agreed to by you and us (or our Affiliate or an Authorized Reseller) for the Product and unless a Quote says something different, each Quote will be governed by the terms of this EULA and include the name of the Product being licensed and any usage limitations, applicable Fees, and any other details related to the transaction; and \"Affiliate\" means any legal entity that directly or indirectly controls, is controlled by, or is under common control with you or us.",
            "For the purposes of this definition, \"control\" means ownership, directly or indirectly, of more than fifty percent (50%) of the voting shares or other equity interest in an entity.",
          ],
        },
        {
          title: "(1.2) Your Cloud Environment",
          body: [
            "You may upload the Product(s) licensed to you pursuant to this EULA onto a cloud instance supplied by a third party, provided that the operation of the Product(s) in the cloud instance complies with all license restrictions and usage limitations applicable to the Product(s).",
            "You may also allow the third party to upload, install, operate and/or use the Products on the cloud instance, provided that the third party's access to and use of the Products is solely for your benefit in accordance with the terms of this EULA. The third party will be considered a Permitted Third Party, and you will be responsible for the Permitted Third Party's compliance with this EULA in accordance with the section titled Third Party Use.",
          ],
        },
        {
          title: "(1.3) Authorized Users",
          body: [
            "Anything you, your employees or a third-party consultant or agent that you authorize to use the Product (\"Authorized Users\") do or fail to do will be considered your act or omission, and you accept full responsibility for any such act or omission to the extent you would be liable if it were your act or omission.",
          ],
        },
        {
          title: "(1.4) Third Party Use",
          body: [
            "You may allow your agents, contractors and outsourcing service providers (each a \"Permitted Third Party\") to use the Product(s) licensed to you hereunder solely for your benefit in accordance with the terms of this EULA and you are responsible for any such Permitted Third Party's compliance with this EULA in such use. Any breach by any Permitted Third Party of the terms of this EULA will be considered your breach.",
          ],
        },
        {
          title: "(1.5) Restrictions",
          body: [
            "Except as otherwise expressly permitted in this EULA, you will not and will not allow any of your Affiliates or any third party to: (A) copy, modify, adapt, translate, or otherwise create derivative works of the Product or Documentation; (B) disassemble, decompile or \"unlock\", decode or otherwise reverse translate or engineer, or attempt in any manner to reconstruct or discover the source code or underlying structure, ideas, or algorithms of the Product except as expressly permitted by law in effect in the jurisdiction in which you are located; (C) rent, lease, sell, distribute, pledge, assign, sublicense or otherwise transfer or encumber rights to the Product; (D) make the Product available on a timesharing or service bureau basis or otherwise allow any third party to use or access the Product; (E) remove or modify any proprietary notices, legends, or labels on the Product or Documentation; (F) use or access the Product in a manner that: (i) violates any national, federal, state, and local laws, rules , and regulations including without limitation, those laws and regulations relating to data privacy and security in each applicable jurisdiction (\"Applicable Laws\"); (ii) violates the rights of any third party; (iii) purports to subject us or our Affiliates to any other obligations; (iv) could be fraudulent; or (v) is not permitted under this EULA; (G) use the Product to develop, test, support or market products that are competitive with and/or provide similar functionality to the Product; or (H) permit your Affiliates to access or use the Product unless specifically authorized elsewhere in this EULA or the Quote.",
            "As used herein \"Documentation\" means any technical instructions or materials describing the operation of the Product made available to you electronically by use for use with the Product, expressly excluding any user blogs, reviews, or forums.",
          ],
        },
        {
          title: "(1.6) Limitations on Evaluation or Trial Licenses",
          body: [
            "If the Product is licensed to you on an evaluation or trial basis, then you may use the Product only for such purposes until the earlier of: (a) the end of the evaluation period, if any, specified in the Quote, this EULA or otherwise communicated by us to you at the time of delivery; or (b) the start date of a paid for license to the Product; or (c) termination in accordance with the terms of this EULA.",
            "You may not extend the evaluation period by uninstalling and re-installing the Product(s) or by any other means other than our written consent. You must not use the Product in a production environment.",
            "You will be required to pay for a license for the Product at our then applicable license price if you continue to use the Product, whether in a production or non-production environment, after the evaluation license expires or terminates, and the terms and conditions of the EULA in effect at that time will apply to your continued use of the Product.",
            "A Product licensed to you on an evaluation or trial basis may be subject to one or more usage limits specified in the Product Specific Terms, the Quote or otherwise communicated at the time of delivery (including posting of such limits at the location where you download the Product for evaluation). We may, at our sole discretion, decide whether to offer any maintenance and support for the Product during the evaluation period, and to include any conditions or limits on such maintenance and support.",
            "You may not circumvent any technical limitations included in the Product licensed to you on an evaluation or trial basis.",
          ],
        },
        {
          title: "(1.6.1) Community License",
          body: [
            "Companies with fewer than a specific number of users may use the product under a community license (trial version). For detailed information, please refer to the relevant section on the QueryPie website at www.querypie.com.",
          ],
        },
        {
          title: "(1.7) Delivery",
          body: [
            "Unless otherwise specified by us, the Product will be provided to you via electronic delivery, and delivery is deemed complete when the Product(s) is/are made available at the electronic software download site specified by us and you are e-mailed or otherwise provided with any necessary instructions, password and/or license keys required for you to be able to access, download and install the Product(s).",
          ],
        },
        {
          title: "(1.8) Updates",
          body: [
            "Each update, enhancement, error correction, modification or new release to the Product that we make available to you (\"Update\") replaces part or all of the Product (or earlier Update) previously licensed to you (\"Replaced Product\") and will terminate such previously licensed Replaced Product to the extent replaced by the Update; provided, however, that you may continue to operate the Replaced Product for up to thirty (30) days from delivery of the Update to allow you to complete your implementation of the Update.",
            "You must cease all use of the Replaced Product at the end of the thirty (30) day period. Each Update will be subject to the terms and conditions of the license agreement accompanying the Update which must be accepted by you at the time you download or install the Update. If you do not agree to the license agreement accompanying the Update, do not download or install the Update.",
          ],
        },
        {
          title: "(1.9) Order of Precedence between EULA and Quote",
          body: [
            "If there is any conflict between the terms and conditions in the Quote and the terms and conditions of this EULA, or if the Quote changes any of the terms of this EULA, the terms and conditions of the Quote will apply.",
            "In the event of an order between you and an Authorized Reseller the following will apply: (A) any terms and conditions in the order imposing obligations on the Authorized Reseller that are in addition to or different from the obligations we have to you pursuant to this EULA will be born solely by the Authorized Reseller and our obligations to you and limits on our liability will be governed solely by the terms and conditions of this EULA and (B) any terms and conditions that conflict with or would otherwise alter any of the following under this EULA will have no effect unless expressly agreed to in a written instrument executed by us.",
          ],
        },
        {
          title: "(1.10) Consent to the Collection and Storage of Usage Data",
          body: [
            "The user agrees that, in connection with the use of this software, the company may automatically collect and store the user’s usage data through tools such as Google Analytics. This data will be used to enhance the performance of the software and optimize the user experience through statistical analysis. The data collected may include IP addresses, device information, and usage details, but it is not used to identify individuals and will be handled in accordance with our privacy policy.",
            "By using this software, the user consents to the collection and processing of this data.",
          ],
        },
        {
          title: "(2) PRICING, PAYMENT AND RENEWAL",
          body: [],
        },
        {
          title: "(2.1) Pricing",
          body: [
            "Our fees for licensing the Product directly from us in accordance with this EULA are available on our website or via a Quote and are subject to change at any time (\"Fees\"). Unless you have purchased a license through an Authorized Reseller of our Product, we or our payments collection agent will charge the Fees to the payment method you have chosen for purchasing the license and send you a receipt to Your email address.",
            "We or the reseller will also share with you the following information, the type of license you have (Subscription or Perpetual), the term of your license (if you have purchased a Subscription License), what versions of the Product are being licensed, the number of permitted devices on which you may deploy the Software (if applicable), the type of support service and term of such service (if any), the Fees charged, taxes applicable and the license key to activate the Product and any other terms specific to the Product in question.",
            "All amounts payable under this EULA are non-refundable and without set-off or counterclaim. We or our payments collection agent may send you one or more reminders to renew your Subscription License before the expiry of its term (\"Expiry\").",
          ],
        },
        {
          title: "(2.2) Payment Terms",
          body: [
            "All Fees payable to us are payable in the currency specified in the Order, or if no currency is specified then in United Stated Dollars, are due within 30 days from the invoice date and, except as expressly specified herein, are non-cancellable and non-refundable. We may charge you interest at the highest rate permitted by law on all overdue payments.",
            "If you and we agree that you will pay by credit card, you will provide us with valid and updated credit card information and you authorize us to bill such credit card for all Fees applicable at the time that you order the Product or any renewal.",
          ],
        },
        {
          title: "(2.3) Taxes",
          body: [
            "All Fees are exclusive of any taxes, levies, or duties. You are wholly responsible for any taxes that may arise out of the EULA or your purchase or use of the Product. Notwithstanding the foregoing, sales tax, goods and services tax (GST) or value-added tax (VAT) may be charged in accordance with applicable laws and regulations.",
            "You confirm that we can rely on the \"bill to\" name and address you have provided at the time of ordering or paying for the Product license (\"Bill to Name and Address\") as being the place of supply for sales and income tax purposes or VAT purposes.",
            "You shall reimburse us for the amount of any such taxes or duties which we have paid or incurred directly as a result of our transactions with you, and you agree that we may charge any such reimbursable taxes to any payment method you have used to pay the associated Fees.",
          ],
        },
        {
          title: "(2.4) Orders between You and Our Authorized Reseller",
          body: [
            "Notwithstanding the terms of this section, if you purchased your license to the Product and/or maintenance and support from an Authorized Reseller, then the Fees will be set out in the order between you and the Authorized Reseller. The Authorized Reseller may be responsible for billing and/or collecting payment from you and if so, the billing and collection terms agreed to between you and the Authorized Reseller may differ from the terms set out in this section.",
          ],
        },
        {
          title: "(2.5) No Reliance on Future Availability of any Product or Update",
          body: [
            "You agree that you have not relied on the future availability of any Product or Updates in your purchasing decision or in entering into the payment obligations in your order.",
          ],
        },
        {
          title: "(3) IP OWNERSHIP AND FEEDBACK",
          body: [],
        },
        {
          title: "(3.1) IP Ownership",
          body: [
            "The Product, Documentation, and any software, code, tools, libraries, scripts, application programming interfaces, templates, algorithms, workflows, user interfaces, links, proprietary methods and systems, know-how, trade secrets, techniques, designs, inventions, and other tangible or intangible technical material, information and works of authorship underlying or otherwise used to make available the Product, including, without limitation, all Intellectual Property Rights therein and thereto all other current or future intellectual property developed by us or our Affiliates, and all worldwide Intellectual Property Rights in each of the foregoing and all Updates, upgrades, enhancements, new versions, releases, corrections, and other modifications thereto and derivative works thereof, are the exclusive property of us or our Affiliates or our or their licensors or suppliers.",
            "Except for the rights and licenses expressly granted herein, all such rights are reserved by us and our Affiliates and our or their licensors and suppliers. All title and Intellectual Property Rights in and to the content that may be accessed through use of the Product is the property of the respective content owner and may be protected by applicable copyright or other intellectual property laws and treaties.",
            "As used herein, \"Intellectual Property Rights\" means any and all current and future (a) rights associated with works of authorship, including copyrights, mask work rights, and moral rights; (b) trademark or service mark rights; (c) trade secret rights; (d) patents, patent rights, and industrial property rights; (e) layout design rights, design rights, and other proprietary rights of every kind and nature other than trademarks, service marks, trade dress, and similar rights; and (f) registrations, applications, renewals, extensions, or reissues of any of (a) to (e), in each case, in any jurisdiction throughout the world.",
          ],
        },
        {
          title: "(3.2) Content",
          body: [
            "You own and are responsible for data, information, material or other content, including, contacts, and files, that you create resulting from the use of our Software or that you transmit through the Software (\"Content\"). You shall be solely responsible for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to your Content.",
            "You agree that any loss or damage of any kind that occurs as a result of the use of any Content that you create or have created, upload, post, share, transmit, display or otherwise make available through your use of the Software is solely your responsibility and you will indemnify us from any third-party claims in relation to the Content.",
          ],
        },
        {
          title: "(3.3) Feedback",
          body: [
            "You have no obligation to provide us with ideas, comments, information, concepts, reviews, know-how, techniques, suggestions, documentations, proposals and/or any other material (\"Feedback\"). However, if you submit Feedback to us, while you retain ownership of such Feedback, you hereby grant us a nonexclusive, royalty-free, perpetual, irrevocable, transferable, unlimited license to use and otherwise exploit your Feedback for any purpose worldwide.",
            "In addition, you agree not to enforce any \"moral rights\" in and to the Feedback, to the extent permitted by applicable law.",
            "Further, by submitting Feedback, you represent and warrant that (i) your Feedback does not contain the confidential or proprietary information that belongs to any third parties; (ii) we are not under any obligation of confidentiality, express or implied, with respect to the Feedback; (iii) we may have something similar to the Feedback already under consideration or in development; and (iv) you are not entitled to any compensation or reimbursement of any kind from us for the Feedback under any circumstances",
          ],
        },
        {
          title: "(4) CONFIDENTIALITY",
          body: [],
        },
        {
          title: "(4.1) Confidentiality Obligations",
          body: [
            "Except as otherwise provided herein, each party agrees to retain in confidence all information and know-how transmitted or disclosed to the other that the disclosing party has identified as being proprietary and/or confidential or should reasonably be understood to be confidential given the nature of the information and the circumstances surrounding its disclosure and agrees to make no use of such information and know-how except under the terms of this EULA.",
            "However, neither party will have an obligation to maintain the confidentiality of information that (a) it received rightfully from a third party without an obligation to maintain such information in confidence; (b) was known to the receiving party prior to its disclosure by the disclosing party; (c) is or becomes a matter of public knowledge through no fault of the receiving party; or (d) is independently developed by the receiving party without use of the confidential information of the disclosing party.",
            "Further, either party may disclose confidential information of the other party as required by governmental or judicial order, provided such party gives the other party prompt written notice prior to such disclosure (unless such prior notice is not permitted by applicable law) and complies with any protective order (or equivalent) imposed on such disclosure.",
            "You will treat any source code for the Product as our confidential information and will not disclose, disseminate, or distribute such materials to any third party without our prior written permission.",
            "Each party's obligations under this section will apply during the term of this EULA and for five (5) years following termination of this EULA, provided, however, that (i) obligations with respect to source code will survive forever and (ii) trade secrets will be maintained as such until they fall into the public domain.",
          ],
        },
        {
          title: "(4.2) Product Benchmark Results",
          body: [
            "You acknowledge that any benchmark results pertaining to the Product are our confidential information and may not be disclosed or published without our prior written consent. This provision applies regardless of whether the benchmark tests are conducted by you or us.",
          ],
        },
        {
          title: "(4.3) Remedies for Breach of Confidentiality Obligations",
          body: [
            "Each party acknowledges that in the event of a breach or threat of breach of this section, money damages will not be adequate. Therefore, in addition to any other legal or equitable remedies, the non-breaching party will be entitled to seek injunctive or similar equitable relief against such breach or threat of breach without proof of actual injury and without posting of a bond.",
          ],
        },
        {
          title: "(5) DATA PRIVACY",
          body: [
            "You will not transfer to us and we do not access, collect, store, retain, transfer, use or otherwise process in any manner any data or information that is subject to regulation under applicable international, federal, state, provincial and local laws, rules, regulations, directives and governmental requirements currently in effect and as they become effective relating in any way to the privacy, confidentiality or security of Protected Data including, without limitation, the European Union Directives and Regulations governing general data protection and all applicable industry standards concerning privacy, data protection, confidentiality or information security (\"Applicable Data Protection Law\") in connection with this Agreement, including without limitation Personal Data, Protected Health Information and Personally Identifiable Information (as such terms are defined in Applicable Data Protection Law), except for minimal data related to your representatives or employees, such as their name, telephone number, e-mail address, job title which may be collected directly from your representatives or employees and it is necessary to allow the parties to enter into and perform this EULA.",
            "You are solely responsible for complying with Applicable Data Protection Law in your use of the Product(s).",
          ],
        },
        {
          title: "(6) WARRANTIES",
          body: [],
        },
        {
          title: "(6.1) Authority",
          body: [
            "Each party represents and warrants that it has the legal power and authority to enter into this EULA.",
          ],
        },
        {
          title: "(6.2) Product Compliance with Documentation",
          body: [
            "We warrant to you that the Product will comply with the applicable Documentation in all material respects for the greater of ninety (90) days from the date of delivery or the duration of the Subscription Term. Your exclusive remedy, and our sole liability, with respect to any breach of this warranty will be for us to use commercially reasonable efforts to promptly correct the non-compliance (provided that, you notify us in writing within the warranty period and allow us a reasonable cure period).",
            "If we, at our discretion, reasonably determine that correction is not economically or technically feasible, we may terminate your license to the Product and provide you a prorated refund of the prepaid Fees for the unused portion of the license period. Delivery of additional copies of, or Updates to, the Product will not restart or otherwise affect the warranty period.",
          ],
        },
        {
          title: "(6.3) Warranty Exclusions",
          body: [
            "The warranty specified herein does not cover any Product provided on an unpaid evaluation (including Community License) or trial basis, or defects to the Product due to accident, abuse, service, alteration, modification or improper installation or configuration by you, your Affiliates, your or their personnel or any third party not engaged by us.",
          ],
        },
        {
          title: "(6.4) Warranty Disclaimers",
          body: [
            "EXCEPT FOR THE WARRANTIES EXPRESSLY STATED HEREIN, THE PRODUCT AND DOCUMENTATION ARE PROVIDED \"AS IS\", WITH ALL FAULTS, AND WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NONINFRINGEMENT, AVAILABILITY, ERROR-FREE OR UNINTERRUPTED OPERATION, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING, COURSE OF PERFORMANCE, OR USAGE OF TRADE.",
            "TO THE EXTENT THAT WE MAY NOT AS A MATTER OF APPLICABLE LAW DISCLAIM ANY IMPLIED WARRANTY, THE SCOPE AND DURATION OF SUCH WARRANTY WILL BE THE MINIMUM PERMITTED UNDER APPLICABLE LAW.",
          ],
        },
        {
          title: "(7) LIMITATION OF LIABILITY AND DISCLAIMER OF CERTAIN TYPES OF DAMAGES",
          body: [],
        },
        {
          title: "(7.1) Limitation of Liability",
          body: [
            "EXCEPT FOR A PARTY'S BREACH OF ITS CONFIDENTIALITY OBLIGATIONS HEREIN, OR YOUR MATERIAL VIOLATION OF OUR INTELLECTUAL PROPERTY RIGHTS OR OF THE LICENSE RESTRICTIONS SET OUT IN THIS EULA, TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL EITHER PARTY'S LIABILITY FOR ALL COSTS, DAMAGES, AND EXPENSES ARISING OUT OF OR RELATED TO THIS EULA WHETHER BASED UPON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE AT LAW EXCEED, IN THE AGGREGATE, THE FEES PAID TO US FOR THE PRODUCT AND/OR SERVICE THAT IS THE SUBJECT OF THE CLAIM, PROVIDED, HOWEVER, THAT IF THE FEES PAID FOR SUCH PRODUCT AND/OR SERVICE ARE PAID ON A RECURRING BASIS, THEN THE NOT TO EXCEED LIMIT WILL BE THE FEES PAID TO US FOR THE PRODUCT AND/OR SERVICE DURING THE TWELVE (12) MONTH PERIOD IMMEDIATELY PRECEDING THE DATE THE CLAIM AROSE.",
            "OUR AFFILIATES AND LICENSORS, AND THE SUPPLIERS TO US, OUR AFFILIATES OR LICENSORS, WILL, TO THE EXTENT PERMITTED BY APPLICABLE LAW, HAVE NO LIABILITY TO YOU OR TO ANY OTHER PERSON OR ENTITY FOR DAMAGES, DIRECT OR OTHERWISE, ARISING OUT OF THIS EULA, INCLUDING, WITHOUT LIMITATION, DAMAGES IN CONNECTION WITH THE PERFORMANCE OR OPERATION OF OUR PRODUCTS OR OUR PERFORMANCE OF SERVICES.",
          ],
        },
        {
          title: "(7.2) Disclaimer of Certain Types of Damages",
          body: [
            "EXCEPT FOR YOUR MATERIAL VIOLATION OF OUR INTELLECTUAL PROPERTY RIGHTS OR THE LICENSE RESTRICTIONS SET OUT IN THIS EULA, TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL EITHER PARTY, ITS AFFILIATES OR ITS LICENSORS OR THEIR RESPECTIVE SUPPLIERS BE LIABLE FOR ANY SPECIAL, INDIRECT, CONSEQUENTIAL, INCIDENTAL, PUNITIVE OR TORT DAMAGES ARISING IN CONNECTION WITH THIS EULA OR EITHER PARTY'S PERFORMANCE UNDER THIS EULA OR THE PERFORMANCE OF OUR PRODUCTS, OR FOR ANY DAMAGES RESULTING FROM LOSS OF USE, LOSS OF OPPORTUNITY, LOSS OF DATA, LOSS OF REVENUE, LOSS OF PROFITS, OR LOSS OF BUSINESS, EVEN IF THE PARTY, ITS AFFILIATES, ITS LICENSORS, OR ANY OF THEIR RESPECTIVE SUPPLIERS HAVE BEEN ADVISED OF THE POSSIBILITY OF THOSE DAMAGES.",
          ],
        },
        {
          title: "(8) EXPIRY AND TERMINATION OF LICENSE",
          body: [
            "In addition to any other termination provisions set forth herein, you will lose all rights to the Product under this EULA if you (a) expressly terminate your license for your convenience or (b) have a Subscription License and have failed to renew your Subscription License on Expiry.",
            "We also reserve the right to terminate your license to the Product with immediate effect upon written notice to you (\"Termination\") if you breach this EULA and such breach: (a) is a material breach; (b) is incapable of being cured; or (c) is curable but remains uncured for thirty (30) days after your receipt of written notice of breach from us.",
            "Upon Expiry or Termination, you must promptly: (a) uninstall and discontinue using any copies of the Product in your possession or under your control; (b) destroy all Documentation and other materials or Confidential Information received from us; and (c) certify to us in writing that you have performed your obligations post-Expiry or Termination under (a) and (b) above.",
            "Any provisions of this EULA containing licensing restrictions, warranties and warranty disclaimers, confidentiality obligations, limitations of liability and/or indemnity terms, audits rights, and any term of this EULA which, by its nature, is intended to survive Expiry or Termination, will remain in effect following any Expiry or Termination of this EULA, as will your obligation to pay any Fees accrued and owing to us as of termination or expiration.",
          ],
        },
        {
          title: "(9) GENERAL",
          body: [],
        },
        {
          title: "(9.1) Entire Agreement",
          body: [
            "This EULA, and any terms expressly incorporated herein by reference, will constitute the entire agreement between you and us with respect to the subject matter of this EULA and supersedes all prior and contemporaneous communications, oral or written, signed or unsigned, regarding such subject matter. Use of any purchase order or other document you supply in connection with this EULA will be for administrative convenience only and all terms and conditions stated therein will be void and of no effect.",
            "Except as otherwise expressly contemplated in this EULA, this EULA may not be modified or amended other than in writing signed by you and us. If we have provided you with a translation of the English language version of this EULA, you agree that such translation is provided for your convenience only and that the English language version, not the translation, of this EULA will be legally binding on you.",
          ],
        },
        {
          title: "(9.2) Notices",
          body: [
            "Notices of termination, material breach, or your insolvency (\"Legal Notices\") must be clearly identified as Legal Notices and sent via overnight courier or certified mail with proof of delivery to the following addresses: For us: 3003 North 1st Street, Suite 221, San Jose, CA 95134, Attention: Legal. For you: your address set out in the Quote. Legal Notices sent in accordance with the above will be effective upon the five business days after mailing.",
            "Either party may change its address for receipt of notices upon written notice to the other party.",
          ],
        },
        {
          title: "(9.3) Third Party Dependencies",
          body: [
            "The Software may include third party software components (collectively, Third Party Dependencies) including programs that are available under either their own license, or an open source or free software license (each a Third Party License) and distributed, embedded or bundled with the Software or recommended in connection with the Software's installation and use. Third Party Licenses are typically found in a readme file in the Software or accompanying the Software and/or hardware.",
            "This EULA does not alter any rights or obligations Licensee may have under Third Party Licenses. Third Party Dependencies are provided \"AS IS\" and notwithstanding anything to the contrary, the Disclaimer of Warranties and Limitation of Liability provisions of this EULA shall apply to Third Party Dependencies.",
          ],
        },
        {
          title: "(9.4) Identification",
          body: [
            "You agree that we may identify you as a current or former customer of the Software and display your company name and/or logo on our website, in press releases and in our published marketing materials, solely in connection with the Software and such identification. We will comply with any reasonable trademark usage guidelines you provide to us in connection herewith. You retain all title in and to your marks, and all goodwill developed from such use shall be solely for your benefit.",
          ],
        },
        {
          title: "(9.5) Choice of Law",
          body: [
            "This EULA is governed by the laws of California, U.S.A., without regard to the conflict of laws principles thereof. If any dispute, controversy, or claim cannot be resolved by a good-faith discussion between the parties, then it will be submitted for resolution to a state or federal court in Delaware, USA, and the parties hereby irrevocably and unconditionally agree to submit to the exclusive jurisdiction and venue of such court.",
            "The Uniform Computer Information Transactions Act and the United Nations Convention on the International Sale of Goods will not apply to this EULA.",
          ],
        },
        {
          title: "(9.6) Assignment",
          body: [
            "You may not, without our prior written consent, assign or novate this EULA, any of your rights or obligations under this EULA, or the Products or any of our Confidential Information, in whole or in part, by operation of law, sale of assets, merger or otherwise, to any other party, including any parent, subsidiary or affiliated entity. Your Change of Control will constitute an assignment for purposes of the preceding sentence.",
            "A \"Change of Control\" will include, but not be limited to, any merger, consolidation, amalgamation, reorganization or sale, transfer or exchange of the capital stock or equity interests of you in a transaction or series of transactions which results in the holders of your capital stock or equity interests holding less than 50% of the outstanding capital stock or equity interests immediately following such transaction(s).",
          ],
        },
        {
          title: "(9.7) U.S. Government End User",
          body: [
            "If the Product is being acquired by or on behalf of the U.S. Government or by a U.S. Government prime contractor or subcontractor (at any tier), then the U.S. Government's rights in the Product will be only as set out herein except that this Agreement shall be governed by federal law. The Product and Documentation are \"commercial items\" as that term is defined at 48 C.F.R. 2.101, consisting of \"commercial computer software\" and \"commercial software documentation\" as such terms are used in 48 C.F.R. 12.212.",
            "Consistent with 48 C.F.R. 12.212 and 48 C.F.R. 227.7202-1 through 227.7202-4, all U.S. Government end users acquire the Product and such Documentation with only those rights set out herein. Any additional rights or changes desired by the U.S. Government shall be negotiated with us consistent with this EULA.",
          ],
        },
        {
          title: "(9.8) Export Controls",
          body: [
            "Export laws and regulations of the United States and any other relevant local export laws and regulations apply to the Products. You agree that such export control laws, including, without limitation, the U.S. Export Administration Act and its associated regulations, govern your use of the Product (including technical data), and you agree to comply with all such export laws and regulations (including \"deemed export\" and \"deemed re-export\" regulations).",
            "You agree that no data, information and/or Product (or direct product thereof) will be exported, directly or indirectly, in violation of these laws, or will be used for any purpose prohibited by these laws including, without limitation, nuclear, chemical, or biological weapons proliferation, or development of missile technology.",
          ],
        },
        {
          title: "(9.9) Compliance with Laws",
          body: [
            "Each party acknowledges its obligation to comply with all applicable laws, rules, statutes and regulations, including specifically but not limited to anti-corruption legislation.",
            "Each party warrants that, to the best of its knowledge no money or other consideration of any kind paid or payable under this Agreement or by separate agreement is, has been or will be used for unlawful purposes, including purposes violating anti-corruption laws, including making or causing to be made payments to any employee of either party or anyone acting on their behalf to assist in obtaining or retaining business with, or directing business to, any person, or securing any improper advantage.",
          ],
        },
        {
          title: "(9.10) Severability",
          body: [
            "If any provision of this EULA is terminated or held by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remainder of this EULA will remain in full force and effect.",
          ],
        },
        {
          title: "(9.11) Waiver",
          body: [
            "Failure or delay in exercising any right, power, privilege or remedy hereunder will not constitute a waiver thereof. A waiver of default will not operate as a waiver of any other default or of the same type of default on future occasions.",
          ],
        },
        {
          title: "(9.12) Force Majeure",
          body: [
            "Neither you nor we will be liable for any delay or failure to take any action required under this EULA (except for payment) due to any cause beyond the reasonable control of you or us, as the case may be, including, but not limited to unavailability or shortages of labor, materials, or equipment, failure or delay in the delivery of vendors and suppliers and delays in transportation.",
          ],
        },
        {
          title: "(9.13) Independent Contractor",
          body: [
            "We are an independent contractor, and our personnel are not and shall not be considered employees or agents of your company for any purpose whatsoever.",
          ],
        },
      ],
    },
    {
      title: "PART II TERMS FOR COMMUNITY LICENSE",
      body: [
        "If the license type for the Product you are using (hereinafter the \"Product\") is designated as a \"Community License\", PART II (Terms for Community License) of this EULA shall take precedence, and for matters not specified herein, PART I (General Terms) of this EULA shall apply.",
      ],
      subsections: [
        {
          title: "(1) GRANT OF COMMUNITY LICENSE",
          body: [
            "QueryPie (hereinafter the \"Licensor\") grants you (hereinafter the \"Licensee\") a worldwide, non-exclusive, non-transferable, non-sublicensable, and non-salable Community License to the Product, free of charge. The term for the Community License is one (1) year.",
          ],
        },
        {
          title: "(2) LIMITATION ON NUMBER OF USERS",
          body: [
            "This Community License is valid only for a maximum of five (5) active users. Active users are counted based on the account status within the Product, and temporary or guest accounts are also considered active users.",
          ],
        },
        {
          title: "(3) RESTRICTIONS ON USE",
          body: [
            "The use of the Community License for the following purposes is prohibited and restricted: (a) To copy, modify, adapt, translate, or otherwise create derivative works of the Product or Documentation; (b) To reverse translate, reverse engineer, disassemble, decompile or \"unlock\", decode or otherwise attempt to reconstruct or discover the source code or underlying structure, ideas, or algorithms of the Product.",
          ],
        },
        {
          title: "(4) SUPPORT SERVICES",
          body: [
            "Support services provided under the Community License are limited, and the Licensor may provide information through non-contact materials such as online documentation, frequently asked questions (FAQ), and community forums. Emergency technical support, customization, or responses from dedicated personnel are not included in this license.",
          ],
        },
        {
          title: "(5) TELEMETRY AND USAGE DATA COLLECTION",
          body: [
            "(5.1) The Product may collect telemetry data to improve the user experience and enhance functionality. The data collected includes, but is not limited to, the following: (a) Product version information in use, (b) Hostname, (c) Locale information per user, (d) Operating system (OS) information, (e) Country information, (f) Browser information, (g) Accessed page address information.",
            "However, (b) Hostname information is collected for system identification and diagnostic purposes and will be anonymized/de-identified so that it cannot identify individuals before being utilized.",
            "(5.2) Personally Identifiable Information (PII) such as name, email, or phone number is not collected. Business content and authentication information are not collected, and the collected data is anonymized and used solely for statistical analysis.",
            "(5.3) The collected data is not provided to third parties, and the user is deemed to have consented to this upon installing the Product.",
            "(5.4) The items of information collected during the use of the Product may be subject to change in the future for the purpose of improving the Licensor's services. However, even in such cases, personal information or personally identifiable information will not be included in the collection items.",
          ],
        },
        {
          title: "(6) LIMITATION OF LIABILITY",
          body: [
            "The Licensor shall not be liable for any damages, whether direct or indirect, foreseeable or not, arising from the use or inability to use the Product. This includes, but is not limited to, damages for loss of data, loss of revenue, business interruption, or claims by third parties.",
          ],
        },
        {
          title: "(7) OPEN SOURCE SOFTWARE",
          body: [
            "The Product may include or reference one or more open-source software components, and such components are used in accordance with their respective open-source license terms. The full text of these licenses is available within the QueryPie product and users are required to comply with them.",
          ],
        },
        {
          title: "(8) TERMINATION OF LICENSE",
          body: [
            "(8.1) This Community License may be terminated immediately if any of the following events occur: First, the expiration of the license term (1 year). Second, a material breach of this addendum or this Agreement.",
            "(8.2) The Licensor may terminate the Community License even before the expiration of the license term (1 year) if there are unavoidable reasons, such as legal requirements, the discovery of a serious security threat, or the Licensee's abuse of the license.",
          ],
        },
        {
          title: "(9) CHANGES TO THE TERMS",
          body: [
            "The Licensor may change the contents of this Community License at any time according to its policy, and accordingly, the conditions for the free provision of the license, limitations on the number of users, and the scope of use may also be adjusted in the future. The conditions for free use of the Product may be converted to paid, or the limitation on the number of active users may be changed (expanded or reduced).",
            "Such changes will be notified in advance through the QueryPie website or within the Product, and will take effect after a certain period from the date of notice.",
          ],
        },
      ],
    },
  ],
  title: "EULA",
};
