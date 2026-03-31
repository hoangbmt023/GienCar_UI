/**
 * Format Date thành string dd/mm/yyyy hh:mm
 * @param {Date|string} date - Đối tượng Date hoặc string date
 * @returns {string} - String đã format hoặc empty string nếu invalid
 */
export const formatDateToString = (date) => {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Parse string dd/mm/yyyy hh:mm thành Date object
 * @param {string} dateString - String date format dd/mm/yyyy hh:mm
 * @returns {Date|null} - Date object hoặc null nếu invalid
 */
export const parseDateFromString = (dateString) => {
    if (!dateString || dateString.includes("_") || dateString.length < 16) return null;

    // Format: dd/mm/yyyy hh:mm
    const [datePart, timePart] = dateString.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    if (!day || !month || !year || !hours || !minutes) return null;

    const date = new Date(year, month - 1, day, hours, minutes);
    return isNaN(date.getTime()) ? null : date;
};

/**
 * Validate date string format
 * @param {string} dateString - String date format dd/mm/yyyy hh:mm
 * @returns {boolean} - True nếu format đúng
 */
export const isValidDateFormat = (dateString) => {
    if (!dateString) return false;

    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
    if (!regex.test(dateString)) return false;

    const [, day, month, year, hours, minutes] = dateString.match(regex);
    const date = new Date(year, month - 1, day, hours, minutes);

    return !isNaN(date.getTime());
};

/**
 * So sánh 2 date
 * @param {Date|string} date1 - Date thứ nhất
 * @param {Date|string} date2 - Date thứ hai
 * @returns {number} - -1 nếu date1 < date2, 0 nếu bằng, 1 nếu date1 > date2
 */
export const compareDates = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
};

/**
 * Kiểm tra date có hợp lệ không (endDate >= startDate)
 * @param {Date|string} startDate - Ngày bắt đầu
 * @param {Date|string} endDate - Ngày kết thúc
 * @returns {boolean} - True nếu endDate >= startDate
 */
export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

    return end >= start;
};