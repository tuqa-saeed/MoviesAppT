document.addEventListener("DOMContentLoaded", function () {
    if (emailjs) {
        emailjs.init("d98d8gnLSlW08Sx6B");
        console.log("EmailJS Initialized Successfully");
    } else {
        console.error("Failed to load EmailJS");
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


function validateName(name) {
    const re = /^[a-zA-Z\u0600-\u06FF\s]+$/; 
    return re.test(String(name));
}


function validatePhone(phone) {
    const re = /^\+?\d{10,15}$/; 
    return re.test(String(phone));
}


function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}


function displayError(element, message) {
    let errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.style.color = 'red'; 
    errorSpan.textContent = message;
    element.parentNode.appendChild(errorSpan); 
}

function sendMail(event) {
    event.preventDefault(); 

    clearErrorMessages(); 

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let message = document.getElementById("message").value.trim();
    let loadingIndicator = document.getElementById("loading");
    let feedback = document.getElementById("feedback");

   
    if (loadingIndicator) loadingIndicator.style.display = "block";

  
    let formValid = true;

    
    if (!name || !email || !phone || !message) {
        formValid = false;
        displayError(document.getElementById("name"), "All fields are required.");
    }

    if (!validateName(name)) {
        formValid = false;
        displayError(document.getElementById("name"), "Please enter a valid name (Arabic & English letters only).");
    }

    if (!validateEmail(email)) {
        formValid = false;
        displayError(document.getElementById("email"), "Please enter a valid email address.");
    }

    if (!validatePhone(phone)) {
        formValid = false;
        displayError(document.getElementById("phone"), "Please enter a valid phone number (10-15 digits, optional +).");
    }

    if (!formValid) {
        if (loadingIndicator) loadingIndicator.style.display = "none";
        return; 
    }

    let params = { name, email, phone, message };

    emailjs.send("service_79iq44b", "template_yxjsvi4", params)
        .then(function () {
            if (feedback) feedback.style.display = "block"; 
            document.getElementById("contact-form").reset(); 
        })
        .catch(function (error) {
            alert("Failed to send email. Check console for details.");
            console.error("FAILED...", error);
        })
        .finally(function () {
            if (loadingIndicator) loadingIndicator.style.display = "none"; 
        });
}
