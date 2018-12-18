<script>
    // needed for `autonumeric`
    import 'core-js/modules/es6.object.freeze';
    import {mapState} from 'vuex';
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    import withParams from 'vuelidate/lib/withParams';
    // import VueAutonumeric from 'vue-autonumeric/src/components/VueAutonumeric';
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
        created() {
            setCoinData(this.coinForm, this.$store.state.coinSettings, {undefinedNumber: ''});
            this.$root.$on('initCoinData', () => {
                setCoinData(this.coinForm, this.$store.state.coinSettings, {undefinedNumber: ''});
                //@TODO add percent sign
            });
        },
        components: {
            VueAutonumeric: () => import('vue-autonumeric/src/components/VueAutonumeric'),
        },
        directives: {
            imask: IMaskDirective,
        },
        mixins: [validationMixin],
        data() {
            return {
                /** @type CoinFormData */
                coinForm: {
                    name: '',
                    supply: '',
                    crr: '',
                    reserve: '',
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
                maskCrrOptions: {
                    allowDecimalPadding: false,
                    decimalPlaces: 0,
                    digitGroupSeparator: '',
                    emptyInputBehavior: 'null',
                    currencySymbol: '\u2009%',
                    maximumValue: MAX_CRR,
                    currencySymbolPlacement: 's',
                    minimumValue: '0',
                    overrideMinMaxLimits: 'ignore',
                    unformatOnHover: false,
                    wheelStep: 1,
                },
                imaskReserveOptions: {
                    mask: Number,
                    scale: 0,  // digits after point, 0 for integers
                    signed: false,  // disallow negative
                },
            };
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
            };
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
                setCoinData(this.coinForm, {}, {undefinedNumber: ''});
                this.$v.$reset();
                // reset iMask instances
                this.$refs.nameInput.maskRef.value = '';
                this.$refs.supplyInput.maskRef.value = '';
                this.$refs.reserveInput.maskRef.value = '';
            },
            // masks
            onAcceptName: makeAccepter('name'),
            onAcceptSupply: makeAccepter('supply'),
            onBlurCrr() {
                if (this.coinForm.crr < MIN_CRR) {
                    this.coinForm.crr = MIN_CRR;
                } else if (this.coinForm.crr > MAX_CRR) {
                    this.coinForm.crr = MAX_CRR;
                }
            },
            onAcceptReserve: makeAccepter('reserve'),
        },
    };

    function makeAccepter(propName) {
        return function(e) {
            this.coinForm[propName] = e.detail._unmaskedValue;
        };
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
                    <no-ssr>
                        <VueAutonumeric class="form-field__input" type="text" placeholder="CRR, %" inputmode="numeric"
                                        v-model="coinForm.crr"
                                        :options="maskCrrOptions"
                                        :disabled="coinIsMinted"
                                        @blur.native="onBlurCrr"
                        />
                        <input class="form-field__input" type="text" placeholder="CRR, %" slot="placeholder">
                    </no-ssr>
                    <span class="form-field__help">Constant Reserve Ratio is the percentage of BIPs in the value of total supply.</span>
                </label>
                <label class="form-field form-row" :class="{'is-disabled': coinIsMinted}">
                    <input class="form-field__input" type="text" placeholder="Reserve"
                           ref="reserveInput"
                           :value="coinForm.reserve"
                           :disabled="coinIsMinted"
                           v-imask="imaskReserveOptions"
                           @accept="onAcceptReserve"
                    >
                    <span class="form-field__help">The number of BIPs in the initial emission.</span>
                </label>
            </div>
            <button class="issue__button button button--main" v-if="!coinIsMinted" :disabled="$v.$invalid">Mint!</button>
        </form>
        <button class="issue__button button button--main" v-if="coinIsMinted" @click.prevent="resetCoin">Clear & Start Over</button>
    </div>
</template>
