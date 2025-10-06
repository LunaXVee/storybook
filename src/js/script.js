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
        showCover: false,
        mobileScrollSupport: false
    });

    // Load pages
    const pages = document.querySelectorAll(".page");
    pageFlip.loadFromHTML(pages);
    
    document.querySelector(".page-total").innerText = pageFlip.getPageCount();
    document.querySelector(".page-orientation").innerText = pageFlip.getOrientation();

    // Navigation buttons
    document.querySelector(".btn-prev").addEventListener("click", () => {
        pageFlip.flipPrev();
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        pageFlip.flipNext();
    });

    // Update page counter
    function updateControls() {
        const currentPage = pageFlip.getCurrentPageIndex();
        document.querySelector(".page-current").innerText = currentPage + 1;
    }

    // Parallax effect during page flip
    pageFlip.on("flip", (e) => {
        console.log('Page flipping to:', e.data);
        updateControls();
        
        // Animate parallax layers on the current spread
        const allPages = document.querySelectorAll(".page-layered");
        
        allPages.forEach((page, index) => {
            const layers = page.querySelectorAll(".parallax-layer");
            
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                
                // Determine direction based on page position
                const isLeftPage = index % 2 === 0;
                const moveDistance = isLeftPage ? -80 : 80;
                
                gsap.to(layer, {
                    x: moveDistance * speed,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        });
    });

    // Reset parallax when flip completes
    pageFlip.on("changeState", (e) => {
        document.querySelector(".page-state").innerText = e.data;
        
        if (e.data === "read") {
            console.log('Flip complete, resetting parallax');
            // Reset all parallax layers
            const allLayers = document.querySelectorAll(".parallax-layer");
            gsap.to(allLayers, {
                x: 0,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }
    });

    pageFlip.on("changeOrientation", (e) => {
        document.querySelector(".page-orientation").innerText = e.data;
    });

    console.log('Flipbook initialized!');
});