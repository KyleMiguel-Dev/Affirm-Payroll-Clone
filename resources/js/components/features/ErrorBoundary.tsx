import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * Catches errors in child components and displays friendly UI
 * Prevents entire app crash when component fails
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  State
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Could send to error tracking service (Sentry, etc.)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Something went wrong
            </h1>

            <p className="text-gray-600 text-sm text-center mb-4">
              We encountered an error loading this page. Please try again.
            </p>

            <details className="mb-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <summary className="cursor-pointer font-medium mb-2">
                Error details
              </summary>
              <code className="block overflow-auto">
                {this.state.error.message}
              </code>
            </details>

            <button
              onClick={this.resetError}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
