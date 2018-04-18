import Vue from 'vue'
import getters from './getters'
import {buyCoinByCoin, sellCoin} from "~/assets/utils-math";

export default {
    /**
     * @param state
     * @param {CoinFormData} coinForm
     */
    MINT_COIN: (state, coinForm) => {
        state.coinSettings = coinForm;
        setCoinData(state.coin, coinForm);
        state.coinIsMinted = true;
        state.transactionList = [];
    },
    RESET_COIN: resetCoin,
    /**
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
    }
}

/**
 * @param coinState
 * @param {CoinFormData} coinData
 */
export function setCoinData(coinState, coinData) {
    coinState.name = coinData.name || '';
    coinState.supply = parseInt(coinData.supply, 10) || null;
    coinState.crr = parseInt(coinData.crr, 10) / 100 || null; // для расчетов используется crr от 0.1 до 1
    coinState.reserve = parseInt(coinData.reserve, 10) || null;
}


function resetCoin(state) {
    setCoinData(state.coinSettings, {});
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
