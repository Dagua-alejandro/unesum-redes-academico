
import { Network, Users, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Aprende{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Redes
              </span>{" "}
              de Computadoras
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Domina los fundamentos de las redes de computadoras, protocolos de comunicación 
              y tecnologías de conectividad con recursos interactivos y contenido actualizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105">
                Comenzar Aprendizaje
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200">
                Ver Videos
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600">Temas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Acceso</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Network className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Topologías</h3>
                  <p className="text-sm text-gray-600">Aprende sobre diferentes configuraciones de red</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Users className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Protocolos</h3>
                  <p className="text-sm text-gray-600">Domina TCP/IP, HTTP, DNS y más</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Teoría</h3>
                  <p className="text-sm text-gray-600">Conceptos fundamentales explicados</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Award className="h-12 w-12 text-orange-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Práctica</h3>
                  <p className="text-sm text-gray-600">Ejercicios y casos reales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
