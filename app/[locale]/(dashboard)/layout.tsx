import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${locale}/login`);
  }

  return <div className={'w-full h-full'}>{children}</div>;
}
