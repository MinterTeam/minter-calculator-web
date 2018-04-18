/**
 * @param {number} num
 * @return {number}
 */
export function roundCoin(num) {
    if (Math.abs(num) < Math.pow(0.1, 8)) {
        return num
    } else if (Math.abs(num) < Math.pow(0.1, 5)) {
        return round(num, 8);
    } else if (Math.abs(num) < Math.pow(0.1, 3)) {
        return round(num, 5);
    } else {
        return round(num, 3);
    }
}

function round(num, power) {
    let tenPower = Math.pow(10, power);
    return Math.round(num * tenPower) / tenPower;
}

/**
 * @param {timestamp} timestamp
 * @return {string}
 */
export function formatTime(timestamp) {
    let date = new Date(timestamp);
    return padZero(date.getHours()) + ':' + padZero(date.getMinutes()) + ':' + padZero(date.getSeconds());
}

/**
 * padStart with 0
 * @param {number} num
 * @return {string}
 */
function padZero(num) {
    if (num >= 0 && num < 10) {
        return '0' + num;
    } else {
        return num.toString();
    }
}
