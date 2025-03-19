/**
 * Christian Fellowship Media Page JavaScript
 * This script handles all functionality for the media page including:
 * - Category filtering
 * - Search and filtering
 * - Modal handling for uploads
 * - Form submission and validation
 * - Upload progress simulation
 * - Status messages
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categoryItems = document.querySelectorAll('.category-list li');
    const mediaItems = document.querySelectorAll('.media-item');
    const searchInput = document.getElementById('search-media');
    const filterDate = document.getElementById('filter-date');
    const searchBtn = document.getElementById('search-btn');
    const uploadBtn = document.getElementById('upload-media-btn');
    const uploadModal = document.getElementById('upload-modal');
    const statusModal = document.getElementById('status-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeStatusModalBtn = document.querySelector('.close-status-modal');
    const uploadForm = document.getElementById('media-upload-form');
    const cancelBtn = document.querySelector('.cancel-btn');
    const okBtns = document.querySelectorAll('.ok-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const pendingMessage = document.getElementById('pending-message');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentPageEl = document.querySelector('.current-page');
    const totalPagesEl = document.querySelector('.total-pages');
    
    // Media items per page
    const itemsPerPage = 6;
    let currentPage = 1;
    let filteredItems = [...mediaItems];
    
    // Initial setup
    updatePagination();
    
    // Category filtering
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active state
            categoryItems.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter media items
            filteredItems = [...mediaItems].filter(mediaItem => {
                if (category === 'all') return true;
                return mediaItem.getAttribute('data-category') === category;
            });
            
            // Reset to first page
            currentPage = 1;
            updateMediaDisplay();
            updatePagination();
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const dateFilter = filterDate.value;
        
        filteredItems = [...mediaItems].filter(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const speaker = item.querySelector('.media-speaker').textContent.toLowerCase();
            const matchesSearch = !searchTerm || title.includes(searchTerm) || speaker.includes(searchTerm);
            
            // Date filtering logic would be expanded based on actual data structure
            let matchesDate = true;
            if (dateFilter) {
                const itemDate = new Date(item.querySelector('.media-date').textContent);
                const now = new Date();
                
                switch(dateFilter) {
                    case 'latest':
                        matchesDate = itemDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last-week':
                        matchesDate = itemDate >= new Date(now - 14 * 24 * 60 * 60 * 1000) && 
                                     itemDate <= new Date(now - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last-month':
                        matchesDate = itemDate >= new Date(now - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last-year':
                        matchesDate = itemDate >= new Date(now - 365 * 24 * 60 * 60 * 1000);
                        break;
                }
            }
            
            return matchesSearch && matchesDate;
        });
        
        // Reset to first page and update display
        currentPage = 1;
        updateMediaDisplay();
        updatePagination();
    }
    
    // Pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
        totalPagesEl.textContent = totalPages;
        currentPageEl.textContent = currentPage;
        
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updateMediaDisplay();
            updatePagination();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
        if (currentPage < totalPages) {
            currentPage++;
            updateMediaDisplay();
            updatePagination();
        }
    });
    
    function updateMediaDisplay() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Hide all media items first
        mediaItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Show only the current page items
        filteredItems.slice(startIndex, endIndex).forEach(item => {
            item.style.display = 'block';
        });
        
        // Show empty message if no results
        const mediaGrid = document.querySelector('.media-grid');
        const emptyMessage = mediaGrid.querySelector('.empty-message') || document.createElement('p');
        
        if (filteredItems.length === 0) {
            if (!mediaGrid.querySelector('.empty-message')) {
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'No media resources found matching your criteria.';
                mediaGrid.appendChild(emptyMessage);
            }
        } else if (mediaGrid.querySelector('.empty-message')) {
            mediaGrid.removeChild(emptyMessage);
        }
    }
    
    // Modal handling
    uploadBtn.addEventListener('click', function() {
        uploadModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    function closeUploadModal() {
        uploadModal.classList.remove('active');
        document.body.style.overflow = '';
        uploadForm.reset();
        resetUploadProgress();
    }
    
    closeModalBtn.addEventListener('click', closeUploadModal);
    cancelBtn.addEventListener('click', closeUploadModal);
    
    // Close modal when clicking outside the content
    uploadModal.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            closeUploadModal();
        }
    });
    
    // Close status modal
    function closeStatusModal() {
        statusModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide all status messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        pendingMessage.style.display = 'none';
    }
    
    closeStatusModalBtn.addEventListener('click', closeStatusModal);
    
    okBtns.forEach(btn => {
        btn.addEventListener('click', closeStatusModal);
    });
    
    statusModal.addEventListener('click', function(e) {
        if (e.target === statusModal) {
            closeStatusModal();
        }
    });
    
    // Form validation and submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show upload progress
        closeUploadModal();
        showStatusMessage('pending');
        
        // Start upload progress animation
        startUploadProgress();
    });
    
    function validateForm() {
        let valid = true;
        const requiredFields = uploadForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                valid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        // File validation
        const fileInput = document.getElementById('media-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const maxSize = 500 * 1024 * 1024; // 500MB
            const acceptedTypes = ['audio/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            const fileType = file.type.split('/')[0] + '/';
            const isAcceptedType = acceptedTypes.some(type => file.type.startsWith(type));
            
            if (file.size > maxSize) {
                alert('File size exceeds the 500MB limit.');
                valid = false;
            }
            
            if (!isAcceptedType) {
                alert('File type not supported. Please upload audio, video, PDF, or DOC files.');
                valid = false;
            }
        }
        
        return valid;
    }
    
    // Upload progress simulation
    function startUploadProgress() {
        const uploadProgress = document.querySelector('.upload-progress');
        uploadProgress.style.display = 'block';
        
        let progress = 0;
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Simulate delay for backend processing
                setTimeout(() => {
                    // 90% chance of success (simulating occasional failures)
                    const isSuccess = Math.random() < 0.9;
                    
                    if (isSuccess) {
                        showStatusMessage('success');
                        addToUserUploads();
                    } else {
                        showStatusMessage('error');
                    }
                    
                    resetUploadProgress();
                }, 1000);
            }
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 200);
    }
    
    function resetUploadProgress() {
        const uploadProgress = document.querySelector('.upload-progress');
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
    }
    
    function showStatusMessage(type) {
        statusModal.classList.add('active');
        
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        pendingMessage.style.display = 'none';
        
        switch (type) {
            case 'success':
                successMessage.style.display = 'block';
                break;
            case 'error':
                errorMessage.style.display = 'block';
                break;
            case 'pending':
                pendingMessage.style.display = 'block';
                break;
        }
    }
    
    // Add uploaded media to user uploads section
    function addToUserUploads() {
        const userUploadsList = document.querySelector('.user-uploads-list');
        const emptyMessage = userUploadsList.querySelector('.empty-message');
        
        if (emptyMessage) {
            userUploadsList.removeChild(emptyMessage);
        }
        
        // Get form data
        const title = document.getElementById('media-title').value;
        const category = document.getElementById('media-category').options[document.getElementById('media-category').selectedIndex].text;
        
        // Create upload status element
        const uploadItem = document.createElement('div');
        uploadItem.className = 'user-upload-item';
        uploadItem.innerHTML = `
            <div class="upload-status">
                <span class="upload-title">${title}</span>
                <span class="upload-category">${category}</span>
                <span class="upload-pending">Pending Approval</span>
            </div>
        `;
        
        userUploadsList.appendChild(uploadItem);
    }
    
    // Play button functionality
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const title = mediaItem.querySelector('h3').textContent;
            alert(`Now playing: ${title}`);
            // In a real implementation, this would trigger the media player
        });
    });
    
    // Download button functionality
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const title = mediaItem.querySelector('h3').textContent;
            alert(`Downloading: ${title}`);
            // In a real implementation, this would start a file download
        });
    });
    
    // Share button functionality
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const title = mediaItem.querySelector('h3').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: `Check out this resource: ${title}`,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                prompt('Copy this link to share:', window.location.href);
            }
        });
    });
    
    // Media file input styling enhancement
    const mediaFileInput = document.getElementById('media-file');
    const mediaFileLabel = mediaFileInput.nextElementSibling;
    
    mediaFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            mediaFileLabel.textContent = fileName;
        } else {
            mediaFileLabel.textContent = 'Choose file';
        }
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (uploadModal.classList.contains('active')) {
                closeUploadModal();
            }
            if (statusModal.classList.contains('active')) {
                closeStatusModal();
            }
        }
    });
    
    // Initialize display
    updateMediaDisplay();
});