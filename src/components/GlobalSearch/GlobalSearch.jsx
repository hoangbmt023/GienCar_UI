import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./GlobalSearch.scss";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [open, setOpen] = useState(false);

    const isMobile = window.innerWidth <= 1024;

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery) {
            console.log("Call API với:", debouncedQuery);
        }
    }, [debouncedQuery]);

    // 👉 MOBILE UI
    if (isMobile) {
        return (
            <div className="global-search-mobile">
                <Search size={20} color="#fff" onClick={() => setOpen(true)} />

                {open && (
                    <div className="search-overlay">
                        <input
                            autoFocus
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <X size={20} onClick={() => setOpen(false)} />
                    </div>
                )}
            </div>
        );
    }

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