import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  Play, 
  Settings 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { getProfileById, updateProfile } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/types';
import { useNavigate } from "react-router-dom";
import { uploadFileToStorage, createVideo } from '@/integrations/supabase/client';
import type { Video } from '@/integrations/supabase/types';

interface Course {
  id: string;
  title: string;
  description: string;
  category_id: string;
  is_published: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category_id: "",
  });
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    is_published: false,
  });
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Reemplaza esta URL por la de tu función Edge Function desplegada en Supabase
  const EDGE_FUNCTION_URL = 'https://<TU-PROYECTO>.functions.supabase.co/delete-user';

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchCategories();
      fetchProfiles();
      fetchMyProfile();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    } else {
      setCourses(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProfiles(data || []);
    setLoadingProfiles(false);
  };

  const fetchMyProfile = async () => {
    setLoadingProfile(true);
    if (user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error) setMyProfile(data as Profile);
    }
    setLoadingProfile(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseForm)
          .eq("id", editingCourse.id);

        if (error) throw error;

        toast({
          title: "¡Éxito!",
          description: "Curso actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from("courses")
          .insert([{ ...courseForm, instructor_id: user?.id }]);

        if (error) throw error;

        toast({
          title: "¡Éxito!",
          description: "Curso creado correctamente",
        });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      setCourseForm({ title: "", description: "", category_id: "" });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (course: Course) => {
    const { error } = await supabase
      .from("courses")
      .update({ is_published: !course.is_published })
      .eq("id", course.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el curso",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: `Curso ${!course.is_published ? "publicado" : "despublicado"}`,
      });
      fetchCourses();
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el curso",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: "Curso eliminado correctamente",
      });
      fetchCourses();
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category_id: course.category_id,
    });
    setIsDialogOpen(true);
  };

  const handleChangeRole = async (id: string, newRole: 'admin' | 'student' | 'instructor') => {
    const updated = await updateProfile(id, { role: newRole });
    if (updated) {
      toast({ title: 'Rol actualizado', description: 'El rol del usuario ha sido actualizado.' });
      fetchProfiles();
    } else {
      toast({ title: 'Error', description: 'No se pudo actualizar el rol.', variant: 'destructive' });
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este perfil? Esto solo elimina el perfil, no la cuenta de autenticación.')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Perfil eliminado', description: 'El perfil ha sido eliminado.' });
      fetchProfiles();
    } else {
      toast({ title: 'Error', description: 'No se pudo eliminar el perfil.', variant: 'destructive' });
    }
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;
    if (type === 'file' && files) {
      if (name === 'videoFile') {
        setVideoForm((prev) => ({ ...prev, videoFile: files[0] }));
        setVideoPreviewUrl(URL.createObjectURL(files[0]));
      } else if (name === 'thumbnailFile') {
        setVideoForm((prev) => ({ ...prev, thumbnailFile: files[0] }));
        setThumbnailPreviewUrl(URL.createObjectURL(files[0]));
      }
    } else {
      setVideoForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoFile) {
      toast({ title: 'Error', description: 'El título y el archivo de video son obligatorios.', variant: 'destructive' });
      return;
    }
    setUploadingVideo(true);
    try {
      // Subir video
      const videoPath = `${Date.now()}_${videoForm.videoFile.name}`;
      const videoData = await uploadFileToStorage('videos', videoPath, videoForm.videoFile);
      const videoUrl = `${supabase.storage.from('videos').getPublicUrl(videoPath).data.publicUrl}`;
      // Subir miniatura si existe
      let thumbnailUrl = '';
      if (videoForm.thumbnailFile) {
        const thumbPath = `thumbnails/${Date.now()}_${videoForm.thumbnailFile.name}`;
        await uploadFileToStorage('videos', thumbPath, videoForm.thumbnailFile);
        thumbnailUrl = `${supabase.storage.from('videos').getPublicUrl(thumbPath).data.publicUrl}`;
      }
      // Guardar en la tabla videos
      const newVideo = await createVideo({
        title: videoForm.title,
        description: videoForm.description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        is_published: videoForm.is_published,
      });
      if (newVideo) {
        toast({ title: '¡Éxito!', description: 'Video subido correctamente.' });
        setVideoForm({ title: '', description: '', videoFile: null, thumbnailFile: null, is_published: false });
        setVideoPreviewUrl(null);
        setThumbnailPreviewUrl(null);
      } else {
        toast({ title: 'Error', description: 'No se pudo guardar el video.', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    setUploadingVideo(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona cursos, lecciones y contenido de la plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.is_published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => !c.is_published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Cursos</h2>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ title: "", description: "", category_id: "" });
                }}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Curso
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del Curso</Label>
                  <Input
                    id="title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={courseForm.category_id}
                    onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCourse ? "Actualizar" : "Crear"} Curso
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => togglePublished(course)}
                      >
                        {course.is_published ? 'Despublicar' : 'Publicar'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de gestión de usuarios/perfiles solo para administradores */}
        {!loadingProfile && myProfile?.role === 'admin' && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users className="w-6 h-6" /> Gestión de usuarios</h2>
            {loadingProfiles ? (
              <div>Cargando usuarios...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Email/ID</th>
                      <th className="px-4 py-2">Rol</th>
                      <th className="px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-t">
                        <td className="px-4 py-2">{profile.full_name || 'Sin nombre'}</td>
                        <td className="px-4 py-2 text-xs">{profile.id}</td>
                        <td className="px-4 py-2 capitalize">{profile.role}</td>
                        <td className="px-4 py-2">
                          <select
                            value={profile.role || 'student'}
                            onChange={e => handleChangeRole(profile.id, e.target.value as any)}
                            className="border rounded px-2 py-1 mr-2"
                          >
                            <option value="admin">Administrador</option>
                            <option value="student">Alumno</option>
                            <option value="instructor">Instructor</option>
                          </select>
                          <button
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDeleteProfile(profile.id)}
                            title="Eliminar perfil"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sección de gestión de videos educativos solo para administradores */}
        {!loadingProfile && myProfile?.role === 'admin' && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Play className="w-6 h-6" /> Gestión de videos educativos</h2>
            <form onSubmit={handleVideoSubmit} className="bg-white rounded shadow p-6 mb-8 max-w-2xl">
              <div className="mb-4">
                <Label>Título</Label>
                <Input name="title" value={videoForm.title} onChange={handleVideoInputChange} required />
              </div>
              <div className="mb-4">
                <Label>Descripción</Label>
                <Input name="description" value={videoForm.description} onChange={handleVideoInputChange} />
              </div>
              <div className="mb-4">
                <Label>Archivo de video</Label>
                <Input name="videoFile" type="file" accept="video/*" onChange={handleVideoInputChange} required />
                {videoPreviewUrl && (
                  <video src={videoPreviewUrl} controls className="mt-2 max-w-xs" />
                )}
              </div>
              <div className="mb-4">
                <Label>Miniatura (opcional)</Label>
                <Input name="thumbnailFile" type="file" accept="image/*" onChange={handleVideoInputChange} />
                {thumbnailPreviewUrl && (
                  <img src={thumbnailPreviewUrl} alt="Miniatura" className="mt-2 max-w-xs rounded" />
                )}
              </div>
              <div className="mb-4 flex items-center gap-2">
                <Label>¿Publicar?</Label>
                <input type="checkbox" name="is_published" checked={videoForm.is_published} onChange={e => setVideoForm(f => ({ ...f, is_published: e.target.checked }))} />
              </div>
              <Button type="submit" disabled={uploadingVideo}>{uploadingVideo ? 'Subiendo...' : 'Guardar video'}</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
