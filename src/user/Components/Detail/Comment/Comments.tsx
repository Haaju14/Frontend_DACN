import React from "react";
import "../../../../css/Comment.css";
import { CommentsProps } from "../../../../Model/Model";

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  const sortedComments = comments?.sort((a, b) => b.id - a.id);

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {sortedComments?.length ? (
        <div className="d-flex flex-wrap">
          {comments.map((comment) => (
            <div
              className="media mb-3"
              key={comment.id}
              style={{ flex: "1 0 45%", margin: "0.5rem" }} // Adjust width and spacing
            >
              <img
                src={comment.avatar}
                className="mr-3 rounded-circle"
                alt="avatar"
                style={{ width: "50px" }}
              />
              <div className="media-body">
                <h5 className="mt-0">
                  {comment.tenNguoiBinhLuan}
                  <span className="text-warning">
                    {"★".repeat(comment.saoBinhLuan)}
                  </span>
                </h5>
                <p className="text-muted">
                  {new Date(comment.ngayBinhLuan).toLocaleDateString()}
                </p>
                <p>{comment.noiDung}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No comments available.</div>
      )}
    </div>
  );
};

export default Comments;
