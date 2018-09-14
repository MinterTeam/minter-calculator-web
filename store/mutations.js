import getters from './getters';
import {buyCoinByCoin, sellCoin} from "~/assets/utils-math";

export default {
    /**
     * Инициализация стейта из урл хэша
     * @param state
     * @param {Object} initialCoinData
     */
    INIT_COIN_DATA: (state, initialCoinData) => {
        if (initialCoinData.coinIsMinted && typeof initialCoinData.coinSettings === 'object' && typeof initialCoinData.coin === 'object') {
            setCoinData(state.coinSettings, initialCoinData.coinSettings, {undefinedNumber: ''});
            setCoinData(state.coin, initialCoinData.coin);
            state.coinIsMinted = initialCoinData.coinIsMinted || false;
        }
    },
    /**
     * Создание монеты
     * @param state
     * @param {CoinFormData} coinForm
     */
    MINT_COIN: (state, coinForm) => {
        state.coinSettings = coinForm;
        setCoinData(state.coinSettings, coinForm, {undefinedNumber: ''});
        setCoinData(state.coin, coinForm, {crrToFraction: true});
        state.coinIsMinted = true;
        state.transactionList = [];
    },
    /**
     * Уничтожение монеты
     */
    RESET_COIN: resetCoin,
    /**
     * Добавить транзакцию продажи или покупки
     * @param state
     * @param {Object<{type: string, coinAmount: number}>}
     */
    MAKE_TX: (state, {type, coinAmount}) => {
        let bipAmount;
        if (type === 'buy') {
            bipAmount = makeBuy(state.coin, coinAmount);
        } else if (type === 'sell') {
            bipAmount = makeSell(state.coin, coinAmount);
        }
        state.transactionList.push({
            type,
            coinAmount,
            bipAmount,
            timestamp: Date.now(),
        });

        if (state.coin.supply <= 0) {
            resetCoin(state);
        }
    },
    /**
     * Добавить транзакцию обмена коинов на 1 CUP
     * @param state
     */
    MAKE_TX_EXCHANGE: (state) => {
        let oldCoinPrice = getters.coinPrice(state);
        let oldCupPrice = sellCoin(state.cupCoin, 1);
        let coinAmount = getters.cupPriceInCoins(state);
        let bipAmount = makeSell(state.coin, coinAmount);
        let cupCointAmount = 1;
        let cupBipAmount = makeBuy(state.cupCoin, cupCointAmount);
        let newCoinPrice = getters.coinPrice(state);
        let newCupPrice = sellCoin(state.cupCoin, 1);

        state.transactionList.push({
            type: 'exchange',
            coinAmount,
            bipAmount,
            timestamp: Date.now(),
            deltaCoinPrice: oldCoinPrice - newCoinPrice,
            deltaCoinPercent: (oldCoinPrice - newCoinPrice) / oldCoinPrice * 100,
            deltaCupPrice: newCupPrice - oldCupPrice,
            deltaCupPercent: (newCupPrice - oldCupPrice) / newCupPrice * 100,
        });

        if (state.coin.supply <= 0) {
            resetCoin(state);
        }
    },
};

/**
 * @param coinState
 * @param {CoinFormData} coinData
 * @param {Object} [options]
 * @param {boolean} [options.crrToFraction=false] - нужно ли переводить проценты в дробь
 * @param [options.undefinedNumber=null] - значение неопределенного числа по-умолчанию
 */
export function setCoinData(coinState, coinData, options) {
    const defaults = {
        crrToFraction: false,
        undefinedNumber: null,
    };
    options = Object.assign({}, defaults, options);

    coinState.name = coinData.name || '';
    coinState.supply = parseFloat(coinData.supply) || options.undefinedNumber;
    coinState.crr = parseFloat(coinData.crr) || options.undefinedNumber;
    coinState.reserve = parseFloat(coinData.reserve) || options.undefinedNumber;
    // transform percents to fraction
    // для расчетов используется crr от 0.1 до 1
    if (options.crrToFraction && coinState.crr) {
        coinState.crr = coinState.crr / 100;
    }
}


function resetCoin(state) {
    setCoinData(state.coinSettings, {}, {undefinedNumber: ''});
    state.coinIsMinted = false;
}


function makeBuy(coin, coinAmount) {
    let bipAmount = buyCoinByCoin(coin, coinAmount);
    coin.supply += coinAmount;
    coin.reserve += bipAmount;
    return bipAmount;
}

function makeSell(coin, coinAmount) {
    let bipAmount = sellCoin(coin, coinAmount);
    coin.supply -= coinAmount;
    coin.reserve -= bipAmount;
    return bipAmount;
}
