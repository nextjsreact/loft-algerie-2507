copy "use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Message } from '@/lib/types';

const initialMessages: Message[] = [
  { id: '1', text: 'Hey, how are you?', sender: 'them', timestamp: '10:00 AM' },
  { id: '2', text: 'I am good, thanks! How about you?', sender: 'me', timestamp: '10:01 AM' },
  { id: '3', text: 'Doing great! Ready for the meeting?', sender: 'them', timestamp: '10:02 AM' },
];

function MessageBubble({ message }: { message: Message }) {
  const isMine = message.sender === 'me';
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        <p>{message.text}</p>
        <p className="text-xs text-right mt-1">{message.timestamp}</p>
      </div>
    </div>
  );
}

function MessageInput({ onSendMessage }: { onSendMessage: (text: string) => void }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">John Doe</h2>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
