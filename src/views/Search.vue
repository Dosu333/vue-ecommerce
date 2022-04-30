
<template>
    <div class="page-search">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Search</h1>

                <h2 class="is-size-5 has-text-grey">Search term: "{{ query }}"</h2>
            </div>

            <ProductBox 
                v-for="product in products"
                v-bind:key="product.id"
                v-bind:product="product" />
        </div>
        <!-- <div v-else>
            No products
        </div> -->
    </div>
</template>

<script>
import axios from 'axios'
import ProductBox from '@/components/ProductBox.vue'

export default {
    name: 'Search',
    components: {
        ProductBox
    },
    data() {
        return {
            products: [],
            query: '',
            storeId: '',
            storeName: ''
        }
    },
    mounted() {
        

        let uri = window.location.search.substring(1)
        let params = new URLSearchParams(uri)
        this.storeId = this.$store.state.storeDetails.id
        this.storeName = this.$store.state.storeDetails.store_name

        if (params.get('query')) {
            this.query = params.get('query')
            this.$store.commit('setStoreDetails', this.performSearch)
            // this.performSearch()
        }
    },
    methods: {
        async performSearch() {
            this.$store.commit('setIsLoading', true)
            document.title = `Search | ${this.$store.state.storeDetails.store_name}`
            await axios
                .post('search/', {'query': this.query, 'store_id':this.$store.state.storeDetails.id})
                .then(response => {
                    this.products = response.data['products']
                })
                .catch(error => {
                    console.log(error)
                })
            this.$store.commit('setIsLoading', false)
        }
    }
}
</script>
