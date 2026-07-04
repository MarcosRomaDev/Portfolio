// ==========================================================
// Partículas de fondo
// ==========================================================
function createParticles(count) {
  const container = document.getElementById("particles");
  const colors = ["#ffffff", "#ff9d57", "#4fd1ff"];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");

    const size = Math.random() * 3 + 2; // 2px - 5px
    const duration = Math.random() * 10 + 10; // 10s - 20s
    const color = colors[Math.floor(Math.random() * colors.length)];
    const drift = Math.random() * 36 - 18; // -18px a 18px

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--particle-color", color);
    particle.style.setProperty("--particle-drift", `${drift}px`);
    particle.style.setProperty("--particle-duration", `${duration}s`);
    // Delay negativo: la animación arranca "a mitad de ciclo",
    // así el campo ya está vivo al cargar en vez de aparecer de golpe.
    particle.style.setProperty("--particle-delay", `${-Math.random() * duration}s`);

    container.appendChild(particle);
  }
}

// ==========================================================
// Parallax: los orbes siguen al ratón y al scroll con suavizado.
// Cada frame acercamos el valor actual al objetivo un pequeño
// porcentaje (lerp): eso da el movimiento amortiguado, sin tirones.
// ==========================================================
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

let mouseX = 0; // objetivo, de -1 (izquierda) a 1 (derecha)
let mouseY = 0; // objetivo, de -1 (arriba) a 1 (abajo)
let mx = 0; // valores suavizados que ve el CSS
let my = 0;
let sy = 0;

window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

function animateParallax() {
  mx += (mouseX - mx) * 0.04;
  my += (mouseY - my) * 0.04;
  sy += (window.scrollY - sy) * 0.08;

  const root = document.documentElement.style;
  root.setProperty("--mx", mx.toFixed(3));
  root.setProperty("--my", my.toFixed(3));
  root.setProperty("--sy", sy.toFixed(1));

  requestAnimationFrame(animateParallax);
}

// En móvil bajamos la cantidad: menos GPU, batería y pantalla más pequeña.
// Mismo breakpoint que el CSS para que estilos y lógica vayan a la par.
const isMobile = window.matchMedia("(max-width: 768px)").matches;
createParticles(isMobile ? 10 : 28);
if (!reduceMotion) {
  animateParallax();
}

// ==========================================================
// Navbar: cristal al hacer scroll + enlace de sección activa
// ==========================================================
const header = document.getElementById("header");
const navLinks = document.querySelectorAll("#header nav ul a");
const sections = document.querySelectorAll("section[id], footer[id]");

function updateNav() {
  header.classList.toggle("scrolled", window.scrollY > 40);

  // Sección activa: la última cuyo inicio ya ha pasado la mitad de la pantalla
  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - window.innerHeight / 2) {
      currentId = section.id;
    }
  });

  // El footer es demasiado bajo para llegar a cruzar la mitad de la
  // pantalla: si el scroll ha tocado fondo, lo activamos directamente.
  const bottom = window.innerHeight + window.scrollY;
  if (bottom >= document.documentElement.scrollHeight - 2) {
    currentId = "footer";
  }

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + currentId,
    );
  });
}

window.addEventListener("scroll", updateNav);
updateNav();
