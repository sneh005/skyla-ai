async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (message === "") return;

    const chatBox = document.getElementById("chatBox");

    // User message
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(userMessage);

    input.value = "";

    // Bot typing indicator
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.innerHTML = `<p>Skyla is typing...</p>`;
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch("https://skyla-ai.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        if (!res.ok){
            throw new Error(`HTTP Error: $ {res.status}`)
        }

        const data = await res.json();

        // Clear typing indicator
        botMessage.innerHTML = `<p></p>`;

        const p = botMessage.querySelector("p");
        p.textContent = "";
        const text = data.reply || "";

        let i = 0;

        const typing = setInterval(() => {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                clearInterval(typing);
            }
        }, 20);

    } catch (error) {
        console.error(error);

        botMessage.innerHTML = `
            <p>Sorry, Skyla is busy right now.</p>
        `;
    }
}
