"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { scrollDirectionAtom } from "@/lib/client/atoms";

export function useInitialModal() {
  const [isVisible, setIsVisible] = useState(true);
  const [canClose, setCanClose] = useState(false);
  const [scrollDirection, setScrollDirection] = useAtom(scrollDirectionAtom);

  useEffect(() => {
    // マウント時にスクロール方向をリセット
    setScrollDirection("up");

    // マウント時に少し待ってからスクロール検知を開始する
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setScrollDirection]);

  useEffect(() => {
    if (canClose && scrollDirection === "down" && isVisible) {
      setIsVisible(false);
    }
  }, [scrollDirection, isVisible, canClose]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  return { isVisible, setIsVisible };
}
