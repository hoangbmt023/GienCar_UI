import { useEffect, useState } from "react";
import CarCompare from "../components/CarCompare/CarCompare";
import CarList from "../components/CarList/CarList";
import CarFilter from "../components/CarFilter/CarFilter";

import { carService } from "../services/carService";
import { specificationService } from "../services/specificationService";
import { carSeriesService } from "../services/carSeriesService";

const CarListPage = () => {
    const [selectedCars, setSelectedCars] = useState([]);
    const [series, setSeries] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        seriesId: "",
        minPrice: "",
        maxPrice: "",
        minPowerKw: "",
        maxPowerKw: "",
        status: "available"
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
        }, 400);

        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const cleanParams = Object.fromEntries(
                Object.entries({
                    ...filters,
                    page: 1,
                    size: 50
                }).filter(([_, v]) => v !== null && v !== "" && v !== undefined)
            );

            // 1. lấy series
            const seriesRes = await carSeriesService.getSeries();
            const seriesData = seriesRes.data.data;
            setSeriesList(seriesData);

            // 2. lấy tất cả cars theo filter
            const carRes = await carService.getCars(cleanParams);
            const cars = carRes.data.data;

            // 3. group theo series
            const grouped = seriesData.map(s => {
                const carsInSeries = cars.filter(c => c.seriesId === s.id);

                return {
                    id: s.id,
                    name: s.name.toUpperCase(),
                    image: s.imageUrl,

                    cars: carsInSeries.map(car => ({
                        id: car.id,
                        slug: car.slug,
                        name: car.name,
                        image: car.images?.[0]?.url || "",

                        price: car.price,
                        formattedPrice: formatPrice(car.price),

                        exteriorColors: car.exteriorColors || [],

                        power: "-",
                        acceleration: "-",
                        topSpeed: "-",
                        fuel: "-",
                        co2: "-",
                        height: "-",
                        width: "-",
                        length: "-",
                        wheelbase: "-",
                    }))
                };
            });

            setSeries(grouped.filter(s => s.cars.length > 0));

        } catch (error) {
            console.error("Lỗi fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleCompare = async (car) => {
        if (selectedCars.length >= 3) return;
        if (selectedCars.find((c) => c.id === car.id)) return;

        try {
            const res = await specificationService.getCarSpecs(car.id);
            const spec = res.data.data;

            const mappedCar = {
                ...car,
                power: spec.engine?.powerKw ? `${spec.engine.powerKw} kW` : "-",
                acceleration: spec.efficiency?.acceleration0To100
                    ? `${spec.efficiency.acceleration0To100}s`
                    : "-",
                topSpeed: spec.efficiency?.maxSpeedKmH
                    ? `${spec.efficiency.maxSpeedKmH} km/h`
                    : "-",
                fuel: spec.consumption?.combinedLPer100Km
                    ? `${spec.consumption.combinedLPer100Km} L/100km`
                    : "-",
                co2: spec.consumption?.co2EmissionsGPerKm
                    ? `${spec.consumption.co2EmissionsGPerKm} g/km`
                    : "-",
                height: spec.body?.heightMm ? `${spec.body.heightMm} mm` : "-",
                width: spec.body?.widthMm ? `${spec.body.widthMm} mm` : "-",
                length: spec.body?.lengthMm ? `${spec.body.lengthMm} mm` : "-",
                wheelbase: spec.body?.wheelBaseMm
                    ? `${spec.body.wheelBaseMm} mm`
                    : "-",
            };

            setSelectedCars([...selectedCars, mappedCar]);
        } catch (err) {
            console.error("Lỗi lấy specs:", err);
        }
    };

    const removeCar = (idx) => {
        const newCars = [...selectedCars];
        newCars.splice(idx, 1);
        setSelectedCars(newCars);
    };

    const scrollToList = () => {
        const el = document.getElementById("car-list-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-1 max-w-[1300px] mx-auto">

            <CarCompare
                selectedCars={selectedCars}
                removeCar={removeCar}
                scrollToList={scrollToList}
            />

            <h1 className="text-2xl font-bold mb-6">Danh sách xe</h1>

            <CarFilter
                filters={filters}
                setFilters={setFilters}
                seriesList={seriesList}
            />

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <CarList categories={series} onCompare={handleCompare} />
            )}
        </div>
    );
};

export default CarListPage;