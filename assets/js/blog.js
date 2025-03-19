document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const sharePostBtn = document.getElementById('share-post-btn');
    const sharePostModal = document.getElementById('share-post-modal');
    const postPreviewModal = document.getElementById('post-preview-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const previewBtn = document.querySelector('.preview-btn');
    const previewSubmitBtn = document.getElementById('preview-submit-btn');
    const previewEditBtn = document.getElementById('preview-edit-btn');
    const filterTags = document.querySelectorAll('.filter-tag');
    const postTitleInput = document.getElementById('post-title');
    const postExcerptInput = document.getElementById('post-excerpt');
    const postContentInput = document.getElementById('post-content');
    const postCategorySelect = document.getElementById('post-category');
    const readingTimeInput = document.getElementById('reading-time');
    const postImageInput = document.getElementById('post-image');
    const postTagsInput = document.getElementById('post-tags');
    const authorBioInput = document.getElementById('author-bio');
    const fileNameSpan = document.querySelector('.file-name');
    const characterCountSpan = document.querySelector('.character-count');
    const blogPostForm = document.getElementById('blog-post-form');

    // Initialize components
    initializeSearchToggle();
    initializeModals();
    initializeFormValidation();
    initializeCharacterCount();
    initializeFileUpload();
    initializeFilterTags();
    initializePreviewFunctionality();

    // Search toggle functionality
    function initializeSearchToggle() {
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener('click', function() {
                searchContainer.classList.toggle('active');
                if (searchContainer.classList.contains('active')) {
                    searchContainer.querySelector('input').focus();
                }
            });
        }
    }

    // Modals functionality
    function initializeModals() {
        // Open share post modal
        if (sharePostBtn && sharePostModal) {
            sharePostBtn.addEventListener('click', function() {
                sharePostModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.closest('.modal')) {
                    this.closest('.modal').style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Prevent modal content clicks from closing the modal
        const modalContents = document.querySelectorAll('.modal-content');
        modalContents.forEach(content => {
            content.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    }

    // Form validation
    function initializeFormValidation() {
        if (blogPostForm) {
            blogPostForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const title = postTitleInput.value.trim();
                const excerpt = postExcerptInput.value.trim();
                const content = postContentInput.value.trim();
                const category = postCategorySelect.value;
                const readingTime = readingTimeInput.value;
                
                // Basic validation
                if (!title || !excerpt || !content || !category || !readingTime) {
                    displayFormError('Please fill in all required fields.');
                    return;
                }
                
                if (excerpt.length > 150) {
                    displayFormError('Excerpt should be no more than 150 characters.');
                    return;
                }
                
                // If all validations pass, submit the form
                submitBlogPost(this);
            });
        }
    }

    // Character count for excerpt
    function initializeCharacterCount() {
        if (postExcerptInput && characterCountSpan) {
            postExcerptInput.addEventListener('input', function() {
                const count = this.value.length;
                characterCountSpan.textContent = `${count}/150`;
                
                if (count > 150) {
                    characterCountSpan.style.color = 'red';
                } else {
                    characterCountSpan.style.color = '';
                }
            });
        }
    }

    // File upload functionality
    function initializeFileUpload() {
        if (postImageInput && fileNameSpan) {
            postImageInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const fileName = this.files[0].name;
                    fileNameSpan.textContent = fileName;
                    
                    // Validate file size
                    const fileSize = this.files[0].size / 1024 / 1024; // in MB
                    if (fileSize > 2) {
                        displayFormError('File size should not exceed 2MB.');
                        this.value = '';
                        fileNameSpan.textContent = 'No file chosen';
                    }
                } else {
                    fileNameSpan.textContent = 'No file chosen';
                }
            });
        }
    }

    // Filter tags
    function initializeFilterTags() {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Remove active class from all tags
                filterTags.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tag
                this.classList.add('active');
                
                // Filter blog posts based on category
                const category = this.textContent.trim();
                filterBlogPosts(category);
            });
        });
    }

    // Preview functionality
    function initializePreviewFunctionality() {
        if (previewBtn && postPreviewModal) {
            previewBtn.addEventListener('click', function() {
                // Validate required fields before preview
                const title = postTitleInput.value.trim();
                const excerpt = postExcerptInput.value.trim();
                const content = postContentInput.value.trim();
                const category = postCategorySelect.value;
                const readingTime = readingTimeInput.value;
                
                if (!title || !excerpt || !content || !category || !readingTime) {
                    displayFormError('Please fill in all required fields before preview.');
                    return;
                }
                
                // Populate preview modal with form data
                document.getElementById('preview-post-title').textContent = title;
                document.getElementById('preview-post-author').textContent = document.querySelector('.username').textContent;
                document.getElementById('preview-post-category').textContent = postCategorySelect.options[postCategorySelect.selectedIndex].text;
                document.getElementById('preview-post-reading-time').textContent = readingTime;
                document.getElementById('preview-post-excerpt').textContent = excerpt;
                document.getElementById('preview-post-content').innerHTML = formatContent(content);
                
                // Handle preview image
                const previewImage = document.getElementById('preview-post-image');
                if (postImageInput.files.length > 0) {
                    const file = postImageInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    previewImage.src = 'placeholder-image.jpg';
                }
                
                // Handle tags
                const previewTags = document.querySelector('.preview-tags');
                previewTags.innerHTML = '';
                if (postTagsInput.value) {
                    const tags = postTagsInput.value.split(',').map(tag => tag.trim());
                    tags.forEach(tag => {
                        if (tag) {
                            const tagElement = document.createElement('span');
                            tagElement.className = 'preview-tag';
                            tagElement.textContent = tag;
                            previewTags.appendChild(tagElement);
                        }
                    });
                }
                
                // Show preview modal
                sharePostModal.style.display = 'none';
                postPreviewModal.style.display = 'block';
            });
        }

        // Preview Edit button
        if (previewEditBtn) {
            previewEditBtn.addEventListener('click', function() {
                postPreviewModal.style.display = 'none';
                sharePostModal.style.display = 'block';
            });
        }

        // Preview Submit button
        if (previewSubmitBtn) {
            previewSubmitBtn.addEventListener('click', function() {
                submitBlogPost(blogPostForm);
            });
        }
    }

    // Helper Functions
    function displayFormError(message) {
        // Check if an error message already exists
        let errorMessage = document.querySelector('.form-error-message');
        
        if (!errorMessage) {
            // Create new error message
            errorMessage = document.createElement('div');
            errorMessage.className = 'form-error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.marginBottom = '1rem';
            errorMessage.style.fontSize = 'var(--font-size-sm)';
            
            // Insert before form actions
            const formActions = document.querySelector('.form-actions');
            if (formActions) {
                formActions.parentNode.insertBefore(errorMessage, formActions);
            }
        }
        
        // Set error message
        errorMessage.textContent = message;
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        }, 5000);
    }

    function formatContent(content) {
        // Simple formatter for the preview
        // Replace newlines with paragraph tags
        return content.split('\n\n').map(paragraph => {
            if (paragraph.trim()) {
                return `<p>${paragraph}</p>`;
            }
            return '';
        }).join('');
    }

    function submitBlogPost(form) {
        // Simulate form submission
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn') || previewSubmitBtn;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            form.reset();
            fileNameSpan.textContent = 'No file chosen';
            characterCountSpan.textContent = '0/150';
            
            // Close modal
            if (sharePostModal) sharePostModal.style.display = 'none';
            if (postPreviewModal) postPreviewModal.style.display = 'none';
            
            // Reset body overflow
            document.body.style.overflow = '';
            
            // Show success message
            displaySuccessMessage('Your blog post has been submitted successfully!');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function displaySuccessMessage(message) {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.position = 'fixed';
        successMessage.style.top = '2rem';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = 'var(--primary)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '1rem 2rem';
        successMessage.style.borderRadius = '6px';
        successMessage.style.boxShadow = 'var(--shadow-1)';
        successMessage.style.zIndex = '1000';
        successMessage.textContent = message;
        
        // Append to body
        document.body.appendChild(successMessage);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    }

    function filterBlogPosts(category) {
        const blogPosts = document.querySelectorAll('.blog-post-card');
        
        blogPosts.forEach(post => {
            const postCategory = post.querySelector('.post-category').textContent;
            
            if (category === 'All' || postCategory === category) {
                post.style.display = '';
                // Optional: Add animation for appearing posts
                post.style.opacity = 0;
                setTimeout(() => {
                    post.style.opacity = 1;
                    post.style.transition = 'opacity 0.3s ease-in-out';
                }, 10);
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Enhanced Video Background - for the Page Header
    function setupVideoBackground() {
        const videoElement = document.querySelector('.page-header__video');
        
        if (videoElement) {
            // Play video once loaded
            videoElement.addEventListener('loadeddata', function() {
                this.play();
            });
            
            // Handle video loading issues
            videoElement.addEventListener('error', function() {
                console.error('Video loading error');
                const pageHeader = document.querySelector('.page-header');
                if (pageHeader) {
                    pageHeader.style.backgroundImage = 'url("fallback-header-image.jpg")';
                    pageHeader.style.backgroundSize = 'cover';
                    pageHeader.style.backgroundPosition = 'center';
                }
            });
        }
    }
    
    // Initialize video background
    setupVideoBackground();
});