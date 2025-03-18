document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const binaryPI = "110010010000111111011010101000100110100100110011011110100011101000101111100001011011010001001000101011110011101011011110000101000001001101000010000001010101001011110001110001000010011110110010110010101011000011110000011011100100110101110011101010100110110011001110100000101011010101011101100110100001110000101000101011001100100101110101010011011010001011011101010101100001110001011110101101011000011011011011011000101011110011011011011110110001000110011001100110001100100001000110100110000101000000010011010001010011100100010010001001001010000010100110110100101010011101101110101010011101010100011110010001100100010000011100011000101011011010100110001101010101100000010011100000011000110001000000110100110110011101101100101011101110110100110010000100010011001011000100001010011011000101010001001011000101011010010001001011101101011010100011001101011110110010101110110011000010011001011100101100011000001000010000101010001000011101101000100101011011110110110010101110101010101010010110110101101101110011110000011110100011101000011101010110101010000001110110110011011011"

    function getScreenWidth() {
        return window.innerWidth;
    }

    function computeCharacterCountForWidth(screenWidth, fontSize) {
        const avgCharWidth = fontSize * Math.random();
        return Math.floor(screenWidth / avgCharWidth);
    }

    // function computePiDigit(n) {
    //     Big.DP = n + 2; // Set decimal precision
    //     let pi = new Big(0);
    //     let one = new Big(1);

    //     for (let k = 0; k <= n; k++) {
    //         let term = one.div(new Big(16).pow(k)).times(
    //             new Big(4).div(new Big(8).times(k).plus(1))
    //             .minus(new Big(2).div(new Big(8).times(k).plus(4)))
    //             .minus(new Big(1).div(new Big(8).times(k).plus(5)))
    //             .minus(new Big(1).div(new Big(8).times(k).plus(6)))
    //         );
    //         pi = pi.plus(term);
    //     }

    //     return pi.toString().substring(2, n + 2); // Remove "3." at the start
    // }
    //     return sum.toString().substr(2);
    // }
    // console.log(pi);

    let piDigits = "3.";
    const lines = 5;
    const container = document.getElementById("tickerContainer");

    if (!container) {
        console.error("Ticker container not found!");
        return;
    }

    const screenWidth = getScreenWidth();
    const fontSize = 24;
    const numDigits = computeCharacterCountForWidth(screenWidth, fontSize);
    // piDigits += computePiDigit(numDigits * 5);
    console.log("Screen width:", screenWidth);
    console.log("Computed number of digits for screen width:", numDigits);

    const binaryPiTrunc = binaryPI.substring(0, (numDigits * 2))
    // console.log(binaryPiTrunc);

    function createScrollingText(lineIndex) {
        let scrollingText = document.createElement("div");
        scrollingText.classList.add("scrolling-text");
        scrollingText.textContent = binaryPiTrunc; 
        // piDigits;
        scrollingText.style.animationDuration = `${Math.random() * (12 - 5) + 5}s`;
        scrollingText.style.animationDelay = `${lineIndex * 2}s`;
        scrollingText.style.top = `${lineIndex * 30}px`;

        container.appendChild(scrollingText);
        // console.log("Added scrolling text for line", lineIndex, "Content:", scrollingText.textContent);
    }

    for (let i = 0; i < lines; i++) {
        createScrollingText(i);
    }

    // **Force DOM Reflow to Ensure Animation Works**
    setTimeout(() => {
        document.querySelectorAll(".scrolling-text").forEach(el => {
            el.style.display = "block";
        });
    }, 100);
});
