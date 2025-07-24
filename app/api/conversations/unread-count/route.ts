import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  // Conversations system temporarily disabled to prevent infinite loops
  return NextResponse.json({ count: 0 })
}