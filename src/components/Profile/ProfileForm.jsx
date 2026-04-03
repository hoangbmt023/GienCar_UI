import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import "./ProfileForm.scss";

export default function ProfileForm() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const res = await userService.getMyProfile();
        setProfile(res.data.data);
        setForm(res.data.data);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];

            setForm({ ...form, avatarFile: file });

            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async () => {
        await userService.updateMyProfile(form);
        fetchProfile();
    };

    if (!profile) return null;

    return (
        <div className="profile-card">

            {/* HEADER */}
            <div className="profile-header"></div>

            {/* INFO */}
            <div className="profile-info">
                <div className="avatar">
                    <img src={preview || profile.avatar || "https://i.pravatar.cc/100"} />
                    <input type="file" name="avatarFile" onChange={handleChange} />
                </div>

                <div className="user-meta">
                    <h2>{profile.fullName || "No Name"}</h2>
                    <p>{profile.userId}</p>
                </div>

                <button className="edit-btn" onClick={handleSubmit}>
                    Save
                </button>
            </div>

            {/* FORM */}
            <div className="profile-form-grid">
                <div>
                    <label>Full Name</label>
                    <input
                        name="fullName"
                        value={form.fullName || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="full">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}