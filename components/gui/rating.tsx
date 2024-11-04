import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Rect = { left: number; width: number; };
type InputEvent = { currentTarget: { getBoundingClientRect: () => Rect; }; clientX: number; } | null;

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

// export interface RatingsProps extends React.InputHTMLAttributes<HTMLInputElement> {
//     totalStars?: number;
//     size?: number;
//     fill?: boolean;
//     Icon?: React.ReactElement;
//     variant?: keyof typeof ratingVariants;
//     changeOnMove?: boolean;
// }
type RatingsProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    value: number | undefined;
    onChange: React.Dispatch<React.SetStateAction<number>>;
    totalStars?: number;
    size?: number;
    fill?: boolean;
    Icon?: React.ReactElement;
    variant?: keyof typeof ratingVariants;
    changeOnMove?: boolean;
};

const Ratings = React.forwardRef<HTMLInputElement, RatingsProps>(({
    totalStars = 5,
    size = 20,
    fill = true,
    Icon = <Star />,
    variant = "default",
    changeOnMove = false,
    value,
    onChange,
    ...props
}, ref) => {
    const originalRating = value ?? 0;
    const [rating, setRating] = React.useState(originalRating);

    // React.useEffect(() => {
    //     if (changeOnMove) if (rating !== value) onChange?.(rating);
    // }, [rating, changeOnMove, value, onChange]);

    const emitOnChangeEvent = React.useCallback((newRating: number) => {
        if (newRating === value) return;
        onChange?.(newRating);

    }, [onChange, value],);

    const calculateRating = (selectedRating: number, e: InputEvent): number => {
        if (e === null) return selectedRating;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;

        if (percentage > 0.5) return selectedRating;
        else if (percentage > 0.1) return (selectedRating - 1) + 0.5;
        else return (selectedRating - 1);
    }

    const handleStarClick = (selectedRating: number, e: InputEvent) => {
        const newRating = calculateRating(selectedRating, e);
        emitOnChangeEvent(newRating);
        if (newRating !== rating) setRating(newRating);
    };

    const handleStarMouseMove = (selectedRating: number, e: InputEvent) => {
        const newRating = calculateRating(selectedRating, e);
        if (newRating !== rating) setRating(newRating);
    }

    const showedRating = changeOnMove ? rating : originalRating;
    const fullStars = Math.floor(showedRating)
    const partialStar =
        showedRating % 1 > 0 ? (
            <PartialStar
                fillPercentage={showedRating % 1}
                fillSpirit={rating > showedRating}
                size={size}
                className={cn(ratingVariants[variant].star)}
                classNameSpirit={cn(ratingVariants[variant].emptyStar)}
                Icon={Icon}
                onMouseMove={(e: InputEvent) => handleStarMouseMove((fullStars + 1), e)}
                onMouseLeave={() => setRating(originalRating)}
                onClick={(e: InputEvent) => handleStarClick((fullStars + 1), e)}
            />
        ) : null;

    const firstSpiritStar = (fullStars + (partialStar ? 1 : 0));
    const totalSpiritStar = Math.max(0, Math.floor(rating) - firstSpiritStar);

    const partialSpiritStar =
        ((rating > showedRating) && (rating % 1 > 0)) ? (
            <PartialStar
                fillPercentage={rating % 1}
                fillSpirit={false}
                size={size}
                className={cn(ratingVariants[variant].emptyStar)}
                Icon={Icon}
                onMouseMove={(e: InputEvent) => handleStarMouseMove((firstSpiritStar + totalSpiritStar + 1), e)}
                onMouseLeave={() => setRating(originalRating)}
                onClick={(e: InputEvent) => handleStarClick((firstSpiritStar + totalSpiritStar + 1), e)}
            />
        ) : null;

    const firstEmptyStar = (firstSpiritStar + (partialSpiritStar ? 1 : 0) + totalSpiritStar);
    const totalEmptyStar = (totalStars - firstEmptyStar);

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
                    onMouseMove: (e: InputEvent) => handleStarMouseMove((i + 1), e),
                    onClick: (e: InputEvent) => handleStarClick((i + 1), e),
                })
            )}
            {partialStar}
            {[...Array(totalSpiritStar)].map((_, i) => {
                return (
                    React.cloneElement(Icon, {
                        key: i + fullStars + 1,
                        size,
                        className: cn("fill-current", ratingVariants[variant].emptyStar),
                        onMouseMove: (e: InputEvent) => handleStarMouseMove((i + firstSpiritStar + 1), e),
                        onClick: (e: InputEvent) => handleStarClick((i + firstSpiritStar + 1), e),
                    })
                );
            }
            )}
            {partialSpiritStar}
            {[...Array(totalEmptyStar)].map((_, i) => {
                return (
                    React.cloneElement(Icon, {
                        key: i + fullStars + totalSpiritStar + 1,
                        size,
                        className: cn(ratingVariants[variant].emptyStar),
                        onMouseMove: (e: InputEvent) => handleStarMouseMove((i + firstEmptyStar + 1), e),
                        onClick: (e: InputEvent) => handleStarClick((i + firstEmptyStar + 1), e),
                    })
                );
            }
            )}
        </div>
    );
});

interface PartialStarProps {
    fillPercentage: number
    fillSpirit: boolean
    size: number
    className?: string
    classNameSpirit?: string
    Icon: React.ReactElement
    onMouseMove: (e: InputEvent) => void
    onMouseLeave: () => void
    onClick: (e: InputEvent) => void
}
const PartialStar = ({ ...props }: PartialStarProps) => {
    const { fillPercentage, fillSpirit, size, className, classNameSpirit, Icon, onMouseMove, onMouseLeave, onClick } = props

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {React.cloneElement(Icon, {
                size,
                className: fillSpirit ? cn("fill-current", classNameSpirit) : cn("fill-transparent", className),
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
