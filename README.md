# 作品集網站（本機預覽版）

純靜態多頁 HTML/CSS/少量 JS，零 build step，可直接用瀏覽器開，也可部署。黑白極簡風格，六個頁面：首頁（Home）+ About / Design / Presentation / DM · Promote / Trend Analysis 五個分類，各自獨立 `.html`，共用同一份 CSS/JS。

素材為設計者本人的商業作品，其中 Presentation 與 Trend Analysis 內含公司內部訓練與未公開提案，**屬商業機密等級**，上線前務必先完成保密與存取控管確認（見下方清單）。

## 目錄結構

```
index.html            首頁：hero 大標 + 五個分類入口
about.html            About：大頭貼 + 履歷（皆為佔位符）
design.html           Design：鞋款與草圖
presentation.html     Presentation：內部教育訓練 / 週會分享簡報
dm.html               DM / Promote：參展 DM 素材
trend.html            Trend Analysis：storyboard + FW27/28 提案（獨立分頁，含保密警示）
css/style.css          樣式（黑白配色 + 窄體大寫標題字型 Oswald，深色為主視覺）
js/data.js             作品清單資料（路徑、標題），由圖片處理腳本自動產生
js/main.js             極簡邏輯：頂部導覽 MENU 開關 + Tab 切換 + Lightbox 左右切換（含手機滑動/鍵盤）+ 縮圖淡入
images/                 所有已縮圖的作品圖片
  <分類>/full/           內文大圖，長邊 ≤2000px，jpeg 品質約 80
  <分類>/thumb/          縮圖，長邊約 600px
```

六個頁面都有共用的頂部導覽（Home / About / Design / Presentation / DM·Promote / Trend Analysis），目前所在頁面會用粗體 + `—` 標示。導覽同時是「回首頁」與「切到其他分類」的入口，不需要另外的返回鍵。

## 本機預覽

```bash
cd ~/Desktop/terry-portfolio
python3 -m http.server 8000
```

瀏覽器開 <http://localhost:8000>。

（直接雙擊 `index.html` 用 `file://` 開也能看，但部分瀏覽器對 `file://` 下的 `<script src>` 較嚴格，建議用上面的 http server。）

## 部署規劃（尚未執行 — 本次只做到本機）

這個網站目前**只在本機**，未建任何遠端 repo、未 push、未部署。正式上線規劃：

1. **GitHub private repo** 存放原始碼（由驗收方在確認內容後另外建立，本次不建、不 push）。
2. **Cloudflare Pages**（`wrangler pages deploy .`）部署 —— 零 build step，Pages 直接吃這個資料夾。
3. **先在 Cloudflare Zero Trust 設定 Access 規則**（鎖定存取名單／email 驗證）**再部署**，避免網站一上線就是公開狀態。部署後務必用鎖定帳號實測一次，確認 Access 真的擋住了未授權訪問。
4. **只推 `main` 分支，絕對不要推 `pre-redact` 分支或其任何 commit** —— `pre-redact` 保留的是打碼前的原始 commit 歷史（含未打碼原圖），一旦 push 出去等於公開了打碼前的內容，即使之後在 `main` 補打碼也沒用（git 歷史可回溯）。`main` 目前是打碼後乾淨的單一 commit，可安全 push。

**不採用 GitHub Pages**：GitHub Pages 在免費方案只能從 public repo 發布，而這個 repo 規劃是 private（內容涉及商業機密），所以不適用。

## 上線前必查清單

