function fetchUserTakeoutPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const userTakeoutSettings = [
    "settings/user_takeout.blogger",
    "settings/user_takeout.books",
    "settings/user_takeout.classroom",
    "settings/user_takeout.contacts",
    "settings/user_takeout.drive",
    "settings/user_takeout.gmail",
    "settings/user_takeout.groups",
    "settings/user_takeout.keep",
    "settings/user_takeout.maps",
    "settings/user_takeout.photos",
    "settings/user_takeout.youtube"
  ];

  const userTakeoutSettingsMap = {
    "settings/user_takeout.blogger": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "블로거 데이터 가져오기",
      fieldMappings: [
        { description: "블로거 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.books": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "도서 데이터 가져오기",
      fieldMappings: [
        { description: "도서 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.classroom": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Classroom 데이터 가져오기",
      fieldMappings: [
        { description: "Classroom 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.contacts": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "연락처 데이터 가져오기",
      fieldMappings: [
        { description: "연락처 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.drive": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Drive 데이터 가져오기",
      fieldMappings: [
        { description: "Drive 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.gmail": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Gmail 데이터 가져오기",
      fieldMappings: [
        { description: "Gmail 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.groups": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Groups 데이터 가져오기",
      fieldMappings: [
        { description: "Groups 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.keep": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Keep 데이터 가져오기",
      fieldMappings: [
        { description: "Keep 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.maps": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "지도 데이터 가져오기",
      fieldMappings: [
        { description: "지도 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.photos": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "Google Photos 데이터 가져오기",
      fieldMappings: [
        { description: "Google Photos 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    },
    "settings/user_takeout.youtube": {
      consolePage: "UserTakeout 설정",
      consoleSetting: "YouTube 데이터 가져오기",
      fieldMappings: [
        { description: "YouTube 데이터 가져오기 설정", apiFieldName: "takeoutStatus" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  const activeSheetName = sheet.getName();

  Logger.log('현재 활성 시트: ' + activeSheetName);
  clearAllExceptBetweenCells(sheet, "A14","F30");


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

  let data = []

  userTakeoutSettings.forEach(settingType => {
    const setting = userTakeoutSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('user_takeout',settingType); // 정책 찾기
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

  Logger.log("UserTakeout policies saved to the Google Sheet.");
}


