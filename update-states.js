const https = require('https');

const SUPABASE_URL = 'btzxiljkgkjgqfzhhnfe.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0enhpbGprZ2tqZ3FmemhobmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjMwNDQsImV4cCI6MjA5MDY5OTA0NH0.91bQo1AkRjfWmTBSukr6t4Gh3sPT_qjll0oUhW-ZEus';

// id -> state mapping based on title analysis
const updates = {
  8: 'Karnataka',       // Bengaluru
  9: 'Madhya Pradesh',  // Bhopal
  10: 'Uttar Pradesh',  // Greater Noida
  11: 'Uttar Pradesh',  // Greater Noida West
  12: 'Haryana',        // Gurugram
  13: 'Uttar Pradesh',  // Medical college (UP context)
  16: 'Delhi',          // Delhi airport
  17: 'Punjab',         // Mohali
  18: 'Maharashtra',    // Pune
  19: 'West Bengal',    // Kolkata
  20: 'Haryana',        // Rewari
  21: 'Telangana',      // Bhupalapally
  22: 'Maharashtra',    // Maharashtra
  23: 'Uttar Pradesh',  // Noida sector 67
  24: 'Uttar Pradesh',  // general UP context
  25: 'Bihar',          // Muzaffarpur/Darbhanga
  26: 'Uttar Pradesh',  // Junction (UP context)
  27: 'Tamil Nadu',     // Puzhuthivakkam MRTS Chennai
  28: 'Uttar Pradesh',  // general UP context
  29: 'Delhi',          // Outer Delhi
  30: 'Uttar Pradesh',  // Kanpur
  31: 'Madhya Pradesh', // Bhopal
  32: 'Madhya Pradesh', // Bhopal
  33: 'Uttar Pradesh',  // Fatehpur
  34: 'Uttar Pradesh',  // Ghaziabad
  35: 'Telangana',      // Hyderabad
  36: 'Himachal Pradesh', // Kangra/Himachal
  37: 'Madhya Pradesh', // Bhopal
  38: 'Rajasthan',      // Jaipur
  39: 'Maharashtra',    // Marathi text - Maharashtra
  40: 'Bihar',          // Muzaffarpur/Darbhanga
  41: 'Maharashtra',    // Mumbai Chembur
  43: 'Uttar Pradesh',  // UP Bill
  44: 'Uttar Pradesh',  // UP Draft Bill
  45: 'Himachal Pradesh', // Shimla
  46: 'Delhi',          // Delhi Factory
  47: 'Jharkhand',      // Bokaro
  48: 'Jammu & Kashmir', // Jammu hospital
  49: 'Uttarakhand',    // Doon Hospital Dehradun
  50: 'Uttar Pradesh',  // general context
  51: 'Rajasthan',      // Hotel Ramada (Jaipur context)
  52: 'Jharkhand',      // Koderma thermal plant
  54: 'Uttar Pradesh',  // society lift
  55: 'Madhya Pradesh', // Gwalior
  56: 'Himachal Pradesh', // Himachal trolley lift
  57: 'Jharkhand',      // Ranchi
  58: 'Himachal Pradesh', // Kangra context
  59: 'Jharkhand',      // Koderma station
  60: 'Madhya Pradesh', // Bhopal
  61: 'Telangana',      // Hyderabad
  62: 'Uttar Pradesh',  // Ghaziabad
  63: 'Jharkhand',      // Ranchi
  64: 'Himachal Pradesh', // Kangra context
  65: 'Maharashtra',    // Malegaon
  66: 'Maharashtra',    // Malegaon context
  67: 'Jharkhand',      // Jharkhand factory
  68: 'Uttar Pradesh',  // posh complex UP context
  69: 'Maharashtra',    // Malegaon Mahapalika
  70: 'Uttar Pradesh',  // general
  71: 'Uttar Pradesh',  // Noida
  72: 'Haryana',        // Panipat
  73: 'Haryana',        // Panipat factory
  74: 'Maharashtra',    // repeated crashes context
  75: 'Uttar Pradesh',  // students trapped
  76: 'Gujarat',        // Surat
  77: 'Maharashtra',    // Chembur
  78: 'Bihar',          // Muzaffarpur context
  79: 'Uttarakhand',    // Dehradun
  80: 'Delhi',          // Rohini Sec 21
  81: 'Uttar Pradesh',  // general
  82: 'Himachal Pradesh', // IGMC - Shimla
  83: 'Uttarakhand',    // Dehradun
  84: 'Jharkhand',      // Dhanbad SNMMCH
  85: 'Jharkhand',      // Pakur railway station
  86: 'Maharashtra',    // Mumbai Byculla
  87: 'Uttar Pradesh',  // Ghazipur
  88: 'Maharashtra',    // Pimpri Chinchwad
  89: 'Maharashtra',    // Pune
  90: 'Andhra Pradesh', // Markapuram
  91: 'Uttar Pradesh',  // construction workers UP
  92: 'Karnataka',      // Chandra layout Bengaluru
  93: 'Punjab',         // Mohali
  94: 'Chandigarh',     // Chandigarh
  95: 'Uttar Pradesh',  // general UP
  96: 'Chhattisgarh',   // Chhattisgarh power plant
  97: 'Uttar Pradesh',  // Rapid station (Ghaziabad RRTS)
  98: 'Uttar Pradesh',  // multi-storey building UP
  99: 'Uttar Pradesh',  // general
  100: 'Uttar Pradesh', // Ghaziabad
  101: 'Uttar Pradesh', // general UP
  102: 'Maharashtra',   // PIL context Maharashtra
  103: 'Andhra Pradesh',// Andhra deputy CM
  104: 'Telangana',     // Assembly - Telangana
  105: 'Haryana',       // Sikandarpur metro (Gurugram)
  106: 'Maharashtra',   // Vasai
  107: 'Delhi',         // Bawana Delhi
  108: 'Bihar',         // Bhagalpur
  109: 'Bihar',         // Sasaram railway station
  110: 'Bihar',         // Darbhanga station
  111: 'Uttar Pradesh', // general UP
  112: 'Maharashtra',   // Worli Mumbai
  113: 'Uttar Pradesh', // Noida sector 125
  114: 'Uttar Pradesh', // general UP
  115: 'Uttar Pradesh', // Ghaziabad
  116: 'Uttar Pradesh', // Commandant UP context
  117: 'Bihar',         // body sent to Bihar
  118: 'Telangana',     // Hyderabad
  119: 'Delhi',         // Delhi factory
  120: 'Delhi',         // Delhi Vishal Mega Mart
  121: 'Uttar Pradesh', // Meerut South Station
  122: 'Delhi',         // Karol Bagh
  123: 'Uttar Pradesh', // railway station UP
  124: 'Telangana',     // Telangana HC
  125: 'Telangana',     // Hyderabad DRF
  126: 'Uttar Pradesh', // general UP
  127: 'Uttar Pradesh', // factory UP
  128: 'Karnataka',     // Jayanagar Bengaluru
  129: 'Punjab',        // GMADA Mohali
  130: 'Uttar Pradesh', // general UP
  131: 'Uttar Pradesh', // general UP
  132: 'Uttar Pradesh', // general UP
  133: 'Uttar Pradesh', // Ghaziabad
  134: 'Uttar Pradesh', // general UP
  135: 'Uttar Pradesh', // Govindpuram Ghaziabad
  136: 'Uttar Pradesh', // Panchsheel society Noida
  137: 'Uttar Pradesh', // AIIMS Green Avenue Noida
  138: 'Uttar Pradesh', // Greater Noida
  139: 'Uttar Pradesh', // Gaur City Greater Noida
  140: 'Uttar Pradesh', // Greater Noida
  141: 'Uttar Pradesh', // Noida Yatharth Hospital
  142: 'Uttar Pradesh', // Greater Noida West Yatharth
  143: 'Uttar Pradesh', // Bisrakh Greater Noida
  144: 'Uttar Pradesh', // Ghaziabad
  145: 'Uttar Pradesh', // Greater Noida West
  146: 'Haryana',       // Gurugram hotel
  147: 'Madhya Pradesh',// Gwalior hotel
  148: 'Chhattisgarh',  // Panchkamal (Raipur context)
  149: 'Uttar Pradesh', // Lucknow
  150: 'Uttar Pradesh', // AG Colony (Allahabad/Prayagraj)
  151: 'Tamil Nadu',    // Chennai Hyatt Regency
  152: 'Uttar Pradesh', // IMS Ghaziabad
  153: 'Uttar Pradesh', // goods lift UP
  154: 'Jharkhand',     // Koderma thermal plant
  155: 'Maharashtra',   // city context Maharashtra
  156: 'Karnataka',     // KGF director - Karnataka
  157: 'Uttar Pradesh', // undergarment factory UP
  158: 'Kerala',        // Kerala jeweller
  159: 'Uttar Pradesh', // general UP
  160: 'Maharashtra',   // Mumbai Dharavi
  161: 'West Bengal',   // Madan Mitra - West Bengal
  162: 'Uttar Pradesh', // Greater Noida
  163: 'Uttar Pradesh', // Ghaziabad Sahibabad
  164: 'Uttar Pradesh', // Noida
  165: 'Uttar Pradesh', // Greater Noida
  166: 'Telangana',     // Sanathnagar ESIC Hyderabad
  167: 'Uttar Pradesh', // Greater Noida
  168: 'Uttar Pradesh', // Ghaziabad
  169: 'Maharashtra',   // general Maharashtra
  170: 'Uttar Pradesh', // Ghaziabad
  171: 'Madhya Pradesh',// Chhindwara
  172: 'Tamil Nadu',    // Chennai
  173: 'Chhattisgarh',  // Raipur
  174: 'Chhattisgarh',  // Raipur
  176: 'Punjab',        // Ludhiana
  177: 'Uttar Pradesh', // construction workers UP
  178: 'Maharashtra',   // Andheri railway station
  179: 'Maharashtra',   // Pune Civil Court Metro
  180: 'Karnataka',     // Mangaluru
  181: 'Uttar Pradesh', // Meerut
  182: 'Punjab',        // Punjab police
  183: 'Maharashtra',   // Mumbai
  184: 'Maharashtra',   // Roys Galaxy Maharashtra
  185: 'Maharashtra',   // residential building Maharashtra
  186: 'Bihar',         // Bihar minister
  187: 'Uttar Pradesh', // general UP
  188: 'Uttar Pradesh', // Noida
  190: 'Uttar Pradesh', // Noida
  191: 'Uttar Pradesh', // Noida
  192: 'Uttar Pradesh', // general UP
  193: 'Madhya Pradesh',// Indore
  194: 'Uttar Pradesh', // Noida
  195: 'Haryana',       // Panchkula
  196: 'Uttar Pradesh', // general UP
  197: 'Maharashtra',   // Maharashtra child
  198: 'Maharashtra',   // Thane
  199: 'Maharashtra',   // Wagholi Pune
  200: 'Rajasthan',     // Rajasthan mine
  201: 'Kerala',        // TVM Medical College Kerala
  202: 'Uttar Pradesh', // Ghaziabad
  203: 'Uttar Pradesh', // apartment UP
  204: 'Telangana',     // Nizampet school
  205: 'Maharashtra',   // six firemen Maharashtra
  206: 'Telangana',     // Hyderabad
  207: 'Uttar Pradesh', // Ghaziabad district court
  208: 'Uttar Pradesh', // Ghaziabad
  209: 'Haryana',       // Panchkula hotel
  210: 'Telangana',     // Nizamabad Telangana
  211: 'Telangana',     // Macherial Telangana
  212: 'Maharashtra',   // Thane Vartak Nagar
  213: 'Uttar Pradesh', // Ghaziabad
  214: 'Uttar Pradesh', // Penta House restaurant UP
  216: 'Uttar Pradesh', // general UP
  217: 'Delhi',         // South Delhi
  218: 'Uttar Pradesh', // general UP
  219: 'Rajasthan',     // Udaipur
  220: 'Telangana',     // Hyderabad JP Nadda
  221: 'Uttar Pradesh', // Noida
  222: 'Uttarakhand',   // Dehradun
  223: 'Gujarat',       // Vadodara
  224: 'Uttar Pradesh', // general UP
  225: 'Uttar Pradesh', // general UP
  226: 'Tamil Nadu',    // Chennai mall
  227: 'Haryana',       // Jind
  229: 'Bihar',         // Patna
  230: 'Uttar Pradesh', // general UP
  231: 'Uttar Pradesh', // Kanpur Dehat
  232: 'Uttar Pradesh', // district hospital UP
  233: 'Uttar Pradesh', // Jaunpur
  234: 'Bihar',         // Darbhanga
  235: 'Uttar Pradesh', // general UP
  236: 'Bihar',         // Muzaffarpur
  237: 'Uttar Pradesh', // railway station UP (Menaka Gandhi - Pilibhit)
  238: 'Haryana',       // Rewari
  239: 'Delhi',         // Rohini Delhi
  240: 'Uttar Pradesh', // Saharanpur
  241: 'Haryana',       // Rohtak
  242: 'Haryana',       // Haryana minister
  243: 'Bihar',         // Shivhar Bihar
  244: 'Uttar Pradesh', // Sahibabad Ghaziabad
  245: 'Uttar Pradesh', // Greater Noida NRI Society
  246: 'Maharashtra',   // building Maharashtra
  247: 'Uttar Pradesh', // general UP
  248: 'Uttar Pradesh', // Ghaziabad
  249: 'Maharashtra',   // Bhandup Mumbai
  250: 'Uttar Pradesh', // general UP
  251: 'Uttar Pradesh', // apartment UP
  252: 'Uttar Pradesh', // general UP
  253: 'Uttar Pradesh', // Greater Noida
  254: 'Jharkhand',     // East Singhbhum Jharkhand
  255: 'Delhi',         // Rajiv Chowk Metro Delhi
  256: 'Jharkhand',     // Ranchi
  257: 'Jharkhand',     // Ranchi
  258: 'Uttar Pradesh', // Haldiram UP
  259: 'Kerala',        // LuLu mall Kerala
  260: 'Gujarat',       // Vadodara
  261: 'Maharashtra',   // Mumbai
  262: 'Maharashtra',   // Maharashtra
  263: 'Uttar Pradesh', // police officer UP
  264: 'Rajasthan',     // Sikar
  265: 'Uttar Pradesh', // Lucknow
  266: 'Maharashtra',   // Gajanan Ferro Maharashtra
  267: 'Uttar Pradesh', // construction UP
  268: 'Jharkhand',     // Mango (Jamshedpur)
  269: 'Uttar Pradesh', // Kushinagar
  270: 'Jharkhand',     // Jharkhand power plant
  271: 'Uttar Pradesh', // society UP
  273: 'Haryana',       // Rewari
  274: 'Madhya Pradesh',// Bhind MP
  275: 'Madhya Pradesh',// MP industrialist
  276: 'Madhya Pradesh',// MP lift crash
  277: 'Uttar Pradesh', // general UP
  278: 'Punjab',        // Mohali Aerocity
  279: 'Uttar Pradesh', // hydraulic lift UP
  280: 'Uttar Pradesh', // hydraulic lift UP
  283: 'Delhi',         // Kashmere Gate Delhi
  284: 'Delhi',         // Delhi mall
  286: 'Maharashtra',   // Pune District Court Metro
  288: 'Uttar Pradesh', // Agra
  289: 'Uttar Pradesh', // Snacks factory UP
  290: 'Uttar Pradesh', // Agra
  291: 'Uttar Pradesh', // general UP
  292: 'Uttar Pradesh', // Sanjay Place Agra
  293: 'Uttar Pradesh', // Ayodhya
  294: 'Uttar Pradesh', // restaurant UP
  298: 'Karnataka',     // Bengaluru airport
  300: 'Karnataka',     // Bengaluru
  301: 'Karnataka',     // Bengaluru
  302: 'Karnataka',     // Bengaluru
  303: 'Karnataka',     // Bengaluru
  304: 'Karnataka',     // Bengaluru
  334: 'Uttar Pradesh', // Ghaziabad
  335: 'Uttar Pradesh', // Ghaziabad
  336: 'Uttar Pradesh', // high-rise society UP
  337: 'Uttar Pradesh', // Ghaziabad Siddharth Vihar
  339: 'Madhya Pradesh',// Rewa railway station
};

function patch(id, state) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ state });
    const options = {
      hostname: SUPABASE_URL,
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
  const entries = Object.entries(updates);
  let done = 0;
  for (const [id, state] of entries) {
    const result = await patch(Number(id), state);
    done++;
    if (result.status !== 204) {
      console.log(`ID ${id}: ${state} -> status ${result.status}`);
    }
  }
  console.log(`Done. Updated ${done} records.`);
}

run();
