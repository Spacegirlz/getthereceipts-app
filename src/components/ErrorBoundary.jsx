import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h1>
            <p className="text-gray-300 mb-6">
              The app encountered an unexpected error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left bg-gray-800 p-4 rounded-lg">
                <summary className="cursor-pointer text-yellow-400 font-medium mb-2">
                  Development Error Details
                </summary>
                <pre className="text-xs text-red-300 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;