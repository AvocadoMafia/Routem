import RootClient from './rootClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: Props) {
  const { id } = await params

  // サーバーサイドでのデータ取得が必要な場合はここで行う
  // 現状はクライアントサイドでのモック表示が主なので、IDのみをRootClientに渡す

  return <RootClient id={id} />
}
