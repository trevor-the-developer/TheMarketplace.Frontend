<template>
  <div class="media-upload">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-cloud-upload"></i> Upload Media
        </h5>
      </div>
      <div class="card-body">
        <!-- File Drop Zone -->
        <div 
          class="upload-area" 
          :class="{ 'dragover': isDragOver, 'uploading': isUploading }"
          @drop="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragenter.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @click="triggerFileInput"
        >
          <div v-if="!isUploading" class="upload-content">
            <i class="bi bi-cloud-upload upload-icon"></i>
            <p class="upload-text">
              <strong>Click to upload</strong> or drag and drop files here
            </p>
            <p class="upload-hint">
              Supports: Images, Videos, PDFs (Max {{ formatFileSize(maxFileSize) }})
            </p>
          </div>
          
          <!-- Upload Progress -->
          <div v-else class="upload-progress">
            <div class="progress mb-3">
              <div 
                class="progress-bar progress-bar-striped progress-bar-animated" 
                :style="{ width: uploadProgress + '%' }"
              >
                {{ uploadProgress }}%
              </div>
            </div>
            <p class="text-muted">Uploading {{ currentFile?.name }}...</p>
          </div>
        </div>
        
        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          multiple
          :accept="acceptedFileTypes"
          @change="handleFileSelect"
          style="display: none;"
        />
        
        <!-- File Preview List -->
        <div v-if="selectedFiles.length > 0" class="selected-files mt-3">
          <h6>Selected Files:</h6>
          <div class="file-list">
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="file-item d-flex align-items-center justify-content-between p-2 border rounded mb-2"
            >
              <div class="file-info d-flex align-items-center">
                <i :class="getFileIcon(file)" class="me-2"></i>
                <div>
                  <strong>{{ file.name }}</strong>
                  <br>
                  <small class="text-muted">{{ formatFileSize(file.size) }} • {{ file.type }}</small>
                </div>
              </div>
              <button 
                class="btn btn-outline-danger btn-sm"
                @click="removeFile(index)"
                :disabled="isUploading"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="alert alert-danger mt-3">
          <h6>Upload Errors:</h6>
          <ul class="mb-0">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
        
        <!-- Action Buttons -->
        <div v-if="selectedFiles.length > 0" class="d-flex justify-content-between mt-3">
          <button 
            class="btn btn-secondary"
            @click="clearFiles"
            :disabled="isUploading"
          >
            Clear All
          </button>
          <button 
            class="btn btn-primary"
            @click="uploadFiles"
            :disabled="isUploading || selectedFiles.length === 0"
          >
            <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'MediaUpload',
  props: {
    productDetailId: {
      type: Number,
      required: true
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    acceptedTypes: {
      type: Array,
      default: () => ['image/*', 'video/*', 'application/pdf']
    }
  },
  emits: ['upload-success', 'upload-error', 'upload-progress'],
  data() {
    return {
      selectedFiles: [],
      isDragOver: false,
      isUploading: false,
      uploadProgress: 0,
      currentFile: null,
      validationErrors: []
    };
  },
  computed: {
    acceptedFileTypes() {
      return this.acceptedTypes.join(',');
    }
  },
  methods: {
    ...mapActions({
      uploadMedia: 'media/uploadMedia'
    }),
    
    triggerFileInput() {
      if (!this.isUploading) {
        this.$refs.fileInput.click();
      }
    },
    
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
      // Clear the input to allow selecting the same file again
      event.target.value = '';
    },
    
    handleDrop(event) {
      event.preventDefault();
      this.isDragOver = false;
      
      if (this.isUploading) return;
      
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },
    
    processFiles(files) {
      this.validationErrors = [];
      const validFiles = [];
      
      files.forEach(file => {
        const errors = this.validateFile(file);
        if (errors.length === 0) {
          validFiles.push(file);
        } else {
          this.validationErrors.push(...errors);
        }
      });
      
      this.selectedFiles.push(...validFiles);
    },
    
    validateFile(file) {
      const errors = [];
      
      // Check file size
      if (file.size > this.maxFileSize) {
        errors.push(`${file.name}: File too large (max ${this.formatFileSize(this.maxFileSize)})`);
      }
      
      // Check file type
      const isValidType = this.acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '');
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        errors.push(`${file.name}: Unsupported file type`);
      }
      
      return errors;
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },
    
    clearFiles() {
      this.selectedFiles = [];
      this.validationErrors = [];
    },
    
    async uploadFiles() {
      if (this.selectedFiles.length === 0) return;
      
      this.isUploading = true;
      this.validationErrors = [];
      
      try {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          const file = this.selectedFiles[i];
          this.currentFile = file;
          
          // Calculate progress for multiple files
          const baseProgress = (i / this.selectedFiles.length) * 100;
          
          await this.uploadSingleFile(file, (progress) => {
            const fileProgress = (progress / this.selectedFiles.length);
            this.uploadProgress = Math.round(baseProgress + fileProgress);
            this.$emit('upload-progress', this.uploadProgress);
          });
        }
        
        this.$emit('upload-success', {
          message: `Successfully uploaded ${this.selectedFiles.length} file(s)`,
          fileCount: this.selectedFiles.length
        });
        
        // Clear files after successful upload
        this.clearFiles();
        
      } catch (error) {
        console.error('Upload error:', error);
        this.validationErrors.push(error.message || 'Upload failed');
        this.$emit('upload-error', error);
      } finally {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.currentFile = null;
      }
    },
    
    async uploadSingleFile(file, onProgress) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', `Uploaded file: ${file.name}`);
      formData.append('mediaType', this.detectMediaType(file));
      formData.append('productDetailId', this.productDetailId.toString());
      
      return new Promise((resolve, reject) => {
        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 201) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
        
        xhr.open('POST', '/api/media/upload');
        
        // Add authorization header if available
        const token = this.$store.getters['auth/token'];
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(formData);
      });
    },
    
    detectMediaType(file) {
      if (file.type.startsWith('image/')) return 'Image';
      if (file.type.startsWith('video/')) return 'Video';
      if (file.type.startsWith('audio/')) return 'Audio';
      if (file.type === 'application/pdf') return 'Document';
      return 'Document';
    },
    
    getFileIcon(file) {
      if (file.type.startsWith('image/')) return 'bi bi-image text-success';
      if (file.type.startsWith('video/')) return 'bi bi-play-circle text-primary';
      if (file.type.startsWith('audio/')) return 'bi bi-music-note text-info';
      if (file.type === 'application/pdf') return 'bi bi-file-pdf text-danger';
      return 'bi bi-file-earmark text-secondary';
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
};
</script>

<style scoped>
.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #e7f3ff;
}

.upload-area.dragover {
  border-color: #007bff;
  background-color: #e7f3ff;
  transform: scale(1.02);
}

.upload-area.uploading {
  cursor: not-allowed;
  opacity: 0.7;
}

.upload-icon {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.upload-hint {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0;
}

.file-item {
  background-color: #f8f9fa;
}

.file-item:hover {
  background-color: #e9ecef;
}

.upload-progress {
  padding: 2rem;
}

.progress {
  height: 20px;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 2rem 1rem;
  }
  
  .upload-icon {
    font-size: 2rem;
  }
}
</style>