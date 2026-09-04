const { spawn } = require('child_process');
const localtunnel = require('localtunnel');

console.log('🚀 Launching LIVE-SATELLITE Unified Production Gateway...');

// 1. Launch Next.js Production Server
const nextServer = spawn('npx.cmd', ['next', 'start', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
});

nextServer.on('close', (code) => {
  console.error(`Next.js server exited with code ${code}.`);
});

// 2. Launch SSH Gateway via localhost.run
function startSshTunnel() {
  console.log('📡 Starting SSH public gateway via localhost.run...');
  const ssh = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:3000', 'nokey@localhost.run'], {
    stdio: 'inherit',
  });

  ssh.on('close', (code) => {
    console.log(`SSH tunnel closed (${code}), reconnecting in 3s...`);
    setTimeout(startSshTunnel, 3000);
  });
}

// 3. Launch localtunnel
async function startLocaltunnel() {
  try {
    const tunnel = await localtunnel({ port: 3000, subdomain: 'live-satellite' });
    console.log(`🌐 Localtunnel Gateway: ${tunnel.url}`);
    tunnel.on('close', () => {
      console.log('Localtunnel closed, reconnecting in 3s...');
      setTimeout(startLocaltunnel, 3000);
    });
  } catch (e) {
    console.error('Localtunnel error, retrying...', e.message);
    setTimeout(startLocaltunnel, 3000);
  }
}

// Wait 2s for server initialization then start tunnels
setTimeout(() => {
  startSshTunnel();
  startLocaltunnel();
}, 2000);
