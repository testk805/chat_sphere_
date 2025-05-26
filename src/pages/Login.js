import React, { useRef, useEffect, useState } from "react";
import Slider from "../component/ImageSlider";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Corrected import
import SuccessPop from "../component/SuccessPop";
import ErrorPop from "../component/EroorPop";
import Loader from "../component/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [Create, setCreate] = useState(false);
  const [HideCreate, seHideCreate] = useState(true);
  const [Eroor, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [showEroor, setShowError] = useState(false);
  const [city, setCity] = useState("");
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [LoginOtp, setLoginOtp] = useState(false);
  const [Login, setLogin] = useState(true);
  const [ShowOtp, setShowOtp] = useState(false);
  const [forgotShowOtp, setforgotShowOtp] = useState(false);
  const [forgotShowEnter, setforgotShowEnter] = useState(true);
  const [storedEmail, setStoredEmail] = useState("");
  const [forgot, setforgot] = useState(false);
  const [sendOtp, setsendOtp] = useState("Send OTP");
  const [loader, setloader] = useState(false);
  const [OtpSucess, setOtpSucess] = useState(false);
  const [verifyEmail, setverifyEmail] = useState("");
  const emailRef = useRef();
  const verifyOtp = useRef();
  const [CreateOtp, setCreateOtp] = useState(false);
  const [verifyedOtp, setverifyedOtp] = useState(false);
  const apiUrl = "https://chat-sphere-tkbs.onrender.com/api/";

  useEffect(() => {
    getCityFromGPS();
  }, []);

  const handleSuccess = async (response) => {
    const decoded = jwtDecode(response.credential);
    setUser(decoded);

    let formData = {
      name: decoded.name,
      image: decoded.picture,
      email: decoded.email,
      city: city,
      lat: lat,
      long: long,
    };

    localStorage.setItem("userData", JSON.stringify(formData.email));
    try {
      const response = await axios.post(apiUrl + "google", formData);
      
      if (response.data.status === 1) {
        setShowSuccess(true);
        setSuccess(response.data.message);
        setCreate(false);
        seHideCreate(true);

        setTimeout(() => {
          setShowSuccess(false);
          setSuccess("");
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFailure = () => {
    alert("Google Sign-In failed");
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  const CreateAccount = () => {
    setCreate(true);
    setLogin(false);
    setforgot(false);
    setLoginOtp(false);
  };

  const SignAccount = () => {
    setCreate(false);
    setLogin(true);
    setforgot(false);
    setLoginOtp(false);
  };
  const handleForgot = () => {
    setCreate(false);
    setLogin(false);
    setLoginOtp(false);
    setforgot(true);
  };

  const LoginWithOtp = () => {
    setCreate(false);
    setLogin(false);
    setforgot(false);
    setLoginOtp(true);
  };
  const getCityFromGPS = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // const lat = 32.10992705508668;
          // const lon = 76.27782228139625;
          setlat(lat);
          setlong(lon);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();

          const addressParts = [
            data.address.man_made,
            data.address.city,
            data.address.county,
            data.address.state,
            data.address.postcode,
          ];

          const formattedAddress = addressParts
            .filter((part) => part !== "")
            .join(",");

          setCity(data.display_name);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (Create) {
      handleCreate(e);
    } else {
      handleLogin(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.user_email.value;
    const pass = e.target.user_password.value;
    const cpass = e.target.user_cpassword.value;
    const otp = e.target.create_otp.value;

    if (pass !== cpass) {
      setShowError(true);
      setError("Confirm Passwords do not match.");
      setTimeout(() => {
        setShowError(false);
        setError("");
      }, 2000);
      return;
    }
    setloader(true);
    let formData = {
      name: name,
      email: email,
      pass: pass,
      cpass: cpass,
      city: city,
      lat: lat,
      long: long,
      otp: otp,
    };
    try {
      const response = await axios.post(apiUrl + "create", formData);
      
      if (response.data.status === 1) {
        setShowSuccess(true);
        setSuccess(response.data.message);
        e.target.name.value = "";
        e.target.user_email.value = "";
        e.target.user_password.value = "";
        e.target.user_cpassword.value = "";
        setCreate(false);
        setLogin(true);
        setloader(false);
        setTimeout(() => {
          setShowSuccess(false);
          setSuccess("");
        }, 2000);
      }
      if (response.data.status === 2) {
        setShowError(true);
        setError(response.data.message);
        setloader(false);
        setTimeout(() => {
          setShowError(false);
          setError("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    const user_email = e.target.user_email ? e.target.user_email.value : "";
    const otp = e.target.otp ? e.target.otp.value : "";

    if (!ShowOtp && user_email) {
      setloader(true);
      try {
        const response = await axios.post(apiUrl + "loginwithotp", {
          user_email,
        });
        
        if (response.data.success) {
          setSuccess(response.data.message);
          setloader(false);
          setShowSuccess(true);
          setShowOtp(true);
          setStoredEmail(user_email);
          setsendOtp("Login");
          setTimeout(() => {
            setSuccess("");
            setShowSuccess(false);
          }, 3000);
        } else {
          setError(response.data.message);
          setShowError(true);
          setloader(false);
          setTimeout(() => {
            setError("");
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (ShowOtp && otp) {
      setloader(true);
      try {
        const response = await axios.post(apiUrl + "otpauthicate", {
          storedEmail,
          otp,
        });
        
        if (response.data.success === true) {
          setSuccess(response.data.message);
          setShowSuccess(true);
          setloader(false);

          setTimeout(() => {
            setSuccess("");
            navigate("/home");
            localStorage.setItem("userData", JSON.stringify(storedEmail));
            setShowSuccess(false);
          }, 3000);
        } else if (response.data.success === false) {
          setError(response.data.message);
          setShowError(true);
          setloader(false);
          setTimeout(() => {
            setError("");
            setShowError(false);
            navigate("/home");
          }, 3000);
        }
      } catch (error) {
        return console.log(error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const user_email = e.target.user_email.value;
    const user_password = e.target.user_password.value;
    console.log(user_email, user_password);
    setloader(true);
    try {
      const response = await axios.post(apiUrl + "UserLogin", {
        user_email,
        user_password,
      });
      if (response.data.status === 1) {
        setSuccess(response.data.message);
        setShowSuccess(true);

        setTimeout(() => {
          setSuccess("");
          navigate("/home");
          localStorage.setItem("userData", JSON.stringify(user_email));
          setShowSuccess(false);
        }, 3000);
      }
      if (response.data.status === 0) {
        setError(response.data.message);
        setShowError(true);

        setTimeout(() => {
          setError("");
          setShowError(false);
        }, 3000);
      }
      setloader(false);
    } catch (error) {
      setloader(false);
      return console.log(error);
    }
  };

  const handleSubmitforgot = async (e) => {
    e.preventDefault();

    const user_email = e.target.user_email ? e.target.user_email.value : "";
    const otp = e.target.otp ? e.target.otp.value : "";

    if (!forgotShowOtp && user_email) {
      setloader(true);
      try {
        const response = await axios.post(apiUrl + "forgotpassword", {
          user_email,
        });
        console.log(response.data.success);
        if (response.data.success === true) {
          setSuccess(response.data.message);
          setShowSuccess(true);
          setforgotShowOtp(true);
          setStoredEmail(user_email);
          setloader(false);
          setforgotShowEnter(false);
          setTimeout(() => {
            setSuccess("");

            setShowSuccess(false);
          }, 3000);
        } else if (response.data.success === false) {
          setError(response.data.message);
          setShowError(true);
          setloader(false);
          setTimeout(() => {
            setError("");
            setShowError(false);
          }, 5000);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (forgotShowOtp && otp) {
      setloader(true);
      try {
        const response = await axios.post(apiUrl + "otpauthicate", {
          storedEmail,
          otp,
        });
        
        if (response.data.success === true) {
          setSuccess(response.data.message);
          setloader(false);
          setforgotShowOtp(false);
          setOtpSucess(true);
          setShowSuccess(true);
          setTimeout(() => {
            setSuccess("");

            setShowSuccess(false);
          }, 3000);
        } else if (response.data.success === false) {
          setError(response.data.message);
          setloader(false);
          setShowError(true);
          setTimeout(() => {
            setError("");
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        return console.log(error);
      }
    }

    if (OtpSucess) {
      const new_pass = e.target.new_pass.value;
      const new_confirm = e.target.new_cpass.value;

      if (new_pass !== new_confirm) {
        setShowError(true);
        setError("Confirm Passwords do not match.");
        setTimeout(() => {
          setShowError(false);
          setError("");
        }, 2000);
        return;
      }
      setloader(true);
      try {
        const response = await axios.post(apiUrl + "forgotPasswordOtp", {
          new_pass,
          new_confirm,
          storedEmail,
        });
        setSuccess(response.data.message);
        setShowSuccess(true);
        setloader(false);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/home");
          setSuccess("");
        }, 2000);
      } catch (error) {
        return console.log(error);
      }
    }
  };

  const handleChangeEmail = (value) => {
    if (value.includes(".com")) {
      setverifyEmail("Verify");
    } else {
      setverifyEmail("");
    }
  };

  const handleVerifyEmail = async () => {
    const user_email = emailRef.current.value;
    if (user_email) {
      setloader(true);
    }

    try {
      const response = await axios.post(apiUrl + "verifyEmail", {
        user_email,
        city,
        lat,
        long,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setloader(false);
        setShowSuccess(true);
        setCreateOtp(true);
        setStoredEmail(user_email);
        setTimeout(() => {
          setSuccess("");
          setShowSuccess(false);
        }, 3000);
      } else {
        setError(response.data.message);
        setShowError(true);
        setloader(false);
        setTimeout(() => {
          setError("");
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const handleVerifyOTP = async () => {
    const userOTP = verifyOtp.current.value;
    const user_email = emailRef.current.value;
    try {
      const response = await axios.post(apiUrl + "realveriftotp", {
        user_email,
        userOTP,
      });
      
      if (response.data.success === 1) {
        setverifyedOtp(true);
      } else if (response.data.success === 2) {
        setverifyedOtp(false);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <div>
      {/* {!user ? (
        <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
      ) : (
        <div>
          <h3>Welcome, {user.name}</h3>
          <img src={user.picture} alt="Profile" />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )} */}

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
      <section className="login d-block">
        <div className="row align-items-start gap-0">
          <div className="col-md-6 px-0 d-md-block d-none">
            <Slider />
          </div>
          <div className="col-md-6 ps-0 left_login">
            <div className="d-flex flex-column main_left py-5 gap-5 justify-content-center align-items-center">
              <h2 id="craete">Chat Sphere</h2>
              <div className="w-100 d-flex flex-column gap-4">
                <h3>Welcome to Chat Sphere</h3>
                {Login && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="d-flex flex-column gap-2"
                  >
                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="user_name">User name or email</label>
                      <input
                        type="email"
                        name="user_email"
                        id="user_email"
                        required
                      />
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="user_password">Password</label>
                      <input
                        type="password"
                        name="user_password"
                        id="user_password"
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end align-items-end">
                      <button
                        type="button"
                        onClick={handleForgot}
                        className="forget"
                      >
                        Forgot Password
                      </button>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 pt-2">
                      <div className="d-flex flex-column gap-2">
                        <button type="submit" className="submit_btn">
                          LogIn
                        </button>
                        <button
                          type="button"
                          onClick={LoginWithOtp}
                          className="forget"
                        >
                          Login With OTP
                        </button>
                      </div>
                      <div className="line_or">Or</div>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                      />

                      <div className="d-flex align-items-center gap-0 new_account">
                        <span>New to Chat Sphere?</span>

                        <button type="button" onClick={CreateAccount}>
                          Create Account
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {Create && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="d-flex flex-column gap-2"
                  >
                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="name">User name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        pattern="[A-Za-z\s]+"
                        title="Only alphabetic characters and spaces are allowed"
                      />
                    </div>

                    <div className="d-flex flex-column gap-1 w-100">
                      <label htmlFor="user_name">Email</label>
                      <div className="d-flex align-items-center gap-2 position-relative">
                        <input
                          ref={emailRef}
                          className="w-100"
                          type="email"
                          name="user_email"
                          id="user_email"
                          onChange={(e) => handleChangeEmail(e.target.value)}
                          required
                        />
                        {verifyEmail && (
                          <button
                            onClick={handleVerifyEmail}
                            type="button"
                            className="email_verify"
                          >
                            {verifyEmail} Email
                          </button>
                        )}
                      </div>
                    </div>
                    {CreateOtp && (
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="create_otp">Enter OTP</label>

                        <input
                          ref={verifyOtp}
                          type="text" // Use "text" instead of "number" to avoid maxLength issues
                          name="create_otp"
                          id="create_otp"
                          maxLength={6} // Restricts input length
                          required
                          placeholder="Enter 6-digit OTP"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                            if (value.length > 6) value = value.slice(0, 6); // Limit to 6 digits
                            e.target.value = value; // Update input field

                            handleVerifyOTP();
                          }}
                        />
                      </div>
                    )}
                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="user_password">Password</label>
                      <input
                        type="password"
                        name="user_password"
                        id="user_password"
                        required
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                        title="Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (@$!%*?&) and be at least 8 characters long"
                      />
                    </div>

                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="user_cpassword">Confirm Password</label>
                      <input
                        type="password"
                        name="user_cpassword"
                        id="user_cpassword"
                        required
                      />
                    </div>

                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 pt-2">
                      <button
                        type="submit"
                        className="submit_btn"
                        disabled={!verifyedOtp}
                        style={{
                          opacity: verifyedOtp ? 1 : 0.5,
                          cursor: verifyedOtp ? "pointer" : "not-allowed",
                        }}
                      >
                        Create Account
                      </button>

                      <div className="line_or">Or</div>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                      />
                      <div className="d-flex align-items-center gap-0 new_account">
                        <span>You already in Chat Sphere?</span>

                        <button type="button" onClick={SignAccount}>
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {LoginOtp && (
                  <form
                    onSubmit={handleSubmitOtp}
                    className="d-flex flex-column gap-2"
                  >
                    {ShowOtp && (
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="enter_otp">Enter Otp</label>

                        <input type="number" name="otp" id="otp" required />
                      </div>
                    )}
                    {!ShowOtp && (
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="user_name">User name or email</label>

                        <input
                          type="email"
                          name="user_email"
                          id="user_email"
                          required
                        />
                      </div>
                    )}

                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 pt-2">
                      <div className="d-flex flex-column gap-2">
                        <button type="submit" className="submit_btn">
                          {sendOtp}
                        </button>
                      </div>
                      <div className="line_or">Or</div>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                      />
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-0 new_account">
                          <span>You already in Chat Sphere?</span>

                          <button type="button" onClick={SignAccount}>
                            Sign In
                          </button>
                        </div>

                        <div className="d-flex align-items-center gap-0 new_account">
                          <span>New to Chat Sphere?</span>

                          <button type="button" onClick={CreateAccount}>
                            Create Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {forgot && (
                  <form
                    onSubmit={handleSubmitforgot}
                    className="d-flex flex-column gap-2"
                  >
                    {forgotShowOtp && (
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="enter_otp">Enter Otp</label>

                        <input type="number" name="otp" id="otp" required />
                      </div>
                    )}
                    {forgotShowEnter && (
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="user_name">User name or email</label>

                        <input
                          type="email"
                          name="user_email"
                          id="user_email"
                          required
                        />
                      </div>
                    )}
                    {OtpSucess && (
                      <>
                        <div className="d-flex flex-column gap-1">
                          <label htmlFor="new_pass">New Password</label>

                          <input
                            type="text"
                            name="new_pass"
                            id="new_pass"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (@$!%*?&) and be at least 8 characters long"
                          />
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <label htmlFor="new_cpass">
                            Confirm New Password
                          </label>

                          <input
                            type="text"
                            name="new_cpass"
                            id="new_cpass"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (@$!%*?&) and be at least 8 characters long"
                          />
                        </div>
                      </>
                    )}

                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 pt-2">
                      <div className="d-flex flex-column gap-2">
                        <button
                          type="submit"
                          onClick={handleForgot}
                          className="submit_btn"
                        >
                          Forgot Password
                        </button>
                      </div>
                      <div className="line_or">Or</div>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                      />
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-0 new_account">
                          <span>You already in Chat Sphere?</span>

                          <button type="button" onClick={SignAccount}>
                            Sign In
                          </button>
                        </div>

                        <div className="d-flex align-items-center gap-0 new_account">
                          <span>New to Chat Sphere?</span>

                          <button type="button" onClick={CreateAccount}>
                            Create Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
