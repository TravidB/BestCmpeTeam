// Local curated pet-friendly attractions per city.
// Coordinates are used to compute walking distance from city centre.

const TYPE_META = {
  park:     { icon: '🏞️', label: 'Park' },
  beach:    { icon: '🏖️', label: 'Beach' },
  petcafe:  { icon: '☕', label: 'Pet Café' },
  trail:    { icon: '🥾', label: 'Trail' },
  petstore: { icon: '🛍️', label: 'Pet Store' },
  museum:   { icon: '🏛️', label: 'Museum' },
}

const CITY_COORDS = {
  'New York, USA':        [40.7128, -74.0060],
  'Los Angeles, USA':     [34.0522, -118.2437],
  'San Francisco, USA':   [37.7749, -122.4194],
  'Chicago, USA':         [41.8781, -87.6298],
  'Miami, USA':           [25.7617, -80.1918],
  'Seattle, USA':         [47.6062, -122.3321],
  'Boston, USA':          [42.3601, -71.0589],
  'Honolulu, USA':        [21.3069, -157.8583],
  'London, UK':           [51.5074, -0.1278],
  'Paris, France':        [48.8566, 2.3522],
  'Tokyo, Japan':         [35.6762, 139.6503],
  'Sydney, Australia':    [-33.8688, 151.2093],
  'Dubai, UAE':           [25.2048, 55.2708],
  'Singapore':            [1.3521, 103.8198],
  'Seoul, South Korea':   [37.5665, 126.9780],
  'Bangkok, Thailand':    [13.7563, 100.5018],
  'Frankfurt, Germany':   [50.1109, 8.6821],
  'Amsterdam, Netherlands': [52.3676, 4.9041],
  'Toronto, Canada':      [43.6532, -79.3832],
  'Vancouver, Canada':    [49.2827, -123.1207],
  'Madrid, Spain':        [40.4168, -3.7038],
  'Rome, Italy':          [41.9028, 12.4964],
}

