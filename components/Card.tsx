export default function Card({
  children,
  className = "",
  borderTopColor = "", // Nouvelle prop optionnelle
}: {
  children: React.ReactNode;
  className?: string;
  borderTopColor?: string;
}) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border p-6 ${borderTopColor} ${borderTopColor ? "border-t-4" : ""} ${className}`}>
      {children}
    </div>
  );
}