const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Converts an ISO "yyyy-mm-dd" date (what <input type="date"> gives you)
 * into the "DD Mon YYYY" format already used across the board's mock data
 * (e.g. "09 Nov 2021"), so new tasks look consistent with the seeded ones.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    if (!year || !month || !day) return isoDate;
    const paddedDay = String(day).padStart(2, '0');
    return `${paddedDay} ${MONTHS[month - 1]} ${year}`;
}

/** Today's date as an ISO "yyyy-mm-dd" string, for the date input's min attribute. */
export function todayIso() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}