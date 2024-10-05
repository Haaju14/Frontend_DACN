// Notification.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import { RootState } from "../../../redux/store";
import { hideNotification } from "../../../redux/reducers/notificationReducer";

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const { visible, message } = useSelector(
    (state: RootState) => state.notificationReducer
  );

  React.useEffect(() => {
    if (visible) {
      notification.open({
        message,
        duration: 0, // Keep it open until manually closed
        onClose: () => dispatch(hideNotification()),
      });
    }
  }, [visible, message, dispatch]);

  return null; // This component does not need to render anything
};

export default Notification;
