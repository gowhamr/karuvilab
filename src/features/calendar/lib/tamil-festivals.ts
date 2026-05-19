import { TamilDateInfo } from '../types';

export function getFestivalForTamilDate(tamilDate: TamilDateInfo): string | undefined {
  const { month, day } = tamilDate;
  
  // month is 0-indexed based on Chithirai
  
  // Chithirai (0)
  if (month === 0 && day === 1) return 'Tamil New Year (Puthandu)';
  
  // Vaikasi (1)
  if (month === 1 && day === 1) return 'Vaikasi Vishakam';
  
  // Aadi (3)
  if (month === 3 && day === 1) return 'Aadi Pandigai';
  if (month === 3 && day === 18) return 'Aadi Perukku';
  
  // Thai (9)
  if (month === 9 && day === 1) return 'Pongal / Makara Sankranti';
  if (month === 9 && day === 2) return 'Mattu Pongal / Thiruvalluvar Day';
  if (month === 9 && day === 3) return 'Kaanum Pongal';

  // Panguni (11)
  if (month === 11 && day === 1) return 'Panguni Uthiram (approx)';

  return undefined;
}
