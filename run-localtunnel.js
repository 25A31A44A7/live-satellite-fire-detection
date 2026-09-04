const localtunnel = require('localtunnel');

async function start() {
  const subdomains = ['live-satellite', 'live-satellite-app', 'live-satellite-radar', 'live-satellite-platform'];
  for (const sub of subdomains) {
    try {
      console.log(`Trying subdomain: ${sub}...`);
      const tunnel = await localtunnel({ port: 3000, subdomain: sub });
      console.log(`\n🎉 SUCCESS! LIVE-SATELLITE PUBLIC URL:\n🔗 ${tunnel.url}\n`);
      tunnel.on('close', () => console.log('Tunnel closed'));
      tunnel.on('error', (e) => console.log('Tunnel error:', e));
      return;
    } catch (e) {
      console.log(`Subdomain ${sub} failed:`, e.message);
    }
  }
}

start();
