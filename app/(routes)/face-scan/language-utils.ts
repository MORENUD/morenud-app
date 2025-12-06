import { faceScanTexts } from './texts';
import { faceScanTextsThai } from './texts-thai';

export type Language = 'en' | 'th';

export const getTexts = (language: Language = 'en') => {
  switch (language) {
    case 'th':
      return faceScanTextsThai;
    case 'en':
    default:
      return faceScanTexts;
  }
};

// Example usage:
// const texts = getTexts('en'); // English
// const texts = getTexts('th'); // Thai
// const texts = getTexts();     // Default English
