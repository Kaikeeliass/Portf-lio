/* =============================================
   PORTFÓLIO — KAIKE ELIAS
   script.js — versão integrada e melhorada
   ============================================= */

/* --------------------------------------------------
   1. ANO NO RODAPÉ
-------------------------------------------------- */
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* --------------------------------------------------
   2. TEMA CLARO / ESCURO
   HTML usa data-theme="light|dark" no <html>
   O script antigo usava classList no body — corrigido.
-------------------------------------------------- */
const html = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

html.setAttribute("data-theme", savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* --------------------------------------------------
   3. NAVBAR — efeito de scroll + hamburger
-------------------------------------------------- */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

window.addEventListener(
  "scroll",
  () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
  },
  { passive: true },
);

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", open);
  });

  // Fecha menu ao clicar em um link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
}

/* --------------------------------------------------
   4. CURSOR PERSONALIZADO
   Requer #cursor e #cursor-ring no HTML
-------------------------------------------------- */
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
  let ringX = 0,
    ringY = 0;
  let mouseX = 0,
    mouseY = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    },
    { passive: true },
  );

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Cresce sobre elementos clicáveis
  const clickables =
    "a, button, [data-filter], .tab-btn, .project-card, .soft-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(clickables)) {
      cursor.classList.add("hover");
      cursorRing.classList.add("hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(clickables)) {
      cursor.classList.remove("hover");
      cursorRing.classList.remove("hover");
    }
  });

  // Esconde cursor ao sair da janela
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });
}

/* --------------------------------------------------
   5. ANIMAÇÕES DE SCROLL — REVEAL
   Elementos com classe .reveal aparecem ao entrar
   na viewport usando IntersectionObserver
-------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

/* --------------------------------------------------
   6. EFEITO DE DIGITAÇÃO NO HERO
   Anima o parágrafo #typing-target
-------------------------------------------------- */
const typingTarget = document.getElementById("typing-target");
const typingTexts = [
  "Transformo ideias em sistemas reais — do banco de dados à interface.",
  "Desenvolvedor Full-Stack em formação no IFSP.",
  "Criador da startup GRAI EcoSystems.",
  "Empreendedor movido por tecnologia e impacto.",
];

if (typingTarget) {
  let tIndex = 0;
  let cIndex = 0;
  let deleting = false;
  let paused = false;

  const type = () => {
    if (paused) return;

    const current = typingTexts[tIndex];

    if (!deleting) {
      typingTarget.textContent = current.substring(0, cIndex + 1);
      cIndex++;
      if (cIndex === current.length) {
        deleting = true;
        paused = true;
        setTimeout(() => {
          paused = false;
          setTimeout(type, 60);
        }, 2200);
        return;
      }
    } else {
      typingTarget.textContent = current.substring(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        tIndex = (tIndex + 1) % typingTexts.length;
      }
    }

    setTimeout(type, deleting ? 45 : 70);
  };

  // Inicia apenas quando o hero for visível
  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) type();
        });
      },
      { threshold: 0.5 },
    ).observe(heroEl);
  } else {
    type();
  }
}

/* --------------------------------------------------
   7. TABS — Hard Skills / Soft Skills
-------------------------------------------------- */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabBtns.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    const targetEl = document.getElementById(`tab-${target}`);
    if (targetEl) {
      targetEl.classList.add("active");
      // Re-dispara reveal nos filhos do tab
      targetEl.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        revealObserver.observe(el);
      });
    }
  });
});

/* --------------------------------------------------
   8. FILTRO DE PROJETOS (página projetos.html)
-------------------------------------------------- */
const filterBtns = document.querySelectorAll(".filter-btn");
const projCards = document.querySelectorAll(".proj-card[data-cat]");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    projCards.forEach((card) => {
      const match = filter === "all" || card.dataset.cat === filter;
      card.style.display = match ? "" : "none";

      // Re-anima cards ao aparecer
      if (match) {
        card.classList.remove("visible");
        requestAnimationFrame(() => revealObserver.observe(card));
      }
    });
  });
});

/* --------------------------------------------------
   9. FORMULÁRIO DE CONTATO → WhatsApp
   Número: 5517997208457 (formato E.164 sem +)
-------------------------------------------------- */
const formContato = document.getElementById("formContato");

if (formContato) {
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const mensagem = document.getElementById("mensagem")?.value.trim();

    if (!nome || !email || !mensagem) {
      showToast("Por favor, preencha todos os campos.", "warning");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Insira um e-mail válido.", "warning");
      return;
    }

    const numero = "5517997208457";
    const texto = `📩 *Novo contato pelo portfólio!*\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Mensagem:* ${mensagem}\n\nMensagem enviada através do portfólio.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank", "noopener,noreferrer");
    formContato.reset();
    showToast("Redirecionando para o WhatsApp! 🚀", "success");
  });
}

/* --------------------------------------------------
   10. TOAST / NOTIFICAÇÃO LEVE
   Exibe mensagem no canto inferior direito
-------------------------------------------------- */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px; pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    error: "#ef4444",
  };

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    background: #1a1a1a; color: #fff; padding: .75rem 1.25rem;
    border-radius: 8px; font-size: 14px; max-width: 280px;
    border-left: 3px solid ${colors[type] || colors.info};
    opacity: 0; transform: translateY(12px);
    transition: opacity .3s, transform .3s;
    pointer-events: auto;
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

/* --------------------------------------------------
   11. LINK ATIVO NA NAVBAR — destaca seção visível
-------------------------------------------------- */
const sections = document.querySelectorAll("section[id], header[id]");
const navLinksAll = document.querySelectorAll(".nav-links a, .mobile-menu a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle(
            "active",
            href === `#${id}` || href?.endsWith(`#${id}`),
          );
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => sectionObserver.observe(s));

/* --------------------------------------------------
   12. SCROLL SUAVE — âncoras
   (CSS scroll-behavior:smooth é fallback)
-------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
