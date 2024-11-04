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
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Ratings } from "@/components/gui/rating"
import { SelectStatic } from "@/components/gui/select-static"
import { PhoneInput } from "@/components/gui/phone-input"
import { TagsField } from "@/components/gui/tags-field"
import { SelectDynamic } from "@/components/gui/select-dynamic"
import { SelectOption } from "@/components/gui/definitions";
import { useLeadDialog } from '@/hooks/use-lead-dialog';
import { fetchUsers } from "@/app/lib/actions/user-actions";
import { useEffect, useState } from "react"
import { fetchLeadStatus } from "@/app/lib/actions/lead-actions"
import { createLead } from "@/app/lib/actions/lead-actions";

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
    leadScore: z.number().optional(),
    preferredContactMethod: z.string().optional(),
    tags: z.array(z.string()).optional(),
    assignedTo: z.string({
        required_error: "Please select a language.",
    }),
    status: z.string(),
});


export default function CreateForm() {
    const [users, setUsers] = useState<SelectOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<SelectOption[]>([]);
    const { toast } = useToast();
    const { showLeadDialog } = useLeadDialog();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            notes: '',
            leadScore: 2.5,
            preferredContactMethod: '',
            tags: [],
            assignedTo: undefined,
            status: undefined,
        }
    });

    const preferredContactMethodOptions: SelectOption[] = [
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' },
        { id: 'whatsapp', label: 'WhatsApp' },
    ];

    useEffect(() => {
        const fetchUserOptions = async () => {
            const users = await fetchUsers();
            const userOptions = users.map((user) => {
                return { id: user.id, label: user.name }
            });
            setUsers(userOptions);
        }

        const fetchStatusOptions = async () => {
            const status = await fetchLeadStatus();
            const options = status.map((st) => {
                return { id: st.id, label: st.name }
            });
            setStatusOptions(options);
        }

        fetchUserOptions();
        fetchStatusOptions();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
        createLead({
            firstName: values.firstName!,
            lastName: values.lastName ?? '',
            email: values.email!,
            phone: values.phone!,
            notes: values.notes ?? '',
            leadScore: values.leadScore ?? 0,
            preferredContactMethod: values.preferredContactMethod ?? '',
            assignedTo: values.assignedTo,
            status: values.status,
            estimatedBudget: BigInt(0),
            lastContactDate: new Date(),
            nextFollowUpDate: new Date()
        }, values.tags ?? []);

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            ),
        });
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
                                <PhoneInput {...field} />
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
                                    <Ratings variant={"yellow"} {...field} changeOnMove={true} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="preferredContactMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>preferredContactMethod</FormLabel>
                                <SelectStatic options={preferredContactMethodOptions} {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <TagsField {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>assignedTo</FormLabel>
                            <SelectDynamic options={users} label="user" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (

                        <FormItem className="flex flex-col">
                            <FormLabel>status</FormLabel>

                            <SelectDynamic label="status" options={statusOptions} showDialog={showLeadDialog} {...field} />
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}