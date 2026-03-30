import OrderSummary from "@/components/Order/OrderSummary";
import car1 from "@/assets/images/car1.jpg";

export default function OrderPage() {

    const mockCar = {
        id: 1,
        name: "718 Boxster S",
        image: car1,
        price: "5.080.000.000 VNĐ",
        power: "350 PS",
        topSpeed: "285 km/h"
    };

    return (
        <main>
            <OrderSummary car={mockCar} />
        </main>
    );
}