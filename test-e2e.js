// Automated End-to-End System Verification for LIVE-SATELLITE

async function runTests() {
  console.log('🚀 Running LIVE-SATELLITE Verification Suite...');
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ ${name}:`, e.message);
      failed++;
    }
  }

  // Wait 1.5s for server startup
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Landing Page
  await test('Landing Page HTTP 200', async () => {
    const res = await fetch(`${baseUrl}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });

  // 2. Status API
  await test('System Status API', async () => {
    const res = await fetch(`${baseUrl}/api/status`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'OPERATIONAL') throw new Error('Status not operational');
    if (!data.components?.database) throw new Error('DB component missing');
  });

  // 3. Live Fires API
  let sampleFireId = null;
  await test('Live Satellite Fires API', async () => {
    const res = await fetch(`${baseUrl}/api/fires/live?limit=10`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.fires || data.fires.length === 0) throw new Error('No fires returned');
    sampleFireId = data.fires[0].id;
  });

  // 4. Fire Details Profile API
  if (sampleFireId) {
    await test(`Fire Event Profile API (${sampleFireId})`, async () => {
      const res = await fetch(`${baseUrl}/api/fires/${sampleFireId}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.fire || !data.fire.locationName) throw new Error('Fire profile payload missing');
    });
  }

  // 5. Historical Fires API
  await test('Historical Fire Archive API', async () => {
    const res = await fetch(`${baseUrl}/api/fires/historical?timeRange=30d`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.events || data.events.length === 0) throw new Error('Historical records empty');
  });

  // 6. Persistent Thermal Sources API
  await test('Persistent Thermal Sources Clustering API', async () => {
    const res = await fetch(`${baseUrl}/api/thermal-sources`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.clusters || data.clusters.length === 0) throw new Error('Persistent clusters empty');
  });

  // 7. Real-Time Alerts API
  await test('Alerts API Feed', async () => {
    const res = await fetch(`${baseUrl}/api/alerts`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.counts) throw new Error('Alert counts missing');
  });

  // 8. Analytics API
  await test('Fire Intelligence Analytics API', async () => {
    const res = await fetch(`${baseUrl}/api/analytics`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.stats || !data.classificationData) throw new Error('Analytics telemetry missing');
  });

  // 9. Auth Login (Admin & Demo User)
  await test('Auth Login API (Admin & User)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@live-satellite.org', password: 'admin123' }),
    });
    if (!res.ok) throw new Error(`Login failed with status ${res.status}`);
    const data = await res.json();
    if (!data.user || data.user.role !== 'ADMIN') throw new Error('Admin role missing');
  });

  // 10. Auth Registration
  await test('Auth Registration API', async () => {
    const uniqueEmail = `analyst-${Date.now()}@satellite-unit.gov`;
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Field Operations Specialist',
        email: uniqueEmail,
        password: 'securePassword2026',
      }),
    });
    if (!res.ok) throw new Error(`Registration failed with status ${res.status}`);
    const data = await res.json();
    if (!data.user) throw new Error('Registered user missing');
  });

  console.log('\n======================================================');
  console.log(`🎯 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTests();
