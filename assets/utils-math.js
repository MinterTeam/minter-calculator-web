/**
 * Sell: coin => bip
 * Продажа монеты, подсчет получаемых бипов
 * @type {Function}
 * @param {Coin} coin
 * @param {number} coinAmount - sell coins
 * @return {number} - get bips
 */
export const sellCoin = makeCoinBipMath((coin, coinAmount) => {
    return coin.reserve * (1 - Math.pow(1 - coinAmount / coin.supply, 1 / coin.crr));
});

/**
 * Sell: bip => coin
 * Продажа монеты, подсчет необходимых монет
 * @type {Function}
 * @param {Coin} coin
 * @param {number} bipAmount - get bips
 * @return {number} - sell coins
 */
export const sellCoinByBip = makeCoinBipMath((coin, bipAmount) => {
    return coin.supply * (1 - Math.pow(1 - bipAmount / coin.reserve, coin.crr));
});

/**
 * Buy: bip => coin
 * Покупка монеты, подсчет получаемых монет
 * @type {Function}
 * @param {Coin} coin
 * @param {number} bipAmount - pay bips
 * @return {number} - get coins
 */
export const buyCoin = makeCoinBipMath((coin, bipAmount) => {
    return coin.supply * (Math.pow(1 + bipAmount / coin.reserve, coin.crr) - 1)
});

/**
 * Buy: coin => bip
 * Покупка монеты, подсчет необходимых бипов
 * @type {Function}
 * @param {Coin} coin
 * @param coinAmount - get coins
 * @return {number} - pay bips
 */
export const buyCoinByCoin = makeCoinBipMath((coin, coinAmount) => {
    return coin.reserve * (Math.pow(1 + coinAmount / coin.supply, 1 / coin.crr) - 1)
});





/**
 * @typedef {Function} CoinBipFormula
 * @param {Coin} coin
 * @param {number} inputAmount
 */

/**
 * @param {CoinBipFormula} formula
 * @return {Function}
 */
function makeCoinBipMath(formula) {
    return function (coin, inputAmount) {
        if (!isCoinValid(coin)) {
            return 0;
        }
        let outputAmount = formula(coin, inputAmount);
        return round(outputAmount)
    }
}

/**
 * @param {Coin} coin
 * @return {boolean}
 */
function isCoinValid(coin) {
    return typeof coin.reserve === 'number' && typeof coin.supply === 'number' && typeof coin.crr === 'number'
}

/**
 * @param {number} num
 * @return {number}
 */
function round(num) {
    return Math.round(num * 1000) / 1000
}

