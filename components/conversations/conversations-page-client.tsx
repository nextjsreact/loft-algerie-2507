'use client'

import { useState, useEffect } from 'react'
import { MessagesSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ConversationsPageClientProps {
  conversations: any[]
  currentUserId: string
}

export function ConversationsPageClient({ conversations, currentUserId }: ConversationsPageClientProps) {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})

  // Fonction pour récupérer les compteurs de messages non lus
  const fetchUnreadCounts = async () => {
    try {
      const response = await fetch('/api/conversations/unread-by-conversation')
      if (response.ok) {
        const counts = await response.json()
        setUnreadCounts(counts)
      }
    } catch (error) {
      console.error('Error fetching unread counts:', error)
    }
  }

  // Récupérer les compteurs au chargement et toutes les 3 secondes (plus fréquent pour une meilleure réactivité)
  useEffect(() => {
    fetchUnreadCounts()
    const interval = setInterval(fetchUnreadCounts, 3000)
    return () => clearInterval(interval)
  }, [])

  // Écouter les événements de focus pour rafraîchir immédiatement
  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadCounts()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/conversations/new">New</Link>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessagesSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <Button size="sm" className="mt-2" asChild>
                <Link href="/conversations/new">Start a conversation</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {conv.name || `Conversation ${conv.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {conv.type === 'group' ? 'Group' : 'Direct'} • {conv.participant_count} participants
                        </p>
                      </div>
                      
                      {/* Point rouge pour les messages non lus */}
                      {unreadCounts[conv.id] > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                            {unreadCounts[conv.id] > 99 ? '99+' : unreadCounts[conv.id]}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-2/3 flex flex-col items-center justify-center h-full bg-muted/20">
        <div className="text-center max-w-md">
          <MessagesSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
          <p className="text-muted-foreground mb-4">
            Choose a conversation from the sidebar to start messaging, or create a new one.
          </p>
          
          {conversations.length === 0 ? (
            <div className="mt-6">
              <Button asChild>
                <Link href="/conversations/new">Start Your First Conversation</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <Button asChild>
                <Link href="/conversations/new">New Conversation</Link>
              </Button>
            </div>
          )}
          

        </div>
      </div>
    </div>
  )
}