import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ====== CONFIG DAYJS ======
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

export function formatVND(value) {
    return value.toLocaleString('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,  // lần min xuất hiện 0 sau phẩy
        maximumFractionDigits: 0,    //số lần min xuất hiện 0 sau phẩy
    }) + ' VNĐ';
}

export function formatDateTime(value) {
    return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
}

export function formatYear(value) {
    return dayjs(value).format('YYYY');
}

export function formatDate(value) {
    return dayjs(value).format('DD/MM/YYYY');
}

export function formatDateTimeVN(value) {
    if (!value) return "";
    return dayjs.utc(value).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
}

export function formatDateVN(value) {
    if (!value) return "";
    return dayjs.utc(value).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
}

export function formatTimeVN(value) {
    if (!value) return "";
    return dayjs.utc(value).tz("Asia/Ho_Chi_Minh").format("HH:mm");
}

export function formatYearVN(value) {
    if (!value) return "";
    return dayjs.utc(value).tz("Asia/Ho_Chi_Minh").format("YYYY");
}

export function formatURLImage(value) {
    if (!value) return null;

    // Nếu là full URL (Google, Facebook, CDN...)
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }

    // Nếu là path từ BE
    return env.BE_URL + value;
}

export function extractM3U8(playerUrl) {
    if (!playerUrl) return null;
    try {
        const url = new URL(playerUrl);
        return url.searchParams.get('url');
    } catch (e) {
        return null;
    }
};