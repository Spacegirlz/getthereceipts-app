import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthModalContext = createContext(undefined);

export const AuthModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('sign_in'); // can be 'sign_in' or 'sign_up'
    const [referralCode, setReferralCode] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            setReferralCode(ref);
            openModal('sign_up');
        }
    }, [location.search]);

    const openModal = (initialView = 'sign_in') => {
        setView(initialView);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const value = {
        isOpen,
        view,
        referralCode,
        openModal,
        closeModal,
        setView,
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};