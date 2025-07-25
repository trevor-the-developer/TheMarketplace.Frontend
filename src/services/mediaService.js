import api from './api';

const mediaService = {
  async getMedia() {
    const response = await api.get('/media');
    return response.data;
  },
  
  async getMediaItem(id) {
    const response = await api.get(`/media/${id}`);
    return response.data;
  },
  
  async createMedia(mediaData) {
    const response = await api.post('/media', mediaData);
    return response.data;
  },
  
  async updateMedia(id, mediaData) {
    const response = await api.put(`/media/${id}`, mediaData);
    return response.data;
  },
  
  async deleteMedia(id) {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },

  // File upload functionality
  async uploadMediaFile(productDetailId, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', `Uploaded file: ${file.name}`);
    formData.append('mediaType', this.detectMediaType(file));
    formData.append('productDetailId', productDetailId);
    
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      }
    });
    
    return response.data;
  },

  // File download functionality
  async downloadMedia(id) {
    const response = await api.get(`/media/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get presigned URL for sharing
  async getPresignedUrl(id, expirationHours = 1) {
    const response = await api.get(`/media/${id}/url?expirationHours=${expirationHours}`);
    return response.data;
  },

  // Media type detection helper
  detectMediaType(file) {
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type.startsWith('audio/')) return 'Audio';
    if (file.type === 'application/pdf') return 'Document';
    return 'Document';
  },

  // File validation helper
  validateFile(file, maxFileSize = 10 * 1024 * 1024, allowedTypes = ['image/*', 'video/*', 'application/pdf']) {
    const errors = [];
    
    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File too large (max ${this.formatFileSize(maxFileSize)})`);
    }
    
    // Check file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      errors.push('Unsupported file type');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // File size formatter helper
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

export default mediaService;
