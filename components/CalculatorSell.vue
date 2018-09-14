<script>
    import VueAutonumeric from 'vue-autonumeric/src/components/VueAutonumeric';
    import fromExponential from 'from-exponential';
    import checkEmpty from '~/assets/v-check-empty';
    import {sellCoin, sellCoinByBip} from "~/assets/utils-math";

    const MASK_OPTIONS = {
        allowDecimalPadding: false,
        decimalPlaces: 0,
        digitGroupSeparator: '',
        emptyInputBehavior: 'zero',
        // currencySymbol: '\u2009%',
        currencySymbolPlacement: 's',
        minimumValue: '0',
        overrideMinMaxLimits: 'ignore',
        unformatOnHover: false,
        wheelStep: 1,
    };

    export default {
        components: {
            VueAutonumeric,
        },
        directives: {
            checkEmpty,
        },
        data() {
            console.log(this.$store.state.coin.supply);
            console.log(this.$store.getters.coinTotalValue);
            return {
                coinAmount: 0,
                bipAmount: 0,
                maskSellOptions: Object.assign({}, MASK_OPTIONS, {
                    currencySymbol: '\u2009' + this.$store.state.coin.name,
                    maximumValue: fromExponential(this.$store.state.coin.supply),
                }),
                maskGetOptions: Object.assign({}, MASK_OPTIONS, {
                    currencySymbol: '\u2009BIP',
                    maximumValue: fromExponential(this.$store.getters.coinTotalValue),
                }),
            };
        },
        computed: {
            coin() {
                return this.$store.state.coin;
            },
        },
        methods: {
            calculatorSubmit() {
                if (this.coinAmount === 0) {
                    return;
                }
                this.$store.commit('MAKE_TX', {
                    type: 'sell',
                    coinAmount: this.coinAmount,
                });
                this.coinAmount = 0;
                this.bipAmount = 0;
                this.maskSellOptions.maximumValue = this.$store.state.coin.supply;
                this.maskGetOptions.maximumValue = this.$store.getters.coinTotalValue;
            },
            onChangeCoinAmount() {
                this.bipAmount = Math.round(sellCoin(this.coin, this.coinAmount));
            },
            onBlurCoinAmount() {
                if (this.coinAmount > this.maskSellOptions.maximumValue) {
                    this.coinAmount = this.maskSellOptions.maximumValue;
                }
            },
            onChangeBipAmount() {
                this.coinAmount = Math.round(sellCoinByBip(this.coin, this.bipAmount));
            },
            onBlurBipAmount() {
                if (this.bipAmount > this.maskGetOptions.maximumValue) {
                    this.bipAmount = this.maskGetOptions.maximumValue;
                }
            },
        },
    };
</script>

<template>
    <div class="calculator__section">
        <p>This is how the price will go down if anyone sells your coin.</p>
        <form class="calculator__form" @submit.prevent="calculatorSubmit">
            <div class="u-grid u-grid--medium u-grid--vertical-margin calculator__form-grid">
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <VueAutonumeric type="text" class="form-field__input" inputmode="numeric"
                                        v-check-empty="'autoNumeric:formatted'"
                                        v-model="coinAmount"
                                        :options="maskSellOptions"
                                        @input.native="onChangeCoinAmount"
                                        @blur.native="onBlurCoinAmount"
                        />
                        <span class="form-field__label">Sell</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <VueAutonumeric type="text" class="form-field__input" inputmode="numeric"
                                        v-check-empty="'autoNumeric:formatted'"
                                        v-model="bipAmount"
                                        :options="maskGetOptions"
                                        @input.native="onChangeBipAmount"
                                        @blur.native="onBlurBipAmount"
                        />
                        <span class="form-field__label">Get</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-submit">
                    <button class="button button--main calculator__form-submit">Sell</button>
                </div>
            </div>
        </form>
    </div>
</template>
