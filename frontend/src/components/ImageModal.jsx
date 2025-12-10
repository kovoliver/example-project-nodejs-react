import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

const ImageModal = ({ images, isOpen, onClose, startIndex }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (isOpen) {

            const handleKeyDown = (e) => {
                if (e.key === 'ArrowRight') {
                    handleNext();
                } else if (e.key === 'ArrowLeft') {
                    handlePrev();
                } else if(e.key === "Escape") {
                    onClose();
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }


    }, [isOpen, currentIndex]);

    useEffect(()=> {
        setCurrentIndex(startIndex);
    }, [startIndex]);

    useEffect(()=> {
        setWindowWidth(window.innerWidth);
    }, [window.innerWidth]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };
    
    if (!isOpen || windowWidth <= 720) return null;

    return (
        <div className="d-flex position-fixed top-0 z-index-5000 left-0 right-0 bottom-0 top-0 margin-auto wp-100 hp-100 transparent-black jc-center ai-center">
            <div className="position-relative wp-80 d-flex jc-center ai-center bt">

                <div className="border-white-4 position-relative">
                    <div className="bg-white color-error rounded-5 cursor-pointer position-absolute top-10 right-10 d-flex jc-center ai-center"
                        onClick={onClose}
                        style={{
                            width:"20px",
                            height:"20px"
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <img style={{ width: "100%", objectFit:"contain", maxHeight:"90vh" }}
                        src={checkImg(images[currentIndex]?.path)}
                        alt={`Image ${currentIndex + 1}`}
                        className="img-fluid"
                    />

                    <div className="position-absolute bg-white p-xs color-secondary rounded-5 cursor-pointer"
                        onClick={handlePrev}
                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size="1.5x" />
                    </div>

                    <div className="position-absolute bg-white p-xs color-secondary rounded-5 cursor-pointer"
                        onClick={handleNext}
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <FontAwesomeIcon icon={faArrowRight} size="1.5x" />
                    </div>
                </div>

                <div
                    className="position-absolute w-100 text-center bg-white p-xs rounded-5"
                    style={{ bottom: '10px' }}
                >
                    <span className="text-white">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;