import KanbanBoardEx from "@/components/gui/kanban-board-ex";
import { Metadata } from 'next';


export default function Page() {
    return <KanbanBoardEx />;
}


export const metadata: Metadata = {
    title: 'Kanban Board',
};
