

// TODO(ukyo): デザイン整える
// TODO(ukyo): loginwithgoogleのエラーハンドリング
// TODO(ukyo): ボタンコンポーネント整理
// TODO(Leon): ログイン中にアクセスした場合のリダイレクト
import RootClient from "@/app/[locale]/(auth)/login/_components/rootClient";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background-0 overflow-hidden">
      <RootClient />
    </div>
  );
}
