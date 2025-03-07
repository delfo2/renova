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
    createdAt: Date;
    completedAt: Date;
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
    createConversation: () => void;
    setSelectedConversation: (conversation: Conversation | null) => void;
    deleteConversation: (conversationID: string) => void;
    createMessage: (message: Message) => void;
    createConversationAndAddMessageToIt: (content: string) => Promise<void>;
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
    const renovaApi = useRef(new RenovaApi(import.meta.env.VITE_BACKEND_URL));
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    const updateMessageConversation = useCallback((message: Message) => {
        setConversations((prevConversations) => {
            const conversationIndex = prevConversations.findIndex(
                (conv) => conv.id === message.conversationId,
            );
            if (conversationIndex === -1) {
                throw new Error('Conversation not found');
            }
            const updatedConversation = {
                ...prevConversations[conversationIndex],
                messages: [
                    ...prevConversations[conversationIndex].messages,
                    message,
                ],
            };
            const newConversations = [...prevConversations];
            newConversations[conversationIndex] = updatedConversation;
            setSelectedConversation(updatedConversation);
            return newConversations;
        });
    }, []);

    const createConversation = useCallback(() => {
        setStatus('loading');
        renovaApi.current.createConversation().then((conversation) => {
            const newConversation = {
                ...conversation,
                name: conversation.id,
                messages: [],
            };
            setConversations((prevConversations) => [
                ...prevConversations,
                newConversation,
            ]);
            setSelectedConversation(newConversation);
            setStatus('idle');
        });
    }, []);

    const deleteConversation = useCallback((conversationID: string) => {
        setStatus('loading');
        console.log(conversationID);
        renovaApi.current.deleteConversation(conversationID).then(() => {
            setConversations((prevConversations) =>
                prevConversations.filter((conv) => conv.id !== conversationID),
            );
            setSelectedConversation(null);
            setStatus('idle');
        });
    }, []);

    // Dentro da função createMessage:
    const createMessage = useCallback(
        (message: Message) => {
            updateMessageConversation(message);

            // Adicionar mensagem de loading
            const loadingMessage: Message = {
                id: `loading-${Date.now()}`,
                content: 'loading',
                conversationId: message.conversationId,
                speaker: Speaker.BOT,
                createdAt: new Date(),
                completedAt: new Date(),
            };
            updateMessageConversation(loadingMessage);

            setStatus('loading');
            renovaApi.current
                .createMessage(message.conversationId, message.content)
                .then((msg) => {
                    const convertedMsg = {
                        ...msg,
                        createdAt: new Date(msg.createdAt),
                        completedAt: new Date(msg.completedAt),
                    };
                    setConversations((prev) => {
                        const updatedConversations = prev.map((conv) => {
                            if (conv.id === msg.conversationId) {
                                return {
                                    ...conv,
                                    messages: conv.messages
                                        .filter(
                                            (m) => m.id !== loadingMessage.id,
                                        ) // Remove apenas o loading correspondente
                                        .concat(convertedMsg),
                                };
                            }
                            return conv;
                        });

                        // Atualiza a conversa selecionada com os novos dados
                        const updatedConv = updatedConversations.find(
                            (c) => c.id === msg.conversationId,
                        );
                        if (updatedConv) {
                            setSelectedConversation(updatedConv);
                        }

                        return updatedConversations;
                    });
                    setStatus('idle');
                });
        },
        [updateMessageConversation],
    );

    const createConversationAndAddMessageToIt = useCallback(
        async (content: string) => {
            const newConversation =
                await renovaApi.current.createConversation();
            const convertedConversation = {
                ...newConversation,
                name: newConversation.id,
                messages: [],
            };

            console.log('convertedConversation', convertedConversation);

            setConversations((prevConversations) => [
                ...prevConversations,
                convertedConversation,
            ]);
            setSelectedConversation(convertedConversation);

            const userMessage: Message = {
                id: `temp-${Date.now()}`,
                content,
                conversationId: newConversation.id,
                speaker: Speaker.USER,
                createdAt: new Date(),
                completedAt: new Date(),
            };
            console.log('createConverastionAndAddMessageToIt', conversations);
            createMessage(userMessage);
        },
        [conversations, createConversation, createMessage],
    );

    useEffect(() => {
        setStatus('loading');
        console.log('conversation provider effect');
        renovaApi.current.getConversations().then(async (conversations) => {
            const completeConversations = await Promise.all(
                conversations.map(async (conversation) => {
                    const msgs = await renovaApi.current.getMessages(
                        conversation.id,
                    );
                    const completeMsgs = msgs.map((m) => {
                        return {
                            ...m,
                            createdAt: new Date(m.createdAt),
                            completedAt: new Date(m.completedAt),
                        };
                    });
                    return {
                        messages: completeMsgs,
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
                createConversationAndAddMessageToIt,
                createConversation,
                deleteConversation,
                setSelectedConversation,
                createMessage,
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
