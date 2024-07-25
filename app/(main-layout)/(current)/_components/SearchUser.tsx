"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useTransition } from "react"
import { addUserToSourceAction, removeUserFromSourceAction, searchUserAction } from "@/actions/searUser"
import { useTableContext } from "@/hooks/store-hooks/table-hook"
import { UserMinus, UserPlus } from "lucide-react"

export function SearchUser() {
    const [open, setOpen] = useState(false)
    const employees = useTableContext(state => state.employees)
    const [isPending, startTransition] = useTransition()
    const [userData, setUserData] = useState<any[]>(employees ? employees.map((user: any) => ({ ...user, added: true })) : [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    Foydalanuvchi qo'shish
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Qidirish"
                        className="h-9"
                        onValueChange={value => {
                            if (!value) {
                                setUserData(employees ? employees.map((user: any) => ({ ...user, added: true })) : [])
                            } else {
                                searchUserAction(value.toLocaleLowerCase())
                                    .then(data => {
                                        setUserData((data as any[]).map(item => {
                                            const exisUser = userData.find(user => user.id === item.id)
                                            if (exisUser) return exisUser
                                            else return { ...item, added: false }
                                        }))
                                    })
                            }
                        }}
                    />
                    {userData.length ?
                        <CommandList>
                            <CommandGroup>
                                {userData.map((user) => (
                                    <CommandItem
                                        key={user.email}
                                        value={user.email}
                                        className="text-xs"
                                    >
                                        {user.fullname || user.email}
                                        <Button
                                            size={"icon"}
                                            variant={!user.added ? "outline" : "destructive"}
                                            className="ml-auto"
                                            disabled={isPending}
                                            onClick={() => {
                                                startTransition(() => {
                                                    if (user.added) {
                                                        removeUserFromSourceAction(user.id)
                                                            .then(() => {
                                                                setUserData(userData.map(u => u.id == user.id ? ({ ...u, added: false }) : u))
                                                            })
                                                    } else {
                                                        addUserToSourceAction(user.id)
                                                            .then(() => {
                                                                setUserData(userData.map(u => u.id == user.id ? ({ ...u, added: true }) : u))
                                                            })
                                                    }
                                                })
                                            }}
                                        >
                                            {user.added ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                        </Button>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList> : <div className="text-sm h-10 flex justify-center items-center">Ma'lumot yo'q</div>
                    }
                </Command>
            </PopoverContent>
        </Popover>
    )
}
