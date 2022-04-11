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
                            <td>&#8358;{{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>&#8358;{{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <!-- <tr><td colspan="2">Shipping Fee: 100</td></tr> -->
                        <tr>
                            
                            <!-- <td>100</td> -->
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>&#8358;{{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>                                                                                                                                                    
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Summary</h2>

                <tr>Items Price: &#8358;{{ cartTotalPrice.toFixed(2) }}</tr>
                <tr>Shipping Fee: &#8358;{{ shippingFee.toFixed(2) }}</tr>
                <!-- <tr>Weight: {{ cartTotalWeight.toFixed(2) }}</tr> -->
                <tr><strong>Total: </strong>&#8358;{{ checkoutTotalPrice.toFixed(2) }}</tr>


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
                state: '',
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
        this.getStore()
        document.title = `Checkout | ${this.$store.state.storeDetails.store_name}`
        this.cart = this.$store.state.cart
        this.shippingDetails = this.$store.state.shippingDetails
        this.shippingFee = this.$store.state.shippingFee
        
        

        if (this.cartTotalLength > 0 && this.gotShippingFee) {
            
            console.log('YEs')
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        async getStore() {
            await this.$store.commit('setStoreDetails',this.getshippingFee)
        },
        async getshippingFee() {
            this.gotShippingFee = false
            let products = []

            for (let i = 0; i < this.cart.items.length; i++) {
                products.push(this.cart.items[i].product)
            }

            const address = {
                'store_id': this.$store.state.storeDetails.id,
                'delivery_address': this.shippingDetails.address,
                'items': products,
                'state': this.shippingDetails.state
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
        // flutterwaveHandler() {
        //     router = this.$router

        //     FlutterwaveCheckout({
        //         public_key: "FLWPUBK_TEST-4c36102707c08a700bb976bcea454237-X",
        //         tx_ref: "",
        //         amount: this.cartTotalPrice + this.shippingFee,
        //         currency: "NGN",
        //         payment_options: "card, mobilemoneyghana, ussd",
        //         redirect_url: `${window.location.origin}/cart/success`,
        //         customer: {
        //             email: this.shippingDetails.email,
        //             phone_number: this.shippingDetails.phone,
        //             name: this.shippingDetails.first_name + this.shippingDetails.last_name,
        //         },
        //         customizations: {
        //             title: this.$store.state.storeDetails.store_name,
        //             description: "Payment from your Boxin store",
        //             logo: this.$store.state.storeDetails.logo || document.getElementById('favicon').getAttribute('href'),
        //         },
        //     });
        // },
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
                'vendor': this.$store.state.storeDetails.id,
                'last_name': this.shippingDetails.last_name,
                'email': this.shippingDetails.email,
                'address': this.shippingDetails.address,
                'state': this.shippingDetails.state,
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