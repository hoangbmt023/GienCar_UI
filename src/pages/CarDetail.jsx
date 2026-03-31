import HeroImage from "../components/HeroImage/HeroImage";
import CarSuggest from "../components/CarSuggest/CarSuggest";
import CarDetail from "../components/CarDetail/CarDetail";
import ChatBox from "../components/ChatBox/ChatBox";

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { carService } from "../services/carService";
import { specificationService } from "../services/specificationService";

export default function CarDetailPage() {
    const [showChat, setShowChat] = useState(false);
    const [car, setCar] = useState(null);
    const [colors, setColors] = useState([]); // 👈 thêm
    const [selectedImage, setSelectedImage] = useState(null); // 👈 thêm
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const { slug } = useParams();

    useEffect(() => {
        fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const carRes = state?.car
                ? { data: { data: state.car } }
                : await carService.getCarBySlug(slug);

            const data = state?.car || carRes.data.data;

            const specRes = await specificationService.getCarSpecs(data.id);
            const spec = specRes.data.data;

            setColors(data.exteriorColors || []);

            const mappedCar = {
                id: data.id,
                name: data.name,
                image: data.images?.[0]?.url || data.image || "",
                price: data.price,
                formattedPrice: formatPrice(data.price),
                note: data.description || "",

                power:
                    spec.engine?.powerKw != null
                        ? `${spec.engine.powerKw} kW`
                        : "-",

                acceleration:
                    spec.efficiency?.acceleration0To100 != null
                        ? `${spec.efficiency.acceleration0To100}s`
                        : "-",

                topSpeed:
                    spec.efficiency?.maxSpeedKmH != null
                        ? `${spec.efficiency.maxSpeedKmH} km/h`
                        : "-",

                fuel:
                    spec.consumption?.combinedLPer100Km != null
                        ? `${spec.consumption.combinedLPer100Km} L/100km`
                        : "-",

                co2:
                    spec.consumption?.co2EmissionsGPerKm != null
                        ? `${spec.consumption.co2EmissionsGPerKm} g/km`
                        : "-",

                torque:
                    spec.engine?.torqueNm != null
                        ? `${spec.engine.torqueNm} Nm`
                        : "-",

                height:
                    spec.body?.heightMm != null
                        ? `${spec.body.heightMm} mm`
                        : "-",

                width:
                    spec.body?.widthMm != null
                        ? `${spec.body.widthMm} mm`
                        : "-",

                length:
                    spec.body?.lengthMm != null
                        ? `${spec.body.lengthMm} mm`
                        : "-",

                wheelbase:
                    spec.body?.wheelBaseMm != null
                        ? `${spec.body.wheelBaseMm} mm`
                        : "-",
            };

            setCar(mappedCar);
            setSelectedImage(mappedCar.image);

        } catch (err) {
            console.error("Lỗi fetch detail:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectColor = (color) => {
        if (color.imageUrls?.length) {
            setSelectedImage(color.imageUrls[0]);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (loading) return <p>Đang tải...</p>;
    if (!car) return <p>Không tìm thấy xe</p>;

    return (
        <div>
            <HeroImage car={{ ...car, image: selectedImage || car.image }} />

            <CarSuggest
                colors={colors}
                onSelectColor={handleSelectColor}
                selectedColor={selectedImage}
            />

            <div className="px-4 sm:px-6 lg:px-1 max-w-[1375px] mx-auto">
                <div className="car-detail-wrapper">
                    <CarDetail car={{ ...car, image: selectedImage || car.image }} />
                </div>
            </div>

            <button
                onClick={() =>
                    navigate("/order", {
                        state: {
                            car: {
                                ...car,
                                image: selectedImage || car.image
                            }
                        }
                    })
                }
            >
                Đặt cọc
            </button>

            <button
                onClick={() => setShowChat(prev => !prev)}
                className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg"
            >
                Tư vấn
            </button>

            {showChat && (
                <ChatBox onClose={() => setShowChat(false)} />
            )}
        </div>
    );
}