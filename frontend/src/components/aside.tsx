import { Conversation, useConversation } from '../context/conversationContext';
import favicon from '../assets/images/favicon.svg';
import plus from '../assets/icons/plus.svg';
import message from '../assets/icons/message.svg';
import { useEffect, useRef } from 'react';

export default function Aside() {
    const conversationContext = useConversation();
    const selectedConversationRef = useRef<HTMLButtonElement | null>(null);
    function selectConversation(conversation: Conversation) {
        conversationContext.setSelectedConversation(conversation);
    }

    useEffect(() => {
        if (selectedConversationRef.current) {
            selectedConversationRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [conversationContext]);
    return (
        <div className="flex h-full h-screen max-h-screen w-1/5 flex-col bg-gray-50">
            <h1 className="ml-3 flex h-14 items-center gap-1 py-2 text-lg font-bold">
                <img src={favicon} alt="black rocket" className="w-4" />
                Renova
            </h1>
            <nav className="flex h-5/6 flex-col gap-3 border-t border-gray-200 p-2">
                <button
                    onClick={() =>
                        conversationContext.setSelectedConversation(null)
                    }
                    className="flex h-10 items-center gap-2 rounded-md border-b border-gray-200 bg-indigo-600 px-2 text-sm text-white"
                >
                    <img
                        src={plus}
                        alt="plus icon"
                        className="h-3 w-3 invert"
                    />
                    Nova conversa
                </button>
                <div className="flex h-5/6 w-full flex-col gap-3 overflow-y-auto pr-1">
                    {conversationContext.conversations.map(
                        (conversation, i) => {
                            const isFirstElement = i === 0;
                            const selected =
                                conversation.id ===
                                conversationContext.selectedConversation?.id;
                            const btnClass = selected
                                ? `border-indigo-600 bg-indigo-100 text-indigo-600`
                                : '';
                            const imgClass = selected
                                ? 'filter brightness-[94%] saturate-[5022%] invert-[29%] sepia-[92%] hue-rotate-[241deg] contrast-[91%]'
                                : '';
                            const msgs = conversation.messages;
                            const lastMessage =
                                msgs.length > 0
                                    ? msgs[msgs.length - 1].content
                                    : 'vazio';
                            return (
                                <button
                                    ref={
                                        selected ||
                                        (!selected && isFirstElement)
                                            ? selectedConversationRef
                                            : null
                                    }
                                    key={conversation.id}
                                    className={`flex min-h-[48px] w-full items-center gap-3 overflow-x-hidden overflow-y-hidden rounded-md border border-gray-200 px-2 py-2 text-sm ${btnClass}`}
                                    onClick={() =>
                                        selectConversation(conversation)
                                    }
                                >
                                    <img
                                        src={message}
                                        alt="message icon"
                                        className={`h-3 w-3 ${imgClass}`}
                                    />
                                    <div className="flex h-auto w-10/12 flex-col gap-1">
                                        <span className="inline-block h-1/2 w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-left font-semibold">
                                            {conversation.name}
                                        </span>
                                        <span className="inline-block h-1/2 w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-left font-medium opacity-50">
                                            {lastMessage}
                                        </span>
                                    </div>
                                </button>
                            );
                        },
                    )}
                </div>
            </nav>
        </div>
    );
}
