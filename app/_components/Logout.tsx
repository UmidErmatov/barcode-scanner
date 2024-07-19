"use client"
import { logoutAction } from '@/actions/logout'
// import { signOut } from '@/auth'
import LoginButton from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

type Props = {}

function Logout({ }: Props) {
    return (
        <span onClick={() => signOut()} className='cursor-pointer'>Chiqish</span>
    )
}

export default Logout