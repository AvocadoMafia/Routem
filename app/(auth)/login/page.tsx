

// TODO(ukyo): デザイン整える
// TODO(ukyo): loginwithgoogleのエラーハンドリング
// TODO(ukyo): ボタンコンポーネント整理
// TODO(Leon): ログイン中にアクセスした場合のリダイレクト
import LoginCard from "@/app/(auth)/login/_components/templates/loginCard";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoginCard />
    </div>
  );
}
