import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/Profile/ProfileForm";
import AddressList from "@/components/Profile/AddressList";
import "@/components/Authenticator/ProfilePage.scss";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await userService.getMyProfile();
            setProfile(res.data.data);
        } catch (err) {
            console.error("Lỗi lấy profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Không có dữ liệu</div>;

    return (
        <div className="profile-page">
            <div className="profile-header-bar">
                <button onClick={() => navigate("/home")}>
                    ← Trang chủ
                </button>

                <h2>Hồ sơ cá nhân</h2>
            </div>

            <div className="profile-layout">
                <ProfileForm profile={profile} onReload={fetchProfile} />
                <AddressList profile={profile} onReload={fetchProfile} />
            </div>
        </div>
    );
}