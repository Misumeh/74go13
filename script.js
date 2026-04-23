document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('packs-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allPacks = [];

    async function loadArchive() {
        try {
            const response = await fetch('data.json');
            allPacks = await response.json();
            renderPacks(allPacks);
        } catch (error) {
            console.error("Error loading JSON:", error);
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Could not load archive. Make sure data.json is valid.</p>`;
        }
    }

function renderPacks(packs) {
    grid.innerHTML = '';
    
    packs.forEach(pack => {
        const card = document.createElement('article');
        card.className = 'pack-card fade-in';
        
        // 1. Generate Gallery Images and Dots
        let galleryHTML = '';
        let dotsHTML = '';
        const hasMultipleImages = pack.gallery && pack.gallery.length > 1;

        if (pack.gallery && pack.gallery.length > 0) {
            pack.gallery.forEach((imgUrl, index) => {
                galleryHTML += `<img src="${imgUrl}" class="gallery-img" alt="${pack.character} preview" loading="lazy">`;
                if (hasMultipleImages) {
                    dotsHTML += `<span class="dot ${index === 0 ? 'active' : ''}"></span>`;
                }
            });
        }

        // 2. Generate Download Buttons (The fix is here)
        let downloadButtonsHTML = '';
        if (pack.links) {
            if (pack.links.legacy) {
                downloadButtonsHTML += `
                    <a href="${pack.links.legacy}" target="_blank" class="dl-link">
                        <i class="fa-solid fa-code-branch"></i> Java Legacy 1.8
                    </a>`;
            }
            if (pack.links.modern) {
                downloadButtonsHTML += `
                    <a href="${pack.links.modern}" target="_blank" class="dl-link">
                        <i class="fa-solid fa-cube"></i> Java Modern 1.20+
                    </a>`;
            }
            if (pack.links.bedrock) {
                downloadButtonsHTML += `
                    <a href="${pack.links.bedrock}" target="_blank" class="dl-link">
                        <i class="fa-solid fa-mobile-screen"></i> Bedrock Edition
                    </a>`;
            }
        }

        // 3. Assemble the Card
        card.innerHTML = `
            <div class="gallery-wrapper">
                ${hasMultipleImages ? `
                    <button class="nav-btn prev-btn" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="nav-btn next-btn" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
                    <div class="gallery-dots">${dotsHTML}</div>
                ` : ''}
                <div class="pack-gallery">
                    ${galleryHTML}
                </div>
            </div>
            <div class="pack-info">
                <h3>${pack.character}</h3>
                <div class="dl-group">
                    ${downloadButtonsHTML}
                </div>
            </div>
        `;

        // 4. Attach Navigation Logic for Multi-Image Packs
        if (hasMultipleImages) {
            const gallery = card.querySelector('.pack-gallery');
            const dots = card.querySelectorAll('.dot');
            
            card.querySelector('.next-btn').onclick = () => {
                gallery.scrollBy({ left: gallery.offsetWidth, behavior: 'smooth' });
            };
            
            card.querySelector('.prev-btn').onclick = () => {
                gallery.scrollBy({ left: -gallery.offsetWidth, behavior: 'smooth' });
            };

            // Sync dots with manual scroll/swipe
            gallery.onscroll = () => {
                const scrollIndex = Math.round(gallery.scrollLeft / gallery.offsetWidth);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === scrollIndex);
                });
            };
        }

        grid.appendChild(card);
    });
}

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            if (filter === 'all') {
                renderPacks(allPacks);
            } else {
                const filtered = allPacks.filter(p => p.versions.includes(filter));
                renderPacks(filtered);
            }
        });
    });

    loadArchive();
});