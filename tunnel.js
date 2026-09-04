const localtunnel = require('localtunnel');

(async () => {
  try {
    console.log('📡 Requesting public tunnel for LIVE-SATELLITE on port 3000...');
    const tunnel = await localtunnel({
      port: 3000,
      subdomain: 'live-satellite'
    });

    console.log('\n=============================================================');
    console.log('🌍 LIVE-SATELLITE PUBLIC WORKING URL:');
    console.log(`🔗 ${tunnel.url}`);
    console.log('=============================================================\n');

    tunnel.on('close', () => {
      console.log('Tunnel connection closed.');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err);
  }
})();
