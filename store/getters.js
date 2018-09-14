import {sellCoin, buyCoinByCoin, sellCoinByBip} from "~/assets/utils-math";

export default {
    /**
     * Coin Price - цена одного коина в бипах
     * @param state
     * @return {number} - bips amount
     */
    coinPrice: (state) => {
        return sellCoin(state.coin, 1);
    },
    /**
     * Coin Total Value - кол-во бипов, получаемых за продажу все коинов
     * @param state
     * @return {number} - bips amount
     */
    coinTotalValue: (state) => {
        return sellCoin(state.coin, state.coin.supply);
    },
    /**
     * CUP Price - цена одного CUP в коинах
     * @param state
     * @return {number} - coin amount
     */
    cupPriceInCoins: (state) => {
        let bipNeedForCup = buyCoinByCoin(state.cupCoin, 1);
        return sellCoinByBip(state.coin, bipNeedForCup);
    },
    /**
     * кол-во бипов необходимых для покупки 1 CUP
     * @param state
     * @return {number} - bips amount
     */
    bipNeedForCup: (state) => {
        return buyCoinByCoin(state.cupCoin, 1);
    },
    /**
     * Упаковка информации о монете для сохранения в урл хэш
     * @param state
     * @return {string}
     */
    hashCoinData: (state) => {
        let data = {
            coinSettings: state.coinSettings,
            coin: state.coin,
            coinIsMinted: state.coinIsMinted,
        };
        return JSON.stringify(data);
    },


};
