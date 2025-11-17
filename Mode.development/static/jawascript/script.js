
// Maaf bang terkadang developer-nya absurd dan juga sedikit anh

const API_URL = '/mwehehe';

// element
const elements = {
  cpu: { chart: 'cpuChart', percent: 'cpu-percent-text', cores: 'cpu-cores-text', threads: 'cpu-threads-text', speed: 'cpu-speed-text' },
  ram: { chart: 'ramChart', percent: 'ram-percent-text', usage: 'ram-usage-text' },
  disk: { chart: 'diskChart', percent: 'disk-percent-text', usage: 'disk-usage-text' }
};

const statusText = document.getElementById('status-text');
const yearSpan = document.getElementById('current-year');

// init
yearSpan.textContent = new Date().getFullYear();


// charts
const charts = {};
Object.keys(elements).forEach(type => {
  const canvas = document.getElementById(elements[type].chart);
  charts[type] = new Chart(canvas, {
    type: 'doughnut',
    data: { datasets: [{
      data: [0, 100],
      borderColor: [getComputedStyle(document.documentElement).getPropertyValue('--accent'), '#333'],
      borderWidth: [6, 8],
      backgroundColor: 'transparent',
      cutout: '100%'
    }]},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 666, easing: 'easeOutQuart' },
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
  });
});

// update
function updateChart(type, value) {
  charts[type].data.datasets[0].data = [value, 100 - value];
  charts[type].update();
}

async function fetchStats() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    updateChart('cpu', data.cpu_percent);
    updateChart('ram', data.ram_percent);
    updateChart('disk', data.disk_percent);

    document.getElementById(elements.cpu.percent).textContent = `${Math.round(data.cpu_percent)}%`;
    document.getElementById(elements.ram.percent).textContent = `${Math.round(data.ram_percent)}%`;
    document.getElementById(elements.disk.percent).textContent = `${Math.round(data.disk_percent)}%`;

    document.getElementById(elements.cpu.cores).textContent = `${data.cpu_details.cores} Core`;
    document.getElementById(elements.cpu.threads).textContent = `${data.cpu_details.threads} Thread`;
    document.getElementById(elements.cpu.speed).textContent = `${data.cpu_details.speed} GHz`;
    document.getElementById(elements.ram.usage).textContent = `${data.ram_details.used} GB / ${data.ram_details.total} GB`;
    document.getElementById(elements.disk.usage).textContent = `${data.disk_details.used} GB / ${data.disk_details.total} GB`;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    statusText.innerHTML = `<span>Terhubung nih</span>. Diperbarui: ${time}`;
    statusText.style.color = 'var(--accent)';

  } catch (err) {
    console.error(err);
    statusText.innerHTML = `Gagal terhubung nihh. Mencoba lagi...`;
    statusText.style.color = '#FF6B6B';
  }
}

// ripple effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = size + 'px';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// matrix rain (desktop Only)
const canvas = document.getElementById('matrixCanvas');
if (window.innerWidth > 768) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = '1110101001011110101011100101011011101010111';
  const fontSize = 14;
  let columns = canvas.width / fontSize;
  let drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.8) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 1111);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(1);
  });
}

// start aja dehhhhh
fetchStats();
setInterval(fetchStats, 7000);
