const demoObjects = {
  chair: { name: "Wooden chair", label: "WOOD / 001", artClass: "chair-art", summary: "A solid frame with repairable joints and a high-value material story.", tags: ["wood grain 88%", "repairable", "low joint stress"], recommendation: "repair" },
  bike: { name: "Old bicycle", label: "METAL / 014", artClass: "bike-art", summary: "A reliable steel frame with surface rust, reusable parts and a clear mobility path.", tags: ["steel frame", "parts salvage", "medium effort"], recommendation: "repair" },
  laptop: { name: "Damaged laptop", label: "E-WASTE / 072", artClass: "laptop-art", summary: "The screen is compromised, but the memory, drive and chassis still hold value.", tags: ["battery caution", "parts salvage", "data first"], recommendation: "recover" },
  jeans: { name: "Torn jeans", label: "TEXTILE / 033", artClass: "jeans-art", summary: "A durable cotton blend with enough fabric left for a useful second-life cut.", tags: ["cotton blend", "easy repair", "low waste"], recommendation: "reimagine" },
  bottle: { name: "Plastic bottle", label: "PLASTIC / 008", artClass: "bottle-art", summary: "A clean PET container that can be refilled today or routed into a known recovery stream.", tags: ["PET plastic", "food safe", "easy action"], recommendation: "reimagine" },
  suitcase: { name: "Old suitcase", label: "TEXTILE / 055", artClass: "case-art", summary: "A sturdy shell with a tired lining, well suited to storage or a mobile planter.", tags: ["hard shell", "good structure", "creative fit"], recommendation: "reimagine" },
  upload: { name: "Your object", label: "CUSTOM / 001", artClass: "upload-art", summary: "A first-pass local reading is ready. Add more context in a production scan for a sharper recommendation.", tags: ["visual scan", "local preview", "needs context"], recommendation: "repair" },
};

const pathwayInfo = {
  repair: { title: "Repair it", category: "KEEP IN USE", copy: "Restore the highest-value part and keep the original object in circulation.", fit: "Tools: low", impact: "Life: +18 mo", score: 92 },
  reimagine: { title: "Reimagine it", category: "MAKE IT USEFUL", copy: "Translate the strongest component into something your space needs now.", fit: "Tools: medium", impact: "Waste: -1", score: 86 },
  "pass-on": { title: "Pass it on", category: "SHARE THE VALUE", copy: "Give the object to the person or place that can use it without extra work.", fit: "Time: low", impact: "Reach: +1", score: 78 },
  recover: { title: "Recover parts", category: "CLOSE THE LOOP", copy: "Separate materials safely and route each piece to a trusted recovery stream.", fit: "Care: high", impact: "Landfill: 0", score: 71 },
};

const stageInfo = [
  ["01", "Start with a better look.", "ObjectDNA turns a quick visual signal into a working hypothesis, then shows you what it knows and what it is still inferring."],
  ["02", "Read the material signal.", "Condition is not a verdict. It is a map of what is safe, useful and worth preserving."],
  ["03", "Find the pieces that remain.", "A broken whole can still contain a working hinge, a strong panel, a reusable motor or a great texture."],
  ["04", "Make more than one future visible.", "ObjectDNA suggests practical paths, from the smallest repair to a creative second form."],
  ["05", "Choose with the trade-offs in view.", "Time, tools, impact and confidence sit side by side so the right option feels obvious."],
  ["06", "Leave with one action.", "A next life starts with a next step: tighten one joint, share one listing or sort one material stream."],
];

let activeObject = null;
let analysisRun = 0;
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderPathways(selected = activeObject?.recommendation || "repair") {
  const grid = $("#pathwayGrid");
  if (!grid) return;
  grid.innerHTML = Object.entries(pathwayInfo).map(([key, item]) => {
    const recommended = key === selected;
    return `<article class="pathway-card${recommended ? " recommended" : ""}">
      <div class="pathway-top"><span>${item.category}</span>${recommended ? "<b class=\"recommend-badge\">BEST FIT</b>" : `<b class="score">${item.score}</b>`}</div>
      <h3>${item.title}</h3><p>${item.copy}</p>
      <div class="pathway-meta"><span>${item.fit}</span><span>${item.impact}</span></div>
    </article>`;
  }).join("");
  $$("[data-pathway]").forEach((tab) => tab.classList.toggle("selected", tab.dataset.pathway === selected));
}

function setPhase(index) {
  $$(".phase").forEach((phase, phaseIndex) => {
    phase.classList.toggle("active", phaseIndex === index);
    phase.classList.toggle("done", phaseIndex < index);
  });
}

