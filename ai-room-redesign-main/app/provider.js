"use client"
import { useSession } from 'next-auth/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from './_context/UserDetailContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function Provider({ children }) {
    const { data: session, status } = useSession();
    const [userDetail, setUserDetail] = useState(null);
    
    useEffect(() => {
        if (session?.user) {
            VerifyUser();
        }
    }, [session])
    
    /**
     * verify User and sync with database
     */
    const VerifyUser = async () => {
        try {
            const dataResult = await axios.post('/api/verify-user', {
                user: session.user
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

export default Provider
