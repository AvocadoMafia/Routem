import FollowingsSection from "@/app/[locale]/(public)/_components/(followings)/followingsSection";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="w-full h-full">
      <FollowingsSection />
    </div>
  );
}
