import { Conversation } from './services/conversations';

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'direct',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    participants: [],
    unread_count: 0
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'direct',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    participants: [],
    unread_count: 0
  },
];
