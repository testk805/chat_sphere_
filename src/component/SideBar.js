import React, { useEffect, useState } from "react";
import profile from "../assets/images/boy.png";
import { useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react";
import axios from "axios";
import SuccessPop from "../component/SuccessPop";
import ErrorPop from "../component/EroorPop";
import Loader from "../component/Loader";
import { IconMenu2 } from "@tabler/icons-react";

function SideBar({ setSelectedFriendId, setSelectedUserId }) {
  const navigate = useNavigate();
  const [userEmail, setuserEmail] = useState("");
  const [Eroor, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [showEroor, setShowError] = useState(false);
  const [loader, setloader] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [friendlist, setfriendlist] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);

  const apiUrl = "https://chat-sphere-tkbs.onrender.com/api/";

  useEffect(() => {
    let storedData = localStorage.getItem("userData");
    let parsedData = JSON.parse(storedData);
    setuserEmail(parsedData);
    if (!storedData) {
      navigate("/");
    }
  }, [navigate]);

  const handlelogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
      getCityFromGPS();
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail || lat || long) {
      fetchFriendData();
    }
  }, [userEmail, long, lat]);

  useEffect(() => {
    Updatelastlogin();
  }, [userEmail])

  const Updatelastlogin = async () => {
    try {
      const response = await axios.post(apiUrl + "Updatelastlogin", { userEmail });
      
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.post(apiUrl + "fetchuserdata", {
        userEmail,
        lat,
        long,
      });
      setLoginData(response.data.data[0]);
      setSelectedUserId(response.data.data[0].id);
    } catch (error) {
      return console.log(error);
    }
  };

  const getCityFromGPS = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setlat(lat);
          setlong(lon);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            const addressParts = Object.values(data.address)
              .filter((part) => part && part.trim() !== "")
              .join(", ");

            let formdata = {
              userEmail: userEmail,
              lat: lat,
              lon: lon,
              addressParts: addressParts, // Contains all address components
            };

            try {
              const response = await axios.post(apiUrl + "updatelocation", {
                formdata,
              });
            } catch (error) {
              return console.log(error);
            }
          } catch (error) {
            console.error("Error fetching address data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const fetchFriendData = async () => {
    try {
      const response = await axios.post(apiUrl + "fetchFriendData", {
        userEmail,
        lat,
        long,
      });

      setfriendlist(response.data.data);
    } catch (error) {
      return console.log(error);
    }
  };

  const handlefriend = (id) => {
    setSelectedFriendId(id);
    setActiveFriend(id);
    Updatelastlogin();
  };
  const [openmenu, setopenmenu] = useState(false);
  const openNav = () => {
    setopenmenu(!openmenu);
  };

  return (
    <div>
      {showEroor && (
        <ErrorPop
          message={Eroor}
          onClose={() => {
            setShowError(false);
            setError("");
          }}
        />
      )}
      {ShowSuccess && (
        <SuccessPop
          message={Success}
          onClose={() => {
            setShowSuccess(false);
            setSuccess("");
          }}
        />
      )}
      {loader && <Loader />}
      <section className={`side_bar d-block py-5 ${openmenu && "w-100"}`}>
        <button onClick={handlelogout} className="logout">
          <IconLogout stroke={2} />
        </button>
        <button onClick={openNav} className="close_nav">
          <IconMenu2 stroke={2} />
        </button>

        <div className="px-4">
          <div className="d-flex flex-column gap-5">
            <div className="d-flex flex-column gap-3 justify-content-center align-items-center w-100">
              <div className="d-block profile">
                {loginData && (
                  <img
                    className="w-100 h-100"
                    alt="profile"
                    src={`https://chat-sphere-tkbs.onrender.com${loginData.image}`}
                    onError={(e) => (e.target.src = `${loginData.image}`)} // Fallback if image is missing
                  />
                )}
                {!loginData && (
                  <img className="w-100 h-100" src={profile} alt="profile" />
                )}
              </div>

              <h3>{loginData && loginData.name ? loginData.name : "User"}</h3>
            </div>
            <ul className="list_user d-flex flex-column gap-2">
              <li className="mb-2">
                <h1>User List</h1>
              </li>
              {friendlist.map((item, index) => {
                return (
                  <li key={index}>
                    <button
                      onClick={() => handlefriend(item.id)}
                      className={`d-flex align-items-center gap-3 w-100 ${activeFriend === item.id ? "active_ul" : ""
                        }`}
                    >
                      <div className="d-block user-profile ">
                        <img
                          className="w-100 h-100 rounded-5"
                          alt="profile"
                          src={`https://chat-sphere-tkbs.onrender.com${item.image}`}
                          onError={(e) => (e.target.src = `${item.image}`)} // Fallback if image is missing
                        />
                      </div>
                      <div className="d-flex flex-column gap-0">
                        <h3 className="text-start">{item.name}</h3>
                        <div className="d-flex align-items-start  justify-content-between">
                          <p className="text-start">
                            {parseFloat(item.distance_km).toFixed(2)} KM
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SideBar;
