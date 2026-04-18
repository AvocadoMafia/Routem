# Bug#3 E2E 検証シナリオ (share / like / comment)

Tester_1 / Tester_2 がリリース前の実機確認で使うシナリオ集。

対象ブランチ: `77-デプロイ準備`
関連 Bug: **Bug#3** — 記事表示ページの share / like / comment 通信失敗
関連ファイル:
- `lib/client/hooks/useShare.ts` / `useLike.ts` / `useComments.ts`
- `lib/client/stores/toastStore.ts`
- `app/[locale]/(public)/routes/[id]/_components/ingredients/shareButton.tsx` / `likeButton.tsx` / `commentInput.tsx` / `commentItem.tsx`
- `app/[locale]/(public)/routes/[id]/_components/templates/commentSection.tsx`
- `app/[locale]/_components/common/ingredients/loginPromptCard.tsx`
- `lib/server/handleError.ts` (認証エラー → 401 マッピング)

---

## 0. 共通前提

### 0-1. テスト環境

| 環境 | URL | Secure Context | navigator.share | navigator.clipboard | Secure Cookie |
|---|---|---|---|---|---|
| **dev** | `http://localhost:3000` | ✅ (localhost は例外) | ✅ OS 対応あり | ✅ | false |
| **prod-http** (現行) | `http://routem.net` | ❌ | ❌ undefined | ❌ undefined | false |
| **prod-https** (SSL 導入後) | `https://routem.net` | ✅ | ✅ | ✅ | true |

### 0-2. 前提アカウント

| アカウント | 用途 |
|---|---|
| user-A (自分の投稿あり) | コメント削除の所有者ケース |
| user-B (他人の投稿なし) | 他人コメント閲覧/削除試行ケース |
| guest (未ログイン) | ログイン誘導トースト / LoginPromptCard |

### 0-3. ブラウザ準備

- Chrome latest (desktop)
- Safari on iOS (latest) / Chrome on Android (latest) — Web Share API の実機確認に必須
- DevTools Console と Network を常時開く
- 失敗時は Preserve log を ON にして再現手順と一緒にスクショ / HAR を残す

### 0-4. 事前セットアップ

1. 検証用ルート記事を 1 本作成 (user-A で作成、 PUBLIC 公開)
2. そのルートに既存コメントを少なくとも 2 件仕込む (user-A 1件 / user-B 1件)
3. URL を共有用にメモ: `http://routem.net/{locale}/routes/{id}`

---

## 1. Share ボタン

### 対象 UI
- 記事ページの `ShareButton` (variant=`compact` と `large` 両方)
- large: 「このルートを共有」ボタン (いいねボタンの隣、 "enjoyRoute" セクション)
- compact: ヘッダー近くの小さい share アイコン

### 1-1. HTTPS 環境で Web Share API が立ち上がる (iOS Safari / Android Chrome)

**目的**: Secure Context + `navigator.share` が存在する環境でネイティブ共有シートが開くこと

**手順**:
1. `prod-https` or iOS/Android 実機で記事ページを開く
2. large の Share ボタンをタップ
3. OS のネイティブ共有シート (AirDrop / メッセージ / メモ 等) が起動する

**期待**:
- ✅ 共有シートが開く
- ✅ 共有を確定 (メモに貼り付け等) するとトースト不要 (ネイティブが処理)
- ✅ ユーザーがキャンセルした場合もエラートーストは出ない (AbortError 扱い)
- ✅ 何度押しても同じ挙動

### 1-2. HTTPS / デスクトップ (navigator.share 非対応ブラウザ) で clipboard フォールバック

**目的**: デスクトップ Chrome / Firefox は `navigator.share` が無い。 Secure Context なので clipboard API にフォールバックして URL がコピーされる

**手順**:
1. `prod-https` を Chrome (desktop) で開く
2. Share ボタンを押す
3. 別のアプリ (メモ帳 / Slack) に Cmd+V で貼り付け

**期待**:
- ✅ `Link copied to clipboard` の success トースト (accent-0 ボーダー) が右下に出現
- ✅ ボタンアイコンがチェック ✔ に切り替わる (数秒)
- ✅ 貼り付けると記事の URL が入っている (`.../routes/<id>`)
- ✅ トーストは success tone の 2.6 秒程度で自動消去

### 1-3. HTTP 本番 (現行) で execCommand レガシーフォールバック

**目的**: HTTP では Secure Context ではないため `navigator.share` も `navigator.clipboard` も undefined。隠し textarea + `document.execCommand('copy')` に落ち、それでもコピー成功

