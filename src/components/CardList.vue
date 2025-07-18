<template>
  <div class="row">
    <div v-for="card in cards" :key="card.id" class="col-md-4 mb-4">
      <div class="card h-100" :style="{ borderColor: card.colour || '#007bff' }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">{{ card.title }}</h5>
          <p class="card-text">{{ card.description }}</p>
          
          <div v-if="card.products && card.products.length > 0">
            <h6 class="mt-3">Products</h6>
            <ul class="list-group">
              <li v-for="product in card.products" :key="product.id" class="list-group-item">
                {{ product.title }}
              </li>
            </ul>
          </div>
          
          <div class="mt-auto pt-3">
            <div class="d-flex justify-content-between align-items-center">
              <router-link :to="'/card/' + card.id" class="btn btn-primary">
                View Details
              </router-link>
              <div class="btn-group">
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  @click="$emit('edit', card)"
                  title="Edit card"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-outline-danger btn-sm"
                  @click="$emit('delete', card)"
                  title="Delete card"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    cards: {
      type: Array,
      required: true
    }
  }
}
</script>