import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, PlusCircle, Paperclip, ArrowLeft, Calendar, Tag, Clock, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Mock threads data
const mockThreads = [
  {
    id: '1',
    shipmentId: 'SHIP-1000',
    subject: 'Shipment SHIP-1000 Update',
    participants: ['1', '2'],
    lastMessage: 'The customs clearance is now complete. Your shipment will be in transit soon.',
    lastMessageTime: '2023-03-15T14:30:00',
    unreadCount: 1,
    agent: {
      name: 'Sophie Martin',
      avatar: null,
      status: 'online'
    }
  },
  {
    id: '2',
    shipmentId: 'SHIP-1002',
    subject: 'Document Request',
    participants: ['1', '3'],
    lastMessage: 'Please provide the certificate of origin as soon as possible.',
    lastMessageTime: '2023-03-14T09:15:00',
    unreadCount: 0,
    agent: {
      name: 'Thomas Dubois',
      avatar: null,
      status: 'offline'
    }
  },
  {
    id: '3',
    shipmentId: 'SHIP-1005',
    subject: 'Delivery Delay Notification',
    participants: ['1', '4'],
    lastMessage: 'Due to weather conditions, your delivery will be delayed by 24 hours.',
    lastMessageTime: '2023-03-13T16:45:00',
    unreadCount: 2,
    agent: {
      name: 'Cheikh Tidiane',
      avatar: null,
      status: 'offline'
    }
  }
];

// Mock messages for threads
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
    content: "We've submitted all the necessary documents. It should take 2-3 business days.",
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
  },
  {
    id: 'm5',
    threadId: '2',
    senderId: '3',
    content: 'For shipment SHIP-1002, we need additional documentation for customs clearance.',
    timestamp: '2023-03-14T08:30:00',
    read: true
  },
  {
    id: 'm6',
    threadId: '2',
    senderId: '3',
    content: 'Please provide the certificate of origin as soon as possible.',
    timestamp: '2023-03-14T09:15:00',
    read: true
  },
  {
    id: 'm7',
    threadId: '3',
    senderId: '4',
    content: 'Important notice regarding your shipment SHIP-1005.',
    timestamp: '2023-03-13T16:20:00',
    read: false
  },
  {
    id: 'm8',
    threadId: '3',
    senderId: '4',
    content: 'Due to weather conditions, your delivery will be delayed by 24 hours.',
    timestamp: '2023-03-13T16:45:00',
    read: false
  }
];

// Generate more mock messages for better scrolling demonstration
const generateMoreMessages = (threadId, count) => {
  const additionalMessages = [];
  const startDate = new Date('2023-03-10T10:00:00');

  for (let i = 0; i < count; i++) {
    const isUserMessage = i % 2 === 0;
    const messageDate = new Date(startDate);
    messageDate.setHours(messageDate.getHours() + i);

    additionalMessages.push({
      id: `additional-${threadId}-${i}`,
      threadId,
      senderId: isUserMessage ? '1' : threadId === '1' ? '2' : threadId === '2' ? '3' : '4',
      content: isUserMessage
        ? `This is message ${i + 1} from user about shipment ${threadId}. Adding content to demonstrate scrolling functionality.`
        : `This is message ${i + 1} from agent about shipment ${threadId}. We're adding sufficient content to test the scrolling feature properly.`,
      timestamp: messageDate.toISOString(),
      read: true
    });
  }

  return additionalMessages;
};

// Add more messages to each thread for better scroll testing
const expandedMockMessages = [
  ...mockMessages,
  ...generateMoreMessages('1', 20),
  ...generateMoreMessages('2', 15),
  ...generateMoreMessages('3', 18)
];

