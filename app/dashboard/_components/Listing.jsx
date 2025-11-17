"use client"
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import EmptyState from './EmptyState';
import Link from 'next/link';
import RoomDesignCard from './RoomDesignCard';
import AiOutputDialog from './AiOutputDialog';

function Listing() {
    const { data: session } = useSession();
    const [userRoomList, setUserRoomList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState()
    
    useEffect(() => {
        if (session?.user) {
            GetUserRoomList();
        }
    }, [session])

    const GetUserRoomList = async () => {
        const response = await fetch('/api/get-user-rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.id })
        });
        
        const data = await response.json();
        setUserRoomList(data.rooms || []);
        console.log(data.rooms);
    }
    
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-3xl'>Hello, {session?.user?.name}</h2>
                <Link href={'/dashboard/create-new'}>
                    <Button>+ Redesign Room</Button>
                </Link>
            </div>

            {userRoomList?.length == 0 ?
                <EmptyState />
                :
                <div className='mt-10'>
                    <h2 className='font-medium text-primary text-xl mb-10'>AI Room Studio</h2>
                    {/* Listing  */}
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                        {userRoomList.map((room, index) => (
                            <div key={index} onClick={() => { setOpenDialog(true); setSelectedRoom(room) }}>
                                <RoomDesignCard room={room} />
                            </div>
                        ))}
                    </div>
                </div>
            }
            <AiOutputDialog 
                aiImage={selectedRoom?.aiImage} 
                orgImage={selectedRoom?.orgImage}
                closeDialog={() => setOpenDialog(false)}
                openDialog={openDialog}
            />
        </div>
    )
}

export default Listing
