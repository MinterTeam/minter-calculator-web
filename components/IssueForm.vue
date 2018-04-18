<script>
    import {mapState} from 'vuex';
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    import withParams from 'vuelidate/lib/withParams';
    import {VMoney} from 'v-money';
    import {IMaskDirective} from 'vue-imask';
    import {setCoinData} from "~/store/mutations";

    const MIN_CRR = 10;
    const MAX_CRR = 100;

    const crrValidator = withParams({type: 'validCrr'}, function(value) {
        let crr = parseInt(value, 10);
        return MIN_CRR <= crr && MAX_CRR >= crr;
    });

    /**
     * @typedef {Object} CoinFormData
     * @property {string} name
     * @property {number|string|null} supply
     * @property {number|string|null} crr
     * @property {number|string|null} reserve
     */

    export default {
        name: 'IssueForm',
        directives: {
            imask: IMaskDirective,
            money: VMoney,
        },
        mixins: [validationMixin],
        data() {
            return {
                /** @type CoinFormData */
                coinForm: {
                    name: this.$store.state.coinSettings.name,
                    supply: this.$store.state.coinSettings.supply,
                    crr: this.$store.state.coinSettings.crr,
                    reserve: this.$store.state.coinSettings.reserve,
                },
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
                    min: 0,
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
                coinForm: {
                    name: {
                        required,
                    },
                    supply: {
                        required,
                    },
                    crr: {
                        required,
                        between: crrValidator,
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
        methods: {
            mintCoin() {
                if (this.coinIsMinted) {
                    return;
                }
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                this.$store.commit('MINT_COIN', this.coinForm);
            },
            resetCoin() {
                // reset store
                this.$store.commit('RESET_COIN');
                // reset data
                setCoinData(this.coinForm, {});
                this.$v.$reset();
                // reset iMask instances
                this.$refs.nameInput.maskRef.value = '';
                this.$refs.supplyInput.maskRef.value = '';
                this.$refs.reserveInput.maskRef.value = '';
            },
            // masks
            onAcceptName: makeAccepter('name'),
            onAcceptSupply: makeAccepter('supply'),
            onAcceptCrrMasked(e) {
                this.coinForm.crr = e.detail.unmaskedValue ? e.detail.value : '';
            },
            onBlurCrr() {
                let crr = parseInt(this.coinForm.crr, 10);
                if (!crr) {
                    this.coinForm.crr = '';
                    this.$refs.crrInput.value = ''
                } else {
                    // apply min/max
                    if (crr < MIN_CRR) {
                        crr = MIN_CRR;
                    }
                    if (crr > MAX_CRR) {
                        crr = MAX_CRR;
                    }
                    this.coinForm.crr = crr + '%';
                }
            },
            onAcceptReserve: makeAccepter('reserve'),
        }
    }

    function makeAccepter(propName) {
        return function(e) {
            this.coinForm[propName] = e.detail._unmaskedValue;
        }
    }
</script>

<template>
    <div>
        <form class="issue" @submit.prevent="mintCoin" :class="{'u-hidden-medium-down': coinIsMinted}">
            <div class="issue__fields">
                <h1 class="title form-row">Issue your coin</h1>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Name your coin…"
                           ref="nameInput"
                           :value="coinForm.name"
                           :disabled="coinIsMinted"
                           v-imask="imaskNameOptions"
                           @accept="onAcceptName"
                    >
                    <span class="form-field__help">Choose a 3-letter ticker</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Initial Supply"
                           ref="supplyInput"
                           :value="coinForm.supply"
                           :disabled="coinIsMinted"
                           v-imask="imaskSupplyOptions"
                           @accept="onAcceptSupply"
                    >
                    <span class="form-field__help">How many coins do you want to start with?</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="CRR, %"
                           ref="crrInput"
                           :value="coinForm.crr"
                           v-money="moneyCrrOptions"
                           :disabled="coinIsMinted"
                           @accept="onAcceptCrrMasked"
                           @blur="onBlurCrr"
                    >
                    <span class="form-field__help">Constant Reserve Ratio is the percentage of bips in the value of total supply.</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Reserve"
                           ref="reserveInput"
                           :value="coinForm.reserve"
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
