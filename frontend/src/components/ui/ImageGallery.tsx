import Slider, { Settings } from 'react-slick';
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
    dots: images.length > 1,
    dotsClass: `slick-dots`,
    swipeToSlide: images.length > 1,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    autoplay: images.length > 1,
    autoplaySpeed: 2000,
  } as Settings

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
          <div key={idx} className={styles.slideContainer}>
            <img src={src} alt={`Фото ${idx}`} className={styles.slideImage} />
          </div>
        ))}
      </Slider>

      {images.length > 1 && (
        <div>
          <div className={`${styles.navZone} ${styles.leftNav}`} onClick={handlePrev}>
            <ChevronLeft className={styles.arrowIcon} />
          </div>

          <div className={`${styles.navZone} ${styles.rightNav}`} onClick={handleNext}>
            <ChevronRight className={styles.arrowIcon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