const CITY_ATTRACTIONS = {
  'New York, USA': [
    { name: 'Central Park',              type: 'park',    lat: 40.7851, lon: -73.9683, description: 'Vast urban park with dedicated dog runs' },
    { name: 'The High Line',             type: 'park',    lat: 40.7480, lon: -74.0048, description: 'Elevated linear park, dogs on leash welcome' },
    { name: 'Washington Square Park',    type: 'park',    lat: 40.7308, lon: -74.0002, description: 'Popular park with off-leash morning hours' },
    { name: 'Prospect Park Dog Beach',   type: 'beach',   lat: 40.6579, lon: -73.9694, description: 'Off-leash dog area in Brooklyn' },
    { name: 'Dogs of Tribeca Café',      type: 'petcafe', lat: 40.7163, lon: -74.0086, description: 'Dog-welcoming café in Tribeca' },
    { name: 'Jones Beach State Park',    type: 'beach',   lat: 40.5975, lon: -73.5172, description: 'Wide Atlantic ocean beach on Long Island, dogs on leash' },
    { name: 'Dia:Beacon',                type: 'museum',  lat: 41.5031, lon: -73.9686, description: 'World-class contemporary art museum in the Hudson Valley' },
    { name: 'Fire Island National Seashore', type: 'beach', lat: 40.6522, lon: -73.1851, description: 'Barrier island beach, dogs welcome on most sections' },
  ],
  'Los Angeles, USA': [
    { name: 'Runyon Canyon Park',        type: 'trail',   lat: 34.1013, lon: -118.3491, description: 'Popular off-leash hiking trail with city views' },
    { name: "Rosie's Dog Beach",         type: 'beach',   lat: 33.7559, lon: -118.1370, description: 'One of the few designated dog beaches in LA' },
    { name: 'Griffith Park',             type: 'park',    lat: 34.1184, lon: -118.3004, description: 'Large park with trails, dogs on leash' },
    { name: 'Laurel Canyon Dog Park',    type: 'park',    lat: 34.1075, lon: -118.3812, description: 'Fenced off-leash dog park in the canyon' },
    { name: 'El Matador State Beach',    type: 'beach',   lat: 34.0358, lon: -118.8741, description: 'Scenic sea-stack beach, pet-friendly' },
    { name: 'The Getty Center',          type: 'museum',  lat: 34.0780, lon: -118.4741, description: 'World-renowned art museum with panoramic LA views' },
    { name: 'Malibu Lagoon State Beach', type: 'beach',   lat: 34.0376, lon: -118.6783, description: 'Scenic Malibu beach, very pet-friendly in off-season' },
    { name: 'Huntington Beach',          type: 'beach',   lat: 33.6595, lon: -117.9988, description: '"Surf City USA" — dog-friendly beach sections' },
  ],
  'San Francisco, USA': [
    { name: 'Fort Funston',              type: 'park',    lat: 37.7079, lon: -122.5033, description: 'Off-leash beach bluff — a dog paradise' },
    { name: 'Crissy Field',              type: 'park',    lat: 37.8033, lon: -122.4647, description: 'Waterfront with Golden Gate Bridge views' },
    { name: 'Dolores Park',              type: 'park',    lat: 37.7596, lon: -122.4269, description: 'Mission District park with dog run area' },
    { name: 'Baker Beach',               type: 'beach',   lat: 37.7940, lon: -122.4836, description: 'Dog-friendly beach near the Golden Gate' },
    { name: 'GreenDog Café',             type: 'petcafe', lat: 37.7749, lon: -122.4194, description: 'Pet-friendly café in the city' },
    { name: 'Half Moon Bay State Beach', type: 'beach',   lat: 37.4636, lon: -122.4286, description: 'Scenic Pacific coast beach with dog-friendly sections' },
    { name: 'Point Reyes National Seashore', type: 'beach', lat: 38.0698, lon: -122.9278, description: 'Wild coastal wilderness, dogs on leash on most trails' },
    { name: 'Oakland Museum of California', type: 'museum', lat: 37.7987, lon: -122.2638, description: 'Art, history and natural science museum across the bay' },
  ],
  'Chicago, USA': [
    { name: 'Montrose Dog Beach',        type: 'beach',   lat: 41.9649, lon: -87.6381, description: 'Dedicated off-leash Lake Michigan beach' },
    { name: 'Lincoln Park',              type: 'park',    lat: 41.9214, lon: -87.6351, description: 'Expansive lakeside park' },
    { name: 'Wicker Park Dog Park',      type: 'park',    lat: 41.9089, lon: -87.6808, description: 'Fenced off-leash dog park' },
    { name: 'Wiggly Field Dog Park',     type: 'park',    lat: 41.9215, lon: -87.6442, description: 'Off-leash area inside Lincoln Park' },
    { name: 'Grant Park',                type: 'park',    lat: 41.8826, lon: -87.6226, description: "Chicago's front yard along the lakefront" },
    { name: 'Indiana Dunes National Park', type: 'beach', lat: 41.6365, lon: -87.0956, description: 'Lake Michigan sand dunes and beach, dogs on leash' },
    { name: 'Illinois Beach State Park', type: 'beach',   lat: 42.4250, lon: -87.7800, description: 'Northern Illinois lakefront beach, pet-friendly' },
    { name: 'Chicago Botanic Garden',    type: 'museum',  lat: 42.1434, lon: -87.7831, description: 'Stunning 385-acre garden, leashed dogs welcome' },
  ],
  'Miami, USA': [
    { name: 'Haulover Dog Beach',        type: 'beach',   lat: 25.9022, lon: -80.1200, description: "Miami's premier off-leash dog beach" },
    { name: 'Bayfront Park',             type: 'park',    lat: 25.7742, lon: -80.1857, description: 'Waterfront park in downtown Miami' },
    { name: 'South Pointe Park',         type: 'park',    lat: 25.7670, lon: -80.1336, description: 'Scenic beachfront park, dogs on leash' },
    { name: 'Amelia Earhart Park',       type: 'park',    lat: 25.8827, lon: -80.2989, description: 'Large county park with off-leash areas' },
    { name: 'The Bungalow Pet Café',     type: 'petcafe', lat: 25.7959, lon: -80.1300, description: 'Dog-friendly café in Miami Beach' },
    { name: 'Fort Lauderdale Beach',     type: 'beach',   lat: 26.1224, lon: -80.1373, description: 'Famous Florida beach north of Miami, dog-friendly areas' },
    { name: 'Everglades National Park',  type: 'trail',   lat: 25.2866, lon: -80.8987, description: 'Iconic wetland wilderness, pets allowed on paved roads' },
    { name: 'Morikami Museum & Gardens', type: 'museum',  lat: 26.4250, lon: -80.1321, description: 'Tranquil Japanese gardens north of Miami, dogs on leash' },
  ],
  'Honolulu, USA': [
    { name: "Kapi'olani Regional Park",  type: 'park',    lat: 21.2653, lon: -157.8219, description: 'Spacious park near Waikiki, dogs on leash' },
    { name: 'Diamond Head Trail',        type: 'trail',   lat: 21.2565, lon: -157.8050, description: 'Iconic volcanic crater hike, dogs welcome' },
    { name: 'Ala Moana Beach Park',      type: 'park',    lat: 21.2890, lon: -157.8432, description: 'Popular beach park with dog-friendly zones' },
    { name: 'Kahala Beach',              type: 'beach',   lat: 21.2657, lon: -157.7861, description: 'Quieter beach, pet-friendly areas' },
    { name: 'Bark Honolulu Dog Park',    type: 'park',    lat: 21.3069, lon: -157.8583, description: 'Off-leash dog park in the city' },
    { name: 'Sunset Beach',              type: 'beach',   lat: 21.6658, lon: -158.0538, description: 'Famous North Shore surf beach, dog-friendly' },
    { name: 'Polynesian Cultural Center', type: 'museum', lat: 21.6419, lon: -157.9238, description: 'Immersive Polynesian living history museum on the North Shore' },
    { name: 'Waimea Valley',             type: 'trail',   lat: 21.6384, lon: -158.0517, description: 'Botanical garden and waterfall trail, dogs on leash' },
  ],
  'Seattle, USA': [
    { name: 'Magnuson Park Off-Leash',   type: 'park',    lat: 47.6792, lon: -122.2636, description: "One of Seattle's largest off-leash areas" },
    { name: 'Golden Gardens Park',       type: 'beach',   lat: 47.6893, lon: -122.4028, description: 'Puget Sound beach, dogs on leash' },
    { name: 'Discovery Park',            type: 'park',    lat: 47.6620, lon: -122.4148, description: 'Forested bluffs, beach access, dog trails' },
    { name: 'Cal Anderson Park',         type: 'park',    lat: 47.6153, lon: -122.3195, description: 'Capitol Hill park with fountain' },
    { name: 'Westcrest Off-Leash Area',  type: 'park',    lat: 47.5289, lon: -122.3530, description: 'Forested off-leash area in West Seattle' },
    { name: 'Snoqualmie Falls',          type: 'trail',   lat: 47.5416, lon: -121.8383, description: '270-ft waterfall with forested trail, dogs on leash' },
    { name: 'Deception Pass State Park', type: 'beach',   lat: 48.4076, lon: -122.6468, description: 'Dramatic coastal park with dog-friendly beaches' },
    { name: 'Museum of Glass Tacoma',    type: 'museum',  lat: 47.2456, lon: -122.4426, description: 'World-class glass art museum with stunning outdoor plaza' },
  ],
  'Boston, USA': [
    { name: 'Boston Common Dog Park',    type: 'park',    lat: 42.3553, lon: -71.0651, description: 'Historic common with off-leash area' },
    { name: 'Castle Island Dog Beach',   type: 'beach',   lat: 42.3366, lon: -71.0119, description: 'South Boston waterfront, dogs welcome' },
    { name: 'Millennium Park Dog Park',  type: 'park',    lat: 42.2928, lon: -71.1624, description: 'Large off-leash dog area in West Roxbury' },
    { name: 'Fenway Victory Gardens',    type: 'park',    lat: 42.3455, lon: -71.0972, description: 'Green space near Fenway Park' },
    { name: 'Paws & Claws Café',         type: 'petcafe', lat: 42.3601, lon: -71.0589, description: 'Pet-friendly coffee shop in Boston' },
    { name: 'Plum Island Beach',         type: 'beach',   lat: 42.7722, lon: -70.8147, description: 'Barrier island beach, dogs allowed in off-season' },
    { name: 'Wingaersheek Beach',        type: 'beach',   lat: 42.6862, lon: -70.6709, description: 'Sheltered sandy beach north of Gloucester, dog-friendly' },
    { name: 'Peabody Essex Museum',      type: 'museum',  lat: 42.5222, lon: -70.8958, description: 'World-class art and culture museum in historic Salem' },
  ],
  'London, UK': [
    { name: 'Hyde Park',                 type: 'park',    lat: 51.5073, lon: -0.1657, description: 'Vast royal park, dogs off-leash in many areas' },
    { name: 'Hampstead Heath',           type: 'park',    lat: 51.5609, lon: -0.1605, description: 'Wild heathland with swimming ponds' },
    { name: 'Victoria Park',             type: 'park',    lat: 51.5373, lon: -0.0366, description: "East London's green lung, very dog-friendly" },
    { name: 'Richmond Park',             type: 'park',    lat: 51.4413, lon: -0.2734, description: 'Royal deer park, dogs on leash near deer' },
    { name: 'The Dog & Duck Pub',        type: 'petcafe', lat: 51.5133, lon: -0.1307, description: 'Iconic dog-friendly pub in Soho' },
    { name: 'Windsor Castle & Long Walk', type: 'museum', lat: 51.4839, lon: -0.6044, description: 'Royal residence with 5km dog-friendly Long Walk' },
    { name: 'Brighton Beach',            type: 'beach',   lat: 50.8225, lon: -0.1372, description: "England's favourite seaside, dogs welcome year-round" },
    { name: 'Southend-on-Sea Beach',     type: 'beach',   lat: 51.5361, lon: 0.7107,  description: 'Traditional seaside resort east of London, pet-friendly' },
  ],
  'Paris, France': [
    { name: 'Bois de Boulogne',          type: 'park',    lat: 48.8616, lon: 2.2535, description: 'Vast forested park west of Paris' },
    { name: 'Parc des Buttes-Chaumont',  type: 'park',    lat: 48.8788, lon: 2.3820, description: 'Hilly park with lake, very dog-friendly' },
    { name: 'Luxembourg Gardens',        type: 'park',    lat: 48.8462, lon: 2.3371, description: 'Elegant garden, leashed dogs allowed' },
    { name: 'Bois de Vincennes',         type: 'park',    lat: 48.8286, lon: 2.4351, description: 'East Paris forest with off-leash zones' },
    { name: 'Café de Flore',             type: 'petcafe', lat: 48.8540, lon: 2.3328, description: 'Historic café welcoming well-behaved dogs' },
    { name: 'Palace of Versailles',      type: 'museum',  lat: 48.8049, lon: 2.1204, description: "Sun King's palace — dogs allowed in gardens on leash" },
    { name: 'Fontainebleau Forest',      type: 'trail',   lat: 48.4019, lon: 2.7017, description: 'Royal hunting forest with bouldering routes, dogs welcome' },
    { name: 'Giverny — Monet Gardens',   type: 'museum',  lat: 49.0764, lon: 1.5336, description: "Monet's legendary water garden, dogs on leash" },
  ],
  'Tokyo, Japan': [
    { name: 'Yoyogi Park',               type: 'park',    lat: 35.6714, lon: 139.6943, description: 'Popular park near Harajuku, dogs welcome' },
    { name: 'Inokashira Park',           type: 'park',    lat: 35.6997, lon: 139.5712, description: 'Scenic lake park, dogs on leash' },
    { name: 'Showa Kinen Park',          type: 'park',    lat: 35.7012, lon: 139.4135, description: 'Large park with dog play areas' },
    { name: 'Komazawa Olympic Park',     type: 'park',    lat: 35.6244, lon: 139.6520, description: 'Spacious park with jogging paths' },
    { name: 'Wan Nyan Paradise Café',    type: 'petcafe', lat: 35.6762, lon: 139.6503, description: 'Popular Tokyo dog café' },
    { name: 'Enoshima Beach',            type: 'beach',   lat: 35.3022, lon: 139.4822, description: 'Island beach near Kamakura with dog-friendly sections' },
    { name: 'Kamakura — Yuigahama Beach',type: 'beach',   lat: 35.3192, lon: 139.5467, description: 'Historic coastal town beach, dogs welcome off-peak' },
    { name: 'Hakone Open Air Museum',    type: 'museum',  lat: 35.2341, lon: 139.0468, description: 'Outdoor sculpture museum with Mt Fuji views, pets on leash' },
  ],
  'Sydney, Australia': [
    { name: 'Centennial Park',           type: 'park',    lat: -33.8972, lon: 151.2343, description: 'Large off-leash areas for dogs' },
    { name: 'Manly Beach',               type: 'beach',   lat: -33.7969, lon: 151.2876, description: 'Pet-friendly beach access early mornings' },
    { name: 'Clovelly Beach',            type: 'beach',   lat: -33.9138, lon: 151.2607, description: 'Rock pool beach, dogs welcome on leash' },
    { name: 'Bicentennial Park',         type: 'park',    lat: -33.8435, lon: 151.0678, description: 'Waterfront park with walking trails' },
    { name: "Fido's Pantry",             type: 'petcafe', lat: -33.8688, lon: 151.2093, description: "Sydney's dog-friendly bakery and café" },
    { name: 'Palm Beach',                type: 'beach',   lat: -33.6019, lon: 151.3233, description: 'Northern beaches gem, dog-friendly at southern end' },
    { name: 'Royal National Park Beach', type: 'beach',   lat: -34.1300, lon: 151.1000, description: "Australia's first national park with coastal dog trails" },
    { name: 'Blue Mountains Cultural Centre', type: 'museum', lat: -33.7129, lon: 150.3113, description: 'Art and heritage museum with stunning mountain scenery' },
  ],
  'Dubai, UAE': [
    { name: 'Safa Park',                 type: 'park',    lat: 25.1855, lon: 55.2405, description: 'Central park with walking paths' },
    { name: 'Al Mamzar Beach Park',      type: 'beach',   lat: 25.2842, lon: 55.3426, description: 'Beach park with designated pet zones' },
    { name: 'Creek Park',                type: 'park',    lat: 25.2299, lon: 55.3245, description: 'Waterfront park along Dubai Creek' },
    { name: 'Jumeirah Beach Walk',       type: 'beach',   lat: 25.2048, lon: 55.2708, description: 'Early-hours pet-friendly beach strip' },
    { name: 'Dog City Dubai',            type: 'petcafe', lat: 25.2048, lon: 55.2708, description: "Dubai's top dog park and café" },
    { name: 'Dubai Safari Park',         type: 'park',    lat: 24.9980, lon: 55.4061, description: 'Wildlife park with large outdoor pet-friendly grounds' },
    { name: 'Sharjah Museum of Islamic Civilization', type: 'museum', lat: 25.3505, lon: 55.3761, description: 'Premier Islamic art museum in neighboring Sharjah' },
    { name: 'Kite Beach',                type: 'beach',   lat: 25.1476, lon: 55.2078, description: 'Trendy beach with off-leash dog area at southern end' },
  ],
  'Singapore': [
    { name: 'East Coast Park',           type: 'park',    lat: 1.3006, lon: 103.9100, description: 'Coastal park with dog-friendly areas' },
    { name: 'Bishan-Ang Mo Kio Park',    type: 'park',    lat: 1.3581, lon: 103.8454, description: 'Large park with official dog run areas' },
    { name: 'Tanjong Beach',             type: 'beach',   lat: 1.2484, lon: 103.8199, description: 'Sentosa beach, dogs allowed in select zones' },
    { name: 'Labrador Nature Reserve',   type: 'trail',   lat: 1.2658, lon: 103.8022, description: 'Coastal trail through heritage park' },
    { name: 'Doggiestyle Café',          type: 'petcafe', lat: 1.3521, lon: 103.8198, description: "Singapore's famous dog-friendly café" },
    { name: 'Changi Beach Park',         type: 'beach',   lat: 1.3897, lon: 103.9883, description: 'Peaceful east coast beach with barbecue pits, dogs welcome' },
    { name: 'Pulau Ubin',                type: 'trail',   lat: 1.4050, lon: 103.9594, description: 'Rustic island nature reserve with cycling trails, dogs on leash' },
    { name: 'Asian Civilisations Museum', type: 'museum', lat: 1.2879, lon: 103.8513, description: 'Premier heritage museum on the Singapore River' },
  ],
  'Seoul, South Korea': [
    { name: 'Hangang Park',              type: 'park',    lat: 37.5226, lon: 126.9880, description: 'River park with dog-friendly zones' },
    { name: 'Bukhansan National Park',   type: 'trail',   lat: 37.6597, lon: 127.0119, description: 'Mountain trails, dogs on leash' },
    { name: 'Olympic Park',              type: 'park',    lat: 37.5210, lon: 127.1218, description: 'Spacious park with sculptures and lawns' },
    { name: 'Ttukseom Hangang Park',     type: 'park',    lat: 37.5302, lon: 127.0666, description: 'Dog-friendly riverside park with café zone' },
    { name: 'Mung Mung Dog Café',        type: 'petcafe', lat: 37.5665, lon: 126.9780, description: 'Cozy dog café in central Seoul' },
    { name: 'Eulwangni Beach',           type: 'beach',   lat: 37.4397, lon: 126.5877, description: 'West Sea beach near Incheon, dog-friendly' },
    { name: 'Suwon Hwaseong Fortress',   type: 'museum',  lat: 37.2881, lon: 127.0147, description: 'UNESCO-listed fortress city, dogs on leash in grounds' },
    { name: 'Everland Resort',           type: 'park',    lat: 37.2935, lon: 127.2027, description: "Korea's largest theme park with pet-friendly outdoor areas" },
  ],
  'Bangkok, Thailand': [
    { name: 'Lumpini Park',              type: 'park',    lat: 13.7311, lon: 100.5418, description: 'Central Bangkok green space, dogs on leash' },
    { name: 'Benjakitti Park',           type: 'park',    lat: 13.7231, lon: 100.5610, description: 'Lakeside park near Sukhumvit' },
    { name: 'Chatuchak Park',            type: 'park',    lat: 13.7996, lon: 100.5567, description: 'Adjacent to the famous weekend market' },
    { name: 'Rama IX Park',              type: 'park',    lat: 13.7065, lon: 100.6085, description: 'Large botanical garden park' },
    { name: 'Dog in Town Café',          type: 'petcafe', lat: 13.7563, lon: 100.5018, description: 'Famous Bangkok dog café chain' },
    { name: 'Ancient City (Muang Boran)', type: 'museum', lat: 13.5355, lon: 100.8028, description: 'Open-air museum of Thai architectural replicas' },
    { name: 'Bang Saen Beach',           type: 'beach',   lat: 13.2775, lon: 100.9214, description: 'Popular Thai seaside beach east of Bangkok' },
    { name: 'Ayutthaya Historical Park', type: 'museum',  lat: 14.3490, lon: 100.5833, description: 'UNESCO ancient capital ruins, dogs on leash in grounds' },
  ],
  'Frankfurt, Germany': [
    { name: 'Nidda Valley Dog Park',     type: 'park',    lat: 50.1318, lon: 8.6101, description: 'River valley park with off-leash areas' },
    { name: 'Stadtwald Forest',          type: 'trail',   lat: 50.0699, lon: 8.6565, description: 'Large forested park south of Frankfurt' },
    { name: 'Günthersburgpark',          type: 'park',    lat: 50.1261, lon: 8.7028, description: 'Historic villa park, dogs on leash' },
    { name: 'Main Riverbank Walk',       type: 'trail',   lat: 50.1109, lon: 8.6821, description: 'Scenic riverside promenade through the city' },
    { name: 'Café Metropol',             type: 'petcafe', lat: 50.1109, lon: 8.6821, description: 'Dog-welcoming café in Sachsenhausen' },
    { name: 'Mainz State Museum',        type: 'museum',  lat: 49.9995, lon: 8.2654, description: 'Roman antiquities and European history across the Rhine' },
    { name: 'Rhine Valley Wine Trail',   type: 'trail',   lat: 49.9796, lon: 7.9252, description: 'Scenic vine-covered hillside trails above Rüdesheim' },
    { name: 'Heidelberg Castle',         type: 'museum',  lat: 49.4094, lon: 8.7159, description: 'Romantic ruined castle overlooking the Neckar Valley' },
  ],
  'Amsterdam, Netherlands': [
    { name: 'Vondelpark',                type: 'park',    lat: 52.3580, lon: 4.8686, description: 'Iconic Amsterdam park, dogs on leash' },
    { name: 'Amsterdamse Bos',           type: 'park',    lat: 52.3124, lon: 4.8358, description: 'Vast forested recreation area with dog runs' },
    { name: 'Westerpark',                type: 'park',    lat: 52.3876, lon: 4.8766, description: 'Trendy west Amsterdam park and cultural hub' },
    { name: 'Zandvoort Beach',           type: 'beach',   lat: 52.3722, lon: 4.5329, description: 'North Sea beach, dog-friendly all year' },
    { name: "Café 't Smalle",            type: 'petcafe', lat: 52.3741, lon: 4.8836, description: 'Historic canal café welcoming dogs' },
    { name: 'Keukenhof Gardens',         type: 'museum',  lat: 52.2697, lon: 4.5468, description: "World's largest flower garden, dogs on leash allowed" },
    { name: 'Leiden Museum of Antiquities', type: 'museum', lat: 52.1601, lon: 4.4822, description: "Netherlands' national archaeology museum" },
    { name: 'Scheveningen Beach',        type: 'beach',   lat: 52.1048, lon: 4.2718, description: "The Hague's popular seaside resort, dogs welcome year-round" },
  ],
  'Toronto, Canada': [
    { name: 'Trinity Bellwoods Park',    type: 'park',    lat: 43.6476, lon: -79.4165, description: 'Popular off-leash dog park' },
    { name: 'High Park',                 type: 'park',    lat: 43.6465, lon: -79.4637, description: 'Large park with designated off-leash zones' },
    { name: 'Cherry Beach Dog Park',     type: 'park',    lat: 43.6362, lon: -79.3520, description: 'Waterfront off-leash area on Lake Ontario' },
    { name: 'Woodbine Beach',            type: 'beach',   lat: 43.6592, lon: -79.3070, description: 'Lake Ontario beach, dog-friendly areas' },
    { name: "Fido's Café Toronto",       type: 'petcafe', lat: 43.6532, lon: -79.3832, description: 'Dog-friendly café in downtown Toronto' },
    { name: 'Niagara-on-the-Lake',       type: 'trail',   lat: 43.2552, lon: -79.0762, description: 'Historic town with vineyard trails, very dog-friendly' },
    { name: 'Royal Botanical Gardens',   type: 'museum',  lat: 43.2933, lon: -79.9097, description: 'Vast gardens and nature trails in Hamilton, dogs on leash' },
    { name: 'McMichael Art Gallery',     type: 'museum',  lat: 43.8445, lon: -79.5303, description: 'Canadian art gallery surrounded by forest trails' },
  ],
  'Vancouver, Canada': [
    { name: 'Stanley Park',              type: 'park',    lat: 49.3017, lon: -123.1417, description: 'World-famous urban park, dogs on leash' },
    { name: 'Wreck Beach',               type: 'beach',   lat: 49.2672, lon: -123.2598, description: 'Off-leash dog beach in UBC forest' },
    { name: 'Pacific Spirit Regional',   type: 'trail',   lat: 49.2607, lon: -123.2031, description: 'Forested trails, dogs on leash' },
    { name: 'Jericho Beach',             type: 'beach',   lat: 49.2741, lon: -123.1990, description: 'Dog-friendly beach on English Bay' },
    { name: 'Wag Dog Lounge',            type: 'petcafe', lat: 49.2827, lon: -123.1207, description: 'Dog-friendly lounge in downtown Vancouver' },
    { name: 'Squamish — Stawamus Chief', type: 'trail',   lat: 49.6776, lon: -123.1558, description: "North America's largest granite monolith, dogs on leash" },
    { name: 'Fort Langley National Historic Site', type: 'museum', lat: 49.1691, lon: -122.5776, description: "Where BC was born — living history site, dogs welcome outside" },
    { name: 'Cultus Lake Beach',         type: 'beach',   lat: 49.0424, lon: -121.9792, description: 'Fresh-water lake beach east of Vancouver, dog-friendly' },
  ],
  'Madrid, Spain': [
    { name: 'El Retiro Park',            type: 'park',    lat: 40.4153, lon: -3.6845, description: 'Grand park in the heart of Madrid' },
    { name: 'Casa de Campo',             type: 'park',    lat: 40.4167, lon: -3.7500, description: 'Vast forested park west of the city' },
    { name: 'Parque del Oeste',          type: 'park',    lat: 40.4302, lon: -3.7195, description: 'Beautiful park near the Royal Palace' },
    { name: 'Juan Carlos I Park',        type: 'park',    lat: 40.4650, lon: -3.6218, description: 'Modern park with off-leash dog areas' },
    { name: 'Café Perruno',              type: 'petcafe', lat: 40.4168, lon: -3.7038, description: "Madrid's cozy dog-friendly café" },
    { name: 'El Escorial Royal Site',    type: 'museum',  lat: 40.5892, lon: -4.1494, description: 'Magnificent 16th-century royal monastery and palace (~42km NW)' },
    { name: 'Aranjuez Royal Palace',     type: 'museum',  lat: 40.0329, lon: -3.6052, description: 'UNESCO royal palace and gardens on the Tagus River (~43km S)' },
    { name: 'Embalse de Santillana',     type: 'beach',   lat: 40.8333, lon: -3.9833, description: 'Scenic reservoir beach in the Guadarrama foothills (~48km N)' },
  ],
  'Rome, Italy': [
    { name: 'Villa Borghese Gardens',    type: 'park',    lat: 41.9138, lon: 12.4922, description: 'Elegant park, dogs on leash' },
    { name: 'Villa Ada Park',            type: 'park',    lat: 41.9360, lon: 12.5139, description: 'Large park north of Rome, dog-friendly' },
    { name: 'Appia Antica Regional Park',type: 'trail',   lat: 41.8496, lon: 12.5226, description: 'Ancient road trail, dogs welcome' },
    { name: 'Ostia Beach',               type: 'beach',   lat: 41.7333, lon: 12.2500, description: "Rome's nearest beach, pet areas available" },
    { name: 'Bar San Calisto',           type: 'petcafe', lat: 41.8906, lon: 12.4709, description: 'Dog-friendly bar in Trastevere' },
    { name: 'Lago di Bracciano',         type: 'beach',   lat: 42.1038, lon: 12.1784, description: 'Pristine volcanic lake beach, dogs welcome (~34km NW)' },
    { name: 'Cerveteri Etruscan Museum', type: 'museum',  lat: 41.9997, lon: 11.9948, description: 'UNESCO Etruscan necropolis and national museum (~43km NW)' },
    { name: 'Anzio Beach',               type: 'beach',   lat: 41.4470, lon: 12.6280, description: 'Historic Tyrrhenian Sea beach town south of Rome (~54km S)' },
  ],
}

