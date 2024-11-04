// "use client"

// import React, { useState } from "react";
// import { DragDropContext, DropResult, Droppable, Draggable } from "@hello-pangea/dnd";
// import { FiUser, FiAlertCircle } from "react-icons/fi";


// export type KanbanColumns = {
//     todo: KanbanColumn,
//     inProgress: KanbanColumn,
//     done: KanbanColumn
// }

// export type KanbanTask = {
//     id: string;
//     title: string;
//     assignee: {
//         id: number;
//         name: string;
//         avatar: string;
//     };
// }

// export type KanbanColumn = {
//     id: string;
//     title: string;
//     tasks: {
//         id: string;
//         title: string;
//         assignee: {
//             id: number;
//             name: string;
//             avatar: string;
//         };
//     }[];
// };

// const KanbanBoard = () => {
//     const initialColumns: KanbanColumns = {
//         todo: {
//             id: "todo",
//             title: "To Do",
//             tasks: [
//                 {
//                     id: "task-1",
//                     title: "Design Homepage",
//                     assignee: {
//                         id: 1,
//                         name: "John Doe",
//                         avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e"
//                     }
//                 },
//                 {
//                     id: "task-2",
//                     title: "Implement API Integration",
//                     assignee: {
//                         id: 2,
//                         name: "Jane Smith",
//                         avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330"
//                     }
//                 }
//             ]
//         },
//         inProgress: {
//             id: "inProgress",
//             title: "In Progress",
//             tasks: [
//                 {
//                     id: "task-3",
//                     title: "User Authentication",
//                     assignee: {
//                         id: 3,
//                         name: "Mike Johnson",
//                         avatar: "images.unsplash.com/photo-1500648767791-00dcc994a43e"
//                     }
//                 }
//             ]
//         },
//         done: {
//             id: "done",
//             title: "Done",
//             tasks: [
//                 {
//                     id: "task-4",
//                     title: "Database Setup",
//                     assignee: {
//                         id: 4,
//                         name: "Sarah Wilson",
//                         avatar: "images.unsplash.com/photo-1438761681033-6461ffad8d80"
//                     }
//                 }
//             ]
//         }
//     };

//     const [columns, setColumns] = useState<KanbanColumns>(initialColumns);
//     const [selectedUser, setSelectedUser] = useState("");
//     const [error, setError] = useState("");

//     const handleDragEnd = (result: DropResult) => {
//         if (!result.destination) return;

//         const { source, destination } = result;

//         const sourceColumn = (source.droppableId === 'todo') ? columns.todo :
//             (source.droppableId === 'inProgress') ? columns.inProgress : columns.done;
//         const destColumn = (destination.droppableId === 'todo') ? columns.todo :
//             (destination.droppableId === 'inProgress') ? columns.inProgress : columns.done;
//         const sourceTasks = [...sourceColumn.tasks];
//         const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];

//         const [removed] = sourceTasks.splice(source.index, 1);
//         destTasks.splice(destination.index, 0, removed);

//         setColumns({
//             ...columns,
//             [source.droppableId]: {
//                 ...sourceColumn,
//                 tasks: sourceTasks
//             },
//             [destination.droppableId]: {
//                 ...destColumn,
//                 tasks: destTasks
//             }
//         });
//     };

//     const handleUserFilter = (userName: string) => {
//         setSelectedUser(userName);
//         setError("");

//         if (userName && !Object.values(columns).some(column =>
//             column.tasks.some(task => task.assignee.name === userName)
//         )) {
//             setError("No tasks found for selected user");
//         }
//     };

//     const getAllUsers = () => {
//         const users = new Set<string>();
//         Object.values(columns).forEach(column =>
//             column.tasks.forEach(task => users.add(task.assignee.name))
//         );
//         return Array.from(users);
//     };

//     const filterTasks = (tasks: KanbanTask[]) => {
//         if (!selectedUser) return tasks;
//         return tasks.filter(task => task.assignee.name === selectedUser);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//             <div className="mb-6">
//                 <select
//                     className="w-full md:w-64 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                     value={selectedUser}
//                     onChange={(e) => handleUserFilter(e.target.value)}
//                     aria-label="Filter tasks by user"
//                 >
//                     <option value="">All Users</option>
//                     {getAllUsers().map(user => (
//                         <option key={user} value={user}>{user}</option>
//                     ))}
//                 </select>

//                 {error && (
//                     <div className="mt-2 text-red-500 flex items-center">
//                         <FiAlertCircle className="mr-2" />
//                         <span>{error}</span>
//                     </div>
//                 )}
//             </div>

//             <DragDropContext onDragEnd={handleDragEnd}>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {Object.values(columns).map(column => (
//                         <div
//                             key={column.id}
//                             className="bg-white rounded-lg shadow-md p-4"
//                         >
//                             <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
//                             <Droppable droppableId={column.id}>
//                                 {(provided, snapshot) => (
//                                     <div
//                                         {...provided.droppableProps}
//                                         ref={provided.innerRef}
//                                         className={`min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
//                                     >
//                                         {filterTasks(column.tasks).map((task, index) => (
//                                             <Draggable
//                                                 key={task.id}
//                                                 draggableId={task.id}
//                                                 index={index}
//                                             >
//                                                 {(provided) => (
//                                                     <div
//                                                         ref={provided.innerRef}
//                                                         {...provided.draggableProps}
//                                                         {...provided.dragHandleProps}
//                                                         className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
//                                                     >
//                                                         <h3 className="font-medium mb-2">{task.title}</h3>
//                                                         <div className="flex items-center">
//                                                             {task.assignee.avatar ? (
//                                                                 <img
//                                                                     src={`https://${task.assignee.avatar}`}
//                                                                     alt={task.assignee.name}
//                                                                     className="w-8 h-8 rounded-full mr-2"
//                                                                 />
//                                                             ) : (
//                                                                 <FiUser className="w-8 h-8 p-1 rounded-full bg-gray-200 mr-2" />
//                                                             )}
//                                                             <span className="text-sm text-gray-600">{task.assignee.name}</span>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </Draggable>
//                                         ))}
//                                         {provided.placeholder}
//                                     </div>
//                                 )}
//                             </Droppable>
//                         </div>
//                     ))}
//                 </div>
//             </DragDropContext>
//         </div>
//     );
// };

// export default KanbanBoard;