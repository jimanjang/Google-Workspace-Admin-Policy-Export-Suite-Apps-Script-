function fetchGmailPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const gmailSettings = [
    "settings/gmail.confidential_mode",
    "settings/gmail.enhanced_smime_encryption",
    "settings/gmail.email_spam_filter_ip_allowlist",
    "settings/gmail.enhanced_pre_delivery_message_scanning",
    "settings/gmail.spoofing_and_authentication",
    "settings/gmail.links_and_external_images",
    "settings/gmail.email_attachment_safety",
    "settings/gmail.email_address_lists",
    "settings/gmail.blocked_sender_lists",
    "settings/gmail.spam_override_lists",
    "settings/gmail.content_compliance",
    "settings/gmail.objectionable_content",
    "settings/gmail.attachment_compliance",
    "settings/gmail.comprehensive_mail_storage",
    "settings/gmail.rule_states",
    "settings/gmail.user_email_uploads",
    "settings/gmail.pop_access",
    "settings/gmail.imap_access",
    "settings/gmail.workspace_sync_for_outlook",
    "settings/gmail.auto_forwarding",
    "settings/gmail.name_format",
    "settings/gmail.per_user_outbound_gateway",
    "settings/gmail.email_image_proxy_bypass",
    "settings/gmail.mail_delegation"

  ];

  const gmailSettingsMap = {
    "settings/gmail.confidential_mode": {
      consolePage: "Gmail 설정",
      consoleSetting: "기밀 모드",
      fieldMappings: [
        { description: "비밀 모드 사용 설정", apiFieldName: "enableConfidentialMode" }
      ]
    },
    "settings/gmail.enhanced_smime_encryption": {
      consolePage: "Gmail 설정",
      consoleSetting: "S/MIME 암호화",
      fieldMappings: [
        { description: "사용자가 자신의 인증서를 업로드하도록 허용", apiFieldName: "allowUserToUploadCertificates"},
        { description: "특정 도메인에 대해 추가 루트 인증서 수락:	", apiFieldName: "customRootCertificates" }
      ]
    },
    "settings/gmail.email_spam_filter_ip_allowlist": {
      consolePage: "Gmail 설정",
      consoleSetting: "이메일 허용 목록",
      fieldMappings: [
        { description: "이메일 수신을 허용하는 IP 주소 입력	", apiFieldName: "allowedIpAddresses" }
      ]
    },
    "settings/gmail.enhanced_pre_delivery_message_scanning": {
      consolePage: "Gmail 설정",
      consoleSetting: "전송 전 메시지 검사 강화",
      fieldMappings: [
        { description: "의심스러운 콘텐츠의 경우 전송 전에 강화된 감지 기능을 사용하도록 설정", apiFieldName: "enableImprovedSuspiciousContentDetection" }
      ]
    },
    "settings/gmail.spoofing_and_authentication": {
      consolePage: "Gmail 설정",
      consoleSetting: "스푸핑 및 인증",
      fieldMappings: [
        { description: "도메인 이름 스푸핑 감지", apiFieldName: "detectDomainNameSpoofing" },
        { description: "작업 선택", apiFieldName: "domainNameSpoofingConsequence" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "domainNameSpoofingQuarantineId" },
        { description: "직원 이름의 위장 방지", apiFieldName: "detectEmployeeNameSpoofing" },
        { description: "작업 선택", apiFieldName: "employeeNameSpoofingConsequence" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "employeeNameSpoofingQuarantineId" },
        { description: "도메인을 위장하는 수신 이메일로부터 보호", apiFieldName: "detectDomainSpoofingFromUnauthenticatedSenders"},
        { description: "작업 선택", apiFieldName: "domainSpoofingConsequence	" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "domainSpoofingQuarantineId" },
        { description: "인증되지 않은 이메일 보호", apiFieldName: "detectUnauthenticatedEmails" },
        { description: "작업 선택", apiFieldName: "unauthenticatedEmailConsequence" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "unauthenticatedEmailQuarantineId" },
        { description: "도메인을 위장하는 수신 이메일로부터 그룹스 보호	", apiFieldName: "detectGroupsSpoofing" },
        { description: "설정 적용 대상", apiFieldName: "groupsSpoofingVisibilityType" },
        { description: "작업 선택", apiFieldName: "groupsSpoofingConsequence	" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "groupsSpoofingQuarantineId" },
        { description: "향후 권장 설정 자동 적용하기	", apiFieldName: "applyFutureSettingsAutomatically" }
      ]
    },
    "settings/gmail.links_and_external_images": {
      consolePage: "Gmail 설정",
      consoleSetting: "링크 및 외부 이미지",
      fieldMappings: [
        { description: "단축 URL 뒤에 숨은 링크 확인	", apiFieldName: "enableShortenerScanning" },
        { description: "연결된 이미지 검사", apiFieldName: "enableExternalImageScanning" },
        { description: "신뢰할 수 없는 도메인으로 연결되는 링크를 클릭하면 경고 메시지 표시", apiFieldName: "enableAggressiveWarningsOnUntrustedLinks	" },
        { description: "향후 권장 설정 자동 적용하기	", apiFieldName: "applyFutureSettingsAutomatically" }
      ]
    },
    "settings/gmail.email_attachment_safety": {
      consolePage: "Gmail 설정",
      consoleSetting: "이메일 첨부파일 보안",
      fieldMappings: [
        { description: "암호화된 첨부파일 보호", apiFieldName: "enableEncryptedAttachmentProtection" },
        { description: "작업 선택", apiFieldName: "encryptedAttachmentProtectionConsequence" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "encryptedAttachmentProtectionQuarantineId" },
        { description: "신뢰할 수 없는 발신자가 보낸 스크립트가 포함된 첨부파일로부터 보호", apiFieldName: "enableAttachmentWithScriptsProtection" },
        { description: "작업 선택", apiFieldName: "attachmentWithScriptsProtectionConsequence" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "attachmentWithScriptsProtectionQuarantineId	" },
        { description: "이메일에 포함된 변칙적인 첨부파일 형식으로부터 보호", apiFieldName: "enableAnomalousAttachmentProtection" },
        { description: "작업 선택", apiFieldName: "anomalousAttachmentProtectionConsequence	" },
        { description: "스팸 격리 저장소 선택", apiFieldName: "anomalousAttachmentProtectionQuarantineId" },
        { description: "다음과 같은 일반적이지 않은 파일 형식 허용 목록", apiFieldName: "allowedAnomalousAttachmentFiletypes"},
        { description: "향후 권장 설정 자동 적용하기	", apiFieldName: "applyFutureRecommendedSettingsAutomatically"}
      ]
    },
    "settings/gmail.email_address_lists": {
      consolePage: "Gmail 설정",
      consoleSetting: "주소 목록 관리",
      fieldMappings: [
        { description: "주소 목록 관리하기", apiFieldName: "emailAddressList" }
      ]
    },
    "settings/gmail.blocked_sender_lists": {
      consolePage: "Gmail 설정",
      consoleSetting: "차단된 발신자",
      fieldMappings: [
        { description: "이메일 주소 또는 도메인을 근거로 특정 발신자 차단 또는 승인하기", apiFieldName: "blockedSenders" }
      ]
    },
    "settings/gmail.spam_override_lists": {
      consolePage: "Gmail 설정",
      consoleSetting: "스팸",
      fieldMappings: [
        { description: "스팸 폴더로 들어가지 않도록 승인된 발신자 목록을 만듭니다.", apiFieldName: "spamOverride" }
      ]
    },
    "settings/gmail.content_compliance": {
      consolePage: "Gmail 설정",
      consoleSetting: "콘텐츠 규정 준수",
      fieldMappings: [
        { description: "단어, 구문 또는 패턴을 기반으로 하여 고급 콘텐츠 필터 구성하기", apiFieldName: "contentComplianceRules" }
      ]
    },
    "settings/gmail.objectionable_content": {
      consolePage: "Gmail 설정",
      consoleSetting: "불쾌감을 주는 콘텐츠",
      fieldMappings: [
        { description: "단어 목록을 기반으로 콘텐츠 필터 구성", apiFieldName: "objectionableContentRules" }
      ]
    },
    "settings/gmail.attachment_compliance": {
      consolePage: "Gmail 설정",
      consoleSetting: "첨부파일 규정 준수",
      fieldMappings: [
        { description: "파일 형식, 파일 이름, 메일 크기에 따라 첨부파일 필터 구성", apiFieldName: "attachmentComplianceRules" }
      ]
    },
    "settings/gmail.comprehensive_mail_storage": {
      consolePage: "Gmail 설정",
      consoleSetting: "통합 메일 저장용량",
      fieldMappings: [
        { description: "주고받은 모든 메일의 사본이 관련 사용자의 편지함에 저장되도록 합니다", apiFieldName: "ruleId" }
      ]
    },
    "settings/gmail.rule_states": {
      consolePage: "Gmail 설정",
      consoleSetting: "해당 사항 없음(모든 규칙)",
      fieldMappings: [
        { description: "N/A", apiFieldName: "ruleStates" }
      ]
    },
    "settings/gmail.rule_states": {
      consolePage: "Gmail 설정",
      consoleSetting: "해당 사항 없음(모든 규칙)",
      fieldMappings: [
        { description: "주고받은 모든 메일의 사본이 관련 사용자의 편지함에 저장되도록 합니다", apiFieldName: "ruleId" }
      ]
    },
    "settings/gmail.user_email_uploads": {
      consolePage: "Gmail 설정",
      consoleSetting: "사용자 이메일 업로드",
      fieldMappings: [
        { description: "Gmail 설정 페이지에서 Yahoo!, Hotmail, AOL, 기타 웹메일 또는 POP3 계정으로부터 메일과 연락처를 가져올 수 있는 옵션을 사용자에게 표시합니다", apiFieldName: "enableMailAndContactsImport" }
      ]
    },
    "settings/gmail.pop_access": {
      consolePage: "Gmail 설정",
      consoleSetting: "POP 및 IMAP 액세스",
      fieldMappings: [
        { description: "모든 사용자에 대해 POP 액세스 사용 설정", apiFieldName: "enablePopAccess"}
      ]
    },
    "settings/gmail.imap_access": {
      consolePage: "Gmail 설정",
      consoleSetting: "POP 및 IMAP 액세스",
      fieldMappings: [
        { description: "모든 사용자에 대해 IMAP 액세스 사용 설정	", apiFieldName: "enableImapAccess"},
        { description: "모든 메일 클라이언트를 허용합니다.", apiFieldName: "imapAccessRestriction.allowAllMailClients	"},
        { description: "사용자가 사용할 수 있는 메일 클라이언트 제한 (OAuth 메일 클라이언트만 해당)	", apiFieldName: "imapAccessRestriction.allowedOauthMailClientList"}
      ]
    },
    "settings/gmail.workspace_sync_for_outlook": {
      consolePage: "Gmail 설정",
      consoleSetting: "Google Workspace 동기화",
      fieldMappings: [
        { description: "사용자가 Google Workspace Sync for Microsoft Outlook을 사용하도록 설정	", apiFieldName: "enableGoogleWorkspaceSyncForMicrosoftOutlook"}
      ]
    },
    "settings/gmail.auto_forwarding": {
      consolePage: "Gmail 설정",
      consoleSetting: "자동 전달",
      fieldMappings: [
        { description: "사용자가 수신 이메일을 다른 주소로 자동 전달하도록 허용	", apiFieldName: "enableAutoForwarding"}
      ]
    },
    "settings/gmail.name_format": {
      consolePage: "Gmail 설정",
      consoleSetting: "이름 형식",
      fieldMappings: [
        { description: "사용자가 이 설정을 맞춤설정하도록 허용	", apiFieldName: "allow_custom_display_names"},
        { description: "이름, 성 또는 성, 이름", apiFieldName: "defaultDisplayNameFormat"}
      ]
    },
    "settings/gmail.per_user_outbound_gateway": {
      consolePage: "Gmail 설정",
      consoleSetting: " 사용자별 발신 게이트웨이 허용",
      fieldMappings: [
        { description: "사용자가 도메인 외부에서 호스팅된 '보낸사람' 주소를 구성할 때 외부 SMTP를 통해 메일을 보낼 수 있도록 허용	", apiFieldName: "allowUsersToUseExternalSmtpServers"}
      ]
    },
    "settings/gmail.email_image_proxy_bypass": {
      consolePage: "Gmail 설정",
      consoleSetting: "이미지 URL 프록시 허용 목록",
      fieldMappings: [
        { description: "이미지 URL 패턴을 입력합니다. 일치하는 URL은 이미지 프록시를 우회합니다.	", apiFieldName: "imageProxyBypassPattern"},
        { description: "해당 사항 없음", apiFieldName: "enableImageProxy"}
      ]
    },
    "settings/gmail.mail_delegation": {
      consolePage: "Gmail 설정",
      consoleSetting: "메일 위임",
      fieldMappings: [
        { description: "사용자가 도메인에 있는 다른 사용자에게 편지함 액세스 권한 위임 가능	", apiFieldName: "enableMailDelegation"},
        { description: "사용자가 이 설정을 맞춤설정하도록 허용	", apiFieldName: "allowCustomDelegateAttribution"},
        { description: "계정 소유자 및 이메일 발송 대리인 표시", apiFieldName: "enableDelegateAttribution"},
        { description: "사용자가 Google 그룹에 자신의 편지함에 대한 액세스 권한을 부여하도록 허용	", apiFieldName: "enableMailboxGroupDelegation"},

      ]
    },

    
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A65","E160");

  const headers = [
    "관리 콘솔의 페이지",
    "관리 콘솔의 특정 설정",
    "관리 콘솔 설명",
    "정책 API 필드 이름",
    "값",
    "OU"
  ];
  //sheet.appendRow(headers);
  sheet.getRange(1,1,1, headers.length).setValues([headers]);

  let data = [];

  gmailSettings.forEach(settingType => {
    const setting = gmailSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('gmail',settingType); // 정책 찾기
      const orgUnit = matchingPolicy?.policyQuery?.orgUnit || "기존 값 없음";

      setting.fieldMappings.forEach(mapping => {
        const value = matchingPolicy?.setting?.value?.[mapping.apiFieldName] ?? "default";
        //Logger.log(value);
        //const row = [
        data.push([
          setting.consolePage,
          setting.consoleSetting,
          mapping.description,
          mapping.apiFieldName,
          JSON.stringify(value),
          orgUnit
        ]);
        //sheet.appendRow(row);
      });
    }
  });
  if (data.length>0){
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  }
  Logger.log("Gmail policies saved to the Google Sheet.");
}
