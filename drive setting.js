function fetchDriveAndDocsPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken();

  // 설정 항목 정의
  const driveAndDocsSettings = [
    "settings/drive_and_docs.external_sharing",
    "settings/drive_and_docs.general_access_default",
    "settings/drive_and_docs.shared_drive_creation",
    "settings/drive_and_docs.file_security_update",
    "settings/drive_and_docs.drive_sdk",
    "settings/drive_and_docs.drive_for_desktop"
  ];

  // 설정 매핑
  const driveAndDocsSettingsMap = {
    "settings/drive_and_docs.external_sharing": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "공유 설정 > 공유 옵션",
      fieldMappings: [
        { description: "CUSTOMER_NAME 외부에 허용할 최고 공유 수준을 선택	", apiFieldName: "externalSharingMode"},
        { description: "ORGANIZATION_UNIT_NAME의 사용자가 CUSTOMER_NAME 외부의 사용자 또는 공유 드라이브에서 파일을 받도록 허용", apiFieldName: "allowReceivingExternalFiles" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자 또는 공유 드라이브 소유의 파일을 허용 목록에 추가된 도메인의 사용자와 공유할 때 경고	", apiFieldName: "warnForSharingOutsideAllowlistedDomains" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자가 허용 목록에 추가된 도메인 외부의 사용자 또는 공유 드라이브의 파일을 받도록 허용	", apiFieldName: "allowReceivingFilesOutsideAllowlistedDomains" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자 또는 공유 드라이브에서 신뢰할 수 있는 도메인의 Google 외 계정 사용자와 게스트 공유를 사용하여 항목을 공유하도록 허용	", apiFieldName: "allowNonGoogleInvitesInAllowlistedDomains" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자 또는 공유 드라이브에서 소유한 파일이 CUSTOMER_NAME 외부로 공유된 경우에 경고	", apiFieldName: "warnForExternalSharing" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자 또는 공유 드라이브에서 Google 계정을 사용하지 않는 CUSTOMER_NAME 외부 사용자와 항목을 공유하도록 허용	", apiFieldName: "allowNonGoogleInvites" },
        { description: "CUSTOMER_NAME 외부에 공유가 허용된 경우 ORGANIZATION_UNIT_NAME의 사용자는 링크가 있는 모든 사용자에게 파일 및 게시된 웹 콘텐츠를 표시할 수 있음", apiFieldName: "allowPublishingFiles" },
        { description: "사용자가 Docs 또는 Drive가 아닌 다른 Google 제품을 사용하여 파일을 공유할 때(예: Gmail에 링크 붙여넣기) Google은 수신자가 이 파일에 액세스할 수 있는지 확인합니다. 수신자가 이 파일에 액세스할 수 없다면 파일을 공유할 것인지 묻는 메시지가 사용자에게 표시됩니다.", apiFieldName: "accessCheckerSuggestions" },
        { description: "CUSTOMER_NAME 외부에서 ORGANIZATION_UNIT_NAME의 콘텐츠를 배포할 수 있는 사용자를 선택합니다. 다른 조직 소유의 공유 드라이브로 콘텐츠를 업로드하거나 이동할 수 있는 사용자를 제한할 수 있습니다.	", apiFieldName: "allowedPartiesForDistributingContent" }
      ]
    },
    "settings/drive_and_docs.general_access_default": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "공유 설정 > 일반 액세스 기본값",
      fieldMappings: [
        { description: "ORGANIZATION_UNIT_NAME의 사용자가 항목을 만드는 경우 기본 액세스 권한", apiFieldName: "defaultFileAccess" }
      ]
    },
    "settings/drive_and_docs.shared_drive_creation": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "공유 드라이브 생성",
      fieldMappings: [
        { description: "ORGANIZATION_UNIT_NAME의 사용자가 공유 드라이브를 새로 만들지 못하도록 차단", apiFieldName: "allowSharedDriveCreation" },
        { description: "ORGANIZATION_UNIT_NAME의 사용자가 공유 드라이브를 만들면 다음 조직 단위에 할당됩니다.	", apiFieldName: "orgUnitForNewSharedDrives" },
        { description: "선택한 조직 단위", apiFieldName: "customOrgUnit	" },
        { description: "관리자 액세스 권한이 있는 회원이 아래 설정을 재정의하도록 허용	", apiFieldName: "allowManagersToOverrideSettings" },
        { description: "CUSTOMER_NAME 외부의 사용자가 공유 드라이브의 파일에 액세스하도록 허용	", apiFieldName: "allowExternalUserAccess" },
        { description: "공유 드라이브 멤버가 아닌 사용자를 파일에 추가하도록 허용합니다.	", apiFieldName: "allowNonMemberAccess" },
        { description: "뷰어와 댓글 작성자가 파일을 다운로드, 인쇄, 복사하도록 허용	", apiFieldName: "allowedPartiesForDownloadPrintCopy" },
        { description: "콘텐츠 관리자가 폴더를 공유하도록 허용", apiFieldName: "allowContentManagersToShareFolders	" },


      ]
    },
    "settings/drive_and_docs.file_security_update": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "파일 보안 업데이트",
      fieldMappings: [
        { description: "보안 업데이트 적용", apiFieldName: "securityUpdate" },
        { description: "사용자가 업데이트 관리 허용", apiFieldName: "allowUsersToManageUpdate" }
      ]
    },
    "settings/drive_and_docs.drive_sdk": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "Drive SDK 사용",
      fieldMappings: [
        { description: "Drive SDK API 사용 허용", apiFieldName: "enableDriveSdkApiAccess" }
      ]
    },
    "settings/drive_and_docs.drive_for_desktop": {
      consolePage: "Drive 및 Docs 설정",
      consoleSetting: "데스크톱용 Drive",
      fieldMappings: [
        { description: "데스크톱용 Drive 사용 허용", apiFieldName: "allowDriveForDesktop" },
        { description: "승인된 기기 제한", apiFieldName: "restrictToAuthorizedDevices" },
        { description: "다운로드 링크 표시", apiFieldName: "showDownloadLink" },
        { description: "사용자가 데스크톱용 Google Drive에서 Microsoft Office의 실시간 편집 상태를 사용 설정하도록 허용", apiFieldName: "allowRealTimePresence" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A31","F71");

  // 시트 헤더 추가
  const headers = ["관리 콘솔의 페이지", "관리 콘솔의 특정 설정", "관리 콘솔 설명", "정책 API 필드 이름", "값", "OU"];
  //sheet.appendRow(headers);
  sheet.getRange(1,1,1, headers.length).setValues([headers]);

  let data = [];

  driveAndDocsSettings.forEach(settingType => {
    const setting = driveAndDocsSettingsMap[settingType];
    if (!setting) return;

    const matchingPolicy = findPolicyByType('drive_and_docs',settingType);
    const orgUnit = matchingPolicy?.policyQuery?.orgUnit || "기존 값 없음";

    setting.fieldMappings.forEach(mapping => {
      const value = matchingPolicy?.setting?.value?.[mapping.apiFieldName] || "default";
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
  });
  if (data.length>0){
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  }
  Logger.log("Drive 및 Docs 정책이 정상적으로 저장되었습니다.");
}

// 특정 정책 유형의 설정값 가져오기
