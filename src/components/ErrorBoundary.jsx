import React from 'react';

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI
      return this.props.fallback ? 
        this.props.fallback(this.state.error) : 
        (
          <div className="error-boundary-fallback">
            <h3>Something went wrong</h3>
            <p>{this.state.error?.message || 'An unknown error occurred'}</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="error-retry-btn"
            >
              Try Again
            </button>
          </div>
        );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;