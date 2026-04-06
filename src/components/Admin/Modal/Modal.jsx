import "./Modal.scss";

export default function Modal({
    open,
    title,
    onClose,
    children,
    footer,
    size = "md", // "sm" | "md" | "lg"
    closeOnOverlayClick = true,
    closeOnEsc = true,
}) {
    if (!open) return null;

    const handleOverlayClick = () => {
        if (closeOnOverlayClick) onClose?.();
    };

    const handleKeyDown = (e) => {
        if (closeOnEsc && e.key === "Escape") onClose?.();
    };

    return (
        <div className="ModalOverlay" onClick={handleOverlayClick}>
            <div
                className={`ModalBox ModalBox--${size}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                <div className="ModalHeader">
                    <div className="ModalTitle">{title}</div>
                    <button className="ModalClose" type="button" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>

                <div className="ModalBody">{children}</div>

                {footer ? <div className="ModalFooter">{footer}</div> : null}
            </div>
        </div>
    );
}