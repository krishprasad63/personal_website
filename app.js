const root = document.documentElement;
const heroCanvas = document.getElementById("heroScope");
const heroCtx = heroCanvas.getContext("2d");
const protocolCanvas = document.getElementById("protocolCanvas");
const protocolCtx = protocolCanvas.getContext("2d");
const protocolName = document.getElementById("protocolName");
const protocolHeadline = document.getElementById("protocolHeadline");
const protocolDescription = document.getElementById("protocolDescription");
const bitWindow = document.getElementById("bitWindow");
const busActivity = document.getElementById("busActivity");

// Dynamic UART Controls Elements
const uartControls = document.getElementById("uartControls");
const uartInput = document.getElementById("uartInput");
const uartHexReadout = document.getElementById("uartHexReadout");

const colors = {
  cyan: "#48d8ff",
  green: "#72f2a6",
  amber: "#ffc45d",
  rose: "#ff6f91",
  muted: "#607383",
  text: "#eef6fb"
};

function sizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { width: rect.width, height: rect.height };
}

let heroSize = { width: 0, height: 0 };
let protocolSize = { width: 0, height: 0 };

function resizeAll() {
  heroSize = sizeCanvas(heroCanvas, heroCtx);
  protocolSize = sizeCanvas(protocolCanvas, protocolCtx);
  positionTokens();
}

window.addEventListener("resize", resizeAll);

function drawHero(time) {
  const { width, height } = heroSize;
  heroCtx.clearRect(0, 0, width, height);
  if (!width || !height) return;

  const tracks = [0.2, 0.34, 0.48, 0.62, 0.76].map(v => v * height);
  heroCtx.lineWidth = 1.6;
  heroCtx.font = "12px JetBrains Mono, monospace";

  tracks.forEach((y, idx) => {
    const color = [colors.cyan, colors.green, colors.amber, colors.rose, colors.cyan][idx];
    heroCtx.strokeStyle = color;
    heroCtx.globalAlpha = 0.16 + idx * 0.035;
    heroCtx.beginPath();
    heroCtx.moveTo(0, y);
    const period = 70 + idx * 18;
    const amp = 14 + idx * 3;
    for (let x = 0; x < width; x += 8) {
      const step = Math.sin((x + time * (0.055 + idx * 0.008)) / period) > 0 ? amp : -amp;
      heroCtx.lineTo(x, y + step);
    }
    heroCtx.stroke();
    heroCtx.globalAlpha = 0.7;
    heroCtx.fillStyle = color;
    heroCtx.fillText(["SCL", "SDA", "TX", "MOSI", "WB"][idx], width - 54, y - 18);
  });

  heroCtx.globalAlpha = 0.18;
  heroCtx.strokeStyle = colors.cyan;
  for (let i = 0; i < 7; i += 1) {
    const x = ((time * 0.035 + i * 170) % (width + 220)) - 110;
    heroCtx.beginPath();
    heroCtx.moveTo(x, height * 0.12);
    heroCtx.lineTo(x + 80, height * 0.12);
    heroCtx.lineTo(x + 80, height * 0.88);
    heroCtx.lineTo(x + 180, height * 0.88);
    heroCtx.stroke();
  }
  heroCtx.globalAlpha = 1;
}

const stageNames = ["IF", "ID", "EX", "MEM", "WB"];
const instructionStream = [
  { text: "addi x5, x0, 8", event: "Immediate value enters decode stage" },
  { text: "lw x6, 0(x5)", event: "Memory load requested (Load-use hazard monitored)" },
  { text: "add x7, x6, x5", event: "Forwarding path EX->EX resolves operand dependency" },
  { text: "sw x7, 4(x5)", event: "Memory stage commits word to memory" },
  { text: "bne x1, x2, loop", event: "Branch condition evaluated in EX stage" },
  { text: "nop", event: "Bubble inserted by hazard unit for timing alignment", bubble: true }
];

const board = document.querySelector(".pipeline-board");
const instructionReadout = document.getElementById("pipelineInstruction");
const eventReadout = document.getElementById("pipelineEvent");
const pipelineToggle = document.getElementById("pipelineToggle");
const pipelineStep = document.getElementById("pipelineStep");
const forwardingToggle = document.getElementById("forwardingToggle");
let pipelineTick = 0;
let pipelineRunning = true;
const tokens = [];

function createTokens() {
  instructionStream.slice(0, 5).forEach((inst, index) => {
    const el = document.createElement("div");
    el.className = "instruction-token";
    el.textContent = inst.text;
    el.dataset.offset = index;
    board.appendChild(el);
    tokens.push(el);
  });
}