// Function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Status indicator component
const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  return (
    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColors[status]}`}></span>
  );
};

const MessagesPage = () => {
  const { t, language } = useLanguage();
  const user = { id: '1', name: 'Current User' };

  const [activeThread, setActiveThread] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messagesData, setMessagesData] = useState(expandedMockMessages);
  const [showThreadsList, setShowThreadsList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [textareaHeight, setTextareaHeight] = useState(40);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatThreadDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }
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

    setMessagesData(prevMessages => [...prevMessages, newMessage]);
    setMessageText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      setTextareaHeight(40);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessagesScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollToBottom(!isNearBottom);
  };

  const handleTextareaResize = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
    textareaRef.current.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Si la largeur est supérieure à 768px, l'activeThread est restauré s'il était null
      if (window.innerWidth >= 768) {
        setShowThreadsList(true);
        if (!activeThread && mockThreads.length > 0) {
          setActiveThread(mockThreads[0]);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initialisation : sur desktop on montre la première conversation, sur mobile aucune
    if (window.innerWidth >= 768 && mockThreads.length > 0) {
      setActiveThread(mockThreads[0]);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeThread) {
      scrollToBottom();
    }
  }, [activeThread, messagesData.length]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleMessagesScroll);
      handleMessagesScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleMessagesScroll);
      }
    };
  }, []);

  const filteredThreads = mockThreads.filter(thread =>
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};

    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });

    return groupedMessages;
  };

  const threadMessages = activeThread
    ? messagesData
        .filter(m => m.threadId === activeThread.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  const groupedMessages = groupMessagesByDate(threadMessages);

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const toggleThreadsList = () => {
    setShowThreadsList(!showThreadsList);
  };

  const getMessageAnimationClass = (index) => {
    return `animate-fadeIn`;
  };

  // Pour la vue mobile, nous avons deux sections principales :
  // 1. La liste des conversations (threads)
  // 2. Le détail d'une conversation

  // Sur mobile, nous voulons afficher une seule section à la fois
  const showMobileThreadsList = windowWidth < 768 && (!activeThread || showThreadsList);
  const showMobileConversation = windowWidth < 768 && activeThread && !showThreadsList;

  // Sur desktop, nous affichons les deux sections côte à côte
  const showDesktopLayout = windowWidth >= 768;

  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    if (windowWidth < 768) {
      setShowThreadsList(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('messages') || 'Messages'}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('manage_messages') || 'Manage your conversations'}</p>
        </div>
        <button
          className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle size={16} className="mr-1 md:mr-2" />
          <span className="hidden xs:inline">{t('new_message') || 'New Message'}</span>
          <span className="xs:hidden">{t('new') || 'New'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0 h-full">
        <div className="flex flex-col md:grid md:grid-cols-12 h-full">
          {/* Liste des conversations (toujours visible sur desktop, conditionnellement sur mobile) */}
          {(showDesktopLayout || showMobileThreadsList) && (
            <div className="md:col-span-4 lg:col-span-3 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
              <div className="p-3 md:p-4 border-b border-gray-200 bg-white">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder={t('search_messages') || 'Search messages'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {filteredThreads.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredThreads.map((thread) => (
                      <li
                        key={thread.id}
                        className={`hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${activeThread?.id === thread.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                        onClick={() => handleThreadClick(thread)}
                      >
                        <div className="p-3 md:p-4 relative">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 relative">
                              {thread.agent.avatar ? (
                                <img
                                  src={thread.agent.avatar}
                                  alt={thread.agent.name}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                  {getInitials(thread.agent.name)}
                                </div>
                              )}
                              <StatusIndicator status={thread.agent.status} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{thread.agent.name}</h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {formatThreadDate(thread.lastMessageTime)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 mb-1">
                                {thread.shipmentId}
                              </p>
                              <p className={`text-sm ${thread.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'} truncate`}>
                                {thread.lastMessage}
                              </p>
                            </div>
                          </div>

                          {thread.unreadCount > 0 && (
                            <span className="absolute top-4 right-4 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {t('no_conversations') || 'No conversations found'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Détail d'une conversation (toujours visible sur desktop, conditionnellement sur mobile) */}
          {(showDesktopLayout || showMobileConversation) && activeThread && (
            <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full bg-white">
              <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 flex items-center bg-white shadow-sm">
                {windowWidth < 768 && (
                  <button
                    className="mr-3 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowThreadsList(true)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}

                <div className="flex-shrink-0 relative mr-3 md:mr-4">
                  {activeThread.agent.avatar ? (
                    <img
                      src={activeThread.agent.avatar}
                      alt={activeThread.agent.name}
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {getInitials(activeThread.agent.name)}
                    </div>
                  )}
                  <StatusIndicator status={activeThread.agent.status} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-lg font-medium text-gray-900 flex items-center truncate">
                    {activeThread.agent.name}
                    {activeThread.agent.status === 'online' && (
                      <span className="ml-2 text-xs font-normal text-green-600">{t('online') || 'Online'}</span>
                    )}
                  </h2>
                  <div className="flex items-center text-xs md:text-sm text-gray-500 truncate">
                    <Tag size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{activeThread.shipmentId}</span>
                  </div>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 custom-scrollbar relative"
                onScroll={handleMessagesScroll}
                style={{ maxHeight: 'calc(100vh - 350px)' }}
              >
                {Object.keys(groupedMessages).map(date => (
                  <div key={date} className="mb-6">
                    <div className="flex justify-center mb-4">
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                        {formatDateHeader(date)}
                      </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {groupedMessages[date].map((message, index) => {
                        const isOwnMessage = message.senderId === user?.id;
                        const agent = mockThreads.find(t => t.id === message.threadId)?.agent;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group ${getMessageAnimationClass(index)}`}
                          >
                            {!isOwnMessage && (
                              <div className="flex-shrink-0 mr-2 md:mr-3 self-end">
                                {agent?.avatar ? (
                                  <img
                                    src={agent.avatar}
                                    alt={agent.name}
                                    className="h-6 w-6 md:h-8 md:w-8 rounded-full"
                                  />
                                ) : (
                                  <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                    {getInitials(agent?.name || 'Agent')}
                                  </div>
                                )}
                              </div>
                            )}

                            <div
                              className={`
                                relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm
                                ${isOwnMessage
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-800 border border-gray-100'}
                              `}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              <div className={`text-xs md:text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'text-blue-200' : 'text-gray-400'}`}>
                                <div className="flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  {new Date(message.timestamp).toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 p-3 md:p-4 bg-white">
                <div className="flex space-x-2 md:space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      className="block w-full pl-3 pr-10 py-2 md:pl-4 md:pr-12 md:py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-none custom-scrollbar"
                      placeholder={t('write_message') || 'Write a message...'}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTextareaResize();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      style={{ height: `${textareaHeight}px` }}
                    ></textarea>
                    <button
                      className="absolute right-3 bottom-2 md:bottom-3 text-gray-400 hover:text-gray-600"
                      title={t('attach_file') || 'Attach file'}
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center px-3 md:px-4 h-10 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white ${messageText.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 self-end`}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send size={16} className="mr-1" />
                    <span className="hidden sm:inline">{t('send') || 'Send'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message lorsqu'aucune conversation n'est sélectionnée sur desktop */}
          {showDesktopLayout && !activeThread && (
            <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">{t('select_conversation') || 'Select a conversation'}</h3>
                <p className="text-gray-500">{t('select_conversation_hint') || 'Choose a conversation from the list to start messaging'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;  /* Légèrement plus large pour une meilleure utilisabilité */
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;