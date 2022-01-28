<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
      <div class='hero-body has-text-centered'>
        <p class='title mb-6'>
          Welcome to {{ storeDetails.store_name }}
        </p>

        <p class='subtitle'>
          {{ storeDetails.store_description }}
        </p>
      </div>
    </section>

    <div class='columns is-multiline'>
      <div class='column is-12'>
        <h3 class="is-size-2 has-text-centered">Latest Products</h3>
      </div>

      <template v-if="latestProducts.length">
        <ProductBox 
        v-for="product in latestProducts"
        v-bind:key="product.id"
        v-bind:product="product" />
      </template>

      <template v-else>
        <div class="column is-12">
          <h4 class="is-size-4 has-text-centered">No products have been uploaded yet</h4>
        </div>
      </template>
     
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios'
import ProductBox from '@/components/ProductBox'

export default {
  name: 'Home',
  data() {
    return {
      latestProducts: [],
      storeDetails: {
        gotDetails: false,
        id: '',
        store_domain: '',
        store_name: '',
        store_description: '',
        primary_store_color: '',
        secondary_store_color: '',
    },
    }
  },
  components: {
    ProductBox
  },
  mounted() {
    
    this.storeDetails = this.$store.state.storeDetails
    this.getLatestProducts()
  },
  methods: {
    async getLatestProducts() {

      this.$store.commit('setIsLoading', true)

      if (this.$store.state.storeDetails.gotDetails){
        document.title = 'Home | ' +  this.storeDetails.store_name

        await axios
        .get(`latest-products/?vendor=${this.storeDetails.id}`)
        .then(response => {
      
          if (response.data['success'] == true) {
            this.latestProducts = response.data['products']
          }
        })
        .catch(error => {
          console.log(error)
        })
        
      } else {
        await this.$store.commit('setStoreDetails',this.getLatestProducts)
        console.log('Got',this.storeDetails.store_name)
        // document.title = 'Home | ' 
      }

      // console.log(this.storeDetails)
      
      

        this.$store.commit('setIsLoading', false)
    }
  }
}
</script>
