import {sellCoin} from "~/assets/utils-math";

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
     * Coin Market Value - кол-во бипов, получаемых за продажу все коинов
     * @param state
     * @return {number} - bips amount
     */
    coinMarketValue: (state) => {
        return sellCoin(state.coin, state.coin.supply);
    },


}
