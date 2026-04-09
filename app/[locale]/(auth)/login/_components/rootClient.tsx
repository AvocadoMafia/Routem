"use client";

import { motion } from "framer-motion";
import LoginBackground from "./ingredients/loginBackground";
import LoginForm from "./templates/loginForm";

export default function RootClient() {
  return (
      <div
          className="w-full h-full flex flex-col md:flex-row rounded-2xl items-center justify-center text-foreground-0 relative"
      >
          {/*背景画像*/}
          <LoginBackground />

        {/* 右側：フォーム */}
        <LoginForm />
      </div>
  );
}
