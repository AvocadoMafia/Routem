// components/google-login-button.tsx
"use client"; // ★ここはクライアントコンポーネントにする

import { loginWithGoogle } from "@/lib/auth/login/google"; 

export default function GoogleLoginButton() {
  return (
    <button 
      onClick={() => loginWithGoogle()}
      className="bg-white border p-2 rounded"
    >
      Googleでログイン
    </button>
  );
}