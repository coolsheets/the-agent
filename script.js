document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    function computePiDigit(n) {
        let sum = 0;
        for (let k = 0; k <= n; k++) {
            sum += (1 / Math.pow(16, k)) * 
                   ((4 / (8 * k + 1)) - (2 / (8 * k + 4)) - 
                    (1 / (8 * k + 5)) - (1 / (8 * k + 6)));
        }
        return sum.toString().substr(2); // Remove leading "3."
    }

    let piDigits = "3."; // Start with 3.
    const lines = 5;
    const wrapper = document.getElementById("tickerWrapper");

    if (!wrapper) {
        console.error("Ticker wrapper not found!");
        return;
    }
    console.log("Ticker wrapper found:", wrapper);

    function updatePiTicker() {
        piDigits += computePiDigit(piDigits.length);
        console.log("Updated piDigits:", piDigits);
        document.querySelectorAll(".scrolling-text").forEach((text, index) => {
            text.textContent = piDigits;
            text.style.animationDuration = `${10 + index}s`; // Stagger animation speed
            console.log("Updated text content for line", index, text.textContent);
        });
    }

    for (let i = 0; i < lines; i++) {
        let container = document.createElement("div");
        container.classList.add("ticker-container");
        console.log("Created ticker-container for line", i);

        let scrollingText = document.createElement("div");
        scrollingText.classList.add("scrolling-text");
        scrollingText.textContent = piDigits;
        scrollingText.style.top = `${i * 30}px`; // Adjust spacing
        scrollingText.style.animationDelay = `${i * 2}s`; // Stagger delay
        
        container.appendChild(scrollingText);
        wrapper.appendChild(container);
        console.log("Added scrolling text to container for line", i);
    }

    setInterval(updatePiTicker, 2000); // Update every 2 seconds
});
