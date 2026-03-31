import { useState } from "react";
import "./CarFilter.scss";

const CarFilter = ({ filters, setFilters, seriesList }) => {

    const [open, setOpen] = useState(false);

    const selectSeries = (id) => {
        setFilters(prev => ({
            ...prev,
            seriesId: prev.seriesId === id ? "" : id
        }));
    };

    return (
        <div className={`car-filter ${open ? "open" : ""}`}>

            {/* HEADER */}
            <div
                className="car-filter__header"
                onClick={() => setOpen(!open)}
            >
                <h3>Chọn lọc bởi:</h3>

                <span className={`arrow ${open ? "open" : ""}`}>
                    ▼
                </span>
            </div>

            {/* ❗ LUÔN render để animation hoạt động */}
            <div className="car-filter__grid">

                {/* ❗ wrapper để animation smooth */}
                <div>

                    {/* SERIES */}
                    <div className="car-filter__group">
                        <h4>Dòng xe</h4>
                        {seriesList.map(s => (
                            <label key={s.id} className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.seriesId === s.id}
                                    onChange={() => selectSeries(s.id)}
                                />
                                {s.name}
                            </label>
                        ))}
                    </div>

                    {/* PRICE */}
                    <div className="car-filter__group">
                        <h4>Mức giá (VNĐ)</h4>

                        <div className="range-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters({ ...filters, minPrice: +e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters({ ...filters, maxPrice: +e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* POWER */}
                    <div className="car-filter__group">
                        <h4>Công suất (kW)</h4>

                        <div className="range-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                onChange={(e) =>
                                    setFilters({ ...filters, minPowerKw: +e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                onChange={(e) =>
                                    setFilters({ ...filters, maxPowerKw: +e.target.value })
                                }
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CarFilter;