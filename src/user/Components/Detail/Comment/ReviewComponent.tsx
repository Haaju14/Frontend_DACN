import React, { useState } from "react";
import { Avatar, Button, Input, Rate, notification } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../../../../service/comment/commentApi";
import { CommentUserData, ReviewComponentProps } from "../../../../Model/Model";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
const { TextArea } = Input;

const convertDateAndTime = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const ReviewComponent: React.FC<ReviewComponentProps> = ({ maPhong }) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const queryClient = useQueryClient();

  // Define the mutation for adding a comment
  const mutation = useMutation({
    mutationFn: commentApi.addComment,
    onSuccess: () => {
      // Invalidate the query to refetch the comments
      queryClient.invalidateQueries({
        queryKey: ["commentListByMaPhongApi", maPhong],
      });
      // Reset form after success
      setRating(0);
      setReviewText("");
      notification.success({
        message: "Success",
        description: "Comment added successfully!",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message,
      });
    },
  });
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      notification.open({
        message: "Notification",
        description: "Review text cannot be empty.",
      });
      return;
    }

    if (userLogin && maPhong && reviewText !== "") {
      const commentUser: CommentUserData = {
        maPhong: maPhong,
        maNguoiBinhLuan: userLogin.user.id,
        ngayBinhLuan: convertDateAndTime(new Date().toISOString()).toString(),
        noiDung: reviewText,
        saoBinhLuan: rating,
      };

      mutation.mutate(commentUser);

      setRating(0);
      setReviewText("");
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "4px",
        maxWidth: "800px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <Avatar
          size={48}
          style={{ backgroundColor: "#87d068" }}
          icon={<img src="path/to/avatar.jpg" alt="avatar" />}
        />
        <span
          style={{ marginLeft: "16px", fontWeight: "bold", fontSize: "18px" }}
        >
          {userLogin?.user?.name}
        </span>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <Rate onChange={handleRatingChange} value={rating} />
      </div>
      <div style={{ marginBottom: "16px", width: "100%" }}>
        <TextArea
          rows={4}
          placeholder="Write something..."
          value={reviewText}
          onChange={handleReviewTextChange}
          style={{ resize: "none", width: "100%" }}
        />
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
      >
        Đánh giá
      </Button>
    </div>
  );
};

export default ReviewComponent;