function getStageCenters() {
  const boardRect = board.getBoundingClientRect();
  return [...document.querySelectorAll(".stage")].map(stage => {
    const rect = stage.getBoundingClientRect();
    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2
    };
  });
}

function positionTokens() {
  if (!tokens.length) return;
  const centers = getStageCenters();
  if (!centers.length) return;
  tokens.forEach((token, idx) => {
    const streamIndex = (pipelineTick + idx) % instructionStream.length;
    const inst = instructionStream[streamIndex];
    const stageIndex = idx % stageNames.length;
    const center = centers[stageIndex];
    token.textContent = inst.text;
    token.classList.toggle("bubble", Boolean(inst.bubble));
    token.style.left = `${center.x}px`;
    token.style.top = `${center.y}px`;
    token.style.opacity = inst.bubble ? "0.78" : "1";
  });

  const current = instructionStream[pipelineTick % instructionStream.length];
  instructionReadout.textContent = current.text;
  eventReadout.textContent = current.event;
}

function advancePipeline() {
  pipelineTick += 1;
  positionTokens();
}

pipelineToggle.addEventListener("click", () => {
  pipelineRunning = !pipelineRunning;
  pipelineToggle.textContent = pipelineRunning ? "Pause" : "Run";
});

pipelineStep.addEventListener("click", advancePipeline);
forwardingToggle.addEventListener("change", () => {
  board.classList.toggle("no-forward", !forwardingToggle.checked);
});

// Dynamic UART State & Protocols Data
let currentUartChar = "K";
function getUartBits(char) {
  const code = (char || "K").charCodeAt(0) || 75;
  const bits = [];
  for (let i = 0; i < 8; i += 1) {
    bits.push((code >> i) & 1);
  }
  return { code, bits };
}

const protocols = {
  i2c: {
    name: "Instruction-driven I2C",
    headline: "START, address, ACK, data, STOP on SCL and SDA.",
    description: "SDA falls while SCL is high for START, data changes around low clock windows, ACK is sampled, and STOP releases the bus high.",
    labels: ["START", "1", "0", "1", "0", "0", "1", "0", "W", "ACK", "DATA", "ACK", "STOP"]
  },
  uart: {
    name: "UART Serial Transmitter",
    headline: "Idle high, start bit low, 8 data bits LSB-first, stop bit high.",
    description: "Serializing ASCII character byte over asynchronous TX line. The receiver samples near the bit center using the 16x baud clock tick.",
    labels: ["IDLE", "START", "1", "0", "1", "0", "0", "1", "0", "1", "STOP"]
  },
  spi: {
    name: "SPI full-duplex shift",
    headline: "CS gates the transaction while MOSI and MISO shift on SCLK.",
    description: "The master drives the clock. On every active edge, one bit moves toward the slave and one bit returns toward the master.",
    labels: ["CS", "7", "6", "5", "4", "3", "2", "1", "0", "DONE"]
  }
};

function updateUartData(char) {
  currentUartChar = char || "K";
  const { code, bits } = getUartBits(currentUartChar);
  protocols.uart.labels = ["IDLE", "START", ...bits.map(String), "STOP"];
  if (uartHexReadout) {
    const hex = code.toString(16).toUpperCase();
    const bin = bits.join("");
    uartHexReadout.textContent = `ASCII '${currentUartChar}': 0x${hex} (LSB:${bin})`;
  }
}

if (uartInput) {
  uartInput.addEventListener("input", (e) => {
    const val = e.target.value.slice(-1) || "K";
    e.target.value = val;
    updateUartData(val);
  });
}

document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const char = btn.dataset.char;
    if (uartInput) uartInput.value = char;
    updateUartData(char);
  });
});

let activeProtocol = "i2c";
let lastProtocolFrame = 0;

function renderBitWindow(progress) {
  const labels = protocols[activeProtocol].labels;
  const active = Math.floor(progress * labels.length) % labels.length;
  bitWindow.innerHTML = labels.map((label, idx) => `<span class="${idx === active ? "active" : ""}">${label}</span>`).join("");
}

function setProtocol(name) {
  activeProtocol = name;
  document.querySelectorAll(".tab").forEach(tab => {
    const active = tab.dataset.protocol === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  if (uartControls) {
    uartControls.style.display = name === "uart" ? "flex" : "none";
  }

  const data = protocols[name];
  protocolName.textContent = data.name;
  protocolHeadline.textContent = data.headline;
  protocolDescription.textContent = data.description;
  renderBitWindow(0);
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => setProtocol(tab.dataset.protocol));
});

