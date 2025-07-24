'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ConversationHeader } from '@/components/conversations/conversation-header'
import { MessagesList } from '@/components/conversations/messages-list'
import { MessageInputRealtime } from '@/components/conversations/message-input-realtime'
import { Conversation, Message } from '@/lib/services/conversations'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'

interface ConversationPageClientProps {
  initialConversation: Conversation
  initialMessages: Message[]
  currentUserId: string
}

export function ConversationPageClient({
  initialConversation,
  initialMessages,
  currentUserId
}: ConversationPageClientProps) {
  const [conversation, setConversation] = useState(initialConversation)
  const [messages, setMessages] = useState(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const supabase = createClient()
  const router = useRouter()

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev
      }
      return [...prev, newMessage]
    })
  }, [])

  const handleSendMessage = async (content: string) => {
    try {
      const response = await fetch('/api/conversations/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          content,
          message_type: 'text'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const newMessage = await response.json()
      addMessage(newMessage)
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
      throw error
    }
  }

  // Set up real-time subscription for new messages in this conversation
  useEffect(() => {
    const messagesSubscription = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          const newMessage = payload.new as any
          
          // Fetch full message data with sender info
          const { data, error } = await supabase
            .from('messages')
            .select(`
              id,
              conversation_id,
              sender_id,
              content,
              message_type,
              created_at,
              updated_at,
              edited,
              sender:profiles (
                id,
                full_name,
                email,
                avatar_url
              )
            `)
            .eq('id', newMessage.id)
            .single()

          if (data && !error) {
            addMessage(data as Message)
            
            // Show notification for messages from others
            if (data.sender_id !== currentUserId) {
              const senderName = data.sender?.full_name || 'Someone'
              toast.success(t('notifications.newMessageFrom').replace('{name}', senderName), {
                description: data.content.length > 50 
                  ? data.content.substring(0, 50) + '...' 
                  : data.content
              })
            }
          }
        }
      )
      .subscribe()

    // Mark conversation as read when user opens it
    const markAsRead = async () => {
      try {
        await fetch('/api/conversations/mark-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversation_id: conversation.id
          })
        })
      } catch (error) {
        console.error('Failed to mark conversation as read:', error)
      }
    }

    markAsRead()

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [conversation.id, currentUserId, supabase, addMessage])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ConversationHeader 
        conversation={conversation} 
        currentUserId={currentUserId}
      />
      
      <div className="flex-1 overflow-hidden">
        <MessagesList 
          messages={messages}
          currentUserId={currentUserId}
          conversationId={conversation.id}
        />
      </div>
      
      <MessageInputRealtime 
        conversationId={conversation.id}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}