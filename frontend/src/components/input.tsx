import React, { useEffect, useRef, useState } from 'react';
import { useConversation } from '../context/conversationContext';
import { Speaker } from '../enums/speaker';

export default function Input() {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {
        createMessage,
        selectedConversation,
        status,
        createConversationAndAddMessageToIt,
    } = useConversation();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const content = inputValue.trim();
        if (!content) {
            setErrorMessage('Message cannot be empty.');
            return;
        }

        const isValid = /^[\w\s.,!?(){}\[\]$+\-*/=À-ú]+$/.test(content);
        if (!isValid) {
            setErrorMessage('Invalid characters in message.');
            return;
        }

        if (!selectedConversation) {
            try {
                await createConversationAndAddMessageToIt(content);
            } catch (error) {
                setErrorMessage('Failed to start new conversation.');
            }
        } else {
            const newMessage = {
                id: `temp-${Date.now()}`,
                content,
                conversationId: selectedConversation.id,
                speaker: Speaker.USER,
                createdAt: new Date().toISOString(),
            };
            createMessage(newMessage);
        }

        setInputValue('');
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [selectedConversation]);

    return (
        <div className="w-full bg-neutral-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Escreva sua mensagem..."
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            {errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
        </div>
    );
}
