"use client"
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'

function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { data: session } = useSession();

    return (
        <div className='p-5 shadow-sm flex justify-between items-center'>
            <Link href={'/'} className='flex gap-2 items-center'>
                <Image src={'/logo.svg'} width={40} height={40} alt="Logo" />
                <h2 className='font-bold text-lg'>AI Room Design</h2>
            </Link>

            {session?.user && (
                <Link href={'/dashboard/buy-credits'}>
                    <Button variant="ghost" className="rounded-full text-primary">Buy More Credits</Button>
                </Link>
            )}

            <div className='flex gap-7 items-center'>
                {userDetail?.credits && (
                    <div className='flex gap-2 p-1 items-center bg-slate-200 px-3 rounded-full'>
                        <Image src={'/star.png'} width={20} height={20} alt="Credits" />
                        <h2>{userDetail?.credits}</h2>
                    </div>
                )}

                {session?.user ? (
                    <div className="relative group">
                        <button className="flex items-center gap-2">
                            <Image
                                src={session.user.image || '/placeholder.png'}
                                width={40}
                                height={40}
                                alt="User"
                                className="rounded-full"
                            />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <p className="font-semibold">{session.user.name}</p>
                                <p className="text-xs text-gray-500">{session.user.email}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button variant="outline">Sign in</Button>
                    </Link>
                )}

                {session?.user && (
                    <Link href={'/dashboard'}>
                        <Button>Dashboard</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Header