**手順**:
1. `prod-http` (`http://routem.net`) を Chrome (desktop) で開く
2. Share ボタンを押す
3. 別アプリに Cmd+V で貼り付け

**期待**:
- ✅ 旧実装では console.error のみで無反応だったが、今回は `Link copied to clipboard` トーストが出る
- ✅ 貼り付けると URL が入っている
- ✅ 画面に一瞬 textarea が可視化されない (fixed top-0/opacity-0/width-1px で隠している)

**失敗時のログ**:
Console に `Failed to copy!` が出たら、さらに prompt() フォールバックに落ちるので、画面中央にダイアログが開く。そのケースは 1-4 を参照。

### 1-4. execCommand も禁止されている場合に prompt() で URL 表示

**目的**: 企業 PC 等で clipboard も execCommand も権限制限されている状況の最終フォールバック。ユーザーに URL を見せて手動コピーさせる

**再現方法**:
- DevTools → Console で `document.execCommand = () => false` を注入してから Share を押す

**期待**:
- ✅ ブラウザ標準の `prompt()` ダイアログが出て入力欄に URL が表示される
- ✅ prompt を閉じると info トースト (`Copy this link manually`) + URL 本文が表示される (durationMs 8秒)
- ✅ ユーザーは prompt 内で手動選択してコピーできる
- ✅ ボタンアイコンが ✔ に切り替わる

### 1-5. 全手段が使えないブラウザ (極端ケース)

**目的**: 全フォールバック失敗時に「無反応」にならないこと

**再現方法** (Console で):
```js
Object.defineProperty(navigator, 'share', { value: undefined });
Object.defineProperty(navigator, 'clipboard', { value: undefined });
document.execCommand = () => false;
window.prompt = () => { throw new Error('blocked'); };
```

**期待**:
- ✅ 最後に warning トースト (`Couldn't copy the link`) が赤系のボーダーで表示される
- ✅ console.error だけで無反応、になっていないこと

### 1-6. 連打しても壊れない

**手順**: Share ボタンを 10 連打

**期待**:
- ✅ isSharing true 中はボタンが disabled + opacity-60
- ✅ トーストが最大 10 個積み上がる (bottom-20 からスタックして上に)
- ✅ 最初のトーストが 2.6 秒後にちゃんと消える (他のトースト追加で消去タイマーがリセットされない — W1 regression)

---

## 2. Like ボタン

### 対象 UI
- `LikeButton` variant=`compact` (routeHeader 内、件数表示)
- `LikeButton` variant=`large` (detailsViewer 最下部、"enjoyRoute" セクション)
- `CommentItem` 内のコメント用 Like (useLike で同じロジック)

### 2-1. 未ログインでクリック → ログイン誘導

**手順**:
1. guest (未ログイン) で記事ページを開く
2. large Like ボタンを押す

**期待**:
- ✅ UI は反転しない (count も増えない、楽観 UI を発動させない)
- ✅ warning トースト `Sign in to like this route` (accent-warning ボーダー)
- ✅ トーストに `Sign in →` アクションボタンがある
- ✅ アクションボタン押下で `/login` に遷移、トーストは自動 dismiss

### 2-2. ログイン済みで like → unlike の往復

**手順**:
1. user-A でログイン、未 like のルート記事ページを開く
2. large Like ボタンを押す (count = N → N+1 に即座に反映)
3. もう一度押す (count = N+1 → N に戻る)
4. ページリロードして count 表示が整合していることを確認

**期待**:
- ✅ 押下直後に count が +1 / -1 即反映 (楽観 UI)
- ✅ ハートアイコンが fill-accent-0 に変わる / 戻る
- ✅ ボタンに `aria-pressed=true/false` が反映される
- ✅ pending 中は Loader2 が回転 (ハートの代わり)
- ✅ API レスポンス到着後に like_count が真値に確定 (既存 count とズレていれば修正される)
- ✅ DevTools Network で POST /api/v1/likes が 200 OK + `{ liked, like_count }` を返す

### 2-3. 連打時の二重発火防止

**手順**: ボタンを 5 連打 (100ms 以内)

**期待**:
- ✅ POST /api/v1/likes が 1 リクエストだけ飛ぶ (pending 中は toggle() が early return)
- ✅ UI が 1 段階だけ変わる (count が一発で +1)
- ✅ ダブルクリックで「+1 → 0 → +1 → 0」のチラつきが起きない

### 2-4. 401 時のロールバック + ログイン誘導

**再現方法**:
- user-A でログイン → DevTools → Application → Cookies で `sb-*-auth-token` を削除 → Like を押す (セッション失効をシミュレート)

