import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Check, ArrowLeft, Edit, Trash, Loader } from "lucide-react";
import { useGeneralTagsContext } from "@/providers/TagProvider"
import cuid from 'cuid';
import { GeneralTagData } from "@/lib/definitions"
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from "use-debounce"
import { ScrollArea } from "../ui/scroll-area"
import { Switch } from "../ui/switch"
import { Spinner } from "../ui/spinner"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "../ui/loading-sppiner"

export function TagsFieldDialog({
    open,
    selectedTags,
    onChecked,
    onClose,
    ...props
}: {
    open: boolean,
    selectedTags: string[] | undefined,
    onChecked: (tagId: string, checked: boolean) => void,
    onClose: () => void,
}) {
    const [selectPage, setSelectPage] = useState(true);
    const [editingTag, setEditingTag] = useState<GeneralTagData | undefined>(undefined);
    const { generalTags, createGeneralTag, updateGeneralTag, deleteGeneralTag } = useGeneralTagsContext();

    const handleonGoBack = () => {
        if (selectPage) onClose();
        else setSelectPage(true);
    }

    const handleGoEditTag = (tagId: string | undefined) => {
        setEditingTag(tagId === undefined ? undefined : generalTags.find((tag: { id: string }) => tag.id === tagId));
        setSelectPage(false);
    }


    return (
        <Dialog open={open} {...props} onOpenChange={() => { setSelectPage(true); onClose(); }}>
            <DialogContent className="sm:max-w-[425px]">

                {selectPage ? (
                    <SelectTags
                        generalTags={generalTags as GeneralTagData[]}
                        selectedTags={selectedTags}
                        onChecked={onChecked}
                        onEditPage={handleGoEditTag}
                        onClose={onClose}
                    />
                ) : (
                    <EditTags
                        editingTag={editingTag}
                        onGoBack={handleonGoBack}
                        createGeneralTag={createGeneralTag}
                        updateGeneralTag={updateGeneralTag}
                        deleteGeneralTag={deleteGeneralTag}
                    />
                )}

            </DialogContent>
        </Dialog>
    );
}


interface SelectedTags extends GeneralTagData {
    selected: boolean;
}

