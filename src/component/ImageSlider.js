import React from "react";
import Slider from "react-slick";
import image1 from "../assets/images/chatshere.png";
import image2 from "../assets/images/1.png";
import image3 from "../assets/images/4.png";

function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };

  return (
    <div className="slider_main">
      <Slider {...settings} className="h-100">
        <div className="d-flex flex-column gap-3 slider1  justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center slider_img pb-3">
            <img src={image1} alt="Slide 1" className="img-fluid" />
          </div>
          <div className="d-flex flex-column gap-3 text-center justify-content-center align-items-center">
            <h1>Chat Sphere</h1>
            <p>
              ChatSphere is a modern and intuitive messaging app designed to
              keep you connected with friends, family, and colleagues anytime,
              anywhere.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 slider1 justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center slider_img pb-3">
            <img src={image2} alt="Slide 1" className="img-fluid" />
          </div>
          <div className="d-flex flex-column gap-3 text-center justify-content-center align-items-center">
            <h1>Chat Sphere</h1>
            <p>
              ChatSphere is a modern and intuitive messaging app designed to
              keep you connected with friends, family, and colleagues anytime,
              anywhere.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 slider1 justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center slider_img pb-3">
            <img src={image3} alt="Slide 1" className="img-fluid" />
          </div>
          <div className="d-flex flex-column gap-3 text-center justify-content-center align-items-center">
            <h1>Chat Sphere</h1>
            <p>
              ChatSphere is a modern and intuitive messaging app designed to
              keep you connected with friends, family, and colleagues anytime,
              anywhere.
            </p>
          </div>
        </div>
      </Slider>
    </div>
  );
}

export default ImageSlider;
