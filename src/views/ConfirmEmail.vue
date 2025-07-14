<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Complete Registration</h4>
        </div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Verifying your email...</p>
          </div>
          
          <div v-if="emailConfirmed && !registrationCompleted">
            <div class="alert alert-success">
              Email verified successfully! Please complete your registration.
            </div>
            
            <form @submit.prevent="completeRegistration">
              <div class="mb-3">
                <label for="confirmationCode" class="form-label">Confirmation Code</label>
                <input
                  type="text"
                  id="confirmationCode"
                  v-model="confirmationCode"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="completing">
                  <span v-if="completing" class="spinner-border spinner-border-sm me-1"></span>
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
          
          <div v-if="registrationCompleted" class="text-center py-3">
            <div class="alert alert-success">
              <i class="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
              <h5>Registration Completed Successfully!</h5>
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
      code: '',
      confirmationCode: '',
      emailConfirmed: false,
      registrationCompleted: false,
      completing: false
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
    this.code = queryParams.get('token'); // API uses 'token' not 'code'
    const email = queryParams.get('email');
    
    if (this.userId && this.code && email) {
      this.confirmEmail(email);
    }
  },
  
  methods: {
    ...mapActions({
      confirmEmailAction: 'auth/confirmEmail',
      completeRegistrationAction: 'auth/completeRegistration'
    }),
    
    async confirmEmail() {
      try {
        const response = await this.confirmEmailAction({
          userId: this.userId,
          code: this.code
        });
        
        this.emailConfirmed = true;
        if (response.confirmationCode) {
          this.confirmationCode = response.confirmationCode;
        }
      } catch (error) {
        // Error is handled in the store
      }
    },
    
    async completeRegistration() {
      this.completing = true;
      
      try {
        await this.completeRegistrationAction({
          userId: this.userId,
          confirmationCode: this.confirmationCode
        });
        
        this.registrationCompleted = true;
      } catch (error) {
        // Error is handled in the store
      } finally {
        this.completing = false;
      }
    }
  }
}
</script>