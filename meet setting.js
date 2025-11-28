function fetchMeetPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const meetSettings = [
    "settings/meet.video_recording",
    "settings/meet.safety_domain",
    "settings/meet.safety_access",
    "settings/meet.safety_host_management",
    "settings/meet.safety_external_participants"
  ];

  const meetSettingsMap = {
    "settings/meet.video_recording": {
      consolePage: "Google Meet 설정",
      consoleSetting: "동영상 녹화",
      fieldMappings: [
        { description: "회의 녹화 허용", apiFieldName: "enableRecording" }
      ]
    },
    "settings/meet.safety_domain": {
      consolePage: "Google Meet 설정",
      consoleSetting: "도메인",
      fieldMappings: [
        { description: "회의 참여 가능 사용자", apiFieldName: "usersAllowedToJoin" }
      ]
    },
    "settings/meet.safety_access": {
      consolePage: "Google Meet 설정",
      consoleSetting: "액세스",
      fieldMappings: [
        { description: "참여 가능한 회의", apiFieldName: "meetingsAllowedToJoin" }
      ]
    },
    "settings/meet.safety_host_management": {
      consolePage: "Google Meet 설정",
      consoleSetting: "호스트 관리",
      fieldMappings: [
        { description: "기본 호스트 관리 허용", apiFieldName: "enableHostManagement" }
      ]
    },
    "settings/meet.safety_external_participants": {
      consolePage: "Google Meet 설정",
      consoleSetting: "외부 참여자",
      fieldMappings: [
        { description: "외부 참여자 경고 활성화", apiFieldName: "enableExternalLabel" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A8","F22");

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

  meetSettings.forEach(settingType => {
    const setting = meetSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('meet',settingType); // 정책 찾기
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

  Logger.log("Google Meet policies saved to the Google Sheet.");
}