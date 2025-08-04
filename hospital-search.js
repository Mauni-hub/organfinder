let hospitalsData = [];

async function fetchHospitalData() {
    try {
        const res = await fetch('http://localhost:3000/api/hospitals');
        hospitalsData = await res.json();
        renderHospitals(); 
    } catch (err) {
        console.error("❌ Failed to fetch hospital data:", err);
    }
}
// Updated Mock data for districts based on states - Expanded Tamil Nadu
const districtsByState = {
    "All States": ["All Districts"],
    "Andhra Pradesh": ["All Districts", "Visakhapatnam", "Guntur", "Nellore", "Tirupati", "Vijayawada", "Kurnool", "Anantapur"],
    "Assam": ["All Districts", "Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"],
    "Bihar": ["All Districts", "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
    "Chhattisgarh": ["All Districts", "Raipur", "Durg", "Bilaspur", "Korba", "Ambikapur"],
    "Delhi": ["All Districts", "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Goa": ["All Districts", "North Goa", "South Goa"],
    "Gujarat": ["All Districts", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
    "Haryana": ["All Districts", "Gurugram", "Faridabad", "Ambala", "Panipat", "Rohtak", "Hisar"],
    "Himachal Pradesh": ["All Districts", "Shimla", "Kangra", "Mandi", "Solan", "Una"],
    "Jammu and Kashmir": ["All Districts", "Jammu", "Srinagar", "Anantnag", "Baramulla"],
    "Jharkhand": ["All Districts", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Karnataka": ["All Districts", "Bangalore Urban", "Mysore", "Hubli-Dharwad", "Mangalore", "Belagavi", "Gulbarga", "Davangere"],
    "Kerala": ["All Districts", "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Malappuram", "Kannur"],
    "Madhya Pradesh": ["All Districts", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
    "Maharashtra": ["All Districts", "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur"],
    "Odisha": ["All Districts", "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Punjab": ["All Districts", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh", "Bathinda", "Mohali"],
    "Rajasthan": ["All Districts", "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
    "Tamil Nadu": [
        "All Districts",
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
        "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
        "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
        "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
        "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
        "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Thoothukudi",
        "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvannamalai",
        "Udhagamandalam", "Vellore", "Villupuram", "Virudhunagar"
    ],
    "Telangana": ["All Districts", "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Secunderabad", "Khammam"],
    "Uttar Pradesh": ["All Districts", "Lucknow", "Kanpur Nagar", "Varanasi", "Agra", "Ghaziabad", "Noida", "Prayagraj", "Meerut", "Aligarh", "Bareilly"],
    "Uttarakhand": ["All Districts", "Dehradun", "Haridwar", "Nainital", "Rishikesh", "Udham Singh Nagar"],
    "West Bengal": ["All Districts", "Kolkata", "Howrah", "North 24 Parganas", "Bardhaman", "Durgapur", "Siliguri"]
    // Add more states and their major districts as needed
};

const stateSelect = document.getElementById('stateSelect');
const districtSelect = document.getElementById('districtSelect');
const organSelect = document.getElementById('organSelect');
const hospitalGrid = document.getElementById('hospitalGrid');
const hospitalCountSpan = document.getElementById('hospitalCount');
const lastUpdatedTimeSpan = document.getElementById('lastUpdatedTime');

function getOrganStatusClass(count) {
    if (count > 2) return 'available';
    if (count > 0) return 'limited';
    return 'unavailable';
}

function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.classList.add('hospital-card');
    card.dataset.state = hospital.state;
    card.dataset.district = hospital.district;

    let organsHtml = '';
    const organOrder = ["Heart", "Kidney", "Liver", "Lung", "Pancreas", "Cornea"];

    organOrder.forEach(organName => {
        const count = hospital.organs[organName] ?? 0;
        const statusClass = getOrganStatusClass(count);
        organsHtml += `
            <div class="organ-item ${statusClass}">${organName} <span>${count} available</span></div>
        `;
    });

    card.innerHTML = `
        <h3>${hospital.name}</h3>
        <p class="hospital-location"><i class="fas fa-map-marker-alt"></i> ${hospital.location}</p>
        <p class="hospital-address">${hospital.address}</p>
        <h4 class="organ-availability-title">Organ Availability</h4>
        <div class="organ-grid">
            ${organsHtml}
        </div>
        <button class="contact-button"><i class="fas fa-phone"></i> Contact Now - ${hospital.contact}</button>
    `;
    return card;
}

function renderHospitals() {
    hospitalGrid.innerHTML = '';
    let filteredHospitals = hospitalsData;

    const selectedState = stateSelect.value;
    const selectedDistrict = districtSelect.value;
    const selectedOrgan = organSelect.value;

    // ✅ Fixed: Case-insensitive state/district matching
    if (selectedState !== 'All States') {
        filteredHospitals = filteredHospitals.filter(h => h.state.toLowerCase() === selectedState.toLowerCase());
    }
    if (selectedDistrict !== 'All Districts') {
        filteredHospitals = filteredHospitals.filter(h => h.district.toLowerCase() === selectedDistrict.toLowerCase());
    }
    if (selectedOrgan !== 'All Organs') {
        filteredHospitals = filteredHospitals.filter(h => {
            const organCount = h.organs[selectedOrgan];
            return organCount && organCount > 0;
        });
    }

    if (filteredHospitals.length > 0) {
        filteredHospitals.forEach(hospital => {
            hospitalGrid.appendChild(createHospitalCard(hospital));
        });
    } else {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.classList.add('no-results-message');
        noResultsMessage.style.textAlign = 'center';
        noResultsMessage.style.padding = '50px';
        noResultsMessage.style.color = 'var(--text-color)';
        noResultsMessage.style.fontSize = '1.2rem';
        noResultsMessage.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-right: 10px; color: var(--light-purple);"></i> No hospitals found matching your criteria. Please adjust your filters.';
        hospitalGrid.appendChild(noResultsMessage);
    }

    hospitalCountSpan.textContent = filteredHospitals.length;
}

function populateStates() {
    const states = Object.keys(districtsByState).sort((a, b) => {
        if (a === "All States") return -1;
        if (b === "All States") return 1;
        return a.localeCompare(b);
    });
    stateSelect.innerHTML = '';
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
    stateSelect.value = "All States";
}

function populateDistricts() {
    const selectedState = stateSelect.value;
    const districts = districtsByState[selectedState] || ["All Districts"];
    districtSelect.innerHTML = '';
    districts.sort((a, b) => {
        if (a === "All Districts") return -1;
        if (b === "All Districts") return 1;
        return a.localeCompare(b);
    });
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });

    renderHospitals(); // Refresh display on district change
}

function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    lastUpdatedTimeSpan.textContent = timeString;
}

document.addEventListener('DOMContentLoaded', () => {
    populateStates();
    populateDistricts();
    updateLastUpdatedTime();
    fetchHospitalData();
    setInterval(updateLastUpdatedTime, 60 * 1000);

    stateSelect.addEventListener('change', populateDistricts);
    districtSelect.addEventListener('change', renderHospitals);
    organSelect.addEventListener('change', renderHospitals);
});