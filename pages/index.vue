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
    <main class="u-container">
        <div class="u-grid u-grid--small u-grid--vertical-margin">
            <section class="u-cell u-cell--medium--1-4">
                <IssueForm/>
            </section>
            <section class="u-cell u-cell--medium--3-4 calculator-cell">
                <Calculator/>
            </section>
        </div>
    </main>
</template>




