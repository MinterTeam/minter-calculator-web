import decode from 'entity-decode';
import prettyNum, {PRECISION_SETTING, ROUNDING_MODE} from 'pretty-num';
// import stripZeros from 'pretty-num/src/strip-zeros';
// import fromExponential from 'from-exponential';

/**
 * @param {string|number} value
 * @param {ROUNDING_MODE} [roundingMode]
 * @return {string}
 */
export function pretty(value, roundingMode) {
    const PRECISION = 2;
    if (value >= 1 || value <= -1 || Number(value) === 0) {
        return decode(prettyNum(value, {precision: PRECISION, precisionSetting: PRECISION_SETTING.FIXED, roundingMode, thousandsSeparator: '&#x202F;'}));
    } else {
        value = decode(prettyNum(value, {precision: PRECISION, precisionSetting: PRECISION_SETTING.REDUCE_SIGNIFICANT, roundingMode, thousandsSeparator: '&#x202F;'}));
        value = value.substr(0, 10);
        if (value === '0.00000000') {
            return '0.00';
        }
        return value;
    }
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
