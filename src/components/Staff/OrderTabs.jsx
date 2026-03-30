import "./OrderTabs.scss"

export default function OrderTabs({ active, setActive }) {
    const tabs = ["ALL", "PENDING", "CONFIRMED", "TEST_DRIVE"];

    return (
        <div className="order-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={active === tab ? "active" : ""}
                    onClick={() => setActive(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}