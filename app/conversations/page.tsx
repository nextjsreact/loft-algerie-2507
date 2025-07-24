import { requireAuth } from "@/lib/auth"
import { getSimpleUserConversations } from "@/lib/services/conversations-simple"
import { MessagesSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ConversationsPage() {
  const session = await requireAuth()
  
  let conversations: any[] = []
  let hasError = false
  let errorMessage = ''
  
  try {
    // Use simplified service to avoid RLS recursion issues
    conversations = await getSimpleUserConversations(session.user.id)
  } catch (error) {
    console.error('Error loading conversations:', error)
    hasError = true
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  }

  // Show error state
  if (hasError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center max-w-md">
          <MessagesSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {errorMessage.includes('infinite recursion') || errorMessage.includes('RLS policy')
              ? 'RLS Policy Fix Required'
              : errorMessage.includes('relation') || errorMessage.includes('table')
              ? 'Conversations System Setup Required'
              : 'Conversations Error'
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {errorMessage.includes('infinite recursion') || errorMessage.includes('RLS policy')
              ? 'The conversations system has RLS policy infinite recursion issues that need to be fixed.'
              : errorMessage.includes('relation') || errorMessage.includes('table') 
              ? 'The conversations system needs to be set up in your database.'
              : 'There was an error loading conversations.'
            }
          </p>
          <div className="bg-muted p-4 rounded-lg text-sm text-left">
            <p className="font-medium mb-2">
              {errorMessage.includes('infinite recursion') || errorMessage.includes('RLS policy')
                ? 'To fix RLS policies:'
                : 'To enable conversations:'
              }
            </p>
            <ol className="list-decimal list-inside space-y-1">
              {errorMessage.includes('infinite recursion') || errorMessage.includes('RLS policy') ? (
                <>
                  <li>Run: <code className="bg-background px-1 rounded">node scripts/fix-conversations-rls.js</code></li>
                  <li>Copy the SQL output to your Supabase SQL Editor</li>
                  <li>Execute the SQL script to fix RLS policies</li>
                  <li>Refresh this page</li>
                </>
              ) : (
                <>
                  <li>Run: <code className="bg-background px-1 rounded">node scripts/apply-conversations-schema.js</code></li>
                  <li>Copy the SQL output to your Supabase SQL Editor</li>
                  <li>Execute the SQL script</li>
                  <li>Refresh this page</li>
                </>
              )}
            </ol>
          </div>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error details:</strong> {errorMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Normal render with conversations data
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Messages</h2>
            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              Simplified Mode
            </div>
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
                    <div>
                      <h3 className="font-medium">
                        {conv.name || `Conversation ${conv.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {conv.type === 'group' ? 'Group' : 'Direct'} • {conv.participant_count} participants
                      </p>
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
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">RLS Policies Need Fixing</h3>
          <p className="text-muted-foreground mb-4">
            The conversations system is running in simplified mode due to database policy issues.
          </p>
          <div className="bg-muted p-4 rounded-lg text-sm text-left">
            <p className="font-medium mb-2">To fix the infinite recursion error:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Run: <code className="bg-background px-1 rounded">node scripts/fix-conversations-rls.js</code></li>
              <li>Copy the SQL output to your Supabase SQL Editor</li>
              <li>Execute the SQL script</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          
          {conversations.length === 0 && (
            <div className="mt-6">
              <Button asChild>
                <Link href="/conversations/new">Start Your First Conversation</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
