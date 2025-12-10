import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center text-center p-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Something went wrong.</h1>
            <p className="opacity-80 mb-4">Please refresh the page or try again later.</p>
            <button className="px-4 py-2 bg-white/10 rounded" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
