import { Link } from "react-router-dom";
import {
  FileText,
  Folder,
  Clock3,
  MoreVertical,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

const DocumentCardLearning = ({
  doc,
  handleFavorite,
  handleRename,
  handleDelete,
  formatUploadTime,
  openMenuId,
  setOpenMenuId,
}) => {
  return (
    <div
      className="
        group relative overflow-visible
        rounded-[28px]
        border border-white/10
        bg-white/4
        p-5
        backdrop-blur-xl
        transition-all duration-300

        hover:-translate-y-1
        hover:border-blue-500/30
        hover:bg-white/6
      "
    >
      {/* TOP */}
      <div className="mb-5 flex items-start justify-between">
        <div
          className="
            flex h-14 w-14 items-center justify-center
            rounded-2xl
            bg-linear-to-br from-blue-500/20 to-violet-500/20
          "
        >
          {doc.type === "pdf" ? (
            <FileText className="h-7 w-7 text-blue-400" />
          ) : (
            <Folder className="h-7 w-7 text-violet-400" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* FAVORITE */}
          <button
            onClick={() => handleFavorite(doc.id)}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-white/5
              transition-all duration-200
              hover:bg-white/10
            "
          >
            <Star
              className={`h-5 w-5 transition-all ${
                doc.favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-400"
              }`}
            />
          </button>

          {/* MENU */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === doc.id ? null : doc.id)
              }
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-white/5
                transition-all duration-200
                hover:bg-white/10
              "
            >
              <MoreVertical className="h-5 w-5 text-slate-300" />
            </button>

            {/* DROPDOWN */}
            {openMenuId === doc.id && (
              <div
                className="
                  absolute right-0 top-12 z-50
                  w-44 overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-[#0B1120]
                  shadow-2xl
                "
              >
                <button
                  onClick={() => {
                    handleRename(doc.id, doc.name);
                    setOpenMenuId(null);
                  }}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-sm text-white
                    transition hover:bg-white/5
                  "
                >
                  <Pencil className="h-4 w-4" />
                  Edit Document
                </button>

                <button
                  onClick={() => {
                    handleDelete(doc.id);
                    setOpenMenuId(null);
                  }}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-sm text-red-400
                    transition hover:bg-red-500/10
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div>
        <h3 className="line-clamp-1 text-lg font-bold text-white">
          {doc.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-white/5 px-3 py-1">
            {doc.type.toUpperCase()}
          </span>

          <span>{doc.size} MB</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock3 className="h-4 w-4" />
          <span>{formatUploadTime(doc.createdAt)}</span>
        </div>

        <Link
          to="/learning/workspace"
          className="
            rounded-xl
            bg-linear-to-r from-blue-500 to-violet-500
            px-4 py-2
            text-xs font-semibold text-white
            transition-all duration-300

            hover:scale-[1.03]
          "
        >
          Start Learning
        </Link>
      </div>
    </div>
  );
};

export default DocumentCardLearning;