import Vue from 'vue'

export default {
    SET_COIN: (state, coin) => {
        setCoinData(state, coin);
        state.coinIsMinted = true;
    },
    RESET_COIN: (state) => {
        setCoinData(state, {});
        state.coinIsMinted = false;
    },
}

/**
 *
 * @param state
 * @param {Object} coin
 */
export function setCoinData(state, coin) {
    state.coin.name = coin.name || '';
    state.coin.supply = parseInt(coin.supply, 10) || null;
    state.coin.crr = parseInt(coin.crr, 10) || null;
    state.coin.reserve = parseInt(coin.reserve, 10) || null;
}
