import * as React from "react";
import { cn } from "@/lib/utils";
import { Tags } from "lucide-react";
import { TagsFieldDialog } from "./tags-field-dialog";
import { useGeneralTagsContext } from "@/providers/TagProvider";
import { GeneralTagData } from "@/lib/definitions";
import { Button } from "../ui/button";
import { TagBadge } from "./tag-badge";

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
        setOpenDialog(true);
    };

    const handleCheckUncheckTag = (tagId: string, checked: boolean) => {
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
                {tags.length === 0 &&
                    <Button type="button" variant="ghost" >
                        <Tags size={18} className="text-zinc-500" />
                        <span className="text-zinc-500">Select tags</span>
                    </Button>
                }


                {tags.map((tag) => <TagBadge key={tag.id} color={tag.color}>{tag.name}</TagBadge>)}

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

TagsField.displayName = "TagsField";
export { TagsField };
