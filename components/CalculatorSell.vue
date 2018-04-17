<script>
    import {VMoney} from 'v-money';
    import checkEmpty from '~/assets/v-check-empty';
    import {sellCoin, sellCoinByBip} from "~/assets/utils-math";

    const V_MONEY_OPTIONS = {
        decimal: '.',
        thousands: '',
        prefix: '',
        precision: 0,
        min: 0,
        allowBlank: true,
    };

    export default {
        directives: {
            checkEmpty,
            money: VMoney,
        },
        data() {
            return {
                coinAmount: 0,
                bipAmount: 0,
                vMoneySellOptions: Object.assign({}, V_MONEY_OPTIONS, {
                    suffix: ' ' + this.$store.state.coin.name,
                    max: this.$store.state.coin.supply,
                }),
                vMoneyGetOptions: Object.assign({}, V_MONEY_OPTIONS, {
                    suffix: ' bips',
                    max: this.$store.getters.coinMarketValue,
                }),
            }
        },
        computed: {
            coin() {
                return this.$store.state.coin;
            },
        },
        watch: {
            coinAmount(newValue, oldValue) {
                this.$nextTick(() => {
                    this.$refs.coinInput.dispatchEvent(new Event('updateFormat'));
                })
            },
            bipAmount(newValue, oldValue) {
                this.$nextTick(() => {
                    this.$refs.bipInput.dispatchEvent(new Event('updateFormat'));
                })
            }
        },
        methods: {
            calculatorSubmit() {

            },
            onChangeCoinAmount(e) {
                this.coinAmount = e.detail.unmaskedValue;
                this.bipAmount = Math.round(sellCoin(this.coin, this.coinAmount));
            },
            onChangeBipAmount(e) {
                this.bipAmount = e.detail.unmaskedValue;
                this.coinAmount = Math.round(sellCoinByBip(this.coin, this.bipAmount));
            },
        },
    }
</script>

<template>
    <div class="calculator__section">
        <p>This is how the price will go down if anyone sells your coin.</p>
        <form class="calculator__form" @submit.prevent="calculatorSubmit">
            <div class="u-grid u-grid--medium u-grid--vertical-margin calculator__form-grid">
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <input type="text" class="form-field__input"
                               ref="coinInput"
                               :value="coinAmount"
                               v-money="vMoneySellOptions"
                               v-check-empty
                               @accept="onChangeCoinAmount"
                        >
                        <span class="form-field__label">Sell</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <input type="text" class="form-field__input"
                               ref="bipInput"
                               :value="bipAmount"
                               v-money="vMoneyGetOptions"
                               v-check-empty
                               @accept="onChangeBipAmount"
                        >
                        <span class="form-field__label">Get</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-submit">
                    <button class="button button--main calculator__form-submit">Buy!</button>
                </div>
            </div>
        </form>
    </div>
</template>
