import { GraduationCap } from "lucide-react";

export default function Headere() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2 text-blue-600 font-semiold text-lg">
                <GraduationCap />
                StatAi 
            </div>

            <div className="flex items-center gap-3">
                <span className="text-gray-600">Lycée Victor Hugo</span>
                <div className="w-9  h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    LV
                </div>
            </div>
        </header>
    )
}

