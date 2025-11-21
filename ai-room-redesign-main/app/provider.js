"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from './_context/UserDetailContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider, useSession } from 'next-auth/react';

function ProviderContent({ children }) {
    const [userDetail, setUserDetail] = useState(null);
    const { data: session } = useSession();
    
    useEffect(() => {
        if (session?.user) {
            VerifyUser(session.user);
        }
    }, [session]);
    
    /**
     * verify User and sync with database
     */
    const VerifyUser = async (user) => {
        try {
            const dataResult = await axios.post('/api/verify-user', {
                user: user
            });
            setUserDetail(dataResult.data.result);
        } catch (error) {
            console.error("Error verifying user:", error);
        }
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
                <div>
                    {children}
                </div>
            </PayPalScriptProvider>
        </UserDetailContext.Provider>
    )
}

function Provider({ children }) {
    return (
        <SessionProvider>
            <ProviderContent>
                {children}
            </ProviderContent>
        </SessionProvider>
    )
}

export default Provider
