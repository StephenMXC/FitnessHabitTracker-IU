// ============================================
// ERROR BOUNDARY COMPONENT
// ============================================
// PURPOSE: Catch and handle React component errors globally.
// FEATURES:
// - Catches errors anywhere in component tree
// - Displays error message and debugging info
// - Provides button to return to home
// - Logs errors to console for debugging
// USAGE: Wrap entire app: <ErrorBoundary><App /></ErrorBoundary>
// ============================================

import React from 'react';
import './error-boundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state when error is thrown
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error details for debugging
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  // Reset error state and return to home
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1>❌ Oops! Something went wrong</h1>
            <p>We're sorry for the inconvenience. The application encountered an unexpected error.</p>
            
            {this.state.error && (
              <details className="error-details">
                <summary>Error Details (for debugging)</summary>
                <pre>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <button onClick={this.handleReset} className="error-reset-button">
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
