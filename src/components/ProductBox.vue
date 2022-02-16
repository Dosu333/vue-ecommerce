<template>
    <div class="column is-3">
      <div class="box">
        <figure class='image mb-4'>
          <img :src="product.main_image" class='thumbnail'>
        </figure>

        <h5 class="is-size-4">{{ product.name }}</h5>
        <p class="is-size-6 has-text-grey">N{{ product.price }}</p>

        <router-link v-bind:to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>
      </div>
    </div>
</template>

<script>
export default {
    name: 'ProductBox',
    props: {
        product: Object
    }
}
</script>

<style scoped>
  .image {
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }
  .thumbnail {
    /* max-width: 300px; */
    max-height: 200px;
    /* min-width: 300px; */
    min-height: 200px;
  }
</style>