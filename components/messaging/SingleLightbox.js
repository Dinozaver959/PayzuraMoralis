import Image from 'next/image';
import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';

const SingleLightbox = ({ src, className, messageContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <img
        src={src}
        alt="message image"
        className={className}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Lightbox
          mainSrc={src}
          onCloseRequest={() => setIsOpen(false)}
          imageCaption={messageContent}
          closeLabel="Close"
          imagePadding={100}
          imageLoadErrorMessage="Error loading image"
          mainSrcThumbnail={src}
          onImageLoad={() => setImageLoaded(true)}
          toolbarButtons={[
            <a href={src} download>
              <button 
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  position: 'absolute',
                  border: '1px solid white',
                  borderRadius: '0.5rem',
                  right: '150px',
                  top: '7px',
                }}
              >
                Download
              </button>
            </a>
          ]}
        />
      )}
    </>
  );
}

export default SingleLightbox;