<template>
  <div class="media-gallery">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-images"></i> Media Gallery
          <span v-if="media.length > 0" class="badge bg-primary ms-2">{{ media.length }}</span>
        </h5>
        <div class="view-controls">
          <div class="btn-group btn-group-sm" role="group">
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading media...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>
        
        <!-- Empty State -->
        <div v-else-if="media.length === 0" class="empty-state text-center py-4">
          <i class="bi bi-images empty-icon"></i>
          <h6 class="text-muted">No media files yet</h6>
          <p class="text-muted">Upload your first file to get started</p>
        </div>
        
        <!-- Media Grid View -->
        <div v-else-if="viewMode === 'grid'" class="media-grid">
          <div 
            v-for="item in media" 
            :key="item.id"
            class="media-item"
          >
            <div class="media-card">
              <!-- Media Preview -->
              <div class="media-preview" @click="showPreview(item)">
                <img 
                  v-if="isImage(item)"
                  :src="getMediaThumbnail(item)"
                  :alt="item.title"
                  class="media-thumbnail"
                  @error="handleImageError($event, item)"
                />
                <div v-else class="media-placeholder">
                  <i :class="getMediaIcon(item)"></i>
                  <span class="media-type">{{ item.mediaType }}</span>
                </div>
                
                <!-- Media Overlay -->
                <div class="media-overlay">
                  <div class="media-actions">
                    <button 
                      class="btn btn-sm btn-light"
                      @click.stop="showPreview(item)"
                      title="Preview"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-light"
                      @click.stop="downloadMedia(item)"
                      title="Download"
                    >
                      <i class="bi bi-download"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-danger"
                      @click.stop="confirmDelete(item)"
                      title="Delete"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Media Info -->
              <div class="media-info">
                <h6 class="media-title" :title="item.title">{{ item.title }}</h6>
                <div class="media-meta">
                  <small class="text-muted">
                    <i :class="getMediaIcon(item)"></i>
                    {{ item.mediaType }}
                  </small>
                  <small v-if="item.filePath" class="text-muted">
                    • {{ formatDate(item.createdDate) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Media List View -->
        <div v-else class="media-list">
          <div 
            v-for="item in media" 
            :key="item.id"
            class="media-list-item d-flex align-items-center p-3 border rounded mb-2"
          >
            <!-- Thumbnail -->
            <div class="media-thumbnail-small me-3">
              <img 
                v-if="isImage(item)"
                :src="getMediaThumbnail(item)"
                :alt="item.title"
                class="thumbnail-image"
                @error="handleImageError($event, item)"
              />
              <div v-else class="thumbnail-placeholder">
                <i :class="getMediaIcon(item)"></i>
              </div>
            </div>
            
            <!-- Media Details -->
            <div class="media-details flex-grow-1">
              <h6 class="mb-1">{{ item.title }}</h6>
              <div class="media-meta">
                <span class="badge bg-light text-dark me-2">{{ item.mediaType }}</span>
                <small class="text-muted">
                  Created: {{ formatDate(item.createdDate) }}
                </small>
                <small v-if="item.description" class="text-muted d-block">
                  {{ item.description }}
                </small>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="media-actions-list">
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-primary"
                  @click="showPreview(item)"
                  title="Preview"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button 
                  class="btn btn-outline-secondary"
                  @click="downloadMedia(item)"
                  title="Download"
                >
                  <i class="bi bi-download"></i>
                </button>
                <button 
                  class="btn btn-outline-danger"
                  @click="confirmDelete(item)"
                  title="Delete"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="modal fade show d-block" 
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ itemToDelete?.title }}</strong>?</p>
            <p class="text-muted">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDelete">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteMedia" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'MediaGallery',
  props: {
    media: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  emits: ['media-deleted', 'media-preview', 'refresh-media'],
  data() {
    return {
      viewMode: 'grid', // 'grid' or 'list'
      showDeleteModal: false,
      itemToDelete: null,
      deleting: false
    };
  },
  methods: {
    ...mapActions({
      deleteMediaAction: 'media/deleteMedia'
    }),
    
    isImage(item) {
      return item.mediaType === 'Image' || 
             (item.filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.filePath));
    },
    
    getMediaThumbnail(item) {
      // For now, we'll use a placeholder or try to get presigned URL
      // In a real implementation, you might have thumbnail generation
      if (item.filePath) {
        return `/api/media/${item.id}/download`;
      }
      return '/placeholder-image.png';
    },
    
    getMediaIcon(item) {
      switch (item.mediaType) {
        case 'Image':
          return 'bi bi-image text-success';
        case 'Video':
          return 'bi bi-play-circle text-primary';
        case 'Audio':
          return 'bi bi-music-note text-info';
        case 'Document':
          return 'bi bi-file-pdf text-danger';
        default:
          return 'bi bi-file-earmark text-secondary';
      }
    },
    
    showPreview(item) {
      this.$emit('media-preview', item);
    },
    
    async downloadMedia(item) {
      try {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = `/api/media/${item.id}/download`;
        link.download = item.title || 'download';
        
        // Add authorization header by creating a blob URL
        const token = this.$store.getters['auth/token'];
        if (token) {
          const response = await fetch(`/api/media/${item.id}/download`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            throw new Error('Download failed');
          }
        } else {
          // Fallback for non-authenticated download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download file. Please try again.');
      }
    },
    
    confirmDelete(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },
    
    cancelDelete() {
      this.showDeleteModal = false;
      this.itemToDelete = null;
    },
    
    async deleteMedia() {
      if (!this.itemToDelete) return;
      
      this.deleting = true;
      try {
        await this.deleteMediaAction(this.itemToDelete.id);
        this.$emit('media-deleted', this.itemToDelete);
        this.showDeleteModal = false;
        this.itemToDelete = null;
        
        // Refresh the media list
        this.$emit('refresh-media');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete media. Please try again.');
      } finally {
        this.deleting = false;
      }
    },
    
    handleImageError(event, item) {
      // Replace broken image with placeholder
      event.target.style.display = 'none';
      const placeholder = event.target.parentNode.querySelector('.media-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch {
        return 'Invalid date';
      }
    }
  }
};
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.media-item {
  position: relative;
}

.media-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.media-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.media-preview {
  position: relative;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.media-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f8f9fa;
  color: #6c757d;
}

.media-placeholder i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.media-type {
  font-size: 0.9rem;
  font-weight: 500;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-preview:hover .media-overlay {
  opacity: 1;
}

.media-actions {
  display: flex;
  gap: 0.5rem;
}

.media-info {
  padding: 1rem;
}

.media-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* List View Styles */
.media-list-item {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

.media-list-item:hover {
  background-color: #e9ecef;
}

.media-thumbnail-small {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dee2e6;
  color: #6c757d;
}

.thumbnail-placeholder i {
  font-size: 1.5rem;
}

.empty-state {
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }
  
  .media-preview {
    height: 150px;
  }
  
  .view-controls {
    display: none;
  }
  
  .media-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .media-thumbnail-small {
    width: 100%;
    height: 150px;
    margin-bottom: 1rem;
  }
  
  .media-actions-list {
    width: 100%;
    margin-top: 1rem;
  }
  
  .media-actions-list .btn-group {
    width: 100%;
  }
  
  .media-actions-list .btn {
    flex: 1;
  }
}

@media (max-width: 576px) {
  .media-grid {
    grid-template-columns: 1fr;
  }
}
</style>