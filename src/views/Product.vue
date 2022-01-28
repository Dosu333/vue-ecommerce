<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class='column is-9'>
                <figure class="image mb-6">
                    <img v-bind:src="product.main_image">
                </figure>

                <h1 class="title">{{ product.name }}</h1>
                <p>{{ product.description }}</p>
            </div>

            <div class="column is-3">
                <h2 class="subtitle">Information</h2>
                <p v-if="mounted"><strong v-if="info.sku">SKU: </strong>{{ product.product_info.sku }}</p>
                <p v-if="mounted"><strong v-if="info.color">Color: </strong>{{ product.product_info.color }}</p>
                <p v-if="mounted"><strong v-if="info.material">Material: </strong>{{ product.product_info.material }}</p>

                <p><strong>Price: </strong>N{{ product.price }}</p>

                <div class="field has-addons mt-6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>

                    <div class="control">
                        <a class="button is-dark" @click="addToCart">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Product',
    data() {
        return {
            product: {},
            quantity: 1,
            mounted: false,
        }
    },
    mounted() {
        this.getProduct()
        this.mounted = true
    },
    methods: {
        async getProduct() {
            this.$store.commit('setIsLoading', true)

            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug
            const product_id = this.$route.params.id

            await axios
                .get(`products/${product_id}/`)
                .then(response => {
                    if (response.status == 200) {
                        this.product = response.data
                        this.info = this.product['product_info']
                        // console.log(info.sku)
                    }

                    document.title = `${this.product.name} | ${this.$store.state.storeDetails.store_name}`
                })
                .catch(error => {
                    console.log(error)
                })

            this.$store.commit('setIsLoading', false)
        },
        addToCart() {
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }

            const item = {
                product: this.product,
                quantity: this.quantity
            }

            this.$store.commit('addToCart', item)

            toast({
                message: 'The product was added to the cart',
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            })
        }
    }
}
</script>