import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

/**
 * @typedef {Object} Coin
 * @property {string} name
 * @property {number|null} supply
 * @property {number|null} crr
 * @property {number|null} reserve
 */

/**
 * @typedef {Object} Transaction
 * @property {'buy'|'sell'|'exchange'} type
 * @property {number} coinAmount
 * @property {number} bipAmount
 * @property {timestamp} timestamp
 */

/**
 * @typedef {Transaction} TransactionExchange
 * @property {number} deltaCoinPrice
 * @property {number} deltaCoinPercent
 * @property {number} deltaCupPrice
 * @property {number} deltaCupPercent
 */

export default function createStore() {
    return new Vuex.Store({
        state: {
            /** @type CoinFormData - initial coin settings */
            coinSettings: {
                name: '',
                supply: '',
                crr: '', // crr в процентах
                reserve: '',
            },
            /** @type Coin - current coin status */
            coin: {
                name: '',
                supply: 0 || null,
                crr: 0 || null, // crr для расчетов от 0.1 до 1
                reserve: 0 || null,
            },
            coinIsMinted: false,
            /** @type Coin - predefined CUP coin */
            cupCoin: {
                name: 'CUP',
                supply: 1000,
                crr: 0.8,
                reserve: 100,
            },
            /** @type Array<Transaction|TransactionExchange> */
            transactionList: [],
        },
        actions,
        mutations,
        getters,
    });
}
