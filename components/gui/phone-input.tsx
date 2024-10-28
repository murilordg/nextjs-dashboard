import React, { ChangeEvent } from "react";
import {
    FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form";
import { cn, normalizePhoneNumber } from "@/lib/utils";

export function PhoneInput({
    field
}: {
    field: any
}) {
    const { setValue } = useFormContext()

    const phoneMask = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        console.log(name, value);

        const newValue = normalizePhoneNumber(value);

        setValue(name, newValue)
    }

    return (
        <FormControl onChange={phoneMask}>
            <div className={cn("flex items-center gap-2")}>
                <Input placeholder="phone ..." {...field} />
            </div>
        </FormControl>
    )
}