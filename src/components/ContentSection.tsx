
import { BookOpen, Network, Shield, Database, Wifi, Globe } from "lucide-react";

const ContentSection = () => {
  const topics = [
    {
      id: 1,
      title: "Fundamentos de Redes",
      description: "Conceptos básicos, modelo OSI y TCP/IP",
      icon: Network,
      color: "from-blue-500 to-blue-600",
      lessons: 8
    },
    {
      id: 2,
      title: "Topologías de Red",
      description: "Estrella, anillo, bus y topologías híbridas",
      icon: Globe,
      color: "from-green-500 to-green-600",
      lessons: 6
    },
    {
      id: 3,
      title: "Protocolos de Comunicación",
      description: "HTTP, FTP, SMTP, DNS y protocolos de enrutamiento",
      icon: Database,
      color: "from-purple-500 to-purple-600",
      lessons: 10
    },
    {
      id: 4,
      title: "Seguridad en Redes",
      description: "Firewalls, VPN, cifrado y mejores prácticas",
      icon: Shield,
      color: "from-red-500 to-red-600",
      lessons: 7
    },
    {
      id: 5,
      title: "Redes Inalámbricas",
      description: "WiFi, Bluetooth, configuración y optimización",
      icon: Wifi,
      color: "from-yellow-500 to-orange-600",
      lessons: 5
    },
    {
      id: 6,
      title: "Administración de Redes",
      description: "Monitoreo, troubleshooting y mantenimiento",
      icon: BookOpen,
      color: "from-indigo-500 to-indigo-600",
      lessons: 9
    }
  ];

  return (
    <section id="inicio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contenido del Curso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora todos los temas esenciales de redes de computadoras organizados 
            de manera progresiva para tu aprendizaje óptimo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <div
                key={topic.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${topic.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {topic.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.lessons} lecciones
                    </span>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      Ver contenido →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
