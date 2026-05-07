import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, companyName, contactEmail, password, accountBalance, nextInvoiceDate } = body;

    // 1. Initialize the Master Admin Client (Bypasses all security rules)
    // We do NOT use the standard createServer or createBrowserClient here
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Silently create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: contactEmail,
      password: password,
      email_confirm: true, // Auto-confirm them so they can log in instantly
      user_metadata: { full_name: clientName }
    });

    if (authError) throw authError;

    // 3. Insert their ecosystem data into the CRM database
    const { error: dbError } = await supabaseAdmin.from('clients').insert([{
      auth_user_id: authData.user.id,
      client_name: clientName,
      company_name: companyName,
      contact_email: contactEmail,
      account_balance: parseFloat(accountBalance) || 0,
      next_invoice_date: nextInvoiceDate || null,
      active_projects: [
        { name: "Strategy & Onboarding", status: "Active", progress: "10%" }
      ],
      deliverables: []
    }]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: 'Client deployed securely.' });

  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to create client." }, { status: 400 });
  }
}