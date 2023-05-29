<template>
    <div>
        <span>Hello World!</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            property: "value",
        };
    },
    created() {
        this.property = "66";
    },
    methods: {
        func() {
            const a = {
                b: 6,
            };
            const list = [];
            this.bb.ccc = 5;
            a.b = 7;
            list[0] = 1;
            console.log('111');
        },
        updateValues() {
            const values = [];
            this.getInitialValue().forEach(value => {
                console.log('value', value);
            });
            this.values = values;
        },
    },
};
</script>

<style></style>
