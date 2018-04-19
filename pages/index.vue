<script>
    import IssueForm from "~/components/IssueForm";
    import Calculator from "~/components/Calculator";

    export default {
        beforeRouteEnter(to, from, next) {
            // Восстановление информации о монете их урл хэша
            next((vm) => {
                try {
                    let hash = unescape(to.hash.substr(1));
                    let initialCoinData = JSON.parse(hash);
                    vm.$store.commit('INIT_COIN_DATA', initialCoinData);
                    vm.$root.$emit('initCoinData');
                } catch (e) {

                }
            })

        },
        components: {
            IssueForm,
            Calculator,
        },
        watch: {
            hashCoinData(newValue) {
                // Сохранение информации о монете в урл хэш
                window.location.hash = newValue;
            },
        },
        computed: {
            hashCoinData() {
                return this.$store.getters.hashCoinData;
            },
        }
    }
</script>

<template>
    <main class="u-container--only-medium">
        <div class="u-grid u-grid--small">
            <section class="u-cell u-cell--medium--3-10 u-cell--large--1-4">
                <IssueForm/>
            </section>
            <section class="u-cell u-cell--medium--7-10 u-cell--large--3-4 calculator-cell">
                <Calculator/>
            </section>
        </div>
    </main>
</template>




