<script>
    import {roundCoin, formatTime} from "~/assets/utils";

    export default {
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            transactionList() {
                let txList = this.$store.state.transactionList.map((tx) => {
                    return {
                        ...tx,
                        time: formatTime(tx.timestamp),
                        coinAmount: roundCoin(tx.coinAmount),
                        bipAmount: roundCoin(tx.bipAmount),
                    };
                });

                return txList.reverse();
            },
        },
    };

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
</script>

<template>
    <div class="calculator__section calculator__section--transaction" v-if="transactionList.length">
        <h2 class="calculator__title">History of Transactions</h2>
        <div class="calculator-transaction__list">
            <div class="calculator-transaction__item" v-for="transaction in transactionList" :key="transaction.timestamp">
                <div class="calculator-transaction__time">{{ transaction.time }}</div>
                <div class="calculator-transaction__content" v-if="transaction.type === 'buy' || transaction.type === 'sell'">
                    <strong v-if="transaction.type === 'buy'">+</strong>
                    <strong v-if="transaction.type === 'sell'">-</strong>
                    <strong>{{ transaction.coinAmount }}</strong>
                    <span>{{ coin.name }}</span>
                    <span>for</span>
                    <strong>{{ transaction.bipAmount }}</strong>
                    <span>BIP</span>
                </div>
                <div class="calculator-transaction__content" v-if="transaction.type === 'exchange'">
                    <strong>- {{ transaction.coinAmount }}</strong> {{ coin.name }} for <strong>1</strong> CUP
                </div>
            </div>
        </div>
    </div>
</template>

