import CreateForm from "@/app/ui/lead/create-form";
import { GBreadCrumb } from "@/components/gui/gbreadcrumb";

export default function Page() {

    const breadcrumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Leads', href: '/dashboard/leads' },
        { label: 'CreateLeads', href: '' },
    ];

    return (
        <>
            <GBreadCrumb breadcrumbs={breadcrumbs} />

            <h1>Leads Create</h1>

            <CreateForm />
        </>
    );
}