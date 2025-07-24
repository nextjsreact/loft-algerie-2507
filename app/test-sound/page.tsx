'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useNotificationSound } from '@/lib/hooks/use-notification-sound'

export default function TestSoundPage() {
  const { playNotificationSound } = useNotificationSound()
  const [audioInitialized, setAudioInitialized] = useState(false)
  
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setAudioInitialized(true)
      document.removeEventListener('click', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    return () => document.removeEventListener('click', handleInteraction)
  }, [])
  
  const handlePlaySound = (type: 'success' | 'info' | 'warning' | 'error') => {
    console.log(`Playing ${type} sound...`)
    playNotificationSound(type)
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification Sound Test</h1>
      
      {!audioInitialized && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Click anywhere on the page first</p>
          <p>Browsers require user interaction before playing audio</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Test Different Sound Types</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handlePlaySound('success')} 
              className="bg-green-500 hover:bg-green-600"
            >
              Success Sound (High)
            </Button>
            <Button 
              onClick={() => handlePlaySound('info')} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Info Sound (Medium)
            </Button>
            <Button 
              onClick={() => handlePlaySound('warning')} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Warning Sound (Low)
            </Button>
            <Button 
              onClick={() => handlePlaySound('error')} 
              className="bg-red-500 hover:bg-red-600"
            >
              Error Sound (Lowest)
            </Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Test Real-Time Notifications</h2>
          <div className="space-y-3">
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-instant-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      type: 'success',
                      title: 'Task Completed!',
                      message: 'Your task has been completed successfully.'
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error('Failed to send test notification')
                  }
                  
                  const data = await response.json()
                  console.log('✅ Test notification sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test notification:', error)
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Send Success Notification
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-instant-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      type: 'warning',
                      title: 'Task Overdue',
                      message: 'You have a task that is overdue and needs attention.'
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error('Failed to send test notification')
                  }
                  
                  const data = await response.json()
                  console.log('⚠️ Test warning sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test notification:', error)
                }
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Send Warning Notification
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-task-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      type: 'info'
                    })
                  })
                  
                  if (!response.ok) {
                    throw new Error('Failed to send test task notification')
                  }
                  
                  const data = await response.json()
                  console.log('📋 Test task notification sent:', data)
                } catch (error) {
                  console.error('❌ Error sending test task notification:', error)
                }
              }}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Test Task Notification
            </Button>
            
            <p className="text-sm text-gray-600 mt-2">
              These should trigger real-time notifications with sound and update the sidebar badge without page refresh!
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <h3 className="font-medium">Troubleshooting:</h3>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Make sure your device volume is turned up</li>
            <li>Check browser console for any audio-related errors</li>
            <li>Some browsers block audio until user interacts with the page</li>
            <li>Try different browsers if sound doesn't work</li>
          </ul>
        </div>
      </div>
    </div>
  )
}