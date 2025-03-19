document.addEventListener('DOMContentLoaded', function() {
        // FAQ Accordion functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle current FAQ item
                const parent = this.parentElement;
                const answer = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Set new expanded state
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle active class
                parent.classList.toggle('active');
                
                // Animate the answer height
                if (isExpanded) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('faq-search');
        const searchButton = document.getElementById('search-btn');
        const faqItems = document.querySelectorAll('.faq-item');
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // If search is empty, show all FAQ items and categories
                faqItems.forEach(item => {
                    item.style.display = 'block';
                });
                document.querySelectorAll('.faq-category').forEach(category => {
                    category.style.display = 'block';
                });
                return;
            }
            
            // Hide all categories initially
            document.querySelectorAll('.faq-category').forEach(category => {
                category.style.display = 'none';
            });
            
            let resultsFound = false;
            
            // Filter FAQ items based on search term
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.closest('.faq-category').style.display = 'block';
                    resultsFound = true;
                    
                    // Expand the matching item
                    const questionBtn = item.querySelector('.faq-question');
                    const answerDiv = item.querySelector('.faq-answer');
                    
                    questionBtn.setAttribute('aria-expanded', 'true');
                    item.classList.add('active');
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show message if no results found
            const noResultsMsg = document.querySelector('.no-results-message') || document.createElement('div');
            
            if (!resultsFound) {
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.textContent = 'No matching questions found. Please try different keywords or contact us directly.';
                
                const accordionContainer = document.querySelector('.faq-accordion');
                if (!document.querySelector('.no-results-message')) {
                    accordionContainer.appendChild(noResultsMsg);
                }
            } else if (document.querySelector('.no-results-message')) {
                noResultsMsg.remove();
            }
        }
        
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        // Clear search results when input is cleared
        searchInput.addEventListener('input', function() {
            if (this.value === '') {
                performSearch();
            }
        });
    });


// Additional Script
// JavaScript for FAQ page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ question buttons
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Add click event listener to each FAQ question
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        // Toggle aria-expanded attribute
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Close all other FAQs (uncomment for accordion behavior)
        // faqQuestions.forEach(q => {
        //   if (q !== question) {
        //     q.setAttribute('aria-expanded', 'false');
        //   }
        // });
      });
    });
    
    // Search functionality
    const searchInput = document.getElementById('faq-search');
    const searchButton = document.getElementById('search-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        // If search is empty, show all items and categories
        faqItems.forEach(item => {
          item.style.display = 'block';
        });
        
        faqCategories.forEach(category => {
          category.style.display = 'block';
        });
        
        return;
      }
      
      // Hide all categories initially
      faqCategories.forEach(category => {
        category.style.display = 'none';
      });
      
      // Go through each FAQ item
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          // Show this item
          item.style.display = 'block';
          
          // Show its parent category
          const parentCategory = item.closest('.faq-category');
          if (parentCategory) {
            parentCategory.style.display = 'block';
          }
          
          // Expand the item to show the answer if it matches
          if (answer.includes(searchTerm)) {
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
          }
        } else {
          // Hide this item
          item.style.display = 'none';
        }
      });
    }
    
    // Search on button click
    searchButton.addEventListener('click', performSearch);
    
    // Search on enter key press
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // Search as you type (optional, uncomment to enable)
    // searchInput.addEventListener('input', performSearch);
  });