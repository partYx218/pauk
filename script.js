let services = [], users = [], favorites = [], reviews = [];
let currentUser = null;
let currentCategory = "all";
let currentSort = "rating";
let pendingReviewServiceId = null;
let currentEditServiceId = null;
let selectedRole = "citizen";
let categoriesExpanded = true;
let sortExpanded = true;
let usersSortBy = "name";
let usersSortOrder = "asc";
let usersSearch = "";
let currentTheme = "dark";

let statsAnimated = false;
let statsValues = { services: 0, users: 0, views: 0, rating: 0 };

const quotes = [
    "Цифровизация - это не просто технологии, это новый образ жизни.",
    "Госуслуги онлайн экономят часы вашей жизни.",
    "Будущее уже здесь - просто не равномерно распределено.",
    "Каждый клик - шаг к цифровому государству.",
    "Технологии должны работать на людей.",
    "Цифровая экосистема России развивается каждый день."
];

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

const FIXED_DATE = "2025-01-01T10:00:00.000Z";

const defaultServices = [
    { id: 1, name: "Госуслуги", category: "family", description: "Федеральный портал государственных услуг. Запись к врачу, получение пособий, загранпаспорт.", tags: ["Госуслуги", "Документы"], url: "https://gosuslugi.ru", date: "2025-01-15", rating: 5.0, views: 15234 },
    { id: 2, name: "Мой налог", category: "finance", description: "Приложение для самозанятых: регистрация, чеки, уплата налогов.", tags: ["Налоги", "ФНС"], url: "https://npd.nalog.ru", date: "2025-02-10", rating: 5.0, views: 8921 },
    { id: 3, name: "Умный транспорт", category: "transport", description: "Отслеживание автобусов в реальном времени с AI-прогнозом.", tags: ["Транспорт"], url: "https://transport.mos.ru", date: "2025-01-20", rating: 4.2, views: 6723 },
    { id: 4, name: "Электронная медкарта", category: "health", description: "Доступ к анализам, протоколам, рецептам.", tags: ["Медицина"], url: "https://emias.info", date: "2025-03-01", rating: 5.0, views: 10456 },
    { id: 5, name: "Цифровой дневник", category: "education", description: "Электронный дневник школьника.", tags: ["Образование"], url: "https://dnevnik.ru", date: "2025-03-15", rating: 4.3, views: 23451 },
    { id: 6, name: "Госуслуги Дом", category: "housing", description: "Передача показаний, оплата ЖКУ.", tags: ["ЖКХ"], url: "https://dom.gosuslugi.ru", date: "2025-02-20", rating: 4.7, views: 18765 },
    { id: 7, name: "Госключ", category: "digital", description: "Квалифицированная электронная подпись в телефоне. Позволяет подписывать документы онлайн.", tags: ["ЭЦП", "Безопасность"], url: "https://gokey.ru", date: "2025-03-10", rating: 5.0, views: 5432 },
    { id: 8, name: "Работа в России", category: "finance", description: "Поиск работы, стажировок, переобучение.", tags: ["Работа", "Карьера"], url: "https://trudvsem.ru", date: "2025-01-25", rating: 4.1, views: 9987 }
];

const defaultUsers = [
    { id: 1, login: "admin", surname: "Администраторов", name: "Главный", patronymic: "Системович", fullName: "Администраторов Главный Системович", email: "admin@mail.ru", password: "admin123", role: "admin", regDate: FIXED_DATE, lastLogin: new Date().toISOString() },
    { id: 2, login: "anna", surname: "Петрова", name: "Анна", patronymic: "Ивановна", fullName: "Петрова Анна Ивановна", email: "anna@mail.ru", password: "anna123", role: "citizen", regDate: FIXED_DATE, lastLogin: new Date().toISOString() },
    { id: 3, login: "ivan", surname: "Смирнов", name: "Иван", patronymic: "Петрович", fullName: "Смирнов Иван Петрович", email: "ivan@mail.ru", password: "ivan123", role: "citizen", regDate: FIXED_DATE, lastLogin: new Date().toISOString() },
    { id: 4, login: "petr", surname: "Сидоров", name: "Петр", patronymic: "Алексеевич", fullName: "Сидоров Петр Алексеевич", email: "petr@mail.ru", password: "petr123", role: "citizen", regDate: FIXED_DATE, lastLogin: new Date().toISOString() },
    { id: 5, login: "elena", surname: "Козлова", name: "Елена", patronymic: "Дмитриевна", fullName: "Козлова Елена Дмитриевна", email: "elena@mail.ru", password: "elena123", role: "citizen", regDate: FIXED_DATE, lastLogin: new Date().toISOString() },
    { id: 6, login: "dmitry", surname: "Орлов", name: "Дмитрий", patronymic: "Сергеевич", fullName: "Орлов Дмитрий Сергеевич", email: "dmitry@mail.ru", password: "dmitry123", role: "citizen", regDate: FIXED_DATE, lastLogin: new Date().toISOString() }
];

const defaultReviews = [
    { id: 1, service_id: 1, author: "Петрова Анна Ивановна", text: "Отличный портал, всё удобно и понятно! Записался к врачу за 5 минут!", rating: 5, date: "2025-01-20T10:30:00.000Z" },
    { id: 2, service_id: 2, author: "Смирнов Иван Петрович", text: "Лучшее приложение для самозанятых! Быстро выставил чек клиенту.", rating: 5, date: "2025-02-15T14:20:00.000Z" },
    { id: 3, service_id: 7, author: "Сидоров Петр Алексеевич", text: "Очень удобно подписывать документы с телефона. Экономит время!", rating: 5, date: "2025-03-10T09:45:00.000Z" },
    { id: 4, service_id: 6, author: "Козлова Елена Дмитриевна", text: "Передаю показания счётчиков через приложение, очень быстро и удобно.", rating: 4, date: "2025-02-28T16:15:00.000Z" },
    { id: 5, service_id: 4, author: "Орлов Дмитрий Сергеевич", text: "Все анализы под рукой, не нужно носить с собой бумажные карты.", rating: 5, date: "2025-03-05T11:00:00.000Z" }
];

function saveServices() { localStorage.setItem('digital_services_services', JSON.stringify(services)); }
function saveUsers() { localStorage.setItem('digital_services_users', JSON.stringify(users)); }
function saveFavorites() { localStorage.setItem('digital_services_favorites', JSON.stringify(favorites)); }
function saveReviews() { localStorage.setItem('digital_services_reviews', JSON.stringify(reviews)); }

function saveAllData() {
    saveServices();
    saveUsers();
    saveFavorites();
    saveReviews();
}

