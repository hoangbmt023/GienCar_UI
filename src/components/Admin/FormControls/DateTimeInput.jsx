import { useState, useEffect } from "react";
import { formatDateToString, parseDateFromString } from "@/utils/dateUtils";

export default function DateTimeInput({ value, onChange, disabled }) {
    const [input, setInput] = useState("");

    // sync value từ ngoài vào
    useEffect(() => {
        if (value) {
            setInput(formatDateToString(value));
        }
    }, [value]);

    const handleChange = (e) => {
        // chỉ giữ số
        let raw = e.target.value.replace(/\D/g, "");

        let formatted = "";

        // dd
        if (raw.length >= 2) {
            formatted += raw.slice(0, 2) + "/";
        } else {
            formatted += raw;
        }

        // MM
        if (raw.length >= 4) {
            formatted += raw.slice(2, 4) + "/";
        } else if (raw.length > 2) {
            formatted += raw.slice(2);
        }

        // yyyy
        if (raw.length >= 8) {
            formatted += raw.slice(4, 8);
        } else if (raw.length > 4) {
            formatted += raw.slice(4);
        }

        // 👉 nếu đủ ngày → auto thêm giờ hiện tại
        if (raw.length === 8) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");

            formatted += ` ${h}:${m}`;
        }

        // HH
        if (raw.length >= 10) {
            formatted += " " + raw.slice(8, 10);
        }

        // mm
        if (raw.length >= 12) {
            formatted += ":" + raw.slice(10, 12);
        }

        setInput(formatted);

        // parse khi đủ
        if (formatted.length === 16) {
            const parsed = parseDateFromString(formatted);
            if (parsed) onChange(parsed);
        }
    };

    return (
        <input
            value={input}
            onChange={handleChange}
            placeholder="dd/MM/yyyy"
            disabled={disabled}
        />
    );
}