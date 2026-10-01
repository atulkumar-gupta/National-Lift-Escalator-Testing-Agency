const https = require('https');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0enhpbGprZ2tqZ3FmemhobmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjMwNDQsImV4cCI6MjA5MDY5OTA0NH0.91bQo1AkRjfWmTBSukr6t4Gh3sPT_qjll0oUhW-ZEus';

const fixes = {
  66:  'Gujarat',        // Ahmedabad Naroda - Devashish Flat (Gujarat Samachar source)
  111: 'Maharashtra',    // Mumbai housing society - boy killed
  169: 'Tamil Nadu',     // Kancheepuram/Tiruvannamalai - Tamil Nadu
  247: 'Karnataka',      // Bengaluru area - two workers repairing lift
  250: 'Telangana',      // ESIC Sanathnagar Hyderabad - 19yr labourer
  251: 'Maharashtra',    // Mumbai apartment maid death
  252: 'Uttar Pradesh',  // UP society - faulty lift girl blocks door (correct)
  263: 'Telangana',      // Hyderabad police officer died in lift
  266: 'Maharashtra',    // Gajanan Ferro - Maharashtra
  267: 'Maharashtra',    // construction material lift rope break - Maharashtra context
  279: 'Haryana',        // hydraulic lift mishap - Gurugram context
  280: 'Haryana',        // hydraulic lift cable broke - Gurugram context
  316: 'Andhra Pradesh', // Vijayawada court - Andhra Pradesh (not Arunachal Pradesh)
  321: 'Tamil Nadu',     // Erode construction site - Tamil Nadu
};

function patch(id, state) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ state });
    const options = {
      hostname: 'btzxiljkgkjgqfzhhnfe.supabase.co',
      path: `/rest/v1/news?id=eq.${id}`,
      method: 'PATCH',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', () => resolve({ id, state, status: res.statusCode }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  for (const [id, state] of Object.entries(fixes)) {
    const r = await patch(Number(id), state);
    console.log(`ID ${id} -> ${state} (${r.status === 204 ? 'OK' : 'FAIL ' + r.status})`);
  }
  console.log('Done.');
}

run();
