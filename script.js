// Přepínač: zatím bez backendu
const USE_BACKEND = true;

// TADY si každý student nastaví svoje údaje (až bude backend):
const BACKEND_URL = "https://vdf-games-kostak-2026.onrender.com/chat";
const STUDENT_ID = "Nicolas_Doktor_4ITE";

const form = document.getElementById("question-form");
const textarea = document.getElementById("question");
const emailInput = document.getElementById("email");
const answerDiv = document.getElementById("answer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textarea.value.trim();
  const email = emailInput.value.trim();

  if (!text) {
    answerDiv.textContent = "Nejdřív napiš dotaz.";
    return;
  }

  // vždy ukážeme "loading"
  answerDiv.textContent = "Zpracovávám dotaz…";
  form.querySelector("button").disabled = true;

  try {
    const payload = {
      message: text,
      student: STUDENT_ID,
      email: email || null
    };

    // --- FAKE MODE (bez backendu) ---
    if (!USE_BACKEND) {
      answerDiv.textContent =
        `Demo odpověď (bez serveru)\n\n` +
        `Student: ${payload.student}\n` +
        `Dotaz: ${payload.message}`;
      return;
    }

    // --- REAL MODE (s backendem) ---
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      answerDiv.textContent = "Server vrátil chybu: " + res.status;
      return;
    }

    const data = await res.json();

    if (data.reply) {
      answerDiv.textContent = data.reply;
    } else if (data.error) {
      answerDiv.textContent = "Chyba serveru: " + data.error;
    } else {
      answerDiv.textContent = "Server nevrátil žádnou odpověď.";
    }
  } catch (err) {
    console.error(err);
    answerDiv.textContent = "Nepodařilo se spojit se serverem.";
  } finally {
    form.querySelector("button").disabled = false;
    textarea.value = "";
  }
});

async function zeptejSeAI(dotaz) {
    const apiKey = "VÁŠ_API_KLÍČ"; // Pozor: na veřejném webu je to nebezpečné!
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: dotaz }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}