function finishAnalysis(data, imageUrl = "") {
  activeObject = data;
  $("#analysisTitle").textContent = `${data.name} mapped`;
  $("#analysisStatus").textContent = "COMPLETE";
  $("#analysisEmpty").hidden = true;
  $("#analysisRunning").hidden = true;
  $("#analysisResult").hidden = false;
  $("#resultName").textContent = data.name;
  $("#resultSummary").textContent = data.summary;
  $("#runningLabel").textContent = data.label;
  $("#resultTags").innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
  const resultArt = $("#resultArt");
  resultArt.className = `result-art ${data.artClass}`;
  const resultObject = $("#resultObject");
  resultObject.style.backgroundImage = imageUrl ? `linear-gradient(rgba(8, 22, 24, .72), rgba(8, 22, 24, .85)), url("${imageUrl}")` : "";
  renderPathways(data.recommendation);
  showToast(`${data.name} scanned. Recommendation ready.`);
}

function runAnalysis(data, imageUrl = "") {
  const run = ++analysisRun;
  $("#analysisTitle").textContent = "Reading object signals";
  $("#analysisStatus").textContent = "SCANNING";
  $("#analysisEmpty").hidden = true;
  $("#analysisResult").hidden = true;
  $("#analysisRunning").hidden = false;
  $("#runningLabel").textContent = data.label;
  setPhase(0);
  let phase = 0;
  const advance = () => {
    if (run !== analysisRun) return;
    if (phase < 3) {
      phase += 1;
      setPhase(phase);
      window.setTimeout(advance, 620);
    } else {
      window.setTimeout(() => { if (run === analysisRun) finishAnalysis(data, imageUrl); }, 520);
    }
  };
  window.setTimeout(advance, 620);
  document.querySelector("#scan")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startDemo(key) {
  const data = demoObjects[key] || demoObjects.chair;
  runAnalysis(data);
}

function readImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please choose a JPG, PNG or WEBP image.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast("That image is over 10 MB. Try a smaller photo.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => runAnalysis({ ...demoObjects.upload, name: file.name.replace(/\.[^.]+$/, "").slice(0, 26) || "Your object" }, reader.result);
  reader.onerror = () => showToast("ObjectDNA could not read that image. Try again or use a demo object.");
  reader.readAsDataURL(file);
}

function selectStage(index) {
  const [number, title, copy] = stageInfo[index] || stageInfo[0];
  $$(".pipeline-step").forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === index));
  $(".stage-index").textContent = number;
  $(".stage-detail h3").textContent = title;
  $(".stage-detail p").textContent = copy;
}

function bindEvents() {
  $$("[data-demo]").forEach((button) => button.addEventListener("click", () => startDemo(button.dataset.demo)));
  $$("[data-pathway]").forEach((button) => button.addEventListener("click", () => renderPathways(button.dataset.pathway)));
  $$("[data-stage]").forEach((button) => button.addEventListener("click", () => selectStage(Number(button.dataset.stage))));
  $("#viewPathways").addEventListener("click", () => { $("#pathways").scrollIntoView({ behavior: "smooth" }); showToast("Compare the paths for this object below."); });
  $("#chooseButton").addEventListener("click", (event) => { event.stopPropagation(); $("#fileInput").click(); });
  $("#fileInput").addEventListener("change", (event) => readImage(event.target.files[0]));
  const dropzone = $("#dropzone");
  ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove("dragging"); }));
  dropzone.addEventListener("drop", (event) => readImage(event.dataTransfer.files[0]));
  dropzone.addEventListener("click", (event) => { if (!event.target.closest("button")) $("#fileInput").click(); });
  dropzone.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $("#fileInput").click(); } });
  $("#menuToggle").addEventListener("click", () => { const topbar = $(".topbar"); const open = topbar.classList.toggle("menu-open"); $("#menuToggle").setAttribute("aria-expanded", String(open)); });
  $$(".main-nav a").forEach((link) => link.addEventListener("click", () => { $(".topbar").classList.remove("menu-open"); $("#menuToggle").setAttribute("aria-expanded", "false"); }));
  $("#transformSlider").addEventListener("input", (event) => { const value = Number(event.target.value); event.target.style.background = `linear-gradient(90deg, var(--lime) ${value}%, rgba(255,255,255,.12) ${value}%)`; });
}

function boot() {
  renderPathways();
  selectStage(0);
  bindEvents();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
}

window.addEventListener("error", (event) => {
  console.error("ObjectDNA preview error", event.error || event.message);
  showToast("ObjectDNA hit a snag. Try a demo object to continue.");
});

function startApp() {
  try { boot(); } catch (error) { console.error(error); showToast("ObjectDNA could not start. Reload the preview and try again."); }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startApp, { once: true });
else startApp();
