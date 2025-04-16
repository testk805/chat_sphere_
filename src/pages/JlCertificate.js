import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import jl_logo from "../assets/images/jl-logo.png";

export default function JlCertificate() {
  const handleDownload = async () => {
    const input = document.getElementById("jl-certificate-container");

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgHeight = canvas.height;
    const imgWidth = canvas.width;

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 595.28
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 841.89

    // Padding in pt converted to px (PDF pt to canvas px: 72pt = 96px)
    const paddingPt = 60;
    const paddingPx = paddingPt * (96 / 72);

    const contentWidth = imgWidth - 2 * paddingPx;
    const contentHeight = pdfHeight / (pdfWidth / imgWidth) - 2 * paddingPx;

    let position = 0;
    let pageIndex = 0;

    while (position < imgHeight) {
      const visibleHeight = Math.min(contentHeight, imgHeight - position);
      const canvasSlice = document.createElement("canvas");
      canvasSlice.width = imgWidth;
      canvasSlice.height = visibleHeight + 2 * paddingPx;

      const ctx = canvasSlice.getContext("2d");

      // White background to fill the padding area
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasSlice.width, canvasSlice.height);

      // Draw the actual content with padding
      ctx.drawImage(
        canvas,
        paddingPx,
        position,
        contentWidth,
        visibleHeight,
        paddingPx,
        paddingPx,
        contentWidth,
        visibleHeight
      );

      const imgData = canvasSlice.toDataURL("image/jpeg", 0.9);

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        (canvasSlice.height * pdfWidth) / imgWidth
      );

      position += visibleHeight;
      pageIndex++;
    }

    pdf.save("certificate.pdf");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <button
        onClick={handleDownload}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#2B3767",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Download Certificate
      </button>

      {/* Certificate Content */}
      <div
        id="jl-certificate-container"
        style={{
          width: "794px",
          margin: "0 auto",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <div
          style={{
            width: "794px",
            minHeight: "1030px",
            background: "#fff",
            position: "relative",
            pageBreakAfter: "always",
            padding: "0px 50px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              textAlign: "center",
              width: "200px",
            }}
          >
            <img
              src={jl_logo}
              alt="jl_logo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              textAlign: "center",
              marginTop: "100px",
            }}
          >
            <div
              style={{
                border: "2px solid #2B3767",
                borderRadius: "12px",
                padding: "40px",
                fontSize: "28px",
                color: "#000",
                width: "100%",
              }}
            >
              Confidential Profile of: <br />
              <strong style={{ color: "#2B3767" }}>ANDRE POTGIETER</strong>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "794px",
            minHeight: "1030px",
            background: "#fff",
            position: "relative",
            pageBreakAfter: "always",
            padding: "0px 50px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              width: "200px",
            }}
          >
            <img
              className="w-100 h-100 object-fit-contain"
              src={jl_logo}
              alt="jl_logo"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              height: "100%",
              gap: "25px",
            }}
          >
            <div
              style={{
                borderBottom: "2px solid #2B3767",
                padding: "15px",
                textAlign: "start",
                fontSize: "28px",
                color: "#000",
                width: "100%",
              }}
            >
              <strong style={{ color: "#2B3767" }}>Basic Detail</strong>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Name
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Shane Eviston
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Name
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Shane Eviston
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Name
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Shane Eviston
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Mobile Number
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  0418 467 822
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Gender
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Male
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Are you of Aboriginal or Torres Strait Island origin?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Email
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  test@gmail.com
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Home Address
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Postal Address
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  City
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  State
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Western Australia
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Postal Code
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Country
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Date of Birth
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  1978-08-11
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Country of Birth
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Australia
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Are you a permanent Resident/Citizen of Australia?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Do you have the legal right to live and work in Australia?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  What date do you become available?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  2025-04-01
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Have you ever been convicted of any criminal offenses?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  No
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Have you served time in prison?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  No
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Are you an ex serving member of the Australian Defence Force?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  No
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Shirt Size
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Shirt Size XL
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Which shifts are you willing to work? Please select all that
                  apply?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                  <h4
                    style={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      fontWeight: "500",
                      color: "#000",
                    }}
                  >
                    Day Shift
                  </h4>
                  <span
                    style={{
                      fontSize: "20px",
                      lineHeight: "18px",
                      color: "#000",
                      fontWeight: "400",
                    }}
                  >
                    :
                  </span>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "18px",
                      color: "#000",
                      fontWeight: "400",
                    }}
                  >
                    Yes
                  </h6>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <h4
                    style={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      fontWeight: "500",
                      color: "#000",
                    }}
                  >
                    Night Shift
                  </h4>
                  <span
                    style={{
                      fontSize: "20px",
                      lineHeight: "18px",
                      color: "#000",
                      fontWeight: "400",
                    }}
                  >
                    :
                  </span>
                  <h6
                    style={{
                      fontSize: "20px",
                      lineHeight: "18px",
                      color: "#000",
                      fontWeight: "400",
                    }}
                  >
                    Yes
                  </h6>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Employment Type - Please select all that apply ?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  FIFO
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  Yes
                </h6>
              </div>
            </div>
            <div
              style={{
                borderBottom: "2px solid #2B3767",
                padding: "15px",
                textAlign: "start",
                fontSize: "28px",
                color: "#000",
                width: "100%",
              }}
            >
              <strong style={{ color: "#2B3767" }}>Education</strong>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Year of Completion
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  1997-2000
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Course
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  ELECTRICAL MECHANIC
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Institution
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  CERTIFICATE TRADE STUDIES
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Year of Completion
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  1996
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Course
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  PRE-APPRENTICESHIP COURSE
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Institution
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  ROCKINGHAM TAFE
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Year of Completion
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  1998
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Course
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  year 12
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Institution
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  KWINANA SENIOR HIGH SCHOOL
                </h6>
              </div>
            </div>
            <div
              style={{
                borderBottom: "2px solid #2B3767",
                padding: "15px",
                textAlign: "start",
                fontSize: "28px",
                color: "#000",
                width: "100%",
              }}
            >
              <strong style={{ color: "#2B3767" }}>
                Skill and Extra Informations
              </strong>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Mention All Skills
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Years of Experience
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex flex-column gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Mention Licences
                </h4>
                <ul className="d-flex flex-column gap-2">
                  <li>
                    <h6
                      style={{
                        fontSize: "20px",
                        lineHeight: "18px",
                        color: "#000",
                        fontWeight: "400",
                      }}
                    >
                      Driver's Licence - C Class
                    </h6>
                  </li>
                  <li>
                    <h6
                      style={{
                        fontSize: "20px",
                        lineHeight: "18px",
                        color: "#000",
                        fontWeight: "400",
                      }}
                    >
                      Driver's Licence - C Class
                    </h6>
                  </li>
                  <li>
                    <h6
                      style={{
                        fontSize: "20px",
                        lineHeight: "18px",
                        color: "#000",
                        fontWeight: "400",
                      }}
                    >
                      Driver's Licence - C Class
                    </h6>
                  </li>
                  <li>
                    <h6
                      style={{
                        fontSize: "20px",
                        lineHeight: "18px",
                        color: "#000",
                        fontWeight: "400",
                      }}
                    >
                      Driver's Licence - C Class
                    </h6>
                  </li>
                </ul>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Mention Other Certification
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  RTC TRAINING CERTIFICATES 1 2 & 3
                </h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Trade Certifications
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Machinery
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Vocational training
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Equipment worked
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h4
                  style={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Any sites you don’t want to work at ?
                </h4>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                >
                  :
                </span>
                <h6
                  style={{
                    fontSize: "20px",
                    lineHeight: "18px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                ></h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
