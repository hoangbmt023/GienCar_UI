import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { carService } from "@/services/carService";
import "./GlobalSearch.scss";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const isMobile = window.innerWidth <= 1024;

    // debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    // call API
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        const fetchSearch = async () => {
            try {
                const res = await carService.searchCars(debouncedQuery, {
                    page: 1,
                    size: 5
                });

                setResults(res.data.data || []);
            } catch (err) {
                console.error("Search lỗi:", err);
            }
        };

        fetchSearch();
    }, [debouncedQuery]);

    // handle click
    const handleSelect = (car) => {
        navigate(`/models/${car.slug}`);
        setQuery("");
        setResults([]);
        setOpen(false);
    };

    // render item (🔥 tách riêng cho clean)
    const renderItem = (car) => (
        <div
            key={car.id}
            className="search-item"
            onClick={() => handleSelect(car)}
        >
            <img
                src={car.imageUrl || car.image || car.images?.[0]?.url}
                alt={car.name}
                className="search-item__img"
            />

            <div className="search-item__info">
                <span className="name">{car.name}</span>
            </div>
        </div>
    );

    // ================= MOBILE =================
    if (isMobile) {
        return (
            <div className="global-search-mobile">
                <Search size={20} color="#fff" onClick={() => setOpen(true)} />

                {open && (
                    <div className="search-overlay">
                        <div className="search-header">
                            <input
                                autoFocus
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <X size={20} onClick={() => setOpen(false)} />
                        </div>

                        {results.length > 0 && (
                            <div className="search-dropdown mobile">
                                {results.map(renderItem)}
                            </div>
                        )}

                        {debouncedQuery && results.length === 0 && (
                            <div className="search-empty">
                                Không tìm thấy kết quả
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ================= DESKTOP =================
    return (
        <div className="global-search">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
                <div className="search-dropdown">
                    {results.map(renderItem)}
                </div>
            )}

            {debouncedQuery && results.length === 0 && (
                <div className="search-empty">
                    Không tìm thấy
                </div>
            )}
        </div>
    );
}