// Database Fetch
async function fetchPacks() {
    try {
        const response = await fetch('packs.json');
        return await response.json();
    } catch (error) {
        console.error("Error loading packs:", error);
        return null;
    }
}

// Render Gallery
function renderIndex(packs) {
    const sfwGrid = document.getElementById('sfw-grid');
    const nsfwGrid = document.getElementById('nsfw-grid');
    
    packs.forEach(pack => {
        const isNSFW = pack.type === 'nsfw';
        const card = document.createElement('a');
        card.href = `pack.html?id=${pack.id}`;
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">
                ${isNSFW ? '<span class="nsfw-tag">18+</span>' : ''}
                <img src="${pack.images.main}" class="${isNSFW ? 'blur-nsfw' : ''}">
            </div>
            <div class="card-info">${pack.name}</div>
        `;
        (isNSFW ? nsfwGrid : sfwGrid).appendChild(card);
    });
}

// Hero Slideshow
function initHeroSlideshow(packs) {
    const slider = document.getElementById('hero-bg-slider');
    const images = packs.filter(p => p.type === 'sfw').map(p => p.images.main);
    let i = 0;
    if (images.length === 0) return;
    const next = () => {
        slider.style.backgroundImage = `url('${images[i]}')`;
        i = (i + 1) % images.length;
    };
    next();
    setInterval(next, 5000);
}

// Render Details Page
function renderPackDetails(packs, id) {
    const pack = packs.find(p => p.id === id);
    const container = document.getElementById('pack-content');
    if (!pack) return;

    const isNSFW = pack.type === 'nsfw';

    container.innerHTML = `
        <div class="pack-split">
            <div class="dl-section">
                <div>
                    ${isNSFW ? '<span class="badge-tag" style="color:var(--nsfw)">Restricted Content</span>' : ''}
                    <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.1;">${pack.name}</h1>
                </div>

                <div class="dl-card">
                    <h3 style="margin-bottom: 1.5rem">Download Files</h3>
                    ${isNSFW ? `
                        <a href="${pack.patreon_link}" class="dl-btn patreon">Unlock via Patreon</a>
                        <p style="font-size: 0.8rem; color: var(--text-dim); text-align: center;">This archive is preserved for Patreon supporters.</p>
                    ` : `
                        <a href="${pack.downloads.java_modern}" class="dl-btn">Java Edition (Modern)</a>
                        <a href="${pack.downloads.java_legacy}" class="dl-btn">Java Edition (1.8)</a>
                        <a href="${pack.downloads.bedrock}" class="dl-btn">Bedrock Edition</a>
                    `}
                </div>

                <div class="install-guide">
                    <h3 style="margin-bottom: 1.5rem">Installation</h3>
                    <div class="step-item"><b>Step 01</b> Download the file matching your game version.</div>
                    <div class="step-item"><b>Step 02</b> Place the .zip in your <i>resourcepacks</i> folder.</div>
                    <div class="step-item"><b>Step 03</b> Enable the pack in your in-game settings.</div>
                </div>
            </div>

            <div class="preview-col">
                <img src="${pack.images.main}" class="${isNSFW ? 'blur-nsfw' : ''}">
                ${pack.images.inventory ? `<img src="${pack.images.inventory}" title="Inventory View">` : ''}
            </div>
        </div>
    `;
}   