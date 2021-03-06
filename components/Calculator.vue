<script>
    import {mapGetters, mapState} from 'vuex';
    import CalculatorBuy from "~/components/CalculatorBuy";
    import CalculatorSell from "~/components/CalculatorSell";
    import CalculatorExchange from "~/components/CalculatorExchange";
    import CalculatorTransactionList from '~/components/CalculatorTransactionList';
    import CalculatorTransactionExchange from '~/components/CalculatorTransactionExchange';
    import {pretty} from "~/assets/utils";

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
            CalculatorTransactionExchange,
        },
        filters: {
            pretty,
        },
        data() {
            return {
                activeAction: ACTION_BUY,
            };
        },
        computed: {
            ...mapState(['coin']),
            ...mapGetters(['coinPrice']),
            coinMarketValue() {
                return this.$store.getters.coinPrice * this.coin.supply;
            },
        },
    };
</script>

<template>
    <div class="calculator">
        <div class="calculator-stats calculator__section">
            <h2 class="calculator__title calculator-stats__title" v-if="$store.state.coinIsMinted">Current Status of&nbsp;{{ coin.name }}</h2>
            <dl class="calculator-stats__list u-grid u-grid--vertical-margin" v-if="$store.state.coinIsMinted">
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Total Supply</dt>
                    <dd class="calculator-stats__value">{{ coin.supply | pretty }} {{ coin.name }}</dd>
                </div>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Total Reserve</dt>
                    <dd class="calculator-stats__value">{{ coin.reserve | pretty }} BIP</dd>
                </div>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Price of 1 {{ coin.name }}</dt>
                    <dd class="calculator-stats__value">{{ coinPrice | pretty }} BIP</dd>
                </div>
                <div class="calculator-stats__item u-cell u-cell--auto">
                    <dt class="calculator-stats__name">Market Value</dt>
                    <dd class="calculator-stats__value">{{ coinMarketValue | pretty }} BIP</dd>
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

        <!-- История транзакций показывается после обнуления коина, пока не выпущен новый -->
        <CalculatorTransactionList v-if="!$store.state.coinIsMinted || activeAction === $options.ACTION_BUY || activeAction === $options.ACTION_SELL"/>
        <CalculatorTransactionExchange v-if="$store.state.coinIsMinted && activeAction === $options.ACTION_EXCHANGE"/>
        <div class="calculator__section" v-if="$store.state.coinIsMinted && activeAction === $options.ACTION_EXCHANGE">
            <p>Every time people exchange one coin for another, they are actually burning (lowering) the&nbsp;supply of&nbsp;one coin and moving the&nbsp;reserve of&nbsp;BIPs to&nbsp;the&nbsp;other (issuing), making the&nbsp;latter more&nbsp;expensive.</p>
            <p>That is a simple and basic rule for&nbsp;money: the&nbsp;more demand and reserve you get, the&nbsp;higher the&nbsp;price of&nbsp;your&nbsp;coin!</p>
        </div>
    </div>
</template>
