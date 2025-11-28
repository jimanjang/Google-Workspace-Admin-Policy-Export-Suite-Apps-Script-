# Google Workspace Admin Policy Export Suite (Apps Script)

이 프로젝트는 Google Apps Script로 **Google Workspace 관리 콘솔의 주요 정책(Policy)을 Cloud Identity Policies API에서 읽어와 스프레드시트에 정리**하는 도구 모음입니다.
Groups, Drive/Docs, Gmail, Chat, Meet, Sites, Marketplace, Takeout, Security, Service Status 등 **서비스별 정책을 OU 단위로 조회하여 “관리 콘솔 화면에서 보는 설정 ↔ API 필드 ↔ 실제 값”을 한눈에 볼 수 있도록 시트에 출력**합니다.

또한 별도 스크립트로

* Shared Drive 멤버/권한 조회 및 도메인 변경 복제,
* 도메인 공유 연락처(GData m8) 시트 동기화,
* Google Docs용 Gemini 사이드바 글쓰기 보조
  같은 운영 자동화 예제도 포함됩니다.

---

## 1. 구성 모듈

### A. Workspace 정책 Export 모듈(첨부파일)

각 파일은 **특정 서비스 영역의 정책을 조회해서 시트에 기록**합니다.

* **Groups for Business 정책**: `fetchGroupsForBusinessPolicies()` 

  * 그룹 공유/생성/외부멤버/수신메일/토픽보기/디렉터리 표시/새 그룹 숨김 등

* **Google Sites 정책**: `fetchSitesPolicies()` 

  * 사이트 생성/수정 허용, 외부 공유 허용

* **Google Meet 정책**: `fetchMeetPolicies()` 

  * 녹화 허용, 참여 가능 사용자/회의, 호스트 관리, 외부 참여자 경고

* **Drive & Docs 정책**: `fetchDriveAndDocsPolicies()` 

  * 외부 공유 세부옵션, 일반 액세스 기본값, 공유드라이브 생성/권한, 파일 보안 업데이트, Drive SDK, Drive for Desktop

* **Google Chat 정책**: `fetchChatPolicies()` 

  * 채팅 기록/수정가능 여부, 파일 공유, 스페이스 기록, 외부 채팅 허용/제한, Chat 앱/웹훅 허용

* **Gmail 정책**: `fetchGmailPolicies()` 

  * 기밀모드, S/MIME, IP 허용목록, 전송 전 검사, 스푸핑/인증, 링크·외부이미지, 첨부파일 보안, 주소/차단/스팸 override 리스트, 콘텐츠/첨부 규정준수, POP/IMAP, 자동전달, 이름형식, 외부 SMTP, 이미지 프록시, 메일 위임 등 다수

* **Service Status 정책**: `fetchServiceStatusPolicies()` 

  * Gmail/Drive/Calendar/Classroom/Chat/Meet/Tasks 서비스 ON/OFF 상태

* **Marketplace 정책**: `fetchMarketplacePolicies()` 

  * 서드파티 앱/Google 앱 설치 허용 여부

* **User Takeout 정책**: `fetchUserTakeoutPolicies()` 

  * Blogger/Books/Classroom/Contacts/Drive/Gmail/Groups/Keep/Maps/Photos/Youtube Takeout 허용 상태

* **Security 정책**: `fetchSecurityPolicies()` 

  * 최고관리자/사용자 계정복구, 비밀번호 정책, 세션 제어, 보안수준 낮은 앱, 로그인 질문, 고급보호프로그램, 2단계 인증 등록/강제/유예/기기신뢰/허용요소/백업코드 유예 등

> 모든 모듈은 공통적으로 `findPolicyByType(service, settingType)`와
> `clearAllExceptBetweenCells(sheet, start, end)`라는 헬퍼 함수에 의존합니다.
> (헬퍼 코드는 본 README 하단 “공통 의존성” 참고)

---

### B. 운영 자동화 예제(이전 대화 코드)

* **Shared Drive 멤버/권한 목록화 + 새 도메인 기반 복제 이관**

  * `listSharedDrives()`, `createSharedDriveWithNewDomain()`
  * Shared Drive와 Permissions API 기반

* **도메인 공유 연락처(Shared Contacts) 시트 동기화**

  * `getAllSharedContacts()`, `deleteSharedContactsFromSheet()`
  * 레거시 GData m8 XML 기반

* **Google Docs Gemini 사이드바 글쓰기 도우미**

  * Docs 커스텀 메뉴 + Sidebar HTML
  * Vertex AI Gemini REST `streamGenerateContent` 호출

---

## 2. 공통 동작 방식(Policy Export 모듈)

각 서비스 모듈은 동일한 패턴을 가집니다.

1. **조회할 settingType 목록 정의**

   * 예: `settings/chat.chat_history`, `settings/drive_and_docs.external_sharing` 등
2. **settingType → 콘솔 화면/설명/API 필드 매핑 Map 정의**
3. **`findPolicyByType(service, settingType)`로 정책 객체 검색**
4. 정책 객체에서

   * `policy.setting.value[apiFieldName]`
   * `policy.policyQuery.orgUnit`
     를 추출
5. **시트 헤더를 쓰고, 결과를 data 배열로 모아 일괄 setValues()**
6. **특정 영역만 초기화**

   * `clearAllExceptBetweenCells(sheet, "Axx", "Fyy")`

즉, 결과 시트는 항상 아래 컬럼을 가집니다.

