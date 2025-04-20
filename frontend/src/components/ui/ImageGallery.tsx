import Slider from 'react-slick';
import styles from './ImageGallery.module.css';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

type ProductGalleryProps = {
  images: string[];
};

const ImageGallery = ({ images }: ProductGalleryProps) => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    className: "center",
    dots: true,
    dotsClass: `slickы-dots`,
    swipeToSlide: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    autoplay: true,
    autoplaySpeed: 2000,
  }

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handleMouseEnter = () => {
    sliderRef.current?.slickPause();
  };

  const handleMouseLeave = () => {
    sliderRef.current?.slickPlay();
  };

  return (
    <div className={styles.sliderContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Slider ref={sliderRef} {...sliderSettings}>
        {images.map((src, idx) => (
          <img src={src} alt={`Фото ${idx}`} className={styles.slideImage} />
        ))}
      </Slider>

      <div className={`${styles.navZone} ${styles.leftNav}`} onClick={handlePrev}>
        <ChevronLeft className={styles.arrowIcon} />
      </div>

      <div className={`${styles.navZone} ${styles.rightNav}`} onClick={handleNext}>
        <ChevronRight className={styles.arrowIcon} />
      </div>
    </div>
  );
};

export default ImageGallery;