function drawDigitalLine(ctx, points, yHigh, yLow, color, label) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((bit, idx) => {
    const x = bit.x;
    const y = bit.v ? yHigh : yLow;
    if (idx === 0) ctx.moveTo(x, y);
    else {
      const prev = points[idx - 1];
      const prevY = prev.v ? yHigh : yLow;
      ctx.lineTo(x, prevY);
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = "700 13px JetBrains Mono, monospace";
  ctx.fillText(label, 18, (yHigh + yLow) / 2 + 5);
}

function drawProtocol(time) {
  const { width, height } = protocolSize;
  protocolCtx.clearRect(0, 0, width, height);
  if (!width || !height) return;

  const left = 82;
  const right = width - 24;
  const span = right - left;
  const now = (time * 0.00012) % 1;
  const columns = activeProtocol === "uart" ? 11 : activeProtocol === "spi" ? 10 : 13;
  const step = span / (columns - 1);

  protocolCtx.strokeStyle = "rgba(151,180,203,0.14)";
  protocolCtx.lineWidth = 1;
  for (let i = 0; i < columns; i += 1) {
    const x = left + i * step;
    protocolCtx.beginPath();
    protocolCtx.moveTo(x, 28);
    protocolCtx.lineTo(x, height - 34);
    protocolCtx.stroke();
  }

  const phase = Math.floor(now * columns);
  const labels = protocols[activeProtocol].labels;

  if (activeProtocol === "i2c") {
    const scl = [];
    const sda = [];
    const dataBits = [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1];
    for (let i = 0; i < columns; i += 1) {
      const inTransfer = i > 0 && i < columns - 1;
      scl.push({ x: left + i * step, v: !inTransfer || i % 2 === 0 });
      let value = dataBits[i] ?? 1;
      if (i === 0) value = 1;
      if (i === 1) value = 0;
      if (i === columns - 1) value = 1;
      sda.push({ x: left + i * step, v: value });
    }
    drawDigitalLine(protocolCtx, scl, 84, 126, colors.cyan, "SCL");
    drawDigitalLine(protocolCtx, sda, 184, 226, colors.green, "SDA");
  }

  if (activeProtocol === "uart") {
    const { bits } = getUartBits(currentUartChar);
    const frameBits = [1, 0, ...bits, 1];
    drawDigitalLine(protocolCtx, frameBits.map((v, i) => ({ x: left + i * step, v })), 138, 196, colors.amber, "TX");
  }

  if (activeProtocol === "spi") {
    const sclk = [];
    const mosi = [];
    const miso = [];
    const cs = [];
    const mosiBits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1];
    const misoBits = [0, 1, 0, 0, 1, 1, 0, 1, 0, 0];
    for (let i = 0; i < columns; i += 1) {
      const x = left + i * step;
      sclk.push({ x, v: i % 2 === 0 });
      mosi.push({ x, v: mosiBits[i] });
      miso.push({ x, v: misoBits[i] });
      cs.push({ x, v: i === 0 || i === columns - 1 });
    }
    drawDigitalLine(protocolCtx, cs, 54, 86, colors.rose, "CS");
    drawDigitalLine(protocolCtx, sclk, 124, 164, colors.cyan, "SCLK");
    drawDigitalLine(protocolCtx, mosi, 214, 254, colors.green, "MOSI");
    drawDigitalLine(protocolCtx, miso, 304, 344, colors.amber, "MISO");
  }

  const x = left + phase * step;
  protocolCtx.fillStyle = "rgba(72,216,255,0.12)";
  protocolCtx.fillRect(x - step * 0.45, 22, step * 0.9, height - 46);
  protocolCtx.strokeStyle = colors.cyan;
  protocolCtx.strokeRect(x - step * 0.45, 22, step * 0.9, height - 46);
  protocolCtx.fillStyle = colors.text;
  protocolCtx.font = "700 12px JetBrains Mono, monospace";
  protocolCtx.fillText(labels[phase % labels.length] || "", Math.max(16, x - 18), height - 12);

  if (time - lastProtocolFrame > 130) {
    renderBitWindow(now);
    busActivity.textContent = activeProtocol === "i2c" ? "SCL SDA ACK" : activeProtocol === "uart" ? `TX (0x${getUartBits(currentUartChar).code.toString(16).toUpperCase()})` : "SCLK MOSI MISO";
    lastProtocolFrame = time;
  }
}

let lastPipeline = 0;
function animate(time) {
  drawHero(time);
  drawProtocol(time);
  if (pipelineRunning && time - lastPipeline > 1450) {
    advancePipeline();
    lastPipeline = time;
  }
  requestAnimationFrame(animate);
}

// Hardware Project Specs Data Dictionary & Modal Control
const projectSpecs = {
  riscv: {
    label: "32-Bit Processor Core",
    title: "RISC-V RV32I Pipelined Core",
    description: "A modular 5-stage pipelined processor implementing the RV32I base integer instruction set in synthesizable Verilog HDL. Designed with modular pipeline registers, hazard detection unit, operand forwarding paths, and memory interfacing.",
    specs: [
      { label: "Architecture", value: "32-Bit RV32I Base Integer ISA" },
      { label: "Pipeline Stages", value: "5 (IF, ID, EX, MEM, WB)" },
      { label: "Hazard Unit", value: "Forwarding & Load-Use Bubble Insertion" },
      { label: "Language", value: "Verilog HDL (Vivado Verified)" },
      { label: "Memory Interfacing", value: "Separate Instruction & Data Memories" },
      { label: "Verification", value: "Bubble sort, Fibonacci, & Custom Testbenches" }
    ],
    github: "https://github.com/krishprasad63/riscv-rv32i-processor-mk2"
  },
  i2c: {
    label: "Serial Bus Controller",
    title: "Instruction-Driven Multi-Stage I2C Master",
    description: "Custom Verilog I2C master controller driven by a 32-bit instruction word format. Features dynamic START/STOP generation, slave device addressing, R/W control, clock stretching support, and byte framing.",
    specs: [
      { label: "Protocol Standard", value: "I2C (Inter-Integrated Circuit)" },
      { label: "Control Format", value: "32-bit Micro-Instruction Word" },
      { label: "Clock Signals", value: "SCL Generation with Open-Drain SDA" },
      { label: "Transfer Modes", value: "7-bit Slave Addressing, Read/Write" },
      { label: "HDL Target", value: "Verilog / Xilinx Vivado Testbench" },
      { label: "Features", value: "ACK/NACK Detection, Bus Arbitration" }
    ],
    github: "https://github.com/krishprasad63/I2C"
  },
  uart: {
    label: "Serial Communication",
    title: "UART + SPI Embedded Communication Suite",
    description: "Hardware communication controllers including a full UART transmitter/receiver with configurable baud generator, and a synchronous full-duplex SPI master/slave with mode configuration (CPOL/CPHA).",
    specs: [
      { label: "UART Features", value: "8-N-1 Frame Format, Baud Generator" },
      { label: "SPI Features", value: "Full-Duplex Shift Registers, SCLK Drive" },
      { label: "Clock Synchronization", value: "Oversampling Receiver Tick (16x)" },
      { label: "Buffers", value: "TX/RX Holding Registers & Flags" },
      { label: "Target Platform", value: "FPGA / ASIC Synthesis Ready" }
    ],
    github: "https://github.com/krishprasad63?tab=repositories"
  },
  "rtl-img": {
    label: "Hardware Accelerators",
    title: "RTL Image Processing Laboratory",
    description: "FPGA-targeted spatial filtering and pixel pipeline architecture. Processes digital image streams frame-by-frame through hardware pipelined operators (Sobel edge detection, Gaussian blur, thresholding) in real-time.",
    specs: [
      { label: "Domain", value: "Hardware Image & Vision Processing" },
      { label: "Pipeline Depth", value: "Line Buffers & 3x3 Spatial Convolution Window" },
      { label: "Processing Units", value: "Hardware Multipliers & Accumulators (MAC)" },
      { label: "Interface", value: "Streaming Pixel Clock & Valid Flags" },
      { label: "HDL Framework", value: "Verilog HDL / Vivado Simulation" }
    ],
    github: "https://github.com/krishprasad63/rtl-image-processing-lab"
  }
};

const modal = document.getElementById("projectModal");
const modalLabel = document.getElementById("modalLabel");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalGithubLink = document.getElementById("modalGithubLink");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalDismiss = document.getElementById("modalDismiss");

function openProjectModal(key) {
  const data = projectSpecs[key];
  if (!data || !modal) return;
  modalLabel.textContent = data.label;
  modalTitle.textContent = data.title;
  modalGithubLink.href = data.github;

  let html = `<p>${data.description}</p><div class="spec-grid">`;
  data.specs.forEach(s => {
    html += `<div class="spec-item"><label>${s.label}</label><span>${s.value}</span></div>`;
  });
  html += `</div>`;
  modalBody.innerHTML = html;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".module-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.dataset.project;
    if (key) openProjectModal(key);
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (modalDismiss) modalDismiss.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) {
    closeModal();
  }
});

// ScrollSpy Navigation Observer
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Email Copy Toast Notification
const copyEmailBtn = document.getElementById("copyEmailBtn");
const toast = document.getElementById("toastNotification");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    const email = "krishprasad63@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      showToast("✓ Email copied to clipboard!");
    }).catch(() => {
      showToast("✓ Email: krishprasad63@gmail.com");
    });
  });
}

createTokens();
resizeAll();
setProtocol("i2c");
updateUartData("K");
positionTokens();
initScrollSpy();
requestAnimationFrame(animate);
