import React from 'react'
import { Card, CardFooter, CardHeader } from '../ui/card'
import LoginFormHeader from './header'
import BackButton from './back-button'

type Props = {}

function AuthErrorCard({ }: Props) {
    return (
        <Card className='w-[400px] shadow-md'>
            <CardHeader>
                <LoginFormHeader label="Voy, nimadir xato ketdi!" />
            </CardHeader>
            <CardFooter>
                <BackButton
                    label='Kirish sahifasiga qaytish'
                    href='/login'
                />
            </CardFooter>
        </Card>
    )
}

export default AuthErrorCard