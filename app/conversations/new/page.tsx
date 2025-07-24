import { requireAuth } from "@/lib/auth"
import { NewConversationPageClient } from "@/components/conversations/new-conversation-page-client"

export default async function NewConversationPage() {
  const session = await requireAuth()
  
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Start New Conversation</h1>
        <p className="text-muted-foreground">Create a new conversation with team members</p>
      </div>
      
      <NewConversationPageClient currentUserId={session.user.id} />
    </div>
  )
}