'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui/search'
import { cn } from '@/lib/utils'
import { Conversation } from '@/lib/services/conversations'
import { Users, User } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface ConversationsListProps {
  conversations: Conversation[]
  currentUserId: string
  onConversationClick?: (conversationId: string) => void
}

export function ConversationsList({ conversations, currentUserId, onConversationClick }: ConversationsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const { t } = useTranslation()

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    
    // Search by conversation name
    if (conversation.name?.toLowerCase().includes(searchLower)) {
      return true
    }
    
    // Search by participant names
    return conversation.participants.some(participant => 
      participant.user.full_name?.toLowerCase().includes(searchLower) ||
      participant.user.email?.toLowerCase().includes(searchLower)
    )
  })

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name
    }
    
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(
        p => p.user_id !== currentUserId
      )
      return otherParticipant?.user.full_name || otherParticipant?.user.email || t('conversations.unknownUser')
    }
    
    return `${t('conversations.group')} (${conversation.participants.length} ${t('conversations.members')})`
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(
        p => p.user_id !== currentUserId
      )
      return {
        src: otherParticipant?.user.avatar_url,
        fallback: otherParticipant?.user.full_name?.charAt(0) || 'U'
      }
    }
    
    return {
      src: undefined,
      fallback: conversation.name?.charAt(0) || 'G'
    }
  }

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.last_message) {
      return t('conversations.noMessagesYet')
    }
    
    const message = conversation.last_message
    const isOwnMessage = message.sender_id === currentUserId
    const senderName = isOwnMessage ? t('conversations.you') : message.sender?.full_name || t('conversations.someone')
    
    let content = message.content
    if (content.length > 50) {
      content = content.substring(0, 50) + '...'
    }
    
    return `${senderName}: ${content}`
  }

  const getLastMessageTime = (conversation: Conversation) => {
    if (!conversation.last_message) {
      return formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })
    }
    
    return formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold mb-2">{t('conversations.noConversationsYet')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('conversations.startNewConversation')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <SearchInput
          placeholder={t('conversations.searchConversations')}
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('conversations.noConversationsMatch')}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const isActive = pathname === `/conversations/${conversation.id}`
              const avatar = getConversationAvatar(conversation)
              
              return (
                <Link
                  key={conversation.id}
                  href={`/conversations/${conversation.id}`}
                  onClick={() => onConversationClick?.(conversation.id)}
                  className={cn(
                    "block p-3 rounded-lg hover:bg-muted/50 transition-colors",
                    isActive && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatar.src} />
                        <AvatarFallback className="text-sm">
                          {avatar.fallback}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.type === 'group' && (
                        <div className="absolute -bottom-1 -right-1 bg-background border rounded-full p-0.5">
                          <Users className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {getConversationName(conversation)}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {conversation.unread_count && conversation.unread_count > 0 && (
                            <Badge variant="default" className="h-5 min-w-5 text-xs px-1.5">
                              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {getLastMessageTime(conversation)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate">
                        {getLastMessagePreview(conversation)}
                      </p>
                      
                      {conversation.type === 'group' && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {conversation.participants.length} {t('conversations.members')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}