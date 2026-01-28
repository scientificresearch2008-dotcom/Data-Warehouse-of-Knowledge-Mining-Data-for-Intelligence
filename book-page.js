// Tab Switching
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        // Remove active class from all tabs and panels
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        tabPanels.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-hidden', 'true');
        });

        // Add active class to clicked tab and corresponding panel
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');
        const panel = document.getElementById(targetTab);
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        // No mobile accordion behavior: keep desktop-like tabs active even on small screens
    });
});

// Keyboard Navigation for Tabs (Left/Right/Home/End)
tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', function (e) {
        let newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') newIndex = 0;
        if (e.key === 'End') newIndex = tabs.length - 1;
        if (newIndex !== null) {
            e.preventDefault();
            tabs[newIndex].focus();
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
        }
    });
});

// Mobile: transform tabs into accordion-like collapsible panels
function initMobileAccordion() {
    const mq = window.matchMedia('(max-width: 640px)');
    const isMobile = mq.matches;
    const tabsEl = document.querySelector('.tabs');

    document.querySelectorAll('.tab-panel').forEach(panel => {
        // Ensure body wrapper exists
        let header = panel.querySelector('.panel-header');
        let body = panel.querySelector('.panel-body');
        if (!body) {
            // Move panel children into a new body wrapper
            body = document.createElement('div');
            body.className = 'panel-body';
            while (panel.firstChild) {
                body.appendChild(panel.firstChild);
            }
            panel.appendChild(body);
            body.id = panel.id + '-body';
        }
        if (!header) {
            header = document.createElement('button');
            header.className = 'panel-header';
            const tabId = panel.id;
            const tabButton = document.querySelector(`.tab[data-tab="${tabId}"]`);
            const label = tabButton ? tabButton.textContent.trim() : 'Details';
            header.innerHTML = `<span>${label}</span><span class="chev">▾</span>`;
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', body.id);
            panel.insertBefore(header, body);
            header.addEventListener('click', function () {
                const expanded = header.getAttribute('aria-expanded') === 'true';
                if (!expanded) {
                    // close other panels
                    document.querySelectorAll('.panel-header').forEach(h => {
                        if (h !== header) {
                            h.setAttribute('aria-expanded', 'false');
                            const b = h.nextElementSibling;
                            if (b && b.classList.contains('panel-body')) b.classList.remove('active');
                        }
                    });
                }
                header.setAttribute('aria-expanded', (!expanded).toString());
                body.classList.toggle('active');
                if (!expanded) {
                    // ensure visible
                    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // set corresponding desktop tab active (so desktop state matches on resize)
                    const tabButton = document.querySelector(`.tab[data-tab="${panel.id}"]`);
                    if (tabButton) tabButton.click();
                }
            });
        }
    });

    // Open corresponding body for the active tab when initializing on mobile
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const panel = document.getElementById(activeTab.getAttribute('data-tab'));
        if (panel) {
            const body = panel.querySelector('.panel-body');
            const hdr = panel.querySelector('.panel-header');
            if (body && hdr) {
                body.classList.add('active');
                hdr.setAttribute('aria-expanded', 'true');
            }
        }
    }

    // Toggle between mobile and desktop behavior
    function handleChange() {
        const isNowMobile = mq.matches;
        document.querySelectorAll('.panel-header').forEach(h => h.style.display = isNowMobile ? 'flex' : 'none');
        document.querySelectorAll('.panel-body').forEach(b => b.style.display = isNowMobile ? (b.classList.contains('active') ? 'block' : 'none') : 'block');
        if (tabsEl) tabsEl.style.display = isNowMobile ? 'none' : 'flex';
    }
    handleChange();
    mq.addEventListener('change', handleChange);
}

// initMobileAccordion(); // disabled - we keep tabs visible on mobile (user requested)

// Buy Button - WhatsApp
const buyBtn = document.getElementById('buyBtn');
if (buyBtn) {
    buyBtn.addEventListener('click', function () {
        const message = encodeURIComponent('Hi! I would like to purchase "Data Warehouse of Knowledge: Mining Data for Intelligence"');
        const phoneNumber = '918754632888'; // +91 8754632888
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        showNotification('📱 Opening WhatsApp...');
    });
}

