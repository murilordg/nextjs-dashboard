import MessageList from "@/app/ui/kanban/message-list";
import KanbanBoardEx from "@/components/gui/kanban-board-ex";
import { Metadata } from 'next';

export default function Page() {
    return (
        <>
            <KanbanBoardEx />

            <MessageList />
        </>
    );
}

export const metadata: Metadata = {
    title: 'Kanban Board',
};
