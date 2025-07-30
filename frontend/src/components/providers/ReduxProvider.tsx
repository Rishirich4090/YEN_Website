/**
 * Redux Provider Component
 * Provides Redux store to the application with error boundary
 */

import React, { Component, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../app/store';
import LoadingSpinner from '../ui/LoadingSpinner';

// Error Boundary for Redux Provider
class ReduxErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to your error reporting service
    console.error('Redux Provider Error:', error, errorInfo);
    
    // Clear any corrupt state from localStorage
    try {
      localStorage.removeItem('persist:root');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">
                Application Error
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Something went wrong with the application state. This is usually a 
              temporary issue.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Data & Reload
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
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

// Loading component for PersistGate
const PersistLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Loading application state...</p>
    </div>
  </div>
);

// Main Redux Provider Component
interface ReduxProviderProps {
  children: ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <ReduxErrorBoundary>
      <Provider store={store}>
        <PersistGate 
          loading={<PersistLoading />} 
          persistor={persistor}
          onBeforeLift={() => {
            // Perform any setup before the state is rehydrated
            if (process.env.NODE_ENV === 'development') {
              console.log('🔄 Redux state rehydration started');
            }
          }}
        >
          {children}
        </PersistGate>
      </Provider>
    </ReduxErrorBoundary>
  );
};

// HOC for components that need Redux
export const withRedux = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ReduxProvider>
      <Component {...props} />
    </ReduxProvider>
  );
  
  WrappedComponent.displayName = `withRedux(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for checking if Redux is ready
export const useReduxReady = () => {
  const [isReady, setIsReady] = React.useState(false);
  
  React.useEffect(() => {
    // Check if the store is initialized and state is rehydrated
    const checkReadyState = () => {
      try {
        const state = store.getState();
        setIsReady(!!state);
      } catch (error) {
        console.error('Error checking Redux ready state:', error);
        setIsReady(false);
      }
    };
    
    checkReadyState();
    
    // Listen for state changes to ensure readiness
    const unsubscribe = store.subscribe(checkReadyState);
    
    return () => unsubscribe();
  }, []);
  
  return isReady;
};

export default ReduxProvider;
