import React, { useState, useEffect, useRef } from "react";
import "../../../../public/user/css/style.css";

const Chatbox: React.FC = () => {
  // Lấy trạng thái isOpen và messages từ localStorage (nếu có)
  const savedIsOpen = localStorage.getItem("chatboxIsOpen");
  const savedMessages = localStorage.getItem("chatboxMessages");

  // Khôi phục trạng thái mở/đóng và tin nhắn từ localStorage nếu có
  const [isOpen, setIsOpen] = useState(savedIsOpen === "true"); // Mặc định là false nếu không có dữ liệu
  const [message, setMessage] = useState(""); 
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "support" }[]>(savedMessages ? JSON.parse(savedMessages) : []); // Khôi phục tin nhắn từ localStorage nếu có

  const chatboxBodyRef = useRef<HTMLDivElement | null>(null);

  // Toggle trạng thái chatbox (mở/đóng)
  const toggleChatbox = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("chatboxIsOpen", newState.toString()); // Lưu trạng thái chatbox vào localStorage
      return newState;
    });
  };

  // Cập nhật giá trị tin nhắn khi người dùng nhập
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // Cập nhật tin nhắn với sender là "user"
      const newMessages: { text: string; sender: "user" | "support" }[] = [...messages, { text: message, sender: "user" }];
      setMessages(newMessages); // Cập nhật lại state
      setMessage(""); // Xóa tin nhắn sau khi gửi

      // Lưu các tin nhắn vào localStorage
      localStorage.setItem("chatboxMessages", JSON.stringify(newMessages));

      // Cuộn xuống chatbox khi có tin nhắn mới
      if (chatboxBodyRef.current) {
        chatboxBodyRef.current.scrollTop = chatboxBodyRef.current.scrollHeight;
      }
    }
  };

  return (
    <div className="chatbox-container">
      {!isOpen && (
        <div className="chatbox-icon" onClick={toggleChatbox}>
          <i className="fa fa-comments"></i>
        </div>
      )}

      {isOpen && (
        <div className="chatbox-content">
          <div className="chatbox-header">
            <h4>Chat với chúng tôi</h4>
            <button className="chatbox-close" onClick={toggleChatbox}>X</button> 
          </div>
          <div className="chatbox-body" ref={chatboxBodyRef}>
            <div className="chatbox-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chatbox-message ${msg.sender === "user" ? "user-message" : "support-message"}`}
                >
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn của bạn..."
            />
            <button onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
