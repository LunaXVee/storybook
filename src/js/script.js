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
    
    // Safely update page total and orientation if elements exist
    const pageTotalElement = document.querySelector(".page-total");
    const pageOrientationElement = document.querySelector(".page-orientation");
    
    if (pageTotalElement) {
        pageTotalElement.innerText = pageFlip.getPageCount();
    }
    if (pageOrientationElement) {
        pageOrientationElement.innerText = pageFlip.getOrientation();
    }

    // Track flip direction
    let isFlippingNext = true;

    // Get arrow buttons
    const leftArrow = document.querySelector(".nav-arrow-left");
    const rightArrow = document.querySelector(".nav-arrow-right");

    // Check if arrows exist before adding functionality
    if (!leftArrow || !rightArrow) {
        console.error("Arrow buttons not found in HTML!");
        return;
    }

    // Function to update arrow states
    function updateArrowStates() {
        const currentPage = pageFlip.getCurrentPageIndex();
        const totalPages = pageFlip.getPageCount();
        
        // Disable left arrow on first page
        if (currentPage === 0) {
            leftArrow.disabled = true;
            leftArrow.style.opacity = "0.3";
            leftArrow.style.cursor = "not-allowed";
        } else {
            leftArrow.disabled = false;
            leftArrow.style.opacity = "1";
            leftArrow.style.cursor = "pointer";
        }
        
        // Disable right arrow on last page
        if (currentPage >= totalPages - 1) {
            rightArrow.disabled = true;
            rightArrow.style.opacity = "0.3";
            rightArrow.style.cursor = "not-allowed";
        } else {
            rightArrow.disabled = false;
            rightArrow.style.opacity = "1";
            rightArrow.style.cursor = "pointer";
        }
    }

    // Navigation buttons (original) - only if they exist
    const btnPrev = document.querySelector(".btn-prev");
    const btnNext = document.querySelector(".btn-next");
    
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            isFlippingNext = false;
            pageFlip.flipPrev();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            isFlippingNext = true;
            pageFlip.flipNext();
        });
    }

    // Arrow navigation
    leftArrow.addEventListener("click", () => {
        console.log("Left arrow clicked!");
        console.log("Left arrow disabled?", leftArrow.disabled);
        
        if (!leftArrow.disabled) {
            console.log("Attempting to flip previous...");
            isFlippingNext = false;
            pageFlip.flipPrev();
            
            // Add animation feedback
            leftArrow.style.transform = "translateY(-50%) scale(0.9)";
            setTimeout(() => {
                leftArrow.style.transform = "translateY(-50%)";
            }, 200);
        } else {
            console.log("Left arrow is disabled, cannot flip.");
        }
    });

    rightArrow.addEventListener("click", () => {
        console.log("Right arrow clicked!");
        console.log("Right arrow disabled?", rightArrow.disabled);
        
        if (!rightArrow.disabled) {
            console.log("Attempting to flip next...");
            isFlippingNext = true;
            pageFlip.flipNext();
            
            // Add animation feedback
            rightArrow.style.transform = "translateY(-50%) scale(0.9)";
            setTimeout(() => {
                rightArrow.style.transform = "translateY(-50%)";
            }, 200);
        } else {
            console.log("Right arrow is disabled, cannot flip.");
        }
    });

    // Keyboard navigation with arrow keys
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            if (!leftArrow.disabled) {
                isFlippingNext = false;
                pageFlip.flipPrev();
                // Visual feedback for keyboard navigation
                leftArrow.style.background = "rgba(200, 200, 255, 0.9)";
                setTimeout(() => {
                    leftArrow.style.background = "";
                }, 200);
            }
        } else if (e.key === "ArrowRight") {
            if (!rightArrow.disabled) {
                isFlippingNext = true;
                pageFlip.flipNext();
                // Visual feedback for keyboard navigation
                rightArrow.style.background = "rgba(200, 200, 255, 0.9)";
                setTimeout(() => {
                    rightArrow.style.background = "";
                }, 200);
            }
        }
    });

    // Update page counter
    function updateControls() {
        const currentPage = pageFlip.getCurrentPageIndex();
        const pageCurrentElement = document.querySelector(".page-current");
        
        if (pageCurrentElement) {
            pageCurrentElement.innerText = currentPage + 1;
        }
        updateArrowStates(); // ADDED: Update arrow states when page changes
    }

    pageFlip.on("flip", (e) => {
        console.log('Flip starting');
        updateControls();
    });

    // This should fire during the flip animation
    pageFlip.on("changeState", (e) => {
        const pageStateElement = document.querySelector(".page-state");
        if (pageStateElement) {
            pageStateElement.innerText = e.data;
        }
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
        if (pageOrientationElement) {
            pageOrientationElement.innerText = e.data;
        }
    });

    console.log('Flipbook initialized!');
    updateArrowStates(); // ADDED: Set initial arrow states on load
});