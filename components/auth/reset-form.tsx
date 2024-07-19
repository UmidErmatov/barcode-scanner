"use client"
import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { ResetSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form/form-error'
import FormSuccess from '../form/form-success'
import { resetAction } from '@/actions/reset'

function ResetForm() {
    const [error, setError] = useState<any>("")
    const [success, setSuccess] = useState<any>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            resetAction(values)
                .then((data: any) => {
                    setError(data?.error || "")
                    setSuccess(data?.success || "")
                })
        })
    }

    return (
        <CardWrapper
            headerLabel='Parolni unutdingizmi?'
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
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='email@example.com'
                                            type='email'
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
                        Emailga jo'natish
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default ResetForm