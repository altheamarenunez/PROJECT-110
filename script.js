
/* =========================
   1. GET THE HTML ELEMENTS
========================= */

const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const loadingText = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const getQuoteButton = document.getElementById("getQuoteButton");
const copyButton = document.getElementById("copyButton");
const quoteCountText = document.getElementById("quoteCount");
const quoteBox = document.querySelector(".quote-display");

// Public API for random quotes
const API_URL = "https://dummyjson.com/quotes/random";

// Count successfully displayed quotes
let quoteCount = 0;


/* =========================
   2. FUNCTION: GET A QUOTE
========================= */

async function getQuote() {

    // Show the loading message
    loadingText.classList.remove("hidden");

    // Hide any previous error
    errorMessage.classList.add("hidden");

    // Disable the button while loading
    getQuoteButton.disabled = true;

    try {

        // Request a random quote from the API
        const response = await fetch(API_URL);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error("API request failed");
        }

        // Convert the response into a JavaScript object
        const data = await response.json();

        // Check if the quote and author are available
        if (
            typeof data.quote !== "string" ||
            !data.quote.trim() ||
            typeof data.author !== "string" ||
            !data.author.trim()
        ) {
            throw new Error("Quote information is missing");
        }

        // Display the quote
        showQuote(data.quote, data.author);

    } catch (error) {

        // Show a readable error message to the user
        errorMessage.textContent =
            "Could not fetch a quote. Please check your internet connection and try again.";

        errorMessage.classList.remove("hidden");

        // Log the error for debugging
        console.error("Error fetching quote:", error);

    } finally {

        // Hide the loading message
        loadingText.classList.add("hidden");

        // Enable the button again
        getQuoteButton.disabled = false;
    }
}


/* =========================
   3. FUNCTION: SHOW THE QUOTE
========================= */

function showQuote(quote, author) {

    // Display the quote and its author
    quoteText.textContent = quote;
    authorText.textContent = "— " + author;

    // Increase the counter
    quoteCount++;

    // Update the displayed counter
    quoteCountText.textContent = quoteCount;

    // Restart the quote card animation
    quoteBox.classList.remove("pop");

    // Allow the browser to restart the animation
    void quoteBox.offsetWidth;

    // Play the animation
    quoteBox.classList.add("pop");
}


/* =========================
   4. FUNCTION: COPY THE QUOTE
========================= */

async function copyQuote() {

    // Make sure a quote has been fetched first
    if (quoteCount === 0) {

        copyButton.textContent = "GET A QUOTE FIRST";

        setTimeout(function () {
            copyButton.textContent = "COPY QUOTE";
        }, 1500);

        return;
    }

    // Combine the quote and author
    const fullText =
        quoteText.textContent + " " + authorText.textContent;

    try {

        // Copy the text to the clipboard
        await navigator.clipboard.writeText(fullText);

        // Display the success message
        copyButton.textContent = "COPIED! ✓";

    } catch (error) {

        // Display the failure message
        copyButton.textContent = "COPY FAILED";

        console.error("Error copying quote:", error);
    }

    // Restore the original button text
    setTimeout(function () {
        copyButton.textContent = "COPY QUOTE";
    }, 1500);
}


/* =========================
   5. CONNECT THE BUTTONS
========================= */

// Get a quote when the button is clicked
if (getQuoteButton) {
    getQuoteButton.addEventListener("click", getQuote);
}

// Copy the quote when the button is clicked
if (copyButton) {
    copyButton.addEventListener("click", copyQuote);
}
