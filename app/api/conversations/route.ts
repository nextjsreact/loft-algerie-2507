import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getSimpleUserConversations, createSimpleConversation } from '@/lib/services/conversations-simple'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user conversations using simplified service
    const conversations = await getSimpleUserConversations(user.id)
    
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, type, participant_ids } = body
    
    if (!type || !participant_ids || !Array.isArray(participant_ids)) {
      return NextResponse.json(
        { error: 'Invalid conversation data' }, 
        { status: 400 }
      )
    }
    
    // Create conversation using simplified service
    const conversation = await createSimpleConversation(
      user.id,
      participant_ids,
      name,
      type
    )
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' }, 
      { status: 500 }
    )
  }
}