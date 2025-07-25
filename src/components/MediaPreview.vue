<template>
  <div v-if="show" class="media-preview-modal">
    <!-- Modal Backdrop -->
    <div class="modal-backdrop" @click="closePreview"></div>
    
    <!-- Modal Content -->
    <div class="modal-content-wrapper">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="media-info">
            <h5 class="modal-title">{{ media.title }}</h5>
            <div class="media-meta">
              <span class="badge bg-primary me-2">{{ media.mediaType }}</span>
              <small class="text-muted">{{ formatDate(media.createdDate) }}</small>
            </div>
          </div>
          <div class="modal-actions">
            <button 
              class="btn btn-outline-primary btn-sm me-2"
              @click="downloadMedia"
              title="Download"
            >
              <i class="bi bi-download"></i>
            </button>
            <button 
              class="btn btn-outline-secondary btn-sm me-2"
              @click="getPresignedUrl"
              title="Get shareable link"
            >
              <i class="bi bi-link-45deg"></i>
            </button>
            <button 
              class="btn btn-close"
              @click="closePreview"
              aria-label="Close"
            ></button>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading preview...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i>
            {{ error }}
          </div>
          
          <!-- Image Preview -->
          <div v-else-if="isImage" class="image-preview">
            <img 
              :src="previewUrl" 
              :alt="media.title"
              class="preview-image"
              @error="handlePreviewError"
              @load="handlePreviewLoad"
            />
          </div>
          
          <!-- Video Preview -->
          <div v-else-if="isVideo" class="video-preview">
            <video 
              :src="previewUrl"
              controls
              class="preview-video"
              @error="handlePreviewError"
              @loadeddata="handlePreviewLoad"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          <!-- Audio Preview -->
          <div v-else-if="isAudio" class="audio-preview">
            <div class="audio-player">
              <i class="bi bi-music-note audio-icon"></i>
              <h6>{{ media.title }}</h6>
              <audio 
                :src="previewUrl"
                controls
                class="audio-controls"
                @error="handlePreviewError"
                @loadeddata="handlePreviewLoad"
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
          
          <!-- Document Preview -->
          <div v-else-if="isDocument" class="document-preview">
            <div class="document-info">
              <i class="bi bi-file-pdf document-icon"></i>
              <h6>{{ media.title }}</h6>
              <p class="text-muted">{{ media.description || 'Document file' }}</p>
              <div class="document-actions">
                <button class="btn btn-primary" @click="downloadMedia">
                  <i class="bi bi-download"></i> Download to View
                </button>
                <button v-if="isPDF" class="btn btn-outline-secondary" @click="openInNewTab">
                  <i class="bi bi-box-arrow-up-right"></i> Open in New Tab
                </button>
              </div>
            </div>
          </div>
          
          <!-- Generic File Preview -->
          <div v-else class="generic-preview">
            <div class="generic-info">
              <i class="bi bi-file-earmark generic-icon"></i>
              <h6>{{ media.title }}</h6>
              <p class="text-muted">{{ media.description || 'File' }}</p>
              <p><span class="badge bg-secondary">{{ media.mediaType }}</span></p>
              <div class="generic-actions">
                <button class="btn btn-primary" @click="downloadMedia">
                  <i class="bi bi-download"></i> Download File
                </button>
              </div>
            </div>
          </div>
          
          <!-- Media Description -->
          <div v-if="media.description" class="media-description mt-3">
            <h6>Description</h6>
            <p class="text-muted">{{ media.description }}</p>
          </div>
        </div>
        
        <!-- Presigned URL Modal -->
        <div v-if="showUrlModal" class="url-modal">
          <div class="url-modal-content">
            <h6>Shareable Link</h6>
            <p class="text-muted">This link will expire in {{ urlExpiration }} hour(s)</p>
            <div class="input-group">
              <input 
                ref="urlInput"
                type="text" 
                class="form-control" 
                :value="presignedUrl" 
                readonly
              />
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="copyUrl"
              >
                <i class="bi bi-clipboard"></i>
              </button>
            </div>
            <div class="mt-2">
              <button class="btn btn-sm btn-secondary" @click="showUrlModal = false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaPreview',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    media: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close'],
  data() {
    return {
      loading: false,
      error: null,
      previewUrl: null,
      showUrlModal: false,
      presignedUrl: '',
      urlExpiration: 1
    };
  },
  computed: {
    isImage() {
      return this.media.mediaType === 'Image';
    },
    isVideo() {
      return this.media.mediaType === 'Video';
    },
    isAudio() {
      return this.media.mediaType === 'Audio';
    },
    isDocument() {
      return this.media.mediaType === 'Document';
    },
    isPDF() {
      return this.media.filePath && this.media.filePath.toLowerCase().endsWith('.pdf');
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.media.id) {
          this.loadPreview();
        } else {
          this.cleanup();
        }
      }
    },
    media: {
      immediate: true,
      handler(newVal) {
        if (this.show && newVal.id) {
          this.loadPreview();
        }
      }
    }
  },
  mounted() {
    // Handle escape key
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.cleanup();
  },
  methods: {
    async loadPreview() {
      if (!this.media.id) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // For media that can be previewed directly, use the download endpoint
        if (this.isImage || this.isVideo || this.isAudio) {
          this.previewUrl = `/api/media/${this.media.id}/download`;
        }
        this.loading = false;
      } catch (error) {
        console.error('Preview load error:', error);
        this.error = 'Failed to load preview';
        this.loading = false;
      }
    },
    
    handlePreviewLoad() {
      this.loading = false;
    },
    
    handlePreviewError() {
      this.error = 'Failed to load media preview';
      this.loading = false;
    },
    
    async downloadMedia() {
      try {
        const token = this.$store.getters['auth/token'];
        const response = await fetch(`/api/media/${this.media.id}/download`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.media.title || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Download failed');
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download file. Please try again.');
      }
    },
    
    async getPresignedUrl() {
      try {
        const token = this.$store.getters['auth/token'];
        const response = await fetch(`/api/media/${this.media.id}/url?expirationHours=1`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          this.presignedUrl = data.url;
          this.urlExpiration = Math.round(data.expiresIn / 3600); // Convert seconds to hours
          this.showUrlModal = true;
        } else {
          throw new Error('Failed to generate URL');
        }
      } catch (error) {
        console.error('Presigned URL error:', error);
        alert('Failed to generate shareable link. Please try again.');
      }
    },
    
    copyUrl() {
      if (this.$refs.urlInput) {
        this.$refs.urlInput.select();
        document.execCommand('copy');
        
        // Show temporary feedback
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i>';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 1000);
      }
    },
    
    openInNewTab() {
      if (this.previewUrl) {
        window.open(this.previewUrl, '_blank');
      }
    },
    
    closePreview() {
      this.$emit('close');
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape' && this.show) {
        this.closePreview();
      }
    },
    
    cleanup() {
      if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(this.previewUrl);
      }
      this.previewUrl = null;
      this.error = null;
      this.loading = false;
      this.showUrlModal = false;
      this.presignedUrl = '';
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } catch {
        return 'Invalid date';
      }
    }
  }
};
</script>

