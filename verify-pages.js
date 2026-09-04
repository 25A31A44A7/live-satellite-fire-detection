// Verification script for all HTML pages

async function verifyPages() {
  console.log('🔍 Testing all Frontend Page Routes...');
  const baseUrl = 'http://localhost:3000';
  const routes = [
    '/',
    '/login',
    '/register',
    '/sources',
    '/status'
  ];

  let passed = 0;
  for (const r of routes) {
    try {
      const res = await fetch(`${baseUrl}${r}`);
      if (res.ok) {
        const html = await res.text();
        console.log(`  ✅ Page ${r} -> Status ${res.status} (${html.length} bytes rendered)`);
        passed++;
      } else {
        console.error(`  ❌ Page ${r} -> Status ${res.status}`);
      }
    } catch (e) {
      console.error(`  ❌ Page ${r} -> Error: ${e.message}`);
    }
  }

  console.log(`\nVerified ${passed}/${routes.length} public and documentation pages.`);
}

verifyPages();
