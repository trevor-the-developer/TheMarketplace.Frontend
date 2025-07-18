<template>
  <div class="card">
    <div class="card-header">
      <h4>{{ isEdit ? 'Edit Card' : 'Create New Card' }}</h4>
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

        <div class="mb-3">
          <label for="colour" class="form-label">Color</label>
          <input
            type="color"
            class="form-control form-control-color"
            id="colour"
            v-model="form.colour"
            title="Choose card color"
          />
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
            {{ isEdit ? 'Update' : 'Create' }} Card
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardForm',
  props: {
    card: {
      type: Object,
      default: null
    },
    listingId: {
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
        colour: '#007bff',
        isEnabled: true
      }
    }
  },
  computed: {
    isEdit() {
      return this.card !== null;
    }
  },
  watch: {
    card: {
      handler(newCard) {
        if (newCard) {
          this.form = {
            title: newCard.title || '',
            description: newCard.description || '',
            colour: newCard.colour || '#007bff',
            isEnabled: newCard.isEnabled !== undefined ? newCard.isEnabled : true
          };
        } else {
          this.form = {
            title: '',
            description: '',
            colour: '#007bff',
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
        listingId: this.listingId
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
