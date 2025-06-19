
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Network, BookOpen, Play, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UNESUM TI</h1>
              <p className="text-xs text-gray-600">Redes y Comunicaciones</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>Contenido</span>
            </a>
            <a href="#videos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>Videos</span>
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Acceder</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
                Contenido
              </a>
              <a href="#videos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
                Videos
              </a>
              
              {user ? (
                <>
                  <Link 
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                  >
                    Administración
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transition-all duration-200 mt-2 w-full">
                    Acceder
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
