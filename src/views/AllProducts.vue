<template>
   <div class="page-category">
       <template v-if="categories">
           <CategoryBox
            v-for="category in categories"
            v-bind:key="category.id"
            v-bind:category="category"/><br>
       </template>

       <template v-else>
           <div class="column is-12">
                <h4 class="is-size-4 has-text-centered">No products have been uploaded yet</h4>
            </div>
       </template>
        
   </div>
   
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'
import CategoryBox from '@/components/CategoryBox'

export default {
    name: 'AllProducts',
    components: {
        CategoryBox
    },
    data() {
        return {
            categories: {}
        }
    },
    mounted() {
        // document.title = `All Products | ${this.$store.state.storeDetails.store_name}`
        this.getCategories()
    },
    methods: {
        async getCategories() {
            this.$store.commit('setIsLoading', true)
            if (this.$store.state.storeDetails.gotDetails) {
                await axios
                .get(`category/?search=${this.$store.state.storeDetails.id}`)
                .then(response => {
                    this.categories = response.data.results
                    document.title = `All Products | ${this.$store.state.storeDetails.store_name}`
                })
                .catch(error => {
                    console.log(error)
                    toast({
                        message: 'Something went wrong. Please try again.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                })
                
            this.$store.commit('setIsLoading', false)
            } else {
                await this.$store.commit('setStoreDetails', this.getCategories())
            }
            
        }
    }
}
</script>