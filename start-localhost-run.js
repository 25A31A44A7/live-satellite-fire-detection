const { spawn } = require('child_process');

function start() {
  console.log('Starting SSH tunnel via localhost.run...');
  const child = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:3000', 'nokey@localhost.run'], {
    stdio: 'inherit'
  });

  child.on('close', (code) => {
    console.log(`SSH tunnel exited with code ${code}, restarting in 3s...`);
    setTimeout(start, 3000);
  });
}

start();
