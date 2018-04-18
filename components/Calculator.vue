<script>
    import {mapGetters} from 'vuex';
    import CalculatorBuy from "~/components/CalculatorBuy";
    import CalculatorSell from "~/components/CalculatorSell";
    import CalculatorExchange from "~/components/CalculatorExchange";
    import CalculatorTransactionList from '~/components/CalculatorTransactionList';
    import {roundCoin} from "~/assets/utils-math";

    const ACTION_BUY = 'buy';
    const ACTION_SELL = 'sell';
    const ACTION_EXCHANGE = 'exchange';

    export default {
        ACTION_BUY,
        ACTION_SELL,
        ACTION_EXCHANGE,
        components: {
            CalculatorBuy,
            CalculatorSell,
            CalculatorExchange,
            CalculatorTransactionList,
        },
        data() {
            return {
                activeAction: ACTION_BUY,
            }
        },
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            coinPrice() {
                return roundCoin(this.$store.getters.coinPrice);
            },
            coinMarketValue() {
                return roundCoin(this.$store.getters.coinMarketValue);
            },
        }
    }
</script>

<template>
    <div class="calculator">
        <div class="calculator-stats calculator__section">
            <dl class="calculator-stats__list u-grid u-grid--vertical-margin" v-if="$store.state.coinIsMinted">
                <h2 class="calculator__title calculator-stats__title u-cell u-cell--auto">Current Status <br class="u-hidden-large-down"> of&nbsp;{{ coin.name }}</h2>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Total Supply</dt>
                    <dd class="calculator-stats__value">{{ coin.supply }} {{ coin.name }}</dd>
                </div>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Price of 1 {{ coin.name }}</dt>
                    <dd class="calculator-stats__value">{{ coinPrice }} bips</dd>
                </div>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Market Value</dt>
                    <dd class="calculator-stats__value">{{ coinMarketValue }} bips</dd>
                </div>
            </dl>
            <div class="calculator-stats__no-coin u-text-center" v-else>Issue your coin to start exchanging, buying, and selling.</div>
        </div>
        <div class="calculator-tabs">
            <button class="calculator-tabs__button u-semantic-button"
                    :disabled="!$store.state.coinIsMinted"
                    :class="{'is-active': activeAction === $options.ACTION_BUY}"
                    @click="activeAction = $options.ACTION_BUY"
            >Buy</button>
            <button class="calculator-tabs__button u-semantic-button"
                    :disabled="!$store.state.coinIsMinted"
                    :class="{'is-active': activeAction === $options.ACTION_SELL}"
                    @click="activeAction = $options.ACTION_SELL"
            >Sell</button>
            <button class="calculator-tabs__button u-semantic-button"
                    :disabled="!$store.state.coinIsMinted"
                    :class="{'is-active': activeAction === $options.ACTION_EXCHANGE}"
                    @click="activeAction = $options.ACTION_EXCHANGE"
            >Exchange</button>
        </div>

        <CalculatorBuy v-if="$store.state.coinIsMinted && activeAction === $options.ACTION_BUY"/>
        <CalculatorSell v-if="$store.state.coinIsMinted && activeAction === $options.ACTION_SELL"/>
        <CalculatorExchange v-if="$store.state.coinIsMinted && activeAction === $options.ACTION_EXCHANGE"/>

        <CalculatorTransactionList v-if="$store.state.coinIsMinted && $store.state.transactionList.length"/>
    </div>
</template>
