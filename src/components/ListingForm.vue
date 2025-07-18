<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Listing' : 'Create New Listing' }}</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
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

        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEdit ? 'Update' : 'Create' }} Listing
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListingForm',
  props: {
    listing: {
      type: Object,
      default: null
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
        description: ''
      }
    }
  },
  computed: {
    isEdit() {
      return this.listing !== null;
    }
  },
  watch: {
    listing: {
      handler(newListing) {
        if (newListing) {
          this.form = {
            title: newListing.title || '',
            description: newListing.description || ''
          };
        } else {
          this.form = {
            title: '',
            description: ''
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        this.$emit('update', { ...this.form });
      } else {
        this.$emit('create', { ...this.form });
      }
    }
  }
}
</script>
