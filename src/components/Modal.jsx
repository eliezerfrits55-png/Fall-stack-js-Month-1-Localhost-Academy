import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  ariaLabel,
  closeOnBackdropClick = true,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Modal'}
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className={`modal-card ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              className="button-link"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div>{children}</div>
        {footer && (
          <div className="mt-4 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
