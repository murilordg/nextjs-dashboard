import { fetchLead } from "@/app/lib/data/leads-data";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function LeadsTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {

    const leads = await fetchLead();

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
                {leads.map((lead) => (
                    <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.firstName}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>??</TableCell>
                        <TableCell className="text-right">0</TableCell>
                        <TableCell className="text-right">{lead.estimatedBudget}</TableCell>
                        <TableCell>{lead.lastContactDate.toString()}</TableCell>
                        <TableCell>{lead.nextFollowUpDate.toString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}