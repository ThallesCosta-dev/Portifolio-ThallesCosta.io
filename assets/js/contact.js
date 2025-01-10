document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pegar os valores do formulário
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Validar os campos
    if (!validateForm(formData)) {
        return;
    }

    // Configurar o serviço de email (usando EmailJS como exemplo)
    emailjs.init("service_r3fuw6m"); // Substitua com seu user ID do EmailJS

    // Enviar o email
    emailjs.send("service_id", "template_id", {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "costa.thalles71@gmail.com"
    })
    .then(
        function(response) {
            showMessage("Mensagem enviada com sucesso!", "success");
            resetForm();
        },
        function(error) {
            showMessage("Erro ao enviar mensagem. Tente novamente.", "error");
            console.error("Erro:", error);
        }
    );
});

function validateForm(data) {
    // Validar nome
    if (!data.name || data.name.trim().length < 2) {
        showMessage("Por favor, insira um nome válido", "error");
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage("Por favor, insira um email válido", "error");
        return false;
    }

    // Validar assunto
    if (!data.subject || data.subject.trim().length < 3) {
        showMessage("Por favor, insira um assunto válido", "error");
        return false;
    }

    // Validar mensagem
    if (!data.message || data.message.trim().length < 10) {
        showMessage("Por favor, insira uma mensagem com pelo menos 10 caracteres", "error");
        return false;
    }

    return true;
}

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form);

    // Remover a mensagem após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function resetForm() {
    document.getElementById('contactForm').reset();
} 