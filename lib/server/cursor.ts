/**
 * カーソルベースページネーションのユーティリティ
 *
 * createdAt + id の複合カーソルを使用し、安定したページネーションを実現
 */

/**
 * カーソル形式: "createdAt_id" (ISO文字列_UUID)
 * scoreカーソル形式: "score_id" (数値_UUID)
 */

export type CursorData = {
  createdAt: Date
  id: string
}

export type ScoreCursorData = {
  score: number
  id: string
}

/**
 * createdAt + id からカーソル文字列を生成
 */
export function encodeCursor(data: CursorData): string {
  return `${data.createdAt.toISOString()}_${data.id}`
}

/**
 * カーソル文字列をデコード
 */
export function decodeCursor(cursor: string): CursorData | null {
  const idx = cursor.lastIndexOf('_')
  if (idx === -1) return null

  const dateStr = cursor.slice(0, idx)
  const id = cursor.slice(idx + 1)

  const createdAt = new Date(dateStr)
  if (isNaN(createdAt.getTime())) return null

  return { createdAt, id }
}

/**
 * score + id からスコアカーソル文字列を生成
 */
export function encodeScoreCursor(data: ScoreCursorData): string {
  return `${data.score}_${data.id}`
}

/**
 * スコアカーソル文字列をデコード
 */
export function decodeScoreCursor(cursor: string): ScoreCursorData | null {
  const idx = cursor.lastIndexOf('_')
  if (idx === -1) return null

  const scoreStr = cursor.slice(0, idx)
  const id = cursor.slice(idx + 1)

  const score = parseFloat(scoreStr)
  if (isNaN(score)) return null

  return { score, id }
}

/**
 * Prisma用のカーソルwhere条件を生成（降順: createdAt DESC, id DESC）
 * 「指定カーソルより古い」レコードを取得
 */
export function buildCursorWhere(cursor: string | undefined | null): object | undefined {
  if (!cursor) return undefined

  const decoded = decodeCursor(cursor)
  if (!decoded) return undefined

  // (createdAt < cursor.createdAt) OR (createdAt = cursor.createdAt AND id < cursor.id)
  return {
    OR: [
      { createdAt: { lt: decoded.createdAt } },
      {
        AND: [
          { createdAt: decoded.createdAt },
          { id: { lt: decoded.id } }
        ]
      }
    ]
  }
}

/**
 * updatedAt + id のカーソル条件（views用）
 */
export type UpdatedAtCursorData = {
  updatedAt: Date
  id: string
}

export function encodeUpdatedAtCursor(data: UpdatedAtCursorData): string {
  return `${data.updatedAt.toISOString()}_${data.id}`
}

export function decodeUpdatedAtCursor(cursor: string): UpdatedAtCursorData | null {
  const idx = cursor.lastIndexOf('_')
  if (idx === -1) return null

  const dateStr = cursor.slice(0, idx)
  const id = cursor.slice(idx + 1)

  const updatedAt = new Date(dateStr)
  if (isNaN(updatedAt.getTime())) return null

  return { updatedAt, id }
}

export function buildUpdatedAtCursorWhere(cursor: string | undefined | null): object | undefined {
  if (!cursor) return undefined

  const decoded = decodeUpdatedAtCursor(cursor)
  if (!decoded) return undefined

  return {
    OR: [
      { updatedAt: { lt: decoded.updatedAt } },
      {
        AND: [
          { updatedAt: decoded.updatedAt },
          { id: { lt: decoded.id } }
        ]
      }
    ]
  }
}

/**
 * 配列の最後の要素からnextCursorを生成
 */
export function getNextCursor<T extends { createdAt: Date; id: string }>(
  items: T[],
  limit: number
): string | null {
  if (items.length < limit) return null
  const last = items[items.length - 1]
  return encodeCursor({ createdAt: last.createdAt, id: last.id })
}

export function getNextUpdatedAtCursor<T extends { updatedAt: Date; id: string }>(
  items: T[],
  limit: number
): string | null {
  if (items.length < limit) return null
  const last = items[items.length - 1]
  return encodeUpdatedAtCursor({ updatedAt: last.updatedAt, id: last.id })
}

/**
 * スコアベースのカーソル（Redis recommendation/trending用）
 * {id, score}[] 配列からカーソル位置以降の要素を取得
 */
export function sliceByScoreCursor(
  items: { id: string; score: number }[],
  cursor: string | undefined | null,
  limit: number
): { items: { id: string; score: number }[]; nextCursor: string | null } {
  let startIndex = 0

  if (cursor) {
    const decoded = decodeScoreCursor(cursor)
    if (decoded) {
      // カーソル位置を探す
      const idx = items.findIndex(
        item => item.score < decoded.score ||
          (item.score === decoded.score && item.id <= decoded.id)
      )
      if (idx !== -1) {
        startIndex = idx
      }
    }
  }

  const sliced = items.slice(startIndex, startIndex + limit)

  let nextCursor: string | null = null
  if (startIndex + limit < items.length && sliced.length > 0) {
    const last = sliced[sliced.length - 1]
    nextCursor = encodeScoreCursor({ score: last.score, id: last.id })
  }

  return { items: sliced, nextCursor }
}
