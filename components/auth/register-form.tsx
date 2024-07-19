"use client"
import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form/form-error'
import FormSuccess from '../form/form-success'
import { registerAction } from '@/actions/register'
import { useRouter } from 'next/navigation'

type Props = {}

function RegisterForm({ }: Props) {
    const router = useRouter()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            fullname: ''
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            registerAction(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                    // router.push("/login")
                })
        })
    }

    return (
        <CardWrapper
            headerLabel='Akkaunt yaratish'
            backButtonLabel="Kirish sahifasiga o'tish"
            backButtonHref='/login'
            showSocials
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='fullname'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>F.I.Sh</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Umid Ermatov'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        Ro'yhatdan o'tish
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default RegisterForm