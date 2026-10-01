const grid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.getElementById("filterButtons");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const projectTotal = document.getElementById("projectTotal");

let activeFilter = "Todos";

const normalize = (value) =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getDomain = (url) =>
  new URL(url).hostname.replace("www.", "");

function previewA(url) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
}

function previewB(url) {
  return `https://image.thum.io/get/width/1200/crop/675/noanimate/${url}`;
}

function previewC(url) {
  return `https://mini.s-shot.ru/1366x768/JPEG/1366/Z100/?${url}`;
}

function projectCard(project, index) {
  return `
    <article class="project-card">
      <div class="project-preview">
        <div class="browser-chrome">
          <span></span><span></span><span></span>
          <strong>${getDomain(project.url)}</strong>
        </div>

        <div class="preview-fallback fallback-${(index % 5) + 1}">
          <span class="fallback-code">${project.code}</span>
          <strong>${project.name}</strong>
          <small>${project.category}</small>
        </div>

        <img
          class="preview-image"
          src="${previewA(project.url)}"
          data-step="1"
          data-b="${previewB(project.url)}"
          data-c="${previewC(project.url)}"
          alt="Vista previa de ${project.name}"
          loading="lazy"
          referrerpolicy="no-referrer"
        />

        <div class="preview-overlay"></div>

        <div class="preview-badges">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span class="category">${project.category}</span>
        </div>
      </div>

      <div class="project-content">
        <div class="project-meta">
          <span class="project-code">${project.code}</span>
          <h3>${project.name}</h3>
          <span class="domain">${getDomain(project.url)}</span>
        </div>

        <p class="project-description">${project.description}</p>

        <div class="participation">
          <span class="participation-title">Mi participación</span>
          <ul>
            ${project.participation.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>

        <div class="project-footer">
          <div class="project-tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>

          <a class="project-link" href="${project.url}" target="_blank" rel="noopener noreferrer">
            Ver proyecto
            <span>↗</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

function setupPreviewFallbacks() {
  const images = document.querySelectorAll(".preview-image");

  images.forEach((image) => {
    image.addEventListener("error", function () {
      const step = this.dataset.step;

      if (step === "1") {
        this.dataset.step = "2";
        this.src = this.dataset.b;
        return;
      }

      if (step === "2") {
        this.dataset.step = "3";
        this.src = this.dataset.c;
        return;
      }

      this.style.display = "none";
    });
  });
}

function renderProjects() {
  const query = normalize(searchInput.value.trim());

  const filtered = PROJECTS.filter(project => {
    const matchesFilter = activeFilter === "Todos" || project.category === activeFilter;

    const searchable = normalize(
      `${project.name} ${project.category} ${project.description} ${project.participation.join(" ")} ${project.tags.join(" ")}`
    );

    return matchesFilter && (!query || searchable.includes(query));
  });

  grid.innerHTML = filtered.map(projectCard).join("");
  setupPreviewFallbacks();

  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "proyecto" : "proyectos"}`;
  emptyState.hidden = filtered.length !== 0;
}

filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  renderProjects();
});

searchInput.addEventListener("input", renderProjects);

projectTotal.textContent = PROJECTS.length;
document.getElementById("year").textContent = `© ${new Date().getFullYear()} Jonathan Veloz`;

renderProjects();