<style scoped>
.media-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content-wrapper {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  margin: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.media-info {
  flex: 1;
}

.modal-title {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.media-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
}

/* Preview Styles */
.image-preview {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-preview {
  text-align: center;
}

.preview-video {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 4px;
}

.audio-preview {
  text-align: center;
  padding: 2rem;
}

.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.audio-icon {
  font-size: 4rem;
  color: #007bff;
}

.audio-controls {
  width: 100%;
  max-width: 400px;
}

.document-preview,
.generic-preview {
  text-align: center;
  padding: 3rem 2rem;
}

.document-info,
.generic-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.document-icon,
.generic-icon {
  font-size: 4rem;
  color: #dc3545;
}

.generic-icon {
  color: #6c757d;
}

.document-actions,
.generic-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.media-description {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

/* URL Modal */
.url-modal {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.url-modal-content h6 {
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content-wrapper {
    max-width: 95vw;
    max-height: 95vh;
    margin: 0.5rem;
  }
  
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .modal-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .preview-image,
  .preview-video {
    max-height: 50vh;
  }
  
  .document-actions,
  .generic-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .document-actions .btn,
  .generic-actions .btn {
    width: 100%;
  }
  
  .url-modal {
    position: static;
    margin-top: 1rem;
  }
}

/* Animation */
.media-preview-modal {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>