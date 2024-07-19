import React from 'react'

type Props = {
    label: string
}

function LoginFormHeader({ label }: Props) {
    return (
        <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
            <h1>Auth</h1>
            <p className='text-muted-foreground text-sm'>
                {label}
            </p>
        </div>
    )
}

export default LoginFormHeader