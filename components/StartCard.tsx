import { ReactNode} from "react";

interface StartCardProps{
    title: string;
    value: string;
    subtitle?: string;
    icon: ReactNode;
}

export default function StartCard({
    title,
    value,
    subtitle,
    icon,
}: StartCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold text-blue-600">{value}</p>
                {subtitle && (
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                )}
            </div>
            <div className="text-blue-600">{icon}</div>

        </div>
    )
}