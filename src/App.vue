<template v-if=" $store.storeDetails.gotDetails ">
  <div id="wrapper">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <router-link to="/" class='navbar-item'><strong>{{ this.$store.state.storeDetails.store_name }}</strong></router-link>
        <a class='navbar-burger' aria-labels='menu' aria-expanded='false' data-target='navbar-menu' @click="showMobileMenu = !showMobileMenu">
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div class='navbar-menu' id='navbar-menu' v-bind:class="{'is-active': showMobileMenu}">
        <div class="navbar-start">
          <div class="navbar-item">
            <form method="get" action="/search">
              <div class="field has-addons">
                <div class="control">
                  <input type="text" class="input" placeholder="What are you looking for?" name="query">
                </div>

                <div class="control">
                  <button class="button is-success">
                      <span class="icon">
                      <i class="fas fa-search"></i>
                      </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div class='navbar-end'>
          <router-link to='/products' class='navbar-item'>All Products</router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Categories
          </a>

          <div class="navbar-dropdown">
            <span v-for="category in categories" v-bind:key="category.id">
              <router-link class="navbar-item" v-bind:to="category.get_absolute_url" v-if="category.products.length">
                {{ category.name }}
              </router-link>
            </span>
            
          </div>
        </div>
          <!-- <router-link to='/winter' class='navbar-item'>Winter</router-link> -->

          <div class='navbar-item'>
            <div class='buttons'>
              <!-- <template v-if="$store.state.isAuthenticated">
                <router-link to='/my-account' class='button is-light'>My Account</router-link>
              </template>

              <template v-else>
                <router-link to='/log-in' class='button is-light'>Log in</router-link>
              </template> -->
            
            <router-link to='/cart' class='button is-success'>
              <span class='icon'><i class='fa fa-shopping-cart'></i></span>
              <span>Cart ({{ cartTotalLength }})</span>
            </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="is-loading-bar has-text-centered" v-bind:class="{ 'is-loading': $store.state.isLoading }">
      <div class="lds-dual-ring"></div>
    </div>

    <section class='section'>
      <router-view/>
    </section>
  
  <footer class='footer'>
    <p class="has-text-centered">Copyright (c) 2022</p>

  </footer>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showMobileMenu: false,
      mounted: false,
      cart: {
        items: []
      },
      categories: []
    }
  },
  beforeCreate() {
    this.$store.commit('initializeStore')
    

    const token = this.$store.state.token

    if (token) {
        axios.defaults.headers.common['Authorization'] = "Token " + token
    } else {
        axios.defaults.headers.common['Authorization'] = ""
    }

  },
  mounted() {
    this.cart = this.$store.state.cart
    this.getCategories()
    this.getClientIp()
    // this.mounted = true
  },
  methods: {
    async getCategories() {
      if (this.$store.state.storeDetails.gotDetails) {
        await axios
        .get(`category/?search=${this.$store.state.storeDetails.id}`)
        .then(response => {
          this.categories = response.data.results
          // console.log(this.categories)
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        await this.$store.commit('setStoreDetails', this.getCategories)
      }
    },
    async getClientIp() {
      let clientIp = null

      await fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(response => {
        console.log("ipAddress", response.ip);
        clientIp = response.ip
      });

      if (this.$store.state.storeDetails.gotDetails) {
        const data = {
          "ip_address": clientIp,
          "store_visited": this.$store.state.storeDetails.id
        }
        await axios
        .post('visitor/', data)
        .then(response => {
          if (response.status == 201) {
            console.log("Welcome")
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
  },
  computed: {
    cartTotalLength() {
      let totalLength = 0
      console.log(this.cart)
 
      return this.cart.items?.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0) || 0 
    }
  }
}
</script>

 <style lang="scss">
  @import '../node_modules/bulma';

  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #882f2f;
    border-color:#882f2f transparent #882f2f transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .is-loading-bar {
    height: 0;
    overflow: hidden;

    -webkit-transition: all 0.3s;
    transition: all 0.3s;

    &.is-loading {
      height: 80px;
    }
  // .navbar-item {
  //   color: white;
  // }
  }
</style> 
