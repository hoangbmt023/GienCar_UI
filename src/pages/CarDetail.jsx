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
    const [colors, setColors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
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

            // 👉 1. Hiển thị nhanh từ state (nếu có)
            if (state?.car) {
                setCar({
                    ...state.car,
                    formattedPrice: formatPrice(state.car.price)
                });

                setSelectedImage(
                    state.car.images?.[0]?.url || state.car.image || ""
                );

                setColors(state.car.exteriorColors || []);
            }

            // 👉 2. LUÔN gọi API để lấy data mới
            const carRes = await carService.getCarBySlug(slug);
            const data = carRes.data.data;

            const specRes = await specificationService.getCarSpecs(data.id);
            const spec = specRes.data.data;

            const mappedCar = {
                id: data.id,
                name: data.name,
                image: data.images?.[0]?.url || "",
                price: data.price,
                formattedPrice: formatPrice(data.price),
                note: data.description || "",
                exteriorColors: data.exteriorColors || [],

                power: spec.engine?.powerKw != null ? `${spec.engine.powerKw} kW` : "-",
                acceleration: spec.efficiency?.acceleration0To100 != null ? `${spec.efficiency.acceleration0To100}s` : "-",
                topSpeed: spec.efficiency?.maxSpeedKmH != null ? `${spec.efficiency.maxSpeedKmH} km/h` : "-",
                fuel: spec.consumption?.combinedLPer100Km != null ? `${spec.consumption.combinedLPer100Km} L/100km` : "-",
                co2: spec.consumption?.co2EmissionsGPerKm != null ? `${spec.consumption.co2EmissionsGPerKm} g/km` : "-",
                torque: spec.engine?.torqueNm != null ? `${spec.engine.torqueNm} Nm` : "-",
                height: spec.body?.heightMm != null ? `${spec.body.heightMm} mm` : "-",
                width: spec.body?.widthMm != null ? `${spec.body.widthMm} mm` : "-",
                length: spec.body?.lengthMm != null ? `${spec.body.lengthMm} mm` : "-",
                wheelbase: spec.body?.wheelBaseMm != null ? `${spec.body.wheelBaseMm} mm` : "-",
            };

            setCar(mappedCar);
            setSelectedImage(mappedCar.image);
            setColors(mappedCar.exteriorColors);

        } catch (err) {
            console.error("Lỗi fetch detail:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);

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

            <h3
                className="car-detail-header__name"
                style={{ marginLeft: "110px", marginTop: "20px" }}
            >
                Danh sách màu xe
            </h3>

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

            <div className="px-4 sm:px-6 lg:px-1 max-w-[1375px] mx-auto">
                <div className="car-detail-wrapper">
                    <CarDetail car={{ ...car, image: selectedImage || car.image }} />

                    <div className="car-action">
                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate("/order", {
                                    state: {
                                        car: {
                                            ...car,
                                            image: selectedImage || car.image,
                                            selectedColor: selectedColor
                                        }
                                    }
                                })
                            }
                        >
                            Đặt cọc
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={() => setShowChat(prev => !prev)}
                        >
                            Tư vấn
                        </button>

                        <button
                            className="btn-booking"
                            onClick={() =>
                                navigate("/booking", {
                                    state: {
                                        car: {
                                            ...car,
                                            image: selectedImage || car.image
                                        }
                                    }
                                })
                            }
                        >
                            Đăng ký lái thử
                        </button>
                    </div>
                </div>
            </div>

            {showChat && (
                <ChatBox onClose={() => setShowChat(false)} />
            )}
        </div>
    );
}