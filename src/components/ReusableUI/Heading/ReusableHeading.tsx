import { cn } from "@/lib/utils"

interface ConfigProp {
    config: {
        heading: string,
        className: string
    }
}

export default function ReusableHeading({ config }: ConfigProp) {
    return (
        <h1 className={cn(config.className)}>
            {config.heading}
        </h1 >
    )
}