import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customer', href: '/dashboard/customers' },
                    {
                        label: 'Create Customer',
                        href: '/dashboard/customers/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}

export const metadata: Metadata = {
    title: 'Invoice create',
}