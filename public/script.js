document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    const messageDiv = document.getElementById('formMessage');
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.className = 'form-message success';
            messageDiv.textContent = result.message;
            document.getElementById('contactForm').reset();
        } else {
            messageDiv.className = 'form-message error';
            messageDiv.textContent = result.message;
        }
    } catch (error) {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = 'Error sending message. Please try again.';
    }
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Chatbot functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

const responses = {
    'lift': 'We provide comprehensive lift testing, inspection, and certification services according to IS 4591 standards. Our services include safety testing, load testing, and compliance verification.',
    'escalator': 'Our escalator services include testing, inspection, and certification as per IS 14665 standards. We ensure all safety requirements are met for passenger safety.',
    'service': 'We offer Testing, Inspection, Certification, and Training Services for lifts, escalators, and travelators across India. Contact us for more details.',
    'contact': 'You can reach us through the contact form on our website. Our team will respond to your inquiry promptly.',
    'certification': 'We provide nationally recognized certifications backed by ISO 9001, ISO 14001, and OHSAS 18001 accreditations.',
    'training': 'We offer specialized training programs including mock drills and emergency training for lift and escalator operations.',
    'inspection': 'Our inspection services cover all safety and standard compliances. You get access to our online inspection database to download reports.',
    'standard': 'We follow BIS standards including IS 4591 for lifts and IS 14665 for escalators, ensuring complete safety compliance.',
    'default': 'Thank you for your question. For detailed information, please contact us through our contact form or call our office. Our team will be happy to assist you.'
};

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = message;
    chatbotMessages.appendChild(userMessage);
    
    chatbotInput.value = '';
    
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        
        const lowerMessage = message.toLowerCase();
        let response = responses.default;
        
        for (let key in responses) {
            if (lowerMessage.includes(key)) {
                response = responses[key];
                break;
            }
        }
        
        botMessage.textContent = response;
        chatbotMessages.appendChild(botMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSend.addEventListener('click', sendMessage);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);