// Aliases matching hotel-service.js DESTINATION_ALIASES
const DESTINATION_TO_CITY = {
  'NEW YORK': 'New York, USA', JFK: 'New York, USA', LGA: 'New York, USA', EWR: 'New York, USA',
  'LOS ANGELES': 'Los Angeles, USA', LAX: 'Los Angeles, USA',
  'SAN FRANCISCO': 'San Francisco, USA', SFO: 'San Francisco, USA',
  PARIS: 'Paris, France', CDG: 'Paris, France',
  LONDON: 'London, UK', LHR: 'London, UK', LGW: 'London, UK',
  TOKYO: 'Tokyo, Japan', NRT: 'Tokyo, Japan', HND: 'Tokyo, Japan',
  HONOLULU: 'Honolulu, USA', HNL: 'Honolulu, USA',
  CHICAGO: 'Chicago, USA', ORD: 'Chicago, USA', MDW: 'Chicago, USA',
  MIAMI: 'Miami, USA', MIA: 'Miami, USA',
  SEATTLE: 'Seattle, USA', SEA: 'Seattle, USA',
  BOSTON: 'Boston, USA', BOS: 'Boston, USA',
  DUBAI: 'Dubai, UAE', DXB: 'Dubai, UAE',
  SINGAPORE: 'Singapore', SIN: 'Singapore',
  SYDNEY: 'Sydney, Australia', SYD: 'Sydney, Australia',
  SEOUL: 'Seoul, South Korea', ICN: 'Seoul, South Korea',
  BANGKOK: 'Bangkok, Thailand', BKK: 'Bangkok, Thailand',
  FRANKFURT: 'Frankfurt, Germany', FRA: 'Frankfurt, Germany',
  AMSTERDAM: 'Amsterdam, Netherlands', AMS: 'Amsterdam, Netherlands',
  TORONTO: 'Toronto, Canada', YYZ: 'Toronto, Canada',
  VANCOUVER: 'Vancouver, Canada', YVR: 'Vancouver, Canada',
  MADRID: 'Madrid, Spain', MAD: 'Madrid, Spain',
  ROME: 'Rome, Italy', FCO: 'Rome, Italy',
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const phi1 = lat1 * Math.PI / 180
  const phi2 = lat2 * Math.PI / 180
  const dphi = (lat2 - lat1) * Math.PI / 180
  const dlam = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlam / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function resolveCity(destination) {
  const key = String(destination || '').trim().toUpperCase()
  if (DESTINATION_TO_CITY[key]) return DESTINATION_TO_CITY[key]
  // Fuzzy: check if any city name contains the search word
  for (const city of Object.keys(CITY_ATTRACTIONS)) {
    const cityUpper = city.toUpperCase()
    if (cityUpper.startsWith(key) || key.startsWith(cityUpper.split(',')[0])) return city
  }
  return null
}

export function getCityCoords(destination) {
  const city = resolveCity(destination)
  if (!city || !CITY_COORDS[city]) return null
  const [lat, lon] = CITY_COORDS[city]
  return { lat, lon, city }
}

export const attractionService = {
  /** Returns curated attractions near the destination, sorted by walking distance from city centre */
  getAttractions(destination) {
    const city = resolveCity(destination)
    if (!city) return []
    const coords = CITY_COORDS[city]
    if (!coords) return []
    const [clat, clon] = coords
    return (CITY_ATTRACTIONS[city] || []).map(a => {
      const distMiles = haversineMiles(clat, clon, a.lat, a.lon)
      return {
        ...a,
        city,
        distanceMiles: Math.round(distMiles * 10) / 10,
        distanceKm: Math.round(distMiles * 1.60934 * 10) / 10,
        walkable: distMiles <= 3.0,
        meta: TYPE_META[a.type] || { icon: '📍', label: a.type },
      }
    }).sort((a, b) => a.distanceMiles - b.distanceMiles)
  },
}
