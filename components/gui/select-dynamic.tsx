"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { PlusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl } from "../ui/form"
import { SelectOption } from "./definitions";
import { DialogSelectCommand } from "@/hooks/use-lead-dialog";

function SelectDynamic({
    value,
    showDialog,
    options,
    name,
    label,
    ...props
}: {
    value: string | undefined,
    showDialog?: (title: string, updateOptions: (cmd?: DialogSelectCommand) => void) => void,
    options: SelectOption[],
    name: string,
    label: string
}) {
    const [internalOptions, setInternalOptions] = React.useState(options);
    const { setValue } = useFormContext();

    React.useEffect(() => {
        setInternalOptions(options);
    }, [options]);


    const handleUpdateOptions = (cmd?: DialogSelectCommand) => {
        if (cmd) {
            if (cmd.inserted) {
                setInternalOptions([...internalOptions, { id: cmd.inserted.id, label: cmd.inserted.name }])
                setValue(name, cmd.inserted.id)
            }
        }
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-[200px] justify-between",
                                !value && "text-muted-foreground"
                            )}
                        >
                            {
                                value ?
                                    internalOptions.find((opt) => opt.id === value)?.label
                                    : `Select ${label}`
                            }
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder={`Search ${label}...`}
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>{`No ${label} found`}.</CommandEmpty>

                            {(showDialog != undefined) ? (
                                <>
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => {
                                                showDialog(`New ${label}...`, handleUpdateOptions)
                                            }}
                                        >
                                            <PlusIcon size={16} />
                                            <span>{`New ${label}`}</span>
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator />
                                </>
                            ) : null}

                            <CommandGroup>
                                {internalOptions.map((option) => (
                                    <CommandItem
                                        value={option.label}
                                        key={option.id}
                                        onSelect={() => {
                                            setValue(name, option.id)
                                        }}
                                    >
                                        {option.label}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                option.id === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

SelectDynamic.displayName = 'SelectDynamic';

export { SelectDynamic };