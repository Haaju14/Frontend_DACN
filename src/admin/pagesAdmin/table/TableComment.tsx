import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { commentApi } from "../../../service/comment/commentApi";
import { Comment } from "../../../Model/Manage";

const TableComment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const pageSize = 6;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentApi.getComment();
        setTotal(data.length);
        const paginatedData = data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        setComments(paginatedData);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Comments</h3>
        </div>

        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Room Code</th>
                      <th>Customer's Code</th>
                      <th>Date Time</th>
                      <th>Feedback</th>
                      <th>Evaluate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.maPhong}</td>
                        <td>{comment.maNguoiBinhLuan}</td>
                        <td>
                          {new Date(
                            parseInt(comment.ngayBinhLuan)
                          ).toLocaleString()}
                        </td>
                        <td
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {comment.noiDung}
                        </td>
                        <td>{comment.saoBinhLuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                align="center"
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComment;
