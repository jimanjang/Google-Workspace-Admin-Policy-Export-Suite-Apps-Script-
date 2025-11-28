function fetchGroupsForBusinessPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies`;
  const token = ScriptApp.getOAuthToken(); // OAuth2 토큰 가져오기

  const groupsForBusinessSettings = [
    "settings/groups_for_business.groups_sharing",
    "settings/groups_for_business.groups_creation",
    "settings/groups_for_business.external_members",
    "settings/groups_for_business.incoming_mail",
    "settings/groups_for_business.view_topics",
    "settings/groups_for_business.directory_visibility",
    "settings/groups_for_business.new_groups_hidden"
  ];

  const groupsForBusinessSettingsMap = {
    "settings/groups_for_business.groups_sharing": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "그룹 공유 설정",
      fieldMappings: [
        { description: "최고 공유 수준", apiFieldName: "collaborationCapability" }
      ]
    },
    "settings/groups_for_business.groups_creation": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "그룹 생성",
      fieldMappings: [
        { description: "그룹 생성 권한", apiFieldName: "createGroupsAccessLevel" }
      ]
    },
    "settings/groups_for_business.external_members": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "외부 회원",
      fieldMappings: [
        { description: "외부 회원 허용", apiFieldName: "ownersCanAllowExternalMembers" }
      ]
    },
    "settings/groups_for_business.incoming_mail": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "수신 이메일",
      fieldMappings: [
        { description: "외부 이메일 수신 허용", apiFieldName: "ownersCanAllowIncomingMailFromPublic" }
      ]
    },
    "settings/groups_for_business.view_topics": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "주제 보기 권한",
      fieldMappings: [
        { description: "기본 주제 보기 권한", apiFieldName: "viewTopicsDefaultAccessLevel" }
      ]
    },
    "settings/groups_for_business.directory_visibility": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "디렉터리 표시",
      fieldMappings: [
        { description: "그룹 숨기기 허용", apiFieldName: "ownersCanHideGroups" }
      ]
    },
    "settings/groups_for_business.new_groups_hidden": {
      consolePage: "Groups for Business 설정",
      consoleSetting: "새 그룹 숨기기",
      fieldMappings: [
        { description: "새 그룹을 디렉터리에서 숨김", apiFieldName: "newGroupsAreHidden" }
      ]
    }
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A10","F28");

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

  groupsForBusinessSettings.forEach(settingType => {
    const setting = groupsForBusinessSettingsMap[settingType];
    if (setting) {
      const matchingPolicy = findPolicyByType('groups_for_business',settingType); // 정책 찾기
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
  Logger.log("Groups for Business policies saved to the Google Sheet.");
}
