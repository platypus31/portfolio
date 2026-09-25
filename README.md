# 作品集網站

純靜態網站（HTML／CSS／JS，不需要安裝任何軟體、不需要寫程式），黑白極簡風格，六個頁面：首頁 + About／Design／Presentation／DM·Promote／Trend Analysis。

線上範例：<https://portfolio-showcase-f04.pages.dev>

這份 README 是給不會寫程式的人看的操作說明書——照著做就能把網站變成你自己的版本，並且之後自己更新內容。

---

## 一、第一次使用：讓網站變成你自己的

### 1. Fork 這個 repo

1. 打開這個 repo 的網頁（GitHub 上）。
2. 右上角點 **Fork**。
3. 確認 Owner 是你自己的帳號，Repository name 可以保留 `portfolio` 或改成你喜歡的名字，按 **Create fork**。
4. 完成後你會有一份完全獨立的副本，之後改什麼都不會影響原本的網站。

### 2. 用 GitHub Pages 讓你的版本上線（不用裝任何軟體）

1. 進入你 fork 出來的 repo → 上方選單點 **Settings**。
2. 左側選單找 **Pages**。
3. 「Build and deployment」→ Source 選 **Deploy from a branch**。
4. Branch 選 **main**，資料夾選 **/ (root)**，按 **Save**。
5. 等 1–2 分鐘，重新整理這個 Pages 設定頁，上面會出現一個網址，格式是：
   ```
   https://<你的帳號>.github.io/portfolio/
   ```
   （`<你的帳號>` 換成你的 GitHub 帳號名稱，`portfolio` 換成你 repo 的實際名稱）
6. 打開這個網址，就是你自己的作品集網站了。這個網站全部用相對路徑寫成，放在子路徑（`/portfolio/`）底下一樣能正常顯示圖片和簡報，不需要額外設定。

之後每次你在 GitHub 網頁上存檔（見下方「日常編輯」），GitHub Pages 會自動在 1–2 分鐘內重新部署，你只要重新整理網頁就看得到最新版本。

---

## 二、日常編輯（全部用 GitHub 網頁介面就能做）

編輯方式都一樣：在 GitHub 網頁上找到檔案 → 點右上角的鉛筆圖示（Edit this file）→ 改內容 → 拉到最下面按 **Commit changes**。不需要下載任何東西、不需要懂程式。

### 1. 改名字與自我介紹

以下檔案裡搜尋 `[你的名字]`（用瀏覽器的「Ctrl+F / Cmd+F」在 GitHub 編輯頁裡找），把它換成你的真名或藝名：

- `index.html`：第 6 行（分頁標題）、第 14 行（左上角品牌名）、第 39 行（首頁大標題）、第 78 行（頁尾）
- `about.html`、`design.html`、`presentation.html`、`dm.html`、`trend.html`：每個檔案都有 2–3 處同樣的 `[你的名字]`（分頁標題、左上角品牌名、頁尾）
- `slides.html`：第 6 行

首頁的一句自我介紹在 `index.html` 第 43 行左右，搜尋 `[一句自我介紹]` 換成你想放的標語（例如「鞋款與服飾設計」）。

### 2. 填寫 About 頁的履歷

打開 `about.html`，裡面每個 `[待填]` 對應一個履歷欄位（姓名／學歷／經歷／技能／得獎紀錄／語言能力），直接把 `[待填]` 換成你的內容即可，保留前後的 HTML 標籤不要動。大頭貼目前是文字佔位符 `[大頭貼待補]`（第 36 行），要放照片的話：先把照片檔案上傳到 `images/` 資料夾（GitHub 網頁上該資料夾內 **Add file → Upload files** 即可），再把 `<div class="avatar-placeholder">[大頭貼待補]</div>` 換成 `<img src="images/你的照片檔名.jpg" alt="大頭貼">`。

### 3. 改聯絡方式（LinkedIn／Behance／Instagram／Email）

每個頁面的頁尾、以及 About 頁，都有幾顆聯絡按鈕，目前是空的佔位符：

```html
<a class="contact-btn" href="#" data-todo target="_blank" rel="noopener">LinkedIn</a>
```

改法：
- 把 `href="#"` 換成你的真實網址，例如 `href="https://www.linkedin.com/in/你的帳號"`
- 把該行最後的 `data-todo` 整個字串刪掉（這個標記是用來提醒「還沒填」，填完就要拿掉）

