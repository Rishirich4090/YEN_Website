/**
 * Toast Provider Component
 * Provides toast notification functionality using react-toastify
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { toast, ToastContainer, ToastOptions, Id } from 'react-toastify';
import { toastConfig, ToastContextType } from '../../config/toastConfig';
import 'react-toastify/dist/ReactToastify.css';

// Create Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider Props
interface ToastProviderProps {
  children: ReactNode;
  config?: Partial<ToastOptions>;
}

// Toast Provider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const mergedConfig = { ...toastConfig, ...config };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'loading' = 'info',
    options?: Partial<ToastOptions>
  ): Id => {
    const toastOptions = { ...mergedConfig, ...options };

    switch (type) {
      case 'success':
        return toast.success(message, toastOptions);
      case 'error':
        return toast.error(message, toastOptions);
      case 'warning':
        return toast.warning(message, toastOptions);
      case 'info':
        return toast.info(message, toastOptions);
      case 'loading':
        return toast.loading(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  };

  const hideToast = (toastId?: Id) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const clearAllToasts = () => {
    toast.dismiss();
  };

  const value: ToastContextType = {
    showToast,
    hideToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        {...mergedConfig}
        className="toast-container"
        toastClassName="toast-item"
        progressClassName="toast-progress"
      />
    </ToastContext.Provider>
  );
};

// Hook to use Toast Context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Hook for specific toast types
export const useToastHelpers = () => {
  const { showToast, hideToast, clearAllToasts } = useToast();

  return {
    showSuccessToast: (message: string, options?: Partial<ToastOptions>) =>
      showToast(message, 'success', options),
    
    showErrorToast: (message: string, options?: Partial<ToastOptions>) =>
      showToast(message, 'error', options),
    
    showWarningToast: (message: string, options?: Partial<ToastOptions>) =>
      showToast(message, 'warning', options),
    
    showInfoToast: (message: string, options?: Partial<ToastOptions>) =>
      showToast(message, 'info', options),
    
    showLoadingToast: (message: string, options?: Partial<ToastOptions>) =>
      showToast(message, 'loading', options),
    
    hideToast,
    clearAllToasts,
  };
};

// Promise-based toast for async operations
export const useAsyncToast = () => {
  const { showToast, hideToast } = useToast();

  const toastPromise = async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: Partial<ToastOptions>
  ): Promise<T> => {
    const loadingToastId = showToast(messages.loading, 'loading', {
      ...options,
      autoClose: false,
      closeOnClick: false,
    });

    try {
      const result = await promise;
      hideToast(loadingToastId);
      
      const successMessage = typeof messages.success === 'function' 
        ? messages.success(result) 
        : messages.success;
      
      showToast(successMessage, 'success', options);
      return result;
    } catch (error) {
      hideToast(loadingToastId);
      
      const errorMessage = typeof messages.error === 'function' 
        ? messages.error(error) 
        : messages.error;
      
      showToast(errorMessage, 'error', options);
      throw error;
    }
  };

  return { toastPromise };
};

// HOC for providing toast functionality
export const withToast = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ToastProvider>
      <Component {...props} />
    </ToastProvider>
  );
  
  WrappedComponent.displayName = `withToast(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ToastProvider;
