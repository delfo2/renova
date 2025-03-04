import React, {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Speaker } from '../enums/speaker';
import { RenovaApi } from '../api/renovaApi';

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    conversationId: string;
    speaker: Speaker;
}

export interface Conversation {
    id: string;
    name: string;
    messages: Message[];
    createdAt: string;
}

interface ConversationContextType {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    setSelectedConversation: (id: Conversation) => void;
    addMessageToConversation: (message: Message) => void;
    status: 'idle' | 'loading' | 'error';
}

const ConversationContext = createContext<ConversationContextType | undefined>(
    undefined,
);

export function ConversationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log('re-rendering conversation provider');
    const renovaApi = useRef(
        new RenovaApi(import.meta.env.VITE_BACKEND_URL),
    );
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    const addMessageToConversation = useCallback((message: Message) => {
        setConversations((prevConversations) =>
            prevConversations.map((conversation) => {
                if (conversation.id === message.conversationId) {
                    return {
                        ...conversation,
                        messages: [...conversation.messages, message],
                    };
                }
                return conversation;
            }),
        );
    }, []);

    useEffect(() => {
        setStatus('loading');
        console.log('conversation provider effect');
        renovaApi.current.getConversations().then(async (conversations) => {
            const completeConversations = await Promise.all(
                conversations.map(async (conversation) => {
                    const msgs = await renovaApi.current.getMessages(
                        conversation.id,
                    );
                    return {
                        messages: msgs,
                        name: conversation.id,
                        createdAt: conversation.createdAt,
                        id: conversation.id,
                    };
                }),
            );
            setConversations(completeConversations);
            setStatus('idle');
        });
    }, []);
    return (
        <ConversationContext.Provider
            value={{
                conversations,
                selectedConversation,
                setSelectedConversation,
                addMessageToConversation,
                status,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    const context = React.useContext(ConversationContext);
    if (!context) {
        throw new Error(
            'useConversation must be used within a ConversationProvider',
        );
    }
    return context;
}
