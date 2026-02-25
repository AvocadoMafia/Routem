import {createClient} from "@/lib/auth/supabase/server"
import { NextRequest } from "next/server"

export async function validateUser(request: NextRequest) {
  const supabase = await createClient(request)
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw error
  }
  return data.user
}