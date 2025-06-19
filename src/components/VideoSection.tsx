import { Play, Clock, Eye } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useState } from "react";

const VideoSection = () => {
  const videoCategories = [
    {
      title: "Fundamentos",
      videos: [
        {
          id: 1,
          title: "Introducción a las Redes de Computadoras",
          duration: "12:45",
          views: "1.2k",
          thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=O5SdCCTbNgs"
        },
        {
          id: 2,
          title: "Modelo OSI Explicado",
          duration: "18:30",
          views: "980",
          thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=ODY4q4_3Acc"
        }
      ]
    },
    {
      title: "Protocolos",
      videos: [
        {
          id: 3,
          title: "TCP/IP en Profundidad",
          duration: "25:12",
          views: "856",
          thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=2E2CQ-ns6rk"
        },
        {
          id: 4,
          title: "Configuración de DNS",
          duration: "15:22",
          views: "743",
          thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=OnVwvdg3_ak"
        }
      ]
    },
    {
      title: "Seguridad",
      videos: [
        {
          id: 5,
          title: "Configuración de Firewalls",
          duration: "20:15",
          views: "692",
          thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=DomvYqJRQvM"
        },
        {
          id: 6,
          title: "VPN y Túneles Seguros",
          duration: "22:08",
          views: "567",
          thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop&crop=center",
          url: "https://www.youtube.com/watch?v=SPVB0x210bU"
        }
      ]
    }
  ];

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Videos Educativos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprende con videos explicativos detallados organizados por categorías 
            para facilitar tu proceso de aprendizaje.
          </p>
        </div>

        <div className="space-y-12">
          {videoCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                {category.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {category.videos.map((video) => (
                  <Dialog key={video.id}>
                    <div
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <Play className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{video.views} visualizaciones</span>
                        </div>
                        <DialogTrigger asChild>
                          <button
                            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 w-full"
                          >
                            Ver video
                          </button>
                        </DialogTrigger>
                      </div>
                    </div>
                    <DialogContent className="max-w-2xl w-full aspect-video flex items-center justify-center">
                      <iframe
                        width="100%"
                        height="400"
                        src={video.url.replace("watch?v=", "embed/")}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105">
            Ver Todos los Videos
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
