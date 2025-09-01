import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ 
  open, 
  onClose, 
  children 
}: {
  open: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { 
      document.body.style.overflow = ""; 
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Contenido */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
