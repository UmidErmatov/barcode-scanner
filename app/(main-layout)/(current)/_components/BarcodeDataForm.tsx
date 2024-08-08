/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/form/form-error";
import FormSuccess from "@/components/form/form-success";
import { BarcodeSchema, UpdateBarcodeSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { useCommonStore } from "@/store/common";
import { createScannedDataAction, updateScannedDataAction } from "@/actions/sannedData";
import { commonDateFormat } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
    defaultBarcodeData: z.infer<typeof UpdateBarcodeSchema>
}

function BarcodeDataForm({ defaultBarcodeData }: Props) {

    const [openDialog, setOpenDialog, setOpenScannerModal] = useCommonStore(state => [state.openDialog, state.setOpenDialog, state.setOpenScannerModal])
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<any>("")
    const [success, setSuccess] = useState<any>("")
    const form = useForm<z.infer<typeof BarcodeSchema>>({
        resolver: zodResolver(BarcodeSchema),
        defaultValues: { ...defaultBarcodeData, quantity: defaultBarcodeData.quantity ? defaultBarcodeData.quantity : undefined, peace: defaultBarcodeData.peace ? defaultBarcodeData.peace : 0 }
    });

    const onSubmit = (values: z.infer<typeof BarcodeSchema>) => {
        setError("")
        setSuccess("")
        if (openDialog) {
            startTransition(() => {
                updateScannedDataAction(values, defaultBarcodeData.id)
                    .then((data) => {
                        // setQrResult(defaultBarcodeData)
                        setOpenDialog(false)
                        form.reset()
                    }).catch((error) => setError("Xatolik ro'y berdi!"));
            })
        } else {
            startTransition(() => {
                createScannedDataAction(values)
                    .then((data) => {
                        // setQrResult(defaultBarcodeData)
                        setOpenScannerModal(false)
                        form.reset()
                    }).catch((error) => setError("Xatolik ro'y berdi!"));
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
            >
                <ScrollArea>
                    <div className='space-y-4'>

                        <FormField
                            control={form.control}
                            name='barcode'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Barcode</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='123456'
                                            disabled={isPending || !!defaultBarcodeData.barcode}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mahsulot nomi</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            // autoFocus={!defaultBarcodeData.name}
                                            placeholder='Mahsulot nomini kiriting'
                                            disabled={isPending || !!defaultBarcodeData.name}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='quantity'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Miqdori</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Miqdorini kiriting'
                                            type='number'
                                            // autoFocus={!!defaultBarcodeData.name}
                                            autoFocus
                                            maxLength={100}
                                            disabled={isPending}
                                            onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='peace'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dona</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='0'
                                            type='number'
                                            value={field.value ?? ""}
                                            disabled={isPending}
                                            onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='shelfLife'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Muddati</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isPending || format(defaultBarcodeData.shelfLife, commonDateFormat) !== format(new Date(), commonDateFormat)}
                                                >
                                                    {field.value ? (
                                                        format(field.value, commonDateFormat)
                                                    ) : (
                                                        <span>Sanani kiriting</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <= new Date() || date > new Date("2040-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='manufacturer'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ishlab chiqaruvchi</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Ishlab chiqaruvchi nomini kiriting'
                                            disabled={isPending || !!defaultBarcodeData.manufacturer}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='buyPrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tan narxi</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='100'
                                            type='number'
                                            disabled={isPending || !!defaultBarcodeData.buyPrice}
                                            onChange={(e) => field.onChange(e.target.value ? e.target.valueAsNumber : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </ScrollArea>
                <FormError message={error} />
                <FormSuccess message={success} />

                <div className="flex flex-1 justify-between space-x-10">
                    <Button
                        className='w-full'
                        variant={'outline'}
                        disabled={isPending}
                        onClick={() => {
                            setOpenScannerModal(false)
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        Saqlash
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default BarcodeDataForm