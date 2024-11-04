import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const GBreadCrumb = ({
    breadcrumbs
}: {
    breadcrumbs: { label: string; href: string }[]
}) => {
    if (breadcrumbs.length > 3) {
        const lastidx = breadcrumbs.length - 1;
        const bc = [];
        bc.push(breadcrumbs[0]);

        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={breadcrumbs[0].href}>{breadcrumbs[0].label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                <BreadcrumbEllipsis className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {breadcrumbs.slice(1, -2).map((breadcrumb, idx) => (
                                    <DropdownMenuItem key={idx}>
                                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={breadcrumbs[lastidx - 1].href}>{breadcrumbs[lastidx - 1].label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{breadcrumbs[lastidx].label}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )

    } else {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index, breadcrumbs) => (
                        <>
                            {(index < breadcrumbs.length - 1) ? (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </>
                            ) : (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )}
                        </>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        )
    }
}