function SelectTags({
    generalTags,
    selectedTags,
    onChecked,
    onEditPage,
    onClose,
    ...props
}: {
    generalTags: GeneralTagData[],
    selectedTags: string[] | undefined,
    onChecked: (tagId: string, checked: boolean) => void,
    onEditPage: (tagId: string | undefined) => void,
    onClose: () => void,
}) {
    const [searchTag, setSearchTag] = useState<string>('');
    const [tags, setTags] = React.useState<SelectedTags[]>([]);
    const [searchedTags, setSearchedTags] = React.useState<SelectedTags[]>([]);

    React.useEffect(() => {
        if (selectedTags === undefined) return;

        const _tags: SelectedTags[] = [];
        generalTags?.forEach((tag: GeneralTagData) => {
            const selected = selectedTags.find((tagId: string) => tag.id === tagId) !== undefined;

            _tags.push({
                ...tag,
                selected
            });
        });

        setTags(_tags);
    }, [generalTags, selectedTags]);

    React.useEffect(() => {
        if (searchTag.length > 0) {
            setSearchedTags(
                tags.filter((tag) => tag.name.toLowerCase().includes(searchTag.toLowerCase()))
            );
        } else {
            setSearchedTags(tags);
        }
    }, [tags, searchTag]);

    const handleSearch = useDebouncedCallback((searchTag) => {
        setSearchTag(searchTag);
        // setSearchedTags(
        //     tags.filter((tag) => tag.name.toLowerCase().includes(searchTag.toLowerCase()))
        // );
    }, 300);

    const handleCheckUncheckTag = (tagId: string, checked: boolean) => {
        onChecked(tagId, checked);
    };

    const handleCreateTag = () => {
        onEditPage(undefined);
    };

    const handleEditTag = (tagId: string) => {
        onEditPage(tagId);
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Select tags</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
                <div className="relative flex flex-1 flex-shrink-0">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        placeholder="Search tags..."
                        defaultValue={searchTag}
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
                <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="flex flex-col gap-2 p-4">
                        {searchedTags.map((tag: SelectedTags) => (

                            <div key={tag.id} className="flex items-center space-x-2">
                                <Switch id={tag.id} checked={tag.selected} onCheckedChange={() => handleCheckUncheckTag(tag.id, !tag.selected)} />

                                <div
                                    style={{ background: tag.color }}
                                    className="flex flex-row justify-between rounded-md h-9 w-full"
                                >

                                    <small className="p-2 pl-4 text-zinc-500 font-bold">{tag.name}</small>
                                    <Edit size={33} onClick={() => handleEditTag(tag.id)} className="p-2 cursor-pointer text-zinc-500" />

                                </div>

                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <DialogFooter className="flex">
                <Button type="submit" onClick={handleCreateTag}>Create Tag</Button>
                <Button type="button" variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
        </>
    );
}

function EditTags({
    editingTag,
    onGoBack,
    createGeneralTag,
    updateGeneralTag,
    deleteGeneralTag,
    ...props
}: {
    editingTag: GeneralTagData | undefined,
    onGoBack: () => void,
    createGeneralTag: (tag: GeneralTagData) => Promise<void>,
    updateGeneralTag: (tag: GeneralTagData) => Promise<void>,
    deleteGeneralTag: (tagId: string) => Promise<void>,
}) {
    const [tagName, setTagName] = useState<string>(editingTag?.name ?? '');
    const [color, setColor] = useState<string>(editingTag?.color ?? '#E2E2E2');

    const handleSaveTag = async () => {
        if (editingTag) {
            updateGeneralTag({ ...editingTag, name: tagName, color: color });
        } else {
            const tagId = cuid();
            createGeneralTag({ id: tagId, name: tagName, color: color });
        }

        onGoBack();
    };

    const handleRemoveTag = async (tagId: string) => {
        deleteGeneralTag(tagId)
        onGoBack();
    }

    const solids = [
        '#E2E2E2',
        '#fc2803',
        '#fc4b03',
        '#fc6b03',
        '#fc9a03',
        '#fcba03',
        '#fcdb03',
        '#ff75c3',
        '#ffa647',
        '#ffe83f',
        '#9fff5b',
        '#a1fc03',
        '#70ff03',
        '#70e2ff',
        '#03fcbe',
        '#03fce7',
        '#03c2fc',
        '#0367fc',
        '#1803fc',
        '#5e03fc',
        '#263d82',
        '#9003fc',
        '#cd93ff',
        '#d203fc',
        '#fc03f8',
        '#fc03c6',
        '#fc0398',
        '#fc0362',
        '#4d292a',
        '#4d2936',
        '#4d294b',
        '#41294d',
        '#2d294d',
        '#29454d',
        '#294d39',
    ]

    return (
        <>
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <button className={cn("bg-transparent p-2 hover:bg-gray-100")} onClick={() => onGoBack()}>
                        <ArrowLeft size={24} />
                    </button>
                    <DialogTitle>Edit tags</DialogTitle>
                </div>
            </DialogHeader>

            <div className="grid gap-4">
                <div className="flex gap-4">
                    <Input
                        id="tagName"
                        defaultValue={tagName}
                        placeholder="Tag name"
                        onChange={(e) => setTagName(e.target.value)}
                    />

                    {editingTag &&
                        <Button variant="outline" size="icon" onClick={() => handleRemoveTag(editingTag?.id)}>
                            <Trash size={33} className="h-4 w-4 text-zinc-500" />
                        </Button>
                    }

                </div>
                <div className="flex flex-wrap gap-1 mt-0">
                    <div
                        className="flex rounded-md h-9 w-9 cursor-pointer active:scale-105 border"
                        onClick={() => setColor('')}
                    >
                        {(color === '') && <Check size={24} className="text-zinc-500" />}

                    </div>
                    {solids.map((s) => (
                        <div
                            key={s}
                            style={{ background: s }}
                            className="flex rounded-md h-9 w-9 cursor-pointer active:scale-105"
                            onClick={() => setColor(s)}
                        >
                            {(color === s) && <Check size={24} className="text-black" />}

                        </div>
                    ))}
                </div>
            </div>

            < DialogFooter className="grid grid-cols-1">
                <Separator className="mb-3" />
                <Button type="submit" onClick={handleSaveTag}>Save changes</Button>
            </DialogFooter >
        </>
    );
}