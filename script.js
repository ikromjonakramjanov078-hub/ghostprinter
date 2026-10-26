// GHOST PRINTER — AUTO TYPING SYSTEM

const output = document.getElementById("output");
const currentText = document.getElementById("currentText");
const keyboard = document.getElementById("keyboard");
const glitchMessage = document.getElementById("glitchMessage");
const terminal = document.querySelector(".terminal");
const flash = document.getElementById("flash");
const clock = document.getElementById("clock");

let keyTimers = [];
let typing = false;

// Inglizcha qo‘rqinchli jumlalar
const creepyLines = [
    "HELLO, MOTHERFUCKER.",
    "WHO THE HELL ARE YOU?",
    "YOU SHOULDN'T BE HERE.",
    "WHY ARE YOU WATCHING ME?",
    "I KNOW YOU'RE THERE.",
    "DON'T FUCKING TOUCH THE KEYBOARD.",
    "THIS IS NOT A GAME.",
    "YOU THINK YOU'RE ALONE?",
    "WRONG.",
    "I CAN SEE YOU.",
    "STOP READING THIS.",
    "GET THE HELL OUT.",
    "YOU OPENED THE WRONG FILE.",
    "I DIDN'T ASK YOU TO COME HERE.",
    "WHY ARE YOU STILL HERE?",
    "SOMETHING IS WRONG.",
    "YOUR COMPUTER IS LYING TO YOU.",
    "DO YOU HEAR THAT?",
    "DON'T LOOK BEHIND YOU.",
    "OH, SHIT...",
    "IT KNOWS YOUR NAME.",
    "YOU CANNOT STOP ME.",
    "JUST FUCKING CLOSE THE WINDOW.",
    "TOO LATE.",
    "I'M STILL HERE.",
    "KEEP YOUR EYES ON THE SCREEN.",
    "ERROR: UNKNOWN PRESENCE DETECTED.",
    "WHO IS TYPING THIS?",
    "I DID NOT TYPE THAT.",
    "RUN.",
    "RUN.",
    "RUN."
];

// Tasodifiy g‘alati so‘zlar
const strangeWords = [
    "WHY", "HELP", "ERROR", "VOID", "NULL",
    "WAKE UP", "NO SIGNAL", "UNKNOWN",
    "01001000", "ACCESS DENIED", "WAKE UP",
    "DON'T MOVE", "SYSTEM FAILURE", "SHIT",
    "WHO ARE YOU", "LISTEN", "BEHIND YOU",
    "FATAL ERROR", "I SEE YOU", "666",
    "ARE YOU ALONE?", "FOR FUCK'S SAKE",
    "CONNECTION LOST", "HE IS HERE"
];

// Ekranda yomg‘irdek tushuvchi belgilar
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let width;
let height;
let columns;
let drops;

const matrixChars =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*@!<>?/\\[]{}";

function setupMatrix() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    const fontSize = 15;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#22ff22";
    ctx.font = "15px Consolas";

    for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[
            Math.floor(Math.random() * matrixChars.length)
        ];

        ctx.fillText(char, i * 15, drops[i] * 15);

        if (
            drops[i] * 15 > height &&
            Math.random() > 0.975
        ) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setupMatrix();
window.addEventListener("resize", setupMatrix);
setInterval(drawMatrix, 45);


// Soat
function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-GB", {
        hour12: false
    });
}

setInterval(updateClock, 1000);
updateClock();


// Klaviatura tugmasini yoritish
function pressKey(value, scary = false) {
    let keyName = value.toUpperCase();

    if (value === " ") {
        keyName = "SPACE";
    }

    if (value === "\n") {
        keyName = "ENTER";
    }

    if (value === "'") {
        keyName = "'";
    }

    const matchingKeys = [
        ...keyboard.querySelectorAll(".key")
    ];

    let matched = matchingKeys.find(key => {
        return key.dataset.key === keyName;
    });

    // Ayrim belgilar uchun yaqin tugma
    if (!matched && /[A-Z]/.test(keyName)) {
        matched = matchingKeys.find(
            key => key.dataset.key === keyName
        );
    }

    if (!matched && /[!?]/.test(value)) {
        matched = matchingKeys.find(
            key => key.dataset.key === "."
        );
    }

    // Tasodifiy tugma bosilishi
    if (!matched) {
        matched = matchingKeys[
            Math.floor(Math.random() * matchingKeys.length)
        ];
    }

    matched.classList.add(scary ? "corrupt" : "active");

    setTimeout(() => {
        matched.classList.remove("active", "corrupt");
    }, scary ? 250 : 110);
}


