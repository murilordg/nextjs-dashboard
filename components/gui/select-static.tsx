import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl } from "../ui/form";
import { SelectOption } from "./definitions";

function SelectStatic({
    onChange,
    value,
    options,
}: {
    onChange: (value: string) => void,
    value: string | undefined
    options: SelectOption[]
}) {
    return (
        <Select onValueChange={onChange} defaultValue={value}>
            <FormControl>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a preferred contact method" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                ))}

                {/* <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                </SelectGroup> */}
            </SelectContent>
        </Select>);
}

SelectStatic.displayName = 'SelectStatic';

export { SelectStatic };