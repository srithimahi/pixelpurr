const cats = [
    { name: "Miso", desc: "Professional napper. Fearless crumb hunter." },
    { name: "Pixel", desc: "Will judge your code. Quietly." },
    { name: "Boba", desc: "Needs pets. Demands snacks." },
    { name: "Luna", desc: "Tiny menace. Big heart." },
];

const catGrid = document.getElementById("catGrid");
cats.forEach(c => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<div class="name">😺 ${c.name}</div><div class="desc">${c.desc}</div>`;
    catGrid.appendChild(el);
});


const petBtn = document.getElementById("petBtn");
const petStatus = document.getElementById("petStatus");
const bubble = document.getElementById("bubble");
const moodEl = document.getElementById("mood");
const sleepEl = document.getElementById("sleep");

const hungerFill = document.getElementById("hungerFill");
const thirstFill = document.getElementById("thirstFill");
const hungerNum = document.getElementById("hungerNum");
const thirstNum = document.getElementById("thirstNum");

const foodBowl = document.getElementById("foodBowl");
const waterBowl = document.getElementById("waterBowl");

const input = document.getElementById("input");
const output = document.getElementById("output");
const translateBtn = document.getElementById("translate");

const pawLayer = document.getElementById("pawLayer");


const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const t4 = document.getElementById("t4");


function clamp(n){ return Math.max(0, Math.min(100, n)); }
function setBubble(t){ bubble.textContent = t; }

function markDone(li){
    if (!li.classList.contains("done")){
        li.classList.add("done");
        li.textContent = li.textContent.replace("⬜", "✅");
    }
}


let pets = 0;
let hunger = 100;
let thirst = 100;


let ignoredHungerTimes = 0;
let ignoredThirstTimes = 0;
let hitZeroCount = 0;


let fedBefore20 = false;
let wateredBefore20 = false;
let translatedOnce = false;


let sleeping = false;
let sleepCooldown = false;


let lastAction = Date.now();


const petLines = [
    "purrrr~ you got this 🐾",
    "ok… that was acceptable.",
    "pet again. now.",
    "you are literally cooking 🔥",
    "fine. i approve."
];

const needyLines = {
    both: ["MEOW!! food AND water 😾", "i am in crisis. dual crisis.", "feed + water. NOW."],
    hunger: ["meow… feed me 🍗🥺", "i crave snacks.", "i will bite your keyboard."],
    thirst: ["mrrp… water pls 💧🥺", "hydrate me.", "my tongue is dry. tragic."]
};

function updateMood(){
    let mood = "Neutral 😐";

    if (hunger <= 10 && thirst <= 10) mood = "Sad 😿";
    else if (hunger <= 25 || thirst <= 25) mood = "Angry 😾";
    else if (pets >= 10) mood = "Happy 😺";
    else mood = "Neutral 😐";


    const neglect = ignoredHungerTimes + ignoredThirstTimes + hitZeroCount*2;
    if (neglect >= 6 && (hunger > 25 && thirst > 25)) mood = "Suspicious 😼";

    moodEl.textContent = "Mood: " + mood;
}

function renderBars(){
    hunger = clamp(hunger);
    thirst = clamp(thirst);

    hungerFill.style.width = hunger + "%";
    thirstFill.style.width = thirst + "%";
    hungerNum.textContent = hunger;
    thirstNum.textContent = thirst;

    updateMood();
}


function updateTasks(){
    if (pets >= 5) markDone(t1);
    if (fedBefore20) markDone(t2);
    if (wateredBefore20) markDone(t3);
    if (translatedOnce) markDone(t4);
}


function setSleeping(val){
    sleeping = val;
    sleepEl.textContent = "Status: " + (sleeping ? "Sleeping 💤" : "Awake");
}

function tryGoToSleep(){
    if (sleeping || sleepCooldown) return;

    sleeping = true;
    setSleeping(true);
    setBubble("zzz… do not disturb 😴");


    const sleepDuration = 25000 + Math.floor(Math.random() * 15000);

    setTimeout(() => {
        sleeping = false;
        setSleeping(false);
        setBubble("i have awakened. you may continue.");
        sleepCooldown = true;
        setTimeout(() => { sleepCooldown = false; }, 60000);
    }, sleepDuration);
}


setInterval(() => {
    tryGoToSleep();
}, 120000);


petBtn.addEventListener("click", () => {
    lastAction = Date.now();

    pets++;
    petStatus.textContent = `Pets: ${pets}`;

    if (sleeping){
        setSleeping(false);
        sleeping = false;
        setBubble("HEY 😾 i was sleeping.");
    } else {
        setBubble(petLines[Math.floor(Math.random() * petLines.length)]);
    }


    updateTasks();
    updateMood();
});


foodBowl.addEventListener("click", () => {
    lastAction = Date.now();

    // Task: feed before < 20
    if (hunger >= 20) {

    } else {
        fedBefore20 = true;
    }

    hunger = clamp(hunger + 25);
    setBubble("nom nom nom 🍗");
    renderBars();
    updateTasks();
});

waterBowl.addEventListener("click", () => {
    lastAction = Date.now();

    if (thirst < 20) wateredBefore20 = true;

    thirst = clamp(thirst + 25);
    setBubble("glug glug 💧");
    renderBars();
    updateTasks();
});

let lastNeedyMsgAt = 0;

setInterval(() => {
    const decay = sleeping ? 0.3 : 1; // sleeping slows decay
    hunger = clamp(hunger - decay);
    thirst = clamp(thirst - decay);

    // memory: count neglect when low for a while
    if (hunger <= 10) ignoredHungerTimes++;
    if (thirst <= 10) ignoredThirstTimes++;
    if (hunger === 0 || thirst === 0) hitZeroCount++;

    renderBars();

    const now = Date.now();
    if (now - lastNeedyMsgAt > 15000 && !sleeping){
        if (hunger <= 25 && thirst <= 25){
            setBubble(needyLines.both[Math.floor(Math.random() * needyLines.both.length)]);
            lastNeedyMsgAt = now;
        } else if (hunger <= 25){
            setBubble(needyLines.hunger[Math.floor(Math.random() * needyLines.hunger.length)]);
            lastNeedyMsgAt = now;
        } else if (thirst <= 25){
            setBubble(needyLines.thirst[Math.floor(Math.random() * needyLines.thirst.length)]);
            lastNeedyMsgAt = now;
        }
    }
}, 20000);


const ambientLines = [
    "i am bored. entertain me.",
    "i have inspected your vibes. acceptable.",
    "do you think about cats? you should.",
    "sometimes i stare at the void. meow.",
    "why are humans so… keyboardy?"
];

setInterval(() => {
    const idleMs = Date.now() - lastAction;
    if (idleMs > 60000 && !sleeping){
        setBubble(ambientLines[Math.floor(Math.random() * ambientLines.length)]);
        lastAction = Date.now(); // prevents spam
    }
}, 7000);

let lastPawAt = 0;
window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastPawAt < 60) return; // throttle
    lastPawAt = now;

    const paw = document.createElement("div");
    paw.className = "paw";
    paw.textContent = "🐾";
    paw.style.left = e.clientX + "px";
    paw.style.top = e.clientY + "px";
    paw.style.transform = `translate(-50%, -50%) rotate(${(Math.random()*20 - 10).toFixed(1)}deg)`;

    pawLayer.appendChild(paw);
    setTimeout(() => paw.remove(), 1300);
});

// Any click = activity
window.addEventListener("click", () => {
    lastAction = Date.now();
});


translateBtn.addEventListener("click", () => {
    lastAction = Date.now();

    const words = input.value.trim().split(/\s+/).filter(Boolean);
    if (!words.length) { output.textContent = ""; return; }

    output.textContent = words
        .map((_, i) => (i % 3 === 0 ? "meow" : i % 3 === 1 ? "mrrp" : "nya"))
        .join(" ");

    translatedOnce = true;
    updateTasks();
    setBubble("translation complete. meow.");
});


renderBars();
updateTasks();
setSleeping(false);
