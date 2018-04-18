<script>
    import IssueForm from "~/components/IssueForm";
    import Calculator from "~/components/Calculator";

    export default {
        components: {
            IssueForm,
            Calculator,

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




