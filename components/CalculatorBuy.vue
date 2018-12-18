<script>
    // needed for `autonumeric`
    import 'core-js/modules/es6.object.freeze';
    // import VueAutonumeric from 'vue-autonumeric/src/components/VueAutonumeric';
    import checkEmpty from '~/assets/v-check-empty';
    import {buyCoin, buyCoinByCoin} from "~/assets/utils-math";

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
            VueAutonumeric: () => import('vue-autonumeric/src/components/VueAutonumeric'),
        },
        directives: {
            checkEmpty,
        },
        data() {
            return {
                coinAmount: 0,
                bipAmount: 0,
                maskBuyOptions: Object.assign({}, MASK_OPTIONS, {
                    currencySymbol: '\u2009' + this.$store.state.coin.name,
                }),
                maskPayOptions: Object.assign({}, MASK_OPTIONS, {
                    currencySymbol: '\u2009BIP',
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
                    type: 'buy',
                    coinAmount: this.coinAmount,
                });
                this.coinAmount = 0;
                this.bipAmount = 0;
            },
            onChangeCoinAmount() {
                this.bipAmount = Math.round(buyCoinByCoin(this.coin, this.coinAmount));
            },
            onChangeBipAmount() {
                this.coinAmount = Math.round(buyCoin(this.coin, this.bipAmount));
            },
        },
    };
</script>

<template>
    <div class="calculator__section">
        <p>This is an example of how anyone will be able to buy your {{ coin.name }} and drive the price up!</p>
        <form class="calculator__form" @submit.prevent="calculatorSubmit">
            <div class="u-grid u-grid--medium u-grid--vertical-margin calculator__form-grid">
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <no-ssr>
                            <VueAutonumeric type="text" class="form-field__input" inputmode="numeric" v-check-empty="'autoNumeric:formatted'"
                                            v-model="coinAmount"
                                            :options="maskBuyOptions"
                                            @input.native="onChangeCoinAmount"
                            />
                            <input class="form-field__input" type="text" slot="placeholder">
                        </no-ssr>
                        <span class="form-field__label">Buy</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-field">
                    <label class="form-field">
                        <no-ssr>
                            <VueAutonumeric type="text" class="form-field__input" inputmode="numeric" v-check-empty="'autoNumeric:formatted'"
                                            v-model="bipAmount"
                                            :options="maskPayOptions"
                                            @input.native="onChangeBipAmount"
                            />
                            <input class="form-field__input" type="text" slot="placeholder">
                        </no-ssr>
                        <span class="form-field__label">Pay</span>
                    </label>
                </div>
                <div class="u-cell u-cell--auto calculator__form-cell-submit">
                    <button class="button button--main calculator__form-submit">Buy!</button>
                </div>
            </div>
        </form>
    </div>
</template>
