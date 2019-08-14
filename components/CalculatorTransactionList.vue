<script>
    import {formatTime, pretty} from "~/assets/utils";

    export default {
        filters: {
            pretty,
            formatTime,
        },
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            transactionList() {
                let txList = this.$store.state.transactionList.slice(0);

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
                <div class="calculator-transaction__time">{{ transaction.timestamp | formatTime }}</div>
                <div class="calculator-transaction__content" v-if="transaction.type === 'buy' || transaction.type === 'sell'">
                    <strong v-if="transaction.type === 'buy'">+</strong>
                    <strong v-if="transaction.type === 'sell'">-</strong>
                    <strong>{{ transaction.coinAmount | pretty }}</strong>
                    <span>{{ coin.name }}</span>
                    <span>for</span>
                    <strong>{{ transaction.bipAmount | pretty }}</strong>
                    <span>BIP</span>
                </div>
                <div class="calculator-transaction__content" v-if="transaction.type === 'exchange'">
                    <strong>- {{ transaction.coinAmount | pretty }}</strong> {{ coin.name }} for <strong>1</strong> CUP
                </div>
            </div>
        </div>
    </div>
</template>

