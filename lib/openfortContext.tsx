import React, { createContext, useContext, useState } from 'react';

interface Openfort {
    chainID: number;
    publishableKey: string;
    accessToken: string;
    password?: string;
}

export const defaultOpenfortConfig = {
    chainID: 0, // default or initial value
    publishableKey: '',
    accessToken: '',
    password: '',
};

interface OpenfortContextType {
    config: Openfort;
    setConfig: React.Dispatch<React.SetStateAction<Openfort>>;
}

const OpenfortContext = createContext<OpenfortContextType | null>(null);

interface OpenfortProviderProps {
    openfortConfig: Openfort;
    children: React.ReactNode;
}

const OpenfortProvider: React.FC<OpenfortProviderProps> = ({ openfortConfig, children }) => {
    const [config, setConfig] = useState<Openfort>(openfortConfig);

    // Context value can include Openfort state and functions to modify it
    const contextValue = { config, setConfig };

    return <OpenfortContext.Provider value={contextValue}>{children}</OpenfortContext.Provider>;
};

const useOpenfort = () => {
    const context = useContext(OpenfortContext);
    if (!context) {
        throw new Error('useOpenfort must be used within an OpenfortProvider');
    }
    return context;
};

export { OpenfortProvider, useOpenfort };
