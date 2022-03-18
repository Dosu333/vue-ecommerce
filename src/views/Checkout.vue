<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>N{{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>N{{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <!-- <tr><td colspan="2">Shipping Fee: 100</td></tr> -->
                        <tr>
                            
                            <!-- <td>100</td> -->
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>N{{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Summary</h2>

                <tr>Items Price: N{{ cartTotalPrice.toFixed(2) }}</tr>
                <tr>Shipping Fee: N{{ shippingFee.toFixed(2) }}</tr>
                <tr>Weight: {{ cartTotalWeight.toFixed(2) }}</tr>
                <tr><strong>Total: </strong>N{{ checkoutTotalPrice.toFixed(2) }}</tr>


                <hr>

                <!-- <router-link to="/cart/checkout" class="button is-dark">Proceed to checkout</router-link> -->
            </div>

            

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <template v-if="cartTotalLength">
                    <hr>

                    <button class="button is-dark" @click="paystackHandler">Make Payment</button>
                </template>
            <!-- </div> -->
        </div>
    </div>
    
</template>


<script>
import axios from 'axios'

export default {
    name: 'Checkout',
    data() {
        return {
            cart: {
                items: []
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
            shippingFee: 0,
            gotShippingFee: false,
            paystack: {},
            card: {},
            errors: [],
        }
    },
    mounted() {
        document.title = `Checkout | ${this.$store.state.storeDetails.store_name}`
        this.cart = this.$store.state.cart
        this.shippingDetails = this.$store.state.shippingDetails
        this.getshippingFee()
        

        if (this.cartTotalLength > 0 && this.gotShippingFee) {
            
            console.log('YEs')
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        async getshippingFee() {
            this.gotShippingFee = false

            const address = {
                'delivery_address': this.shippingDetails.address
            }

            const fee = 0

            await axios
                .post('shipping-fee/', address)
                .then(response => {
                this.shippingFee = response.data.fee
                this.$store.state.shippingFee = response.data.fee
                console.log(response.data)
                })
                .catch(error => {
                console.log(error)
                })
            this.gotShippingFee = true
            localStorage.setItem('shippingFee', JSON.stringify(this.shippingFee))
       
        },
        paystackHandler() {
            const items = []
            // self.orderCreate = this.createOrder()

            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    related_product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }
                items.push(obj)
            }

            const store = this.$store
            const router  = this.$router
            var errors = []
            this.errors = errors

            const data = {
                'first_name': this.shippingDetails.first_name,
                'last_name': this.shippingDetails.last_name,
                'email': this.shippingDetails.email,
                'address': this.shippingDetails.address,
                'zipcode': this.shippingDetails.zipcode,
                'landmark': this.shippingDetails.place,
                'paid_amount': this.cartTotalPrice,
                'shipping_fee': this.shippingFee,
                'paystack_reference': '',
                'phone': this.shippingDetails.phone,
                'items': items,
            }
            
            var handler = PaystackPop.setup({
                key: 'pk_live_b32902e7607a60b0952d8216a4d5ed22369adc49',
                email: this.shippingDetails.email,
                amount: (this.cartTotalPrice + this.shippingFee) * 100,
                callback: function(response) {
                    data.paystack_reference = response.reference
                    
                    console.log(data)
                    axios
                        .post(`verify-transaction/?reference=${data.paystack_reference}/`, data)
                        .then(response => {
                            // console.log(response.data)
                            if (response.status === 200) {
                                console.log('created')
                                store.commit('clearCart')
                                router.push('/cart/success')
                            } else {
                                errors.push('Something went wrong. Please try again.')
                            }
                        })
                        .catch(error => {
                             errors.push('Something went wrong. Please try again.')
                            console.log(error.error)
                        })
                },
                onClose: function() {
                    alert('Failed')
                }

            });
            
            handler.openIframe()
        },
        async createOrder(data) {
            await axios
                .post(`verify-transaction/?reference=${data.paystack_reference}/`, data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('created')
                        this.$store.commit('clearCart')
                        this.$router.push('/cart/success')
                    } else {
                        this.errors.push('Something went wrong. Please try again.')
                    }
                })
                .catch(error => {
                    this.errors.push('Something went wrong, Please try again')
                    console.log(error)
                })
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        },
        checkoutTotalPrice() {
            return this.cartTotalPrice + this.shippingFee
        },
        cartTotalWeight() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.specification.weight
            }, 0)
        }  
    }
}
</script>