- [ ] 填上真實姓名 / 自我介紹 / email（頂部與 footer 的 `[你的名字]` `[一句自我介紹]` `[email]` 佔位符）
- [ ] **About 頁**：大頭貼與履歷全部是佔位符（`[大頭貼待補]` / 各欄位 `[待填]`），需本人提供真實內容，本次未編造任何履歷內容
- [x] **敏感資訊打碼已完成**（2026-09-25）：公司自有品牌「Tech it easy!」/公司 logo/內部 SKU 表格/設計師姓名、真實客戶或精品品牌吊牌（NOX、CANALI、Burberry、Prada、Philippe Model、GGDB）、DM 邀請函上的公司全名/電話/傳真/email/官網/QR code 皆已用實色黑塊打碼（不可逆）。打碼前原圖備份於 `~/Desktop/terry-portfolio-originals/`（repo 外），完整判斷原則與逐項清單見該資料夾內 `REDACTION-LOG.md`。市場研究投影片中出現的第三方公開品牌（OOFOS/HOKA/adidas/BOA 等競品分析引用）判斷為公開資訊不遮，理由同見該檔案。
- [ ] **`trend.html` 的「FW27/28 提案（未公開）」分頁** — 內容為「PHILIPPE MODEL FW27 28 PRODUCT & DESIGN PROPOSAL」，疑似未發表季度提案，商業機密等級，客戶品牌名/logo 已打碼，但**仍需先確認有無保密約定**才能公開整個分頁。要移除的話：刪掉 `trend.html` 裡 `#panel-fw2728` 那個 `<div>` 區塊 + `js/data.js` 裡的 `presentation-fw2728` 欄位 + `images/presentation-fw2728/` 資料夾即可，彼此獨立不影響其他頁面
- [ ] **Presentation 區四份簡報**（Bio Bonding / Repairability / Recovery / 快速穿脫）為公司內部教育訓練與週會分享素材，公開前建議先確認是否涉及公司內部機密（自有品牌字樣已打碼）
- [ ] DM 區部分原始檔名含廠商料號（例如 `0171J03006-Passo.jpg`），網站顯示的標題已清理過（去掉料號），但原始檔名仍保留在 `images/dm/` 路徑與 `js/data.js` 的 `orig` 欄位裡，若介意可自行改檔名
- [ ] **聯絡方式改為連結按鈕**（About 頁 + 全站頁尾）：LinkedIn / Behance / Instagram / Email 四顆按鈕，目前皆為 `href="#"` + `data-todo` 佔位，Email 按鈕先隱藏（`.contact-email` class），之後有真實網址/信箱時直接改 `href`（Email 改 `mailto:`）並拿掉 `data-todo`、拿掉 `.contact-email` 隱藏規則即可上線
- [ ] 確認 GitHub repo 建成 **private**、Cloudflare Access 鎖定生效，才把網址分享出去

## 圖片來源與處理方式說明

- **Design / DM / Storyboard**：原始 jpg 直接用 macOS `sips` 縮圖（長邊 ≤2000px 內文圖 + ≤600px 縮圖，jpeg 品質約 80）。
- **Presentation - Recovery**（PDF）：本機有 `poppler`（`pdftoppm`），用它把 PDF 逐頁渲染成圖片，是**真實的完整頁面畫面**。
- **Presentation 其餘三份 + Trend Analysis 的 FW27/28**（皆為 `.pptx`）：本機**沒有安裝 PowerPoint 或 LibreOffice（`soffice`）**，無法逐頁渲染簡報畫面。改用 `unzip` 直接抽取 pptx 內嵌的 `ppt/media/` 圖片檔，過濾掉 15KB 以下的小圖示/logo 後收錄。**這些圖片不是簡報的逐頁截圖，只是簡報裡用到的素材圖片**，排序依檔案內部編號、可能包含重複的背景圖或跨頁重複素材。若之後要看真正的逐頁簡報畫面，需要在有 PowerPoint 或 LibreOffice 的機器上重新輸出。

## repo 大小

未壓縮的 git 工作目錄約 136MB（全部圖片皆已用 `sips` 縮圖後的大小），在需求的 150MB 門檻內。

## 已知限制

- 4 份 pptx 簡報（含 FW27/28）只有內嵌素材圖，非逐頁畫面（見上方說明）。
- About 頁沒有真實大頭貼與履歷內容，全部是佔位符，需要設計者本人補齊。
- 未接任何 build 工具，純手刻 HTML/CSS/JS，方便日後直接改。
- 網站目前是本機預覽狀態，未建 GitHub repo、未 push、未部署到任何地方。
