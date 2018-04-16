<script>
    import {mapState} from 'vuex';
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    import between from 'vuelidate/lib/validators/between';
    import {VMoney} from 'v-money';
    import {IMaskDirective} from 'vue-imask';
    import {setCoinData} from "~/store/mutations";

    const MIN_CRR = 10;
    const MAX_CRR = 100;

    export default {
        name: 'IssueForm',
        directives: {
            imask: IMaskDirective,
            money: VMoney,
        },
        mixins: [validationMixin],
        data() {
            return {
                coin: {
                    name: this.$store.state.coin.name,
                    supply: this.$store.state.coin.supply,
                    crr: this.$store.state.coin.crr,
                    reserve: this.$store.state.coin.reserve,
                },
                coinCrrMasked: '',
                imaskNameOptions: {
                    mask: 'aaa',
                    prepare: (str) => str.toUpperCase(),
                },
                imaskSupplyOptions: {
                    mask: Number,
                    scale: 0,  // digits after point, 0 for integers
                    signed: false,  // disallow negative
                },
                moneyCrrOptions: {
                    decimal: '.',
                    thousands: '',
                    prefix: '',
                    suffix: '%',
                    precision: 0,
                    //min: MIN_CRR,
                    max: MAX_CRR,
                    allowBlank: true,
                },
                imaskReserveOptions: {
                    mask: Number,
                    scale: 0,  // digits after point, 0 for integers
                    signed: false,  // disallow negative
                },
            }
        },
        validations() {
            return {
                coin: {
                    name: {
                        required,
                    },
                    supply: {
                        required,
                    },
                    crr: {
                        required,
                        between: between(MIN_CRR, MAX_CRR),
                    },
                    reserve: {
                        required,
                    },
                },
            }
        },
        computed: {
            ...mapState(['coinIsMinted']),
        },
        watch: {
            coinCrrMasked(newValue, oldValue) {
                let crr = parseInt(this.coinCrrMasked, 10) || 0;
                if (crr === 0) {
                    this.coin.crr = null;
                } else {
                    this.coin.crr = crr;
                }
            },
        },
        methods: {
            mintCoin() {
                if (this.coinIsMinted) {
                    return;
                }
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                this.$store.commit('SET_COIN', this.coin);
            },
            resetCoin() {
                // reset store
                this.$store.commit('RESET_COIN');
                // reset data
                setCoinData(this, {});
                this.coinCrrMasked = '';
                this.$v.$reset();
            },
            // masks
            onAcceptName: makeAccepter('name'),
            onAcceptSupply: makeAccepter('supply'),
            onBlurCrr() {
                let crr = parseInt(this.coinCrrMasked, 10) || 0;
                if (crr === 0) {
                    // reset if 0
                    this.coinCrrMasked = '';
                    this.coin.crr = null;
                } else {
                    // apply min/max
                    if (crr < MIN_CRR) {
                        crr = MIN_CRR;
                    }
                    if (crr > MAX_CRR) {
                        crr = MAX_CRR;
                    }
                    this.coinCrrMasked = crr + '%';
                    this.coin.crr = crr;
                }
            },
            onAcceptReserve: makeAccepter('reserve'),
        }
    }

    function makeAccepter(propName) {
        return function(maskRef) {
            this.coin[propName] = maskRef.detail._unmaskedValue;
        }
    }
</script>

<template>
    <div>
        <form class="issue" @submit.prevent="mintCoin">
            <div class="issue__fields">
                <h1 class="title form-row">Issue your coin</h1>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Name your coin…"
                           :value="coin.name"
                           :disabled="coinIsMinted"
                           v-imask="imaskNameOptions"
                           @accept="onAcceptName"
                    >
                    <span class="form-field__help">Choose a 3-letter ticker</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Initial Supply"
                           :value="coin.supply"
                           :disabled="coinIsMinted"
                           v-imask="imaskSupplyOptions"
                           @accept="onAcceptSupply"
                    >
                    <span class="form-field__help">How many coins do you want to start with?</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="CRR, %"
                           v-model.lazy="coinCrrMasked"
                           v-money="moneyCrrOptions"
                           :disabled="coinIsMinted"
                           @blur="onBlurCrr"
                    >
                    <span class="form-field__help">Constant Reserve Ratio is the percentage of bips in the value of total supply.</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Reserve"
                           :value="coin.reserve"
                           :disabled="coinIsMinted"
                           v-imask="imaskReserveOptions"
                           @accept="onAcceptReserve"
                    >
                    <span class="form-field__help">The number of bips in the initial emission.</span>
                </label>
            </div>
            <button class="issue__button button button--main" v-if="!coinIsMinted" :disabled="$v.$invalid">Mint!</button>
        </form>
        <button class="issue__button button button--main" v-if="coinIsMinted" @click.prevent="resetCoin">Clear & Start Over</button>
    </div>
</template>
