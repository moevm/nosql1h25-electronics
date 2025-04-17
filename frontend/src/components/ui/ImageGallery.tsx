import Slider from 'react-slick';
import styles from './ImageGallery.module.css';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

type ProductGalleryProps = {
  images: string[];
};

const ImageGallery: React.FC<ProductGalleryProps> = ({ images }: { images: string[] }) => {
    const sliderRef = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderSettings = {
        className: "center",
        dots: true,
        dotsClass: `slick-dots`,
        swipeToSlide: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (_: number, next: number) => setCurrentSlide(next),
    }

    const handlePrev = () => {
        sliderRef.current?.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    return (
        <div className={styles.sliderContainer}>
            <Slider ref={sliderRef} {...sliderSettings}>
                {images.map((src, idx) => (
                    <img src={src} alt={`Фото ${idx}`} className={styles.slideImage}/>
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