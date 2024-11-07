import axios from 'axios';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BASE_URL } from '../../../util/fetchfromAPI';
import Loading from '../Antd/Loading';
import React, { useState } from 'react';

interface KhoaHocData {
    IDKhoaHoc: number;
    IDDanhMuc: number;
    TenKhoaHoc: string;
    MoTaKhoaHoc: string;
    HinhAnh: string;
    NgayDang: string;
    LuotXem: number;
    SoLuongHocVien: number;
    GiamGia: number;
    LoaiKhoaHoc: string;
    GiaTien: string;
}

interface BinhLuanData {
    IDBinhLuan: number;
    IDKhoaHoc: number;
    NoiDung: string;
    IDNguoiDung: string; 
    ThoiGian: string; 
    TenNguoiDung: string;
}

interface NhanXetData {  
    IDNhanXet:number;
    IDKhoaHoc: number;
    IDNguoiDung: string; 
    NoiDung: string;
    XepLoai: string; 
    ThoiGian: string;
}

interface GiangVienData {
    IDGiangVien: number;
    TenGiangVien: string;
    ChucDanh: string;
    HinhAnh: string;
    GioiThieu: string;
    Email: string;
    SoDienThoai: string;
    Role: string;
}

const Detail: React.FC = () => {
    const { id: IDKhoaHoc } = useParams();
    const userLogin = useSelector((state: RootState) => state.userReducer.userLogin);
    const token = localStorage.getItem("token");

    const [rating, setRating] = useState<string | null>(null); 
    const [comment, setComment] = useState<string>(''); 
    const [feedbackContent, setFeedbackContent] = useState<string>(''); 
    
    if (!token) {
        return <div>Please log in to view course details.</div>;
    }

    if (!userLogin || !userLogin.user) {
        return <div>Please log in to comment on the course.</div>;
    }

    const getCourseDetailAPI = async (IDKhoaHoc: string, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${IDKhoaHoc}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Dữ liệu chi tiết khóa học:', response.data); // Debug log
            return response.data;
        } catch (error: any) {
            console.error('Error:', error);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    };

        
    const getCommentsAPI = async (IDKhoaHoc: string, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/binh-luan/get/${IDKhoaHoc}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Dữ liệu bình luận :', response.data); // Debug log
            return response.data || []; // Đảm bảo trả về mảng
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    };

    const getUserInfoAPI = async (IDNguoiDung: string, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/user/profile/${IDNguoiDung}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching user info:', error);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    };

    const queryResultKhoaHocByID: UseQueryResult<KhoaHocData | undefined> = useQuery({
        queryKey: ["courseByIDApi", IDKhoaHoc || ""],
        queryFn: () => getCourseDetailAPI(IDKhoaHoc || "", token),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
   
    const queryResultBinhLuan: UseQueryResult<BinhLuanData[]> = useQuery({
        queryKey: ["comments", IDKhoaHoc || ""],
        queryFn: () => getCommentsAPI(IDKhoaHoc || "", token),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });

    if (queryResultKhoaHocByID.isLoading || queryResultBinhLuan.isLoading) {
        return <Loading />;
    }

    if (queryResultKhoaHocByID.isError) {
        return <div>Error: {(queryResultKhoaHocByID.error as Error).message}</div>;
    }

    if (queryResultBinhLuan.isError) {
        return <div>Error loading comments: {(queryResultBinhLuan.error as Error).message}</div>;
    }

    const KhoaHocData = queryResultKhoaHocByID.data;
    const comments = queryResultBinhLuan.data || [];

    if (!KhoaHocData) {
        return <div>No course details available.</div>;
    }

    const handleRegisterCourse = async () => {
        try {
            await axios.post(`${BASE_URL}/khoa-hoc-dang-ky/${IDKhoaHoc}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Đăng ký khóa học thành công!');
        } catch (error: any) {
            console.error('Error details:', error.response);
            message.error('Đã xảy ra lỗi trong quá trình đăng ký khóa học.');
        }
    };

    const handleSubmitComment = async () => {
        if (!comment) {
            message.error('Vui lòng nhập bình luận.');
            return;
        }
    
        try {
            const commentData: BinhLuanData = {
                IDBinhLuan: 0,
                IDKhoaHoc: Number(IDKhoaHoc),
                NoiDung: comment,
                IDNguoiDung: userLogin.user.IDNguoiDung.toString(),
                ThoiGian: new Date().toISOString(),
                TenNguoiDung: ''
            };
    
            console.log('Submitting comment data:', commentData); // Debug log
    
            await axios.post(`${BASE_URL}/binh-luan/post/${IDKhoaHoc}`, commentData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            message.success('Bình luận thành công!');
            setComment(''); 
            queryResultBinhLuan.refetch(); 
        } catch (error: any) {
            console.error('Error submitting comment:', error.response || error);
            message.error('Đã xảy ra lỗi trong quá trình gửi bình luận.');
        }
    };
    
    const handleSubmitFeedback = async () => {
        if (!rating || !feedbackContent) {  
            message.error('Vui lòng chọn đánh giá và nhập nội dung nhận xét.');
            return;
        }
        
        // Kiểm tra lại dữ liệu trước khi gửi
        const feedbackData: NhanXetData = {
            IDNhanXet:0,
            IDKhoaHoc: Number(IDKhoaHoc),
            IDNguoiDung: userLogin.user.IDNguoiDung.toString(),
            NoiDung: feedbackContent,
            XepLoai: rating,
            ThoiGian: new Date().toISOString(),
        };
        
        console.log('Submitting feedback data:', feedbackData);  // Log dữ liệu gửi lên
    
        try {
            const response = await axios.post(`${BASE_URL}/nhan-xet/add/${IDKhoaHoc}`, feedbackData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Feedback submitted successfully:', response);
            message.success('Đánh giá thành công!');
            setFeedbackContent(''); 
            setRating(null); 
        } catch (error: any) {
            // Log lỗi chi tiết từ server
            console.error('Error submitting feedback:', error.response || error.message);
            message.error('Đã xảy ra lỗi trong quá trình gửi đánh giá.');
        }
    };
    

    return (
        <section className="ftco-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                    <div className="course-detail">
                        <h2 className="mb-4">{KhoaHocData.TenKhoaHoc || "Tên khóa học không có"}</h2>
                        <div className="single-slider owl-carousel mb-4">
                            <div className="item">
                            <img
                                src={KhoaHocData.HinhAnh || ""}
                                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                            />
                            </div>
                            
                        </div>
                        <div className="course-info mt-4">
                            <ul className="list-unstyled">
                            {[
                                { title: "Mô tả khóa học", value: KhoaHocData.MoTaKhoaHoc || "Chưa có mô tả" },
                                { title: "Loại Khóa Học", value: KhoaHocData.LoaiKhoaHoc || "Chưa có loại" },
                                { title: "Số lượng học viên", value: KhoaHocData.SoLuongHocVien || "Chưa có thông tin" },
                            ].map((item, index) => (
                                <li key={index} className="d-flex justify-content-between">
                                <span>{item.title}:</span>
                                <span>{item.value}</span>
                                </li>
                            ))}    
                            </ul>
                        </div>
                        <button className="btn btn-primary" onClick={handleRegisterCourse}>
                            Đăng ký khóa học
                        </button>
                        </div>

                        {/* Feedback Section */}
                        <div className="feedback-section mt-5">
                            <h4>Gửi nhận xét</h4>
                            <textarea 
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                                placeholder="Nội dung nhận xét"
                                className="form-control mb-3"
                            />
                            <div>
                                <span>Đánh giá: </span>
                                <select value={rating || ''} onChange={(e) => setRating(e.target.value)} className="form-select mb-3">
                                    <option value="">Chọn đánh giá</option>
                                    <option value="Tích cực">Tích cực</option>
                                    <option value="Tiêu cực">Tiêu cực</option>
                                </select>
                            </div>
                            <button className="btn btn-success" onClick={handleSubmitFeedback}>
                                Gửi nhận xét
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section mt-5">
                            <h4>Bình luận</h4>
                            <div className="comments-list">
                                {comments.length > 0 ? comments.map((comment) => (
                                    <div key={comment.IDBinhLuan} className="comment-item">
                                        <p><strong>{comment.IDNguoiDung}</strong>: {comment.NoiDung}</p>
                                        <span>{new Date(comment.ThoiGian).toLocaleString()}</span>
                                    </div>
                                )) : <p>Chưa có bình luận nào.</p>}
                            </div>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Nội dung bình luận"
                                className="form-control mb-3"
                            />
                            <button className="btn btn-primary" onClick={handleSubmitComment}>
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Detail;
