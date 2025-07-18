<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Product Detail' : 'Create New Product Detail' }}</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="price" class="form-label">Price *</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="number"
                  class="form-control"
                  id="price"
                  v-model.number="form.price"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="discountPercentage" class="form-label">Discount Percentage</label>
              <div class="input-group">
                <input
                  type="number"
                  class="form-control"
                  id="discountPercentage"
                  v-model.number="form.discountPercentage"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="stock" class="form-label">Stock *</label>
              <input
                type="number"
                class="form-control"
                id="stock"
                v-model.number="form.stock"
                min="0"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="sku" class="form-label">SKU</label>
              <input
                type="text"
                class="form-control"
                id="sku"
                v-model="form.sku"
                maxlength="50"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="weight" class="form-label">Weight (kg)</label>
              <input
                type="number"
                class="form-control"
                id="weight"
                v-model.number="form.weight"
                step="0.001"
                min="0"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="dimensions" class="form-label">Dimensions</label>
              <input
                type="text"
                class="form-control"
                id="dimensions"
                v-model="form.dimensions"
                placeholder="e.g., 10x20x5 cm"
                maxlength="100"
              />
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="specifications" class="form-label">Specifications</label>
          <textarea
            class="form-control"
            id="specifications"
            rows="4"
            v-model="form.specifications"
            maxlength="2000"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="warrantyInfo" class="form-label">Warranty Information</label>
          <textarea
            class="form-control"
            id="warrantyInfo"
            rows="3"
            v-model="form.warrantyInfo"
            maxlength="500"
          ></textarea>
        </div>

        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEdit ? 'Update' : 'Create' }} Product Detail
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailForm',
  props: {
    productDetail: {
      type: Object,
      default: null
    },
    productId: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        price: 0,
        discountPercentage: 0,
        stock: 0,
        sku: '',
        weight: 0,
        dimensions: '',
        specifications: '',
        warrantyInfo: ''
      }
    }
  },
  computed: {
    isEdit() {
      return this.productDetail !== null;
    }
  },
  watch: {
    productDetail: {
      handler(newProductDetail) {
        if (newProductDetail) {
          this.form = {
            price: newProductDetail.price || 0,
            discountPercentage: newProductDetail.discountPercentage || 0,
            stock: newProductDetail.stock || 0,
            sku: newProductDetail.sku || '',
            weight: newProductDetail.weight || 0,
            dimensions: newProductDetail.dimensions || '',
            specifications: newProductDetail.specifications || '',
            warrantyInfo: newProductDetail.warrantyInfo || ''
          };
        } else {
          this.form = {
            price: 0,
            discountPercentage: 0,
            stock: 0,
            sku: '',
            weight: 0,
            dimensions: '',
            specifications: '',
            warrantyInfo: ''
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      const formData = {
        ...this.form,
        productId: this.productId
      };
      
      if (this.isEdit) {
        this.$emit('update', formData);
      } else {
        this.$emit('create', formData);
      }
    }
  }
}
</script>
