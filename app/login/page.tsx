"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Smartphone, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setLoading(false);

      await Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text:  "El email o la contraseña no son válidos.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Intentar nuevamente",
      });

      return;
    }

    if (data.role === "admin") {
      Swal.fire({
        icon: "success",
        title: "Bienvenido administrador",
        text: "Accediendo al panel de administración.",
        confirmButtonText: "Ir al panel",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        window.location.href = "/admin";
      });

    } else {
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido nuevamente.",
        confirmButtonText: "Ir a la tienda",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        window.location.href = "/";
      });
    }

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error del servidor",
      text: "No pudimos iniciar sesión. Intenta nuevamente.",
      confirmButtonColor: "#ef4444",
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden tracking-tight">
      
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen flex flex-col justify-center p-8 md:p-20 text-white overflow-hidden">
       <div 
  className="absolute inset-0 bg-cover bg-center blur-md animate-world" 
  style={{ 
    backgroundImage: "url('https://wallpapers.com/images/featured-full/fondods-de-iphone-x-cl6oxggnjvcvt89q.jpg')", 
  }}
/>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            {/* <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"> // si pinta lo usamos !!
              <Smartphone size={32} className="text-white" />
            </div> */}
            <span className="font-black text-2xl tracking-[0.2em] uppercase">TechStore</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">
              DESCUBRE <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-indigo-900">
                EL FUTURO.
              </span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-sm leading-relaxed">
              Inicia sesión para acceder a nuestra selección exclusiva de tecnología Apple.
            </p>
          </div>
        </div>
      </div>

   
      <div className="w-full md:w-1/2 min-h-[60vh] md:h-screen bg-white flex flex-col justify-center items-center p-8 md:p-24 relative">
        
        <div className="w-full max-w-md space-y-12">
          
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-black text-gray-900 mb-2 italic uppercase">SIGN IN</h3>  {/* si le dejo ingresar queda re para el culo  */}
            <p className="text-gray-400 font-medium">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="usuario@premium.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none transition-all text-gray-700 font-medium"
                  required
                />
              </div>
            </div>

        <div className="space-y-2">
  <div className="flex justify-between items-center px-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      Password
    </label>
  </div>

  <div className="relative group">
    <Lock
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
      size={20}
    />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none transition-all text-gray-700 font-medium"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 mt-6 bg-black text-white rounded-[2rem] font-black shadow-2xl shadow-gray-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs group"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  INGRESAR
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm font-medium">
              ¿No tenes cuenta? <br />
              <Link href="/register" className="text-black font-black hover:text-blue-600 transition-colors border-b-2 border-black/10 hover:border-blue-600">
                CREA UNA CUENTA AHORA
              </Link>
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[100px] -z-10 opacity-50" />
      </div>
    </div>
  );
}