Email 按鈕比較特別，目前是 `href="mailto:" data-todo` 且預設隱藏（`.contact-email` 這個 class 會把它藏起來，避免顯示空按鈕）。要開啟：
1. 把 `href="mailto:"` 改成 `href="mailto:你的信箱@example.com"`
2. 刪掉 `data-todo`
3. 打開 `css/style.css`，搜尋 `.contact-email`，把裡面讓它隱藏的那條規則（通常是 `display: none;`）刪掉或註解掉

### 4. 改作品標題／說明文字

所有作品的標題資料都集中在 **`js/data.js` 一個檔案**，格式像這樣（一份 JSON 清單）：

```json
{"title": "GTX MATRYX", "full": "design/full/000.jpg", "thumb": "design/thumb/000.jpg", "orig": "GTX MATRYX---05.jpg"}
```

欄位意義：
- `title`：顯示在網站上的作品標題，**這個可以直接改**
- `full`：大圖的檔案路徑（相對於 `images/` 資料夾），不要亂改，除非你知道自己在改什麼
- `thumb`：縮圖路徑，同上
- `orig`：原始檔名紀錄，僅供對照，網站不會顯示，可以不管

要改某張圖的標題，直接在 `js/data.js` 裡找到那張圖對應的 `"title": "..."` 那段文字換掉即可，其他欄位不要動。

### 5. 新增／替換作品圖片

1. **準備圖片**：兩個尺寸都要準備——
   - `full`（內文大圖）：長邊 ≤ 2000px
   - `thumb`（縮圖）：長邊約 600px
   - 兩者都建議壓縮到 1MB 以內（見下方「圖片壓縮建議」）
