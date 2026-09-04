const localtunnel = require('localtunnel');

async function createTunnel() {
  try {
    const tunnel = await localtunnel({
      port: 3000,
      subdomain: 'live-satellite'
    });

    console.log('\n======================================================');
    console.log('🚀 LIVE-SATELLITE ACTIVE PUBLIC INTERNET URL:');
    console.log(`🌐 ${tunnel.url}`);
    console.log('======================================================\n');

    tunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting in 3 seconds...');
      setTimeout(createTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Tunnel creation error, retrying in 3s...', err);
    setTimeout(createTunnel, 3000);
  }
}

createTunnel();
