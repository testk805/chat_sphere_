import React, { useEffect, useState, useRef } from "react";
import profile from "../assets/images/boy.png";
import {
  IconPhone,
  IconLineDashed,
  IconListTree,
  IconVideoPlus,
  IconPhotoScan,
  IconFileStack,
  IconBrandTelegram,
} from "@tabler/icons-react";
import axios from "axios";
import { io } from "socket.io-client";
import Peer from "peerjs";
import ringtone from "../assets/images/shiv_shama_he_mujme.mp3";

let ring = new Audio(ringtone);
ring.loop = true;

export default function ChatBox({ selectedFriendId, selectedUserId }) {
  const apiUrl = "https://chat-sphere-tkbs.onrender.com/api/";
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
  const chatContainerRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [userEmail, setuserEmail] = useState("");
  const [me, setMe] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [outgoingCall, setOutgoingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const [CallerName, setCallerName] = useState("");
  const [openUlIndex, setOpenUlIndex] = useState(null);
  const [CallerProfile, setCallerProfile] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isRinging, setIsRinging] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [showCallEnded, setShowCallEnded] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callTimer, setCallTimer] = useState("00:00");
  const [isVideoCall, setIsVideoCall] = useState(false); // Track video call
  const peerRef = useRef(null);
  const myAudio = useRef();
  const userAudio = useRef();
  const myVideo = useRef(); // Video ref for local stream
  const userVideo = useRef(); // Video ref for remote stream
  const socketRef = useRef();
  const [loginUser, setloginUser] = useState({
    name: "",
    email: "",
    profile: "",
  });
  const connectionRef = useRef();
  const lastMessageRef = useRef(null);

  const isLastMessageVisible = () => {
    if (!lastMessageRef.current) return false;
    const rect = lastMessageRef.current.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const markAsSeen = async () => {
    try {
      await SeenAllMessage(selectedFriendId, selectedUserId);
      socket.current.emit("SeenMessage", {
        senderId: selectedUserId,
        receiverId: selectedFriendId,
      });
    } catch (err) {
      console.error("markAsSeen error:", err);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      if (!isChatOpen || usermessage.length === 0) return;

      const lastMsg = usermessage[usermessage.length - 1];
      const isMyMessage = lastMsg.sender_id !== selectedUserId;

      if (isLastMessageVisible() && isMyMessage && lastMsg.status !== "seen") {
        markAsSeen();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [usermessage, isChatOpen]);

  const playRingtone = () => {
    ring.load();
    ring.play().catch((err) => console.error("Error playing ringtone:", err));
    setIsRinging(true);
  };

  const stopRingtone = () => {
    ring.pause();
    ring.currentTime = 0;
    setIsRinging(false);
  };

  const cleanupCall = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    setCallAccepted(false);
    setReceivingCall(false);
    setOutgoingCall(false);
    setIsVideoCall(false);
    setCallStartTime(null);
    setCallTimer("00:00");
    stopRingtone();

    [
      myAudio.current,
      userAudio.current,
      myVideo.current,
      userVideo.current,
    ].forEach((media) => {
      if (media?.srcObject) {
        media.srcObject.getTracks().forEach((track) => track.stop());
        media.srcObject = null;
      }
    });
  };

  useEffect(() => {
    let timerInterval;
    if (callAccepted && callStartTime) {
      timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - callStartTime) / 1000);
        const minutes = Math.floor(diff / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (diff % 60).toString().padStart(2, "0");
        setCallTimer(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [callAccepted, callStartTime]);

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
      console.log("Connected to server, ID:", socketRef.current.id);
    });

    socketRef.current.on("socketId", (id) => {
      console.log("Received socket ID:", id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("My Peer ID:", id);
      setMe(id);
      socketRef.current.emit("setPeerId", id);
    });

    peer.on("call", (call) => {
      console.log("📞 Incoming call from:", call.peer);
      console.log("🧑 Caller Info:", call.metadata?.callerInfo);
      setCallerName(call.metadata?.callerInfo.name);
      setCallerProfile(call.metadata?.callerInfo.profile);
      setReceivingCall(true);
      setCaller(call.peer);
      setCallerSignal(call);
      setIsVideoCall(!!call.metadata?.isVideo); // Check if video call
      playRingtone();
    });

    socketRef.current.on("callAccepted", (signal) => {
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
        setCallAccepted(true);
        setCallStartTime(new Date());
        stopRingtone();
      }
    });

    socketRef.current.on("callRejected", () => {
      console.log("❌ Call rejected by receiver");
      setCallRejected(true);
      setOutgoingCall(false);
      stopRingtone();
      setTimeout(() => setCallRejected(false), 3000);
    });

    socketRef.current.on("callCancelled", () => {
      setReceivingCall(false);
      stopRingtone();
    });

    socketRef.current.on("endCall", () => {
      cleanupCall();
      setShowCallEnded(true);
      setTimeout(() => setShowCallEnded(false), 3000);
    });

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (socketRef.current) socketRef.current.disconnect();
      stopRingtone();
    };
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const handledeleteMessage = async (id, type, file_url) => {
    try {
      const response = await axios.post(apiUrl + "handledeleteMessage", {
        id,
        type,
        file_url,
      });

      if (response.data.status === 1) {
        getUserChat();
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.post(apiUrl + "fetchuserdata", {
        userEmail,
      });
      const user = response.data.data[0];
      setloginUser({
        name: user.name,
        email: user.email,
        profile: user.image,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
          setOutgoingCall(true);
          playRingtone();

          const call = peerRef.current.call(id, stream, {
            metadata: {
              callerInfo: {
                name: loginUser.name,
                profile: loginUser.profile,
                peerId: id,
                isVideo: false, // Audio call
              },
            },
          });

          call.on("stream", (userStream) => {
            userAudio.current.srcObject = userStream;
            setCallAccepted(true);
            setOutgoingCall(false);
            setCallStartTime(new Date());
            stopRingtone();
          });

          call.on("close", () => {
            setCallEnded(true);
            setOutgoingCall(false);
            setCallAccepted(false);
            setCallStartTime(null);
            setCallTimer("00:00");
            stopRingtone();
          });

          socketRef.current.emit("callUser", {
            userToCall: id,
            signalData: { peerId: call.peer },
            from: me,
          });

          connectionRef.current = call;
        })
        .catch((error) => {
          console.error("❌ Error accessing microphone:", error);
        });
    });
  };

  const startVideoCall = (id) => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        console.log("🔗 Starting video call to:", id);
        setOutgoingCall(true);
        setIsVideoCall(true);
        playRingtone();

        const call = peerRef.current.call(id, stream, {
          metadata: {
            callerInfo: {
              name: loginUser.name,
              profile: loginUser.profile,
              peerId: id,
              isVideo: true, // Video call
            },
          },
        });

        call.on("stream", (userStream) => {
          userVideo.current.srcObject = userStream;
          setCallAccepted(true);
          setOutgoingCall(false);
          setCallStartTime(new Date());
          stopRingtone();
        });

        call.on("close", () => {
          setCallEnded(true);
          setCallAccepted(false);
          setOutgoingCall(false);
          setIsVideoCall(false);
          stopRingtone();
        });

        socketRef.current.emit("callUser", {
          userToCall: id,
          signalData: { peerId: call.peer },
          from: me,
        });

        connectionRef.current = call;
      })
      .catch((err) => {
        console.error("❌ Error accessing media devices:", err);
      });
  };

  const answerCall = () => {
    const constraints = isVideoCall
      ? {
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        }
      : { audio: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setCallAccepted(true);
        if (isVideoCall) {
          myVideo.current.srcObject = stream;
        } else {
          userAudio.current.srcObject = stream;
        }
        setCallStartTime(new Date());
        stopRingtone();

        console.log("✅ Answering call...");
        callerSignal.answer(stream);

        callerSignal.on("stream", (userStream) => {
          if (isVideoCall) {
            userVideo.current.srcObject = userStream;
          } else {
            myAudio.current.srcObject = userStream;
          }
        });

        socketRef.current.emit("answerCall", {
          signal: callerSignal,
          to: caller,
        });

        setReceivingCall(false);
        connectionRef.current = callerSignal;
      })
      .catch((err) => {
        console.error("❌ Media device error:", err);
      });
  };

  const rejectCall = () => {
    console.log("Rejecting call, sending to:", caller);
    socketRef.current.emit("rejectCall", { to: caller });
    setReceivingCall(false);
    stopRingtone();
  };

  const cancelCall = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    setOutgoingCall(false);
    setCallAccepted(false);
    setReceivingCall(false);
    setIsVideoCall(false);
    setCallStartTime(null);
    setCallTimer("00:00");
    stopRingtone();
    [
      myAudio.current,
      userAudio.current,
      myVideo.current,
      userVideo.current,
    ].forEach((media) => {
      if (media?.srcObject) {
        media.srcObject.getTracks().forEach((track) => track.stop());
      }
    });
    socketRef.current.emit(callAccepted ? "endCall" : "cancelCall", {
      to: callAccepted ? caller || friendData.peer_ID : friendData.peer_ID,
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleDocChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocPreview(file.name);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    document.getElementById("fileInput").value = "";
  };

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
      if (
        (data.senderId === selectedFriendId &&
          data.receiverId === selectedUserId) ||
        (data.senderId === selectedUserId &&
          data.receiverId === selectedFriendId)
      ) {
        getUserChat();
      }
    });

    socket.current.on("SeenMessage", ({ senderId, receiverId }) => {
      if (receiverId === selectedUserId && senderId === selectedFriendId) {
        getUserChat();
        console.log(`seen by ${senderId}`);
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

    socket.current.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("callCancelled", () => {
      setReceivingCall(false);
      stopRingtone();
    });

    return () => {
      socket.current.off("newMessage");
      socket.current.off("refreshData");
      socket.current.off("typing");
      socket.current.off("stopTyping");
      socket.current.off("updateOnlineUsers");
      socket.current.off("callCancelled");
      socket.current.disconnect();
    };
  }, [selectedFriendId, selectedUserId]);

  const [allMessagesSeen, setAllMessagesSeen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [usermessage]);

  useEffect(() => {
    if (!chatContainerRef.current || !messagesEndRef.current) return;

    // Create a flag to prevent multiple calls
    let isProcessing = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isProcessing) {
          isProcessing = true; // Set flag to prevent multiple calls
          SeenAllMessage(selectedFriendId, selectedUserId)
            .then(() => {
              setAllMessagesSeen(true);
              setTimeout(() => {
                setAllMessagesSeen(false);
                isProcessing = false; // Reset flag after timeout
              }, 3000);
            })
            .catch((err) => {
              console.error("Error in SeenAllMessage:", err);
              isProcessing = false; // Reset flag on error
            });
        }
      },
      {
        root: chatContainerRef.current,
        threshold: 1.0,
      }
    );

    // Observe the last message
    const currentMessagesEndRef = messagesEndRef.current;
    if (currentMessagesEndRef) {
      observer.observe(currentMessagesEndRef);
    }

    // Cleanup observer
    return () => {
      if (currentMessagesEndRef) {
        observer.unobserve(currentMessagesEndRef);
      }
      observer.disconnect(); // Ensure observer is fully disconnected
    };
  }, [selectedFriendId, selectedUserId]); // Remove usermessage from dependencies

  const SeenAllMessage = async (fid, uid) => {
    try {
      const response = await axios.post(apiUrl + "seenallmessage", {
        fid,
        uid,
      });
      if (response.data.status === 1) {
        socket.current.emit("SeenMessage", {
          senderId: uid,
          receiverId: fid,
        });
      }
    } catch (error) {
      console.error("Error in SeenAllMessage:", error);
    }
  };

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
      console.log(error);
    }
  };

  const getFriendChat = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl + "getfriendchat", {
        id: selectedFriendId,
      });
      setFriendData(response.data.data || {});
    } catch (error) {
      console.log(error);
      setFriendData(null);
    }
    setLoading(false);
  };

  const renderCallPopups = () => {
    if (!friendData) return null;

    return (
      <>
        {outgoingCall && !callAccepted && !callRejected && (
          <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-block flex-shrink-0 user-profile">
                <img
                  className="h-100 rounded-5 w-100"
                  alt="profile"
                  src={
                    friendData.image
                      ? `https://chat-sphere-tkbs.onrender.com${friendData.image}`
                      : profile
                  }
                  onError={(e) => (e.target.src = profile)}
                />
              </div>
              <div className="d-flex flex-column gap-0">
                <h4>{friendData.name || "Calling..."}</h4>
                <p className="text-success">Calling...</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button onClick={cancelCall} className="call_btn end">
                <img
                  className="w-100 h-100"
                  src={require("../assets/images/no-call.png")}
                  alt="Cancel Call"
                />
              </button>
            </div>
          </div>
        )}

        {receivingCall && !callAccepted && !callRejected && (
          <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-block flex-shrink-0 user-profile">
                <img
                  className="h-100 rounded-5 w-100"
                  alt="profile"
                  src={
                    CallerProfile
                      ? `https://chat-sphere-tkbs.onrender.com${CallerProfile}`
                      : profile
                  }
                  onError={(e) => (e.target.src = profile)}
                />
              </div>
              <div className="d-flex flex-column gap-0">
                <h4>{CallerName || "Unknown Caller"}</h4>
                <p className="text-success">
                  Incoming {isVideoCall ? "Video" : "Audio"} Call...
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button onClick={answerCall} className="call_btn answer">
                <img
                  className="w-100 h-100"
                  src={require("../assets/images/call.png")}
                  alt="Answer"
                />
              </button>
              <button onClick={rejectCall} className="call_btn end">
                <img
                  className="w-100 h-100"
                  src={require("../assets/images/no-call.png")}
                  alt="Reject"
                />
              </button>
            </div>
          </div>
        )}

        {callAccepted && !callRejected && (
          <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-block flex-shrink-0 user-profile">
                <img
                  className="h-100 rounded-5 w-100"
                  alt="profile"
                  src={
                    friendData.image
                      ? `https://chat-sphere-tkbs.onrender.com${friendData.image}`
                      : profile
                  }
                  onError={(e) => (e.target.src = profile)}
                />
              </div>
              <div className="d-flex flex-column gap-0">
                <h4>{friendData.name || "In Call"}</h4>
                <p className="text-success">
                  {isVideoCall ? "Video" : "Audio"} Call in Progress:{" "}
                  {callTimer}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button onClick={cancelCall} className="call_btn end">
                <img
                  className="w-100 h-100"
                  src={require("../assets/images/no-call.png")}
                  alt="End Call"
                />
              </button>
            </div>
          </div>
        )}

        {callRejected && (
          <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex flex-column gap-0">
                <h4>Call Rejected</h4>
                <p className="text-danger">
                  {friendData?.name || "User"} rejected your call.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCallEnded && (
          <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex flex-column gap-0">
                <h4>Call Ended</h4>
                <p className="text-muted">
                  Your call with {friendData?.name || "User"} has ended.
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center h-100vh justify-content-center chat_box">
        <h1 className="text-center">Welcome to Chat Sphere.</h1>
        <>
          {outgoingCall && !callAccepted && !callRejected && (
            <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-block flex-shrink-0 user-profile">
                  <img
                    className="h-100 rounded-5 w-100"
                    alt="profile"
                    src={
                      friendData.image
                        ? `https://chat-sphere-tkbs.onrender.com${friendData.image}`
                        : profile
                    }
                    onError={(e) => (e.target.src = profile)}
                  />
                </div>
                <div className="d-flex flex-column gap-0">
                  <h4>{friendData.name || "Calling..."}</h4>
                  <p className="text-success">Calling...</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button onClick={cancelCall} className="call_btn end">
                  <img
                    className="w-100 h-100"
                    src={require("../assets/images/no-call.png")}
                    alt="Cancel Call"
                  />
                </button>
              </div>
            </div>
          )}

          {receivingCall && !callAccepted && !callRejected && (
            <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-block flex-shrink-0 user-profile">
                  <img
                    className="h-100 rounded-5 w-100"
                    alt="profile"
                    src={
                      CallerProfile
                        ? `https://chat-sphere-tkbs.onrender.com${CallerProfile}`
                        : profile
                    }
                    onError={(e) => (e.target.src = profile)}
                  />
                </div>
                <div className="d-flex flex-column gap-0">
                  <h4>{CallerName || "Unknown Caller"}</h4>
                  <p className="text-success">
                    Incoming {isVideoCall ? "Video" : "Audio"} Call...
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button onClick={answerCall} className="call_btn answer">
                  <img
                    className="w-100 h-100"
                    src={require("../assets/images/call.png")}
                    alt="Answer"
                  />
                </button>
                <button onClick={rejectCall} className="call_btn end">
                  <img
                    className="w-100 h-100"
                    src={require("../assets/images/no-call.png")}
                    alt="Reject"
                  />
                </button>
              </div>
            </div>
          )}

          {callAccepted && !callRejected && (
            <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-block flex-shrink-0 user-profile">
                  <img
                    className="h-100 rounded-5 w-100"
                    alt="profile"
                    src={
                      friendData.image
                        ? `https://chat-sphere-tkbs.onrender.com${friendData.image}`
                        : profile
                    }
                    onError={(e) => (e.target.src = profile)}
                  />
                </div>
                <div className="d-flex flex-column gap-0">
                  <h4>{friendData.name || "In Call"}</h4>
                  <p className="text-success">
                    {isVideoCall ? "Video" : "Audio"} Call in Progress:{" "}
                    {callTimer}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button onClick={cancelCall} className="call_btn end">
                  <img
                    className="w-100 h-100"
                    src={require("../assets/images/no-call.png")}
                    alt="End Call"
                  />
                </button>
              </div>
            </div>
          )}

          {callRejected && (
            <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex flex-column gap-0">
                  <h4>Call Rejected</h4>
                  <p className="text-danger">
                    {friendData?.name || "User"} rejected your call.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showCallEnded && (
            <div className="call_pop d-flex align-items-center gap-4 justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex flex-column gap-0">
                  <h4>Call Ended</h4>
                  <p className="text-muted">
                    Your call with {friendData?.name || "User"} has ended.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
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
    formData.append("sender_id", selectedUserId);
    formData.append("reciver_id", selectedFriendId);
    formData.append("message", e.target.send_message.value.trim());
    formData.append("status", "sent");

    const mediaFile = e.target.fileInput.files[0];
    const docFile = e.target.filedoc.files[0];

    if (mediaFile) {
      formData.append("file", mediaFile);
      formData.append("file_type", mediaFile.type);
    } else if (docFile) {
      formData.append("file", docFile);
      formData.append("file_type", docFile.type);
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

  const handleOpenUl = (index) => {
    setOpenUlIndex(openUlIndex === index ? null : index);
  };

  const handleMessageClose = (index) => {
    setOpenUlIndex(openUlIndex === index ? null : index);
  };
  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // Difference in seconds

    if (diff < 60) {
      return "Just now";
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

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
                  src={`https://chat-sphere-tkbs.onrender.com${friendData.image}`}
                  onError={(e) => (e.target.src = profile)}
                />
              </div>

              <div>
                <h4>{friendData.name}</h4>
                {!isTyping && typingUser !== selectedFriendId && (
                  <p
                    className={
                      onlineUsers.includes(selectedFriendId)
                        ? "text-success"
                        : "text-muted"
                    }
                  >
                    {onlineUsers.includes(selectedFriendId)
                      ? "Online"
                      : timeAgo(friendData.last_login)}
                  </p>
                )}

                {isTyping && typingUser === selectedFriendId && (
                  <p className="text-success">Typing...</p>
                )}
              </div>
            </div>
            <div className="d-flex align-items-center calls gap-3 pe-2">
              <audio ref={myAudio} autoPlay style={{ display: "none" }} />
              <audio ref={userAudio} autoPlay style={{ display: "none" }} />
              <button
                onClick={() => callUser(friendData.peer_ID)}
                disabled={outgoingCall || receivingCall || callAccepted}
              >
                <IconPhone stroke={2} />
              </button>
              <button
                onClick={() => startVideoCall(friendData.peer_ID)}
                disabled={outgoingCall || receivingCall || callAccepted}
              >
                <IconVideoPlus stroke={2} />
              </button>
              <button>
                <IconListTree stroke={2} />
              </button>
            </div>
          </div>

          {callAccepted && isVideoCall && (
            <div className="video-container">
              <video
                ref={myVideo}
                autoPlay
                muted
                style={{ width: "300px", borderRadius: "8px" }}
              />
              <video
                ref={userVideo}
                autoPlay
                style={{ width: "300px", borderRadius: "8px" }}
              />
            </div>
          )}

          {renderCallPopups()}

          <div className="d-flex flex-column gap-3 main_chat px-4">
            <ul
              className="d-flex flex-column main_ul list-unstyled gap-2 pe-2"
              ref={chatContainerRef}
            >
              {usermessage.map((message, index) => (
                <li
                  key={index}
                  ref={index === usermessage.length - 1 ? lastMessageRef : null}
                  className={
                    message.sender_id === selectedUserId
                      ? "right_mess text-end"
                      : "left_mess"
                  }
                >
                  <div className="d-flex flex-column gap-0 message_width">
                    <div
                      className={`chat-bubble ${
                        message.sender_id === selectedFriendId
                          ? "received"
                          : "sent"
                      }`}
                    >
                      <div className="position-relative">
                        {message.message && (
                          <p className="px-2">{message.message}</p>
                        )}
                      </div>
                      {message.file_type?.startsWith("image/") && (
                        <img
                          src={`https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                          alt="sent-img"
                          className="chat-image"
                          style={{ maxWidth: "200px", borderRadius: "8px" }}
                        />
                      )}
                      {message.file_type?.startsWith("video/") && (
                        <video controls width="200">
                          <source
                            src={`https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                            type={message.file_type}
                          />
                          Your browser does not support videos.
                        </video>
                      )}
                      {message.file_type?.startsWith("audio/") && (
                        <audio controls>
                          <source
                            src={`https://chat-sphere-tkbs.onrender.com/${message.file_url}`}
                            type={message.file_type}
                          />
                          Your browser does not support audio playback.
                        </audio>
                      )}
                      {[
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "text/plain",
                      ].includes(message.file_type) && (
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
                    {message.sender_id === selectedUserId && (
                      <span className="seen_text">
                        {message.status}
                      </span>
                    )}
                  </div>
                  {message.sender_id !== selectedFriendId && (
                    <div className="position-relative message_delete">
                      <button
                        onClick={() => handleOpenUl(index)}
                        className="delete_dot_btn"
                      >
                        <IconLineDashed />
                      </button>
                      {openUlIndex === index && (
                        <ul className="dropdown-menu_ull">
                          <li>
                            <button
                              onClick={() =>
                                handledeleteMessage(
                                  message.id,
                                  message.file_type,
                                  message.file_url
                                )
                              }
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button onClick={() => handleMessageClose(index)}>
                              Cancel
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
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
                    <div className="loader"></div>
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
