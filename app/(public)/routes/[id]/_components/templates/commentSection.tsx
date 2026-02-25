"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import CommentInput from "../ingredients/commentInput";
import CommentItem from "../ingredients/commentItem";

type CommentSectionProps = {
  isMobile: boolean;
};

export default function CommentSection({ isMobile }: CommentSectionProps) {
  // モックコメント
  const mockComments = [
    { user: "TravelEnthusiast", text: "Amazing route! I'll definitely try this next time.", date: "2 days ago" },
    { user: "Wanderer123", text: "The photography spots mentioned are gold. Thanks for sharing!", date: "1 week ago" },
    { user: "CityExplorer", text: "How long does the whole trip take on average?", date: "2 weeks ago" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 w-full"
    >
      {/* コメントセクションのタイトル - モバイルではタブがあるため非表示 */}
      {!isMobile && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-accent-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
              Comments
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground-0">Discussion</h2>
        </div>
      )}

      {/* コメント投稿フォーム */}
      <CommentInput />

      <div className="flex flex-col gap-6">
        {mockComments.map((comment, i) => (
          <CommentItem key={i} comment={comment} />
        ))}
      </div>

      <button className="text-[10px] font-bold text-accent-0 uppercase tracking-[0.3em] hover:opacity-70 transition-opacity w-fit px-2 py-1">
        View all 12 comments →
      </button>
    </motion.div>
  );
}
