/**
 * PRINCIPE DEL PACIFICO — Beds24 Booking URL Builder
 * js/booking.js
 *
 * Builds the correct Beds24 redirect URL with pre-filled params.
 * Import this in apartment detail pages: <script src="../js/booking.js"></script>
 *
 * Usage:
 *   const url = buildBookingUrl({ apartmentId: 'master', checkin: '2026-04-05', checkout: '2026-04-08', adults: 2 });
 *   window.open(url, '_blank', 'noopener,noreferrer');
 */

const BEDS24_BASE    = 'https://beds24.com/book-principedelpacifico';
const BEDS24_PROP_ID = '187661';

/**
 * enquireid mapping — verified against Beds24 dashboard March 2026
 * DO NOT change these without verifying in Beds24 control panel.
 */
const ENQUIRE_IDS = {
  white:  '405215',
  master: '405247',
  blue:   '405229',
  red:    '405243',
  tora:   '405244',
  green:  '405246',
  brown:  '405248',
};

/**
 * @param {Object} params
 * @param {string} params.apartmentId  - one of: white, master, blue, red, tora, green, brown
 * @param {string|null} params.checkin  - YYYY-MM-DD or null
 * @param {string|null} params.checkout - YYYY-MM-DD or null
 * @param {number} [params.adults=1]
 * @param {number} [params.children=0]
 * @returns {string} Full Beds24 URL
 */
function buildBookingUrl({ apartmentId, checkin = null, checkout = null, adults = 1, children = 0 }) {
  const enquireid = ENQUIRE_IDS[apartmentId?.toLowerCase()];

  if (!enquireid) {
    console.error(`[booking.js] Unknown apartmentId: "${apartmentId}". Valid: ${Object.keys(ENQUIRE_IDS).join(', ')}`);
    return BEDS24_BASE; // fallback to listing page
  }

  const url = new URL(BEDS24_BASE);
  url.searchParams.set('propid', BEDS24_PROP_ID);
  url.searchParams.set('enquireid', enquireid);
  url.searchParams.set('numadult', String(Math.max(1, adults)));
  url.searchParams.set('numchild', String(Math.max(0, children)));

  if (checkin && checkout) {
    const nights = dateDiffDays(checkin, checkout);
    if (nights > 0) {
      url.searchParams.set('firstnight', checkin);
      url.searchParams.set('numnight', String(nights));
    }
  }

  return url.toString();
}

/**
 * Returns number of days between two YYYY-MM-DD strings.
 * @param {string} a - start date
 * @param {string} b - end date
 * @returns {number}
 */
function dateDiffDays(a, b) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86400000);
}

/**
 * Reads search params from current page URL.
 * Useful in apartment detail pages to pre-fill checkin/checkout from homepage search.
 * @returns {{ checkin: string|null, checkout: string|null, guests: number }}
 */
function getSearchParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    checkin:  p.get('checkin')  || null,
    checkout: p.get('checkout') || null,
    guests:   parseInt(p.get('guests') || '2', 10),
  };
}

/**
 * Opens Beds24 in a new tab with correct params.
 * Call this from the "Prenota ora" button onclick.
 * @param {string} apartmentId
 */
function bookNow(apartmentId) {
  const { checkin, checkout, guests } = getSearchParams();
  const url = buildBookingUrl({ apartmentId, checkin, checkout, adults: guests });
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Expose to global scope for inline onclick handlers
window.buildBookingUrl = buildBookingUrl;
window.bookNow = bookNow;
window.getSearchParams = getSearchParams;
