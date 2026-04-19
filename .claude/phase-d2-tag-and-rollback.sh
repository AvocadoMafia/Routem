#!/usr/bin/env bash
# Phase D2 開始時のタグ打刻 / 緊急ロールバック用ヘルパ
#
# 使い方:
#   ./.claude/phase-d2-tag-and-rollback.sh tag         # 開始時: pre-d2-<timestamp> タグを打つ
#   ./.claude/phase-d2-tag-and-rollback.sh status      # 現在のタグ一覧 + HEAD を表示
#   ./.claude/phase-d2-tag-and-rollback.sh rollback    # 最新の pre-d2-* タグに git reset --hard
#
# 設計方針:
#   - destructive な操作 (reset --hard) は必ず rollback サブコマンド経由でのみ実行
#   - タグ名は pre-d2-YYYYMMDD-HHMM 形式。複数回打ってもユニーク
#   - tag サブコマンドは既存同名タグを上書きしない (同一分の衝突を防ぐ)
#   - rollback は直前の作業内容を stash に退避してから実行 (誤爆時の救済経路)

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

SUBCOMMAND="${1:-help}"

require_clean_tree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "⚠️  作業ツリーに未コミットの変更があります:" >&2
    git status --short >&2
    return 1
  fi
}

case "$SUBCOMMAND" in
  tag)
    # 開始時タグ: 未コミット変更が無い状態で打つ方が安全
    if ! require_clean_tree; then
      echo "→ 未コミット変更がある状態でタグを打ちます（ロールバックすると失われます）。続行しますか？ [y/N]"
      read -r answer
      [[ "$answer" == "y" || "$answer" == "Y" ]] || exit 1
    fi
    TAG="pre-d2-$(date +%Y%m%d-%H%M)"
    if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
      echo "❌ タグ $TAG はすでに存在します。1分待ってから再実行するか、既存タグを使用してください。" >&2
      exit 1
    fi
    git tag "$TAG"
    echo "✅ タグ作成: $TAG → $(git rev-parse --short HEAD) ($(git log -1 --pretty=%s))"
    ;;

  status)
    echo "=== HEAD ==="
    git log -1 --oneline
    echo ""
    echo "=== pre-d2-* タグ一覧 (新しい順) ==="
    git for-each-ref --sort=-creatordate --format='%(refname:short)  %(creatordate:iso-local)  %(subject)' 'refs/tags/pre-d2-*' || echo "(なし)"
    ;;

  rollback)
    # 最新の pre-d2-* タグを自動選択してロールバック
    LATEST_TAG=$(git for-each-ref --sort=-creatordate --format='%(refname:short)' 'refs/tags/pre-d2-*' | head -1 || true)
    if [[ -z "$LATEST_TAG" ]]; then
      echo "❌ pre-d2-* タグが存在しません。ロールバック先がありません。" >&2
      exit 1
    fi

    echo "ロールバック先: $LATEST_TAG ($(git log -1 --pretty=%s "$LATEST_TAG"))"
    echo "現在の HEAD:  $(git log -1 --oneline)"
    echo ""
    echo "git reset --hard $LATEST_TAG を実行します。未コミット変更は自動で stash に退避します。"
    echo "続行しますか？ [y/N]"
    read -r answer
    [[ "$answer" == "y" || "$answer" == "Y" ]] || { echo "中止しました。"; exit 0; }

    if [[ -n "$(git status --porcelain)" ]]; then
      STASH_MSG="phase-d2-rollback-$(date +%Y%m%d-%H%M%S)"
      git stash push -u -m "$STASH_MSG"
      echo "→ 作業内容を stash 退避: $STASH_MSG  ( git stash list で確認可)"
    fi

    git reset --hard "$LATEST_TAG"
    echo "✅ ロールバック完了: $(git log -1 --oneline)"
    ;;

  help|*)
    grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//'
    ;;
esac
