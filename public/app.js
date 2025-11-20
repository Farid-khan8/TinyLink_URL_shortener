async function shorten() {
    const url = document.getElementById("url").value.trim();
    const shortUrlElement = document.getElementById("shortUrl");

    if (!url) {
        shortUrlElement.textContent = "Please enter a URL.";
        return;
    }

    try {
        const res = await fetch("/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (res.ok) {
            shortUrlElement.textContent = `Shortened URL: ${data.shortUrl}`;
        } else {
            shortUrlElement.textContent = data.error || "Shortening failed.";
        }
    } catch (error) {
        shortUrlElement.textContent = "Network error. Try again.";
    }
}
