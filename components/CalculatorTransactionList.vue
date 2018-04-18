<script>
    import {roundCoin} from "~/assets/utils-math";

    export default {
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            transactionList() {
                let txList = this.$store.state.transactionList.map((tx) => {
                    let txDate = new Date(tx.timestamp);
                    let txTimeString = padZero(txDate.getHours()) + ':' + padZero(txDate.getMinutes()) + ':' + padZero(txDate.getSeconds());
                    return {
                        ...tx,
                        time: txTimeString,
                        bipAmount: roundCoin(tx.bipAmount),
                    };
                });

                return txList.reverse();
            }
        }
    }

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
    <div class="calculator__section">
        <h2 class="calculator__title">History of Transactions</h2>
        <div class="calculator-transaction__list">
            <div class="calculator-transaction__item" v-for="transaction in transactionList" :key="transaction.timestamp">
                <div class="calculator-transaction__time">{{ transaction.time }}</div>
                <div class="calculator-transaction__content">
                    <strong v-if="transaction.type === 'buy'">+</strong>
                    <strong v-if="transaction.type === 'sell'">-</strong>
                    <strong>{{ transaction.coinAmount }}</strong>
                    <span>{{ coin.name }}</span>
                    <span>for</span>
                    <strong>{{ transaction.bipAmount }}</strong>
                    <span>bips</span>
                </div>
            </div>
        </div>
    </div>
</template>

