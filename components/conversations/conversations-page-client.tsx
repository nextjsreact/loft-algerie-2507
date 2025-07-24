'use client'

import { useState, useEffect } from 'react'
import { ConversationsList } from '@/components/conversations/conversations-list'
import { NewConversationDialog } from '@/components/conversations/new-conversation-dialog'
import { useRealtimeConversations } from '@/lib/hooks/use-realtime-conversations'
import { Conversation } from '@/lib/services/conversations'
import { MessagesSquare, Plus, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationSound } from '@/lib/hooks/use-notification-sound'

interface ConversationsPageClientProps {
  initialConversations: Conversation[]
  currentUserId: string
}

export function ConversationsPageClient({ 
  initialConversations, 
  currentUserId 
}: ConversationsPageClientProps) {
  const {
    conversations,
    unreadCount,
    isLoading,
    refreshConversations,
    markConversationAsRead
  } = useRealtimeConversations(initialConversations, currentUserId)

  const { playNotificationSound } = useNotificationSound()

  // Play sound when new messages arrive
  useEffect(() => {
    const handleNewMessage = () => {
      playNotificationSound('info')
    }

    document.addEventListener('new-message-received', handleNewMessage)
    return () => document.removeEventListener('new-message-received', handleNewMessage)
  }, [playNotificationSound])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Messages</h2>
            {unreadCount > 0 && (
              <div className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                {unreadCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={refreshConversations}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <NewConversationDialog userId={currentUserId}>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </NewConversationDialog>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationsList 
            conversations={conversations} 
            currentUserId={currentUserId}
            onConversationClick={markConversationAsRead}
          />
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center h-full bg-muted/20">
        <MessagesSquare className="w-24 h-24 text-muted-foreground/50" />
        <p className="text-lg text-muted-foreground mt-4">Select a conversation to start messaging</p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          Choose from existing conversations or start a new one
        </p>
        {conversations.length === 0 && (
          <div className="mt-6">
            <NewConversationDialog userId={currentUserId}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Conversation
              </Button>
            </NewConversationDialog>
          </div>
        )}
      </div>
    </div>
  )
}