// Read More Authors Toggle
const readMoreAuthorsLink = document.getElementById('readMoreAuthors');
const moreAuthors = document.getElementById('moreAuthors');
if (readMoreAuthorsLink && moreAuthors) {
    let isExpanded = false;
    readMoreAuthorsLink.addEventListener('click', function (e) {
        e.preventDefault();
        isExpanded = !isExpanded;

        if (isExpanded) {
            moreAuthors.style.display = 'inline';
            this.textContent = 'Show less';
            this.setAttribute('aria-expanded', 'true');
        } else {
            moreAuthors.style.display = 'none';
            this.textContent = '+3 more';
            this.setAttribute('aria-expanded', 'false');
        }
    });
}

// Set ARIA states for read-more
if (readMoreAuthorsLink) {
    readMoreAuthorsLink.setAttribute('role', 'button');
    readMoreAuthorsLink.setAttribute('aria-expanded', 'false');
}

// Sample Button - Open PDF in Modal
const sampleBtn = document.getElementById('sampleBtn');
if (sampleBtn) {
    sampleBtn.addEventListener('click', function () {
        openPDFModal('first_25_pages.pdf');
        showNotification('📖 Opening sample pages...');
    });
}



// PDF Modal Functions
function openPDFModal(pdfPath) {
    // Check if modal exists, if not create it
    let modal = document.getElementById('pdfModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pdfModal';
        modal.className = 'pdf-modal';
        modal.innerHTML = `
            <div class="pdf-container">
                <div class="pdf-controls">
                    <a href="${pdfPath}" download="Designing_to_Mastering_Relational_Data_Architecture_Sample.pdf" class="pdf-btn">
                        <span style="font-size: 1.1rem">📥</span> Download
                    </a>
                    <button class="pdf-close" onclick="closePDFModal()">
                        <span style="font-size: 1.1rem">✕</span> Close
                    </button>
                </div>
                <div id="pdf-viewer-container" style="overflow-y: auto; flex: 1; background: #525659; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <div id="pdf-loading" style="color: white; font-size: 1.2rem;">Loading PDF...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closePDFModal();
            }
        });
    }

    modal.classList.add('active');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    // Render PDF using PDF.js
    renderPDF(pdfPath);

    // Trap focus inside modal
    trapFocus(modal);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

async function renderPDF(url) {
    const container = document.getElementById('pdf-viewer-container');
    const loading = document.getElementById('pdf-loading');

    // Clear previous content but keep loading indicator
    container.innerHTML = '';
    container.appendChild(loading);
    loading.style.display = 'block';

    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        loading.style.display = 'none';

        // Render all pages (it's a sample, so likely small enough)
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            // Calculate scale to fit width
            const containerWidth = container.clientWidth - 40; // minus padding
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = containerWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale: scale > 1.5 ? 1.5 : scale }); // Cap scale

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            canvas.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            canvas.style.maxWidth = '100%';

            container.appendChild(canvas);

            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            await page.render(renderContext).promise;
        }
    } catch (error) {
        console.error('Error rendering PDF:', error);
        loading.textContent = 'Error loading PDF. Please use the download button.';
    }
}

function closePDFModal() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        releaseFocusTrap();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closePDFModal();
    }
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
        max-width: 350px;
    `;

    if (!document.getElementById('notification-keyframes')) {
        const style = document.createElement('style');
        style.id = 'notification-keyframes';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    announceToLiveRegion(message);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Announce to screen reader live region
function announceToLiveRegion(message) {
    const live = document.getElementById('liveRegion');
    if (live) {
        live.textContent = '';
        setTimeout(() => {
            live.textContent = message;
        }, 100);
    }
}

// Book Cover Click to Zoom
const bookCover = document.getElementById('bookCover');
if (bookCover) {
    let isZoomed = false;
    bookCover.addEventListener('click', function () {
        isZoomed = !isZoomed;
        if (isZoomed) {
            this.style.transform = 'scale(1.5)';
            this.style.zIndex = '1000';
            this.style.position = 'relative';
            this.style.transition = 'transform 0.3s ease';
        } else {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        }
    });
}

// Thumbnail clicks open the lightbox at the corresponding index
document.querySelectorAll('.thumbnail-gallery img').forEach((img, idx, nodeList) => {
    img.addEventListener('click', function (e) {
        e.preventDefault();
        const gallery = Array.from(nodeList).map(i => i.src).filter(Boolean);
        openLightbox(gallery, idx);
    });
});

// Lightbox for multiple images (creates overlay on first use)
function openLightbox(images = [], startIndex = 0) {
    let lb = document.getElementById('lightboxModal');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'lightboxModal';
        lb.className = 'lightbox-modal';
        lb.innerHTML = `
            <div class="lightbox-content" role="dialog" aria-modal="true">
                <button class="lightbox-close" aria-label="Close image">✕</button>
                <button class="lightbox-nav left" aria-label="Previous">‹</button>
                <button class="lightbox-nav right" aria-label="Next">›</button>
                <img class="lightbox-img" src="" alt="Book image expanded" />
            </div>`;
        document.body.appendChild(lb);

        // Events
        const closeBtn = lb.querySelector('.lightbox-close');
        const leftBtn = lb.querySelector('.lightbox-nav.left');
        const rightBtn = lb.querySelector('.lightbox-nav.right');
        const imgEl = lb.querySelector('.lightbox-img');

        closeBtn.addEventListener('click', closeLightbox);
        lb.addEventListener('click', function (e) {
            if (e.target === lb) closeLightbox();
        });
        leftBtn.addEventListener('click', function () { navigateLightbox(-1); });
        rightBtn.addEventListener('click', function () { navigateLightbox(1); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
        // mobile swipe/touch
        let _lbStartX = null;
        const _onTouchStart = e => {
            if (e.touches && e.touches.length === 1) _lbStartX = e.touches[0].clientX;
        };
        const _onTouchEnd = e => {
            if (_lbStartX === null) return;
            const endX = (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || 0;
            const delta = endX - _lbStartX;
            const threshold = 50;
            if (delta > threshold) navigateLightbox(-1);
            if (delta < -threshold) navigateLightbox(1);
            _lbStartX = null;
        };
        lb._onTouchStart = _onTouchStart;
        lb._onTouchEnd = _onTouchEnd;
        lb.addEventListener('touchstart', _onTouchStart);
        lb.addEventListener('touchend', _onTouchEnd);
        // Store images on element for navigation
        lb._images = images;
        lb._index = startIndex;
    }
    lb.classList.add('active');
    updateLightboxImage(lb);
    trapFocus(lb);
}

function updateLightboxImage(lb) {
    const img = lb.querySelector('.lightbox-img');
    const images = lb._images || [];
    const idx = lb._index || 0;
    if (images.length === 0) return;
    img.src = images[idx];
}

function navigateLightbox(direction) {
    const lb = document.getElementById('lightboxModal');
    if (!lb) return;
    const len = (lb._images || []).length;
    lb._index = (lb._index + direction + len) % len;
    updateLightboxImage(lb);
}

function closeLightbox() {
    const lb = document.getElementById('lightboxModal');
    if (lb) {
        lb.classList.remove('active');
        releaseFocusTrap();
        if (lb._onTouchStart) {
            lb.removeEventListener('touchstart', lb._onTouchStart);
            lb.removeEventListener('touchend', lb._onTouchEnd);
            delete lb._onTouchStart;
            delete lb._onTouchEnd;
        }
    }
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.book-info, .quick-details, .author-profile, .chapter, .audience-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Collapsible chapters in Table of Contents
document.querySelectorAll('.chapter h3').forEach(h3 => {
    h3.setAttribute('role', 'button');
    h3.setAttribute('aria-expanded', 'true');
    h3.addEventListener('click', function () {
        const chapter = this.closest('.chapter');
        if (!chapter) return;
        chapter.classList.toggle('collapsed');
        const isCollapsed = chapter.classList.contains('collapsed');
        this.setAttribute('aria-expanded', (!isCollapsed).toString());
        showNotification(isCollapsed ? '🔽 Chapter collapsed' : '🔼 Chapter expanded');
    });
});

// Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ripple Effect for Buttons
document.querySelectorAll('.action-btn, .topic-tag').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        if (!document.getElementById('ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Page Load Animation
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Visual press state for clickable buttons
const addToCartBtn = document.getElementById('addCartBtn');
// In-case there is a button with id addCartBtn; we toggle 'added' class for visual feedback only (no cart UI)
document.querySelectorAll('.action-btn.primary, .action-btn.secondary').forEach(btn => {
    btn.addEventListener('mousedown', function () {
        this.classList.add('pressed');
    });
    btn.addEventListener('mouseup', function () {
        this.classList.remove('pressed');
    });
});

// Simple 'Add to Cart' behavior: If a button with class 'btn-add-cart' exists, increment counter.
document.querySelectorAll('.btn-add-cart').forEach(b => {
    b.addEventListener('click', function (e) {
        e.preventDefault();
        showNotification('✅ Added to cart (local preview)');
        // Visual feedback
        b.classList.add('added');
        setTimeout(() => b.classList.remove('added'), 1200);
    });
});

// Keyboard shortcuts: 'b' = Buy, 'r' = Read sample
document.addEventListener('keydown', function (e) {
    if (e.key === 'b' || e.key === 'B') {
        const buy = document.getElementById('buyBtn');
        if (buy) buy.click();
    }
    if (e.key === 'r' || e.key === 'R') {
        const sample = document.getElementById('sampleBtn');
        if (sample) sample.click();
    }
});

// Copy ISBN button removed by user request



// Lightbox open when clicking cover and gather gallery images
if (bookCover) {
    bookCover.style.cursor = 'zoom-in';
    bookCover.addEventListener('click', function () {
        // Collect gallery images if present (thumbnails inside .thumbnail-gallery) otherwise use the single image
        const gallery = Array.from(document.querySelectorAll('.thumbnail-gallery img')).map(i => i.src).filter(Boolean);
        const images = gallery.length ? gallery : [bookCover.src];
        openLightbox(images, 0);
    });
}

// Accessibility: focus trap implementation (simple)
let focusTrapEl = null;
let prevActiveElement = null;
function trapFocus(el) {
    if (!el) return;
    focusTrapEl = el;
    prevActiveElement = document.activeElement;
    const focusable = el.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    // Trap keyboard
    document.addEventListener('focus', enforceFocus, true);
}

function enforceFocus(e) {
    if (!focusTrapEl) return;
    const isInside = focusTrapEl.contains(e.target);
    if (!isInside) {
        e.stopPropagation();
        const focusable = focusTrapEl.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) focusable[0].focus();
    }
}

function releaseFocusTrap() {
    focusTrapEl = null;
    document.removeEventListener('focus', enforceFocus, true);
    if (prevActiveElement) prevActiveElement.focus();
}

// Copy to clipboard fallback for browsers lacking the clipboard API
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('🔖 ISBN copied to clipboard');
    } catch (err) {
        showNotification('⚠️ Copy failed');
    }
    document.body.removeChild(textArea);
}

// Interactive hover sound effect (optional - can be enabled)
function playHoverSound() {
    // Uncomment to enable subtle hover sounds
    // const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGJ0fPTgjMGHGm98+GYQQ==');
    // audio.volume = 0.1;
    // audio.play();
}

console.log('✅ Book Page Interactive Features Loaded');
console.log('🔗 WhatsApp: +91 8754632888');
console.log('📄 PDF Available:first_25_pages.pdf');

// Sticky Mobile CTA - bind to bottom bar actions
function createMobileCTA() {
    if (document.getElementById('mobileCta')) return;
    const cta = document.createElement('div');
    cta.id = 'mobileCta';
    cta.className = 'mobile-cta';
    cta.innerHTML = `
        <div class="cta-left">
            <div style="font-weight:700;font-size:0.95rem;color:var(--white);">Relational Data Architecture</div>
            <div style="font-size:0.9rem;color:rgba(255,255,255,0.9);">₹599</div>
        </div>
        <div class="cta-actions">
            <button class="action-btn secondary" id="cta-sample">Sample</button>
            <button class="action-btn primary" id="cta-buy">Buy</button>
        </div>
    `;
    document.body.appendChild(cta);
    const buy = document.getElementById('cta-buy');
    const sample = document.getElementById('cta-sample');
    if (buy) buy.addEventListener('click', () => { buyBtn.click(); });
    if (sample) sample.addEventListener('click', () => { sampleBtn.click(); });
}

// Initialize Mobile CTA when small
function updateCtaVisibility() {
    const mq = window.matchMedia('(max-width: 768px)');
    const ctaEl = document.getElementById('mobileCta');
    if (mq.matches && !ctaEl) createMobileCTA();
    if (ctaEl) ctaEl.style.display = mq.matches ? 'flex' : 'none';
}
updateCtaVisibility();
window.addEventListener('resize', updateCtaVisibility);

// Hover preview removed (only default blue theme is used)
