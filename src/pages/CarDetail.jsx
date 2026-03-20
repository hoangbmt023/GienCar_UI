import HeroImage from "../components/HeroImage/HeroImage";
import testImage from "../assets/images/testimage.jpg";
import CarSuggest from "../components/CarSuggest/CarSuggest";
import CarDetail from "../components/CarDetail/CarDetail";
import car1 from "../assets/images/car1.jpg";
import car2 from "../assets/images/car2.jpg";
import car3 from "../assets/images/car3.jpg";
import car4 from "../assets/images/car4.jpg";
import car5 from "../assets/images/car5.jpg";
import car6 from "../assets/images/car6.jpg";

export default function CarDetailPage() {
    const cars = [
        { id: 0, name: "Test Car", image: testImage },
        { id: 1, name: "Toyota Camry", image: car1 },
        { id: 2, name: "Honda Civic", image: car2 },
        { id: 3, name: "BMW X5", image: car3 },
        { id: 4, name: "Audi A4", image: car4 },
        { id: 5, name: "Mercedes GLE", image: car5 },
        { id: 6, name: "Porsche 911", image: car6 }
    ];

    const mockCar = {
        name: "718 Boxster S",
        price: "5.080.000.000 VNĐ*",
        note: "* Giá tiêu chuẩn bao gồm thuế nhập khẩu, thuế tiêu thụ đặc biệt và thuế giá trị gia tăng. Đối với dòng xe Panamera, Cayenne, Macan và Taycan giá tiêu chuẩn bao gồm thêm gói dịch vụ 4 năm bảo dưỡng. Bảng giá, thông số kỹ thuật và hình ảnh có thể thay đổi theo từng thời điểm mà không báo trước.",
        image: car1,
        power: "350 PS (257 kW)",
        acceleration: "4,4 giây (4,2 giây với Gói Sport Chrono)",
        topSpeed: "285 km/h",
        wheelbase: "2.475 mm",
        length: "4.379 mm",
        height: "1.280 mm"
    };

    return (
        <div>
            <HeroImage car={cars[0]} />
            <CarSuggest cars={cars} />
            <div className="px-4 sm:px-6 lg:px-1 max-w-[1375px] mx-auto">
                <div className="car-detail-wrapper">
                    <CarDetail car={mockCar} />
                </div>
            </div>
        </div>
    )
}