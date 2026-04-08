import React, { useState } from "react";
import { Eye, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import "./DataTable.scss";

export default function DataTable({
    columns = [],
    rows = [],
    onToggleAll,
    allChecked = false,
    onToggleRow,
    onView,
    onEdit,
    onDelete,
    onRowClick,
    rowClassName,
    selectable = true,
    showActions = true,
}) {
    const [expanded, setExpanded] = useState({});

    const [closing, setClosing] = useState({});

    const [appearing, setAppearing] = useState({});

    const [previewImage, setPreviewImage] = useState(null);

    const toggleRow = (id) => {
        if (expanded[id]) {
            // đóng
            setClosing((prev) => ({ ...prev, [id]: true }));

            setTimeout(() => {
                setExpanded((prev) => ({ ...prev, [id]: false }));
                setClosing((prev) => ({ ...prev, [id]: false }));
            }, 200);
        } else {
            // mở
            setExpanded((prev) => ({ ...prev, [id]: true }));
            setAppearing((prev) => ({ ...prev, [id]: true }));

            setTimeout(() => {
                setAppearing((prev) => ({ ...prev, [id]: false }));
            }, 200);
        }
    };

    const handlePreviewImage = (src) => {
        setPreviewImage(src);
    };

    const renderRows = (data, level = 0) => {
        return data.flatMap((r) => {
            const isExpanded = expanded[r.id];
            const hasChildren = r.children && r.children.length > 0;

            return [
                <tr
                    key={r.id}
                    className={`DataTable__tr 
                        ${r.__closing ? "DataTable__tr--closing" : ""}
                        ${r.__appearing ? "DataTable__tr--appearing" : ""}
                        ${rowClassName ? rowClassName(r) : ""}`}
                >
                    {columns.map((c, index) => (
                        <td key={c.key} className="DataTable__td">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: index === 0 ? level * 20 : 0,
                                }}
                            >
                                {/* ICON expand */}
                                {index === 0 && hasChildren && (
                                    <span
                                        className={`expand-icon ${isExpanded ? "expanded" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleRow(r.id);
                                        }}
                                    >
                                        {isExpanded ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </span>
                                )}

                                {/* DATA */}
                                <span>
                                    {c.render
                                        ? c.render(r, { previewImage: handlePreviewImage })
                                        : r[c.key]}
                                </span>
                            </div>
                        </td>
                    ))}

                    {/* ACTIONS */}
                    {showActions && (
                        <td
                            className="DataTable__td DataTable__td--actions"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="DataTable__action DataTable__action--view"
                                onClick={() => onView?.(r)}
                                type="button"
                            >
                                <Eye size={16} />
                            </button>

                            <button
                                className="DataTable__action DataTable__action--edit"
                                onClick={() => onEdit?.(r)}
                                type="button"
                            >
                                <Pencil size={16} />
                            </button>

                            <button
                                className="DataTable__action DataTable__action--delete"
                                onClick={() => onDelete?.(r)}
                                type="button"
                            >
                                <Trash2 size={16} />
                            </button>
                        </td>
                    )}

                    {previewImage && (
                        <div
                            className="ImagePreviewOverlay"
                            onClick={() => setPreviewImage(null)}
                        >
                            <div
                                className="ImagePreviewBox"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img src={previewImage} alt="preview" />
                            </div>
                        </div>
                    )}
                </tr>,

                ...((isExpanded || closing[r.id]) && hasChildren
                    ? renderRows(
                        r.children.map((child) => ({
                            ...child,
                            __closing: closing[r.id],
                            __appearing: appearing[r.id],
                        })),
                        level + 1
                    )
                    : [])
            ];
        });
    };

    return (
        <div className="DataTable">
            <table className="DataTable__table">
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} className="DataTable__th">
                                {c.label}
                            </th>
                        ))}

                        {showActions && (
                            <th className="DataTable__th DataTable__th--actions">
                                Hành động
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>{renderRows(rows)}</tbody>
            </table>
        </div>
    );
}