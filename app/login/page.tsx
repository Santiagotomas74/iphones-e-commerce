"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Credenciales inválidas");
      return;
    }

    // Login exitoso
    // Si usás cookie httpOnly no necesitás guardar nada en localStorage
    // Solo redirigimos al home
    window.location.href = "/";
  } catch (err) {
    console.error(err);
    alert("Error al iniciar sesión");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold">Iniciar Sesión</h1>
          <p className="text-gray-500 mt-1">Accede a tu cuenta Premium</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Correo electrónico</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Contraseña</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                "Ingresando..."
              ) : (
                <>
                  <ArrowRight size={18} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-400">O continúa con</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="border rounded-xl py-2 hover:bg-gray-50 transition">
              Google
            </button>
            <button className="border rounded-xl py-2 hover:bg-gray-50 transition">
              Apple
            </button>
          </div>
            
             
          <p className="text-center text-sm text-gray-500 mt-6">

            ¿No tienes cuenta? <span className="text-blue-600 cursor-pointer">
                 <Link href="/register">
                Regístrate
                </Link>
                </span>
          </p>
        </div>
      </div>
    </div>
  );
}
