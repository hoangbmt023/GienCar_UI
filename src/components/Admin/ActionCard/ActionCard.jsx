import "./ActionCard.scss";

export default function ActionCard({
    title,
    value,
    subtitle,
    onAdd,
    onDelete,
    addLabel = "THÊM MỚI",
    deleteLabel = "XOÁ",
    showAdd = true,
    showDelete = true,
}) {
    return (
        <div className="ActionCard">
            <div className="ActionCard__left">
                {title ? <div className="ActionCard__title">{title}</div> : null}
                {value !== undefined && value !== null ? (
                    <div className="ActionCard__value">{value}</div>
                ) : null}
                {subtitle ? <div className="ActionCard__subtitle">{subtitle}</div> : null}
            </div>

            <div className="ActionCard__right">
                {showAdd ? (
                    <button
                        className="ActionCard__btn ActionCard__btn--add"
                        onClick={onAdd}
                        type="button"
                        disabled={!onAdd}
                    >
                        <span className="ActionCard__btnText">{addLabel}</span>
                        <span className="ActionCard__btnIcon">+</span>
                    </button>
                ) : null}

                {showDelete ? (
                    <button
                        className="ActionCard__btn ActionCard__btn--delete"
                        onClick={onDelete}
                        type="button"
                        disabled={!onDelete}
                        title={!onDelete ? "Chọn dòng để xoá" : undefined}
                    >
                        <span className="ActionCard__btnText">{deleteLabel}</span>
                        <span className="ActionCard__btnIcon">−</span>
                    </button>
                ) : null}
            </div>
        </div>
    );
}
