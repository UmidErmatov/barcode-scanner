"use client"
import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form/form-error'
import FormSuccess from '../form/form-success'
import { useRouter, useSearchParams } from 'next/navigation'
import { newPasswordAction } from '@/actions/new-password'

function NewPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const [error, setError] = useState<any>("")
    const [success, setSuccess] = useState<any>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            newPasswordAction(values, token)
                .then((data: any) => {
                    setError(data?.error || "")
                    setSuccess(data?.success || "")
                    router.push("/login")
                })
        })
    }

    return (
        <CardWrapper
            headerLabel='Yangi parolni kiriting'
            backButtonLabel="Kirish sahifasiga o'tish"
            backButtonHref='/login'
        // showSocials
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parol</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='******'
                                            type='password'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        Parolni tiklash
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default NewPasswordForm