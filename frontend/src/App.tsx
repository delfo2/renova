import { ConversationProvider } from './context/conversationContext';
import Aside from './components/aside';
import Chat from './components/chat';

export default function App() {
    return (
        <ConversationProvider>
            <div className="font-sans flex h-screen w-screen overflow-hidden">
                <Aside />
                <Chat />
            </div>
        </ConversationProvider>
    );
}