2. **命名**：跟著同分類資料夾裡既有的編號規則命名，例如 `design` 資料夾目前有 `000.jpg`～`013.jpg`，新圖就接著取 `014.jpg`
3. **上傳位置**：分類資料夾是 `images/<分類>/full/` 和 `images/<分類>/thumb/`（分類例如 `design`、`dm`、`storyboard-men` 等），GitHub 網頁上進入該資料夾 → **Add file → Upload files** 把兩個尺寸的圖都傳上去
4. **登記進 `js/data.js`**：在對應分類的清單裡，照著同樣格式新增一段：
   ```json
   {"title": "新作品名稱", "full": "design/full/014.jpg", "thumb": "design/thumb/014.jpg", "orig": "新作品名稱.jpg"}
   ```
   記得前後用逗號跟其他項目隔開（JSON 格式對逗號很敏感，改完可以整段貼到 [jsonlint.com](https://jsonlint.com) 檢查有沒有漏打逗號或括號）。

要**替換**現有圖片：直接上傳同檔名的新圖覆蓋掉舊圖即可，不用動 `data.js`。

### 6. 新增簡報投影片

`presentation.html` 頁面的每份簡報都是一組逐頁圖片（`.webp` 格式），放在 `slides/<簡報名稱>/` 資料夾裡，檔名是 `01.webp`、`02.webp`……依序編號。

**把 PDF／PowerPoint／Keynote 轉成逐頁圖片**：
- Keynote：檔案 → 輸出 → 圖像，選擇要輸出全部投影片，格式選 PNG 或 JPEG
- PowerPoint：檔案 → 匯出 → 變更檔案類型 → PNG，會匯出每一頁一張圖
- 也可以用線上工具（例如把 PDF 拖進 [pdf2image](https://www.pdf2png.com) 之類的網站）把 PDF 逐頁轉成圖片
- 轉出來的圖建議用 [squoosh.app](https://squoosh.app) 轉成 `.webp` 格式壓縮（設定同下方壓縮建議）

**上傳與命名**：新增一個資料夾 `slides/<你取的簡報名稱>/`，把轉好的圖依序命名為 `01.webp`、`02.webp`……上傳進去，另外準備一張縮圖放在 `slides/<簡報名稱>/thumb/`（沿用同一套縮圖尺寸建議）。

**在 Presentation 頁加一個按鈕**：打開 `presentation.html`，參考現有其中一段（例如 quickfit 那段）：

```html
<p class="section-desc">簡報說明文字，共 <strong>22</strong> 張。
  <a class="contact-btn contact-btn-primary" href="slides.html?deck=quickfit">▶ 播放簡報</a>
</p>
```

複製一段，把 `deck=quickfit` 換成你的資料夾名稱（例如 `deck=你的簡報名稱`），張數與說明文字改成你自己的。這樣就會多一顆「▶ 播放簡報」按鈕，點下去會用內建的投影片播放器（`slides.html`）逐頁播放。

如果你有 PDF 原檔想提供下載，把 PDF 放進 `files/slides/` 資料夾，再加一顆下載連結：
```html
<a class="contact-btn" href="files/slides/你的檔名.pdf" target="_blank" rel="noopener">下載 PDF</a>
```

### 7. 圖片壓縮建議

大圖片會讓網站載入變慢，建議上傳前先壓縮：

- 網站：[squoosh.app](https://squoosh.app)（免安裝，直接在瀏覽器拖圖進去調整品質、下載）
- 目標：單檔盡量壓在 **1MB 以下**，長邊照上面「五、新增圖片」的尺寸建議裁切
- 格式：`.jpg`（相片類）或 `.webp`（想要更小的檔案時）都可以，跟現有圖片格式一致即可

---

## 三、常見問題

**改了東西，但網站上沒變？**
GitHub Pages 部署需要 1–2 分鐘，而且瀏覽器可能會快取舊版本。先等個 2 分鐘，再用「強制重新整理」（Windows/Linux：Ctrl+Shift+R；Mac：Cmd+Shift+R）看看。如果還是沒變，回到 repo 的 **Actions** 分頁看最新一次部署有沒有顯示綠色勾勾（成功）。

**圖片顯示不出來（破圖）？**
最常見原因是檔名對不上。檢查：
- `js/data.js` 裡寫的路徑，跟你實際上傳的檔名是否完全一致（大小寫也要一致，GitHub 對大小寫是敏感的）
- 副檔名是否一致（`.jpg` 跟 `.jpeg` 不是同一個檔名）
- 圖片是不是真的上傳到正確的資料夾

**想恢復到之前的版本？**
GitHub 每次 Commit 都會留下完整歷史紀錄。進 repo 上方的 **History**（或某個檔案頁面右上角的時鐘圖示），可以看到每一次修改，點進舊版本可以直接還原（Revert）或複製舊內容貼回來。

**JSON 格式改壞了，網站整個空白？**
`js/data.js` 是 JSON 格式，對逗號、引號、括號很敏感。改完之後，把整段內容貼到 [jsonlint.com](https://jsonlint.com) 檢查，或直接跟前一版比對哪裡漏打了逗號。也可以用「History」功能回到改壞之前的版本重來。

---

## 四、檔案結構一覽

```
index.html              首頁：大標 + 五個分類入口
about.html               About：大頭貼 + 履歷
design.html               Design：作品圖片
presentation.html         Presentation：簡報連結（PDF 下載 + 網頁播放）
dm.html                   DM / Promote：作品圖片
trend.html                 Trend Analysis：趨勢分析圖片
slides.html                 投影片播放器（presentation.html 的按鈕連過來）

css/
  style.css               全站樣式（黑白配色、Oswald 字型）
  slides.css               投影片播放器樣式

js/
  data.js                  所有作品的標題與圖片路徑（改標題／加圖片主要改這裡）
  main.js                  導覽選單、Lightbox 燈箱、輪播等互動邏輯
  slides-player.js          投影片播放器邏輯

images/<分類>/
  full/                    內文大圖
  thumb/                   縮圖

slides/<簡報名稱>/
  01.webp, 02.webp, …       投影片逐頁圖
  thumb/                    投影片縮圖

files/slides/
  *.pdf                    簡報 PDF 原檔（供下載）
```

---

## 五、其他技術細節（想深入了解再看）

- 零 build step，純手刻 HTML/CSS/JS，不需要 Node.js、npm 或任何安裝步驟。
- 六個頁面共用同一份 `css/style.css` 與 `js/main.js`；頂部導覽列在目前所在頁面會用粗體 + `—` 標示。
- 想在自己電腦上先預覽再上傳，可以用終端機執行：
  ```bash
  cd 你的 repo 資料夾
  python3 -m http.server 8000
  ```
  然後瀏覽器開 <http://localhost:8000>（需要電腦已安裝 Python 3；不想用終端機的話，直接雙擊 `index.html` 用瀏覽器打開通常也看得到，但部分瀏覽器對本機開檔會擋掉圖片載入，仍建議用上面的方式預覽）。
