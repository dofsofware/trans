import { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock threads data
const mockThreads = [
  {
    id: '1',
    shipmentId: 'SHIP-1000',
    subject: 'Shipment SHIP-1000 Update',
    participants: ['1', '2'],
    lastMessage: 'The customs clearance is now complete. Your shipment will be in transit soon.',
    lastMessageTime: '2023-03-15T14:30:00',
    unreadCount: 1
  },
  {
    id: '2',
    shipmentId: 'SHIP-1002',
    subject: 'Document Request',
    participants: ['1', '3'],
    lastMessage: 'Please provide the certificate of origin as soon as possible.',
    lastMessageTime: '2023-03-14T09:15:00',
    unreadCount: 0
  }
];

// Mock messages for the first thread
const mockMessages = [
  {
    id: 'm1',
    threadId: '1',
    senderId: '2',
    content: 'Hello, I wanted to inform you that your shipment SHIP-1000 has arrived at our warehouse.',
    timestamp: '2023-03-12T10:30:00',
    read: true
  },
  {
    id: 'm2',
    threadId: '1',
    senderId: '1',
    content: 'Thank you for the update. When do you expect it to clear customs?',
    timestamp: '2023-03-12T11:15:00',
    read: true
  },
  {
    id: 'm3',
    threadId: '1',
    senderId: '2',
    content: 'We\'ve submitted all the necessary documents. It should take 2-3 business days.',
    timestamp: '2023-03-12T14:20:00',
    read: true
  },
  {
    id: 'm4',
    threadId: '1',
    senderId: '2',
    content: 'The customs clearance is now complete. Your shipment will be in transit soon.',
    timestamp: '2023-03-15T14:30:00',
    read: false
  }
];

const MessagesPage = () => {
  const { user } = useAuth();
  const [activeThread, setActiveThread] = useState(mockThreads[0]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !user) return;

    const newMessage = {
      id: `m${Date.now()}`,
      threadId: activeThread.id,
      senderId: user.id,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    // Update the thread's last message
    const updatedThreads = mockThreads.map(thread => 
      thread.id === activeThread.id 
        ? { 
            ...thread, 
            lastMessage: messageText, 
            lastMessageTime: new Date().toISOString(),
          }
        : thread
    );
    
    const updatedActiveThread = updatedThreads.find(t => t.id === activeThread.id);
    if (updatedActiveThread) {
      setActiveThread(updatedActiveThread);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-gray-600">Communicate with your logistics agents</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-280px)] min-h-[400px]">
          {/* Thread list */}
          <div className="border-r border-gray-200 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search messages"
                />
              </div>
            </div>

            <ul className="divide-y divide-gray-200">
              {mockThreads.map((thread) => (
                <li 
                  key={thread.id}
                  className={`hover:bg-gray-50 cursor-pointer ${activeThread.id === thread.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setActiveThread(thread)}
                >
                  <div className="relative px-6 py-5">
                    {thread.unreadCount > 0 && (
                      <span className="absolute top-5 right-5 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{thread.subject}</h3>
                      <p className="text-xs text-gray-500">{formatDate(thread.lastMessageTime)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 truncate">
                      {thread.lastMessage}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Message area */}
          <div className="col-span-2 flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{activeThread.subject}</h2>
                <p className="text-sm text-gray-500">Shipment {activeThread.shipmentId}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(m => m.threadId === activeThread.id)
                .map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-xs lg:max-w-md rounded-lg px-4 py-2
                          ${isOwnMessage 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'}
                        `}
                      >
                        {!isOwnMessage && (
                          <div className="flex items-center mb-1">
                            <User size={14} className="text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-500">Agent</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p 
                          className={`text-xs mt-1 text-right ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}
                        >
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  ></textarea>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSendMessage}
                  >
                    <Send size={16} className="mr-2" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow sm:rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <MessageSquare size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Need assistance?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a new conversation with our support team for any questions or concerns.
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;