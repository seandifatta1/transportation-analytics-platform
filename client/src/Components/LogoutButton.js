import React from 'react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;

