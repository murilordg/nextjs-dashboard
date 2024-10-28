import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function LeadsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Oportunities</TableHead>
                    <TableHead>Estimated Budget</TableHead>
                    <TableHead>lastContactDate</TableHead>
                    <TableHead>nextFollowUpDate</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[1, 2, 3, 4, 5].map((key) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium"><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
