
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Uncaught error in ${this.props.name || 'component'}:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    <h3 className="font-bold mb-1">Crash in {this.props.name || 'Component'}</h3>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }

        return this.props.children;
    }
}