function loadFromLocalStorage() {
    const storedServices = localStorage.getItem('digital_services_services');
    const storedUsers = localStorage.getItem('digital_services_users');
    const storedFavorites = localStorage.getItem('digital_services_favorites');
    const storedReviews = localStorage.getItem('digital_services_reviews');
    
    services = storedServices ? JSON.parse(storedServices) : JSON.parse(JSON.stringify(defaultServices));
    users = storedUsers ? JSON.parse(storedUsers) : JSON.parse(JSON.stringify(defaultUsers));
    favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    reviews = storedReviews ? JSON.parse(storedReviews) : JSON.parse(JSON.stringify(defaultReviews));
    
    services.forEach(service => {
        const serviceReviews = reviews.filter(r => r.service_id === service.id);
        if (serviceReviews.length > 0) {
            service.rating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
        }
    });
}

async function loadExternalDatabase() {
    const hasData = localStorage.getItem('digital_services_users') !== null;
    if (hasData) return;
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error('File not found');
        const dbData = await response.json();
        if (dbData.services) services = dbData.services;
        if (dbData.users) users = dbData.users;
        if (dbData.favorites) favorites = dbData.favorites;
        if (dbData.reviews) reviews = dbData.reviews;
        saveAllData();
        showToast("Database loaded", "success");
        renderMainView();
    } catch(e) {
        console.log("database.json not found");
    }
}

function getNextUserId() { 
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    return maxId + 1; 
}

function getNextServiceId() { 
    return Math.max(...services.map(s => s.id), 0) + 1; 
}

function getNextReviewId() { 
    return reviews.length > 0 ? Math.max(...reviews.map(r => r.id), 0) + 1 : 1; 
}

function getServiceReviews(serviceId) { 
    return reviews.filter(r => r.service_id === serviceId).sort((a,b) => new Date(b.date) - new Date(a.date)); 
}

function getUserReviews(userFullName) { 
    return reviews.filter(r => r.author === userFullName); 
}

