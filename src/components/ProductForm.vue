<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Product' : 'Create New Product' }}</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="title" class="form-label">Title *</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="form.title"
                required
                maxlength="200"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="productType" class="form-label">Product Type *</label>
              <select
                class="form-select"
                id="productType"
                v-model="form.productType"
                required
              >
                <option value="">Select Product Type</option>
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="category" class="form-label">Category *</label>
              <input
                type="text"
                class="form-control"
                id="category"
                v-model="form.category"
                required
                maxlength="100"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="brand" class="form-label">Brand</label>
              <input
                type="text"
                class="form-control"
                id="brand"
                v-model="form.brand"
                maxlength="100"
              />
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description *</label>
          <textarea
            class="form-control"
            id="description"
            rows="4"
            v-model="form.description"
            required
            maxlength="1000"
          ></textarea>
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="isEnabled"
              v-model="form.isEnabled"
            />
            <label class="form-check-label" for="isEnabled">
              Enabled
            </label>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEdit ? 'Update' : 'Create' }} Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: null
    },
    cardId: {
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
        title: '',
        description: '',
        productType: '',
        category: '',
        brand: '',
        isEnabled: true
      }
    }
  },
  computed: {
    isEdit() {
      return this.product !== null;
    }
  },
  watch: {
    product: {
      handler(newProduct) {
        if (newProduct) {
          this.form = {
            title: newProduct.title || '',
            description: newProduct.description || '',
            productType: newProduct.productType || '',
            category: newProduct.category || '',
            brand: newProduct.brand || '',
            isEnabled: newProduct.isEnabled !== undefined ? newProduct.isEnabled : true
          };
        } else {
          this.form = {
            title: '',
            description: '',
            productType: '',
            category: '',
            brand: '',
            isEnabled: true
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
        cardId: this.cardId
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
