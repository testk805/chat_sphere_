import React, { useEffect, useState, useRef } from "react";
import profile from "../assets/images/boy.png";
import {
  IconPhone,
  IconListTree,
  IconVideoPlus,
  IconPhotoScan,
  IconFileStack,
  IconBrandTelegram,
} from "@tabler/icons-react";
import axios from "axios";
import { io } from "socket.io-client";
import Peer from "peerjs";

export default function ChatBox({ selectedFriendId, selectedUserId }) {
  const apiUrl = " https://chat-sphere-tkbs.onrender.com/api/";
  const [friendData, setFriendData] = useState(null);
  const socket = useRef(null);
  const [loading, setLoading] = useState(true);
  const [usermessage, setusermessage] = useState([]);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loader, setloader] = useState(false);
  const [sendHide, setsendHide] = useState(true);

  const [imagePreview, setImagePreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [userEmail, setuserEmail] = useState("");
  const [me, setMe] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const peerRef = useRef(null);
  const myAudio = useRef();
  const userAudio = useRef();
  const socketRef = useRef();

  const connectionRef = useRef();

  useEffect(() => {
    let storedData = localStorage.getItem("userData");
    let parsedData = JSON.parse(storedData);
    setuserEmail(parsedData);
  }, []);


  useEffect(() => {
    socketRef.current = io("wss://chat-sphere-tkbs.onrender.com/", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server, waiting for ID...");
    });

    socketRef.current.on("socketId", (id) => {
      console.log("Received socket ID:", id);
      setMe(id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("My Peer ID:", id);
      setMe(id);
    });

    peer.on("call", (call) => {
      console.log("📞 Incoming call from:", call.peer);
      setReceivingCall(true);
      setCaller(call.peer);
      setCallerSignal(call);
    });

    socketRef.current.on("callIncoming", (data) => {
      console.log(`📞 Incoming call from ${data.from}`);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socketRef.current.on("callAccepted", (signal) => {
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
        setCallAccepted(true);
      }
    });

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (socketRef.current) socketRef.current.disconnect(); // ✅ Fix: Use socketRef
    };
  }, []);

  const callUser = (id) => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const hasMic = devices.some((device) => device.kind === "audioinput");
      const constraints = hasMic ? { audio: true } : {};

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (hasMic) {
            myAudio.current.srcObject = stream;
          }

          console.log("🔗 Calling:", id);
          const call = peerRef.current.call(id, stream);

          call.on("stream", (userStream) => {
            userAudio.current.srcObject = userStream;
          });

          socket.emit("callUser", {
            userToCall: id,
            signalData: call.peer, // ✅ Fix: Use call.peer instead of call.signal
            from: me,
          });

          connectionRef.current = call;
        })
        .catch((error) => {
          console.error("❌ Error accessing microphone:", error);
        });
    });
  };

  const answerCall = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setCallAccepted(true);
        userAudio.current.srcObject = stream;

        console.log("✅ Answering call...");
        callerSignal.answer(stream); // ✅ Fix: Properly answer the call

        callerSignal.on("stream", (userStream) => {
          myAudio.current.srcObject = userStream;
        });

        socket.emit("answerCall", {
          signal: callerSignal,
          to: caller,
        });

        connectionRef.current = callerSignal;
      })
      .catch((err) => {
        console.error("❌ Audio device error:", err);
      });
  };

  useEffect(() => {
    if (me) {
      savePeerid(me);
    }
  }, [me]);

  const savePeerid = async (value) => {
    try {
      const response = await axios.post(apiUrl + "savePeerid", {
        value,
        userEmail,
      });
      // console.log(response.data);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Handle Document Selection
  const handleDocChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocPreview(file.name); // Store only the file name for preview
    }
  };

  // Remove Image
  const removeImage = () => {
    setImagePreview(null);
    document.getElementById("fileInput").value = "";
  };

  // Remove Document
  const removeDoc = () => {
    setDocPreview(null);
    document.getElementById("filedoc").value = "";
  };

  useEffect(() => {
    socket.current = io("wss://chat-sphere-tkbs.onrender.com", { transports: ["websocket"] });

    if (selectedUserId) {
      socket.current.emit("userOnline", selectedUserId);
    }

    socket.current.on("newMessage", (message) => {
      if (message.reciver_id === selectedUserId) {
        setusermessage((prev) => [...prev, message]);
      }
    });

    socket.current.on("refreshData", (data) => {
      console.log("🔄 Refreshing API data...", data);

      if (!data || !data.senderId || !data.receiverId) {
        console.error("❌ Invalid refreshData event received:", data);
        return;
      }

      if (
        (data.senderId === selectedFriendId &&
          data.receiverId === selectedUserId) ||
        (data.senderId === selectedUserId &&
          data.receiverId === selectedFriendId)
      ) {
        console.log("✅ Refreshing data for selected chat...");
        getUserChat();
      }
    });

    socket.current.on("typing", ({ senderId, receiverId }) => {
      if (receiverId === selectedUserId) {
        setTypingUser(senderId);
        setIsTyping(true);
      }
    });

    socket.current.on("stopTyping", ({ senderId, receiverId }) => {
      if (receiverId === selectedUserId) {
        setTypingUser(null);
        setIsTyping(false);
      }
    });

    // 🟢 Listen for Online Users
    socket.current.on("updateOnlineUsers", (users) => {
      console.log("🟢 Online Users:", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.current.off("newMessage");
      socket.current.off("refreshData");
      socket.current.off("typing");
      socket.current.off("stopTyping");
      socket.current.off("updateOnlineUsers");
      socket.current.disconnect();
    };
  }, [selectedFriendId, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [usermessage]);

  useEffect(() => {
    if (selectedFriendId) {
      getFriendChat();
    }
  }, [selectedFriendId]);

  useEffect(() => {
    if (selectedFriendId && selectedUserId) {
      getUserChat();
    }
  }, [selectedFriendId, selectedUserId]);

  const getUserChat = async () => {
    try {
      const response = await axios.post(apiUrl + "getUserChat", {
        sender_id: selectedUserId,
        reciver_id: selectedFriendId,
      });
      setusermessage(response.data.data);
    } catch (error) {
      return console.log(error);
    }
  };

  const getFriendChat = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl + "getfriendchat", {
        id: selectedFriendId,
      });
      setFriendData(response.data.data || {}); // Ensure it’s an object
    } catch (error) {
      console.log(error);
      setFriendData(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center h-100vh justify-content-center">
        <h1 className="text-center">Welcome to Chat Sphere.</h1>
      </div>
    );
  }

  if (!friendData) {
    return <p>No friend selected.</p>;
  }

  const OpenFilePhoto = () => {
    document.getElementById("fileInput").click();
  };

  const OpenFiledoc = () => {
    document.getElementById("filedoc").click();
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    setloader(true);
    setsendHide(false);
    setImagePreview(false);
    const formData = new FormData();
    formData.append("sender_id", selectedUserId); // Replace with actual sender ID
    formData.append("reciver_id", selectedFriendId); // Replace with actual receiver ID
    formData.append("message", e.target.send_message.value.trim());
    formData.append("status", "sent"); // Default status

    const mediaFile = e.target.fileInput.files[0];
    const docFile = e.target.filedoc.files[0];

    if (mediaFile) {
      formData.append("file", mediaFile);
      formData.append("file_type", mediaFile.type); // Fix: Send MIME type
    } else if (docFile) {
      formData.append("file", docFile);
      formData.append("file_type", docFile.type); // Fix: Send MIME type
    } else {
      formData.append("file_type", "text");
    }

    if (!mediaFile && !docFile && !e.target.send_message.value.trim()) {
      console.log("Please enter a message or upload a file.");
      return;
    }

    try {
      const response = await fetch(apiUrl + "sendMessage", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      if (result.status === 1) {
        socket.current.emit("sendMessage", {
          senderId: selectedUserId,
          receiverId: selectedFriendId,
          message: result.data,
        });
        setloader(false);
        setsendHide(true);
        getUserChat();
        e.target.reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    socket.current.emit("typing", {
      senderId: selectedUserId,
      receiverId: selectedFriendId,
    });

    setTimeout(() => {
      socket.current.emit("stopTyping", {
        senderId: selectedUserId,
        receiverId: selectedFriendId,
      });
    }, 2000);
  };

  return (
    <div>
      <section className="d-block chat_box">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex align-items-center justify-content-between chat_header gap-3 px-4">
            <div className="d-flex align-items-center w-100 gap-3">
              <div className="d-block flex-shrink-0 user-profile">
                <img
                  className="h-100 rounded-5 w-100"
                  alt="profile"
                  src={` https://chat-sphere-tkbs.onrender.com${friendData.image}`}
                  onError={(e) => (e.target.src = `${friendData.image}`)} // Fallback if image is missing
                />
              </div>
              <div>
                <h4>{friendData.name}</h4>
                {onlineUsers.includes(selectedFriendId) ? (
                  <p className="text-success"> Online</p>
                ) : (
                  <p className="text-muted"> Offline</p>
                )}
              </div>
              {isTyping && typingUser === selectedFriendId && (
                <p className="text-muted">Typing...</p>
              )}
            </div>
            <div className="d-flex align-items-center calls gap-3 pe-2">
              <audio
                ref={myAudio}
                autoPlay
                controls
                style={{ display: "none" }}
              />
              <audio
                ref={userAudio}
                autoPlay
                controls
                style={{ display: "none" }}
              />
              <button onClick={() => callUser(friendData.peer_ID)}>
                <IconPhone stroke={2} /> Call
              </button>
              {receivingCall && (
                <button onClick={answerCall}>Answer Call</button>
              )}
              <audio ref={myAudio} autoPlay />
              <audio ref={userAudio} autoPlay />
              <button>
                <IconVideoPlus stroke={2} />
              </button>
              <button>
                <IconListTree stroke={2} />
              </button>
            </div>
          </div>
          <div className="d-flex flex-column gap-3 main_chat px-4">
            <ul className="d-flex flex-column list-unstyled gap-2 pe-2">
              {usermessage.map((message, index) => (
                <li
                  key={index}
                  className={
                    message.sender_id === selectedUserId
                      ? "right_mess text-end"
                      : "left_mess"
                  }
                >
                  <div
                    className={`chat-bubble ${message.sender_id === selectedFriendId
                      ? "received"
                      : "sent"
                      }`}
                  >
                    {/* Text Message */}
                    {message.message && (
                      <p className="px-2">{message.message}</p>
                    )}

                    {/* Image File */}
                    {message.file_type?.startsWith("image/") && (
                      <img
                        src={` https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                        alt="sent-img"
                        className="chat-image"
                        style={{ maxWidth: "200px", borderRadius: "8px" }}
                      />
                    )}

                    {/* Video File */}
                    {message.file_type?.startsWith("video/") && (
                      <video controls width="200">
                        <source
                          src={` https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                          type={message.file_type}
                        />
                        Your browser does not support videos.
                      </video>
                    )}

                    {/* Audio File */}
                    {message.file_type?.startsWith("audio/") && (
                      <audio controls>
                        <source
                          src={` https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                          type={message.file_type}
                        />
                        Your browser does not support audio playback.
                      </audio>
                    )}

                    {/* Document File (PDF, DOCX, TXT, etc.) */}
                    {["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(message.file_type) && (
                      <a
                        href={`https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mt-2"
                      >
                        📄 View Document
                      </a>
                    )}

                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>

            <form
              onSubmit={handleMessage}
              className="d-flex align-items-center position-relative gap-3 pe-2"
            >
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                style={{ display: "none" }}
                accept="image/*, video/*, audio/*"
                onChange={handleImageChange}
              />
              {/* Document Preview */}
              {docPreview && (
                <div className="preview-container py-4">
                  <span className="text-white py-4 word">{docPreview}</span>
                  <button
                    onClick={removeDoc}
                    type="button"
                    className="remove-preview"
                  >
                    ❌
                  </button>
                </div>
              )}
              {imagePreview && (
                <div className="preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-100 w-100 preview-image"
                  />
                  <button
                    onClick={removeImage}
                    type="button"
                    className="remove-preview"
                  >
                    ❌
                  </button>
                </div>
              )}
              <input
                type="file"
                name="filedoc"
                id="filedoc"
                style={{ display: "none" }}
                accept=".doc,.docx,.pdf,.txt"
                onChange={handleDocChange}
              />
              <button onClick={OpenFilePhoto} type="button">
                <IconPhotoScan />
              </button>
              <button onClick={OpenFiledoc} type="button">
                <IconFileStack />
              </button>
              <input
                className="w-100"
                type="text"
                placeholder="Enter Message"
                name="send_message"
                onKeyDown={handleTyping}
              />
              <div className="position-relative" style={{ height: "40px" }}>
                {loader && (
                  <div className="main_loader">
                    <div class="loader"></div>
                  </div>
                )}

                <button type="submit">
                  {sendHide && <IconBrandTelegram />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
