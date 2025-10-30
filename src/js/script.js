// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing flipbook...');
    
    const bookElement = document.getElementById("demoBookExample");
    
    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,
        height: 533,
        size: "fixed",
        minWidth: 315,
        maxWidth: 800,
        minHeight: 420,
        maxHeight: 1066,
        maxShadowOpacity: 0.5,
        showCover: true,  // CHANGED: Set to true to enable cover mode
        startPage: 0,     // ADDED: Start at page 0 (the front cover)
        mobileScrollSupport: false
    });

    // Load pages
    const pages = document.querySelectorAll(".page");
    pageFlip.loadFromHTML(pages);
    
    // Initialize parallax layer positions
    const allLayers = document.querySelectorAll(".parallax-layer");
    allLayers.forEach(layer => {
        gsap.set(layer, { x: 50 }); // Start at right
    });
    
    document.querySelector(".page-total").innerText = pageFlip.getPageCount();
    document.querySelector(".page-orientation").innerText = pageFlip.getOrientation();

    // Track flip direction
    let isFlippingNext = true;

    // Navigation buttons
    document.querySelector(".btn-prev").addEventListener("click", () => {
        isFlippingNext = false;
        pageFlip.flipPrev();
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        isFlippingNext = true;
        pageFlip.flipNext();
    });

    // Update page counter
    function updateControls() {
        const currentPage = pageFlip.getCurrentPageIndex();
        document.querySelector(".page-current").innerText = currentPage + 1;
    }

    pageFlip.on("flip", (e) => {
        console.log('Flip starting');
        updateControls();
    });

    // This should fire during the flip animation
    pageFlip.on("changeState", (e) => {
        document.querySelector(".page-state").innerText = e.data;
        console.log('State:', e.data);
        
        if (e.data === "flipping" || e.data === "fold_corner") {
            // Page is actively flipping - animate based on direction
            animateParallaxDuringFlip(isFlippingNext);
        } 
    });

    function animateParallaxDuringFlip(movingForward) {
        const allLayers = document.querySelectorAll(".parallax-layer");
        
        allLayers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            
            // Get current x position
            const currentX = gsap.getProperty(layer, "x") || 50;
            
            // Move left when going forward (next), right when going back (prev)
            const direction = movingForward ? -1 : 1;
            
            gsap.to(layer, {
                x: currentX + (direction * 50 * speed),
                duration: 1,
                ease: "none"
            });
        });
    }

    pageFlip.on("changeOrientation", (e) => {
        document.querySelector(".page-orientation").innerText = e.data;
    });

    console.log('Flipbook initialized!');
});