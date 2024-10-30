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
import { Check } from "lucide-react";
import { useGeneralTagsContext } from "@/providers/TagProvider"
import cuid from 'cuid';

export function TagsFieldDialog({
    open,
    onChange,
    onClose,
    ...props
}: {
    open: boolean,
    onChange: (tagId: string, cmd: 'create' | 'update') => void,
    onClose: () => void,
}) {
    const { generalTags, createGeneralTag, updateGeneralTag } = useGeneralTagsContext();
    const [tagName, setTagName] = useState<string>('');
    const [color, setColor] = useState<string>('#E2E2E2');
    const onSubmit = async () => {
        const tagId = cuid();
        createGeneralTag({ id: tagId, name: tagName, color: color });
        //updateGeneralTag({ ...tag, id: "cm2v63ipy0000zvwhu7209c9h" });

        onChange?.(tagId, 'create');
        onClose();
    };

    // <div className="grid grid-cols-4 items-center gap-4">
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
        <Dialog open={open} {...props} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit tags</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="flex gap-4">
                        <Input
                            id="tagName"
                            defaultValue={tagName}
                            placeholder="Tag name"
                            onChange={(e) => setTagName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-0">
                        <div
                            className="flex rounded-md h-9 w-9 cursor-pointer active:scale-105 border"
                            onClick={() => setColor('')}
                        >
                            {(color === '') && <Check size={24} className="text-gray-400" />}

                        </div>
                        {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className="flex rounded-md h-9 w-9 cursor-pointer active:scale-105"
                                onClick={() => setColor(s)}
                            >
                                {(color === s) && <Check size={24} className="text-white" />}

                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-1">
                    <Separator className="mb-3" />
                    <Button type="submit" onClick={onSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