function registerUser(login, surname, name, patronymic, email, password, role) {
    const formatName = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const formattedSurname = formatName(surname);
    const formattedName = formatName(name);
    const formattedPatronymic = formatName(patronymic);
    const fullName = formattedSurname + " " + formattedName + " " + formattedPatronymic;
    
    const newUser = {
        id: getNextUserId(),
        login: login,
        surname: formattedSurname,
        name: formattedName,
        patronymic: formattedPatronymic,
        fullName: fullName,
        email: email,
        password: password,
        role: role,
        regDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    return newUser;
}

function addReview(serviceId, author, text, rating) {
    const newReview = { 
        id: getNextReviewId(), 
        service_id: serviceId, 
        author: author, 
        text: text, 
        rating: rating, 
        date: new Date().toISOString() 
    };
    reviews.push(newReview);
    saveReviews();
    
    const serviceReviews = getServiceReviews(serviceId);
    const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
    const service = services.find(s => s.id === serviceId);
    if (service) { 
        service.rating = avgRating; 
        saveServices();
    }
    return newReview;
}

function addService(name, category, description, tags, url) {
    const newService = {
        id: getNextServiceId(),
        name: name,
        category: category,
        description: description,
        tags: tags,
        url: url,
        date: new Date().toISOString().split('T')[0],
        rating: 0,
        views: 0
    };
    services.push(newService);
    saveServices();
    return newService;
}

function deleteUserById(id) {
    const user = users.find(u => u.id === id);
    if (user && user.role === "admin") return false;
    users = users.filter(u => u.id !== id);
    reviews = reviews.filter(r => r.author !== user.fullName);
    favorites = favorites.filter(f => f.user_login !== user.login);
    saveUsers();
    saveReviews();
    saveFavorites();
    return true;
}

function updateStatsValues() {
    const totalServices = services.length;
    const totalUsers = users.filter(u => u.role === "citizen").length;
    const totalViews = services.reduce((sum, s) => sum + s.views, 0);
    const avgRating = services.reduce((sum, s) => sum + s.rating, 0) / services.length;
    
    statsValues = {
        services: totalServices,
        users: totalUsers,
        views: totalViews,
        rating: avgRating
    };
    
    const statServices = document.getElementById("statServices");
    const statUsers = document.getElementById("statUsers");
    const statViews = document.getElementById("statViews");
    const statRating = document.getElementById("statRating");
    
    if (statServices) statServices.innerText = totalServices;
    if (statUsers) statUsers.innerText = totalUsers;
    if (statViews) statViews.innerText = totalViews.toLocaleString();
    if (statRating) statRating.innerText = avgRating.toFixed(1);
}

function animateStats() {
    if (statsAnimated) {
        updateStatsValues();
        return;
    }
    statsAnimated = true;
    
    const totalServices = services.length;
    const totalUsers = users.filter(u => u.role === "citizen").length;
    const totalViews = services.reduce((sum, s) => sum + s.views, 0);
    const avgRating = services.reduce((sum, s) => sum + s.rating, 0) / services.length;
    
    statsValues = {
        services: totalServices,
        users: totalUsers,
        views: totalViews,
        rating: avgRating
    };
    
    const statsElements = [
        { element: document.getElementById("statServices"), target: totalServices, current: 0, isNumber: true },
        { element: document.getElementById("statUsers"), target: totalUsers, current: 0, isNumber: true },
        { element: document.getElementById("statViews"), target: totalViews, current: 0, isNumber: true },
        { element: document.getElementById("statRating"), target: avgRating, current: 0, isNumber: false }
    ];
    
    statsElements.forEach(stat => {
        if (!stat.element) return;
        const increment = stat.target / 50;
        const interval = setInterval(() => {
            stat.current += increment;
            if (stat.current >= stat.target) {
                if (stat.isNumber) {
                    stat.element.innerText = Math.round(stat.target);
                } else {
                    stat.element.innerText = stat.target.toFixed(1);
                }
                clearInterval(interval);
            } else {
                if (stat.isNumber) {
                    stat.element.innerText = Math.floor(stat.current);
                } else {
                    stat.element.innerText = stat.current.toFixed(1);
                }
            }
        }, 20);
    });
}

function getRecommendations() {
    if (!currentUser || currentUser.role !== "citizen") return [];
    const userFavorites = getFavorites(currentUser.login);
    if (userFavorites.length === 0) return services.slice(0, 3);
    
    const favoriteCategories = services.filter(s => userFavorites.includes(s.id)).map(s => s.category);
    const recommendations = services.filter(s => !userFavorites.includes(s.id) && favoriteCategories.includes(s.category));
    return recommendations.slice(0, 3);
}

function toggleTheme() {
    if (currentTheme === "dark") {
        document.body.classList.add("light");
        currentTheme = "light";
        document.getElementById("themeDark").classList.remove("active");
        document.getElementById("themeLight").classList.add("active");
    } else {
        document.body.classList.remove("light");
        currentTheme = "dark";
        document.getElementById("themeLight").classList.remove("active");
        document.getElementById("themeDark").classList.add("active");
    }
    localStorage.setItem("gos_theme", currentTheme);
}

function downloadPDF() {
    if (currentUser?.role !== "admin") { 
        showToast("Только для администратора", "error"); 
        return; 
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showToast("Разрешите всплывающие окна для печати", "error");
        return;
    }
    
    let tableRows = "";
    services.forEach(s => {
        tableRows += "<tr>" +
            "<td><strong>" + escapeHtml(s.name) + "</strong></td>" +
            "<td>" + getCategoryName(s.category) + "</td>" +
            "<td>" + (s.rating > 0 ? s.rating.toFixed(1) : "нет") + "</td>" +
            "<td>" + s.views + "</td>" +
            "<td>" + getServiceReviews(s.id).length + "</td>" +
            "<td>" + s.url + "</td>" +
        "</tr>";
    });
    
    const printHtml = "<!DOCTYPE html>" +
        "<html><head><meta charset='UTF-8'><title>Отчёт по сервисам</title>" +
        "<style>" +
            "body{font-family:'Segoe UI',Arial;margin:40px;background:white;}" +
            "h1{color:#1e293b;border-bottom:3px solid #3b82f6;padding-bottom:12px;}" +
            "table{width:100%;border-collapse:collapse;margin-top:20px;}" +
            "th{background:#3b82f6;color:white;padding:12px;text-align:left;}" +
            "td{padding:10px 12px;border-bottom:1px solid #e2e8f0;}" +
            "tr:hover{background:#f8fafc;}" +
            ".footer{margin-top:30px;text-align:center;color:#94a3b8;}" +
        "</style></head><body>" +
        "<div style='max-width:1200px;margin:0 auto;'>" +
            "<h1>Отчёт по цифровым сервисам</h1>" +
            "<p><strong>Дата формирования:</strong> " + new Date().toLocaleString() + "</p>" +
            "<p><strong>Всего сервисов:</strong> " + services.length + "</p>" +
            "<table><thead><tr><th>Название</th><th>Категория</th><th>Рейтинг</th><th>Просмотры</th><th>Отзывы</th><th>Ссылка</th></tr></thead>" +
            "<tbody>" + tableRows + "</tbody>}" +
            "<div class='footer'>Отчёт сгенерирован автоматически | ГосПомощник</div>" +
        "</div></body></html>";
    
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.print();
}

function validateFio(value) { const regex = /^[А-ЯЁ][а-яё]*([-][А-ЯЁ][а-яё]*)?$/; return value && value.length >= 2 && value.length <= 50 && regex.test(value); }
const allowedKeywords = ["госуслуг", "gosuslugi", "налог", "nalog", "фнс", "транспорт", "transport", "медкарт", "emias", "здоровь", "дневник", "dnevnik", "образован", "школ", "жиль", "жкх", "дом", "госключ", "gokey", "эцп", "подпись", "работа", "trudvsem", "пенсия", "соцзащит", "загранпаспорт", "паспорт", "мфц", "цифровой", "электрон", "портал"];

function validateServiceTopic(name, description, tags) { const text = (name + " " + description + " " + (tags || []).join(" ")).toLowerCase(); return allowedKeywords.some(k => text.includes(k)); }

function addView(serviceId) { const s = services.find(s => s.id === serviceId); if(s) { s.views++; saveServices(); } }
function getFavorites(login) { return favorites.filter(f => f.user_login === login).map(f => f.service_id); }
function addFavorite(login, serviceId) { if (!favorites.some(f => f.user_login === login && f.service_id === serviceId)) { favorites.push({ user_login: login, service_id: serviceId }); saveFavorites(); } }
function removeFavorite(login, serviceId) { favorites = favorites.filter(f => !(f.user_login === login && f.service_id === serviceId)); saveFavorites(); }
function getCategoryName(cat) { const names = { family:"Семья", transport:"Транспорт", finance:"Финансы", health:"Здоровье", education:"Образование", housing:"Жильё", digital:"Цифровые" }; return names[cat] || cat; }

function toggleCategories() { const c = document.getElementById('categories-content'), h = document.getElementById('categories-header'); if(c && h) { c.classList.toggle('collapsed'); h.classList.toggle('collapsed'); categoriesExpanded = !categoriesExpanded; } }
function toggleSort() { const c = document.getElementById('sort-content'), h = document.getElementById('sort-header'); if(c && h) { c.classList.toggle('collapsed'); h.classList.toggle('collapsed'); sortExpanded = !sortExpanded; } }
function togglePasswordVisibility(id) { const i = document.getElementById(id); i.type = i.type === 'password' ? 'text' : 'password'; }

function openForgotModal() { closeAuthModal(); document.getElementById("forgotEmail").value = ""; document.getElementById("forgotModal").classList.add("active"); }
function closeForgotModal() { document.getElementById("forgotModal").classList.remove("active"); }

function restorePassword() {
    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) { showToast("Введите email", "error"); return; }
    const user = users.find(u => u.email === email);
    if (user) {
        showToast("Ваш пароль: " + user.password, "success");
    } else {
        showToast("Пользователь с таким email не найден", "error");
    }
    closeForgotModal();
    openAuthModal();
}

function showAllReviews(serviceId, serviceName) {
    const serviceReviews = getServiceReviews(serviceId);
    document.getElementById("allReviewsTitle").innerText = "Отзывы о сервисе \"" + serviceName + "\" (" + serviceReviews.length + ")";
    document.getElementById("allReviewsList").innerHTML = serviceReviews.length === 0 ? '<div class="empty-reviews">Нет отзывов</div>' : serviceReviews.map(r => 
        "<div class='review-card'><div class='review-card-header'><span class='review-author'>" + escapeHtml(r.author) + "</span><div><span class='review-rating'>" + "★".repeat(r.rating) + "</span> <span class='review-date'>" + new Date(r.date).toLocaleDateString() + "</span></div></div><div class='review-text'>" + escapeHtml(r.text) + "</div></div>"
    ).join('');
    document.getElementById("allReviewsModal").classList.add("active");
}

function closeAllReviewsModal() { document.getElementById("allReviewsModal").classList.remove("active"); }

function getCategoryCount() {
    const counts = { all: services.length };
    services.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return counts;
}

function getTopServices() {
    return [...services].sort((a, b) => b.views - a.views).slice(0, 3);
}

