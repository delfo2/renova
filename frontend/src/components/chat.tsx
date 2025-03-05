import { useEffect, useRef } from 'react';
import { useConversation } from '../context/conversationContext';
import Message from './message';
import Input from './input';
import Welcome from './welcome';

export default function Chat() {
    console.log('--chat rendering');
    const conversationContext = useConversation();
    const selectedConversation = conversationContext.selectedConversation;
    const messages = selectedConversation?.messages;
    const name = selectedConversation?.name;
    const msgEndRef = useRef<null | HTMLDivElement>(null);

    function scrollBottom() {
        msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        console.log('--chat useEffect');
        scrollBottom();
    }, [conversationContext, selectedConversation]);

    if (!selectedConversation) {
        return <Welcome />;
    }

    return (
        <div className="flex h-full w-4/5 flex-col bg-neutral-200 px-5 py-3">
            <h2 className="text-base font-bold">{name}</h2>
            <div className="mt-10 flex h-5/6 flex-col gap-2 overflow-y-auto">
                {messages?.map((message, i) => {
                    const isLastMsg = i === messages.length - 1;
                    return (
                        <Message
                            ref={isLastMsg ? msgEndRef : null}
                            key={message.id}
                            message={message}
                        />
                    );
                })}
            </div>
            <Input />
        </div>
    );
}