| 컬럼           | 의미                             |
| ------------ | ------------------------------ |
| 관리 콘솔의 페이지   | 관리자 콘솔 UI 상위 카테고리              |
| 관리 콘솔의 특정 설정 | 콘솔 UI 세부 설정명                   |
| 관리 콘솔 설명     | 사람이 읽는 설명                      |
| 정책 API 필드 이름 | Cloud Identity Policies API 필드 |
| 값            | 실제 값(JSON 문자열)                 |
| OU           | 설정이 적용된 조직 단위                  |

---

## 3. 설치 / 사전 준비

### 3.1 Apps Script 프로젝트 준비

1. 정책을 기록할 **Google Spreadsheet** 생성
2. **확장 프로그램 → Apps Script** 열기
3. 각 모듈 파일(`groups setting.js`, `drive setting.js`, …)과
   공통 헬퍼 파일을 프로젝트에 추가

### 3.2 OAuth Scope / 고급 서비스

* Policies API 호출을 위해 **외부 요청 권한 + Cloud Identity 권한 필요**
* 스프레드시트 쓰기 권한 필요

권장 scope 예:

```json
"oauthScopes": [
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/cloud-identity.policies"
]
```

> 조직 정책상 최소 권한 원칙에 맞춰 조정하세요.

### 3.3 Google Cloud API 활성화

* **Cloud Identity API / Policies API**가 연결된 GCP 프로젝트에서 활성화되어 있어야 합니다.

---

## 4. 사용 방법

### 4.1 Policy Export 실행

1. 스프레드시트에서 원하는 시트를 활성화
2. Apps Script에서 서비스별 fetch 함수 실행

   * 예:

     * `fetchDriveAndDocsPolicies()`
     * `fetchGmailPolicies()`
     * `fetchSecurityPolicies()`
3. 실행 후 활성 시트에 정책이 정리됨

### 4.2 여러 서비스 연속 수집

* “전체 정책 스냅샷”이 필요하면

  * 여러 fetch 함수를 순차 실행하거나
  * 별도 `runAll()` 같은 래퍼 함수를 만들어 한 번에 호출할 수 있습니다.

---

## 5. 주의사항 / 제한

1. **정책이 없는 경우**

   * `findPolicyByType` 결과가 없으면 `"default"`로 기록하도록 되어 있습니다.
2. **시트 초기화 범위**

   * 각 모듈이 서로 다른 범위만 비우도록 되어 있어,
     **한 시트에 여러 서비스 결과를 분리해 쌓는 구조**입니다.
   * 범위가 겹치면 결과가 덮일 수 있으니 좌표 관리 필요.
3. **중복/오타 가능성**

   * Map의 `apiFieldName`에 공백/탭이 섞인 항목이 일부 보입니다.
     (예: `"customOrgUnit\t"`, `"allowReuse\t"` 등)
     → 실제 API 필드명과 다르면 항상 `"default"`로 찍힙니다.
4. **Gmail Map 키 중복**

   * `gmailSettingsMap`에서 `"settings/gmail.rule_states"`가 2번 정의되어 있습니다.
     JS 객체 특성상 **마지막 정의가 덮어쓰기** 됩니다. 
5. **권한**

   * OU별 정책 조회는 관리자 권한이 충분해야 합니다.
6. **레거시/Deprecated API(운영 예제)**

   * GData m8 Contacts API는 구형이므로 추후 막힐 수 있습니다.
7. **Gemini 모델 ID**

   * 기존 코드의 모델(`gemini-1.0-pro`)은 현재 환경에서 지원 종료 가능성이 있어 교체를 권장합니다.

---

## 6. 공통 의존성(헬퍼)

모듈들이 공통으로 기대하는 함수들:

* `findPolicyByType(serviceName, settingType)`

  * Cloud Identity Policies list 결과 중

    * `policy.setting.type === settingType`
    * `policy.setting.service === serviceName`
      형태를 찾아 반환하는 헬퍼

* `clearAllExceptBetweenCells(sheet, startCell, endCell)`

  * 시트에서 특정 범위만 지우고 나머지는 유지하기 위한 헬퍼
  * 각 서비스 결과를 고정 위치에 유지하는 데 사용

> 이 두 함수가 없으면 모든 fetch 함수가 동작하지 않습니다.
> 현재 프로젝트에 동일 파일로 포함되어 있어야 합니다.

---

## 7. 확장/개선 포인트

* **(필수) API 필드명 정합성 체크**

  * Map에 있는 apiFieldName을 실제 Policies API 스키마와 자동 대조하는 검증 함수 추가
* **전체 스냅샷/버전 관리**

  * 날짜별 시트 복사 또는 BigQuery/Drive JSON 백업
* **OU 필터링 옵션**

  * 특정 OU만 선택적으로 출력
* **consoleSetting/description 다국어 지원**

  * KR/EN 토글 형태
* **정책 변경 감지(diff)**

  * 전 실행 결과와 비교해 변경분 하이라이트

---

## 8. 빠른 실행 목록

| 서비스            | 함수                                  |
| -------------- | ----------------------------------- |
| Groups         | `fetchGroupsForBusinessPolicies()`  |
| Sites          | `fetchSitesPolicies()`              |
| Meet           | `fetchMeetPolicies()`               |
| Drive/Docs     | `fetchDriveAndDocsPolicies()`       |
| Chat           | `fetchChatPolicies()`               |
| Gmail          | `fetchGmailPolicies()`              |
| Service Status | `fetchServiceStatusPolicies()`      |
| Marketplace    | `fetchMarketplacePolicies()`        |
| Takeout        | `fetchUserTakeoutPolicies()`        |
| Security       | `fetchSecurityPolicies()`           |

---

