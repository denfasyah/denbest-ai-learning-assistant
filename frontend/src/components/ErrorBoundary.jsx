import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-error text-2xl mb-2">Oops! Terjadi Kesalahan</h2>
              <p className="opacity-70 mb-6">
                Maaf, sistem mengalami gangguan teknis yang tidak terduga.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Reload Aplikasi
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
