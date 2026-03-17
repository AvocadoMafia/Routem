'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase/client';

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('招待を確認中...');

  useEffect(() => {
    const acceptInvite = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // 未ログインならログイン画面へ。戻り値を現在のURLに設定
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`);
        return;
      }

      try {
        const res = await fetch(`/api/v1/invites/${token}/accept`, {
          method: 'POST',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || '招待の受諾に失敗しました');
        }

        setStatus('success');
        setMessage('招待を受諾しました。リダイレクト中...');
        
        // Route詳細画面へ遷移
        router.push(`/routes/${data.routeId}`);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'エラーが発生しました');
      }
    };

    if (token) {
      acceptInvite();
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {status === 'loading' && (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-0"></div>
      )}
      <h1 className="text-xl font-bold">{message}</h1>
      {status === 'error' && (
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-accent-0 text-white rounded-md"
        >
          ホームに戻る
        </button>
      )}
    </div>
  );
}
