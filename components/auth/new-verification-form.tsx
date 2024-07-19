"use client"
// import { BeatLoader } from 'react-spinners'
import CardWrapper from "./card-wrapper"
import { Button } from '../ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from "react"
import { newVerificationAction } from "@/actions/new-verification"
import FormError from "../form/form-error"
import FormSuccess from "../form/form-success"

interface NewVerificationFormProps {

}
export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const onSubmit = useCallback(
        () => {
            if (!token) {
                setError("Token topilmadi!")
                return;
            }
            newVerificationAction(token).then(data => {
                setError(data.error)
                setSuccess(data.success)
            }).catch(err => {
                setError("Xatolik yuz berdi!")
            })
        }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])


    return (
        <CardWrapper
            headerLabel="Emailni tasdiqlash"
            backButtonLabel="Kirish sahifasiga o'tish"
            backButtonHref="/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (<Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>)}
                <FormError message={error} />
                <FormSuccess message={success} />
            </div>
        </CardWrapper>
    )
}