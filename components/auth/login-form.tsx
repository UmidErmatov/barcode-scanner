"use client"
import { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form/form-error'
import FormSuccess from '../form/form-success'
import { loginAction } from '@/actions/login'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Props = {}

function LoginForm({ }: Props) {
    const searchParams = useSearchParams()
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Ushbu email avval ishlatilgan!" : ""
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [error, setError] = useState<any>("")
    const [success, setSuccess] = useState<any>("")
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            loginAction(values)
                .then((data) => {
                    if (data?.error) {
                        setError(data?.error)
                    }

                    if (data?.success) {
                        form.reset()
                        setSuccess(data?.success || "")
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                }).catch((error) => setError("Xatolik ro'y berdi!"));
        })
    }

    return (
        <CardWrapper
            headerLabel='Welcome back'
            backButtonLabel="Ro'yhatdan o'tish"
            backButtonHref='/register'
            showSocials
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        {showTwoFactor &&
                            <FormField
                                control={form.control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ikki bosqichli himoya</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='123456'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        {!showTwoFactor &&
                            <>
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
                                            <Button
                                                size={"sm"}
                                                variant={"link"}
                                                asChild
                                                className='px-0 font-normal'
                                            >
                                                <Link href={"/reset"}>
                                                    Parolni unutdingizmi?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        }
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        {showTwoFactor ? "Tasdiqlash" : "Kirish"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LoginForm