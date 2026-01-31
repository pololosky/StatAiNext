import { Eye, Pencil, TrendingDown, TrendingUp } from "lucide-react";

type Student = {
    initials: string;
    name: string;
    className: string;
    average: number;
    trend: "up" | "down" | "stable";
    updateAt: string;
    alerts: number;
};


const students= [
    {
        initials: "MD",
        name: "Marie Dupont",
        class: "Terminale S",
        average: 15.5,
        trend: "up",
        updateAt: "10/12/2024",
        alerts:0,
    },

    {
        initials: "TM",
        name: "Thomas",
        class: "Terminale S",
        average: 13.2,
        trend: "down",
        updateAt: "09/12/2024",
        alerts:1,
    },

    {
        initials: "SB",
        name: "Sophie Bernard",
        class: "Première L",
        average: 16.8,
        trend: "up",
        updateAt: "10/12/2024",
        alerts: 0,
    },

    {
        initials: "LD",
        name: "Lucas Dubois",
        class: "Terminale ES",
        average: 12.1,
        trend: "down",
        updateAt: "08/12/2024",
        alerts: 2,
    },

    {
        initials: "ER",
        name: "Emma Rousseau",
        class: "Première S",
        average: 14.9,
        trend: "Stable",
        updateAt: "10/12/2024",
        alerts: 0,
    }
    
];

export default function StudentTable(){
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                    <tr className="text-gray-600 text-sm">
                        <th className="text-gray-600 px-4 py-6">Nom</th>
                        <th>Classe</th>
                        <th>Moyenne</th>
                        <th>Tendance</th>
                        <th>Dernière</th>
                        <th>Alertes</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        students.map((s,index)=>(
                            <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                                {/*Nom*/}
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">{s.initials}</div>
                                    <span className="font-medium">{s.name}</span>
                                </td>

                                {/*class*/}
                                <td>{s.class}</td>

                                {/*moyenne*/}
                                <td className={'font-semibold ${s.average >=14 ? "text-blue-600"}'}> {s.average} / 20</td>

                                {/*Tendance*/}
                                <td className="flex items-center gap-1">
                                    {s.trend=="up" && (
                                        <>
                                            <TrendingUp size={16} className="text-green-600"/>
                                            <span className="text-green-600">Hausse</span> 
                                        </>
                                    )}
                                    {s.trend== "down" &&(
                                        <>  
                                            <TrendingUp size={16} className="text-green-600"/>
                                            <span className="text-green-600">Baisse</span> 
                                        </>
                                    )}
                                    {s.trend== "stable" && (
                                        <span className="text-gray-500">Stable</span>
                                    )}
                                </td>

                                {/*Dernière MAJ*/}
                                <td>{s.updateAt}</td>

                                {/*Alertes*/}
                                <td>
                                    {s.alerts > 0 ?(
                                        <span className="bg-orange-100 text-orange-600 px-3 px-1 rounded-full text-sm">{s.alerts}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>

                                {/*Action*/}
                                <td className="flex gap-3 text-blue-600">
                                    <Eye className="cursor-pointer hover:text-blue-800"/>
                                    <Pencil className="cursor-pointer hover:text-blue-800"/>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>

            </table>

        </div>
    );
}