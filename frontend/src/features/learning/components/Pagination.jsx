import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={ChevronLeft}
      />

      <div className="flex items-center gap-2 mx-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all
              ${currentPage === page 
                ? 'bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={ChevronRight}
      />
    </div>
  );
};

export default Pagination;
