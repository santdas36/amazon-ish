import React from "react";
import "./CarouselContainer.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import slideOne from "../assets/slide/1.jpg";
import slideTwo from "../assets/slide/2.jpg";
import slideThree from "../assets/slide/3.jpg";
import slideFour from "../assets/slide/4.jpg";
import slideFive from "../assets/slide/5.jpg";

const carouselImages = [slideOne, slideTwo, slideThree, slideFour, slideFive];

function CarouselContainer() {
  return (
    <Carousel
      className="home__carousel"
      showArrows={false}
      showStatus={false}
      infiniteLoop={true}
      autoPlay={true}
      showThumbs={false}
      interval={5000}
      transitionTime={200}
    >
      {carouselImages.map((carouselImage) => (
        <div>
          <img src={carouselImage} alt="carousel" />
        </div>
      ))}
    </Carousel>
  );
}

export default CarouselContainer;
