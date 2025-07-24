'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Conversation } from '@/lib/services/conversations'
import { 
  MoreVertical, 
  Users, 
  Settings, 
  UserPlus, 
  Archive,
  Trash2,
  Phone,
  Video
} from 'lucide-react'

interface ConversationHeaderProps {
  conversation: Conversation
  currentUserId: string
}

export function ConversationHeader({ conversation, currentUserId }: ConversationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  const getConversationName = () => {
    if (conversation.name) {
      return conversation.name
    }
    
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(
        p => p.user_id !== currentUserId
      )
      return otherParticipant?.user.full_name || otherParticipant?.user.email || 'Unknown User'
    }
    
    return `Group (${conversation.participants.length} members)`
  }

  const getConversationAvatar = () => {
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

  const getOnlineStatus = () => {
    if (conversation.type === 'direct') {
      // In a real app, you'd check online status from your real-time system
      return 'online' // This would come from your real-time presence system
    }
    return null
  }

  const avatar = getConversationAvatar()
  const onlineStatus = getOnlineStatus()
  const isCurrentUserAdmin = conversation.participants.find(
    p => p.user_id === currentUserId
  )?.role === 'admin'

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar.src} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
          
          {conversation.type === 'group' && (
            <div className="absolute -bottom-1 -right-1 bg-background border rounded-full p-0.5">
              <Users className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          
          {onlineStatus === 'online' && conversation.type === 'direct' && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg truncate">
            {getConversationName()}
          </h2>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {conversation.type === 'direct' ? (
              <span>
                {onlineStatus === 'online' ? 'Online' : 'Last seen recently'}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{conversation.participants.length} members</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {conversation.type === 'direct' && (
          <>
            <Button variant="ghost" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
            </Button>
          </>
        )}

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {conversation.type === 'group' && (
              <>
                <DropdownMenuItem className="gap-2">
                  <Users className="h-4 w-4" />
                  {t('notifications.viewMembers')}
                </DropdownMenuItem>
                {isCurrentUserAdmin && (
                  <DropdownMenuItem className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Members
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Conversation Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-2">
              <Archive className="h-4 w-4" />
              Archive Conversation
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              {conversation.type === 'direct' ? 'Delete Conversation' : 'Leave Group'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}