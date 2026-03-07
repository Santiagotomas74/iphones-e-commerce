"use client";

import { useState } from "react";
import { User, Mail, Lock, UserPlus, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (name.trim().length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Correo electrónico inválido";
    }

    if (!passwordRules.length || !passwordRules.uppercase || !passwordRules.number) {
      return "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número";
    }

    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    return null;
  };

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          lastName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar usuario");
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden tracking-tight">

      {/* PANEL VISUAL IZQUIERDO */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen flex flex-col justify-center p-8 md:p-20 text-white overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center blur-md animate-world"
          style={{
            backgroundImage:
              "url('https://wallpapers.com/images/featured-full/fondods-de-iphone-x-cl6oxggnjvcvt89q.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div className="relative z-10 space-y-6">
          <span className="font-black text-2xl tracking-[0.2em] uppercase">
            TechStore
          </span>

          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">
              CREA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-indigo-900">
                TU CUENTA.
              </span>
            </h2>

            <p className="text-white/60 text-lg md:text-xl font-medium max-w-sm leading-relaxed">
              Registrate y accede a nuestra experiencia exclusiva de tecnología Apple.
            </p>
          </div>
        </div>
      </div>

      {/* FORMULARIO DERECHO (TU FORM ORIGINAL) */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:h-screen flex items-center justify-center bg-gray-50 p-4">

        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black text-gray-900 mb-2 italic uppercase">Crear Cuenta</h1>
            <p className="text-gray-400 font-medium">Únete a la experiencia Premium</p>
          </div>

          <div className=" p-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nombre */}
            <div className="grid grid-cols-2 gap-3">

             {/* Nombre */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Nombre
              </label>

              <div className="relative group">
      <          User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Juan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

           {/* Apellido */}
               <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                   Apellido
                 </label>

                 <div className="relative group">
                   <User
                     className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                     size={18}
                   />

                   <input
                     type="text"
        placeholder="Pérez"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                     required
                   />
                 </div>
               </div>

             </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder=" email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono móvil</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    type="tel"
                    placeholder="+54 9 11 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>

                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
                </div>

                <div className="text-xs mt-2 space-y-1">
                  <p className={passwordRules.length ? "text-green-600" : "text-gray-400"}>
                    • Mínimo 8 caracteres
                  </p>
                  <p className={passwordRules.uppercase ? "text-green-600" : "text-gray-400"}>
                    • Al menos una letra mayúscula
                  </p>
                  <p className={passwordRules.number ? "text-green-600" : "text-gray-400"}>
                    • Al menos un número
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                     type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                 >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-6 bg-black text-white rounded-[2rem] font-black shadow-2xl shadow-gray-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs group"
              >
                {loading ? (
                  "Creando cuenta..."
                ) : (
                  <>
                    <UserPlus size={18} />
                    Crear Cuenta
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                  
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}