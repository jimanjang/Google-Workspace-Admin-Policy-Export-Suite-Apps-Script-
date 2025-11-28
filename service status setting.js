function fetchServiceStatusPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const serviceStatusSettings = [
    "settings/service_status.gmail",
    "settings/service_status.drive",
    "settings/service_status.calendar",
    "settings/service_status.classroom",
    "settings/service_status.chat",
    "settings/service_status.meet",
    "settings/service_status.tasks"
  ];

  const serviceStatusSettingsMap = {
    "settings/service_status.gmail": {
      consolePage: "Service Status 설정",
      consoleSetting: "Gmail 서비스 상태",
      fieldMappings: [
        { description: "Gmail 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.drive": {
      consolePage: "Service Status 설정",
      consoleSetting: "Drive 서비스 상태",
      fieldMappings: [
        { description: "Drive 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.calendar": {
      consolePage: "Service Status 설정",
      consoleSetting: "Calendar 서비스 상태",
      fieldMappings: [
        { description: "Calendar 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.classroom": {
      consolePage: "Service Status 설정",
      consoleSetting: "Classroom 서비스 상태",
      fieldMappings: [
        { description: "Classroom 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.chat": {
      consolePage: "Service Status 설정",
      consoleSetting: "Chat 서비스 상태",
      fieldMappings: [
        { description: "Chat 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.meet": {
      consolePage: "Service Status 설정",
      consoleSetting: "Meet 서비스 상태",
      fieldMappings: [
        { description: "Meet 서비스 활성화 여부", apiFieldName: "status" }
      ]
    },
    "settings/service_status.tasks": {
      consolePage: "Service Status 설정",
      consoleSetting: "Tasks 서비스 상태",
      fieldMappings: [
        { description: "Tasks 서비스 활성화 여부", apiFieldName: "status" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A10","F100");

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

  serviceStatusSettings.forEach(settingType => {
    const setting = serviceStatusSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('service_status',settingType); // 정책 찾기
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
    }
  });

  if (data.length>0){
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  }

  Logger.log("Service Status policies saved to the Google Sheet.");
}
