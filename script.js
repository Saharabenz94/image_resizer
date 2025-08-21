class ImageProcessor {
    constructor() {
        this.originalImage = null;
        this.currentImage = null;
        this.originalCanvas = null;
        this.workingCanvas = null;
        this.ctx = null;
        this.workingCtx = null;
        this.aspectRatio = 1;
        this.isBackgroundRemoved = false;
        this.originalImageData = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.controlsSection = document.getElementById('controlsSection');
        this.previewSection = document.getElementById('previewSection');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.qualityInput = document.getElementById('qualityInput');
        this.qualityValue = document.getElementById('qualityValue');
        this.toleranceInput = document.getElementById('toleranceInput');
        this.toleranceValue = document.getElementById('toleranceValue');
        this.maintainAspectRatioBtn = document.getElementById('maintainAspectRatio');
        this.removeBackgroundBtn = document.getElementById('removeBackground');
        this.restoreBackgroundBtn = document.getElementById('restoreBackground');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.originalSizeSpan = document.getElementById('originalSize');
        this.currentSizeSpan = document.getElementById('currentSize');
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Control events
        this.widthInput.addEventListener('input', () => this.handleDimensionChange());
        this.heightInput.addEventListener('input', () => this.handleDimensionChange());
        this.qualityInput.addEventListener('input', () => this.updateQualityDisplay());
        this.toleranceInput.addEventListener('input', () => this.updateToleranceDisplay());
        this.maintainAspectRatioBtn.addEventListener('click', () => this.toggleAspectRatio());
        
        // Action events
        this.removeBackgroundBtn.addEventListener('click', () => this.removeBackground());
        this.restoreBackgroundBtn.addEventListener('click', () => this.restoreBackground());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.resetBtn.addEventListener('click', () => this.resetImage());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0]);
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                this.initializeCanvas();
                this.showControls();
                this.updateSizeDisplay();
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    initializeCanvas() {
        // Create working canvas
        this.workingCanvas = document.createElement('canvas');
        this.workingCanvas.width = this.originalImage.width;
        this.workingCanvas.height = this.originalImage.height;
        this.workingCtx = this.workingCanvas.getContext('2d');
        
        // Create preview canvas
        this.previewCanvas.width = this.originalImage.width;
        this.previewCanvas.height = this.originalImage.height;
        this.ctx = this.previewCanvas.getContext('2d');
        
        // Set initial dimensions
        this.widthInput.value = this.originalImage.width;
        this.heightInput.value = this.originalImage.height;
        this.aspectRatio = this.originalImage.width / this.originalImage.height;
        
        // Draw initial image
        this.drawImage();
        this.originalImageData = this.ctx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }

    drawImage() {
        this.ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        this.ctx.drawImage(this.originalImage, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }

    showControls() {
        this.controlsSection.style.display = 'block';
        this.previewSection.style.display = 'block';
    }

    updateSizeDisplay() {
        this.originalSizeSpan.textContent = `${this.originalImage.width} × ${this.originalImage.height}`;
        this.currentSizeSpan.textContent = `${this.previewCanvas.width} × ${this.previewCanvas.height}`;
    }

    handleDimensionChange() {
        const newWidth = parseInt(this.widthInput.value) || this.originalImage.width;
        const newHeight = parseInt(this.heightInput.value) || this.originalImage.height;
        
        this.resizeImage(newWidth, newHeight);
    }

    resizeImage(width, height) {
        if (width <= 0 || height <= 0) return;
        
        // Create temporary canvas for resizing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Use high-quality image smoothing
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
        tempCtx.drawImage(this.originalImage, 0, 0, width, height);
        
        // Update preview canvas
        this.previewCanvas.width = width;
        this.previewCanvas.height = height;
        this.ctx = this.previewCanvas.getContext('2d');
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Update size display
        this.updateSizeDisplay();
        
        // Update working canvas
        this.workingCanvas.width = width;
        this.workingCanvas.height = height;
        this.workingCtx = this.workingCanvas.getContext('2d');
        this.workingCtx.drawImage(tempCanvas, 0, 0);
        
        // Store new image data
        this.originalImageData = this.ctx.getImageData(0, 0, width, height);
    }

    toggleAspectRatio() {
        const isMaintained = this.maintainAspectRatioBtn.classList.contains('active');
        
        if (isMaintained) {
            this.maintainAspectRatioBtn.classList.remove('active');
            this.maintainAspectRatioBtn.innerHTML = '<i class="fas fa-link"></i> Maintain Ratio';
        } else {
            this.maintainAspectRatioBtn.classList.add('active');
            this.maintainAspectRatioBtn.innerHTML = '<i class="fas fa-unlink"></i> Unlink Ratio';
        }
    }

    updateQualityDisplay() {
        this.qualityValue.textContent = `${this.qualityInput.value}%`;
    }

    updateToleranceDisplay() {
        this.toleranceValue.textContent = this.toleranceInput.value;
    }

    async removeBackground() {
        if (!this.originalImageData) return;
        
        this.showLoading(true);
        
        try {
            // Simple background removal using color similarity
            const tolerance = parseInt(this.toleranceInput.value);
            const imageData = this.ctx.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            const data = imageData.data;
            
            // Get the color of the top-left pixel as background color
            const bgR = data[0];
            const bgG = data[1];
            const bgB = data[2];
            
            // Process each pixel
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Calculate color distance
                const distance = Math.sqrt(
                    Math.pow(r - bgR, 2) + 
                    Math.pow(g - bgG, 2) + 
                    Math.pow(b - bgB, 2)
                );
                
                // If color is similar to background, make it transparent
                if (distance < tolerance * 2.55) { // Scale tolerance to 0-255 range
                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }
            
            // Apply the modified image data
            this.ctx.putImageData(imageData, 0, 0);
            
            // Update working canvas
            this.workingCtx.putImageData(imageData, 0, 0);
            
            this.isBackgroundRemoved = true;
            this.removeBackgroundBtn.style.display = 'none';
            this.restoreBackgroundBtn.style.display = 'inline-flex';
            
        } catch (error) {
            console.error('Error removing background:', error);
            alert('Error removing background. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    restoreBackground() {
        if (!this.originalImageData) return;
        
        // Restore original image data
        this.ctx.putImageData(this.originalImageData, 0, 0);
        this.workingCtx.putImageData(this.originalImageData, 0, 0);
        
        this.isBackgroundRemoved = false;
        this.removeBackgroundBtn.style.display = 'inline-flex';
        this.restoreBackgroundBtn.style.display = 'none';
    }

    downloadImage() {
        try {
            // Create a temporary canvas for final processing
            const finalCanvas = document.createElement('canvas');
            const finalCtx = finalCanvas.getContext('2d');
            
            finalCanvas.width = this.previewCanvas.width;
            finalCanvas.height = this.previewCanvas.height;
            
            // If background was removed, we need to handle transparency
            if (this.isBackgroundRemoved) {
                // Create a white background for better compatibility
                finalCtx.fillStyle = 'white';
                finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
            }
            
            // Draw the processed image
            finalCtx.drawImage(this.previewCanvas, 0, 0);
            
            // Convert to blob and download
            finalCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `processed_image_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png', this.qualityInput.value / 100);
            
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Error downloading image. Please try again.');
        }
    }

    resetImage() {
        if (this.originalImage) {
            this.loadImage(this.originalImage);
            this.isBackgroundRemoved = false;
            this.removeBackgroundBtn.style.display = 'inline-flex';
            this.restoreBackgroundBtn.style.display = 'none';
            this.qualityInput.value = 90;
            this.toleranceInput.value = 30;
            this.updateQualityDisplay();
            this.updateToleranceDisplay();
        }
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageProcessor();
});

// Add some additional utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'z':
                e.preventDefault();
                // Undo functionality could be added here
                break;
            case 's':
                e.preventDefault();
                // Trigger download
                const downloadBtn = document.getElementById('downloadBtn');
                if (downloadBtn) downloadBtn.click();
                break;
        }
    }
});