function renderMainView() {
    const isAdmin = currentUser && currentUser.role === "admin";
    const isCitizen = currentUser && currentUser.role === "citizen";
    const categoryCounts = getCategoryCount();
    const randomQuote = getRandomQuote();
    const topServices = getTopServices();
    const recommendations = getRecommendations();
    
    const statsHtml = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="statServices">0</div>
                <div class="stat-label">Цифровых сервисов</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="statUsers">0</div>
                <div class="stat-label">Активных граждан</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="statViews">0</div>
                <div class="stat-label">Всего просмотров</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="statRating">0</div>
                <div class="stat-label">Средний рейтинг</div>
            </div>
        </div>
        
        <div class="quote-card">
            <div class="quote-text">"${randomQuote}"</div>
            <div class="quote-author">Цифровой помощник</div>
        </div>
        
        <div class="top-services">
            <div class="section-title">Популярные сервисы</div>
            <div class="top-services-grid">
                ${topServices.map((s, idx) => `
                    <div class="top-service-card" onclick="openServiceUrl(${s.id})">
                        <div class="top-rank">${idx + 1}</div>
                        <div class="top-info">
                            <div class="top-name">${escapeHtml(s.name)}</div>
                            <div class="top-stats">${s.views.toLocaleString()} просмотров</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const recommendationsHtml = isCitizen && recommendations.length > 0 ? `
        <div class="recommendations">
            <div class="section-title">Рекомендации для вас</div>
            <div class="recommendations-grid">
                ${recommendations.map(s => `
                    <div class="recommendation-card" onclick="openServiceUrl(${s.id})">
                        <div class="rec-name">${escapeHtml(s.name)}</div>
                        <div class="rec-category">${getCategoryName(s.category)}</div>
                        <div class="rec-rating">${'★'.repeat(Math.floor(s.rating))} ${s.rating.toFixed(1)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';
    
    const filtersHtml = `
        <div class="filters-bar">
            <input type="text" class="search-input" id="searchInput" placeholder="Поиск по названию, описанию или тегам..." oninput="filterServices()">
            <div class="filter-section">
                <div class="filter-header ${categoriesExpanded ? '' : 'collapsed'}" id="categories-header" onclick="toggleCategories()">
                    <span>Категории услуг</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="filter-content ${categoriesExpanded ? '' : 'collapsed'}" id="categories-content">
                    <div class="filter-chips" id="categoryChips"></div>
                </div>
            </div>
            <div class="filter-section">
                <div class="filter-header ${sortExpanded ? '' : 'collapsed'}" id="sort-header" onclick="toggleSort()">
                    <span>Сортировка</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="filter-content ${sortExpanded ? '' : 'collapsed'}" id="sort-content">
                    <div class="filter-chips" id="sortChips"></div>
                </div>
            </div>
            ${isAdmin ? `
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="openAddServiceModal()">Добавить сервис</button>
                    <button class="btn btn-secondary" onclick="downloadPDF()">PDF</button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById("mainContent").innerHTML = statsHtml + recommendationsHtml + filtersHtml + '<div class="services-grid" id="servicesGrid"></div>';
    
    const categories = ["all", "family", "transport", "finance", "health", "education", "housing", "digital"];
    const catNames = { all:"Все", family:"Семья", transport:"Транспорт", finance:"Финансы", health:"Здоровье", education:"Образование", housing:"Жильё", digital:"Цифровые" };
    const catContainer = document.getElementById("categoryChips");
    if(catContainer) catContainer.innerHTML = categories.map(cat => `<div class="chip ${currentCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">${catNames[cat]} <span style="opacity:0.6; font-size:0.7rem;">(${categoryCounts[cat] || 0})</span></div>`).join('');
    
    const sorts = ["rating", "views", "name"];
    const sortNames = { rating:"По рейтингу", views:"По популярности", name:"По названию" };
    const sortContainer = document.getElementById("sortChips");
    if(sortContainer) sortContainer.innerHTML = sorts.map(s => `<div class="chip ${currentSort === s ? 'active' : ''}" onclick="setSort('${s}')">${sortNames[s]}</div>`).join('');
    
    animateStats();
    renderServices();
}

function setCategory(cat) { 
    currentCategory = cat; 
    renderMainView(); 
}

function setSort(sort) { 
    currentSort = sort; 
    renderMainView(); 
}

function renderServices() {
    let filtered = [...services];
    const searchInput = document.getElementById("searchInput");
    if(searchInput && searchInput.value) {
        const term = searchInput.value.toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(term) || (s.description && s.description.toLowerCase().includes(term)) || (s.tags && s.tags.some(t => t.toLowerCase().includes(term))));
    }
    if(currentCategory !== "all") filtered = filtered.filter(s => s.category === currentCategory);
    if(currentSort === "rating") filtered.sort((a,b) => b.rating - a.rating);
    else if(currentSort === "views") filtered.sort((a,b) => b.views - a.views);
    else filtered.sort((a,b) => a.name.localeCompare(b.name));
    
    const grid = document.getElementById("servicesGrid");
    if(!grid) return;
    if(filtered.length === 0) { 
        grid.innerHTML = '<div style="text-align:center; padding:60px;">Сервисы не найдены</div>'; 
        return; 
    }
    
    const isAdmin = currentUser && currentUser.role === "admin";
    const isCitizen = currentUser && currentUser.role === "citizen";
    const userFavorites = currentUser ? getFavorites(currentUser.login) : [];
    
    grid.innerHTML = filtered.map((s, idx) => {
        const serviceReviews = getServiceReviews(s.id);
        const starsHtml = s.rating > 0 ? '<span class="stars">' + '★'.repeat(Math.floor(s.rating)) + '☆'.repeat(5 - Math.floor(s.rating)) + '</span>' : '<span class="stars">☆☆☆☆☆</span>';
        return '<div class="service-card" style="animation-delay: ' + (idx * 0.05) + 's">' +
            '<div class="service-title" onclick="openServiceUrl(' + s.id + ')">' + escapeHtml(s.name) + '</div>' +
            '<div class="service-category">' + getCategoryName(s.category) + '</div>' +
            '<div class="rating">' + starsHtml + ' <span>' + (s.rating > 0 ? s.rating.toFixed(1) : 'нет оценок') + '</span> <span style="opacity:0.6;">(' + s.views + ' просмотров)</span></div>' +
            '<div class="service-desc">' + escapeHtml((s.description || '').substring(0, 100)) + ((s.description || '').length > 100 ? '...' : '') + '</div>' +
            '<div class="tags">' + (s.tags || []).map(t => '<span class="tag">#' + escapeHtml(t) + '</span>').join('') + '</div>' +
            '<div class="reviews-section"><div class="reviews-preview"><span>Отзывы (' + serviceReviews.length + ')</span><button class="btn btn-ghost btn-sm" onclick="showAllReviews(' + s.id + ', \'' + escapeHtml(s.name) + '\')">Все отзывы</button></div>' +
            (serviceReviews.slice(0,1).map(r => '<div class="review-preview-item"><span class="review-preview-author">' + escapeHtml(r.author) + '</span>: ' + escapeHtml(r.text.substring(0, 50)) + (r.text.length > 50 ? '...' : '') + '</div>').join('')) +
            (serviceReviews.length === 0 ? '<div style="text-align:center; padding:8px; opacity:0.6;">Нет отзывов</div>' : '') +
            (serviceReviews.length > 1 ? '<div style="text-align:right; font-size:0.7rem; opacity:0.6;">ещё ' + (serviceReviews.length - 1) + ' отзыв...</div>' : '') +
            (isCitizen ? '<div style="margin-top:8px;"><button class="btn btn-outline btn-sm" style="width:100%;" onclick="openReviewModal(' + s.id + ')">Написать отзыв</button></div>' : '') +
            '</div><div class="card-buttons">' +
            '<button class="btn btn-outline" onclick="showDetail(' + s.id + ')">Подробнее</button>' +
            (isAdmin ? '<button class="btn btn-outline" onclick="editService(' + s.id + ')">Редактировать</button><button class="btn btn-danger" onclick="deleteService(' + s.id + ')">Удалить</button>' : '') +
            (isCitizen ? '<button class="btn btn-outline" onclick="toggleFavorite(' + s.id + ')" style="background: ' + (userFavorites.includes(s.id) ? 'rgba(239,68,68,0.2)' : 'transparent') + '; border-color:' + (userFavorites.includes(s.id) ? '#ef4444' : 'var(--border)') + ';">' + (userFavorites.includes(s.id) ? 'Убрать' : 'В избранное') + '</button>' : '') +
            '<button class="btn btn-success" onclick="openServiceUrl(' + s.id + ')">Открыть</button>' +
            '</div></div>';
    }).join('');
}

function showProfileView() {
    if (!currentUser || currentUser.role !== "citizen") { showToast("Войдите как гражданин", "error"); openAuthModal(); return; }
    const userFavorites = getFavorites(currentUser.login);
    const favServices = services.filter(s => userFavorites.includes(s.id));
    const userReviews = getUserReviews(currentUser.fullName);
    const lastLogin = new Date(currentUser.lastLogin || Date.now()).toLocaleDateString();
    const regDate = new Date(currentUser.regDate || Date.now()).toLocaleDateString();
    
    document.getElementById("mainContent").innerHTML = `
        <div style="background:var(--card-bg); border-radius:24px; padding:32px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:24px;">
                <h2 style="font-size:1.8rem;">Личный кабинет</h2>
                <div class="stats-cards" style="margin-bottom:0;">
                    <div class="stat-card"><h4>В избранном</h4><div class="value">${favServices.length}</div></div>
                    <div class="stat-card"><h4>Отзывов написано</h4><div class="value">${userReviews.length}</div></div>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:24px;">
                    <h3 style="margin-bottom:16px;">Личная информация</h3>
                    <div style="margin-bottom:12px;"><strong>Логин:</strong> ${escapeHtml(currentUser.login)}</div>
                    <div style="margin-bottom:12px;"><strong>ФИО:</strong> ${escapeHtml(currentUser.fullName)}</div>
                    <div style="margin-bottom:12px;"><strong>Email:</strong> ${escapeHtml(currentUser.email)}</div>
                    <div style="margin-bottom:12px;"><strong>Дата регистрации:</strong> ${regDate}</div>
                    <div style="margin-bottom:12px;"><strong>Последний вход:</strong> ${lastLogin}</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border-radius:20px; padding:24px;">
                    <h3 style="margin-bottom:16px;">Избранное (${favServices.length})</h3>
                    ${favServices.length === 0 ? "<p style='opacity:0.6;'>Нет избранных сервисов</p>" : favServices.map(s => `<div style="padding:12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;"><b>${escapeHtml(s.name)}</b><button class="btn btn-success btn-sm" onclick="window.open('${s.url}','_blank')">Открыть</button></div>`).join('')}
                </div>
            </div>
            <div style="margin-top:24px; background:rgba(255,255,255,0.03); border-radius:20px; padding:24px;">
                <h3 style="margin-bottom:16px;">Мои последние отзывы</h3>
                ${userReviews.length === 0 ? "<p style='opacity:0.6;'>Вы ещё не написали ни одного отзыва</p>" : userReviews.slice(0,3).map(r => {
                    const service = services.find(s => s.id === r.service_id);
                    return `<div style="padding:12px; border-bottom:1px solid var(--border);"><div><span style="color:var(--warning);">${'★'.repeat(r.rating)}</span> <strong>${service ? service.name : 'Сервис'}</strong></div><div style="font-size:0.8rem; opacity:0.7;">${escapeHtml(r.text)}</div><div style="font-size:0.7rem; opacity:0.5;">${new Date(r.date).toLocaleDateString()}</div></div>`;
                }).join('')}
                ${userReviews.length > 3 ? `<div style="text-align:center; margin-top:12px;"><button class="btn btn-ghost btn-sm" onclick="showAllUserReviews()">Все отзывы (${userReviews.length})</button></div>` : ''}
            </div>
        </div>
    `;
}

function showAllUserReviews() {
    const userReviews = getUserReviews(currentUser.fullName);
    document.getElementById("allReviewsTitle").innerText = "Мои отзывы (" + userReviews.length + ")";
    document.getElementById("allReviewsList").innerHTML = userReviews.length === 0 ? '<div class="empty-reviews">Нет отзывов</div>' : userReviews.map(r => {
        const service = services.find(s => s.id === r.service_id);
        return "<div class='review-card'><div class='review-card-header'><span class='review-author'>" + escapeHtml(service ? service.name : 'Сервис') + "</span><div><span class='review-rating'>" + "★".repeat(r.rating) + "</span> <span class='review-date'>" + new Date(r.date).toLocaleDateString() + "</span></div></div><div class='review-text'>" + escapeHtml(r.text) + "</div></div>";
    }).join('');
    document.getElementById("allReviewsModal").classList.add("active");
}

function showUsersPanel() {
    if (currentUser?.role !== "admin") { showToast("Доступно только администраторам", "error"); return; }
    
    let filteredUsers = users.filter(u => u.role === "citizen");
    if (usersSearch && usersSearch.trim() !== "") {
        const searchTerm = usersSearch.toLowerCase().trim();
        filteredUsers = filteredUsers.filter(u => u.fullName.toLowerCase().includes(searchTerm) || u.login.toLowerCase().includes(searchTerm));
    }
    
    filteredUsers.sort((a, b) => {
        let valA, valB;
        if (usersSortBy === "name") { valA = a.fullName; valB = b.fullName; }
        else if (usersSortBy === "date") { valA = new Date(a.regDate); valB = new Date(b.regDate); }
        else { valA = a.email; valB = b.email; }
        if (usersSortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    });
    
    const totalCitizens = users.filter(u => u.role === "citizen").length;
    const activeUsers = users.filter(u => u.role === "citizen" && new Date(u.lastLogin).getTime() > Date.now() - 30*24*60*60*1000).length;
    
    const html = `
        <div class="filters-bar">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <input type="text" class="search-input" id="userSearchInput" style="width:300px; margin:0;" placeholder="Поиск по ФИО или логину..." value="${escapeHtml(usersSearch)}">
            </div>
        </div>
        <div class="stats-cards">
            <div class="stat-card"><h4>Всего граждан</h4><div class="value">${totalCitizens}</div></div>
            <div class="stat-card"><h4>Активных пользователей</h4><div class="value">${activeUsers}</div></div>
            <div class="stat-card"><h4>Всего отзывов</h4><div class="value">${reviews.length}</div></div>
        </div>
        <div class="users-table-container">
            <table class="users-table">
                <thead>
                    <tr><th onclick="setUsersSortAndRefresh('name')">ФИО ${usersSortBy === 'name' ? (usersSortOrder === 'asc' ? '↑' : '↓') : '↕'}</th>
                    <th onclick="setUsersSortAndRefresh('login')">Логин</th>
                    <th onclick="setUsersSortAndRefresh('email')">Email ${usersSortBy === 'email' ? (usersSortOrder === 'asc' ? '↑' : '↓') : '↕'}</th>
                    <th onclick="setUsersSortAndRefresh('date')">Дата регистрации ${usersSortBy === 'date' ? (usersSortOrder === 'asc' ? '↑' : '↓') : '↕'}</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                    ${filteredUsers.map(u => {
                        const regDateFormatted = new Date(u.regDate).toLocaleDateString();
                        return `<tr>
                            <td><strong>${escapeHtml(u.fullName)}</strong></span></td>
                            <td>${escapeHtml(u.login)}</span></td>
                            <td>${escapeHtml(u.email)}</span></td>
                            <td>${regDateFormatted}</span></td>
                            <td><span class="user-status active">Активен</span></td>
                            <td><button class="btn btn-danger btn-sm" onclick="deleteUserAndRefresh(${u.id})">Удалить</button></td>
                        </tr>`;
                    }).join('')}
                    ${filteredUsers.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding:40px;">Пользователи не найдены</td>' : ''}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById("mainContent").innerHTML = html;
    
    const searchInput = document.getElementById("userSearchInput");
    if (searchInput) {
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        newInput.value = usersSearch;
        newInput.addEventListener('input', function(e) {
            usersSearch = e.target.value;
            showUsersPanel();
        });
        newInput.focus();
        newInput.setSelectionRange(usersSearch.length, usersSearch.length);
    }
}

function setUsersSortAndRefresh(field) { 
    if (usersSortBy === field) usersSortOrder = usersSortOrder === "asc" ? "desc" : "asc";
    else { usersSortBy = field; usersSortOrder = "asc"; } 
    showUsersPanel(); 
}

function deleteUserAndRefresh(id) {
    if (confirm("Удалить пользователя? Все его отзывы также будут удалены.")) {
        const user = users.find(u => u.id === id);
        if (user && user.role === "admin") { showToast("Нельзя удалить администратора", "error"); return; }
        users = users.filter(u => u.id !== id);
        reviews = reviews.filter(r => r.author !== user.fullName);
        favorites = favorites.filter(f => f.user_login !== user.login);
        saveUsers(); saveReviews(); saveFavorites();
        showToast("Пользователь удалён", "success");
        showUsersPanel();
    }
}

function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, function(m) { if(m === '&') return '&amp;'; if(m === '<') return '&lt;'; if(m === '>') return '&gt;'; return m; }); }

async function toggleFavorite(serviceId) { 
    if (!currentUser || currentUser.role !== "citizen") { 
        showToast("Войдите как гражданин", "error"); 
        openAuthModal(); 
        return; 
    } 
    const f = getFavorites(currentUser.login); 
    if(f.includes(serviceId)) { 
        removeFavorite(currentUser.login, serviceId); 
        showToast("Удалено из избранного"); 
    } else { 
        addFavorite(currentUser.login, serviceId); 
        showToast("Добавлено в избранное"); 
    } 
    renderServices(); 
}

async function openServiceUrl(id) { 
    const s = services.find(s => s.id === id); 
    if(s && s.url) { 
        addView(id); 
        window.open(s.url, '_blank'); 
        renderServices(); 
    } else { 
        showToast("Ссылка не указана", "error"); 
    } 
}

async function openCurrentServiceUrl() { 
    if(currentEditServiceId) await openServiceUrl(currentEditServiceId); 
}

function showToast(msg, type) { 
    type = type || "success"; 
    const t = document.createElement("div"); 
    t.className = "toast " + type; 
    t.innerText = msg; 
    document.body.appendChild(t); 
    setTimeout(function() { t.remove(); }, 3000); 
}

async function showDetail(id) { 
    const s = services.find(s => s.id === id); 
    if(!s) return; 
    currentEditServiceId = id; 
    document.getElementById("detailTitle").innerText = s.name; 
    document.getElementById("detailCategory").innerText = getCategoryName(s.category); 
    document.getElementById("detailRating").innerHTML = s.rating > 0 ? '★'.repeat(Math.floor(s.rating)) + ' ' + s.rating.toFixed(1) : "Нет оценок"; 
    document.getElementById("detailUrl").innerHTML = '<a href="' + s.url + '" target="_blank" style="color:var(--primary);">' + s.url + '</a>'; 
    document.getElementById("detailDesc").innerText = s.description; 
    document.getElementById("detailTags").innerText = (s.tags || []).join(", "); 
    document.getElementById("detailModal").classList.add("active"); 
}

function closeDetailModal() { 
    document.getElementById("detailModal").classList.remove("active"); 
}

function editCurrentService() { 
    closeDetailModal(); 
    editService(currentEditServiceId); 
}

function editService(id) { 
    if(currentUser?.role !== "admin") { 
        showToast("Доступно админам", "error"); 
        return; 
    } 
    const s = services.find(s => s.id === id); 
    if(s) { 
        document.getElementById("editModalTitle").innerText = "Редактирование"; 
        document.getElementById("serviceName").value = s.name; 
        document.getElementById("serviceCategory").value = s.category; 
        document.getElementById("serviceUrl").value = s.url; 
        document.getElementById("serviceDesc").value = s.description; 
        document.getElementById("serviceTags").value = (s.tags || []).join(", "); 
        document.getElementById("editId").value = s.id; 
        document.getElementById("editModal").classList.add("active"); 
    } 
}

function openAddServiceModal() { 
    if(currentUser?.role !== "admin") { 
        showToast("Доступно только администраторам", "error"); 
        return; 
    } 
    document.getElementById("editModalTitle").innerText = "Добавление сервиса"; 
    document.getElementById("serviceName").value = ""; 
    document.getElementById("serviceCategory").value = "family"; 
    document.getElementById("serviceUrl").value = ""; 
    document.getElementById("serviceDesc").value = ""; 
    document.getElementById("serviceTags").value = ""; 
    document.getElementById("editId").value = ""; 
    document.getElementById("editModal").classList.add("active"); 
}

async function saveService(e) { 
    e.preventDefault(); 
    if(currentUser?.role !== "admin") { 
        showToast("Доступно админам", "error"); 
        return; 
    } 
    const name = document.getElementById("serviceName").value.trim(); 
    const category = document.getElementById("serviceCategory").value; 
    const url = document.getElementById("serviceUrl").value.trim(); 
    const desc = document.getElementById("serviceDesc").value.trim(); 
    const tagsStr = document.getElementById("serviceTags").value; 
    const tags = tagsStr.split(",").map(function(t) { return t.trim(); }).filter(function(t) { return t; }); 
    const id = document.getElementById("editId").value; 
    if(!name || !desc || !url) { 
        showToast("Заполните все поля", "error"); 
        return; 
    } 
    if(!validateServiceTopic(name, desc, tags)) { 
        showToast("Ошибка: Сервис должен относиться к госуслугам РФ", "error"); 
        return; 
    } 
    if(id) { 
        const index = services.findIndex(function(s) { return s.id == id; }); 
        if(index !== -1) { 
            services[index] = { ...services[index], name: name, category: category, description: desc, tags: tags, url: url }; 
            saveServices(); 
            showToast("Сервис обновлён", "success"); 
        } 
    } else { 
        addService(name, category, desc, tags, url); 
        showToast("Сервис добавлен", "success"); 
    } 
    closeEditModal(); 
    renderMainView(); 
}

async function deleteService(id) { 
    if(currentUser?.role !== "admin") return; 
    if(confirm("Удалить сервис?")) { 
        services = services.filter(function(s) { return s.id !== id; }); 
        saveServices(); 
        renderMainView(); 
        showToast("Удалено", "success"); 
    } 
}

function closeEditModal() { 
    document.getElementById("editModal").classList.remove("active"); 
}

function filterServices() { 
    renderServices(); 
}

function openReviewModal(serviceId) { 
    if(!currentUser || currentUser.role !== "citizen") { 
        showToast("Войдите как гражданин", "error"); 
        openAuthModal(); 
        return; 
    } 
    pendingReviewServiceId = serviceId; 
    document.getElementById("reviewRatingSelect").value = "5"; 
    document.getElementById("reviewTextArea").value = ""; 
    document.getElementById("reviewModal").classList.add("active"); 
}

function closeReviewModal() { 
    document.getElementById("reviewModal").classList.remove("active"); 
    pendingReviewServiceId = null; 
}

async function submitReview() { 
    if(!pendingReviewServiceId) return; 
    const text = document.getElementById("reviewTextArea").value.trim(); 
    const rating = parseInt(document.getElementById("reviewRatingSelect").value); 
    if(!text) { 
        showToast("Введите текст отзыва", "error"); 
        return; 
    } 
    addReview(pendingReviewServiceId, currentUser.fullName, text, rating); 
    showToast("Отзыв добавлен!", "success"); 
    closeReviewModal(); 
    renderServices(); 
}

function selectRole(role) { 
    selectedRole = role; 
    document.querySelectorAll('#authModal .role-option').forEach(function(opt) { 
        opt.classList.toggle('selected', opt.innerText.includes(role === "citizen" ? "Гражданин" : "Администратор")); 
    }); 
}

function selectRegRole(role) { 
    selectedRole = role; 
    document.querySelectorAll('#registerModal .role-option').forEach(function(opt) { 
        opt.classList.toggle('selected', opt.innerText.includes(role === "citizen" ? "Гражданин" : "Администратор")); 
    }); 
}

function openAuthModal() { 
    document.getElementById("loginUsername").value = ""; 
    document.getElementById("passwordInput").value = ""; 
    document.getElementById("passwordInput").type = "password"; 
    document.getElementById("authModal").classList.add("active"); 
}

function closeAuthModal() { 
    document.getElementById("authModal").classList.remove("active"); 
}

function openRegisterModal() { 
    closeAuthModal(); 
    document.getElementById("regLogin").value = ""; 
    document.getElementById("regSurname").value = ""; 
    document.getElementById("regName").value = ""; 
    document.getElementById("regPatronymic").value = ""; 
    document.getElementById("regEmailInput").value = ""; 
    document.getElementById("regPasswordInput").value = ""; 
    document.getElementById("regPasswordConfirmInput").value = ""; 
    document.getElementById("regPasswordInput").type = "password"; 
    document.getElementById("regPasswordConfirmInput").type = "password"; 
    document.getElementById("regLoginError").innerText = ""; 
    document.getElementById("regSurnameError").innerText = ""; 
    document.getElementById("regNameError").innerText = ""; 
    document.getElementById("regPatronymicError").innerText = ""; 
    document.getElementById("regEmailError").innerText = ""; 
    document.getElementById("regPasswordError").innerText = ""; 
    document.getElementById("regPasswordConfirmError").innerText = ""; 
    document.getElementById("registerModal").classList.add("active"); 
}

function closeRegisterModal() { 
    document.getElementById("registerModal").classList.remove("active"); 
}

function login() { 
    const login = document.getElementById("loginUsername").value.trim(); 
    const pass = document.getElementById("passwordInput").value; 
    if(!login) { 
        showToast("Введите логин", "error"); 
        return; 
    } 
    const user = users.find(function(u) { return u.login === login && u.password === pass && u.role === selectedRole; }); 
    if(user) { 
        user.lastLogin = new Date().toISOString(); 
        saveUsers(); 
        currentUser = { 
            id: user.id, 
            login: user.login, 
            surname: user.surname, 
            name: user.name, 
            patronymic: user.patronymic, 
            fullName: user.fullName, 
            email: user.email, 
            role: user.role, 
            regDate: user.regDate, 
            lastLogin: user.lastLogin 
        }; 
        localStorage.setItem("digital_services_currentUser", JSON.stringify(currentUser)); 
        showToast("Добро пожаловать, " + user.fullName, "success"); 
        updateUI(); 
        closeAuthModal(); 
        renderMainView(); 
    } else { 
        showToast("Неверный логин, пароль или роль", "error"); 
    } 
}

function validateEmail(email) { 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
}

function register() { 
    const login = document.getElementById("regLogin").value.trim(); 
    const surname = document.getElementById("regSurname").value.trim(); 
    const name = document.getElementById("regName").value.trim(); 
    const patronymic = document.getElementById("regPatronymic").value.trim(); 
    const email = document.getElementById("regEmailInput").value.trim(); 
    const pass = document.getElementById("regPasswordInput").value; 
    const confirm = document.getElementById("regPasswordConfirmInput").value; 
    let isValid = true; 
    
    if(!login) { 
        document.getElementById("regLoginError").innerText = "Введите логин"; 
        isValid = false; 
    } else if(users.some(function(u) { return u.login === login; })) { 
        document.getElementById("regLoginError").innerText = "Логин занят"; 
        isValid = false; 
    } else if(login.length < 3) { 
        document.getElementById("regLoginError").innerText = "Логин не менее 3 символов"; 
        isValid = false; 
    } else { 
        document.getElementById("regLoginError").innerText = ""; 
    }
    
    if(!surname) { 
        document.getElementById("regSurnameError").innerText = "Введите фамилию"; 
        isValid = false; 
    } else if(!validateFio(surname)) { 
        document.getElementById("regSurnameError").innerText = "Только русские буквы, мин 2 символа"; 
        isValid = false; 
    } else { 
        document.getElementById("regSurnameError").innerText = ""; 
    }
    
    if(!name) { 
        document.getElementById("regNameError").innerText = "Введите имя"; 
        isValid = false; 
    } else if(!validateFio(name)) { 
        document.getElementById("regNameError").innerText = "Только русские буквы, мин 2 символа"; 
        isValid = false; 
    } else { 
        document.getElementById("regNameError").innerText = ""; 
    }
    
    if(!patronymic) { 
        document.getElementById("regPatronymicError").innerText = "Введите отчество"; 
        isValid = false; 
    } else if(!validateFio(patronymic)) { 
        document.getElementById("regPatronymicError").innerText = "Только русские буквы, мин 2 символа"; 
        isValid = false; 
    } else { 
        document.getElementById("regPatronymicError").innerText = ""; 
    }
    
    if(!email) { 
        document.getElementById("regEmailError").innerText = "Введите email"; 
        isValid = false; 
    } else if(!validateEmail(email)) { 
        document.getElementById("regEmailError").innerText = "Некорректный email"; 
        isValid = false; 
    } else { 
        document.getElementById("regEmailError").innerText = ""; 
    }
    
    if(!pass) { 
        document.getElementById("regPasswordError").innerText = "Введите пароль"; 
        isValid = false; 
    } else if(pass.length < 4) { 
        document.getElementById("regPasswordError").innerText = "Пароль не менее 4 символов"; 
        isValid = false; 
    } else { 
        document.getElementById("regPasswordError").innerText = ""; 
    }
    
    if(pass !== confirm) { 
        document.getElementById("regPasswordConfirmError").innerText = "Пароли не совпадают"; 
        isValid = false; 
    } else { 
        document.getElementById("regPasswordConfirmError").innerText = ""; 
    }
    
    if(!isValid) return; 
    
    const formatName = function(str) { 
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
    }; 
    const formattedSurname = formatName(surname); 
    const formattedName = formatName(name); 
    const formattedPatronymic = formatName(patronymic); 
    const fullName = formattedSurname + " " + formattedName + " " + formattedPatronymic; 
    const newUser = registerUser(login, formattedSurname, formattedName, formattedPatronymic, email, pass, selectedRole); 
    showToast("Регистрация успешна!", "success"); 
    closeRegisterModal(); 
    openAuthModal(); 
}

function logout() { 
    currentUser = null; 
    localStorage.removeItem("digital_services_currentUser"); 
    updateUI(); 
    showToast("Вы вышли", "success"); 
    renderMainView(); 
}

function updateUI() { 
    const authBtn = document.getElementById("authBtn"); 
    const profileLink = document.getElementById("profileLink"); 
    const adminUsersLink = document.getElementById("adminUsersLink"); 
    const userNameSpan = document.getElementById("userName"); 
    if(currentUser) { 
        authBtn.innerText = "Выйти"; 
        authBtn.onclick = logout; 
        userNameSpan.style.display = "inline"; 
        userNameSpan.innerText = currentUser.login; 
        profileLink.style.display = currentUser.role === "citizen" ? "inline-block" : "none"; 
        adminUsersLink.style.display = currentUser.role === "admin" ? "inline-block" : "none"; 
    } else { 
        authBtn.innerText = "Вход"; 
        authBtn.onclick = openAuthModal; 
        profileLink.style.display = "none"; 
        adminUsersLink.style.display = "none"; 
        userNameSpan.style.display = "none"; 
    } 
}

function showMainView() { 
    renderMainView(); 
}

// Инициализация темы
const savedTheme = localStorage.getItem("gos_theme");
if (savedTheme === "light") {
    document.body.classList.add("light");
    currentTheme = "light";
} else {
    currentTheme = "dark";
}
document.getElementById("themeDark").classList.toggle("active", currentTheme === "dark");
document.getElementById("themeLight").classList.toggle("active", currentTheme === "light");

// Очистка старых данных
if (!localStorage.getItem('digital_services_cleaned')) {
    localStorage.removeItem('digital_services_users');
    localStorage.removeItem('digital_services_reviews');
    localStorage.removeItem('digital_services_favorites');
    localStorage.removeItem('digital_services_currentUser');
    localStorage.setItem('digital_services_cleaned', 'true');
}

// Запуск приложения
loadFromLocalStorage();
loadExternalDatabase();
const savedUser = localStorage.getItem("digital_services_currentUser");
if(savedUser) { 
    currentUser = JSON.parse(savedUser); 
    updateUI(); 
}
renderMainView();

// Экспорт функций в глобальный объект
window.showMainView = showMainView;
window.showProfileView = showProfileView;
window.showUsersPanel = showUsersPanel;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openForgotModal = openForgotModal;
window.closeForgotModal = closeForgotModal;
window.restorePassword = restorePassword;
window.openRegisterModal = openRegisterModal;
window.closeRegisterModal = closeRegisterModal;
window.selectRole = selectRole;
window.selectRegRole = selectRegRole;
window.register = register;
window.login = login;
window.logout = logout;
window.showDetail = showDetail;
window.closeDetailModal = closeDetailModal;
window.editService = editService;
window.deleteService = deleteService;
window.saveService = saveService;
window.closeEditModal = closeEditModal;
window.filterServices = filterServices;
window.editCurrentService = editCurrentService;
window.openServiceUrl = openServiceUrl;
window.openCurrentServiceUrl = openCurrentServiceUrl;
window.openAddServiceModal = openAddServiceModal;
window.setCategory = setCategory;
window.setSort = setSort;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.submitReview = submitReview;
window.toggleFavorite = toggleFavorite;
window.toggleCategories = toggleCategories;
window.toggleSort = toggleSort;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showAllReviews = showAllReviews;
window.closeAllReviewsModal = closeAllReviewsModal;
window.downloadPDF = downloadPDF;
window.toggleTheme = toggleTheme;
window.setUsersSortAndRefresh = setUsersSortAndRefresh;
window.deleteUserAndRefresh = deleteUserAndRefresh;
window.showAllUserReviews = showAllUserReviews;