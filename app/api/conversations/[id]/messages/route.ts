import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getSimpleConversationMessages, sendSimpleMessage } from '@/lib/services/conversations-simple'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id: conversationId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Get conversation messages using simplified service
    const messages = await getSimpleConversationMessages(conversationId, user.id, limit)
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' }, 
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id: conversationId } = await params
    const body = await request.json()
    const { content, message_type = 'text' } = body
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' }, 
        { status: 400 }
      )
    }
    
    // Send message using simplified service
    const message = await sendSimpleMessage(user.id, conversationId, content.trim())
    
    if (!message) {
      return NextResponse.json(
        { error: 'Failed to send message' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' }, 
      { status: 500 }
    )
  }
}