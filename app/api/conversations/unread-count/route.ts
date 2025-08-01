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

    // Get conversations where user is a participant
    const { data: participantData, error: participantError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id)

    if (participantError || !participantData) {
      return NextResponse.json({ count: 0 })
    }

    const conversationIds = participantData.map(p => p.conversation_id)
    
    if (conversationIds.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    // Get user's last_read_at timestamps for each conversation
    const { data: participantsWithRead, error: readError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', user.id)
      .in('conversation_id', conversationIds)

    if (readError) {
      console.error('Error fetching read timestamps:', readError)
      return NextResponse.json({ count: 0 })
    }

    // Count unread messages (messages sent after user's last_read_at)
    let totalUnread = 0

    for (const participant of participantsWithRead || []) {
      const lastReadAt = participant.last_read_at || new Date(0).toISOString() // If never read, use epoch

      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', participant.conversation_id)
        .neq('sender_id', user.id)
        .gt('created_at', lastReadAt)

      if (!countError && count) {
        totalUnread += count
      }
    }

    return NextResponse.json({ count: totalUnread })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json({ count: 0 })
  }
}