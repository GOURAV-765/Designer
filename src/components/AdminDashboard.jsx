import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isUsingPlaceholder } from '../supabaseClient';

const defaultProjects = [
  {
    id: "1",
    category: "video",
    type: "Videography & Motion Graphics",
    title: "Videography Siri (ABCDEV26)",
    image: "assets/thumbnail_siri.jpg",
    desc: "A creative videography showcase featuring custom sound-activated visual effects, clean voiceover editing, and high-energy motion graphic typography transitions designed in Adobe Premiere Pro and After Effects for modern social channels.",
    client: "ABCDEV26",
    date: "February 2026",
    tools: "Adobe Premiere Pro, After Effects, Photoshop"
  },
  {
    id: "2",
    category: "branding",
    type: "YouTube Branding & Strategy",
    title: "Beginner's Guide to Grow on YouTube",
    image: "assets/thumbnail_grow.jpg",
    desc: "Designed a high-conversion custom YouTube thumbnail emphasizing psychological triggers, balanced negative space, clean typography, and curated contrasting backdrops to maximize click-through rate (CTR) and visual retention.",
    client: "Creator Academy",
    date: "April 2026",
    tools: "Adobe Photoshop, Illustrator"
  },
  {
    id: "3",
    category: "video",
    type: "Thumbnail & Creative Design",
    title: "MrBeast Podcast with Modi Ji",
    image: "assets/thumbnail_mrbeast_modi.jpg",
    desc: "A viral-style high-concept thumbnail mock design featuring custom lighting, precise photo manipulation, background compositing, and bold stroke typography designed to capture attention instantly in a saturated feed.",
    client: "Media Concept",
    date: "May 2026",
    tools: "Adobe Photoshop, Lightroom"
  },
  {
    id: "4",
    category: "video",
    type: "Sound Design & Motion",
    title: "Sound Designing (MrBeast)",
    image: "assets/thumbnail_sound.jpg",
    desc: "A premium sound engineering layout and motion design project, showcasing visual sound wave synchronizations, multi-track audio transitions, sound fx overlay editing, and cinematic lighting setups for engaging video production.",
    client: "MrBeast Sound Lab",
    date: "March 2026",
    tools: "Adobe After Effects, Audition, Premiere Pro"
  }
];

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  // Form state
  const initialFormState = {
    title: '',
    category: 'branding',
    type: '',
    image: '',
    desc: '',
    client: '',
    date: '',
    tools: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (isUsingPlaceholder) {
        const localProjectsStr = localStorage.getItem('mock-projects');
        if (localProjectsStr) {
          const oldPlaceholders = [
            "Vesper Branding Identity",
            "Cybernetic Dimensions",
            "Typographic Echoes Poster",
            "Zenith Crypto Dashboard",
            "Aero Logistics Brand Kit",
            "Neon Geometry Stage Art"
          ];
          let localProjects = JSON.parse(localProjectsStr).filter(p => !oldPlaceholders.includes(p.title));
          const updated = [...localProjects];
          let changed = JSON.parse(localProjectsStr).length !== localProjects.length;
          
          defaultProjects.forEach(dp => {
            if (!localProjects.some(p => p.title === dp.title || p.id === dp.id || (p.id && p.id.toString() === dp.id.toString()))) {
              updated.push(dp);
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem('mock-projects', JSON.stringify(updated));
            setProjects(updated);
          } else {
            setProjects(localProjects);
          }
        } else {
          setProjects(defaultProjects);
          localStorage.setItem('mock-projects', JSON.stringify(defaultProjects));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isUsingPlaceholder) {
      localStorage.removeItem('mock-session');
      navigate('/admin/login', { replace: true });
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    navigate('/admin/login', { replace: true });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    if (isUsingPlaceholder) {
      // Local base64 file reader for offline testing
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err) {
      console.error('Error uploading image:', err.message);
      alert('Error uploading image. Please check that you created a public storage bucket named "project-images" in your Supabase Console, and that storage row-level security (RLS) policies allow uploads.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'branding',
      type: project.type || '',
      image: project.image || '',
      desc: project.desc || '',
      client: project.client || '',
      date: project.date || '',
      tools: project.tools || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    if (isUsingPlaceholder) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('mock-projects', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err.message);
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert('Title and Image are required.');
      return;
    }

    if (isUsingPlaceholder) {
      let updated;
      if (editingProject) {
        // Update locally
        const updatedProject = { ...editingProject, ...formData };
        updated = projects.map(p => (p.id === editingProject.id ? updatedProject : p));
      } else {
        // Create locally
        const newProject = {
          id: Math.random().toString(36).substring(2, 9),
          created_at: new Date().toISOString(),
          ...formData
        };
        updated = [newProject, ...projects];
      }
      setProjects(updated);
      localStorage.setItem('mock-projects', JSON.stringify(updated));
      setIsModalOpen(false);
      return;
    }

    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingProject.id)
          .select();

        if (error) throw error;
        setProjects(prev => prev.map(p => (p.id === editingProject.id ? data[0] : p)));
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([formData])
          .select();

        if (error) throw error;
        setProjects(prev => [data[0], ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving project:', err.message);
      alert('Error saving project: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#121826]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="font-heading text-xl font-bold tracking-widest text-white">
              DEV<span className="text-cyan-500">.</span>DESIGN
            </a>
            <span className="hidden rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 md:inline-block">
              Admin Portal
            </span>
            {isUsingPlaceholder && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                Offline Test Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-semibold text-gray-400 hover:text-white transition duration-200">
              <i className="fa-solid fa-globe mr-1.5"></i> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition duration-200"
            >
              <span>Logout</span>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="container mx-auto px-6 py-10">
        {isUsingPlaceholder && (
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-gray-300">
            <i className="fa-solid fa-triangle-exclamation mr-2 text-amber-400 animate-pulse"></i>
            You are in **Offline Test Mode**. You can add/edit/delete projects, and upload image files. They will be stored in your browser's **localStorage** and reflect immediately on your portfolio website home page! Link your production database later using the `.env` file.
          </div>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">Manage Projects</h1>
            <p className="mt-1 text-sm text-gray-400 font-body">Create, edit, or delete portfolio showcase cards</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 font-heading text-sm font-bold tracking-wide text-white shadow-lg shadow-cyan-500/10 transition duration-300 hover:opacity-90 active:scale-[0.98]"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Project</span>
          </button>
        </div>

        {/* Project List / Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              <p className="text-sm text-gray-400">Loading projects data...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#121826]/40 p-12 text-center">
            <i className="fa-solid fa-cubes mb-4 text-4xl text-gray-600"></i>
            <h3 className="font-heading text-lg font-semibold text-gray-300">No Projects Found</h3>
            <p className="mt-1 text-sm text-gray-500 font-body">Create your first showcase project using the button above.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121826]/60 p-4 shadow-xl transition-all duration-300 hover:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden rounded-xl bg-[#1b2336]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">No Image</div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-[#0b0f19]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{project.type}</span>
                    <h3 className="font-heading text-lg font-bold text-gray-200 line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-gray-400 font-body line-clamp-2 mt-1">{project.desc}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-500/10 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition duration-200"
                  >
                    <i className="fa-solid fa-pen"></i>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/10 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition duration-200"
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-white/5 bg-[#121826] p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 className="font-heading text-xl font-bold text-white mb-6">
              {editingProject ? 'Edit Showcase Project' : 'Add Showcase Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vesper Branding Identity"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  >
                    <option value="branding">Branding</option>
                    <option value="render-3d">3D Art</option>
                    <option value="print">Print & Posters</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="video">Video & Motion</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Project Type / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Branding & Logo"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vesper Labs"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Delivered Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2025"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                    Tools Used
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Figma, Illustrator, Photoshop"
                    value={formData.tools}
                    onChange={(e) => setFormData(prev => ({ ...prev, tools: e.target.value }))}
                    className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19]"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                  Project Cover Image *
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Image URL or upload file below"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19] mb-3"
                    />
                    <div className="relative flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#1b2336] py-3 text-center transition duration-200 hover:bg-[#121826]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {uploadingImage ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                            <span>Uploading file...</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-cloud-arrow-up text-cyan-400"></i>
                            <span>Click here to upload cover image</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full items-center justify-center rounded-xl bg-[#1b2336] p-2 border border-white/5">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-28 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-500">Image Preview</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                  Project Description
                </label>
                <textarea
                  placeholder="Explain details of design process..."
                  value={formData.desc}
                  onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                  rows="4"
                  className="rounded-xl border border-white/5 bg-[#1b2336] px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:bg-[#0b0f19] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/5 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-white/5 px-6 py-3 font-heading text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 font-heading text-sm font-bold tracking-wide text-white shadow-lg transition duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
