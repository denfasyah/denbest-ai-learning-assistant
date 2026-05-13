import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pin,
  Trash2,
  Pencil,
  Clock3,
  NotebookPen,

  Sparkles,
  MoreHorizontal,
  X,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import Pagination from "../../features/learning/components/Pagination";

const NotesPage = () => {
  // const { user } = useAuth();

  const [search, setSearch] = useState("");
  // const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("newest");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const NOTES_PER_PAGE = 6;

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Supervised Learning",
      content:
        "Supervised learning adalah metode machine learning dimana model belajar menggunakan data yang memiliki label.",
      tag: "Machine Learning",
      pinned: true,
      updatedAt: "2 min ago",
    },
    {
      id: 2,
      title: "JWT Authentication",
      content:
        "JWT digunakan untuk proses authentication dan authorization berbasis token.",
      tag: "Backend",
      pinned: false,
      updatedAt: "1 hour ago",
    },
    {
      id: 3,
      title: "Database Normalization",
      content:
        "3NF bertujuan untuk mengurangi redundancy data pada database relational.",
      tag: "Database",
      pinned: false,
      updatedAt: "Yesterday",
    },
    {
      id: 4,
      title: "React Context",
      content:
        "React Context digunakan untuk state management global sederhana.",
      tag: "Frontend",
      pinned: false,
      updatedAt: "Yesterday",
    },
    {
      id: 5,
      title: "Tailwind Utility",
      content:
        "Tailwind CSS mempermudah styling dengan utility-first approach.",
      tag: "UI Design",
      pinned: true,
      updatedAt: "2 days ago",
    },
    {
      id: 6,
      title: "REST API",
      content:
        "REST API memungkinkan komunikasi client dan server menggunakan HTTP.",
      tag: "Backend",
      pinned: false,
      updatedAt: "3 days ago",
    },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tag: "",
  });

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()) ||
        note.tag.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (filter === "newest") {
        return b.id - a.id;
      }

      return a.id - b.id;
    });

    return filtered;
  }, [notes, search, filter]);

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  const handleTogglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
    setOpenMenuId(null);
  };

  const handleDeleteNote = (id) => {
    if (!window.confirm("Yakin ingin menghapus note ini?")) return;
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setOpenMenuId(null);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content || !newNote.tag) return;
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      tag: newNote.tag,
      pinned: false,
      updatedAt: "Just now",
    };
    setNotes((prev) => [note, ...prev]);
    setNewNote({ title: "", content: "", tag: "" });
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = () => {
    setNotes((prev) =>
      prev.map((note) => (note.id === editNote.id ? editNote : note))
    );
    setEditNote(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
              <NotebookPen className="h-8 w-8 text-white" />
            </div>
            <div>
              <Badge variant="indigo" className="mb-3">Personal Library</Badge>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Smart Learning Notes
              </h1>
              <p className="mt-4 leading-relaxed text-slate-400 font-medium max-w-2xl">
                Store learning insights, AI summaries, and important milestones in your centralized study hub.
              </p>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-2xl h-14 px-8 font-black italic tracking-tight"
          >
            NEW ARCHIVE
          </Button>
        </div>
      </Card>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-md">
            <Input
              placeholder="Search through your archives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="w-full lg:w-48">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* GRID */}
      {paginatedNotes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-white/10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/5 text-indigo-500/50 mb-6">
            <Sparkles className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-white">No Archives Found</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Your knowledge base is currently empty.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedNotes.map((note) => (
            <Card
              key={note.id}
              hover
              onClick={() => setSelectedNote(note)}
              className="group relative flex flex-col p-7 border-white/3 overflow-visible"
            >
              <div className="absolute top-6 right-6 flex items-center gap-2">
                {note.pinned && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Pin className="h-4 w-4 fill-amber-500" />
                  </div>
                )}
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === note.id ? null : note.id);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenuId === note.id && (
                    <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120] shadow-2xl animate-in fade-in zoom-in duration-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditNote(note); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> EDIT NOTE
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePin(note.id); }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <Pin className="h-3.5 w-3.5" /> {note.pinned ? "UNPIN" : "PIN TO TOP"}
                      </button>
                      <div className="h-px bg-white/5 mx-2" />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> DELETE ARCHIVE
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <Badge variant="indigo">{note.tag}</Badge>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">
                {note.title}
              </h2>

              <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3 mb-8">
                {note.content}
              </p>

              <div className="mt-auto pt-6 border-t border-white/3 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <Clock3 className="h-3.5 w-3.5" />
                Updated {note.updatedAt}
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* MODALS (Simplified for logic preservation) */}
      {(selectedNote || isCreateModalOpen || editNote) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-5 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-[#0B1120] border-white/10 p-8">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white">
                  {selectedNote ? "Archive View" : isCreateModalOpen ? "New Archive" : "Edit Archive"}
                </h2>
                <button onClick={() => { setSelectedNote(null); setIsCreateModalOpen(false); setEditNote(null); }} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
             </div>

             <div className="space-y-6">
                {(isCreateModalOpen || editNote) ? (
                  <>
                    <Input 
                      placeholder="Archive Title" 
                      value={isCreateModalOpen ? newNote.title : editNote.title} 
                      onChange={(e) => isCreateModalOpen ? setNewNote({...newNote, title: e.target.value}) : setEditNote({...editNote, title: e.target.value})}
                    />
                    <Input 
                      placeholder="Category Tag" 
                      value={isCreateModalOpen ? newNote.tag : editNote.tag} 
                      onChange={(e) => isCreateModalOpen ? setNewNote({...newNote, tag: e.target.value}) : setEditNote({...editNote, tag: e.target.value})}
                    />
                    <textarea 
                      rows={8}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Write your knowledge here..."
                      value={isCreateModalOpen ? newNote.content : editNote.content}
                      onChange={(e) => isCreateModalOpen ? setNewNote({...newNote, content: e.target.value}) : setEditNote({...editNote, content: e.target.value})}
                    />
                    <Button variant="primary" className="w-full h-14 rounded-2xl font-black" onClick={isCreateModalOpen ? handleCreateNote : handleSaveEdit}>
                      {isCreateModalOpen ? "COMMIT TO ARCHIVE" : "SAVE CHANGES"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <Badge variant="indigo">{selectedNote.tag}</Badge>
                    <h3 className="text-3xl font-black text-white">{selectedNote.title}</h3>
                    <div className="bg-white/2 rounded-3xl p-6 border border-white/5 max-h-96 overflow-y-auto">
                      <p className="text-slate-300 leading-loose">{selectedNote.content}</p>
                    </div>
                  </div>
                )}
             </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
