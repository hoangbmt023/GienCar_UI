import { useState, useEffect } from "react";
import "./GlobalSearch.scss";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms

        return () => clearTimeout(timer);
    }, [query]);

    // call API khi debounce xong
    useEffect(() => {
        if (debouncedQuery) {
            console.log("Call API với:", debouncedQuery);

            // ví dụ:
            // fetch(`/api/search?q=${debouncedQuery}`)
        }
    }, [debouncedQuery]);

    return (
        <div className="global-search">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}