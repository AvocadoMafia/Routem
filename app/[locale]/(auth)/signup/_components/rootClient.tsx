"use client";

import { motion } from "framer-motion";
import SignupBackground from "./ingredients/signupBackground";
import SignupForm from "./templates/signupForm";

export default function RootClient() {
  return (
      <div
          className="w-full h-full flex flex-col md:flex-row rounded-2xl items-center justify-center text-foreground-0 relative"
      >
          {/*背景画像*/}
          <SignupBackground />

        {/* 左側：フォーム */}
        <SignupForm />
      </div>
  );
}
