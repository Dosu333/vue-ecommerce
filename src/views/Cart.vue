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

                <strong>&#8358;{{ cartTotalPrice.toFixed(2) }}</strong>, {{ cartTotalLength }} items

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
                            <label>State*</label>
                            <div class="control">
                                <!--- Nigeria states -->
<select class="input" name="state" v-model="state">
    <option value="Abia">Abia State</option>
    <option value="Adamawa">Adamawa State</option>
    <option value="Akwa Ibom">Akwa Ibom State</option>
    <option value="Anambra">Anambra State</option>
    <option value="Bauchi">Bauchi State</option>
    <option value="Bayelsa">Bayelsa State</option>
    <option value="Benue">Benue State</option>
    <option value="Borno">Borno State</option>
    <option value="Cross River">Cross River State</option>
    <option value="Delta">Delta State</option>
    <option value="Ebonyi">Ebonyi State</option>
    <option value="Edo">Edo State</option>
    <option value="Ekiti">Ekiti State</option>
    <option value="Enugu">Enugu State</option>
    <option value="Federal Capital Territory">Federal Capital Territory</option>
    <option value="Gombe">Gombe State</option>
    <option value="Imo">Imo State</option>
    <option value="Jigawa">Jigawa State</option>
    <option value="Kaduna">Kaduna State</option>
    <option value="Kano">Kano State</option>
    <option value="Katsina">Katsina State</option>
    <option value="Kebbi">Kebbi State</option>
    <option value="Kogi">Kogi State</option>
    <option value="Kwara">Kwara State</option>
    <option value="Lagos">Lagos</option>
    <option value="Nasarawa">Nasarawa State</option>
    <option value="Niger">Niger State</option>
    <option value="Ogun">Ogun State</option>
    <option value="Ondo">Ondo State</option>
    <option value="Osun">Osun State</option>
    <option value="Oyo">Oyo State</option>
    <option value="Plateau">Plateau State</option>
    <option value="Sokoto">Sokoto State</option>
    <option value="Taraba">Taraba State</option>
    <option value="Yobe">Yobe State</option>
    <option value="Zamfara">Zamfara State</option>
</select>
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
            gotShippingFee: false,
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
            state: '',
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
            if (this.state === '') {
                this.errors.push('The state field is missing!')
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
                    'state': this.state,
                    'place': this.place,
                    'phone': this.phone,
                }
                await this.$store.commit('setShippingDetails', data)
                await this.getshippingFee()
                
                this.$router.push('/cart/checkout')
            }
        },
        async getshippingFee() {
            this.gotShippingFee = false
            let products = []

            for (let i = 0; i < this.cart.items.length; i++) {
                products.push(this.cart.items[i].product)
            }

            const address = {
                'store_id': this.$store.state.storeDetails.id,
                'delivery_address': this.address,
                'items': products,
                'state': this.state
            }

            const fee = 0

            await axios
                .post('shipping-fee/', address)
                .then(response => {
                // this.shippingFee = response.data.fee
                this.$store.state.shippingFee = response.data.fee
                console.log(response.data)
                })
                .catch(error => {
                console.log(error)
                })
            this.gotShippingFee = true
            localStorage.setItem('shippingFee', JSON.stringify(this.shippingFee))
        },
       
    },
    computed: {
        cartTotalLength() {
            console.log(this.cart.items)
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