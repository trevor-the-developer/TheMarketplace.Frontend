<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Email Confirmation</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Verifying your email and completing registration...</p>
          </div>
          
          <div v-if="registrationCompleted" class="text-center py-3">
            <div class="alert alert-success">
              <i class="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
              <h5>Registration Completed Successfully!</h5>
              <p>Your email has been verified and your registration is complete.</p>
              <p>You can now proceed to login.</p>
            </div>
            
            <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ConfirmEmail',
  
  data() {
    return {
      userId: '',
      token: '',
      email: '',
      registrationCompleted: false
    };
  },
  
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    })
  },
  
  created() {
    // Get query parameters from URL
    const queryParams = new URLSearchParams(window.location.search);
    this.userId = queryParams.get('userId');
    this.token = queryParams.get('token');
    this.email = queryParams.get('email');
    
    if (this.userId && this.token && this.email) {
      this.confirmEmail();
    }
  },
  
  methods: {
    ...mapActions({
      confirmEmailAction: 'auth/confirmEmail'
    }),
    
    async confirmEmail() {
      try {
        const response = await this.confirmEmailAction({
          email: this.email,
          userId: this.userId,
          token: this.token
        });
        
        // Check if registration was completed in one step
        if (response.registrationCompleted) {
          this.registrationCompleted = true;
        }
      } catch (error) {
        // Error is handled in the store
      }
    }
  }
}
</script>