**期待**:
- ✅ 押下直後は楽観 UI で反転
- ✅ API 401 を受けて isLiked / count が元状態にロールバック
- ✅ warning トースト `Sign in to like this route` + `Sign in →` アクション
- ✅ errorStore にエラーが積まれない (401 は toast のみ、ErrorViewer と重複させない)

### 2-5. サーバーエラー (500) 時のロールバック + errorStore 表示

**再現方法**:
- DevTools Network → POST /api/v1/likes を "Block request URL" で 500 にする
- Like を押す

**期待**:
- ✅ 楽観 UI 反転 → 失敗で元に戻る
- ✅ ErrorViewer (右下) に "Failed to like" 系のエラーカード
- ✅ warning トースト `Failed to like` も併せて表示される

### 2-6. compact variant (header) も自分の like 状態を反映

**目的**: W3 修正の確認。過去は header の compact LikeButton が initialIsLiked を受け取っていなかった

**手順**:
1. user-A で既に like 済みのルート記事を開く
2. 画面上部の header 内 compact LikeButton の見た目を確認

**期待**:
- ✅ ハートが fill-accent-0 (いいね済み) になっている
- ✅ aria-pressed=true
- ✅ 押下で unlike → count -1 + フィルム解除

### 2-7. コメント like も同じ堅牢化

**手順**: 記事ページ下部の CommentItem の ❤️ アイコンを押す
- 未ログイン → 2-1 と同じトースト
- ログイン → 2-2 と同じ即反映
- 連打ガード → 2-3 と同じ

**期待**: route like と完全に同じ挙動 (useLike hook 共通化のため)

---

## 3. Comment

### 対象 UI
- `CommentSection` (記事ページ下部)
- `CommentInput` (入力フォーム)
- `CommentItem` (個々のコメント)
- `LoginPromptCard` (未ログイン時の差し替え)

### 3-1. 未ログイン時: CommentInput が LoginPromptCard に差し替わる

**手順**: guest で記事ページを開き、コメント欄までスクロール

**期待**:
- ✅ テキストエリアは表示されない
- ✅ 代わりに `Sign in to post a comment` と `Sign in` ボタンを持つ LoginPromptCard
- ✅ 既存コメントの一覧は読める (GET /api/v1/comments は認証不要)
- ✅ ボタンを押すと `/login` に遷移

### 3-2. ログイン済み: コメント投稿の楽観 UI

**手順**:
1. user-A でログイン
2. CommentInput に `テストコメント` と入力
3. `Post Comment` ボタンを押す (または Enter 単押しで送信)

**期待**:
- ✅ 入力欄が即座にクリアされる (success 扱い)
- ✅ コメント一覧の先頭に自分のコメント dummy が opacity-70 で即時挿入
- ✅ Network で POST /api/v1/comments が 201 Created
- ✅ レスポンス到着後、dummy が実データに置き換わる (opacity 100)
- ✅ 投稿ユーザー名とアイコンが user-A のもので表示

### 3-3. Enter / Shift+Enter の挙動

**期待**:
- ✅ Enter 単押し → 送信
- ✅ Shift+Enter → 改行 (送信されない)
- ✅ 日本語 IME 変換確定の Enter では送信されない (isComposing ガード)
- ✅ 送信中 Enter 押しても二重送信されない (submitting true で disabled)

### 3-4. 空白 / 上限

**期待**:
- ✅ 空文字 / 半角スペースのみ / 全角スペースのみ → 送信されない ( button disabled)
- ✅ 1000 文字入力すると maxLength で止まる
- ✅ 500 文字を超えたあたりから `500/1000` カウンタが表示される
- ✅ 850 文字を超えると カウンタが accent-warning 色になる

### 3-5. 投稿失敗時のロールバック

**再現方法**:
- DevTools Network → POST /api/v1/comments を "Block request URL" で失敗させる

**期待**:
- ✅ dummy は一度先頭挿入される
- ✅ API 失敗を検知して dummy が削除される
- ✅ ErrorViewer (右下) にエラーカード
- ✅ warning トースト `Failed to post comment`
- ✅ 入力欄のテキストは保持される (ユーザーがやり直せるよう)

### 3-6. 401 時のログイン誘導

**再現方法**: ログイン済み → Cookie 削除 → コメント送信

**期待**:
- ✅ dummy 挿入 → 401 で取り除かれる
- ✅ warning トースト `Sign in to post a comment` + `Sign in →` アクション
- ✅ ErrorViewer は重複表示しない

### 3-7. 自分のコメント削除 (confirm 2ステップ)

