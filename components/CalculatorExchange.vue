<script>
    import checkEmpty from '~/assets/v-check-empty';
    import {roundCoin} from "~/assets/utils";

    export default {
        directives: {
            checkEmpty,
        },
        // data() {
        //     return {
        //
        //     }
        // },
        computed: {
            coin() {
                return this.$store.state.coin;
            },
            cup() {
                return {
                    name: this.$store.state.cupCoin.name,
                    supply: roundCoin(this.$store.state.cupCoin.supply),
                    crr: this.$store.state.cupCoin.crr * 100,
                    reserve: roundCoin(this.$store.state.cupCoin.reserve),
                    price: roundCoin(this.$store.getters.cupPriceInCoins),
                };
            },
            canExchange() {
                // достаточно ли бипов в резерве для обмена коина на CUP
                return this.$store.state.coin.reserve >= this.$store.getters.bipNeedForCup;
            }
        },
        methods: {
            calculatorSubmit() {
                this.$store.commit('MAKE_TX_EXCHANGE');
            },
        },
    }
</script>

<template>
    <div class="calculator__section" v-if="$store.state.coinIsMinted">
        <p>Minter allows an instant and fair exchange of any coin issued within the network. We’ve created a testcoin so you can play around. Here are its specs:</p>
        <form class="calculator__form" @submit.prevent="calculatorSubmit">
            <div class="u-grid u-grid--vertical-margin">
                <div class="u-cell u-cell--medium--2-10">
                    <label class="form-field">
                        <input type="text" class="form-field__input" disabled
                               :value="cup.name"
                               v-check-empty
                        >
                        <span class="form-field__label">Name</span>
                    </label>
                </div>
                <div class="u-cell u-cell--medium--2-10">
                    <label class="form-field">
                        <input type="text" class="form-field__input" disabled
                               :value="cup.supply"
                               v-check-empty
                        >
                        <span class="form-field__label">Supply, CUP</span>
                    </label>
                </div>
                <div class="u-cell u-cell--medium--2-10">
                    <label class="form-field">
                        <input type="text" class="form-field__input" disabled
                               :value="cup.crr"
                               v-check-empty
                        >
                        <span class="form-field__label">CRR, %</span>
                    </label>
                </div>
                <div class="u-cell u-cell--medium--2-10">
                    <label class="form-field">
                        <input type="text" class="form-field__input" disabled
                               :value="cup.reserve"
                               v-check-empty
                        >
                        <span class="form-field__label">Reserve, bip</span>
                    </label>
                </div>
                <div class="u-cell u-cell--medium--2-10">
                    <label class="form-field">
                        <input type="text" class="form-field__input" disabled
                               :value="cup.price"
                               v-check-empty
                        >
                        <span class="form-field__label">Price of 1 CUP</span>
                    </label>
                </div>
            </div>
            <div class="calculator-exchange__submit-group">
                <div class="u-grid u-grid--vertical-margin">
                    <p class="u-cell u-cell--large--1-2">
                        Now, imagine if someone was willing to&nbsp;pay for&nbsp;a&nbsp;CUP of&nbsp;coffee with your&nbsp;coin.
                    </p>
                    <div class="u-cell u-cell--large--1-2">
                        <button class="calculator-exchange__submit button button--main" v-if="canExchange">Exchange {{ cup.price }} {{ coin.name }} for&nbsp;1&nbsp;CUP</button>
                        <strong class="v-else">Not enough {{ coin.name }} to exchange</strong>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
