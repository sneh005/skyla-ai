async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (message === "") return;

    const chatBox = document.getElementById("chatBox");

    // USER MESSAGE
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(userMessage);

    input.value = "";

    // BOT MESSAGE (typing placeholder)
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";

    const p = document.createElement("p");
    p.textContent = "Skyla is typing...";
    botMessage.appendChild(p);

    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();

        // Get response safely (supports both formats)
        const text = data.reply || data.response || "No response";

        // Clear typing text
        p.textContent = "";

        // Smooth typing effect
        let i = 0;

        function typeText() {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(typeText, 15);
            }
        }

        typeText();

    } catch (error) {
        console.error("Error:", error);

        p.textContent = "Sorry, Skyla is busy right now.";
    }
}