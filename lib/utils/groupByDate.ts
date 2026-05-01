import { formatDateToYmdInTz } from './datetime'

export type DateGroupEntry<T> = [date: string, items: T[]]

/**
 * 与えられたアイテムを日付フィールド（createdAtなど）でグルーピングする
 * @param items アイテムの配列
 * @param dateField 日付フィールドのキー
 * @returns [日付, アイテムの配列] の組み合わせを順序保持して返す
 */
export function groupItemsByDate<T extends Record<string, any>>(
  items: T[] | undefined | null,
  dateField: keyof T = 'createdAt' as keyof T
): DateGroupEntry<T>[] {
  if (!items) return []

  const map = new Map<string, T[]>()
  items.forEach(item => {
    const key = formatDateToYmdInTz(new Date(item[dateField] as any))
    const arr = map.get(key) ?? []
    arr.push(item)
    map.set(key, arr)
  })

  return Array.from(map.entries())
}
