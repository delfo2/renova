import { Message as IMessage } from '../context/conversationContext';
import { Speaker } from '../enums/speaker';
import favicon from '../assets/images/favicon.svg';
import ReactMarkdown from 'react-markdown';
import React from 'react';

interface MessageProps {
    message: IMessage;
}
const Message = React.forwardRef<HTMLDivElement, MessageProps>((props, ref) => {
    const userMsg = (
        <div
            ref={ref}
            className="flex w-full items-start justify-end p-5"
        >
            <div className="ml-3 flex max-w-96 flex-col gap-1 rounded-l-lg rounded-br-lg bg-neutral-300 p-2">
                <ReactMarkdown>{props.message.content}</ReactMarkdown>
            </div>
            <div className="clip-message-right block h-3 w-1 bg-neutral-300"></div>
        </div>
    );
    const botMsg = (
        <div
            ref={ref}
            className="flex w-full items-start justify-start p-5"
        >
            <div className="clip-message-left block h-3 w-1 bg-neutral-100"></div>
            <div className="flex w-7/12 flex-col gap-1 rounded-r-lg rounded-bl-lg bg-neutral-100 p-2">
                <span className="mb-1 flex items-center gap-1 text-sm text-neutral-700">
                    <span className="flex items-center gap-1 text-sm font-bold text-black">
                        <img
                            src={favicon}
                            alt="black rocket"
                            className="h-3 w-3"
                        />
                        Renova IA
                    </span>
                    <span>•</span>
                    <span>Pensamento de 12s</span>
                </span>
                <ReactMarkdown>{props.message.content}</ReactMarkdown>
            </div>
        </div>
    );
    return props.message.speaker === Speaker.BOT ? botMsg : userMsg;
});

export default Message;
