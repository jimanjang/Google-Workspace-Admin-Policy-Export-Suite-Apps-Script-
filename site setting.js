function fetchSitesPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const sitesSettings = [
    "settings/sites.sites_creation_and_modification",
    "settings/sites.external_sharing"
  ];

  const sitesSettingsMap = {
    "settings/sites.sites_creation_and_modification": {
      consolePage: "Google Sites 설정",
      consoleSetting: "사이트 생성 및 수정",
      fieldMappings: [
        { description: "사이트 생성 허용", apiFieldName: "allowSitesCreation" },
        { description: "사이트 수정 허용", apiFieldName: "allowSitesModification" }
      ]
    },
    "settings/sites.external_sharing": {
      consolePage: "Google Sites 설정",
      consoleSetting: "외부 공유",
      fieldMappings: [
        { description: "외부 공유 허용", apiFieldName: "allowExternalSharing" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A6","F15");
  

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

  sitesSettings.forEach(settingType => {
    const setting = sitesSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('sites',settingType); // 정책 찾기
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


  Logger.log("Google Sites policies saved to the Google Sheet.");
}
