class ExhibitionSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.sliderTrack = document.getElementById('sliderTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');
        this.slideInterval = null;

        this.init();
    }

    async init() {
        await this.fetchAndCreateCards();
        this.slides = document.querySelectorAll('.exhibition-card');
        this.totalSlides = this.slides.length;

        if (this.totalSlides === 0) return;

        this.createIndicators();
        this.updateSlider();
        this.bindEvents();
        this.startAutoSlide();
    }

    async fetchAndCreateCards() {
        try {
            const response = await fetch('http://localhost/wordpress/wp-json/wp/v2/posts');
            const posts = await response.json();

            posts.forEach(post => {
                const contentEl = document.createElement('div');
                contentEl.innerHTML = post.content.rendered;

                const img = contentEl.querySelector('img');
                const type = contentEl.querySelector('blockquote h2')?.textContent || '';
                const description = contentEl.querySelector('blockquote h3')?.textContent || '';

                const card = document.createElement('div');
                card.className = 'exhibition-card';
                card.innerHTML = `
                    <div class="exhibition-image">
                        ${img ? `<img src="${img.src}" style="object-fit: cover; width:100%; height:100%;" alt="${img.alt || 'Exhibition image'}" />` : ''}
                    </div>
                    <div class="exhibition-content">
                        <div class="exhibition-meta">
                            <div class="contact-icon"></div>
                            <span>${type}</span>
                        </div>
                        <h3 class="exhibition-title">${post.title.rendered}</h3>
                        <p class="exhibition-description">${description}</p>
                    </div>
                `;
                this.sliderTrack.appendChild(card);
            });
        } catch (error) {
            console.error('Failed to fetch exhibition posts:', error);
        }
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateSlider() {
        const cardWidth = 430;
        const offset = -this.currentSlide * cardWidth;
        this.sliderTrack.style.transform = `translateX(${offset}px)`;

        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    goToSlide(slideIndex) {
        this.currentSlide = Math.max(0, Math.min(slideIndex, this.totalSlides - 1));
        this.updateSlider();
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlider();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlider();
        }
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.nextBtn.addEventListener('mouseover', () => this.resetAutoSlide());
        this.nextBtn.addEventListener('mouseleave', () => this.startAutoSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.prevBtn.addEventListener('mouseover', () => this.resetAutoSlide());
        this.prevBtn.addEventListener('mouseleave', () => this.startAutoSlide());

        this.sliderTrack.addEventListener('mouseover', () => this.resetAutoSlide());
        this.sliderTrack.addEventListener('mouseleave', () => this.startAutoSlide());

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.resetAutoSlide();
        });

        this.sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.sliderTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
            }

            this.startAutoSlide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.resetAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.resetAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            }
        });
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.goToSlide(0);
            }
        }, 5000);
    }

    resetAutoSlide() {
        clearInterval(this.slideInterval);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ExhibitionSlider();
});
