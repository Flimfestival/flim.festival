/*
 * Configurações do evento — edite aqui.
 * FORM_URL: link do formulário de inscrição (Google Forms, Typeform, etc.).
 */
const CONFIG = {
  FORM_URL: "https://forms.gle/SEU-FORMULARIO-AQUI",
  EVENT_DATE: "A definir",
  EVENT_PLACE: "Martins/RN",
  CONTACT_EMAIL: "contato@exemplo.com",
};

document.querySelectorAll("[data-form-link]").forEach((link) => {
  link.href = CONFIG.FORM_URL;
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll("[data-event-date]").forEach((el) => (el.textContent = CONFIG.EVENT_DATE));
document.querySelectorAll("[data-event-place]").forEach((el) => (el.textContent = CONFIG.EVENT_PLACE));
document.querySelectorAll("[data-contact-email]").forEach((el) => {
  el.href = `mailto:${CONFIG.CONTACT_EMAIL}`;
  el.textContent = CONFIG.CONTACT_EMAIL;
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);
