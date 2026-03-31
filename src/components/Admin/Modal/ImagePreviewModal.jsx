import "./Modal.scss";

export default function ImagePreviewModal({ open, src, title, onClose }) {
    if (!open || !src) return null;

    return (
        <div className="ImgPreviewOverlay" onClick={onClose}>
            <div className="ImgPreviewBox" onClick={(e) => e.stopPropagation()}>
                <div className="ImgPreviewHeader">
                    <span>{title}</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <img src={src} alt={title} />
            </div>
        </div>
    );
}