**手順**:
1. user-A でログイン、 user-A の既存コメントにマウスホバー
2. 現れる `HiTrash` アイコンを押す (1 回目)
3. ボタンに `Confirm` テキストが追加され、色が accent-warning になる
4. そのまま 3 秒以内に再度押す

**期待**:
- ✅ ホバー時のみ削除ボタンが opacity-100 (group-hover)
- ✅ 1 回目押下でボタンが確認モード (accent-warning/15 背景 + ring) に変わる
- ✅ 3 秒放置で確認モードが自動解除 → 誤爆防止
- ✅ 2 回目押下で DELETE /api/v1/comments 200 + コメントが消える
- ✅ 削除成功後はトーストを出さず、要素が AnimatePresence で淡く消える
- ✅ Network で DELETE リクエストのペイロードが `{ "id": "<comment-id>" }`

### 3-8. 他人のコメント削除試行 (UI 非表示 + サーバー側でも403)

**手順**:
1. user-A でログイン、 user-B のコメントにマウスホバー

**期待**:
- ✅ 削除ボタンが UI 上に表示されない (canDelete が false)
- ✅ DevTools から DELETE を直接叩いた場合でも commentsService.deleteComment が "Forbidden" or "Unauthorized" を投げ、 handleError.ts で 403 → warning 扱い
- ✅ UI では通常エラー表示

### 3-9. 楽観挿入中のコメントは操作不可

**手順**: Network を Slow 3G にして投稿 → dummy が数秒残る間に like ボタンを押す

**期待**:
- ✅ dummy の like ボタンは disabled
- ✅ dummy の id は `optimistic-*` prefix
- ✅ 実データに置換されたら like 可能になる

### 3-10. コメントのタイムスタンプが locale 対応

**期待**:
- ✅ 1 分未満は `たった今` (ja) / `just now` (en) / `방금` (ko) / `刚刚` (zh)
- ✅ 5 分前は `5分前` / `5 minutes ago` 系
- ✅ 2 時間前、3 日前もそれぞれ locale 表記
- ✅ 7 日以上前は絶対日付 (`2024年4月10日` / `Apr 10, 2024`)
- ✅ `<span title="...">` で ISO timestamp がツールチップとして出る (hover 確認)

### 3-11. コメントの無限スクロール

**手順**:
1. 15 件以上コメントが仕込まれたルートを開く
2. コメント一覧を下まで読む

**期待**:
- ✅ 15 件表示後、 skeleton 1 行が observer target
- ✅ skeleton 到達で GET /api/v1/comments?cursor=... が飛ぶ
- ✅ 重複 ID は表示されない (mergeComments)
- ✅ 最後まで到達すると skeleton が消え "End of discussion" 表記

---

## 4. トースト / エラーカードの視覚 QA

| 項目 | 期待 |
|---|---|
| 並び | ErrorViewer: bottom-4 右下、 ToastViewer: bottom-20 右下 |
| 重なり | どちらも z-[999]、同時表示可能 |
| レスポンシブ | max-w-sm + max-w-[calc(100vw-2rem)] で画面幅に収まる |
| ダークモード | tone 別ボーダー色が theme CSS variable 経由で追従 |
| キーボード | Tab で Dismiss (×) ボタンにフォーカス、Enter/Space で閉じる |
| aria | `aria-live="polite"` + `aria-atomic="true"` で読み上げる |
| 自動消去 | success 2.6s / info 4s / warning 6s / durationMs=0 で永続 |

---

## 5. 主要 regression チェック

| 古いバグ | チェック |
|---|---|
| W1: トーストが他トースト追加で永遠に消えない | 1-6 と 3-5 / 3-6 を連続でやり、複数トースト中でも全て自動 dismiss |
| W2: 本番で 401 が 500 に塗りつぶされる | 2-4 / 3-6 で trueの 401 レスポンスがクライアントで auth error と解釈される |
| W3: header の compact LikeButton に initialIsLiked が渡らない | 2-6 |
| 旧 share の無反応 | 1-3 / 1-5 で必ず可視フィードバックが出る |
| comment 投稿失敗が黙って ErrorStore に流れるだけ | 3-5 で warning トーストも併せて出る |

---

## 6. 報告テンプレート

PASS:
```
[PASS Bug#3 / <sec>-<id>] <ブラウザ情報> 期待通り。
```

FAIL:
```
[FAIL Bug#3 / <sec>-<id>] <ブラウザ情報>
期待: <...>
実際: <...>
再現手順: <...>
Console: <stack or log>
Network: <status, payload>
スクショ / HAR: <link>
```
