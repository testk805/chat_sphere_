import React, { useEffect, useState, useRef } from "react";
export default function Jlhome() {
  const boxesRef = useRef([]);

  useEffect(() => {
    function setEqualHeight() {
      if (boxesRef.current.length > 0) {
        let maxHeight = 0;
        // Find the max height
        boxesRef.current.forEach((box) => {
          if (box) {
            box.style.height = "auto"; // Reset height before measuring
            maxHeight = Math.max(maxHeight, box.offsetHeight);
          }
        });
        // Apply max height
        boxesRef.current.forEach((box) => {
          if (box) box.style.height = `${maxHeight}px`;
        });
      }
    }

    setEqualHeight();
    window.addEventListener("resize", setEqualHeight);

    return () => window.removeEventListener("resize", setEqualHeight);
  }, []);

  return (
    <div>
      <section className="d-block jlhome py-4">
        <div className="container-xl">
          <div className="row py-4 gy-4 d-flex">
            {[
              {
                title: "Current Roster",
                description:
                  "Here, you can access client information, view locations, and manage rosters. Additionally, you have capability to set up roster and generate timesheets.",
                image: require("../assets/images/current-roster.png"),
              },
              {
                title: "Timesheet Signature",
                description:
                  "Discover the job or work that interests you by selecting from various categories. Share availability and connect with our reputable clients in a convenient location.",
                image: require("../assets/images/timesheet.png"),
              },
              {
                title: "Client info",

                image: require("../assets/images/ohs.png"),
              },
              {
                title: "OHS",

                image: require("../assets/images/client.png"),
              },
              {
                title: "Site Access",

                image: require("../assets/images/site.png"),
              },
              {
                title: "Manual",

                image: require("../assets/images/site.png"),
              },
            ].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="border_home">
                  <a
                    href="#"
                    ref={(el) => (boxesRef.current[index] = el)}
                    className="jlhome_box d-flex flex-column gap-3 justify-content-between align-items-center"
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="jl_home_img">
                      <img
                        className="w-100 h-100"
                        src={item.image}
                        alt="image"
                      />
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="d-block notification_center py-5">
        <div className="container-xl">
          <div className="row gy-3">
            <div className="col-12">
              <h3>Notification Center</h3>
              <p className="mt-1">
                "From this notification area, you'll receive alerts at»ut tasks,
                or from clients. These notifications can vary in nature. if you
                notice an alert. Simply click on it and follow the provided
                steps to address it."
              </p>
            </div>
            <div className="col-md-6 mx-auto">
              <button className="d-flex flex-column align-items-start gap-1 p-4">
                <h4>Required to hire</h4>
                <h3>Upload Others documents</h3>
                <p>You must Upload the necessary OHS certificates.</p>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
