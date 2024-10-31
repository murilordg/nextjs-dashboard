import * as React from "react";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Tags } from "lucide-react";
import { Badge } from "../ui/badge";
import { TagsFieldDialog } from "./tags-field-dialog";
import { useGeneralTagsContext } from "@/providers/TagProvider";
import { GeneralTagData } from "@/lib/definitions";

export type TagsProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    value: string[] | undefined;
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsField = React.forwardRef<HTMLInputElement, TagsProps>(({
    value,
    onChange,
    ...props
}, ref) => {
    const { generalTags } = useGeneralTagsContext();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [tags, setTags] = React.useState<GeneralTagData[]>([]);

    React.useEffect(() => {
        const _tags: GeneralTagData[] = [];

        value?.forEach((tagId) => {
            const tag = generalTags.find((tag: GeneralTagData) => tag.id === tagId);

            if (tag) _tags.push(tag);
        });

        setTags(_tags);
    }, [value, generalTags]);

    const handleClick = () => {
        console.log("click");
        setOpenDialog(true);
    };

    const handleCheckUncheckTag = (tagId: string, checked: boolean) => {
        console.log(tagId, checked);

        if (checked) {
            if (value) {
                if (value?.includes(tagId)) return;
                onChange?.([...value, tagId]);
            } else {
                onChange?.([tagId]);
            }
        } else {
            if (!value?.includes(tagId)) return;
            onChange?.(value.filter((tag) => tag !== tagId));
        }
    }

    return (
        <>
            <div
                className={cn("flex flex-wrap items-center gap-2")}
                {...props}
                onClick={handleClick}
            >
                <Tags color="#4A90E2" size={16} />

                {tags.map((tag) => <CustomBadge key={tag.id} color={tag.color}>{tag.name}</CustomBadge>)}

            </div>
            <TagsFieldDialog
                open={openDialog}
                selectedTags={value}
                onClose={() => setOpenDialog(false)}
                onChecked={handleCheckUncheckTag}
            />
        </>
    );
});


const CustomBadge = ({ children, color }: { children: React.ReactNode, color: string }) => {
    return (
        <Badge
            className={clsx(
                {
                    "bg-[#E2E2E2] text-zinc-500": color === "#E2E2E2",
                    "bg-[#fc2803] text-zinc-500": color === "#fc2803",
                    "bg-[#fc4b03] text-zinc-500": color === "#fc4b03",
                    "bg-[#fc6b03] text-zinc-500": color === "#fc6b03",
                    "bg-[#fc9a03] text-zinc-500": color === "#fc9a03",
                    "bg-[#fcba03] text-zinc-500": color === "#fcba03",
                    "bg-[#fcdb03] text-zinc-500": color === "#fcdb03",
                    "bg-[#ff75c3] text-zinc-500": color === "#ff75c3",
                    "bg-[#ffa647] text-zinc-500": color === "#ffa647",
                    "bg-[#ffe83f] text-zinc-500": color === "#ffe83f",
                    "bg-[#9fff5b] text-zinc-500": color === "#9fff5b",
                    "bg-[#a1fc03] text-zinc-500": color === "#a1fc03",
                    "bg-[#70ff03] text-zinc-500": color === "#70ff03",
                    "bg-[#70e2ff] text-zinc-500": color === "#70e2ff",
                    "bg-[#03fcbe] text-zinc-500": color === "#03fcbe",
                    "bg-[#03fce7] text-zinc-500": color === "#03fce7",
                    "bg-[#03c2fc] text-zinc-500": color === "#03c2fc",
                    "bg-[#0367fc] text-zinc-500": color === "#0367fc",
                    "bg-[#1803fc] text-zinc-500": color === "#1803fc",
                    "bg-[#5e03fc] text-zinc-500": color === "#5e03fc",
                    "bg-[#263d82] text-zinc-500": color === "#263d82",
                    "bg-[#9003fc] text-zinc-500": color === "#9003fc",
                    "bg-[#cd93ff] text-zinc-500": color === "#cd93ff",
                    "bg-[#d203fc] text-zinc-500": color === "#d203fc",
                    "bg-[#fc03f8] text-zinc-500": color === "#fc03f8",
                    "bg-[#fc03c6] text-zinc-500": color === "#fc03c6",
                    "bg-[#fc0398] text-zinc-500": color === "#fc0398",
                    "bg-[#fc0362] text-zinc-500": color === "#fc0362",
                    "bg-[#4d292a] text-zinc-500": color === "#4d292a",
                    "bg-[#4d2936] text-zinc-500": color === "#4d2936",
                    "bg-[#4d294b] text-zinc-500": color === "#4d294b",
                    "bg-[#41294d] text-zinc-500": color === "#41294d",
                    "bg-[#2d294d] text-zinc-500": color === "#2d294d",
                    "bg-[#29454d] text-zinc-500": color === "#29454d",
                    "bg-[#294d39] text-zinc-500": color === "#294d39",
                }
            )}
        >
            {children}
        </Badge>
    );
};


TagsField.displayName = "TagsField";
export { TagsField };
