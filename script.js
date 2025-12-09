// Atualiza automaticamente o ano no rodapé
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// =======================
// Tema claro/escuro
// =======================
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// carrega preferência salva
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (themeToggleBtn) themeToggleBtn.textContent = "☀️";
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// =======================
// Validação simples do formulário
// =======================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        alert("Mensagem enviada com sucesso! (Aqui você pode integrar com EmailJS, API, etc.)");
        contactForm.reset();
    });
}

// =======================
// Efeito digitando no Hero
// =======================
const typingTexts = [
    "Desenvolvedor Full-Stack",
    "Estudante de Informática no IFSP",
    "Criador da GRAI EcoSystems",
    "Empreendedor em formação",
];

const typingElement = document.getElementById("typing");
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingElement) return;

    const currentText = typingTexts[textIndex];

    if (!isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex++);

        if (charIndex > currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1080);
            return;
        }
    } else {
        typingElement.textContent = currentText.substring(0, charIndex--);

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 95);
}

// Ativa o efeito sempre que o Hero estiver visível
const heroSection = document.querySelector(".hero");

if (heroSection && typingElement) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    textIndex = 0;
                    charIndex = 0;
                    isDeleting = false;
                    typeEffect();
                }
            });
        },
        { threshold: 0.7 }
    );

    observer.observe(heroSection);
}
// =======================
// Enviar Formulário para WhatsApp
// =======================
const formContato = document.getElementById("formContato");

if (formContato) {
    formContato.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !email || !mensagem) {
            alert("Por favor, preencha todos os campos antes de enviar.");
            return;
        }

        const numeroWhatsApp = "5517997208457";

        const texto = 
`📩 *Novo contato pelo portfólio!*

*Nome:* ${nome}
*E-mail:* ${email}
*Mensagem:* ${mensagem}

Mensagem enviada através do portfólio.`;

        const url = `https://wa.me/${17981568889}?text=${encodeURIComponent(texto)}`;

        window.open(url, "_blank");

        formContato.reset();
    });
}

