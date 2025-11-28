function fetchChatPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const chatSettings = [
    "settings/chat.chat_history",
    "settings/chat.chat_file_sharing",
    "settings/chat.space_history",
    "settings/chat.external_chat_restriction",
    "settings/chat.chat_apps_access"
  ];

  const chatSettingsMap = {
    "settings/chat.chat_history": {
      consolePage: "Google Chat 설정",
      consoleSetting: "채팅 기록",
      fieldMappings: [
        { description: "채팅 기록 기본 사용 설정", apiFieldName: "historyOnByDefault" },
        { description: "사용자가 채팅 기록 변경 가능", apiFieldName: "allowUserModification" }
      ]
    },
    "settings/chat.chat_file_sharing": {
      consolePage: "Google Chat 설정",
      consoleSetting: "채팅 파일 공유",
      fieldMappings: [
        { description: "외부 파일 공유", apiFieldName: "externalFileSharing" },
        { description: "내부 파일 공유", apiFieldName: "internalFileSharing" }
      ]
    },
    "settings/chat.space_history": {
      consolePage: "Google Chat 설정",
      consoleSetting: "스페이스 기록",
      fieldMappings: [
        { description: "스페이스 기록 상태", apiFieldName: "historyState" }
      ]
    },
    "settings/chat.external_chat_restriction": {
      consolePage: "Google Chat 설정",
      consoleSetting: "외부 채팅 설정",
      fieldMappings: [
        { description: "외부 채팅 허용 여부", apiFieldName: "allowExternalChat" },
        { description: "외부 채팅 제한", apiFieldName: "externalChatRestriction" }
      ]
    },
    "settings/chat.chat_apps_access": {
      consolePage: "Google Chat 설정",
      consoleSetting: "Chat 앱",
      fieldMappings: [
        { description: "Chat 앱 설치 허용", apiFieldName: "enableApps" },
        { description: "수신 웹훅 허용", apiFieldName: "enableWebhooks" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A12","F34");

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

  chatSettings.forEach(settingType => {
    const setting = chatSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('chat',settingType); // 정책 찾기
      const orgUnit = matchingPolicy?.policyQuery?.orgUnit || "기존 값 없음";

      setting.fieldMappings.forEach(mapping => {
        const value = matchingPolicy?.setting?.value?.[mapping.apiFieldName] ?? "default";
        

        
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
  Logger.log("Google Chat policies saved to the Google Sheet.");
}
