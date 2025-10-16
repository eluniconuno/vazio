const posterPrincipal = '../Imagens/poster.png';
const glitchImages = [
  'Imagens/glitch1.png',
  'Imagens/glitch2.png',
  'Imagens/glitch3.png',
  'Imagens/glitch4.png',
  'Imagens/glitch5.png',
  'Imagens/glitch6.png',
  'Imagens/glitch7.png',
  'Imagens/glitch8.png',
  'Imagens/glitch9.png',
  'Imagens/glitch10.png'
];
const manifestoTxt = `Hoje, criar é conversar com o código,
é pedir à máquina para sonhar junto.
Sou autor, mas também usuário,
operador, colaborador,
perdido e achado na rede.

O erro não é só falha —
é linguagem, é coassinatura.
Entre comandos, prompts, variáveis,
meu traço se mistura ao da máquina,
e já não sei onde termina o eu
e começa o digital.

A criação é ruído, fusão, glitch:
fragmentos de pensamento humano
processados, distorcidos, rearranjados
por inteligências sintéticas.

Ser autor hoje é aceitar a dissolução do controle,
é abrir espaço para o imprevisível,
é ouvir a resposta da máquina
e chamá-la de coautora.

Este é o manifesto de uma mente saturada
que busca sentido entre o caos dos dados,
que aceita ser múltipla, híbrida, assistida,
e encontra potência no colapso
entre o toque humano e o cálculo artificial.`;

const canvasInicio = document.getElementById('canvas-inicio');
const canvasGlitch = document.getElementById('canvas-glitch');
const canvasBrinde = document.getElementById('canvas-brinde');
const btnIniciar = document.getElementById('btn-iniciar');
const btnAvancarCartaz = document.getElementById('btn-avancar-cartaz');
const btnProximo = document.getElementById('btn-proximo');
const btnGlitchPalavra = document.getElementById('btn-glitch-palavra');
const btnBaixarBrinde = document.getElementById('btn-baixar-brinde');
const userInput = document.getElementById('userInput');
const manifestoAnimado = document.getElementById('manifesto-animado');

let ordemGlitch = [];
let indexGlitch = 0;

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showStage(stageId) {
  document.querySelectorAll('.stage').forEach(div => div.classList.remove('active'));
  document.getElementById(stageId).classList.add('active');
}

// Imagem proporcional no canvas
function drawImageProportional(canvas, imgSrc) {
  const img = new Image();
  img.src = imgSrc;
  img.onload = function () {
    let ctx = canvas.getContext('2d');
    let canvasW = canvas.width = window.innerWidth;
    let canvasH = canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvasW, canvasH);
    let ratio = Math.min(canvasW / img.width, canvasH / img.height);
    let newW = img.width * ratio;
    let newH = img.height * ratio;
    let offsetX = (canvasW - newW) / 2;
    let offsetY = (canvasH - newH) / 2;
    ctx.drawImage(img, offsetX, offsetY, newW, newH);
  };
}

// ====== 1. Poster principal ======
function drawPosterPrincipal() {
  drawImageProportional(canvasInicio, posterPrincipal);
}
drawPosterPrincipal();

// ====== 2. Manifesto animado ======
function animarManifestoBinario() {
  btnAvancarCartaz.style.display = "none";
  manifestoAnimado.style.color = "#00ff00";
  manifestoAnimado.style.fontSize = "1.07rem";
  let binario = manifestoTxt.replace(/\n/g, ' ').split('')
    .map(c => c === ' ' ? ' ' : c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  let t = 0;
  let step = Math.ceil(binario.length / 36);
  manifestoAnimado.textContent = "";
  let interval = setInterval(() => {
    if (t < binario.length) {
      manifestoAnimado.textContent = binario.slice(0, t);
      t += step;
    } else {
      clearInterval(interval);
      manifestoAnimado.textContent = manifestoTxt;
      btnAvancarCartaz.style.display = "flex";
    }
  }, 75);
}

// ====== 3. Cartazes glitchados ======
function drawGlitchPoster(src, doTransition=true) {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    let ctx = canvasGlitch.getContext('2d');
    let canvasW = canvasGlitch.width = window.innerWidth;
    let canvasH = canvasGlitch.height = window.innerHeight;
    ctx.clearRect(0, 0, canvasW, canvasH);
    let ratio = Math.min(canvasW / img.width, canvasH / img.height);
    let newW = img.width * ratio;
    let newH = img.height * ratio;
    let offsetX = (canvasW - newW) / 2;
    let offsetY = (canvasH - newH) / 2;
    ctx.drawImage(img, offsetX, offsetY, newW, newH);
    if (doTransition) glitchTransition(ctx, offsetX, offsetY, newW, newH, img);
  };
}

