import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ratingVariants = {
    default: {
        star: "text-foreground",
        emptyStar: "text-muted-foreground",
    },
    destructive: {
        star: "text-red-500",
        emptyStar: "text-red-200",
    },
    yellow: {
        star: "text-yellow-500",
        emptyStar: "text-yellow-200",
    },
};

export interface RatingsProps extends React.InputHTMLAttributes<HTMLInputElement> {
    totalStars?: number;
    size?: number;
    fill?: boolean;
    Icon?: React.ReactElement;
    variant?: keyof typeof ratingVariants;
    changeOnMove?: boolean;
}

const Ratings = React.forwardRef<HTMLInputElement, RatingsProps>(({
    totalStars = 5,
    size = 20,
    fill = true,
    Icon = <Star />,
    variant = "default",
    changeOnMove = false,
    ...props
}, ref) => {
    const [rating, setRating] = React.useState(props.value ? Number(props.value) : 0);

    React.useEffect(() => {
        if (changeOnMove) emitOnChangeEvent(rating);
    }, [rating, changeOnMove]);

    const emitOnChangeEvent = (newRating: number) => {
        if (newRating === Number(props.value)) return;

        const event = {
            target: { value: newRating.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange!(event);
    }

    const calculateRating = (selectedRating: number, e: any): number => {
        if (e === null) return selectedRating;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;

        if (percentage > 0.5) return selectedRating;
        else if (percentage > 0.1) return (selectedRating - 1) + 0.5;
        else return (selectedRating - 1);
    }

    const handleStarClick = (selectedRating: number, e: any) => {
        const newRating = calculateRating(selectedRating, e);
        emitOnChangeEvent(newRating);
        if (newRating !== rating) setRating(newRating);
    };

    const handleStarMouseMove = (selectedRating: number, e: any) => {
        const newRating = calculateRating(selectedRating, e);
        if (newRating !== rating) setRating(newRating);
    }

    const originalRating = props.value ? Number(props.value) : 0;
    const showedRating = changeOnMove ? rating : originalRating;
    const fullStars = Math.floor(showedRating)
    const partialStar =
        showedRating % 1 > 0 ? (
            <PartialStar
                fillPercentage={showedRating % 1}
                size={size}
                className={cn(ratingVariants[variant].star)}
                Icon={Icon}
                onMouseMove={(e: any) => handleStarMouseMove((fullStars + 1), e)}
                onMouseLeave={() => setRating(originalRating)}
                onClick={(e: any) => handleStarClick((fullStars + 1), e)}
            />
        ) : null
    const firstEmptyStar = (fullStars + (partialStar ? 1 : 0));
    const totalEmptyStar = (totalStars - fullStars - (partialStar ? 1 : 0));

    return (
        <div
            className={cn("flex items-center gap-2")}
            {...props}
            onMouseLeave={() => setRating(originalRating)}
            onClick={() => handleStarClick(rating, null)}
        >
            {[...Array(fullStars)].map((_, i) =>
                React.cloneElement(Icon, {
                    key: i,
                    size,
                    className: cn(
                        fill ? "fill-current" : "fill-transparent",
                        ratingVariants[variant].star
                    ),
                    onMouseMove: (e: any) => handleStarMouseMove((i + 1), e),
                    onClick: (e: any) => handleStarClick((i + 1), e),
                })
            )}
            {partialStar}
            {[...Array(totalEmptyStar)].map((_, i) => {
                return (
                    React.cloneElement(Icon, {
                        key: i + fullStars + 1,
                        size,
                        className: cn(ratingVariants[variant].emptyStar),
                        onMouseMove: (e: any) => handleStarMouseMove((i + firstEmptyStar + 1), e),
                        onClick: (e: any) => handleStarClick((i + firstEmptyStar + 1), e),
                    })
                );
            }
            )}
        </div>
    );
});

interface PartialStarProps {
    fillPercentage: number
    size: number
    className?: string
    Icon: React.ReactElement
    onMouseMove: (e: any) => void
    onMouseLeave: () => void
    onClick: (e: any) => void
}
const PartialStar = ({ ...props }: PartialStarProps) => {
    const { fillPercentage, size, className, Icon, onMouseMove, onMouseLeave, onClick } = props

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {React.cloneElement(Icon, {
                size,
                className: cn("fill-transparent", className),
            })}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    overflow: "hidden",
                    width: `${fillPercentage * 100}%`,
                }}
            >
                {React.cloneElement(Icon, {
                    size,
                    className: cn("fill-current", className)
                })}
            </div>
        </div>
    )
}

Ratings.displayName = "Ratings";
export { Ratings };
