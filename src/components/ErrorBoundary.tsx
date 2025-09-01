import React from 'react';

function Fallback() { 
  return (
    <div className="p-6 text-red-600">
      <h2 className="text-lg font-semibold mb-2">Error cargando reportes</h2>
      <p className="text-sm text-muted-foreground">
        Recarga la página o inténtalo más tarde
      </p>
    </div>
  ); 
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>, 
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState { 
    return { hasError: true }; 
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() { 
    if (this.state.hasError) {
      return <Fallback />;
    }
    
    return this.props.children; 
  }
}
