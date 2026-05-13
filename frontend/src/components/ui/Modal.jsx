import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = 'max-w-2xl'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/60 transition-all">
      <div 
        className={`w-full ${maxWidth} bg-[#050816] border border-white/10 rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} icon={X} />
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="px-6 py-5 border-t border-white/5 bg-white/2 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
