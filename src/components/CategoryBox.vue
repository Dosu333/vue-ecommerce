<template v-if="category.products.length"> 
    <div class="columns is-multiline">
        <div class="column is-12">
            <h2 class="is-size-2 has-text-centered">{{ category.name }}</h2>
        </div>

        <ProductBox
            v-for="product in category.products"
            v-bind:key="product.id"
            v-bind:product="product" />
     </div>
</template>

<script>
import ProductBox from '@/components/ProductBox'

export default {
    name: 'CategoryBox',
    props: {
        category: Object
    },
    components: {
    ProductBox
  },
}
</script>