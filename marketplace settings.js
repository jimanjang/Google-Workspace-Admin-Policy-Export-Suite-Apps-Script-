
function fetchMarketplacePolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const marketplaceSettings = [
    "settings/marketplace.third_party_app",
    "settings/marketplace.google_apps"
  ];

  const marketplaceSettingsMap = {
    "settings/marketplace.third_party_app": {
      consolePage: "Marketplace 설정",
      consoleSetting: "서드파티 앱 관리",
      fieldMappings: [
        { description: "서드파티 앱 관리 설정", apiFieldName: "allowThirdPartyApp" }
      ]
    },
    "settings/marketplace.google_apps": {
      consolePage: "Marketplace 설정",
      consoleSetting: "Google Apps 관리",
      fieldMappings: [
        { description: "Google Apps 관리 설정", apiFieldName: "allowGoogleApp" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A5","F13");

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

  marketplaceSettings.forEach(settingType => {
    const setting = marketplaceSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('marketplace',settingType); // 정책 찾기
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
  Logger.log("Marketplace policies saved to the Google Sheet.");
}

