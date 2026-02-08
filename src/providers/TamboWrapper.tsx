import type { ReactNode } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { STRATIFY_TOOLS } from "../tambo.config";

export function TamboWrapper({ children }: { children: ReactNode }) {
    const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

    if (!apiKey) {
        return <div className="p-10 text-red-500">CRITICAL ERROR: VITE_TAMBO_API_KEY is missing in .env.local</div>;
    }

    return (
        <TamboProvider
            apiKey={apiKey}
            components={STRATIFY_TOOLS}
        >
            {children}
        </TamboProvider>
    );
}
