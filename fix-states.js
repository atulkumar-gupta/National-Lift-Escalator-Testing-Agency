const https = require('https');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0enhpbGprZ2tqZ3FmemhobmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjMwNDQsImV4cCI6MjA5MDY5OTA0NH0.91bQo1AkRjfWmTBSukr6t4Gh3sPT_qjll0oUhW-ZEus';

// Corrections based on careful reading of title + description
const fixes = {
  24:  'Maharashtra',    // Ichalkaranji textile mill, Maharashtra
  26:  'Bihar',          // Muzaffarpur junction, Bihar
  28:  'Bihar',          // Bihar news tag, 5th floor maid death
  51:  'Jharkhand',      // Hotel Ramada Jamshedpur, Jharkhand
  67:  'Uttarakhand',    // SIDCUL Uttarakhand factory, Rampur worker
  68:  'Jharkhand',      // Ranchi Trivenipuram apartments
  70:  'Punjab',         // Jalandhar warehouse factory
  73:  'Punjab',         // Ludhiana factory forklift
  74:  'Uttarakhand',    // Reddit r/Uttarakhand
  75:  'Himachal Pradesh', // Shimla tourism lift, students
  81:  'Haryana',        // Ambala city cloth shop
  91:  'Andhra Pradesh', // Vijayawada Thermal Power Station, NTR district
  95:  'Madhya Pradesh', // Gwalior Hotel Royal Inn
  97:  'Uttar Pradesh',  // Meerut South Rapid station
  98:  'Rajasthan',      // Jaipur Jagatpura society
  99:  'Maharashtra',    // Mumbai Borivali
  101: 'Gujarat',        // Udhna Industries Surat factory
  104: 'Kerala',         // Kerala Assembly, Thiruvananthapuram
  114: 'Gujarat',        // Bhavnagar cold storage, Gujarat
  116: 'Telangana',      // Hyderabad, Nizamabad district commandant
  117: 'Uttar Pradesh',  // Aligarh (Tala Nagari), body sent to Bihar
  123: 'Madhya Pradesh', // Dhar railway station, MP
  126: 'Haryana',        // Faridabad Mujesar factory
  127: 'Delhi',          // Mandoli Delhi factory
  130: 'Gujarat',        // Navsari, Gujarat
  131: 'Chhattisgarh',   // Sakti district Chhattisgarh RKM Powergen
  132: 'Telangana',      // Hyderabad Mehdipatnam
  148: 'Haryana',        // Panchkula BJP office, Haryana minister
  150: 'Bihar',          // Patna AG Colony Aris Hotel
  155: 'Telangana',      // Telangana Elevator Association, Hyderabad
  159: 'Kerala',         // Kerala hospital, Thiruvananthapuram
  177: 'Maharashtra',    // Vikhroli Mumbai MHADA
  203: 'Chhattisgarh',   // Raipur Khamtarai Dolphin Jewelo apartment
  214: 'Punjab',         // Ludhiana Penta House restaurant
  216: 'Tamil Nadu',     // Trichy Gandhi market
  224: 'Madhya Pradesh', // Indore Scheme 140 Grand Exotic Sunshine
  225: 'Haryana',        // Gurgaon PG facility
  232: 'Haryana',        // Yamuna Nagar hospital, Haryana
  235: 'Haryana',        // Sonipat police line, Haryana
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
  const entries = Object.entries(fixes);
  for (const [id, state] of entries) {
    const r = await patch(Number(id), state);
    if (r.status !== 204) console.log(`ID ${id}: status ${r.status}`);
  }
  console.log(`Done. Fixed ${entries.length} records.`);
}

run();