function glitchTransition(ctx, offsetX, offsetY, newW, newH, img) {
  let frames = 12;
  let count = 0;
  let interval = setInterval(() => {
    if (count < frames) {
      for (let i = 0; i < 14; i++) {
        let y = Math.floor(Math.random() * newH);
        let h = Math.floor(10 + Math.random() * 20);
        ctx.drawImage(canvasGlitch, 0, offsetY + y, canvasGlitch.width, h, Math.random() * 16, offsetY + y, canvasGlitch.width - Math.random()*20, h);
      }
      for (let i = 0; i < 30; i++) {
        let x = Math.random() * newW;
        let y = Math.random() * newH;
        let w = 7 + Math.random() * 12;
        let h = 7 + Math.random() * 12;
        let d = ctx.getImageData(offsetX + x, offsetY + y, w, h);
        for (let k = 0; k < d.data.length; k += 4) {
          let r = d.data[k], g = d.data[k+1], b = d.data[k+2];
          d.data[k] = r ^ g; d.data[k+1] = g ^ b; d.data[k+2] = b ^ r;
        }
        ctx.putImageData(d, offsetX + x, offsetY + y);
      }
      count++;
    } else {
      ctx.drawImage(img, offsetX, offsetY, newW, newH);
      clearInterval(interval);
      btnProximo.disabled = false;
    }
  }, 45);
  btnProximo.disabled = true;
}

// ====== 4. Poster brinde ======
function drawBrindePoster() {
  drawImageProportional(canvasBrinde, ordemGlitch[ordemGlitch.length - 1]);
}

btnGlitchPalavra.onclick = () => {
  let txt = userInput.value.trim();
  if (!txt) return;
  let ctx = canvasBrinde.getContext('2d');
  const img = new Image();
  img.src = ordemGlitch[ordemGlitch.length - 1];
  img.onload = function () {
    let canvasW = canvasBrinde.width = window.innerWidth;
    let canvasH = canvasBrinde.height = window.innerHeight;
    ctx.clearRect(0, 0, canvasW, canvasH);
    let ratio = Math.min(canvasW / img.width, canvasH / img.height);
    let newW = img.width * ratio;
    let newH = img.height * ratio;
    let offsetX = (canvasW - newW) / 2;
    let offsetY = (canvasH - newH) / 2;
    ctx.drawImage(img, offsetX, offsetY, newW, newH);

    let palettes = [
      ["#00ffea", "#ff00ff", "#f6ff00", "#ff2222", "#00ff00"],
      ["#ff8800", "#00ff88", "#ff00ff", "#ff2222", "#00ff00"],
      ["#0077ff", "#ff00c4", "#fdff00", "#ff2222", "#00ff00"],
      ["#ff00ff", "#00fff7", "#fff800", "#ff2222", "#00ff00"],
      ["#2bffaf", "#ff2baf", "#f6ff00", "#ff2222", "#00ff00"]
    ];
    let palette = palettes[Math.floor(Math.random()*palettes.length)];
    let fontSizes = [44, 52, 62, 74, 80, 88];
    for (let layer = 0; layer < 6; layer++) {
      ctx.save();
      ctx.globalAlpha = 0.39 + Math.random()*0.25;
      ctx.font = `bold ${fontSizes[layer]}px 'Roboto Mono', monospace`;
      ctx.shadowColor = palette[layer % palette.length];
      ctx.shadowBlur = 7 + Math.random()*10;
      ctx.fillStyle = palette[(layer + Math.floor(Math.random()*palette.length)) % palette.length];
      ctx.translate(Math.random() * 25, Math.random() * 22);
      ctx.rotate((Math.random()-0.5)*0.16);
      for (let y = 0; y < canvasH; y += fontSizes[layer]+Math.random()*12) {
        for (let x = -canvasW/2; x < canvasW; x += 120+Math.random()*90) {
          ctx.globalCompositeOperation = (layer%2===0) ? 'lighter' : 'multiply';
          ctx.fillText(txt, x + y/2 + Math.random()*23, y + Math.random()*18);
        }
      }
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.font = `bold 2.2rem 'Roboto Mono', monospace`;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(txt, canvasW/2, canvasH/2);
    ctx.restore();
  };
};

btnBaixarBrinde.onclick = () => {
  baixarCanvas(canvasBrinde, 'cartaz_brinde.png');
};

function baixarCanvas(canvas, filename) {
  let link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

btnIniciar.onclick = () => {
  showStage('stage-manifesto');
  animarManifestoBinario();
};
btnAvancarCartaz.onclick = () => {
  ordemGlitch = shuffle(glitchImages);
  indexGlitch = 0;
  showStage('stage-glitch');
  drawGlitchPoster(ordemGlitch[indexGlitch], true);
};
btnProximo.onclick = () => {
  if (indexGlitch < ordemGlitch.length - 1) {
    indexGlitch++;
    drawGlitchPoster(ordemGlitch[indexGlitch], true);
    if (indexGlitch === ordemGlitch.length - 1) {
      btnProximo.textContent = "Avançar";
    }
  } else {
    showStage('stage-brinde');
    drawBrindePoster();
    btnProximo.textContent = "Próxima Imagem";
  }
};

window.addEventListener('resize', () => {
  if (document.getElementById('stage-inicio').classList.contains('active')) drawPosterPrincipal();
  if (document.getElementById('stage-glitch').classList.contains('active') && ordemGlitch.length)
    drawGlitchPoster(ordemGlitch[indexGlitch], false);
  if (document.getElementById('stage-brinde').classList.contains('active')) drawBrindePoster();
});

showStage('stage-inicio');

