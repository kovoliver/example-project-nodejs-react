import { useEffect, useRef, useState } from "react";
import { memo } from "react";
import ImageModal from "./ImageModal";
import { fileBaseUrl } from "../app/url";

function SlideShow({ images }) {
    const [index, setIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(0);
    const [toIndex, setToIndex] = useState(-1);
    const [direction, setDirection] = useState("");
    const [modalOpened, setModalOpened] = useState(false);
    const [disableBtns, setDisableBtns] = useState(false);
    const [zeroImages, setZeroImages] = useState(false);
    const nextImage = useRef();
    const currentImg = useRef();
    const [animating, setAnimating] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStartX(e.changedTouches[0].screenX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.changedTouches[0].screenX);
    };

    const handleTouchEnd = () => {
        if (touchStartX - touchEndX > 50) {
            backward();
        } else if (touchEndX - touchStartX > 50) {
            forward();
        }
    };

    const forward = (nextIndex = -1) => {
        if (animating || disableBtns) return;
        setAnimating(true);
        setDisableBtns(true);
        currentImg.current.classList.add("prev-image-forward");
        nextImage.current.classList.add("current-image-forward");
        nextImage.current.classList.remove("left-100p", "right-100p");
        setDirection("forward");

        if (nextIndex !== -1) setNextIndex(nextIndex);

        setTimeout(() => {
            if (index < images.length - 1) {
                if (nextIndex === -1) setIndex((i) => i + 1);
                else setIndex(nextIndex);
            } else {
                setIndex(0);
            }

            nextImage.current.classList.add("left-100p");
            currentImg.current.classList.remove("prev-image-forward");
            nextImage.current.classList.remove("current-image-forward");
            setDisableBtns(false);
            setToIndex(-1);
            setAnimating(false);
        }, 1000);
    };

    const backward = (nextIndex = -1) => {
        if (animating || disableBtns) return;
        setAnimating(true);
        nextImage.current.classList.remove("right-100p", "left-100p");
        currentImg.current.classList.add("prev-image-backward");
        nextImage.current.classList.add("current-image-backward");
        setDirection("backward");

        if (nextIndex !== -1) setNextIndex(nextIndex);

        setTimeout(() => {
            if (index > 0) {
                if (nextIndex === -1) setIndex((i) => i - 1);
                else setIndex(nextIndex);
            } else {
                setIndex(images.length - 1);
            }

            nextImage.current.classList.add("right-100p");
            currentImg.current.classList.remove("prev-image-backward");
            nextImage.current.classList.remove("current-image-backward");
            setToIndex(-1);
            setAnimating(false);
        }, 1000);
    };

    useEffect(() => {
        if (direction === "forward") {
            setNextIndex(index < images.length - 1 ? index + 1 : 0);
        } else if (direction === "backward") {
            setNextIndex(index > 0 ? index - 1 : images.length - 1);
        }
    }, [index]);

    useEffect(() => {
        if (toIndex !== -1) {
            setNextIndex(toIndex);
            return;
        }

        if (direction === "forward") {
            setNextIndex(index < images.length - 1 ? index + 1 : 0);
        } else if (direction === "backward") {
            setNextIndex(index > 0 ? index - 1 : images.length - 1);
        }
    }, [direction]);

    useEffect(() => {
        if (toIndex === -1) return;

        if (toIndex < index) {
            backward(toIndex);
        } else if (toIndex > index) {
            forward(toIndex);
        }
    }, [toIndex]);

    useEffect(() => {
        setZeroImages(images.length === 0);
    }, [images]);

    return (
        images &&  
            <>
            <ImageModal
                images={images}
                isOpen={modalOpened}
                onClose={() => setModalOpened(false)}
                startIndex={index}
            />
            <div
                className="cursor-pointer pos-relative overflow-hidden"
                style={{aspectRatio:"16/9"}}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    ref={currentImg}
                    className="pos-absolute d-block wp-100"
                    src={`${fileBaseUrl}/${images[index]?.path}`}
                    onClick={() => !zeroImages && setModalOpened(true)}
                />
                <img
                    ref={nextImage}
                    className="pos-absolute left-100p d-block wp-100"
                    src={`${fileBaseUrl}/${images[nextIndex]?.path}`}
                />

                <div className="img-counter" style={{ width: (22 * images.length) + "px" }}>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="point"
                            onClick={() => setToIndex(i)}
                            style={{ background: i === index ? "rgba(0,0,0,0.8)" : "" }}
                        ></div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default memo(SlideShow);