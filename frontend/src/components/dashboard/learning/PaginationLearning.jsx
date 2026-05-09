import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationLearning = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      {/* PREV */}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        disabled={currentPage === 1}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-2xl
          border border-white/10
          bg-white/5
          text-white
          transition-all duration-300

          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* PAGE */}
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              text-sm font-semibold
              transition-all duration-300

              ${
                currentPage === page
                  ? "bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, totalPages)
          )
        }
        disabled={currentPage === totalPages}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-2xl
          border border-white/10
          bg-white/5
          text-white
          transition-all duration-300

          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PaginationLearning;