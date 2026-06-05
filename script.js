(function () {
  const data = window.SITE_DATA;

  const externalAttrs = (href) => {
    const isExternal = /^https?:\/\//i.test(href);
    return isExternal ? ' target="_blank" rel="noreferrer"' : "";
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const profile = data.profile;
  document.getElementById("profile-quote").textContent = profile.quote;
  document.getElementById("profile-avatar").src = profile.avatar;
  document.getElementById("about-title").textContent = profile.welcome;
  document.getElementById("profile-intro").innerHTML = profile.intro
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  document.getElementById("research-tags").innerHTML = profile.tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  document.getElementById("contact-list").innerHTML = [
    `<li><span aria-hidden="true">✉</span><a href="mailto:${profile.email}">${profile.email}</a></li>`,
    `<li><span aria-hidden="true">in</span><a href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a></li>`
  ].join("");

  const publicationList = document.getElementById("publication-list");
  publicationList.innerHTML = data.publications.map((item, index) => {
    const actions = [
      item.links.paper && `<a href="${item.links.paper}"${externalAttrs(item.links.paper)}><span aria-hidden="true">▧</span> Paper</a>`,
      item.links.website && `<a href="${item.links.website}"${externalAttrs(item.links.website)}><span aria-hidden="true">◎</span> Website</a>`,
      item.links.video && `<a href="${item.links.video}"${externalAttrs(item.links.video)}><span aria-hidden="true">▷</span> Video</a>`,
      `<button class="link-button" data-bibtex="${index}"><span aria-hidden="true">{}</span> BibTeX</button>`
    ].filter(Boolean).join("");

    return `
      <article class="publication-row">
        <img src="${item.thumbnail}" alt="" class="publication-thumb">
        <div class="row-copy">
          <h3>${escapeHtml(item.title)}</h3>
          <p class="authors">${escapeHtml(item.authors)}</p>
          <p>${escapeHtml(item.venue)}</p>
          ${item.award ? `<p class="award"><span aria-hidden="true">✦</span> ${escapeHtml(item.award)}</p>` : ""}
        </div>
        <div class="row-actions">${actions}</div>
      </article>
    `;
  }).join("");

  const projectList = document.getElementById("project-list");
  projectList.innerHTML = data.projects.map((item) => `
    <article class="project-row">
      <div class="project-media">
        <img src="${item.wideImage}" alt="" class="project-wide">
        <span class="project-square-wrap ${item.squareMediaType === "video" ? "is-video" : ""}">
          <img src="${item.squareImage}" alt="" class="project-square">
        </span>
      </div>
      <div class="row-copy">
        <h3>${escapeHtml(item.title)} <span>${escapeHtml(item.date)}</span></h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="row-actions">
        <a href="${item.website}"${externalAttrs(item.website)}>Website <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `).join("");

  const blogList = document.getElementById("blog-list");
  blogList.innerHTML = data.blog.map((item) => `
    <article class="blog-card">
      <a href="${item.link}">
        <img src="${item.thumbnail}" alt="">
        <h3>${escapeHtml(item.title)}</h3>
      </a>
      <p>${escapeHtml(item.date)}</p>
    </article>
  `).join("");

  const miscList = document.getElementById("misc-list");
  miscList.innerHTML = data.misc.map((item) => `
    <article class="misc-item">
      <span class="misc-icon" aria-hidden="true">${item.icon}</span>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </article>
  `).join("");

  document.getElementById("copyright-year").textContent = new Date().getFullYear();

  const modal = document.getElementById("bibtex-modal");
  const bibtexContent = document.getElementById("bibtex-content");
  publicationList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bibtex]");
    if (!button) return;
    const item = data.publications[Number(button.dataset.bibtex)];
    bibtexContent.textContent = item.bibtex;
    modal.showModal();
  });

  document.getElementById("copy-bibtex").addEventListener("click", async (event) => {
    try {
      await navigator.clipboard.writeText(bibtexContent.textContent);
      event.currentTarget.textContent = "Copied";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(bibtexContent);
      selection.removeAllRanges();
      selection.addRange(range);
      event.currentTarget.textContent = "Selected";
    }
  });
})();