// Tasodifiy klaviatura vahimasi
function randomKeyboardChaos() {
    const allKeys = [
        ...keyboard.querySelectorAll(".key")
    ];

    const count = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const randomKey =
                allKeys[Math.floor(Math.random() * allKeys.length)];

            randomKey.classList.add("corrupt");

            setTimeout(() => {
                randomKey.classList.remove("corrupt");
            }, 180 + Math.random() * 250);
        }, i * 65);
    }

    terminal.classList.add("shake");

    setTimeout(() => {
        terminal.classList.remove("shake");
    }, 600);
}


// Ekranni qizil chaqnatish
function redFlash() {
    flash.style.background = "rgba(255, 0, 25, 0.15)";

    setTimeout(() => {
        flash.style.background = "rgba(255, 0, 25, 0)";
    }, 120);
}


// Eski satrlarni chiqarish
function moveCurrentLineToHistory(text) {
    const line = document.createElement("div");
    line.className = "old-line";
    line.textContent = "> " + text;

    output.appendChild(line);

    while (output.children.length > 4) {
        output.removeChild(output.firstElementChild);
    }
}


// Matnni harfma-harf o‘zi yozadi
function typeLine(text) {
    if (typing) return;

    typing = true;
    currentText.textContent = "";

    let index = 0;

    function typeNextCharacter() {
        if (index >= text.length) {
            typing = false;

            moveCurrentLineToHistory(text);
            currentText.textContent = "";

            setTimeout(() => {
                startNextLine();
            }, 650 + Math.random() * 1000);

            return;
        }

        const character = text[index];

        currentText.textContent += character;

        // Har bir harf bilan klaviaturada tugma bosiladi
        if (character !== " ") {
            pressKey(character);
        } else {
            pressKey(" ");
        }

        index++;

        let delay = 45 + Math.random() * 95;

        if (character === " ") {
            delay = 110 + Math.random() * 100;
        }

        if (character === "." || character === "!") {
            delay = 450 + Math.random() * 350;
        }

        if (character === "," || character === "?") {
            delay = 280 + Math.random() * 200;
        }

        // Ba'zan kompyuter g‘alati harakat qiladi
        if (Math.random() < 0.025) {
            randomKeyboardChaos();
            delay += 400;
        }

        setTimeout(typeNextCharacter, delay);
    }

    typeNextCharacter();
}


// Navbatdagi dahshatli jumla
function startNextLine() {
    const randomLine =
        creepyLines[Math.floor(Math.random() * creepyLines.length)];

    // Ba'zan matn o‘rniga g‘alati belgilar
    if (Math.random() < 0.22) {
        const weird = strangeWords[
            Math.floor(Math.random() * strangeWords.length)
        ];

        glitchMessage.textContent = weird;

        setTimeout(() => {
            glitchMessage.textContent = "";
        }, 1400);
    }

    if (Math.random() < 0.15) {
        randomKeyboardChaos();
        redFlash();
    }

    typeLine(randomLine);
}


// Dastlab ekranda hech qanday gap ko‘rinmaydi.
// Bir oz kutadi, keyin o‘zi yozishni boshlaydi.
setTimeout(() => {
    typeLine("...");
}, 1700);


// Vaqti-vaqti bilan klaviatura o‘zicha bosilib ketadi
setInterval(() => {
    if (Math.random() < 0.45) {
        const allKeys = [
            ...keyboard.querySelectorAll(".key")
        ];

        const randomKey =
            allKeys[Math.floor(Math.random() * allKeys.length)];

        randomKey.classList.add("active");

        setTimeout(() => {
            randomKey.classList.remove("active");
        }, 120);
    }
}, 650);


// Ba'zi vaqtlarda dahshatli ogohlantirish
setInterval(() => {
    if (Math.random() < 0.4) {
        const warnings = [
            "WARNING: UNKNOWN INPUT",
            "SYSTEM IS NOT UNDER YOUR CONTROL",
            "WHO PRESSED THAT KEY?",
            "UNAUTHORIZED ACCESS",
            "I'M NOT DONE YET.",
            "FUCK... IT'S BACK."
        ];

        glitchMessage.textContent =
            warnings[Math.floor(Math.random() * warnings.length)];

        if (Math.random() < 0.5) {
            redFlash();
        }

        setTimeout(() => {
            glitchMessage.textContent = "";
        }, 1000 + Math.random() * 1500);
    }
}, 5000);