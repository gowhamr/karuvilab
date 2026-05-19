import { TamilDateInfo } from '../types';

export function getFestivalForTamilDate(tamilDate: TamilDateInfo): string | undefined {
  const { month, day } = tamilDate;
  
  // month is 0-indexed based on Chithirai (0)
  
  // Chithirai (0)
  if (month === 0 && day === 1) return 'Tamil New Year (Puthandu)';
  if (month === 0 && day === 14) return 'Chithra Pournami';
  
  // Vaikasi (1)
  if (month === 1 && day === 1) return 'Vaikasi Vishakam';
  
  // Aani (2)
  if (month === 2 && day === 1) return 'Aani Thirumanjanam';

  // Aadi (3)
  if (month === 3 && day === 1) return 'Aadi Pandigai';
  if (month === 3 && day === 18) return 'Aadi Perukku';
  
  // Aavani (4)
  if (month === 4 && day === 1) return 'Aavani Avittam';
  if (month === 4 && day === 10) return 'Ganesh Chaturthi (approx)';

  // Purattasi (5)
  if (month === 5 && day === 1) return 'Navaratri Begins';
  
  // Aippasi (6)
  if (month === 6 && day === 1) return 'Deepavali (approx)';
  if (month === 6 && day === 6) return 'Skanda Sashti';

  // Karthigai (7)
  if (month === 7 && day === 1) return 'Karthigai Deepam';

  // Margazhi (8)
  if (month === 8 && day === 1) return 'Margazhi Music Festival Begins';
  if (month === 8 && day === 11) return 'Vaikunda Ekadashi';

  // Thai (9)
  if (month === 9 && day === 1) return 'Pongal / Makara Sankranti';
  if (month === 9 && day === 2) return 'Mattu Pongal / Thiruvalluvar Day';
  if (month === 9 && day === 3) return 'Kaanum Pongal';
  if (month === 9 && day === 15) return 'Thai Poosam';

  // Maasi (10)
  if (month === 10 && day === 1) return 'Maasi Magam';
  if (month === 10 && day === 13) return 'Maha Shivaratri (approx)';

  // Panguni (11)
  if (month === 11 && day === 1) return 'Panguni Uthiram (approx)';

  return undefined;
}
