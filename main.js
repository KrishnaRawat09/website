// BHARAT FINCARE - 3D EXPERIENCE ENGINE
// Focus: Performance, Elegance, "Data Stream" Aesthetic

const canvas = document.querySelector('#webgl-canvas');

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002); // Dark fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Smoother edges
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- PARTICLES: "DATA STREAM" ---
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);
const randomArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
    randomArray[i] = (Math.random() - 0.5);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const getTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 32, 32);
    const t = new THREE.Texture(canvas);
    t.needsUpdate = true;
    return t;
};

const material = new THREE.PointsMaterial({
    size: 0.5,
    map: getTexture(),
    transparent: true,
    opacity: 0.8,
    color: 0xf97316,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// --- INTERACTION ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    particlesMesh.rotation.y += 0.02 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.02 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.z = elapsedTime * 0.02;

    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime + positions[i3]) * 0.02;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- PRELOADER SEQUENCE (OPTIMIZED < 2s) ---
// --- PRELOADER SEQUENCE (OPTIMIZED < 2s) ---
window.addEventListener('load', () => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('site_visited');

    if (hasVisited) {
        // Skip preloader
        document.body.classList.add('no-transition'); // Disable transitions for instant load
        document.body.classList.add('loaded');

        // Hide preloader immediately
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }

        // Run typing immediately
        runTypingSequence();

        // Restore transitions after brief delay
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);

    } else {
        // First visit: Run full animation
        sessionStorage.setItem('site_visited', 'true');

        const totalFrames = 8;
        let currentFrame = 1;
        // Slow Reveal: 400ms * 8 = 3200ms (3.2s)
        const frameInterval = 400;

        const sequenceInterval = setInterval(() => {
            if (currentFrame > 1) {
                const prev = document.getElementById(`frame-${currentFrame - 1}`);
                if (prev) prev.classList.remove('active');
            }

            const curr = document.getElementById(`frame-${currentFrame}`);
            if (curr) curr.classList.add('active');

            currentFrame++;

            if (currentFrame > totalFrames) {
                clearInterval(sequenceInterval);

                // Wait brief moment then show logo
                setTimeout(() => {
                    const last = document.getElementById(`frame-${totalFrames}`);
                    if (last) last.classList.remove('active');

                    const brandContainer = document.getElementById('final-brand');
                    brandContainer.classList.add('visible');

                    const logoImg = brandContainer.querySelector('.preloader-logo');
                    if (logoImg) logoImg.classList.add('logo-wipe');

                    const progressBar = brandContainer.querySelector('.loading-progress');
                    if (progressBar) progressBar.classList.add('progress-animate');

                    // Finish loading: Wait 1.5s for logo to fully wipe/read
                    setTimeout(() => {
                        document.body.classList.add('loaded');
                        // Start Typing immediately after load
                        runTypingSequence();
                    }, 1500);

                }, frameInterval);
            }
        }, frameInterval);
    }
});

// --- FLOATING DRAWER LOGIC ---
const drawer = document.getElementById('contact-drawer');
const trigger = document.getElementById('contact-trigger');
const closeBtn = document.getElementById('drawer-close');

if (trigger) trigger.addEventListener('click', () => drawer.classList.add('open'));
if (closeBtn) closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('open')) {
        if (!drawer.contains(e.target) && !trigger.contains(e.target)) {
            drawer.classList.remove('open');
        }
    }
});

// --- HERO TYPING ANIMATION (Polished Speeds) ---
const typeText = (elementId, text, speed = 30) => {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) { resolve(); return; }
        element.style.opacity = '1';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
};

const runTypingSequence = async () => {
    // Clear elements just in case
    ['hero-line1-text', 'hero-line1-gradient', 'hero-line2-text', 'hero-line2-gradient', 'hero-subtitle'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    // Polished Speeds: 20ms (standard), 35ms (emphasis)
    await typeText('hero-line1-text', 'We Handle the ', 20);
    await typeText('hero-line1-gradient', 'Operations', 35);
    await typeText('hero-line2-text', 'You Handle the ', 20);
    await typeText('hero-line2-gradient', 'Growth', 35);

    const dot = document.getElementById('hero-dot');
    if (dot) {
        dot.style.opacity = '1';
        dot.classList.add('blink');
    }

    const subtitleText = "The invisible engine behind India's fastest-growing NBFCs. From field verification to back-office processing, we are your boots on the ground.";
    await typeText('hero-subtitle', subtitleText, 12);

    const buttons = document.getElementById('hero-buttons');
    if (buttons) buttons.classList.add('visible');
};

// --- ANIMATION OBSERVERS & SPLIT TEXT ---
const splitTextToWords = (selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        if (el.querySelector('.word-zoom')) return;
        const words = text.split(' ');
        el.innerHTML = words.map(word => `<span class="word-zoom">${word}</span>`).join(' ');
    });
};

const initAdvancedAnimations = () => {
    splitTextToWords('#who-we-are .section-text');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Word Zoom
                if (target.classList.contains('word-zoom')) {
                    target.classList.add('in-view');
                }
                // Cards Stagger (Slower stagger: 0.15s)
                else if (target.classList.contains('card')) {
                    const parent = target.parentElement;
                    const index = Array.from(parent.children).indexOf(target);
                    target.style.transitionDelay = `${index * 0.15}s`;
                    target.classList.add('in-view');
                    observer.unobserve(target);
                }
                // Swipe Reveal Titles
                else if (target.classList.contains('swipe-reveal-text')) {
                    if (target.children.length === 0) {
                        const t = target.textContent;
                        target.innerHTML = `<span>${t}</span>`;
                    }
                    setTimeout(() => target.classList.add('in-view'), 50);
                    observer.unobserve(target);
                }
                // Flow Stagger Pop-up
                else if (target.classList.contains('flow-animate')) {
                    // Logic handled by separate observer for stagger
                    observer.unobserve(target);
                }
            }
        });
    }, observerOptions);

    // Observe "Who We Are" text containers (Wave stagger: 40ms)
    const sections = document.querySelectorAll('#who-we-are .section-text');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const words = entry.target.querySelectorAll('.word-zoom');
                words.forEach((word, i) => {
                    setTimeout(() => {
                        word.classList.add('in-view');
                    }, i * 40);
                });
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(s => sectionObserver.observe(s));

    // Observe Cards (What We Do only)
    const cards = document.querySelectorAll('#what-we-do .card');
    cards.forEach(card => observer.observe(card));

    // Observe Flow Items (Stagger: 200ms)
    const flowItems = document.querySelectorAll('.flow-animate');
    const flowObserver = new IntersectionObserver((entries) => {
        let visibleCount = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, visibleCount * 200);
                visibleCount++;
                flowObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    flowItems.forEach(item => flowObserver.observe(item));

    // Observe Titles
    const titles = document.querySelectorAll('.swipe-reveal-text');
    titles.forEach(t => observer.observe(t));
};

window.addEventListener('load', () => {
    // runTypingSequence is called inside the preloader finish callback to sync perfectly
    initAdvancedAnimations();
});
