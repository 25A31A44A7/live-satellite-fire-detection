// Verification script for authenticated & protected routes

async function verifyProtectedRoutes() {
  console.log('🔒 Testing Authenticated Protected Routes...');
  const baseUrl = 'http://localhost:3000';

  // 1. Authenticate as Admin
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@live-satellite.org', password: 'admin123' }),
  });

  const cookieHeader = loginRes.headers.get('set-cookie');
  if (!cookieHeader) {
    console.error('❌ Failed to get session cookie');
    return;
  }

  const tokenCookie = cookieHeader.split(';')[0];
  console.log('  ✅ Admin authentication successful. Session cookie retrieved.');

  const protectedRoutes = [
    '/dashboard',
    '/map',
    '/historical',
    '/thermal-sources',
    '/alerts',
    '/analytics',
    '/reports',
    '/settings',
    '/admin'
  ];

  let passed = 0;
  for (const route of protectedRoutes) {
    const res = await fetch(`${baseUrl}${route}`, {
      headers: { Cookie: tokenCookie },
    });
    if (res.ok) {
      const html = await res.text();
      console.log(`  ✅ Protected route ${route} -> Status ${res.status} (${html.length} bytes)`);
      passed++;
    } else {
      console.error(`  ❌ Protected route ${route} -> Status ${res.status}`);
    }
  }

  console.log(`\n🎉 Verified ${passed}/${protectedRoutes.length} protected dashboard routes.`);
}

verifyProtectedRoutes();
