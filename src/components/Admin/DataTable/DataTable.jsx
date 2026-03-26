import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
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

                <tbody>
                    {rows.map((r) => (
                        <tr
                            key={r.id}
                            className={`DataTable__tr ${rowClassName ? rowClassName(r) : ""}`}
                            onClick={() => onRowClick?.(r)}
                            style={{ cursor: onRowClick ? "pointer" : "default" }}
                        >
                            {/* DATA */}
                            {columns.map((c) => (
                                <td key={c.key} className="DataTable__td">
                                    {/* Kiểm tra nếu có render function thì dùng, không thì hiển thị value */}
                                    {c.render ? c.render(r) : r[c.key]}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}