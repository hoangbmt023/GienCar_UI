import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import "@/components/Admin/FormControls/FormControls.scss";

const emptyForm = {
    engine: {
        name: "",
        capacityCc: "",
        layout: "",
        powerKw: ""
    },
    efficiency: {
        maxSpeedKmH: "",
        acceleration0To100: "",
        acceleration0To160: ""
    },
    body: {
        lengthMm: "",
        widthMm: "",
        heightMm: "",
        wheelBaseMm: "",
        payloadKg: "",
        luggageCapacityL: ""
    },
    consumption: {
        urbanLPer100Km: "",
        extraUrbanLPer100Km: "",
        combinedLPer100Km: "",
        co2EmissionsGPerKm: ""
    }
};

export default function SpecificationsForm({
    initialValues,
    onSubmit,
    onCancel,
    loading = false,
    readOnly = false,
}) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        setForm({
            ...emptyForm,
            ...(initialValues || {})
        });
    }, [initialValues]);

    // helper set nested field
    const setField = (section, key, value) => {
        if (readOnly) return;

        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

        // 🔥 convert number fields
        const payload = {
            engine: {
                name: form.engine.name,
                capacityCc: Number(form.engine.capacityCc) || 0,
                layout: form.engine.layout,
                powerKw: Number(form.engine.powerKw) || 0
            },
            efficiency: {
                maxSpeedKmH: Number(form.efficiency.maxSpeedKmH) || 0,
                acceleration0To100: Number(form.efficiency.acceleration0To100) || 0,
                acceleration0To160: Number(form.efficiency.acceleration0To160) || 0
            },
            body: {
                lengthMm: Number(form.body.lengthMm) || 0,
                widthMm: Number(form.body.widthMm) || 0,
                heightMm: Number(form.body.heightMm) || 0,
                wheelBaseMm: Number(form.body.wheelBaseMm) || 0,
                payloadKg: Number(form.body.payloadKg) || 0,
                luggageCapacityL: Number(form.body.luggageCapacityL) || 0
            },
            consumption: {
                urbanLPer100Km: Number(form.consumption.urbanLPer100Km) || 0,
                extraUrbanLPer100Km: Number(form.consumption.extraUrbanLPer100Km) || 0,
                combinedLPer100Km: Number(form.consumption.combinedLPer100Km) || 0,
                co2EmissionsGPerKm: Number(form.consumption.co2EmissionsGPerKm) || 0
            }
        };

        await onSubmit?.(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ================= ENGINE ================= */}
            <h4>Engine</h4>
            <Input label="Tên động cơ" value={form.engine.name}
                onChange={(e) => setField("engine", "name", e.target.value)} />

            <Input label="Dung tích (cc)" type="number" value={form.engine.capacityCc}
                onChange={(e) => setField("engine", "capacityCc", e.target.value)} />

            <Input label="Hệ dẫn động" value={form.engine.layout}
                onChange={(e) => setField("engine", "layout", e.target.value)} />

            <Input label="Công suất (kW)" type="number" value={form.engine.powerKw}
                onChange={(e) => setField("engine", "powerKw", e.target.value)} />

            {/* ================= EFFICIENCY ================= */}
            <h4>Efficiency</h4>
            <Input label="Tốc độ tối đa (km/h)" type="number"
                value={form.efficiency.maxSpeedKmH}
                onChange={(e) => setField("efficiency", "maxSpeedKmH", e.target.value)} />

            <Input label="0-100 km/h (s)" type="number"
                value={form.efficiency.acceleration0To100}
                onChange={(e) => setField("efficiency", "acceleration0To100", e.target.value)} />

            <Input label="0-160 km/h (s)" type="number"
                value={form.efficiency.acceleration0To160}
                onChange={(e) => setField("efficiency", "acceleration0To160", e.target.value)} />

            {/* ================= BODY ================= */}
            <h4>Body</h4>
            <Input label="Dài (mm)" type="number"
                value={form.body.lengthMm}
                onChange={(e) => setField("body", "lengthMm", e.target.value)} />

            <Input label="Rộng (mm)" type="number"
                value={form.body.widthMm}
                onChange={(e) => setField("body", "widthMm", e.target.value)} />

            <Input label="Cao (mm)" type="number"
                value={form.body.heightMm}
                onChange={(e) => setField("body", "heightMm", e.target.value)} />

            <Input label="Trục cơ sở (mm)" type="number"
                value={form.body.wheelBaseMm}
                onChange={(e) => setField("body", "wheelBaseMm", e.target.value)} />

            <Input label="Tải trọng (kg)" type="number"
                value={form.body.payloadKg}
                onChange={(e) => setField("body", "payloadKg", e.target.value)} />

            <Input label="Dung tích cốp (L)" type="number"
                value={form.body.luggageCapacityL}
                onChange={(e) => setField("body", "luggageCapacityL", e.target.value)} />

            {/* ================= CONSUMPTION ================= */}
            <h4>Consumption</h4>
            <Input label="Đô thị (L/100km)" type="number"
                value={form.consumption.urbanLPer100Km}
                onChange={(e) => setField("consumption", "urbanLPer100Km", e.target.value)} />

            <Input label="Ngoài đô thị" type="number"
                value={form.consumption.extraUrbanLPer100Km}
                onChange={(e) => setField("consumption", "extraUrbanLPer100Km", e.target.value)} />

            <Input label="Kết hợp" type="number"
                value={form.consumption.combinedLPer100Km}
                onChange={(e) => setField("consumption", "combinedLPer100Km", e.target.value)} />

            <Input label="CO2 (g/km)" type="number"
                value={form.consumption.co2EmissionsGPerKm}
                onChange={(e) => setField("consumption", "co2EmissionsGPerKm", e.target.value)} />

            {/* ACTION */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button type="button" onClick={onCancel}>Huỷ</button>
                <button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                </button>
            </div>
        </form>
    );
}