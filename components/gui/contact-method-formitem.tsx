import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";


export default function ContactMethodFormItem({
    onChange,
    value
}: {
    onChange: (value: string) => void,
    value: string | undefined
}) {
    return (
        <FormItem>
            <FormLabel>preferredContactMethod</FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
                <FormControl>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a preferred contact method" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>

                    <SelectGroup>
                        <SelectLabel>Bebidas</SelectLabel>
                        <SelectItem value="Arroz">Arroz</SelectItem>
                        <SelectItem value="feijao">Feijão</SelectItem>
                        <SelectItem value="macarrao">Macarrão</SelectItem>
                        <SelectItem value="carne">Carne</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>);
}