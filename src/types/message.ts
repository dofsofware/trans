export interface Message {
  id: string;
  shipmentId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Thread {
  id: string;
  shipmentId: string;
  subject: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}