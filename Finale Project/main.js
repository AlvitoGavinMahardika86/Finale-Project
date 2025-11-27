// ==========================================================
// 1. DATABASE KAMUS
// ==========================================================
const DICTIONARY = {
    "hello": "halo", "good": "baik", "morning": "pagi", "thank you": "terima kasih",
    "sorry": "maaf", "please": "tolong", "yes": "ya", "no": "tidak", "time": "waktu",
    "house": "rumah", "car": "mobil", "water": "air", "food": "makanan",
    "friend": "teman", "book": "buku", "computer": "komputer", "school": "sekolah",
    "happy": "senang", "sad": "sedih", "big": "besar", "small": "kecil",
    "easy": "mudah", "difficult": "sulit", "ready": "siap", "cat": "kucing", "money": "uang", "name": "nama",
    "city": "kota", "country": "negara", "world": "dunia", "family": "keluarga",
    "tree": "pohon", "sun": "matahari", "moon": "bulan", "star": "bintang",
    "write": "menulis", "read": "membaca", "drink": "minum", "eat": "makan",
    "today": "hari ini", "tomorrow": "besok", "yesterday": "kemarin", "beautiful": "indah",
    "clean": "bersih", "dirty": "kotor", "fast": "cepat", "slow": "lambat",
    "open": "buka", "close": "tutup","bottle":"botol"
};

// ==========================================================
// 2. ELEMEN DOM UNTUK PENERJEMAHAN
// ==========================================================
const wordInput = document.getElementById('wordInput');
const translateButton = document.getElementById('translateButton');
const resultText = document.getElementById('resultText');

// ==========================================================
// 3. ELEMEN DOM UNTUK AUTENTIKASI
// ==========================================================
const authButton = document.getElementById('authButton');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const userNameDisplay = document.getElementById('userNameDisplay');
const loginMessage = document.getElementById('loginMessage');

// === ELEMEN BARU UNTUK DAFTAR ===
const modalTitle = document.getElementById('modalTitle');
const submitButton = document.getElementById('submitButton');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Data Akun Simulasi & Status
let currentMode = 'login'; // 'login' atau 'register'
const DEFAULT_USERNAME = 'Pengguna'; 
const DEFAULT_PASSWORD = '12345'; 

// Data Akun Tambahan (Simulasi database)
let registeredAccounts = {
    [DEFAULT_USERNAME]: DEFAULT_PASSWORD
};

// ==========================================================
// 4. FUNGSI LOGIKA PENERJEMAHAN
// ==========================================================
function translateWord() {
    const input = wordInput.value.toLowerCase().trim();
    
    if (input === "") {
        resultText.textContent = "⚠️ Mohon masukkan kata terlebih dahulu.";
        resultText.style.color = 'orange'; 
        return;
    }

    resultText.style.color = '#333';
    
    // Cek di kunci (Inggris)
    if (DICTIONARY.hasOwnProperty(input)) {
        translation = DICTIONARY[input];
        resultText.textContent = `[EN] ${input.toUpperCase()} = [ID] ${translation.toUpperCase()}`;
        return;
    }

    // Cek di nilai (Indonesia)
    const keys = Object.keys(DICTIONARY);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (DICTIONARY[key] === input) {
            translation = key;
            resultText.textContent = `[ID] ${input.toUpperCase()} = [EN] ${translation.toUpperCase()}`;
            return;
        }
    }

    // Gagal
    resultText.textContent = `❌ Kata '${input.toUpperCase()}' tidak ditemukan. Coba kata lain.`;
    resultText.style.color = 'red';
}

// ==========================================================
// 5. FUNGSI LOGIKA SIMULASI LOGIN/LOGOUT & DAFTAR
// ==========================================================

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (isLoggedIn && username) {
        // Status Login
        authButton.textContent = 'Logout';
        authButton.style.backgroundColor = '#dc3545';
        authButton.onclick = handleLogout;
        userNameDisplay.textContent = `Halo, ${username}!`;
    } else {
        // Status Logout
        authButton.textContent = 'Login';
        authButton.style.backgroundColor = '#007bff';
        authButton.onclick = openLoginModal;
        userNameDisplay.textContent = '';
    }
}

function openLoginModal() {
    loginModal.style.display = 'flex';
    loginMessage.textContent = '';
    // Selalu buka dalam mode login default
    setAuthMode('login'); 
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    loginForm.reset(); 
    loginMessage.textContent = '';
}

function setAuthMode(mode) {
    currentMode = mode;
    loginForm.reset();
    loginMessage.textContent = '';

    if (mode === 'login') {
        modalTitle.textContent = 'Simulasi Login';
        submitButton.textContent = 'Login';
        toggleAuthMode.innerHTML = 'Belum punya akun? **Daftar**';
        confirmPasswordGroup.style.display = 'none'; // Sembunyikan konfirmasi password
    } else { // mode === 'register'
        modalTitle.textContent = 'Simulasi Pendaftaran';
        submitButton.textContent = 'Daftar';
        toggleAuthMode.innerHTML = 'Sudah punya akun? **Login**';
        confirmPasswordGroup.style.display = 'block'; // Tampilkan konfirmasi password
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const inputUsername = document.getElementById('username').value.trim();
    const inputPassword = document.getElementById('password').value.trim();
    
    if (currentMode === 'login') {
        // --- LOGIKA LOGIN ---
        // Cek di daftar akun simulasi
        if (registeredAccounts.hasOwnProperty(inputUsername) && 
            registeredAccounts[inputUsername] === inputPassword) {
            
            // Login Berhasil
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', inputUsername);
            
            closeLoginModal();
            checkLoginStatus(); 
        } else {
            // Login Gagal
            loginMessage.textContent = 'Username atau Password salah!';
        }
    } else {
        // --- LOGIKA PENDAFTARAN (REGISTER) ---
        const inputConfirmPassword = confirmPasswordInput.value.trim();

        if (inputPassword !== inputConfirmPassword) {
            loginMessage.textContent = 'Konfirmasi password tidak cocok!';
            return;
        }

        if (inputUsername.length < 3 || inputPassword.length < 5) {
            loginMessage.textContent = 'Username minimal 3 karater dan password minimal 5 karakter.';
            return;
        }
        
        if (registeredAccounts.hasOwnProperty(inputUsername)) {
            loginMessage.textContent = 'Username sudah terdaftar. Coba yang lain.';
            return;
        }

        // Pendaftaran Berhasil
        registeredAccounts[inputUsername] = inputPassword;
        loginMessage.textContent = 'Pendaftaran berhasil! Silakan Login.';
        loginMessage.style.color = 'green';
        
        // Alihkan kembali ke mode login setelah beberapa saat
        setTimeout(() => {
            setAuthMode('login'); 
        }, 1500); 
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    checkLoginStatus(); 
    openLoginModal(); // Memaksa modal login muncul segera
}


// ==========================================================
// 6. EVENT LISTENERS & INISIALISASI
// ==========================================================

// Listener Penerjemah
translateButton.addEventListener('click', translateWord);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        translateWord();
    }
});

// Listener Form Login/Daftar
loginForm.addEventListener('submit', handleLogin);
toggleAuthMode.addEventListener('click', () => {
    // Beralih antara mode login dan register
    if (currentMode === 'login') {
        setAuthMode('register');
    } else {
        setAuthMode('login');
    }
});

// --- Jalankan fungsi check status saat halaman dimuat ---
checkLoginStatus();