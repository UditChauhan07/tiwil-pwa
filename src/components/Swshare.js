import React from 'react';

const ShareButton = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check this out!',
          text: 'SEGA Freedom Cricket Shoes on sale!',
          url: window.location.href, // Current page URL
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <button onClick={handleShare} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
      Share
    </button>
  );
};

export default ShareButton;
