import { useEffect, useState } from "react";
import Input from "@/components/Admin/FormControls/Input";
import Select from "@/components/Admin/FormControls/Select";
import "@/components/Admin/FormControls/FormControls.scss";
import { locationApi } from "@/services/Admin/locationApi";

const emptyForm = {
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    mapUrl: "",
    isActive: true,
};

export default function BranchesForm({
    initialValues,
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // location state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [provinceCode, setProvinceCode] = useState("");
    const [districtCode, setDistrictCode] = useState("");
    const [wardName, setWardName] = useState("");

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // ================= INIT =================
    useEffect(() => {
        setForm({
            ...emptyForm,
            ...initialValues,
        });
        setErrors({});
    }, [initialValues]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        const res = await locationApi.getProvinces();
        setProvinces(res.data || []);
    };

    // ================= LOCATION =================

    const handleProvinceChange = async (code) => {
        setProvinceCode(code);
        setDistrictCode("");
        setWardName("");
        setDistricts([]);
        setWards([]);

        if (!code) return;

        const res = await locationApi.getDistricts(code);
        const province = res.data;

        setSelectedProvince(province.name);
        setDistricts(province.districts || []);

        setField("city", province.name);
    };

    const handleDistrictChange = async (code) => {
        setDistrictCode(code);
        setWardName("");
        setWards([]);

        if (!code) return;

        const res = await locationApi.getWards(code);
        const district = res.data;

        setSelectedDistrict(district.name);
        setWards(district.wards || []);
    };

    const handleWardChange = (value) => {
        setWardName(value);

        if (!selectedProvince || !selectedDistrict) return;

        const fullAddress = `${value}, ${selectedDistrict}, ${selectedProvince}`;

        setField("address", fullAddress);

        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
        setField("mapUrl", mapUrl);
    };

    // ================= FORM =================
    const setField = (key, value) => {
        if (readOnly) return;

        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};

        if (!form.name.trim()) e.name = "Vui lòng nhập tên cơ sở";
        if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ";
        if (!form.city.trim()) e.city = "Vui lòng nhập thành phố";

        if (!form.phone.trim()) {
            e.phone = "Vui lòng nhập số điện thoại";
        }

        if (!form.email.trim()) {
            e.email = "Vui lòng nhập email";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            e.email = "Email không hợp lệ";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            mapUrl: form.mapUrl.trim(),
            isActive: form.isActive,
        };

        await onSubmit?.(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* NAME */}
            <Input
                label="Tên cơ sở"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                error={errors.name}
                disabled={loading || readOnly}
            />

            {/* PROVINCE */}
            <Select
                label="Tỉnh / Thành"
                required
                value={provinceCode}
                onChange={(e) => handleProvinceChange(e.target.value)}
                options={[
                    { value: "", label: "-- Chọn tỉnh --" },
                    ...provinces.map((p) => ({
                        value: p.code,
                        label: p.name
                    }))
                ]}
            />

            {/* DISTRICT */}
            <Select
                label="Quận / Huyện"
                value={districtCode}
                disabled={!provinceCode}
                onChange={(e) => handleDistrictChange(e.target.value)}
                options={[
                    { value: "", label: "-- Chọn huyện --" },
                    ...districts.map((d) => ({
                        value: d.code,
                        label: d.name
                    }))
                ]}
            />

            {/* WARD */}
            <Select
                label="Phường / Xã"
                value={wardName}
                disabled={!districtCode}
                onChange={(e) => handleWardChange(e.target.value)}
                options={[
                    { value: "", label: "-- Chọn xã --" },
                    ...wards.map((w) => ({
                        value: w.name,
                        label: w.name
                    }))
                ]}
            />

            {/* ADDRESS */}
            <Input
                label="Địa chỉ"
                required
                value={form.address}
                error={errors.address}
                readOnly
            />

            {/* CITY */}
            <Input
                label="Thành phố"
                required
                value={form.city}
                error={errors.city}
                readOnly
            />

            {/* PHONE */}
            <Input
                label="Số điện thoại"
                required
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                error={errors.phone}
                disabled={loading || readOnly}
            />

            {/* EMAIL */}
            <Input
                label="Email"
                required
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={errors.email}
                disabled={loading || readOnly}
            />

            {/* MAP */}
            <Input
                label="Google Map URL"
                value={form.mapUrl}
                readOnly
            />

            {/* ACTIVE */}
            <div style={{ marginTop: 10 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setField("isActive", e.target.checked)}
                        disabled={loading || readOnly}
                    />
                    {" "}Hoạt động
                </label>
            </div>

            {/* ACTION */}
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 12,
            }}>
                <button
                    type="button"
                    className="Btn Btn--ghost"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Huỷ
                </button>

                <button
                    type="submit"
                    className="Btn Btn--primary"
                    disabled={loading || readOnly}
                >
                    {loading ? "Đang lưu..." : submitText}
                </button>
            </div>
        </form>
    );
}