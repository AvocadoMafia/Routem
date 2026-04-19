/**
 * 日時フォーマット系ユーティリティ
 */

/**
 * 指定したタイムゾーンの標準時で、yyyy/mm/dd 形式にフォーマットします。
 *
 * 例: Asia/Tokyo → 2026/03/24
 */
export function formatDateToYmdInTz(date: Date, timeZone: string = 'Asia/Tokyo'): string {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)

  const dtf = new Intl.DateTimeFormat('ja-JP', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = dtf.formatToParts(d)
  const year = parts.find(p => p.type === 'year')?.value ?? ''
  const month = parts.find(p => p.type === 'month')?.value ?? ''
  const day = parts.find(p => p.type === 'day')?.value ?? ''

  if (!year || !month || !day) return ''
  return `${year}/${month}/${day}`
}
