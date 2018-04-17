<script>
    import {mapGetters} from 'vuex';
    import CalculatorBuy from "~/components/CalculatorBuy";
    import CalculatorSell from "~/components/CalculatorSell";
    import CalculatorExchange from "~/components/CalculatorExchange";

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
            CalculatorExchange
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
            ...mapGetters(['coinPrice', 'coinMarketValue']),
        }
    }
</script>

<template>
    <div class="calculator">
        <div class="calculator-stats calculator__section">
            <dl class="calculator-stats__list u-grid" v-if="$store.state.coinIsMinted">
                <h2 class="calculator-stats__title u-cell u-cell--auto">Current Status <br class="u-hidden-medium-down"> of&nbsp;{{ coin.name }}</h2>
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
    </div>
</template>
