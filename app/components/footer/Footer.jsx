import { Facebook, Instagram, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0f1c2e] to-[#0a1524] text-gray-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Columna 1 */}
          <div className="text-center sm:text-left">
            <h3 className="text-white text-lg font-semibold mb-4">
              TechStore
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Tecnología premium al mejor precio.
            </p>

            <div className="flex justify-center sm:justify-start gap-4">
              
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <Instagram size={18} />
              </a>

              <a
                href="mailto:contacto@techstore.com"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <Mail size={18} />
              </a>

            </div>
          </div>

          {/* Columna 2 */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-medium mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">iPhone</a></li>
              <li><a href="#" className="hover:text-white transition">Accesorios</a></li>
              <li><a href="#" className="hover:text-white transition">Ofertas</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-medium mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition">Envíos</a></li>
              <li><a href="#" className="hover:text-white transition">Help</a></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition">Términos</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>

        </div>

       
        <div className="border-t border-gray-700 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
            <span className="text-center">
              Proyecto desarrollado por
            </span>
            <div className="flex items-center gap-4">   
              <span className="font-medium text-white">Santiago Taher</span>
              <a
                href="https://www.linkedin.com/in/santiago-taher-239008317/"
                target="_blank"
                className="hover:text-white transition"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:santiago_lucas1@hotmail.com"
                className="hover:text-white transition"
              >
                <Mail size={18} />
              </a>
            </div>
            <div className="flex items-center gap-4">             
              <span className="font-medium text-white">Maxi Anguita</span>
             <a
              href="https://www.linkedin.com/in/maximo-anguita-944774256/"
              target="_blank"
              rel="noopener noreferrer"
               className="hover:text-white transition"
             >
              <Linkedin size={18} />
              </a>
              <a
                href="mailto:maximoanguita@gmail.com"
                className="hover:text-white transition"
              >
                <Mail size={18} />
              </a>
           </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          © 2026 TechStore. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}