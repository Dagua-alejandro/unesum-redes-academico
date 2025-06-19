
import { useState, useEffect } from "react";
import { BookOpen, Network, Shield, Database, Wifi, Globe }  from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const ContentSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Network,
      Globe,
      Database,
      Shield,
      Wifi,
      BookOpen
    };
    return icons[iconName] || BookOpen;
  };

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
          {categories.map((category) => {
            const IconComponent = getIcon(category.icon);
            return (
              <div
                key={category.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Disponible
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
