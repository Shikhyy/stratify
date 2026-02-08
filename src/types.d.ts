// Fallback type definition to silence IDE errors if it can't resolve the package path
// The actual types are loaded from node_modules during build
declare module '@tambo-ai/react' {
    export function useTamboThread(): {
        thread: {
            messages: any[];
        };
    };
    export function useTamboThreadInput(): {
        value: string;
        setValue: (val: string) => void;
        submit: (text?: string) => Promise<void>;
        isPending: boolean;
    };
    export const TamboProvider: React.FC<{
        children: React.ReactNode;
        initialState?: any;
        components?: any[];
        apiKey?: string;
    }>;
}
