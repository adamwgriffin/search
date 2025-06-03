"use client";

import type { PhotoGalleryImage } from "../../../../types/listing_types";
import { useState, useCallback, useLayoutEffect } from "react";
import { useEvent } from "react-use";
import { buildSrcSet } from "../../../../lib/listing_image_helpers";
import { sliceWrap } from "../../../../lib";
import styles from "./SlideShow.module.css";

export type SlideShowProps = {
  images: PhotoGalleryImage[];
  open: boolean;
  onClose?: () => void;
};

/** Number of extra images to load both before and after the current image */
const ExtraImagesToLoad = 1;
/** Total number of images that will be loaded at once */
const TotalImagesToLoad = ExtraImagesToLoad * 2 + 1;

const SlideShow: React.FC<SlideShowProps> = ({ images, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Return a slice of the gallery so that we have extra images pre-loaded
   * before and after the current image. This way they will display quickly when
   * the user advances through the slideshow. The extra images can wrap around
   * to the beginning/end of the gallery array because the gallery can cycle
   * around this way.
   */
  const gallerySlice = useCallback(() => {
    if (images.length <= TotalImagesToLoad) {
      return images;
    }
    return sliceWrap(
      images,
      currentIndex - ExtraImagesToLoad,
      currentIndex + (ExtraImagesToLoad + 1)
    );
  }, [currentIndex, images]);

  const cycleForward = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length]);

  const cycleBackward = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length]);

  const closeSlideShow = useCallback(() => {
    setCurrentIndex(0);
    onClose?.();
  }, [onClose]);

  // With useLayoutEffect we can avoid any potential flicker associated with
  // manually maniplulating the DOM like this because it happens before the
  // browser repaints the screen
  useLayoutEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEvent("keydown", (event) => {
    if (!open) return;
    switch (event.key) {
      case "ArrowLeft":
        cycleBackward();
        break;
      case "ArrowRight":
        cycleForward();
        break;
      case "Escape":
        closeSlideShow();
        break;
    }
  });

  return (
    <dialog open={open} className={styles.slideShow}>
      <div className={styles.header}>
        <button className={styles.close} onClick={closeSlideShow}>
          X Close
        </button>
        <div className={styles.imageCount}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className={styles.carousel}>
        <div className={styles.carouselButtonContainer}>
          <button className={styles.carouselButton} onClick={cycleBackward}>
            &lt;
          </button>
        </div>

        {gallerySlice().map((image) => (
          <figure
            key={image._id}
            className={
              image._id === images[currentIndex]._id
                ? styles.figure
                : styles.figureHidden
            }
          >
            <img
              srcSet={buildSrcSet(image.url)}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.url}`}
              fetchPriority={open ? "auto" : "low"}
              decoding={open ? "auto" : "async"}
              alt={`Listing gallery photo ${currentIndex + 1}`}
              className={styles.image}
            />
            <figcaption className={styles.caption}>{image.caption}</figcaption>
          </figure>
        ))}

        <div className={styles.carouselButtonContainer}>
          <button className={styles.carouselButton} onClick={cycleForward}>
            &gt;
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SlideShow;
