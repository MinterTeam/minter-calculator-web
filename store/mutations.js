import Vue from 'vue'
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
    },
    RESET_COIN: (state) => {
        setCoinData(state.coinSettings, {});
        setCoinData(state.coin, {});
        state.coinIsMinted = false;
    },
    /**
     * @param state
     * @param {Object<{type: string, coinAmount: number}>}
     */
    MAKE_TX: (state, {type, coinAmount}) => {
        let bipAmount;
        if (type === 'buy') {
            bipAmount = buyCoinByCoin(state.coin, coinAmount);
            state.coin.supply += coinAmount;
            state.coin.reserve += bipAmount;
        } else if (type === 'sell') {
            bipAmount = sellCoin(state.coin, coinAmount);
            state.coin.supply -= coinAmount;
            state.coin.reserve -= bipAmount;
        }
        state.transactionList.push({
            type,
            coinAmount,
            bipAmount,
            timestamp: Date.now(),
        });

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
