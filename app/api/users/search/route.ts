import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Use service role to bypass RLS issues
    const supabase = await createClient(true)
    
    // Get current user from regular client
    const regularSupabase = await createClient()
    const { data: { user }, error: userError } = await regularSupabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' }, 
        { status: 400 }
      )
    }
    
    // Search users using service role (bypasses RLS)
    const { data: users, error: searchError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .neq('id', user.id) // Exclude current user
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10)
    
    if (searchError) {
      console.error('Error searching users:', searchError)
      return NextResponse.json(
        { error: 'Failed to search users' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(users || [])
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Failed to search users' }, 
      { status: 500 }
    )
  }
}