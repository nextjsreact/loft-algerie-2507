'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchInput } from '@/components/ui/search'
import { Checkbox } from '@/components/ui/checkbox'
// Remove direct imports since we'll use API endpoints
import { User, Users, X, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface NewConversationDialogProps {
  children: React.ReactNode
  userId: string
}

interface UserSearchResult {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

export function NewConversationDialog({ children, userId }: NewConversationDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('direct')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([])
  const [groupName, setGroupName] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to search users')
      }
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      toast.error(t('conversations.failedToSearchUsers'))
    } finally {
      setIsSearching(false)
    }
  }

  const handleUserSelect = (user: UserSearchResult) => {
    if (activeTab === 'direct') {
      setSelectedUsers([user])
    } else {
      const isSelected = selectedUsers.some(u => u.id === user.id)
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
      } else {
        setSelectedUsers([...selectedUsers, user])
      }
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId))
  }

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      toast.error(t('conversations.selectAtLeastOneUser'))
      return
    }

    if (activeTab === 'group' && !groupName.trim()) {
      toast.error(t('conversations.enterGroupName'))
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: activeTab === 'group' ? groupName : undefined,
          type: activeTab as 'direct' | 'group',
          participant_ids: selectedUsers.map(u => u.id)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const conversation = await response.json()

      toast.success(`${activeTab === 'direct' ? t('conversations.conversation') : t('conversations.group')} ${t('conversations.createdSuccessfully')}`)
      setOpen(false)
      router.push(`/conversations/${conversation.id}`)
      
      // Reset form
      setSelectedUsers([])
      setGroupName('')
      setSearchQuery('')
      setSearchResults([])
    } catch (error) {
      console.error('Create conversation error:', error)
      toast.error(t('conversations.failedToCreateConversation'))
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setSelectedUsers([])
    setGroupName('')
    setSearchQuery('')
    setSearchResults([])
    setActiveTab('direct')
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('conversations.startNewConversation')}</DialogTitle>
          <DialogDescription>
            {t('conversations.createDirectOrGroup')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="gap-2">
              <User className="h-4 w-4" />
              {t('conversations.directMessage')}
            </TabsTrigger>
            <TabsTrigger value="group" className="gap-2">
              <Users className="h-4 w-4" />
              {t('conversations.groupChat')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="space-y-4">
            <div className="space-y-2">
              <Label>{t('conversations.findUserToMessage')}</Label>
              <SearchInput
                placeholder={t('conversations.searchByNameOrEmail')}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>{t('conversations.selectedUser')}</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedUsers[0].avatar_url} />
                    <AvatarFallback className="text-xs">
                      {selectedUsers[0].full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedUsers[0].full_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedUsers[0].email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">{t('conversations.groupName')}</Label>
              <Input
                id="groupName"
                placeholder={t('conversations.enterGroupName')}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('conversations.addMembers')}</Label>
              <SearchInput
                placeholder={t('conversations.searchByNameOrEmail')}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>{t('conversations.selectedMembers')} ({selectedUsers.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="gap-1">
                      {user.full_name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <div className="space-y-2">
            <Label>{t('conversations.searchResults')}</Label>
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {isSearching ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('conversations.searching')}</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t('conversations.noUsersFound')}</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {searchResults.map((user) => {
                    const isSelected = selectedUsers.some(u => u.id === user.id)
                    
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        {activeTab === 'group' && (
                          <Checkbox checked={isSelected} />
                        )}
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {user.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {user.full_name}
                            </p>
                            {(user as any).role === 'admin' && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                {t('auth.admin')}
                              </span>
                            )}
                            {(user as any).role === 'manager' && (
                              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                {t('auth.manager')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || isCreating || (activeTab === 'group' && !groupName.trim())}
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t('common.create')} {activeTab === 'direct' ? t('conversations.conversation') : t('conversations.group')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}