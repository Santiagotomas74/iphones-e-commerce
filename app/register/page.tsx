"use client";

import { useState } from "react";
import { User, Mail, Lock, UserPlus, Phone } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      // Redirigir después de registro
      window.location.href = "/login";

    } catch (err) {
      console.error(err);
      setError("Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 tracking-wide">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 ">Crear Cuenta</h1>
          <p className="text-gray-500 mt-1">Únete a la experiencia Premium</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre */}
            <div>
              <label className="text-sm text-gray-900">Nombre completo</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-900">Correo electró</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-900">Teléfono móvil</label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
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
  <label className="text-sm text-gray-900">Contraseña</label>

  <div className="mt-1 relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
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
              <label className="text-sm text-gray-900">Confirmar contraseña</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                "Creando cuenta..."
              ) : (
                <>
                  <UserPlus size={18} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
