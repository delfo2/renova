import React from 'react';
import { ConversationProvider } from './context/conversationContext';
import Aside from './components/aside';

export default function App() {
    return (
        <ConversationProvider>
            <div className="font-sans">
                <Aside />
            </div>
        </ConversationProvider>
    );
}
