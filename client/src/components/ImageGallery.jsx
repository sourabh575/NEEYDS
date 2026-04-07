import React, { useState } from "react";
import "../styles/ImageGallery.css";

function ImageGallery({
  images,
  title = "Images",
  roomType,
  placeholderIcon,
  placeholderText,
  compact = false,
}) {
  const [imageError, setImageError] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = images?.filter((img) => img && typeof img === "string") || [];

  const handleImageError = (index) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const effectivePlaceholderIcon =
    placeholderIcon ?? (roomType === "PG" ? "🛏️" : "🏠");
  const effectivePlaceholderText =
    placeholderText ?? "Image not available";

  const PlaceholderImage = ({
    icon = effectivePlaceholderIcon,
    text = effectivePlaceholderText,
  }) => (
    <div className="image-placeholder">
      <div className="placeholder-icon">{icon}</div>
      <div className="placeholder-text">{text}</div>
    </div>
  );

  if (validImages.length === 0) {
    return (
      <div className={`image-gallery ${compact ? "image-gallery-compact" : ""}`}>
        <div className="gallery-main">
          <PlaceholderImage />
        </div>
      </div>
    );
  }

  return (
    <div className={`image-gallery ${compact ? "image-gallery-compact" : ""}`}>
      <div className="gallery-main">
        {imageError[selectedIndex] ? (
          <PlaceholderImage />
        ) : (
          <img
            src={validImages[selectedIndex]}
            alt={`${title} ${selectedIndex + 1}`}
            className="gallery-image"
            loading="eager"
            decoding="async"
            onError={() => handleImageError(selectedIndex)}
          />
        )}
        {validImages.length > 1 && (
          <div className="gallery-counter">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {!compact && validImages.length > 1 && (
        <div className="gallery-thumbnails">
          <button
            className="gallery-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev === 0 ? validImages.length - 1 : prev - 1
              );
            }}
            aria-label="Previous image"
          >
            ←
          </button>

          <div className="thumbnails-scroll">
            {validImages.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${index === selectedIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                aria-label={`View image ${index + 1}`}
              >
                {imageError[index] ? (
                  <div className="thumbnail-placeholder">
                    <span>No preview</span>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(index)}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            className="gallery-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev === validImages.length - 1 ? 0 : prev + 1
              );
            }}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
