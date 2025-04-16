import React, { useState } from "react";
import SideBar from "../component/SideBar";
import ChatBox from "../component/ChatBox";

export default function Home() {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  return (
    <div>
      <section className="d-block ">
        <div className="p-0">
          <div className="row">
            <div className="col-md-3 p-0">
              <SideBar
                setSelectedFriendId={setSelectedFriendId}
                setSelectedUserId={setSelectedUserId}
              />
            </div>
            <div className="col-md-9 p-md-0 x px-3">
              <ChatBox
                selectedFriendId={selectedFriendId}
                selectedUserId={selectedUserId}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
