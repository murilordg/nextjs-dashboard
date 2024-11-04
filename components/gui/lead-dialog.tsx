'use client'

import React from 'react'
import { useLeadDialog } from '@/hooks/use-lead-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
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
import { Button } from '../ui/button';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createLeadStatus } from '@/app/lib/actions/lead-actions';

const formSchema = z.object({
    status: z.string().min(2, {
        message: "Status must be at least 2 characters.",
    }),
})

const LeadDialog = () => {
    const [loading, setLoading] = React.useState(false);
    const { dialog, dismiss } = useLeadDialog();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "",
        },
    })


    const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
        const { status } = values;

        setLoading(true);
        const leadStatus = await createLeadStatus({ name: status });
        dismiss({ inserted: { id: leadStatus.id, name: status } });
        setLoading(false);
    }

    if (loading) {
        return (
            <p>Saving status data...</p>
        )
    } else {
        return (
            <Dialog open={dialog.show} onOpenChange={() => { dismiss(); }}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{dialog.title}</DialogTitle>
                            </DialogHeader>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Status name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            New custom status
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex">
                                <Button type="button" onClick={form.handleSubmit(onSubmit)}>Create Status</Button>
                                <Button type="button" variant="outline" onClick={() => dismiss()}>Close</Button>
                            </DialogFooter>

                        </DialogContent>
                    </form>
                </Form>
            </Dialog>
        )
    }
}

export default LeadDialog;