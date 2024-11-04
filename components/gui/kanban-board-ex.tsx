"use client"

import React, { useState } from "react";
import { DragDropContext, DropResult, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiCalendar, FiMessageSquare, FiPaperclip, FiUser, FiX } from "react-icons/fi";
import Image from 'next/image';

export type KanbanBoardTask = {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
    assignee: {
        name: string;
        avatar: string;
    };
    comments: number;
    attachments: number;
};

export type KanbanBoardColumn = {
    id: string;
    title: string;
    taskIds: string[];
};

export type KanbanBoard = {
    tasks: KanbanBoardTask[];
    columns: KanbanBoardColumn[];
    columnOrder: string[];
}

const initialData: KanbanBoard = {
    tasks: [
        {
            id: "task-1",
            title: "Implement User Authentication",
            description: "Set up JWT authentication for the application",
            deadline: "2024-02-28",
            status: "todo",
            assignee: {
                name: "John Doe",
                avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            },
            comments: 3,
            attachments: 2
        },
        {
            id: "task-2",
            title: "Design Dashboard Layout",
            description: "Create responsive dashboard wireframes",
            deadline: "2024-02-25",
            status: "inProgress",
            assignee: {
                name: "Jane Smith",
                avatar: "images.unsplash.com/photo-1438761681033-6461ffad8d80"
            },
            comments: 5,
            attachments: 1
        },
        {
            id: "task-3",
            title: "API Integration",
            description: "Integrate payment gateway API",
            deadline: "2024-02-20",
            status: "done",
            assignee: {
                name: "Mike Johnson",
                avatar: "images.unsplash.com/photo-1500648767791-00dcc994a43e"
            },
            comments: 2,
            attachments: 3
        }
    ],
    columns: [
        {
            id: "todo",
            title: "To Do",
            taskIds: ["task-1"]
        },
        {
            id: "inProgress",
            title: "In Progress",
            taskIds: ["task-2"]
        },
        {
            id: "done",
            title: "Done",
            taskIds: ["task-3"]
        }
    ],
    columnOrder: ["todo", "inProgress", "done"]
};

const KanbanBoardEx = () => {
    const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgEBAYGp2SoAAAAASUVORK5CYII=';
    const [data, setData] = useState<KanbanBoard>(initialData);
    const [selectedTask, setSelectedTask] = useState<KanbanBoardTask | null>(null);
    const [selectedUser, setSelectedUser] = useState("all");

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = data.columns.find((col) => col.id === source.droppableId)!;
        const finishColumn = data.columns.find((col) => col.id === destination.droppableId)!;

        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds
            };

            const newColumns = data.columns.map((col) => (col.id === newColumn.id ? newColumn : col));

            const newData = {
                ...data,
                columns: newColumns
            };

            setData(newData);

        } else {
            const startTaskIds = Array.from(startColumn.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds
            };

            const finishTaskIds = Array.from(finishColumn.taskIds);
            finishTaskIds.splice(destination.index, 0, draggableId);
            const newFinishColumn = {
                ...finishColumn,
                taskIds: finishTaskIds
            };

            const newColumns = data.columns.map((col) =>
            (col.id === newStartColumn.id ? newStartColumn :
                (col.id === newFinishColumn.id ? newFinishColumn : col)
            ));

            const newData = {
                ...data,
                columns: newColumns
            };

            setData(newData);
        }
    };

    const filteredTasks = selectedUser === "all"
        ? data.tasks
        : data.tasks.filter((task) => task.assignee.name === selectedUser);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-6">
                <select
                    className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="all">All Users</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                </select>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns.find((col) => col.id === columnId)!;
                        const tasks = column.taskIds.map((taskId) => filteredTasks.find((task) => task.id === taskId)).filter(Boolean);

                        return (
                            <div key={column.id} className="flex-shrink-0 w-80">
                                <div className="bg-gray-200 p-4 rounded-lg">
                                    <h2 className="font-semibold text-lg mb-4">{column.title}</h2>
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-gray-300" : ""}`}
                                            >
                                                {tasks.map((task, index) => (
                                                    <Draggable
                                                        key={task!.id}
                                                        draggableId={task!.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? "rotate-3" : ""}`}
                                                                onClick={() => setSelectedTask(task!)}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h3 className="font-medium">{task!.title}</h3>
                                                                    <Image
                                                                        src={`https://${task!.assignee.avatar}`}
                                                                        alt={task!.assignee.name}
                                                                        className="w-8 h-8 rounded-full"
                                                                        width={32}
                                                                        height={32}
                                                                        placeholder="blur"
                                                                        blurDataURL={placeholder}
                                                                    />
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-3">
                                                                    {task!.description}
                                                                </p>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <FiCalendar className="mr-1" />
                                                                    <span className="mr-4">{task!.deadline}</span>
                                                                    <FiMessageSquare className="mr-1" />
                                                                    <span className="mr-4">{task!.comments}</span>
                                                                    <FiPaperclip className="mr-1" />
                                                                    <span>{task!.attachments}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-semibold">{selectedTask.title}</h2>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            <div className="flex items-center mb-6">
                                <Image
                                    src={`https://${selectedTask.assignee.avatar}`}
                                    alt={selectedTask.assignee.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                    width={40}
                                    height={40}
                                    placeholder="blur"
                                    blurDataURL={placeholder}
                                />
                                <div>
                                    <p className="font-medium">{selectedTask.assignee.name}</p>
                                    <p className="text-sm text-gray-500">Assigned</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-gray-600">{selectedTask.description}</p>
                            </div>
                            <div className="flex gap-6 mb-6">
                                <div>
                                    <h3 className="font-medium mb-2">Deadline</h3>
                                    <p className="text-gray-600">{selectedTask.deadline}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Comments</h3>
                                    <p className="text-gray-600">{selectedTask.comments}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Attachments</h3>
                                    <p className="text-gray-600">{selectedTask.attachments}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoardEx;