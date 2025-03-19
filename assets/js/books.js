document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categoryTabs = document.querySelectorAll('.category-tabs .tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    const searchInput = document.getElementById('resource-search');
    const searchBtn = document.getElementById('search-btn');
    const sortBySelect = document.getElementById('sort-by');
    const filterTypeSelect = document.getElementById('filter-type');
    const paginationNumbers = document.querySelectorAll('.page-number');
    const prevPageBtn = document.querySelector('.page-btn.prev');
    const nextPageBtn = document.querySelector('.page-btn.next');
    const noResultsDiv = document.querySelector('.no-results');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const uploadResourceBtn = document.getElementById('share-resource-btn');
    const uploadSuggestionLink = document.getElementById('upload-suggestion');
    const mobileMenuToggle = document.getElementById('mobile-categories-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown-content');
    const mobileCategoryLinks = document.querySelectorAll('.mobile-dropdown-content a');
    const requestResourceBtn = document.getElementById('request-resource-btn');
    const sliderPrevArrow = document.querySelector('.slider-arrow.prev-arrow');
    const sliderNextArrow = document.querySelector('.slider-arrow.next-arrow');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Modal Elements
    const uploadModal = document.getElementById('upload-resource-modal');
    const previewModal = document.getElementById('preview-modal');
    const reportModal = document.getElementById('report-modal');
    const requestModal = document.getElementById('request-resource-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const resourceTypeSelect = document.getElementById('resource-type');
    const fileUploadSection = document.getElementById('file-upload-section');
    const linkSection = document.getElementById('link-section');
    const notificationToast = document.getElementById('notification-toast');
    const closeNotificationBtn = document.querySelector('.close-notification');
    const previewBtns = document.querySelectorAll('.preview-btn');
    const downloadBtns = document.querySelectorAll('.download-btn');
    const previewDownloadBtn = document.getElementById('preview-download-btn');
    const previewShareBtn = document.getElementById('preview-share-btn');
    const previewReportBtn = document.getElementById('preview-report-btn');

    // Current state variables
    let currentPage = 1;
    let totalPages = 10;
    let currentCategory = 'all';
    let currentSearch = '';
    let currentSort = 'newest';
    let currentFilter = 'all';
    
    // ===== Category Filtering =====
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get category value
            currentCategory = this.getAttribute('data-category');
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Filter resources
            filterResources();
        });
    });

    // ===== Mobile Category Menu =====
    mobileMenuToggle.addEventListener('click', function() {
        mobileDropdown.classList.toggle('show');
    });

    // Close mobile dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-category-menu')) {
            mobileDropdown.classList.remove('show');
        }
    });

    mobileCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get category value
            currentCategory = this.getAttribute('data-category');
            
            // Close mobile dropdown
            mobileDropdown.classList.remove('show');
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Filter resources
            filterResources();
            
            // Update desktop tabs to match selected mobile category
            categoryTabs.forEach(tab => {
                if (tab.getAttribute('data-category') === currentCategory) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        });
    });

    // ===== Search Functionality =====
    searchBtn.addEventListener('click', function() {
        currentSearch = searchInput.value.trim().toLowerCase();
        currentPage = 1; // Reset to first page when searching
        
        // Show loading spinner
        showLoadingSpinner();
        
        // Filter resources
        filterResources();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value.trim().toLowerCase();
            currentPage = 1; // Reset to first page when searching
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Filter resources
            filterResources();
        }
    });

    // ===== Sorting and Filtering =====
    sortBySelect.addEventListener('change', function() {
        currentSort = this.value;
        
        // Show loading spinner
        showLoadingSpinner();
        
        // Sort resources
        sortResources();
    });

    filterTypeSelect.addEventListener('change', function() {
        currentFilter = this.value;
        
        // Show loading spinner
        showLoadingSpinner();
        
        // Filter resources
        filterResources();
    });

    // ===== Pagination =====
    paginationNumbers.forEach(number => {
        number.addEventListener('click', function() {
            // Don't do anything if already on this page
            if (this.classList.contains('active')) return;
            
            // Remove active class from all numbers
            paginationNumbers.forEach(n => n.classList.remove('active'));
            
            // Add active class to clicked number
            this.classList.add('active');
            
            // Update current page
            currentPage = parseInt(this.textContent);
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Load resources for page
            loadPageResources();
            
            // Update pagination buttons
            updatePaginationButtons();
        });
    });

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            
            // Update active page number
            paginationNumbers.forEach(n => {
                if (parseInt(n.textContent) === currentPage) {
                    n.classList.add('active');
                } else {
                    n.classList.remove('active');
                }
            });
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Load resources for page
            loadPageResources();
            
            // Update pagination buttons
            updatePaginationButtons();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            
            // Update active page number
            paginationNumbers.forEach(n => {
                if (parseInt(n.textContent) === currentPage) {
                    n.classList.add('active');
                } else {
                    n.classList.remove('active');
                }
            });
            
            // Show loading spinner
            showLoadingSpinner();
            
            // Load resources for page
            loadPageResources();
            
            // Update pagination buttons
            updatePaginationButtons();
        }
    });

    // ===== Modal Functionality =====
    // Open upload modal
    uploadResourceBtn.addEventListener('click', function() {
        openModal(uploadModal);
    });

    // Open upload modal from suggestion link
    if (uploadSuggestionLink) {
        uploadSuggestionLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(uploadModal);
        });
    }

    // Open request modal
    requestResourceBtn.addEventListener('click', function() {
        openModal(requestModal);
    });

    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Close modals with cancel buttons
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal || 
            event.target === previewModal || 
            event.target === reportModal || 
            event.target === requestModal) {
            closeAllModals();
        }
    });

    // Handle resource type selection
    resourceTypeSelect.addEventListener('change', function() {
        if (this.value === 'file') {
            fileUploadSection.style.display = 'block';
            linkSection.style.display = 'none';
        } else if (this.value === 'link') {
            fileUploadSection.style.display = 'none';
            linkSection.style.display = 'block';
        } else {
            fileUploadSection.style.display = 'none';
            linkSection.style.display = 'none';
        }
    });

    // ===== Form Submissions =====
    // Upload resource form
    const uploadForm = document.getElementById('resource-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Close modal
                closeAllModals();
                
                // Show success notification
                showNotification('Resource submitted successfully! It will be reviewed shortly.');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Request resource form
    const requestForm = document.getElementById('resource-request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Close modal
                closeAllModals();
                
                // Show success notification
                showNotification('Resource request submitted! We will notify you when it becomes available.');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Report form
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Close modal
                closeAllModals();
                
                // Show success notification
                showNotification('Report submitted. Thank you for helping us improve our resources!');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===== Resource Cards Functionality =====
    // Preview buttons
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.resource-card');
            const resourceTitle = card.querySelector('.resource-title').textContent;
            const resourceAuthor = card.querySelector('.resource-author').textContent;
            const resourceType = card.querySelector('.resource-type').textContent;
            const resourceDate = card.querySelector('.resource-date').textContent.replace('Added: ', '');
            const resourceDownloads = card.querySelector('.resource-downloads').textContent.replace(/[^0-9]/g, '');
            
            // Update preview modal content
            document.getElementById('preview-title').textContent = resourceTitle;
            document.getElementById('preview-author').textContent = resourceAuthor.replace('By ', '');
            document.getElementById('preview-type').textContent = resourceType;
            document.getElementById('preview-date').textContent = resourceDate;
            document.getElementById('preview-downloads').textContent = resourceDownloads;
            
            // For a real application, you would load more data here
            // For now, we'll use placeholder data
            document.getElementById('preview-category').textContent = 'Category';
            document.getElementById('preview-description').textContent = 'This is a sample description for the resource. In a real application, this would be loaded from the database.';
            document.getElementById('preview-size').textContent = '3.5 MB';
            document.getElementById('preview-language').textContent = 'English';
            
            // Open the preview modal
            openModal(previewModal);
        });
    });

    // Download buttons
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.resource-card');
            const resourceTitle = card.querySelector('.resource-title').textContent;
            
            // In a real application, this would redirect to a download link
            // For this demo, we'll just show a notification
            showNotification(`Downloading: ${resourceTitle}`);
            
            // Simulate download completion
            setTimeout(() => {
                showNotification(`${resourceTitle} downloaded successfully!`);
            }, 3000);
        });
    });

    // Preview modal actions
    previewDownloadBtn.addEventListener('click', function() {
        const resourceTitle = document.getElementById('preview-title').textContent;
        
        // In a real application, this would redirect to a download link
        // For this demo, we'll just show a notification
        showNotification(`Downloading: ${resourceTitle}`);
        
        // Simulate download completion
        setTimeout(() => {
            showNotification(`${resourceTitle} downloaded successfully!`);
        }, 3000);
    });

    previewShareBtn.addEventListener('click', function() {
        const resourceTitle = document.getElementById('preview-title').textContent;
        
        // In a real application, this would copy a share link to clipboard
        // For this demo, we'll just show a notification
        showNotification(`Share link for "${resourceTitle}" copied to clipboard!`);
    });

    previewReportBtn.addEventListener('click', function() {
        // Close preview modal
        closeAllModals();
        
        // Open report modal
        setTimeout(() => {
            openModal(reportModal);
        }, 300);
    });

    // ===== Featured Resources Slider =====
    document.addEventListener('DOMContentLoaded', function() {
        // ===== Featured Resources Slider =====
        let currentSlide = 0;
        const featuredSlider = document.querySelector('.featured-resources-slider');
        const featuredCards = document.querySelectorAll('.featured-resource-card');
        const sliderPrevArrow = document.querySelector('.slider-arrow.prev-arrow');
        const sliderNextArrow = document.querySelector('.slider-arrow.next-arrow');
        
        // Check if all elements exist
        if (featuredSlider && featuredCards.length > 0 && sliderPrevArrow && sliderNextArrow) {
            // Define updateSlider function
            function updateSlider() {
                // Hide all cards
                featuredCards.forEach(card => {
                    card.style.display = 'none';
                });
                
                // Show only the current card
                featuredCards[currentSlide].style.display = 'flex';
            }
            
            // Initialize slider
            updateSlider();
            
            // Previous slide button
            sliderPrevArrow.addEventListener('click', function() {
                currentSlide = (currentSlide > 0) ? currentSlide - 1 : featuredCards.length - 1;
                updateSlider();
            });
            
            // Next slide button
            sliderNextArrow.addEventListener('click', function() {
                currentSlide = (currentSlide < featuredCards.length - 1) ? currentSlide + 1 : 0;
                updateSlider();
            });
            
            // Auto-advance slider every 5 seconds
            setInterval(function() {
                currentSlide = (currentSlide < featuredCards.length - 1) ? currentSlide + 1 : 0;
                updateSlider();
            }, 5000);
        } else {
            console.error('Slider elements not found:');
            if (!featuredSlider) console.error('- Featured slider container missing');
            if (featuredCards.length === 0) console.error('- No featured cards found');
            if (!sliderPrevArrow) console.error('- Previous arrow button missing');
            if (!sliderNextArrow) console.error('- Next arrow button missing');
        }
    });
// ===== FAQ Accordion =====
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', function() {
        // Toggle this FAQ item
        item.classList.toggle('active');
        
        // Toggle answer visibility with smooth animation
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = 0;
        }
    });
});

// ===== View Resource Buttons =====
const viewResourceBtns = document.querySelectorAll('.view-resource-btn');
viewResourceBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.featured-resource-card') || 
                     this.closest('.recent-upload-card');
        
        if (card) {
            const resourceTitle = card.querySelector('h3').textContent;
            
            // For this demo, we'll just show a notification
            // In a real app, this would open the resource detail page
            showNotification(`Viewing resource: ${resourceTitle}`);
        }
    });
});

// ===== Collection View Buttons =====
const viewCollectionBtns = document.querySelectorAll('.view-collection-btn');
viewCollectionBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const card = this.closest('.collection-card');
        if (card) {
            const collectionTitle = card.querySelector('h3').textContent;
            
            // For this demo, we'll just show a notification
            // In a real app, this would navigate to the collection page
            showNotification(`Viewing collection: ${collectionTitle}`);
        }
    });
});

// ===== Notifications =====
closeNotificationBtn.addEventListener('click', function() {
    hideNotification();
});

// ===== File Upload Preview =====
const resourceFile = document.getElementById('resource-file');
if (resourceFile) {
    resourceFile.addEventListener('change', function() {
        const fileInfo = this.closest('.file-upload').querySelector('.file-info');
        
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Convert to MB
            
            // Check file size limit (500MB)
            if (file.size > 500 * 1024 * 1024) {
                showNotification('File size exceeds the 500MB limit', 'error');
                this.value = ''; // Clear the file input
                return;
            }
            
            // Update file info
            const infoHTML = `
                <p>Selected: ${file.name}</p>
                <p>Size: ${fileSize} MB</p>
                <p>Type: ${file.type}</p>
            `;
            fileInfo.innerHTML = infoHTML;
            
            // Simulate upload progress
            simulateFileUploadProgress();
        }
    });
}

// ===== Thumbnail Image Preview =====
const resourceThumbnail = document.getElementById('resource-thumbnail');
if (resourceThumbnail) {
    resourceThumbnail.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            
            // Check if it's an image
            if (!file.type.match('image.*')) {
                showNotification('Please select an image file for the thumbnail', 'error');
                this.value = ''; // Clear the file input
                return;
            }
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewContainer = document.createElement('div');
                previewContainer.className = 'thumbnail-preview';
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Thumbnail Preview">
                    <button type="button" class="remove-thumbnail">Remove</button>
                `;
                
                // Replace existing preview if any
                const existingPreview = resourceThumbnail.nextElementSibling;
                if (existingPreview && existingPreview.className === 'thumbnail-preview') {
                    existingPreview.remove();
                }
                
                resourceThumbnail.parentNode.insertBefore(previewContainer, resourceThumbnail.nextSibling);
                
                // Add remove functionality
                previewContainer.querySelector('.remove-thumbnail').addEventListener('click', function() {
                    resourceThumbnail.value = ''; // Clear the file input
                    previewContainer.remove();
                });
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===== Helper Functions =====
// Filter resources based on current criteria
function filterResources() {
    // In a real application, this would send an AJAX request to the server
    // For this demo, we'll simulate filtering with a timeout
    
    setTimeout(() => {
        // Hide loading spinner
        hideLoadingSpinner();
        
        // Filter resource cards based on category
        let visibleCount = 0;
        
        resourceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.resource-title').textContent.toLowerCase();
            const cardType = card.querySelector('.resource-type').textContent.toLowerCase();
            
            // Check if card matches current filters
            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
            const matchesSearch = cardTitle.includes(currentSearch);
            const matchesType = currentFilter === 'all' || cardType.toLowerCase() === currentFilter;
            
            if (matchesCategory && matchesSearch && matchesType) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResultsDiv.style.display = 'block';
        } else {
            noResultsDiv.style.display = 'none';
        }
        
        // Sort the visible resources
        sortResources();
        
        // Update pagination
        totalPages = Math.ceil(visibleCount / 12); // Assuming 12 items per page
        updatePagination();
    }, 500);
}

// Sort resources based on current sort option
function sortResources() {
    // In a real application, this would send an AJAX request or sort DOM elements
    // For this demo, we'll just show a notification
    
    showNotification(`Resources sorted by: ${currentSort}`);
}

// Load resources for current page
function loadPageResources() {
    // In a real application, this would load resources for the selected page
    // For this demo, we'll simulate loading with a timeout
    
    setTimeout(() => {
        // Hide loading spinner
        hideLoadingSpinner();
        
        // Show notification
        showNotification(`Showing page ${currentPage} of resources`);
    }, 500);
}

// Update pagination UI
function updatePagination() {
    // Update page numbers
    paginationNumbers.forEach((number, index) => {
        if (index === 0) {
            number.textContent = '1';
            number.classList.toggle('active', currentPage === 1);
        } else if (index === paginationNumbers.length - 1) {
            number.textContent = totalPages.toString();
            number.classList.toggle('active', currentPage === totalPages);
        } else if (index === paginationNumbers.length - 2) {
            // This is the ellipsis, do nothing
        } else {
            // Calculate page number based on current page
            let pageNum;
            
            if (totalPages <= 5) {
                pageNum = index + 1;
            } else if (currentPage <= 3) {
                pageNum = index + 1;
            } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - (paginationNumbers.length - 2) + index;
            } else {
                pageNum = currentPage - 1 + index;
            }
            
            number.textContent = pageNum.toString();
            number.classList.toggle('active', currentPage === pageNum);
        }
    });
    
    // Show/hide ellipsis
    const ellipsis = document.querySelector('.page-ellipsis');
    if (ellipsis) {
        ellipsis.style.display = totalPages > 5 ? 'inline-block' : 'none';
    }
    
    // Update pagination buttons
    updatePaginationButtons();
}

// Update pagination buttons state
function updatePaginationButtons() {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Show loading spinner
function showLoadingSpinner() {
    loadingSpinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

// Open a modal
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        
        // Add body class to prevent scrolling
        document.body.classList.add('modal-open');
    }
}

// Close all modals
function closeAllModals() {
    uploadModal.style.display = 'none';
    previewModal.style.display = 'none';
    reportModal.style.display = 'none';
    requestModal.style.display = 'none';
    
    // Remove body class to enable scrolling
    document.body.classList.remove('modal-open');
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    
    // Set notification type
    notificationToast.className = 'notification-toast';
    notificationToast.classList.add(type);
    
    // Show notification
    notificationToast.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    clearTimeout(window.notificationTimeout);
    window.notificationTimeout = setTimeout(hideNotification, 5000);
}

// Hide notification
function hideNotification() {
    notificationToast.style.display = 'none';
}

// Update slider position
function updateSlider() {
    const sliderWidth = featuredSlider.clientWidth;
    const translateX = currentSlide * -sliderWidth;
    
    featuredCards.forEach(card => {
        card.style.transform = `translateX(${translateX}px)`;
    });
}

// Simulate file upload progress
function simulateFileUploadProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (!progressBar || !progressText) return;
    
    // Reset progress
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    
    // Show progress bar
    document.querySelector('.upload-progress').style.display = 'block';
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 300);
}

// Window resize handler for responsive elements
window.addEventListener('resize', function() {
    // Update featured slider if it exists
    if (featuredSlider) {
        updateSlider();
    }
    
    // Update FAQ items max-height
    faqItems.forEach(item => {
        if (item.classList.contains('active')) {
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Initialize elements that need setup on page load
function init() {
    // Set up FAQ items initial state
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = '0';
    });
    
    // Add CSS for modals
    const style = document.createElement('style');
    style.textContent = `
        body.modal-open {
            overflow: hidden;
        }
        
        .thumbnail-preview {
            margin-top: 10px;
        }
        
        .thumbnail-preview img {
            max-width: 100%;
            max-height: 200px;
            display: block;
            margin-bottom: 5px;
        }
        
        .remove-thumbnail {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything
init();
});














// Additional Script for Thumbnail Handling
// Preview buttons
previewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.resource-card');
        const resourceTitle = card.querySelector('.resource-title').textContent;
        const resourceAuthor = card.querySelector('.resource-author').textContent;
        const resourceType = card.querySelector('.resource-type').textContent;
        const resourceDate = card.querySelector('.resource-date').textContent.replace('Added: ', '');
        const resourceDownloads = card.querySelector('.resource-downloads').textContent.replace(/[^0-9]/g, '');
        
        // Get the thumbnail image from the card
        const thumbnailImg = card.querySelector('.resource-thumbnail img').src;
        
        // Update preview modal content
        document.getElementById('preview-title').textContent = resourceTitle;
        document.getElementById('preview-author').textContent = resourceAuthor.replace('By ', '');
        document.getElementById('preview-type').textContent = resourceType;
        document.getElementById('preview-date').textContent = resourceDate;
        document.getElementById('preview-downloads').textContent = resourceDownloads;
        
        // Set the preview image
        document.getElementById('preview-image').src = thumbnailImg;
        
        // Get the category from the card's data attribute
        const category = card.getAttribute('data-category');
        document.getElementById('preview-category').textContent = 
            category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        
        // Open the preview modal
        openModal(previewModal);
    });
});

// Script to Detect the File Size 
function getFileSize(file) {
    const fileSizeBytes = file.size;
    if (fileSizeBytes < 1024) {
        return fileSizeBytes + ' bytes';
    } else if (fileSizeBytes < 1024 * 1024) {
        return (fileSizeBytes / 1024).toFixed(2) + ' KB';
    } else if (fileSizeBytes < 1024 * 1024 * 1024) {
        return (fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

// Script for the Share Button
previewShareBtn.addEventListener('click', function() {
    const resourceTitle = document.getElementById('preview-title').textContent;
    const shareUrl = window.location.href.split('?')[0] + '?resource=' + encodeURIComponent(resourceTitle);
    
    // Check if the browser supports the Web Share API
    if (navigator.share) {
        navigator.share({
            title: resourceTitle,
            text: 'Check out this resource: ' + resourceTitle,
            url: shareUrl,
        })
        .then(() => showNotification('Resource shared successfully!'))
        .catch(error => {
            console.error('Error sharing:', error);
            fallbackShare(shareUrl);
        });
    } else {
        fallbackShare(shareUrl);
    }
});

// Fallback sharing method using clipboard
function fallbackShare(url) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-1000px';
    tempInput.value = url;
    document.body.appendChild(tempInput);
    
    // Select and copy the link
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('Share link copied to clipboard!');
}

// Script for the download functionality
previewDownloadBtn.addEventListener('click', function() {
    const resourceTitle = document.getElementById('preview-title').textContent;
    const resourceType = document.getElementById('preview-type').textContent.toLowerCase();
    
    // Show loading state
    const originalText = this.textContent;
    this.textContent = 'Downloading...';
    this.disabled = true;
    
    // Simulate API call to get download URL (replace with actual API call)
    setTimeout(() => {
        // Get resource ID from data attribute (you'll need to add this)
        const resourceId = previewModal.getAttribute('data-resource-id');
        
        // Create the download link
        downloadResource(resourceId, resourceTitle, resourceType);
        
        // Track download
        incrementDownloadCount(resourceId);
        
        // Reset button
        this.textContent = originalText;
        this.disabled = false;
    }, 1000);
});

function downloadResource(resourceId, resourceTitle, resourceType) {
    // In a real application, this would generate a download URL from your server
    // For demonstration purposes, we'll create a dummy file
    
    // For actual implementation:
    // window.location.href = `/api/download/${resourceId}`;
    
    // Demo implementation (creates a dummy text file)
    const dummyContent = `This is a placeholder for ${resourceTitle}. In a real application, this would be the actual file content.`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resourceTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function incrementDownloadCount(resourceId) {
    // In a real application, this would send an API request to increment the download count
    // For demonstration, we'll update the UI directly
    
    const downloads = document.getElementById('preview-downloads');
    let count = parseInt(downloads.textContent);
    downloads.textContent = (count + 1).toString();
    
    // Also update the card if it's visible
    const cards = document.querySelectorAll('.resource-card');
    cards.forEach(card => {
        if (card.getAttribute('data-resource-id') === resourceId) {
            const downloadSpan = card.querySelector('.resource-downloads');
            if (downloadSpan) {
                const currentText = downloadSpan.innerHTML;
                const iconHTML = currentText.substring(0, currentText.indexOf('</i>') + 4);
                downloadSpan.innerHTML = `${iconHTML} ${count + 1}`;
            }
        }
    });
}

// Script for Resource ID Management
// Add data-resource-id to each resource card
document.querySelectorAll('.resource-card').forEach((card, index) => {
    // In a real application, this ID would come from your database
    // For this demo, we'll generate simple IDs
    const resourceId = 'resource-' + (index + 1);
    card.setAttribute('data-resource-id', resourceId);
});

// Update preview button click handler to store the resource ID
previewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.resource-card');
        const resourceId = card.getAttribute('data-resource-id');
        
        // Store the resource ID in the modal for future reference
        previewModal.setAttribute('data-resource-id', resourceId);
        
        // Rest of your existing preview handler code...
    });
});

// Enhance the file upload functionality
// File upload handler with automatic file sizing
const resourceFile = document.getElementById('resource-file');
if (resourceFile) {
    resourceFile.addEventListener('change', function() {
        const fileInfo = this.closest('.file-upload').querySelector('.file-info');
        
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileSize = getFileSize(file);
            
            // Check file size limit (500MB)
            if (file.size > 500 * 1024 * 1024) {
                showNotification('File size exceeds the 500MB limit', 'error');
                this.value = ''; // Clear the file input
                return;
            }
            
            // Store file info for later use when creating the resource
            this.dataset.fileSize = fileSize;
            
            // Update file info display
            const infoHTML = `
                <p>Selected: ${file.name}</p>
                <p>Size: ${fileSize}</p>
                <p>Type: ${file.type}</p>
            `;
            fileInfo.innerHTML = infoHTML;
            
            // Simulate upload progress
            simulateFileUploadProgress();
        }
    });
}

// Add data-binding for newly uploaded resources
// Add this to your upload form submit handler
const uploadForm = document.getElementById('resource-upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        
        // Get file size if available
        const resourceFile = document.getElementById('resource-file');
        const fileSize = resourceFile.dataset.fileSize || 'Unknown';
        
        // In a real app, you would send this data to your server
        // For this demo, we'll create a new resource card locally
        
        setTimeout(() => {
            // Create a new resource (in a real app, this would happen server-side)
            createNewResourceCard({
                title: formData.get('resource-title'),
                author: formData.get('resource-author') || 'Anonymous',
                category: formData.get('resource-category'),
                type: determineResourceType(formData.get('resource-type'), resourceFile),
                size: fileSize,
                thumbnail: getThumbnailPreview() || '../assets/images/thumbnail/default-thumbnail.jpg',
                downloads: 0,
                date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
            });
            
            // Close modal
            closeAllModals();
            
            // Show success notification
            showNotification('Resource submitted successfully! It will be reviewed shortly.');
            
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear file info display
            const fileInfo = document.querySelector('.file-info');
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <p>Max file size: 500MB</p>
                    <p>Accepted formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP3, MP4, EPUB</p>
                `;
            }
            
            // Hide upload progress
            document.querySelector('.upload-progress').style.display = 'none';
        }, 1500);
    });
}

function determineResourceType(type, fileInput) {
    if (type === 'link') return 'link';
    
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileType = file.type;
        
        if (fileType.includes('pdf')) return 'pdf';
        if (fileType.includes('word') || fileType.includes('doc')) return 'doc';
        if (fileType.includes('audio') || fileType.includes('mp3')) return 'audio';
        if (fileType.includes('video') || fileType.includes('mp4')) return 'video';
        
        // Check by extension
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.pdf')) return 'pdf';
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'doc';
        if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) return 'audio';
        if (fileName.endsWith('.mp4') || fileName.endsWith('.mov')) return 'video';
    }
    
    return 'pdf'; // Default to PDF
}

function getThumbnailPreview() {
    const thumbnailPreview = document.querySelector('.thumbnail-preview img');
    return thumbnailPreview ? thumbnailPreview.src : null;
}

function createNewResourceCard(resource) {
    // Create a new resource card element
    const newCard = document.createElement('div');
    newCard.className = 'resource-card';
    newCard.setAttribute('data-category', resource.category);
    newCard.setAttribute('data-resource-id', 'resource-new-' + Date.now());
    
    newCard.innerHTML = `
        <div class="resource-thumbnail">
            <img src="${resource.thumbnail}" alt="${resource.title} Thumbnail">
            <span class="resource-type ${resource.type}">${resource.type.toUpperCase()}</span>
        </div>
        <div class="resource-info">
            <h3 class="resource-title">${resource.title}</h3>
            <p class="resource-author">By ${resource.author}</p>
            <div class="resource-meta">
                <span class="resource-date">Added: ${resource.date}</span>
                <span class="resource-downloads"><i class="download-icon"></i> ${resource.downloads}</span>
            </div>
            <div class="resource-actions">
                <button class="preview-btn">Preview</button>
                <button class="download-btn">Download</button>
            </div>
        </div>
    `;
    
    // Add the new card to the resources grid
    const resourcesGrid = document.querySelector('.resources-grid');
    resourcesGrid.insertBefore(newCard, resourcesGrid.firstChild);
    
    // Add event listeners to the new buttons
    const previewBtn = newCard.querySelector('.preview-btn');
    previewBtn.addEventListener('click', function() {
        const resourceId = newCard.getAttribute('data-resource-id');
        
        // Set modal data
        previewModal.setAttribute('data-resource-id', resourceId);
        document.getElementById('preview-title').textContent = resource.title;
        document.getElementById('preview-author').textContent = resource.author;
        document.getElementById('preview-type').textContent = resource.type.toUpperCase();
        document.getElementById('preview-date').textContent = resource.date;
        document.getElementById('preview-downloads').textContent = resource.downloads.toString();
        document.getElementById('preview-image').src = resource.thumbnail;
        document.getElementById('preview-category').textContent = 
            resource.category.charAt(0).toUpperCase() + resource.category.slice(1).replace('-', ' ');
        document.getElementById('preview-size').textContent = resource.size;
        document.getElementById('preview-language').textContent = 'English';
        document.getElementById('preview-description').textContent = 
            'This is a newly added resource. Description will be available after review.';
        
        // Open the preview modal
        openModal(previewModal);
    });
    
    const downloadBtn = newCard.querySelector('.download-btn');
    downloadBtn.addEventListener('click', function() {
        showNotification(`Downloading: ${resource.title}`);
        
        // Simulate download completion
        setTimeout(() => {
            showNotification(`${resource.title} downloaded successfully!`);
        }, 3000);
    });
    
    // Show notification
    showNotification('New resource card added! Refreshing view...');
    
    // Re-initialize filtering to update counts
    filterResources();
}

//Add this code to handle direct links to resources
// Add this at the beginning of your DOMContentLoaded function
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceParam = urlParams.get('resource');
    
    if (resourceParam) {
        // Try to find a resource with this title
        const cards = document.querySelectorAll('.resource-card');
        for (let card of cards) {
            const title = card.querySelector('.resource-title').textContent;
            if (title === resourceParam) {
                // Trigger click on the preview button
                const previewBtn = card.querySelector('.preview-btn');
                if (previewBtn) {
                    setTimeout(() => previewBtn.click(), 500);
                    return;
                }
            }
        }
        
        // If not found, show notification
        showNotification('Resource not found: ' + resourceParam, 'error');
    }
}

// Call this function
handleUrlParameters();

