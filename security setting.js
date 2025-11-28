function fetchSecurityPolicies() {
  const apiUrl = `https://cloudidentity.googleapis.com/v1beta1/policies:list`;
  const token = ScriptApp.getOAuthToken();

  const securitySettings = [
    // "settings/drive_and_docs.external_sharing",
    // "settings/drive_and_docs.general_access_default"
    "settings/security.super_admin_account_recovery",
    "settings/security.user_account_recovery",
    "settings/security.password",
    "settings/security.session_controls",
    "settings/security.less_secure_apps",
    "settings/security.login_challenges",
    "settings/security.advanced_protection_program",
    "settings/security.two_step_verification_enrollment",
    "settings/security.two_step_verification_enforcement",
    "settings/security.two_step_verification_grace_period",
    "settings/security.two_step_verification_device_trust",
    "settings/security.two_step_verification_enforcement_factor",
    "settings/security.two_step_verification_sign_in_code"
  ];

  const securitySettingsMap = {
    "settings/security.super_admin_account_recovery": {
      consolePage: "계정 복구",
      consoleSetting: "최고관리자계정복구",
      fieldMappings: [
        { description: "최고 관리자가 자신의 계정을 직접 복구할 수 있도록 허용", apiFieldName: "enableAccountRecovery" }
      ]
    },
    "settings/security.user_account_recovery": {
      consolePage: "계정 복구",
      consoleSetting: "사용자 계정 복구",
      fieldMappings: [
        { description: "사용자와 최고 관리자가 아닌 관리자가 계정을 직접 복구할 수 있도록 허용", apiFieldName: "enableAccountRecovery" }
      ]
    },
    "settings/security.password": {
      consolePage: "비밀번호 관리",
      consoleSetting: "비밀번호 관리",
      fieldMappings: [
        { description: "만료", apiFieldName: "expirationDuration" },
        { description: "재사용", apiFieldName: "allowReuse	" },
        { description: "비밀번호 안전성 및 길이 정책 시행", apiFieldName: "enforceRequirementsAtLogin	" },
        { description: "길이(최대길이)", apiFieldName: "maximumLength" },
        { description: "길이(최소길이)", apiFieldName: "minimumLength" },
        { description: "강도", apiFieldName: "allowedStrength" }
      ]
    },
    "settings/security.session_controls": {
      consolePage: "Google 세션 제어",
      consoleSetting: "세션 제어",
      fieldMappings: [
        { description: "웹 세션 시간", apiFieldName: "webSessionDuration" }
      ]
    },
    "settings/security.less_secure_apps": {
      consolePage: "보안 수준이 낮은 앱",
      consoleSetting: "보안 수준이 낮은 앱",
      fieldMappings: [
        { description: "보안 수준이 낮은 기술을 사용하여 계정을 취약하게 만드는 앱에 대한 사용자 액세스를 관리", apiFieldName: "allowLessSecureApps" }
      ]
    },
    "settings/security.login_challenges": {
      consolePage: "본인 확인 요청",
      consoleSetting: "로그인 질문",
      fieldMappings: [
        { description: "직원 ID를 사용하여 사용자 보안 강화", apiFieldName: "enableEmployeeIdChallenge" }
      ]
    },
    "settings/security.advanced_protection_program": {
      consolePage: "고급 보호 프로그램",
      consoleSetting: "등록",
      fieldMappings: [
        { description: "직원 ID를 사용하여 사용자 보안 강화", apiFieldName: "enableAdvancedProtectionSelfEnrollment" },
        { description: "보안 코드", apiFieldName: "securityCodeOption" }
      ]
    },
    "settings/security.two_step_verification_enrollment": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "사용자가 2단계 인증을 사용하도록 허용하기", apiFieldName: "allowEnrollment" }
      ]
    },
    "settings/security.two_step_verification_enforcement": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "적용", apiFieldName: "enforcedFrom" }
      ]
    },
    "settings/security.two_step_verification_grace_period": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "신규 사용자 등록 기간", apiFieldName: "enrollmentGracePeriod" }
      ]
    },
    "settings/security.two_step_verification_device_trust": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "사용자가 기기를 신뢰하도록 허용", apiFieldName: "allowTrustingDevice" }
      ]
    },
    "settings/security.two_step_verification_enforcement_factor": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "메서드", apiFieldName: "allowedSignInFactorSet" }
      ]
    },
    "settings/security.two_step_verification_sign_in_code": {
      consolePage: "2단계 인증",
      consoleSetting: "인증",
      fieldMappings: [
        { description: "2단계 인증 정책 보류 유예 기간", apiFieldName: "backupCodeExceptionPeriod" }
      ]
    }

  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //sheet.clear();
  clearAllExceptBetweenCells(sheet, "A24","F66");
  // sheet.appendRow(["관리 콘솔의 페이지", "관리 콘솔의 특정 설정", "관리 콘솔 설명", "정책 API 필드 이름", "값"]);
  const headers = [
    "관리 콘솔의 페이지", 
    "관리 콘솔의 특정 설정", 
    "관리 콘솔 설명", 
    "정책 API 필드 이름", 
    "값",
    "OU"
  ]
  sheet.getRange(1,1,1, headers.length).setValues([headers]);

  let data = [];

  securitySettings.forEach(settingType => {
    const setting = securitySettingsMap[settingType];
//     if (!setting) return;

//     try {
//       const response = UrlFetchApp.fetch(apiUrl, {
//         method: 'post',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         payload: JSON.stringify({
//           parent: "customers/my_customer",
//           filter: `policy.setting.type="${settingType}"`
//         }),
//         muteHttpExceptions: true
//       });

//       const responseBody = JSON.parse(response.getContentText());
//       const policies = responseBody.policies || [];

//       if (policies.length === 0) {
//         Logger.log(`No policies found for setting type: ${settingType}`);
//         //const row = 
//         data.push([setting.consolePage, setting.consoleSetting, "정책 없음", "default", "default"]);
//         //sheet.appendRow(row);
//       } else {
//         policies.forEach(policy => {
//           setting.fieldMappings.forEach(mapping => {
//             const value = policy.setting?.value?.[mapping.apiFieldName] || "default";
//             //const row = 
//             data.push([
//               setting.consolePage,
//               setting.consoleSetting,
//               mapping.description,
//               mapping.apiFieldName,
//               JSON.stringify(value)
//             ]);
//             //sheet.appendRow(row);
//           });
//         });
//       }
//       if (data.length>0){
//         sheet.getRange(2,1,data.length,data[0].length).setValues(data);
//       }
//     } catch (error) {
//       Logger.log(`Error fetching policies for ${settingType}: ${error.message}`);
//     }
//   });

//   Logger.log("Security 정책 저장 완료.");
// }
    if (setting) {
      const matchingPolicy = findPolicyByType('security',settingType); // 정책 찾기
      const orgUnit = matchingPolicy?.policyQuery?.orgUnit || "기존 값 없음";

      setting.fieldMappings.forEach(mapping => {
        const value = matchingPolicy?.setting?.value?.[mapping.apiFieldName] ?? "default";
        // Logger.log("matchingPolicy: %s", JSON.stringify(matchingPolicy, null, 2));

        // if (!matchingPolicy) {
        //   Logger.log("❌ matchingPolicy is undefined or null");
        // } else {
        //   Logger.log("✅ matchingPolicy is defined");

        //   if (!matchingPolicy.setting) {
        //     Logger.log("❌ matchingPolicy.setting is missing");
        //   } else {
        //     Logger.log("✅ setting: %s", JSON.stringify(matchingPolicy.setting, null, 2));

        //     if (!matchingPolicy.setting.value) {
        //       Logger.log("❌ setting.value is missing");
        //     } else {
        //       Logger.log("✅ value: %s", JSON.stringify(matchingPolicy.setting.value, null, 2));

        //       const fieldName = mapping.apiFieldName;
        //       const fieldValue = matchingPolicy.setting.value[fieldName];

        //       if (fieldValue === undefined) {
        //         Logger.log(`❌ value["${fieldName}"] is undefined (fallback to "default")`);
        //       } else {
        //         Logger.log(`✅ value["${fieldName}"]: ${fieldValue}`);
        //       }
        //     }
        //   }
        // }

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
    Logger.log("data length: "+ data.length);
    Logger.log("data printed:"+ data[0][4]);
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  }

  Logger.log("Security policies saved to the Google Sheet.");
}




