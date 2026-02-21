export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0f1c2e] to-[#0a1524] text-gray-300 tracking-wide">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
        
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Columna 1 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              TechStore
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
            Hola soy el footer piola
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-white font-medium mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">iPhone</a></li>
              <li><a href="#" className="hover:text-white transition">Accesorios</a></li>
              <li><a href="#" className="hover:text-white transition">Ofertas</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-white font-medium mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition">Envíos</a></li>
              <li><a href="#" className="hover:text-white transition">Help</a></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition">Términos</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500 tracking-wide">
          © 2026 Premium. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}
