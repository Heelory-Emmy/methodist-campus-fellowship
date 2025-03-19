document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission handling
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    // Campus info elements
    const campusInfo = document.getElementById('campusInfo');
    const campusName = document.getElementById('campusName');
    const campusMeetingLocation = document.getElementById('campusMeetingLocation');
    const campusMeetingTimes = document.getElementById('campusMeetingTimes');
    const campusContact = document.getElementById('campusContact');
    const campusEmail = document.getElementById('campusEmail');
    
    // Sample campus data
    const campusData = [
        {
            id: 1,
            name: "University of Ibadan",
            location: "Faculty of Arts Building, Room 101",
            meetingTimes: "Sundays: 10:00 AM, Wednesdays: 6:00 PM",
            contactPerson: "John Adeyemi",
            email: "ui.mcf@example.com",
            coordinates: { lat: 7.4496, lng: 3.8985 }
        },
        {
            id: 2,
            name: "University of Lagos",
            location: "Chapel of Christ Building",
            meetingTimes: "Sundays: 11:00 AM, Thursdays: 5:30 PM",
            contactPerson: "Mary Okonkwo",
            email: "unilag.mcf@example.com",
            coordinates: { lat: 6.5171, lng: 3.3958 }
        },
        {
            id: 3,
            name: "Obafemi Awolowo University",
            location: "Religious Center, Block A",
            meetingTimes: "Sundays: 9:30 AM, Tuesdays: 6:00 PM",
            contactPerson: "Samuel Johnson",
            email: "oau.mcf@example.com",
            coordinates: { lat: 7.5206, lng: 4.5282 }
        },
        {
            id: 4,
            name: "University of Benin",
            location: "Faith Center, Main Campus",
            meetingTimes: "Sundays: 10:30 AM, Fridays: 5:00 PM",
            contactPerson: "Grace Obaseki",
            email: "uniben.mcf@example.com",
            coordinates: { lat: 6.3986, lng: 5.6125 }
        }
    ];

    // Initialize Google Map
    function initializeMap() {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            loadGoogleMapsScript();
            return;
        }

        const mapContainer = document.getElementById('mcfMap');
        
        // Create map
        const map = new google.maps.Map(mapContainer, {
            center: { lat: 7.3890, lng: 3.8914 }, // Center on Ibadan
            zoom: 6,
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#7c93a3" }]
                },
                {
                    featureType: "administrative.country",
                    elementType: "geometry",
                    stylers: [{ visibility: "on" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#a6cbe3" }]
                }
            ]
        });
        
        // Add markers for each campus
        campusData.forEach(campus => {
            const marker = new google.maps.Marker({
                position: campus.coordinates,
                map: map,
                title: campus.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 10
                },
                animation: google.maps.Animation.DROP
            });
            
            // Add click listener to show campus info
            marker.addListener('click', () => {
                displayCampusInfo(campus);
                
                // Animate marker when clicked
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 1500);
            });
        });
    }
    
    // Load Google Maps API script
    function loadGoogleMapsScript() {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
        script.async = true;
        script.defer = true;
        window.initMap = initializeMap;
        document.head.appendChild(script);
    }
    
    // Display campus information when marker is clicked
    function displayCampusInfo(campus) {
        campusName.textContent = campus.name;
        campusMeetingLocation.textContent = campus.location;
        campusMeetingTimes.textContent = campus.meetingTimes;
        campusContact.textContent = campus.contactPerson;
        campusEmail.textContent = campus.email;
        
        // Show the campus info section
        campusInfo.classList.remove('d-none');
        
        // Smooth scroll to campus info
        campusInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Form validation
    function validateForm() {
        const formElements = contactForm.elements;
        let isValid = true;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            
            if (element.hasAttribute('required') && !element.value.trim()) {
                element.classList.add('is-invalid');
                isValid = false;
            } else {
                element.classList.remove('is-invalid');
            }
            
            // Email validation
            if (element.type === 'email' && element.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(element.value)) {
                    element.classList.add('is-invalid');
                    isValid = false;
                }
            }
        }
        
        return isValid;
    }
    
    // Display form alert message
    function showFormAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type}`;
        formAlert.classList.remove('d-none');
        
        // Scroll to alert
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide after 5 seconds
        setTimeout(() => {
            formAlert.classList.add('d-none');
        }, 5000);
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                showFormAlert('Please fill in all required fields correctly.', 'danger');
                return;
            }
            
            // Show loading spinner
            submitText.classList.add('d-none');
            submitSpinner.classList.remove('d-none');
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Send form data using Fetch API
            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Show success message
                showFormAlert('Your message has been sent successfully! We will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Hide loading spinner
                submitText.classList.remove('d-none');
                submitSpinner.classList.add('d-none');
                submitButton.disabled = false;
            })
            .catch(error => {
                // Show error message
                showFormAlert('There was a problem sending your message. Please try again later.', 'danger');
                
                // Hide loading spinner
                submitText.classList.remove('d-none');
                submitSpinner.classList.add('d-none');
                submitButton.disabled = false;
                
                console.error('Form submission error:', error);
            });
        });
    }
    
    // Real-time form validation feedback
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
            
            if (this.type === 'email' && this.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(this.value)) {
                    this.classList.add('is-invalid');
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                if (this.type !== 'email' || 
                    (this.type === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value))) {
                    this.classList.remove('is-invalid');
                }
            }
        });
    });
    
    // Initialize map once DOM is loaded
    setTimeout(initializeMap, 1000);
    
    // Mobile menu toggle for emergency contacts
    const mobileToggleBtn = document.createElement('button');
    mobileToggleBtn.className = 'mobile-toggle d-md-none btn btn-sm btn-outline-primary mt-2 mb-2';
    mobileToggleBtn.innerHTML = '<i class="fas fa-bars mr-2"></i>Show More Options';
    mobileToggleBtn.setAttribute('aria-label', 'Toggle emergency options');
    
    // Find the container to append the toggle button
    const emergencySection = document.querySelector('.row.mt-5:last-of-type');
    if (emergencySection) {
        const buttonContainer = emergencySection.querySelector('.col-md-4');
        if (buttonContainer) {
            buttonContainer.prepend(mobileToggleBtn);
            
            // Add toggle functionality
            mobileToggleBtn.addEventListener('click', function() {
                const optionsContainer = document.querySelector('.d-flex.justify-content-center.flex-wrap');
                if (optionsContainer) {
                    optionsContainer.classList.toggle('mobile-expanded');
                    
                    if (optionsContainer.classList.contains('mobile-expanded')) {
                        mobileToggleBtn.innerHTML = '<i class="fas fa-times mr-2"></i>Hide Options';
                    } else {
                        mobileToggleBtn.innerHTML = '<i class="fas fa-bars mr-2"></i>Show More Options';
                    }
                }
            });
        }
    }
    
    // Add accessibility improvements
    document.querySelectorAll('a, button').forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const iconElement = element.querySelector('i.fa, i.fas, i.fab');
            if (iconElement) {
                let iconClass = iconElement.className;
                let ariaLabel = iconClass.match(/fa-([a-z-]+)/);
                if (ariaLabel && ariaLabel[1]) {
                    element.setAttribute('aria-label', ariaLabel[1].replace('-', ' '));
                }
            }
        }
    });
});


// Modal Section
document.addEventListener('DOMContentLoaded', function() {
    // Get all the buttons that should trigger modals
    const joinBtn = document.getElementById('joinBtn');
    const eventsBtn = document.getElementById('eventsBtn');
    const supportBtn = document.getElementById('supportBtn');
    
    // Get all the modals
    const joinModal = document.getElementById('joinModal');
    const eventsModal = document.getElementById('eventsModal');
    const supportModal = document.getElementById('supportModal');
    const eventRegisterModal = document.getElementById('eventRegisterModal');
    const paymentModal = document.getElementById('paymentModal');
    const successModal = document.getElementById('successModal');
    
    // Handle join button click
    joinBtn.addEventListener('click', function() {
        openModal(joinModal);
    });
    
    // Handle events button click
    eventsBtn.addEventListener('click', function() {
        // Here you would typically load events data
        loadEvents();
        openModal(eventsModal);
    });
    
    // Handle support button click
    supportBtn.addEventListener('click', function() {
        openModal(supportModal);
    });
    
    // Handle state selection to enable fellowship selection
    const stateSelect = document.getElementById('state');
    const fellowshipSelect = document.getElementById('fellowship');
    
    stateSelect.addEventListener('change', function() {
        fellowshipSelect.disabled = false;
        fellowshipSelect.innerHTML = '<option value="" selected disabled>Select a fellowship center</option>';
        
        // This is where you would load fellowship centers based on state
        // For now, we'll add some dummy data
        const dummyCenters = ['Central Fellowship', 'North District Center', 'East Wing Fellowship'];
        dummyCenters.forEach(center => {
            const option = document.createElement('option');
            option.value = center.toLowerCase().replace(/\s+/g, '-');
            option.textContent = center;
            fellowshipSelect.appendChild(option);
        });
    });
    
    // Handle support type selection
    const supportType = document.getElementById('supportType');
    const eventSelectContainer = document.getElementById('eventSelectContainer');
    
    supportType.addEventListener('change', function() {
        if (this.value === 'event') {
            eventSelectContainer.style.display = 'block';
            loadSupportEvents();
        } else {
            eventSelectContainer.style.display = 'none';
        }
    });
    
    // Form submissions
    const joinForm = document.getElementById('joinFellowshipForm');
    const eventRegForm = document.getElementById('eventRegistrationForm');
    const supportForm = document.getElementById('supportForm');
    
    joinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal(joinModal);
        document.getElementById('successMessage').textContent = 'Your fellowship application has been submitted successfully. A fellowship leader will contact you soon.';
        openModal(successModal);
    });
    
    eventRegForm.addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal(eventRegisterModal);
        document.getElementById('successMessage').textContent = 'Your event registration is confirmed. We look forward to seeing you!';
        openModal(successModal);
    });
    
    supportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Set payment details
        const amount = document.getElementById('amount').value;
        document.getElementById('paymentAmount').textContent = '₦' + amount;
        
        const supportTypeValue = supportType.value;
        let reference = 'MCF-Support-';
        
        switch(supportTypeValue) {
            case 'general':
                reference += 'General';
                break;
            case 'event':
                const eventSelect = document.getElementById('eventSelect');
                const eventName = eventSelect.options[eventSelect.selectedIndex].text;
                reference += 'Event-' + eventName;
                break;
            case 'outreach':
                reference += 'Outreach';
                break;
            case 'building':
                reference += 'Building';
                break;
        }
        
        document.getElementById('paymentReference').textContent = reference;
        
        closeModal(supportModal);
        openModal(paymentModal);
    });
    
    // Close button handlers
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
            closeModal(e.target);
        }
    });
    
    // Helper functions
    function openModal(modal) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        modal.classList.add('show');
        setTimeout(() => {
            modal.style.display = 'block';
        }, 10);
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Enable scrolling
        }, 300);
    }
    
    function loadEvents() {
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';
        
        // Sample event data
        const events = [
            {
                title: 'Annual Conference',
                date: 'June 15-18, 2025',
                location: 'Lagos Central Hall',
                description: 'Join us for our annual gathering with inspiring speakers and worship.'
            },
            {
                title: 'Youth Revival',
                date: 'April 5, 2025',
                location: 'Abuja Fellowship Center',
                description: 'A special event dedicated to our youth members with music and activities.'
            },
            {
                title: 'Easter Celebration',
                date: 'March 27, 2025',
                location: 'Multiple Locations',
                description: 'Celebrate the resurrection of our Lord with special services.'
            }
        ];
        
        events.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image" style="background-image: url('/api/placeholder/400/300')"></div>
                <div class="event-details">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-date"><i class="far fa-calendar-alt"></i> ${event.date}</p>
                    <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p class="event-description">${event.description}</p>
                    <button class="btn btn-primary register-event-btn" data-event-id="${index}">Register</button>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
            
            // Add click event to register button
            const registerBtn = eventCard.querySelector('.register-event-btn');
            registerBtn.addEventListener('click', function() {
                closeModal(eventsModal);
                document.getElementById('eventId').value = this.getAttribute('data-event-id');
                openModal(eventRegisterModal);
            });
        });
    }
    
    function loadSupportEvents() {
        const eventSelect = document.getElementById('eventSelect');
        eventSelect.innerHTML = '<option value="" selected disabled>Select an event to support</option>';
        
        // Sample events
        const events = ['Annual Conference 2025', 'Youth Revival', 'Easter Celebration', 'Community Outreach Day'];
        
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.toLowerCase().replace(/\s+/g, '-');
            option.textContent = event;
            eventSelect.appendChild(option);
        });
    }
});