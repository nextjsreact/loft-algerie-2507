import { conversations } from "@/lib/data";
import { Conversation } from "@/lib/types";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";

export default function ConversationsPage() {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        <div className="p-4">
          {conversations.map((conversation: Conversation) => (
            <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                <p className="font-semibold">{conversation.name}</p>
                <p className="text-sm text-gray-500">{conversation.latestMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center h-full bg-gray-50">
        <MessagesSquare className="w-24 h-24 text-gray-300" />
        <p className="text-lg text-gray-500 mt-4">Select a conversation to start messaging</p>
      </div>
    </div>
  );
}
