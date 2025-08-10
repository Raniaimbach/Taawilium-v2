import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 🔍 ابحثي عن المستخدم باستخدام Admin API
  const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  const user = users.users.find(u => u.email === email);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  // 🛠️ حدّثي كلمة السر
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Password updated successfully' });
}