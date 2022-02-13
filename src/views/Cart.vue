<template>
    <div class="page-cart">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Cart</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth" v-if="cartTotalLength">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <CartItem
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                            v-bind:initialItem="item"
                            v-on:removeFromCart="removeFromCart" />
                    </tbody>
                </table>

                <p v-else>You don't have any products in your cart...</p>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Summary</h2>

                <strong>N{{ cartTotalPrice.toFixed(2) }}</strong>, {{ cartTotalLength }} items

                <hr>

                <!-- <router-link to="/cart/checkout" class="button is-dark">Proceed to checkout</router-link> -->
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Landmark(A popular place near by)*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <!-- <hr>

                <div id="card-element" class="mb-5"></div> -->

                <template v-if="cartTotalLength" >
                    <hr>

                    <button class="button is-dark" @click="submitForm">Proceed to checkout</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import CartItem from '@/components/CartItem.vue'

export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            mounted: false,
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            zipcode: '',
            place: '',
            errors: []
        }
    },
    mounted() {
        document.title = `Cart | ${this.$store.state.storeDetails.store_name}`
        this.cart = this.$store.state.cart
        this.mounted = true
    },
    methods: {
        removeFromCart(item) {
            this.cart.items = this.cart.items.filter(i => i.product.id !== item.product.id)
        },
        async submitForm() {
            this.errors = []
            if (this.first_name === '') {
                this.errors.push('The first name field is missing!')        }
            if (this.last_name === '') {
                this.errors.push('The last name field is missing!')
            }
            if (this.email === '') {
                this.errors.push('The email field is missing!')
            }
            if (this.phone === '') {
                this.errors.push('The phone field is missing!')
            }
            if (this.address === '') {
                this.errors.push('The address field is missing!')
            }
            if (this.zipcode === '') {
                this.errors.push('The zip code field is missing!')
            }
            if (this.place === '') {
                this.errors.push('The place field is missing!')
            }

            if (!this.errors.length) {
                // this.$store.commit('setIsLoading', true)
                 const data = {
                    'first_name': this.first_name,
                    'last_name': this.last_name,
                    'email': this.email,
                    'address': this.address,
                    'zipcode': this.zipcode,
                    'place': this.place,
                    'phone': this.phone,
                }
                await this.$store.commit('setShippingDetails', data)
                this.$router.push('/cart/checkout')
                
                
                
                // this.stripe.createToken(this.card).then(result => {                    
                //     if (result.error) {
                //         this.$store.commit('setIsLoading', false)
                //         this.errors.push('Something went wrong with Stripe. Please try again')
                //         console.log(result.error.message)
                //     } else {
                //         this.stripeTokenHandler(result.token)
                //     }
                // })
            }
        },
        // async stripeTokenHandler(token) {
        //     const items = []
        //     for (let i = 0; i < this.cart.items.length; i++) {
        //         const item = this.cart.items[i]
        //         const obj = {
        //             product: item.product.id,
        //             quantity: item.quantity,
        //             price: item.product.price * item.quantity
        //         }
        //         items.push(obj)
        //     }
        //     const data = {
        //         'first_name': this.first_name,
        //         'last_name': this.last_name,
        //         'email': this.email,
        //         'address': this.address,
        //         'zipcode': this.zipcode,
        //         'place': this.place,
        //         'phone': this.phone,
        //         'items': items,
        //         'stripe_token': token.id
        //     }
        //     await axios
        //         .post('/api/v1/checkout/', data)
        //         .then(response => {
        //             this.$store.commit('clearCart')
        //             this.$router.push('/cart/success')
        //         })
        //         .catch(error => {
        //             this.errors.push('Something went wrong. Please try again')
        //             console.log(error)
        //         })
        //         this.$store.commit('setIsLoading', false)
        // }
        // }
    },
    computed: {
        cartTotalLength() {
            // console.log(this.cart.items)
            // console.log(this.mounted)
            // return 0
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        },
        cartTotalPrice() { 
            // return 0
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        },
    }
}
</script>