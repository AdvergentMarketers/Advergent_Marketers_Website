'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// UPGRADED: It now creates the account if it's missing!
export async function forceUpdateOrCreatePassword(
  memberId: string,
  email: string,
  newPassword: string,
  existingAuthId?: string
) {
  try {
    if (existingAuthId) {
      // SCENARIO A: They have an Auth ID. Just update the password.
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        existingAuthId,
        { password: newPassword }
      )
      if (error) throw error
      return { success: true, newAuthId: existingAuthId }
    } else {
      // SCENARIO B: No Auth ID! Create the Auth account first.
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: newPassword,
        email_confirm: true // Skips the email verification step
      })
      if (error) throw error

      const newAuthId = data.user.id

      // Link this new secure ID to their existing team_members row
      const { error: dbError } = await supabaseAdmin
        .from('team_members')
        .update({ auth_user_id: newAuthId })
        .eq('id', memberId)

      if (dbError) throw dbError

      return { success: true, newAuthId: newAuthId }
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}