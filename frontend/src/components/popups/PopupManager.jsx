import React from 'react';
import PromotionPopup from './PromotionPopup';

const PopupManager = () => {
  return (
    <>
      {/* Only one popup will show at a time based on their individual logic */}
      <PromotionPopup />
    </>
  );
};

export default PopupManager;