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

  const renderSquareMedia = (item) => {
    const isVideo = item.squareMediaType === "video";
    const imageSrc = item.squareImage || item.thumbnail || item.wideImage;
    const media = `
      <span class="row-square-wrap ${isVideo ? "is-video" : ""}">
        <img src="${imageSrc}" alt="" class="row-square">
      </span>
    `;

    return item.squareLink
      ? `<a class="row-square-link" href="${item.squareLink}"${externalAttrs(item.squareLink)} aria-label="Open media for ${escapeHtml(item.title)}">${media}</a>`
      : media;
  };

  const profile = data.profile;
  document.getElementById("profile-quote").textContent = profile.quote;
  document.getElementById("profile-avatar").src = profile.avatar;
  document.getElementById("about-title").textContent = profile.welcome;
  document.getElementById("profile-intro").innerHTML = profile.intro
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  document.getElementById("research-tags").innerHTML = profile.tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  document.getElementById("contact-list").innerHTML = [
    `<li><span aria-hidden="true">✉</span><a href="mailto:${profile.email}">${profile.email}</a></li>`,
    `<li><span aria-hidden="true">in</span><a href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a></li>`,
    profile.cv && `<li><span aria-hidden="true">CV</span><a href="${profile.cv}">CV</a></li>`
  ].filter(Boolean).join("");

  const publicationList = document.getElementById("publication-list");
  publicationList.innerHTML = data.publications.map((item, index) => {
    const links = item.links || {};
  
    const actions = [
      links.paper && `<a href="${links.paper}"${externalAttrs(links.paper)}><span aria-hidden="true">📄</span> Paper</a>`,
      links.poster && `<a href="${links.poster}"${externalAttrs(links.poster)}><span aria-hidden="true">📄</span> Poster</a>`,
      links.website && `<a href="${links.website}"${externalAttrs(links.website)}><span aria-hidden="true">🔗</span> Website</a>`,
      item.bibtex && `<button class="link-button" data-bibtex="${index}"><span aria-hidden="true">{}</span> BibTeX</button>`
    ].filter(Boolean).join("");
  
    return `
      <article class="publication-row">
        <div class="row-media">
          <img src="${item.thumbnail}" alt="" class="row-wide">
          ${renderSquareMedia(item)}
        </div>
        <div class="row-copy">
          <h3>${escapeHtml(item.title)}</h3>
          <p class="authors">${escapeHtml(item.authors)}</p>
          <p>${escapeHtml(item.venue)}</p>
          ${item.award ? `<p class="award"><span aria-hidden="true">🏅</span> ${escapeHtml(item.award)}</p>` : ""}
        </div>
        <div class="row-actions">${actions}</div>
      </article>
    `;
  }).join("");

  const projectList = document.getElementById("project-list");
  projectList.innerHTML = data.projects.map((item) => `
    <article class="project-row">
      <div class="row-media">
        <img src="${item.wideImage}" alt="" class="row-wide">
        ${renderSquareMedia(item)}
      </div>
      <div class="row-copy">
        <h3>${escapeHtml(item.title)} <span>${escapeHtml(item.date)}</span></h3>
        <p class="authors">${escapeHtml(item.authors || "Yu Liu")}</p>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="row-actions">
        <a href="${item.website}"${externalAttrs(item.website)}><span aria-hidden="true">🔗</span> Website <span aria-hidden="true">↗</span></a>
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
