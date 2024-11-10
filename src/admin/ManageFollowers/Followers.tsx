import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import axios from "axios";
import { BASE_URL } from "../../util/fetchfromAPI";
import '../../../public/admin/css/followers.css';
const ManageFollowers = () => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const getToken = () => localStorage.getItem("token");
    // Fetch danh sách học viên theo dõi
    useEffect(() => {
        const fetchFollowers = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const response = await axios.get(`${BASE_URL}/followers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFollowers(response.data.followers); // Lưu danh sách học viên theo dõi
            } catch (error) {
                console.error("Error fetching followers:", error);
                message.error("Có lỗi xảy ra khi tải danh sách học viên.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, []);

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    return (
        <div className="manage-followers-container">
            <h1>Danh sách học viên theo dõi</h1>
            <div className="follower-grid">
                {followers.length === 0 ? (
                    <p className="no-followers-message">Hiện chưa có học viên nào theo dõi bạn.</p>
                ) : (
                    followers.map((follower) => (
                        <div key={follower.id} className="follower-card">
                            <img
                                src={follower.avatar || "/default-avatar.png"}
                                alt={follower.fullName}
                                className="follower-avatar"
                            />
                            <div className="follower-name">{follower.fullName}</div>
                            <div className="follower-email">{follower.email}</div>
                            <div className="follower-gender">{follower.gioiTinh}</div>
                            <div className="follower-date">
                                Ngày theo dõi: {new Date(follower.followDate).toLocaleDateString()}
                            </div>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageFollowers;
