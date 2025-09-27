import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceFactory } from '../services/ServiceFactory.js';

const ServiceContext = createContext(null);

export const ServiceProvider = ({ children, config = {} }) => {
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeServices = async () => {
            try {
                setLoading(true);
                setError(null);

                const factory = new ServiceFactory(config.baseUrl);
                factory.initializeServices();
                const serviceContainer = factory.container;
                
                setContainer(serviceContainer);
            } catch (err) {
                console.error('Failed to initialize services:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initializeServices();

        return () => {
            if (container) {
                container.destroyAll();
            }
        };
    }, [config.baseUrl]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div>Initializing services...</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Please wait while we set up the application
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '16px',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold' }}>
                    Service Initialization Error
                </div>
                <div style={{ color: '#666' }}>
                    {error.message || 'An unexpected error occurred while initializing services'}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!container) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh'
            }}>
                <div>No services available</div>
            </div>
        );
    }

    return (
        <ServiceContext.Provider value={{ container }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServiceContext must be used within a ServiceProvider');
    }
    return context;
};

export default ServiceContext;
