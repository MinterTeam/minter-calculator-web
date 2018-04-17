import Vue from 'vue'

export default {
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
