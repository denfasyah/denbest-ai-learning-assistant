import { useAuth } from "../../context/AuthContext";
import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Pin,
  Trash2,
  Pencil,
  Clock3,
  NotebookPen,
  LayoutGrid,
  Sparkles,
  MoreHorizontal,
  X,
} from "lucide-react";

import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const NotesPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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
        note.tag.toLowerCase().includes(search.toLowerCase()),
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
    currentPage * NOTES_PER_PAGE,
  );

  // PIN NOTE
  const handleTogglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note,
      ),
    );

    setOpenMenuId(null);
  };

  // DELETE NOTE
  const handleDeleteNote = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus note ini?");

    if (!confirmDelete) return;

    setNotes((prev) => prev.filter((note) => note.id !== id));

    setOpenMenuId(null);

    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  // CREATE NOTE
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

    setNewNote({
      title: "",
      content: "",
      tag: "",
    });

    setIsCreateModalOpen(false);
  };

  // SAVE EDIT
  const handleSaveEdit = () => {
    setNotes((prev) =>
      prev.map((note) => (note.id === editNote.id ? editNote : note)),
    );

    setEditNote(null);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-[#050816] to-violet-950 text-white">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* NAVBAR */}
        <NavbarDashboard
          title={"Notes"}
          description={"Kelola catatan pembelajaran dan insight AI Assistant."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="px-5 py-5 lg:px-8">
          {/* HERO */}
          <div
            className="
              mb-8 overflow-hidden
              rounded-4xl
              border border-white/10
              bg-linear-to-br from-blue-500/10 via-violet-500/10 to-transparent
              p-7
              backdrop-blur-xl
            "
          >
            {/* LEFT */}
            <div className="md:flex max-w-5xl gap-8">
              <div
                className="
                    mb-5 flex h-16 w-16 items-center justify-center
                    rounded-3xl shrink-0
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
              >
                <NotebookPen className="h-8 w-8 text-white" />
              </div>
              <div className="">
                <h1 className="md:text-3xl text-xl font-bold tracking-[-1px]">
                  Smart Learning Notes
                </h1>

                <p className="mt-4 leading-relaxed text-slate-300 text-sm">
                  Simpan insight pembelajaran, hasil AI summary, dan catatan
                  penting dalam satu workspace modern.
                </p>
              </div>
                  <button
              onClick={() => setIsCreateModalOpen(true)}
              className="
                  flex items-center justify-center gap-3
                  rounded-2xl shrink-0
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 h-12 mt-7
                  text-sm font-semibold text-white
                  transition-all duration-300

                  hover:scale-[1.02]
                "
            >
              <Plus className="h-5 w-5" />
              Create Note
            </button>
            </div>

            {/* RIGHT */}
        
          </div>

          {/* TOOLBAR */}
          <div
            className="
              mb-8 flex flex-col gap-4
              lg:flex-row lg:items-center lg:justify-between
            "
          >
            {/* SEARCH */}
            <div
              className="
                flex w-full items-center gap-3
                rounded-2xl
                border border-white/10
                bg-white/5
                px-5 py-4
                backdrop-blur-xl

                lg:max-w-md
              "
            >
              <Search className="h-5 w-5 text-slate-500" />

              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>

            {/* ACTION */}
            <div className="flex flex-wrap items-center gap-3">
              {/* FILTER */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-3
                  text-sm text-white
                  outline-none
                  backdrop-blur-xl
                "
              >
                <option value="newest" className="text-black">
                  Newest
                </option>

                <option value="oldest" className="text-black">
                  Oldest
                </option>
              </select>

              {/* DESKTOP ONLY */}
              <div className="hidden items-center gap-3 md:flex">
                {/* GRID */}
                <button
                  onClick={() => setViewMode("grid")}
                  className={`
                    h-12 w-12 items-center justify-center
                    rounded-2xl
                    border
                    transition-all duration-300
                    hidden

                    ${
                      viewMode === "grid"
                        ? "border-blue-500/20 bg-linear-to-r from-blue-500 to-violet-500"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }
                  `}
                >
                  <LayoutGrid className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* EMPTY */}
          {paginatedNotes.length === 0 ? (
            <div
              className="
                flex flex-col items-center justify-center
                rounded-4xl
                border border-dashed border-white/10
                bg-white/5
                px-6 py-20
                text-center
              "
            >
              <div
                className="
                  flex h-20 w-20 items-center justify-center
                  rounded-full
                  bg-linear-to-br from-blue-500/20 to-violet-500/20
                "
              >
                <Sparkles className="h-10 w-10 text-blue-400" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">No Notes Found</h2>
            </div>
          ) : (
            <>
              {/* GRID */}
              {(viewMode === "grid" || window.innerWidth < 768) && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className="
                        group relative cursor-pointer overflow-visible
                        rounded-4xl
                        border border-white/10
                        bg-white/5
                        p-5
                        backdrop-blur-xl
                        transition-all duration-300

                        hover:-translate-y-1
                        hover:border-blue-500/20
                      "
                    >
                      {/* TOP */}
                      <div className="absolute right-5 top-5 flex items-center gap-2">
                        {note.pinned && (
                          <div
                            className="
                              flex h-10 w-10 items-center justify-center
                              rounded-2xl
                              bg-yellow-500/10
                            "
                          >
                            <Pin className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        )}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setOpenMenuId(
                                openMenuId === note.id ? null : note.id,
                              );
                            }}
                            className="
                              flex h-10 w-10 items-center justify-center
                              rounded-2xl
                              bg-white/5

                              hover:bg-white/10
                            "
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-300" />
                          </button>

                          {openMenuId === note.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="
                                absolute right-0 top-10 z-30
                                w-40 overflow-hidden
                                rounded-3xl
                                border border-white/10
                                bg-[#0B1120]
                                shadow-2xl
                              "
                            >
                              <button
                                onClick={() => {
                                  setEditNote(note);
                                  setOpenMenuId(null);
                                }}
                                className="
                                  flex w-full items-center gap-3
                                  rounded-2xl
                                  px-4 py-3
                                  text-sm text-slate-300

                                  hover:bg-white/5
                                "
                              >
                                <Pencil className="h-4 w-4" />
                                Edit Note
                              </button>

                              <button
                                onClick={() => handleTogglePin(note.id)}
                                className="
                                  flex w-full items-center gap-3
                                  rounded-2xl
                                  px-4 py-3
                                  text-sm text-slate-300

                                  hover:bg-white/5
                                "
                              >
                                <Pin className="h-4 w-4" />
                                {note.pinned ? "Unpin Note" : "Pin Note"}
                              </button>

                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="
                                  flex w-full items-center gap-3
                                  rounded-2xl
                                  px-4 py-3
                                  text-sm text-red-400

                                  hover:bg-red-500/10
                                "
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Note
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TAG */}
                      <span
                        className="
                          inline-flex items-center
                          rounded-full
                          bg-linear-to-r from-blue-500/20 to-violet-500/20
                          px-3 py-1
                          text-xs text-blue-300
                        "
                      >
                        {note.tag}
                      </span>

                      <h2 className="mt-5 line-clamp-1 text-lg font-bold">
                        {note.title}
                      </h2>

                      <p className="mt-3 line-clamp-1 text-sm text-slate-400">
                        {note.content}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        {note.updatedAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`
                          flex h-11 w-11 items-center justify-center
                          rounded-2xl
                          border text-sm font-semibold
                          transition-all duration-300

                          ${
                            currentPage === index + 1
                              ? "border-blue-500/20 bg-linear-to-r from-blue-500 to-violet-500 text-white"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }
                        `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* DETAIL MODAL */}
        {selectedNote && (
          <div
            className="
              fixed inset-0 z-999
              flex items-center justify-center
              bg-black/70
              p-5
              backdrop-blur-sm
            "
          >
            <div
              className="
                flex max-h-[90vh] w-full max-w-3xl flex-col
                rounded-4xl
                border border-white/10
                bg-[#0B1120]
                p-7
              "
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span
                    className="
                      rounded-full
                      bg-linear-to-r from-blue-500/20 to-violet-500/20
                      px-3 py-1
                      text-xs text-blue-300
                    "
                  >
                    {selectedNote.tag}
                  </span>

                  <h2 className="mt-5 text-3xl font-bold">
                    {selectedNote.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedNote(null)}
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                  "
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* CONTENT */}
              <div
                className="
                   mt-8
    max-h-100
    overflow-y-auto
    overflow-x-hidden
    rounded-3xl
    border border-white/10
    bg-white/5
    p-6
                "
              >
                <p className="break-all leading-relaxed text-slate-300">
                  {selectedNote.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CREATE MODAL */}
        {isCreateModalOpen && (
          <div
            className="
              fixed inset-0 z-999
              flex items-center justify-center
              bg-black/70
              p-5
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-full max-w-2xl
                rounded-4xl
                border border-white/10
                bg-[#0B1120]
                p-7
              "
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Create New Note</h2>

                <button onClick={() => setIsCreateModalOpen(false)}>
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      title: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  placeholder="Tag..."
                  value={newNote.tag}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      tag: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />

                <textarea
                  rows={8}
                  placeholder="Write your note..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      content: e.target.value,
                    })
                  }
                  className="
                    w-full resize-none rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />
              </div>

              <button
                onClick={handleCreateNote}
                className="
                  mt-8 rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 py-4
                  text-sm font-semibold text-white
                "
              >
                Save Note
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editNote && (
          <div
            className="
              fixed inset-0 z-999
              flex items-center justify-center
              bg-black/70
              p-5
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-full max-w-2xl
                rounded-4xl
                border border-white/10
                bg-[#0B1120]
                p-7
              "
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Note</h2>

                <button onClick={() => setEditNote(null)}>
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <input
                  type="text"
                  value={editNote.title}
                  onChange={(e) =>
                    setEditNote({
                      ...editNote,
                      title: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />

                <input
                  type="text"
                  value={editNote.tag}
                  onChange={(e) =>
                    setEditNote({
                      ...editNote,
                      tag: e.target.value,
                    })
                  }
                  className="
                    w-full rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />

                <textarea
                  rows={8}
                  value={editNote.content}
                  onChange={(e) =>
                    setEditNote({
                      ...editNote,
                      content: e.target.value,
                    })
                  }
                  className="
                    w-full resize-none rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-4
                    outline-none
                  "
                />
              </div>

              <button
                onClick={handleSaveEdit}
                className="
                  mt-8 rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 py-4
                  text-sm font-semibold text-white
                "
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotesPage;
