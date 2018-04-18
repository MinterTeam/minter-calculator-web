<script>
    import {roundCoin, formatTime} from "~/assets/utils";

    export default {
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            lastTxExchange() {
                let txList = this.$store.state.transactionList;
                if (txList.length && txList[txList.length - 1].type === 'exchange') {
                    let lastTx = txList[txList.length - 1];
                    return {
                        coinAmount: roundCoin(lastTx.coinAmount),
                        time: formatTime(lastTx.timestamp),
                        deltaCoinPrice: roundCoin(lastTx.deltaCoinPrice),
                        deltaCoinPercent: roundCoin(lastTx.deltaCoinPercent),
                        deltaCupPrice: roundCoin(lastTx.deltaCupPrice),
                        deltaCupPercent: roundCoin(lastTx.deltaCupPercent),
                    }
                } else {
                    return null;
                }

            }
        }
    }


</script>

<template>
    <div class="calculator__section calculator__section--transaction" v-if="lastTxExchange">
        <h2 class="calculator__title">Results of transaction</h2>
        <div class="calculator-transaction__list">
            <div class="calculator-transaction__item">
                <div class="calculator-transaction__time">{{ lastTxExchange.time }}</div>
                <div class="calculator-transaction__content">
                    <div class="u-grid u-grid--vertical-margin-small">
                        <div class="u-cell">
                            You’ve paid <strong>{{ lastTxExchange.coinAmount }} {{ coin.name }}</strong> for <strong>1 CUP</strong>
                        </div>
                        <div class="u-cell u-cell--medium--1-2">
                            Price of 1 CUP after transaction <br>
                            <strong class="calculator-transaction__green">
                                {{ lastTxExchange.deltaCupPrice }} bips, +{{ lastTxExchange.deltaCupPercent }}%
                            </strong>
                        </div>
                        <div class="u-cell u-cell--medium--1-2">
                            Price of 1 {{ coin.name }} after transaction <br>
                            <strong class="calculator-transaction__red">
                                {{ lastTxExchange.deltaCoinPrice }} bips, -{{ lastTxExchange.deltaCoinPercent }}%
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

