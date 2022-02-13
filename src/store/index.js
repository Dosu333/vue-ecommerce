import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    cart: {
      items: [{
        product: 
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            category_name: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            product_info: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                sku: "string",
                color: "string",
                weight: "string",
                material: "string",
                quantity: 0
            },
            name: "string",
            description: "string",
            price: 0,
            main_image: "string",
            get_absolute_url: "string"
        },
        quantity: 0
    },],
    },
    isAuthenticated: false,
    token: '',
    isLoading: false,
    storeDetails: {
      gotDetails: false,
      id: '',
      store_domain: '',
      store_name: '',
      store_description: '',
      primary_store_color: '',
      secondary_store_color: '',
    },
    shippingDetails: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      zipcode: '',
      place: '',
    },
    shippingFee: 0
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
        state.shippingDetails = JSON.parse(localStorage.getItem('shippingDetails'))
        state.shippingFee = JSON.parse(localStorage.getItem('shippingFee'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
        localStorage.setItem('cart', JSON.stringify(state.shippingDetails))
        localStorage.setItem('cart', JSON.stringify(state.shippingFee))
      }
    },
    async setStoreDetails(state, _callback) {
      const url = window.location.hostname
      const storeName = url.split(".")
      const router = this.$router
      console.log(storeName[0])

      state.storeDetails.gotDetails = false

      await axios
              .get(`get-store/?store=${storeName[0]}`)
              .then(response => {
                if (response.data.store_details) {
                  state.storeDetails.id = response.data.store_details.id
                  state.storeDetails.store_domain = response.data.store_details.store_domain
                  state.storeDetails.store_name = response.data.store_details.store_name
                  state.storeDetails.store_description = response.data.store_details.store_description
                  state.storeDetails.primary_store_color = response.data.store_details.primary_store_color
                  state.storeDetails.secondary_store_color = response.data.store_details.secondary_store_color
                  state.storeDetails.gotDetails = true
                }
                
              })
              .catch(error => {
                console.log(error)
              })
      if (state.storeDetails.gotDetails) {
        state.storeDetails.gotDetails = true
        _callback()
      } else {
        console.log('nothing')
        router.push('/not-found/')
      }
    },
    addToCart(state, item) {
      const exists = state.cart.items.filter(i => i.product.id === item.product.id)

      if (exists.length) {
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
      } else {
        state.cart.items.push(item)
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setShippingDetails(state, data) {
      state.shippingDetails.first_name = data.first_name
      state.shippingDetails.last_name = data.last_name
      state.shippingDetails.email = data.email
      state.shippingDetails.phone = data.phone
      state.shippingDetails.address = data.address
      state.shippingDetails.zipcode = data.zipcode
      state.shippingDetails.place = data.place

      localStorage.setItem('shippingDetails', JSON.stringify(state.shippingDetails))

    },
    setToken(state, token) {
        state.token = token
        state.isAuthenticated = true
    },  
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    clearCart(state) {
      state.cart = { items: [] }
      state.shippingFee = 0
      state.shippingDetails = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        zipcode: '',
        place: '',
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
      localStorage.setItem('shippingDetails', JSON.stringify(state.shippingDetails))
      localStorage.setItem('shippingFee', JSON.stringify(state.shippingFee))
    },
  },
  actions: {
  },
  modules: {
  }
})
