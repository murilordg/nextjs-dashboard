"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Ratings } from "@/components/gui/rating"
import ContactMethodFormItem from "@/components/gui/contact-method-formitem"
import { PhoneInput } from "@/components/gui/phone-input"

const phoneRegex = /^\(\d{2}\) \d{5}(?:-\d{4})?$/
const phoneSchema = z
    .string()
    .min(15, 'This field is required')
    .length(15, `Must have 15 characters`)
    .regex(phoneRegex, 'The phone number must be valid')

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: phoneSchema,
    notes: z.string().optional(),
    leadScore: z.string(),
    preferredContactMethod: z.string().optional(),
})


export default function CreateForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            notes: '',
            leadScore: '2.5',
            preferredContactMethod: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
        const { firstName } = values;

        console.log(values);
    };



    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-4")}
            >
                <div className={cn("w-full flex gap-3")}>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className={cn("flex-1")}>
                                <FormLabel>firstName</FormLabel>
                                <FormControl>
                                    <Input placeholder="first name ..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className={cn("flex-1")}>
                                <FormLabel>lastName</FormLabel>
                                <FormControl>
                                    <Input placeholder="last name ..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className={cn("w-full flex gap-3")}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className={cn("flex-1")}>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email ..." type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>phone</FormLabel>
                                <PhoneInput field={field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="notes ..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={cn("w-full flex gap-3")}>
                    <FormField
                        control={form.control}
                        name="leadScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>leadScore</FormLabel>
                                <FormControl>
                                    <Ratings variant={"yellow"} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="preferredContactMethod"
                        render={({ field }) => (
                            <ContactMethodFormItem onChange={field.onChange} value={field.value} />
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}