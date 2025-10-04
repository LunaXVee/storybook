document.addEventListener('DOMContentLoaded', function() {
    const pageFlip = new St.PageFlip(
        document.getElementById("demoBookExample"),
        {
            width: 400,
    height: 533,
    size: "fixed",  // Changed from "stretch"
    minWidth: 315,
    maxWidth: 800,
    minHeight: 420,
    maxHeight: 1066,
    maxShadowOpacity: 0.5,
    showCover: false,
    mobileScrollSupport: false
        }
    );

    // load pages
    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    document.querySelector(".page-total").innerText = pageFlip.getPageCount();
    document.querySelector(".page-orientation").innerText = pageFlip.getOrientation();

    document.querySelector(".btn-prev").addEventListener("click", () => {
        pageFlip.flipPrev(); // Turn to the previous page (with animation)
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        pageFlip.flipNext(); // Turn to the next page (with animation)
    });

    // triggered by page turning
    pageFlip.on("flip", (e) => {
        document.querySelector(".page-current").innerText = e.data + 1;
    });

    // triggered when the state of the book changes
    pageFlip.on("changeState", (e) => {
        document.querySelector(".page-state").innerText = e.data;
    });

    // triggered when page orientation changes
    pageFlip.on("changeOrientation", (e) => {
        document.querySelector(".page-orientation").innerText = e.data;
    });
});