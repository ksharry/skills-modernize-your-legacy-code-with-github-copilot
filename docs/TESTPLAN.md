# TEST PLAN — Student Accounts (COBOL app)

此測試計畫以表格形式列出可與業務利害關係人一起驗證的測試案例，對應目前 COBOL 應用的商業邏輯（查詢、入帳、扣款、帳戶管理與驗證、交易記錄等）。

說明：欄位包含 Test Case ID、說明、前置條件、測試步驟、預期結果、實際結果、狀態（Pass/Fail）與備註。請在執行測試時填寫「實際結果」與「狀態」。

> 使用說明：此 TESTPLAN 會在後續轉換為 Node.js 的單元/整合測試時，作為每個測試案例的來源（輸入、期望輸出與驗證條件）。

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View balance — existing ACTIVE account | Account A exists, state = ACTIVE, balance = 100.00 | 1) 啟動程式 2) 選 1 (View Balance) 3) 輸入 Account A id | 顯示 Account A 的目前餘額 100.00 並顯示狀態 ACTIVE |  |  | 檢查顯示格式與欄位名稱 |
| TC-02 | View balance — non-existent account | Account X 不存在 | 1) 選 1 (View Balance) 2) 輸入 Account X id | 顯示明確錯誤訊息（例如 "ACCOUNT NOT FOUND"）或錯誤碼 |  |  | 確認錯誤碼與訊息一致 |
| TC-03 | Credit account — valid amount | Account B exists, state = ACTIVE, balance = 50.00 | 1) 選 2 (Credit) 2) 輸入 Account B id 3) 輸入金額 25.00 | 成功回應；Account B 新餘額 75.00；交易日誌記錄一筆 credit |  |  | 檢查日誌包含時間戳、帳號、金額、類型 |
| TC-04 | Credit account — invalid (negative) amount | Account B exists, state = ACTIVE | 1) 選 2 (Credit) 2) 輸入 Account B id 3) 輸入金額 -10.00 | 拒絕輸入並顯示驗證錯誤（例如 "INVALID AMOUNT"）；不更動餘額 |  |  | 驗證輸入檢查與錯誤碼 |
| TC-05 | Debit account — sufficient funds | Account C exists, state = ACTIVE, balance = 200.00 | 1) 選 3 (Debit) 2) 輸入 Account C id 3) 輸入金額 150.00 | 成功回應；Account C 新餘額 50.00；交易日誌記錄一筆 debit |  |  | 若有手續費也應反應在餘額上 |
| TC-06 | Debit account — insufficient funds | Account D exists, state = ACTIVE, balance = 20.00 | 1) 選 3 (Debit) 2) 輸入 Account D id 3) 輸入金額 50.00 | 拒絕交易；回傳錯誤碼（e.g. INSUFFICIENT-FUNDS）；餘額保持 20.00；日誌記錄失敗原因 |  |  | 若系統允許透支或收取費用請另列變種測試 |
| TC-07 | Debit account — account INACTIVE or CLOSED | Account E exists, state = INACTIVE | 1) 選 3 (Debit) 2) 輸入 Account E id 3) 輸入金額 10.00 | 拒絕交易；顯示錯誤（e.g. ACCOUNT-INACTIVE）；餘額不變 |  |  | 確認狀態檢查優先於金額檢查 |
| TC-08 | Create account — new unique account | Account F 不存在 | 1) 執行建立帳戶流程（若 UI/程式提供）2) 輸入必要欄位（id, name, initial balance） | 成功回傳；新帳戶建立，狀態預設為 ACTIVE（或系統要求）；在資料檔可查得該帳戶 |  |  | 如果程式沒有建立 UI，請以直接檔案/資料段建立並驗證 |
| TC-09 | Create account — duplicate account id | Account G exists with id=G123 | 1) 嘗試建立相同 id=G123 | 拒絕建立；回傳 DUPLICATE-ACCOUNT 或相等錯誤碼；原帳號資料不被覆寫 |  |  | 檢查錯誤碼與日誌 |
| TC-10 | Close account — valid close | Account H exists, state = ACTIVE, balance = 0.00 | 1) 執行關閉帳號 2) 輸入 H id | 帳戶狀態變為 CLOSED 或 INACTIVE；後續提款/入帳受限 |  |  | 若帳戶有餘額應先拒絕或要求轉移 |
| TC-11 | Validate input formats — account id format | N/A | 1) 在任何需要輸入帳號處輸入非法格式（例如過長、包含字元） | 顯示格式驗證錯誤，拒絕處理 |  |  | 列出允許的 account-id pattern 供開發與業務確認 |
| TC-12 | Transaction logging — success & failure | 任意成功/失敗交易 | 1) 執行一筆成功交易 2) 執行一筆失敗交易 | 成功交易日誌包含 timestamp、account-id、amount、type、result=SUCCESS；失敗交易日誌記錄原因與錯誤碼 |  |  | 指定日誌檔路徑與格式以利自動化檢查 |
| TC-13 | Concurrency / atomicity (if applicable) | Account I exists, balance = 1000.00 | 1) 模擬兩個同時對 I 扣款 2) 驗證最終餘額是否一致且無資料競爭 | 更新應為原子；兩筆合法交易均應被正確應用或其中一筆失敗，且無資料不一致 |  |  | 若系統為單執行緒批次，記錄為 N/A 或註明無適用性 |
| TC-14 | Minimum balance enforcement | Account J exists, min-balance rule = 10.00, balance = 20.00 | 1) 嘗試扣款使餘額降至 5.00 | 拒絕交易；顯示违反最低餘額規則或收取手續費並更新餘額（依系統定義） |  |  | 業務需確認最低餘額政策細節 |
| TC-15 | Business day / EOD processing (if applicable) | 系統支援 EOD 批次 | 1) 執行日終批次 2) 檢查利息計算、批次日誌、檔案壓縮/備份 | 批次完成，利息/報表正確產生；交易日誌歸檔 |  |  | 若 COBOL 程式無此批次，請標註為 N/A |

---

如何使用此 TESTPLAN

- 與業務利害關係人一起逐行確認「Test Case Description」與「Expected Result」，以確保系統行為符合政策與法規。
- 在執行每個案例時填寫「Actual Result」與「Status」。若發現偏差，請在「Comments」欄紀錄重現步驟、範例輸入與相關日誌截圖。
- 轉換到 Node.js 測試時，將每一列(Test Case)轉為：
  - 單元測試（unit test）：針對小函式（例如 validateAmount、applyDebit）驗證輸入/輸出。
  - 整合測試（integration）：啟動整個應用或其 API，模擬用戶輸入或 HTTP 請求，驗證資料檔或 mock DB 的變更與日誌。

若你同意這個測試計畫，我可以：
- 把檔案 commit 並推到 `modernize-legacy-code` 分支；或
- 根據 `src/cobol/*.cob` 的實際段落與錯誤碼，把 Expected Result 補到更精確的錯誤訊息與範例輸入中（我可以讀取並擷取段落名稱與錯誤碼後更新測試表）。

