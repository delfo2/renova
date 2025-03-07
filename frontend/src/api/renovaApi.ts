import { Speaker } from '../enums/speaker';

interface ApiConversation {
    id: string;
    createdAt: string;
}

interface ApiMessage {
    id: string;
    createdAt: string;
    completedAt: string;
    content: string;
    conversationId: string;
    speaker: Speaker;
}

export class RenovaApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async createConversation(): Promise<ApiConversation> {
        const response = await fetch(`${this.baseUrl}/api/conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await this.parseError(response);
            throw new Error(error);
        }

        console.log(response);
        return await response.json();
    }

    async getConversations(): Promise<ApiConversation[]> {
        const response = await fetch(`${this.baseUrl}/api/conversation`);

        if (!response.ok) {
            const error = await this.parseError(response);
            throw new Error(error);
        }

        console.log(response);
        return await response.json();
    }

    async deleteConversation(conversationId: string): Promise<void> {
        const response = await fetch(
            `${this.baseUrl}/api/conversation/${conversationId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            const error = await this.parseError(response);
            throw new Error(error);
        }

        return;
    }

    async createMessage(
        conversationId: string,
        content: string,
    ): Promise<ApiMessage> {
        const response = await fetch(
            `${this.baseUrl}/api/message/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            },
        );

        if (!response.ok) {
            const error = await this.parseError(response);
            throw new Error(error);
        }

        console.log(response);
        return await response.json();
    }

    async getMessages(conversationId: string): Promise<ApiMessage[]> {
        const response = await fetch(
            `${this.baseUrl}/api/message/${conversationId}`,
        );

        if (!response.ok) {
            const error = await this.parseError(response);
            throw new Error(error);
        }

        console.log(response);
        return await response.json();
    }

    private async parseError(response: Response): Promise<string> {
        try {
            const errorData = await response.json();
            return errorData.error || 'Unknown error occurred';
        } catch {
            return `HTTP Error: ${response.status} ${response.statusText}`;
        }
    }
}
