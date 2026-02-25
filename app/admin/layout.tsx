import { LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans tracking-wide">
      {/* Header Minimalista */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          {/* Icono sutil en color índigo/azul */}
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-sm font-semibold tracking-tight text-gray-800 uppercase">
            Admin <span className="text-gray-400 font-normal">/ Dashboard</span>
          </h1>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}