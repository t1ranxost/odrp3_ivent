let eventsData = [
    { id: 1, name: "Ждите загрузки...", platform: "Ивент-отдел UnionTeam", organizer: "-", date: "", status: "Проведен", rating: "", members: 0, callStatus: "🟡Скоро", fullDetails: { description: "под вами 4 пропа разных цветов и над вами 1 проп. вам нужно встать на цвета соответствующие пропу над вами.", tasks: "", feedback: "", rewards: "", extra: "" } },
];

let teamData = [
    { id: 1, name: "Ждите загрузки...", role: "Ивент-отдел UnionTeam", discord: "-", status: "Онлайн", eventsCount: "-", joinDate: "-", rating: "-", category: "Старший состав", fullDetails: { responsibilities: "Имеет полное владение над отделом Ивентологии, может самостоятельно изменять состав отдела Ивентологии и их норму/правила.", contacts: "https://admin.unionteams.ru/4/admin/76561198386405573", achievements: "0", notes: "" } },
];

// ========== СИСТЕМА УВЕДОМЛЕНИЙ СВЕРХУ ==========
let notifications = JSON.parse(localStorage.getItem('union_notifications')) || [];

// ========== ФИКС ФОНА ==========
(function fixBackground() {
    const bg = document.getElementById('moving-bg');
    if (!bg) {
        console.error('❌ #moving-bg не найден');
        return;
    }
    
    // Убираем все стили и ставим свои
    bg.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: url('https://s.fotora.ru/be0edaffa720ff03.jpeg
') center/cover no-repeat !important;
        z-index: -2 !important;
        pointer-events: none !important;
    `;
    
    console.log('✅ Фон принудительно установлен');
})();

function saveNotificationsLocal() {
    localStorage.setItem('union_notifications', JSON.stringify(notifications));
}

function updateNotificationPanel() {
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationList');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (badge) {
        if (unreadCount === 0) {
            badge.style.display = 'none';  
            badge.textContent = '';
        } else {
            badge.style.display = 'flex';  
            badge.textContent = unreadCount;
        }
    }
    if (list) {
        if (notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">📭 Нет уведомлений</div>';
        } else {
            list.innerHTML = notifications.map(n => `
                <div class="notification-item ${!n.read ? 'unread' : ''}" data-id="${n.id}">
                    <div class="notification-title">${escapeHtml(n.title)}</div>
                    <div class="notification-message">${escapeHtml(n.message)}</div>
                    <div class="notification-time">${n.time}</div>
                </div>
            `).join('');
            
            document.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = parseInt(item.dataset.id);
                    const notif = notifications.find(n => n.id === id);
                    if (notif && !notif.read) {
                        notif.read = true;
                        saveNotificationsLocal();
                        updateNotificationPanel();
                    }
                });
            });
        }
    }
}

function addNotif(title, message) {
    notifications.unshift({
        id: Date.now(),
        title: title,
        message: message,
        time: new Date().toLocaleTimeString('ru-RU'),
        read: false
    });
    if (notifications.length > 50) notifications.pop();
    saveNotificationsLocal();
    updateNotificationPanel();
}

// Обработчики кнопок уведомлений
const notifBtnTop = document.getElementById('notificationTopBtn');
const dropdownPanel = document.getElementById('notificationDropdown');
const clearBtnPanel = document.getElementById('clearNotificationsBtn');

if (notifBtnTop) {
    notifBtnTop.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdownPanel) dropdownPanel.classList.toggle('show');
    });
}

if (clearBtnPanel) {
    clearBtnPanel.addEventListener('click', () => {
        notifications = [];
        saveNotificationsLocal();
        updateNotificationPanel();

    });
}

document.addEventListener('click', () => {
    if (dropdownPanel) dropdownPanel.classList.remove('show');
});

if (dropdownPanel) dropdownPanel?.addEventListener('click', (e) => e.stopPropagation());

updateNotificationPanel();


// Переключить стиль кнопок
function toggleButtonStyle() {
    currentButtonStyle = currentButtonStyle === 'rounded' ? 'square' : 'rounded';
    localStorage.setItem('buttonStyle', currentButtonStyle);
    applyButtonStyleToAll();
    showNotif(`Стиль кнопок изменён на ${currentButtonStyle === 'rounded' ? 'закруглённый' : 'прямоугольный'}`, false, 'success');
}


// ========== ОБЫЧНЫЕ ПЕРЕМЕННЫЕ (БЕЗ ЗАЩИТЫ) ==========
let currentUser = null;
let isEditor = false;

// ВСЁ! Никаких Object.defineProperty, никаких дополнительных блоков!

const CLOUDFLARE_API = 'https://patient-scene-1261.roman-gonchukov.workers.dev';
const COMMENTS_API_URL = 'https://script.google.com/macros/s/AKfycbzHiRaKjJDCxDV3hMpwgJIXNzgYqhBbrzKXYAeZfSf42LLoyP_IotGxYrvp-iRnT0xIhQ/exec';




const avatarMap = {
    "Gl1tchFrost": "https://shared.fastly.steamstatic.com/community_assets/images/items/2861720/5ae020a665661d3e6499da7fb601f373fa998228.gif",
    "Zoffi" : "https://avatars.akamai.steamstatic.com/b65685aae297d33e2263633211872decb95191b6_full.jpg",
    "Артур П" : "https://avatars.akamai.steamstatic.com/613bc9ebf037ac39219ed8f1240f6d2c8d85518b_full.jpg",
    "Тявкобай" : "https://avatars.akamai.steamstatic.com/61ab70962972708287fbe01bbf30a073e02557fb_full.jpg",
    "ki-p": "https://avatars.akamai.steamstatic.com/7c0568b92eabda5703516fa7e03ba4676d8b03e5_full.jpg",
    "T1Ran": "https://avatars.akamai.steamstatic.com/57dac1d4d44de03338708c08310198b23192ab51_full.jpg",
    "manisule": "https://avatars.akamai.steamstatic.com/3973c828510cfd75f32b6a4d09bffa642f6c975f_full.jpg",
    "Гербикс": "https://avatars.akamai.steamstatic.com/3acd2544afbc953feb4af6da64440fa4bf48618e_full.jpg",
    "Arbuz Madrazo": "https://avatars.akamai.steamstatic.com/60c2b352131f11a8bcbd08f452decd9dfea10a32_full.jpg",
    "somcop": "https://avatars.akamai.steamstatic.com/181420ae4a4f46eabd79c3b6b56e5e5e70aa4b91_full.jpg",
    "Foxy": "https://avatars.akamai.steamstatic.com/e2ae91fee516fc12a05fbfe995f52891db03c63f_full.jpg",
    "Дмитрий Морозов": "https://avatars.akamai.steamstatic.com/5a54395d65879aed3fc59787f1d9eaf21a839ff5_full.jpg",
    "Гофикал": "https://avatars.akamai.steamstatic.com/ed77d818ec20ca4aad3417f5033647f79229c92a_full.jpg",
    "Himas": "https://avatars.akamai.steamstatic.com/40ddf358c9028e084e617b8edecfdc620e5c12c9_full.jpg",
    "yaroslav1432": "https://shared.akamai.steamstatic.com/community_assets/images/items/1313140/4ae9f2b8739631ea806a9508785f0445557e9bff.gif",
    "кусочек шаурмы": "https://avatars.akamai.steamstatic.com/a350434d0216c11358393f13cf8a95bfcf1509db_full.jpg",
    "Гарик Харламовв" : "https://avatars.akamai.steamstatic.com/9dd518738e6c1db81cf5184e3ae43c2ac5150ada_full.jpg",
    "gans7824": "https://avatars.akamai.steamstatic.com/7ccb0ac2e182c765a7ddf35bb64dde75e26ddfc2_full.jpg"
};

function getAvatarUrl(username) {
    return avatarMap[username] || "https://i.imgur.com/IAIJe65.png";
}

// ========== ИМПОРТ ТИКЕТОВ ИЗ CSV ==========
async function importTicketsFromCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            const headers = lines[0].split(',');
            
            // Находим индексы нужных колонок
            const steamIdIndex = headers.findIndex(h => h === 'SteamID');
            const weekAmountIndex = headers.findIndex(h => h === 'WeekAmount');
            const nameIndex = headers.findIndex(h => h === 'Name');
            
            if (steamIdIndex === -1) {
                reject(new Error('Не найдена колонка SteamID в файле'));
                return;
            }
            
            if (weekAmountIndex === -1) {
                reject(new Error('Не найдена колонка WeekAmount в файле'));
                return;
            }
            
            // Парсим данные
            const ticketsData = {};
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',');
                const steamId = values[steamIdIndex]?.trim();
                const weekAmount = parseInt(values[weekAmountIndex]) || 0;
                const name = values[nameIndex]?.trim();
                
                if (steamId && weekAmount > 0) {
                    ticketsData[steamId] = {
                        weekAmount: weekAmount,
                        name: name
                    };
                }
            }
            
            console.log('Найдено записей для обновления:', Object.keys(ticketsData).length);
            resolve(ticketsData);
        };
        
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsText(file, 'UTF-8');
    });
}

// Обновление тикетов через Google Sheets API
async function updateTicketsFromImport(ticketsData) {
    showGlobalLoading();
    
    let successCount = 0;
    let failCount = 0;
    const errors = [];
    
    for (const [steamId, data] of Object.entries(ticketsData)) {
        try {
            // Сначала находим пользователя по Steam ID в команде
            const member = teamData.find(m => m.steamId === steamId);
            
            if (!member) {
                console.log(`Steam ID ${steamId} не найден в команде (${data.name})`);
                failCount++;
                errors.push(`${data.name || steamId}: не найден в команде`);
                continue;
            }
            
            // Обновляем тикеты через существующую функцию
            const result = await saveTicketsToSheet(member.name, data.weekAmount, 25, 1);
            
            if (result.success) {
                successCount++;
                showNotif(`✅ ${member.name}: ${data.weekAmount} тикетов`);
            } else {
                failCount++;
                errors.push(`${member.name}: ошибка сохранения`);
            }
            
            // Небольшая задержка между запросами
            await new Promise(r => setTimeout(r, 500));
            
        } catch (error) {
            console.error(`Ошибка обновления для ${steamId}:`, error);
            failCount++;
            errors.push(`${data.name || steamId}: ${error.message}`);
        }
    }
    
    hideGlobalLoading();
    
    // Показываем результат
    let message = `✅ Импорт завершён!\nУспешно: ${successCount}\nОшибок: ${failCount}`;
    if (errors.length > 0 && errors.length <= 5) {
        message += `\n\nОшибки:\n${errors.join('\n')}`;
    } else if (errors.length > 5) {
        message += `\n\nОшибки: ${errors.length} (первые 5):\n${errors.slice(0, 5).join('\n')}`;
    }
    
    alert(message);
    
    // Обновляем данные
    await refreshTeamData();
    await renderTicketsEditor();
}

// Создание модального окна для загрузки файла
function createImportModal() {
    const modal = document.createElement('div');
    modal.id = 'importTicketsModal';
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header">
                <span>📁 Импорт тикетов из CSV</span>
                <button class="close-modal" id="closeImportModal">
                    <svg class="icon"><use href="#ic-close"/></svg>
                </button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <svg class="icon" style="width: 48px; height: 48px; fill: #c9a0ff;">
                        <use href="#ic-chart"/>
                    </svg>
                </div>
                <p style="margin-bottom: 15px; text-align: center;">
                    Загрузите CSV файл с данными о тикетах.<br>
                    Файл должен содержать колонки: <strong>SteamID</strong> и <strong>WeekAmount</strong>
                </p>
                <div class="form-group">
                    <label>Выберите CSV файл</label>
                    <input type="file" id="ticketsFileInput" accept=".csv" style="padding: 10px;">
                </div>
                <button class="submit-btn" id="processImportBtn" style="margin-top: 10px;">
                    📤 Начать импорт
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие
    document.getElementById('closeImportModal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Обработка файла
    document.getElementById('processImportBtn').addEventListener('click', async () => {
        const fileInput = document.getElementById('ticketsFileInput');
        const file = fileInput.files[0];
        
        if (!file) {
            showNotif('❌ Выберите файл!', true);
            return;
        }
        
        const processBtn = document.getElementById('processImportBtn');
        processBtn.disabled = true;
        processBtn.textContent = '⏳ Обработка...';
        
        try {
            const ticketsData = await importTicketsFromCSV(file);
            await updateTicketsFromImport(ticketsData);
            modal.remove();
        } catch (error) {
            console.error('Ошибка импорта:', error);
            showNotif(`❌ Ошибка: ${error.message}`, true);
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = '📤 Начать импорт';
        }
    });
}

// Показываем кнопку для креаторов
function showImportButton() {
    const importBtn = document.getElementById('importTicketsBtn');
    if (importBtn) {
        importBtn.style.display = isEditor ? 'flex' : 'none';
    }
}

// Добавляем обработчик для кнопки
function initImportButton() {
    const importBtn = document.getElementById('importTicketsBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            if (!isEditor) {
                showNotif('❌ Нет доступа', true);
                return;
            }
            createImportModal();
        });
    }
}

// ========== ФУНКЦИЯ ФОРМАТИРОВАНИЯ ДАТЫ ==========
function formatDate(dateString) {
    if (!dateString) return 'Дата не указана';
    
    // Если дата уже в нормальном формате (ДД.ММ.ГГ)
    if (dateString.match(/^\d{2}\.\d{2}\.\d{2}/)) {
        return dateString;
    }
    
    // Пробуем распарсить ISO формат (2026-02-06T21:00:00.000Z)
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}.${month}.${year}`;
        }
    } catch(e) {
        console.error('Ошибка парсинга даты:', e);
    }
    
    return dateString;
}

function loadComments(eventId) {
    if (commentsCache[eventId]) {
        console.log('Загружено из кеша:', eventId);
        return Promise.resolve(commentsCache[eventId]);
    }
    
    return new Promise((resolve) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            const comments = Array.isArray(data) ? data : [];
            commentsCache[eventId] = comments;
            resolve(comments);
        };
        
        script.src = `${COMMENTS_API_URL}?action=getComments&eventId=${eventId}&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve([]);
        };
        document.body.appendChild(script);
    });
}


function addComment(eventId, userName, text) {
    return new Promise((resolve) => {
        const avatarUrl = getAvatarUrl(userName);
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'addComment',
            eventId: eventId,
            userName: userName,
            avatarUrl: avatarUrl,
            text: text,
            callback: callbackName
        });
        
        script.src = `${COMMENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

function deleteComment(commentId, userName) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'deleteComment',
            commentId: commentId,
            userName: userName,
            callback: callbackName
        });
        
        script.src = `${COMMENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

async function renderCommentsSection(eventId, container) {
    
    const section = document.createElement('div');
    section.className = 'comments-section';
    section.innerHTML = `
        <div class="comments-title">
            <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
            Комментарии (загрузка...)
        </div>
        <div class="comments-list" id="commentsList" style="opacity:0.6; text-align:center; padding:20px;">
            Загрузка комментариев...
        </div>
        ${currentUser ? `
        <div class="comment-form">
            <textarea class="comment-input" id="newCommentText" placeholder="Напишите комментарий..." rows="1"></textarea>
            <button class="comment-send-btn" id="sendCommentBtn">
                <svg class="icon" style="fill:#fff; width:16px; height:16px;"><use href="#ic-send"/></svg>
                Отправить
            </button>
        </div>
        ` : '<div style="color:var(--text-muted); text-align:center;">Войдите, чтобы оставить комментарий</div>'}
    `;
    
    container.appendChild(section);
    const listEl = section.querySelector('#commentsList');
    const template = document.getElementById('commentTemplate');
    
    
    const comments = await loadComments(eventId);
    
    listEl.style.opacity = '1';
    listEl.style.textAlign = 'left';
    listEl.style.padding = '0';
    listEl.innerHTML = '';
    
    if (comments.length === 0) {
        listEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:20px;">Пока нет комментариев</div>';
    } else {
        comments.forEach(c => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.comment-avatar').src = c.avatarUrl;
            clone.querySelector('.comment-author').textContent = c.userName;
            clone.querySelector('.comment-time').textContent = c.timestamp;
            clone.querySelector('.comment-text').textContent = c.text;
            
            const deleteBtn = clone.querySelector('.comment-delete-btn');
            
            if (currentUser && currentUser === c.userName && c.id) {
                deleteBtn.style.display = 'block';
                deleteBtn.dataset.commentId = c.id;
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (!confirm('Удалить комментарий?')) return;
                    
                    deleteBtn.disabled = true;
                    const result = await deleteComment(c.id, currentUser);
                    
                    if (result.success) {
                        showNotif('✅ Комментарий удалён');
                        deleteBtn.closest('.comment-item').remove();
                        
                        const newCount = listEl.children.length;
                        section.querySelector('.comments-title').innerHTML = `
                            <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
                            Комментарии (${newCount})
                        `;
                        
                        delete commentsCache[eventId];
                    } else {
                        showNotif('❌ ' + (result.error || 'Ошибка удаления'), true);
                    }
                    deleteBtn.disabled = false;
                });
            }
            
            listEl.appendChild(clone);
        });
    }
    
    section.querySelector('.comments-title').innerHTML = `
        <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
        Комментарии (${comments.length})
    `;
    
    if (currentUser) {
        const sendBtn = section.querySelector('#sendCommentBtn');
        const textarea = section.querySelector('#newCommentText');
        
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        
        newSendBtn.addEventListener('click', async () => {
            const text = newTextarea.value.trim();
            if (!text) {
                showNotif('Введите текст комментария', true);
                return;
            }
            
            newSendBtn.disabled = true;
            newSendBtn.textContent = 'Отправка...';
            
            const result = await addComment(eventId, currentUser, text);
            
            if (result.success) {
                showNotif('✅ Комментарий добавлен');
                
                const emptyMsg = listEl.querySelector('div[style*="Пока нет комментариев"]');
                if (emptyMsg) {
                    listEl.innerHTML = '';
                }
                
                const clone = template.content.cloneNode(true);
                clone.querySelector('.comment-avatar').src = getAvatarUrl(currentUser);
                clone.querySelector('.comment-author').textContent = currentUser;
                clone.querySelector('.comment-time').textContent = new Date().toLocaleString("ru-RU");
                clone.querySelector('.comment-text').textContent = text;
                
                const deleteBtn = clone.querySelector('.comment-delete-btn');
                deleteBtn.style.display = 'block';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!confirm('Удалить комментарий?')) return;
                    
                    deleteBtn.closest('.comment-item').remove();
                    
                    const newCount = listEl.children.length;
                    section.querySelector('.comments-title').innerHTML = `
                        <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
                        Комментарии (${newCount})
                    `;
                    
                    showNotif('✅ Комментарий удалён');
                });
                
                listEl.appendChild(clone);
                
                const newCount = listEl.children.length;
                section.querySelector('.comments-title').innerHTML = `
                    <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
                    Комментарии (${newCount})
                `;
                
                newTextarea.value = '';
                delete commentsCache[eventId];
                
                setTimeout(async () => {
                    const freshComments = await loadComments(eventId);
                    if (freshComments.length > 0) {
                        listEl.innerHTML = '';
                        freshComments.forEach(c => {
                            const freshClone = template.content.cloneNode(true);
                            freshClone.querySelector('.comment-avatar').src = c.avatarUrl;
                            freshClone.querySelector('.comment-author').textContent = c.userName;
                            freshClone.querySelector('.comment-time').textContent = c.timestamp;
                            freshClone.querySelector('.comment-text').textContent = c.text;
                            
                            const freshDeleteBtn = freshClone.querySelector('.comment-delete-btn');
                            if (currentUser && currentUser === c.userName && c.id) {
                                freshDeleteBtn.style.display = 'block';
                                freshDeleteBtn.addEventListener('click', async (e) => {
                                    e.stopPropagation();
                                    if (!confirm('Удалить комментарий?')) return;
                                    
                                    freshDeleteBtn.disabled = true;
                                    const delResult = await deleteComment(c.id, currentUser);
                                    
                                    if (delResult.success) {
                                        showNotif('✅ Комментарий удалён');
                                        freshDeleteBtn.closest('.comment-item').remove();
                                        
                                        const count = listEl.children.length;
                                        section.querySelector('.comments-title').innerHTML = `
                                            <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
                                            Комментарии (${count})
                                        `;
                                        delete commentsCache[eventId];
                                    } else {
                                        showNotif('❌ Ошибка удаления', true);
                                    }
                                    freshDeleteBtn.disabled = false;
                                });
                            }
                            listEl.appendChild(freshClone);
                        });
                        section.querySelector('.comments-title').innerHTML = `
                            <svg class="icon" style="fill:var(--icon-fill); width:20px; height:20px;"><use href="#ic-chat"/></svg>
                            Комментарии (${freshComments.length})
                        `;
                    }
                }, 1000);
            } else {
                showNotif('❌ Ошибка отправки', true);
            }
            
            newSendBtn.disabled = false;
            newSendBtn.innerHTML = `
                <svg class="icon" style="fill:#fff; width:16px; height:16px;"><use href="#ic-send"/></svg>
                Отправить
            `;
        });
        
        newTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                newSendBtn.click();
            }
        });
    }
}

// ========== ЖУРНАЛ АУДИТА В DISCORD ==========


// ========== ЖУРНАЛ АУДИТА В DISCORD ==========
async function sendAuditLog(action, details, oldData = null, newData = null) {
    const username = currentUser || sessionStorage.getItem('user') || 'Неизвестный';
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    
    let description = '';
    let color = 0x00ff00;
    
    switch(action) {
        case 'ADD_EVENT':
            description = `**➕ Добавлен новый ивент**\n\n`;
            description += `**Название:** ${details.name}\n`;
            description += `**Организатор:** ${details.organizer}\n`;
            description += `**Помощники:** ${details.helpers || 'Нет'}\n`;
            description += `**Дата:** ${details.date}\n`;
            description += `**Призовые:** ${details.rating}\n`;
            description += `**Участников:** ${details.members}\n`;
            description += `**Описание:** ${details.description?.substring(0, 200) || ''}${details.description?.length > 200 ? '...' : ''}`;
            color = 0x00ff00;
            break;
            
        case 'EDIT_EVENT':
            description = `**✏️ Изменён ивент**\n\n`;
            description += `**ID ивента:** ${details.eventId}\n`;
            description += `**Название:** ${details.name}\n\n`;
            description += `**Изменения:**\n`;
            if (oldData && newData) {
                if (oldData.name !== newData.name) description += `• Название: "${oldData.name}" → "${newData.name}"\n`;
                if (oldData.description !== newData.description) description += `• Описание: изменено\n`;
                if (oldData.date !== newData.date) description += `• Дата: "${oldData.date}" → "${newData.date}"\n`;
                if (oldData.rating !== newData.rating) description += `• Призовые: "${oldData.rating}" → "${newData.rating}"\n`;
                if (oldData.members !== newData.members) description += `• Участников: ${oldData.members} → ${newData.members}\n`;
                if (oldData.helpers !== newData.helpers) description += `• Помощники: "${oldData.helpers}" → "${newData.helpers}"\n`;
            }
            color = 0xffaa00;
            break;
            
        case 'DELETE_EVENT':
            description = `**🗑️ Удалён ивент**\n\n`;
            description += `**ID ивента:** ${details.eventId}\n`;
            description += `**Название:** ${details.name}\n`;
            description += `**Организатор:** ${details.organizer}\n`;
            description += `**Дата:** ${details.date}\n`;
            description += `**Призовые:** ${details.rating}`;
            color = 0xff4444;
            break;
            
        case 'CHANGE_STATUS':
            description = `**🔄 Изменён статус ивента**\n\n`;
            description += `**ID ивента:** ${details.eventId}\n`;
            description += `**Название:** ${details.eventName}\n`;
            description += `**Статус:** ${details.oldStatus} → ${details.newStatus}`;
            color = 0x44aaff;
            break;
            
        case 'ADD_MEMBER':
            description = `**👥 Добавлен новый участник команды**\n\n`;
            description += `**Никнейм:** ${details.name}\n`;
            description += `**Роль:** ${details.role}\n`;
            description += `**Ранг:** ${details.rating}\n`;
            description += `**Категория:** ${details.category}`;
            color = 0xaa44ff;
            break;
            
        case 'EDIT_MEMBER':
            description = `**✏️ Изменён участник команды**\n\n`;
            description += `**Никнейм:** ${details.name}\n`;
            description += `**Изменения:** ${details.changes}`;
            color = 0xffaa44;
            break;
            
        case 'DELETE_MEMBER':
            description = `**🗑️ Удалён участник команды**\n\n`;
            description += `**Никнейм:** ${details.name}\n`;
            description += `**Роль:** ${details.role}`;
            color = 0xff6666;
            break;
            
        case 'LOGIN':
            description = `**🔓 Вход в систему**\n\n`;
            description += `Пользователь **${username}** вошёл в панель управления`;
            color = 0x44ff44;
            break;
            
        case 'LOGOUT':
            description = `**🔒 Выход из системы**\n\n`;
            description += `Пользователь **${username}** вышел из панели управления`;
            color = 0xffaa44;
            break;
    }
    
    const embed = {
        title: `📋 Журнал аудита`,
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
        footer: {
            text: `Действие: ${username} • ${timestamp}`
        },
        fields: [
            {
                name: "👤 Кто выполнил",
                value: username,
                inline: true
            },
            {
                name: "🕐 Время",
                value: timestamp,
                inline: true
            },
            {
                name: "📝 Тип действия",
                value: action.replace(/_/g, ' '),
                inline: true
            }
        ]
    };
    
    try {
        const response = await fetch(`${CLOUDFLARE_API}/api/audit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Key': 'unionteam_audit_secret_2025_7x9k2m4n' // Тот же ключ, что в Worker
            },
            body: JSON.stringify({
                username: 'Журнал аудита | Ивент-отдел',
                avatar_url: 'https://i.ibb.co/nNbX53Lx/i-7.webp',
                embeds: [embed]
            })
        });
        
        if (!response.ok) {
            console.error('Ошибка отправки аудит-лога:', response.status);
        }
    } catch (error) {
        console.error('Ошибка отправки в Discord Webhook:', error);
    }
}



const commentsCache = {};

const EVENTS_API_URL = COMMENTS_API_URL;

function addEventToSheet(eventData) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'addEvent',
            name: eventData.name,
            organizer: eventData.organizer,
            helpers: eventData.helpers,
            date: eventData.date,
            status: eventData.status || 'Проведен',
            rating: eventData.rating,
            members: eventData.members,
            description: eventData.description,
            eventType: eventData.eventType || 'Малый',
            video: eventData.video || '',
            weekCount: eventData.weekCount || '1',
            callback: callbackName
        });
        
        script.src = `${EVENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

function loadEventsFromSheet() {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_events_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('📊 Ивенты из таблицы:', data);
            
            if (Array.isArray(data)) {
                // Убираем callStatus из данных, чтобы не перезаписывать
                const cleanData = data.map(e => ({
                    id: e.id,
                    name: e.name,
                    organizer: e.organizer,
                    helpers: e.helpers,
                    date: e.date,
                    status: e.status,
                    rating: e.rating,
                    members: e.members,
                    description: e.description
                    // callStatus НЕ возвращаем!
                }));
                resolve(cleanData);
            } else {
                resolve([]);
            }
        };
        
        script.src = `${COMMENTS_API_URL}?action=getEvents&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.error('❌ Ошибка загрузки ивентов');
            resolve([]);
        };
        
        setTimeout(() => {
            if (window[callbackName]) {
                console.warn('⚠️ Таймаут загрузки ивентов');
                delete window[callbackName];
                resolve([]);
            }
        }, 10000);
        
        document.body.appendChild(script);
    });
}

async function refreshEventsData() {
    const events = await loadEventsFromSheet();
    console.log('📊 Загружено ивентов из таблицы:', events);
    
    if (events && events.length > 0) {
        // СОХРАНЯЕМ ТЕКУЩИЕ СТАТУСЫ
        const currentStatuses = {};
        eventsData.forEach(e => {
            currentStatuses[e.id] = e.callStatus;
        });
        
        eventsData = events.map(e => ({
            id: e.id,
            name: e.name || 'Без названия',
            organizer: e.organizer || 'Неизвестно',
            helpers: e.helpers || 'Нет',
            date: e.date || 'Дата не указана',
            status: e.status || 'Проведен',
            rating: e.rating || '0$',
            members: parseInt(e.members) || 0,
            callStatus: currentStatuses[e.id] || '🟡Скоро',
            fullDetails: { description: e.description || '' }
        }));
        
        // 👇👇👇 ВАЖНО: ОБНОВЛЯЕМ СТАТУСЫ ПОСЛЕ ЗАГРУЗКИ ИВЕНТОВ
        await refreshStatusesFromSheet();  // Загружаем статусы из таблицы
        await loadAndApplyStatuses();       // Применяем их к ивентам
        
        saveAllData();
        renderEventsTable();
        
        const activeTab = document.querySelector('.nav-item.active')?.dataset.tab;
        if (activeTab === 'event_guidee') {
            document.querySelector('[data-tab="event_guidee"]')?.click();
        }
        
        showNotif('📊 Ивенты и статусы обновлены');
    } else {
        eventsData = [];
        renderEventsTable();
    }
}

// Удаление ивента
function deleteEventFromSheet(eventId) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_delete_event_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'deleteEvent',
            eventId: eventId,
            callback: callbackName
        });
        
        script.src = `${EVENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false });
        };
        document.body.appendChild(script);
    });
}

// Обновление ивента
function updateEventInSheet(eventData) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_update_event_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'updateEvent',
            eventId: eventData.id,
            name: eventData.name,
            description: eventData.description,
            date: eventData.date,
            rating: eventData.rating,
            members: eventData.members,
            helpers: eventData.helpers,
            callback: callbackName
        });
        
        script.src = `${EVENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false });
        };
        document.body.appendChild(script);
    });
}   

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С КОМАНДОЙ ==========

// Загрузка команды из Google Sheets
function loadTeamFromSheet() {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_team_load_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('Загруженные данные команды:', data);
            resolve(data || []);
        };
        
        script.src = `${COMMENTS_API_URL}?action=getTeam&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve([]);
        };
        document.body.appendChild(script);
    });
}

// ========== ДОБАВЛЕНИЕ УЧАСТНИКА ==========
async function addMemberToSheet(memberData) {
    console.log('🔵 addMemberToSheet вызвана с данными:', memberData);
    
    return new Promise((resolve) => {
        const callbackName = 'jsonp_add_member_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            console.log('🟢 Ответ от сервера:', data);
            delete window[callbackName];
            if (script.parentNode) document.body.removeChild(script);
            resolve(data || { success: true });
        };
        
        // Форматируем дату
        let formattedJoinDate = memberData.joinDate;
        if (formattedJoinDate && formattedJoinDate.includes('.')) {
            const parts = formattedJoinDate.split('.');
            if (parts.length === 3) {
                if (parts[2].length === 2) {
                    formattedJoinDate = `20${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
                } else {
                    formattedJoinDate = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
                }
            }
        }
        
        const params = new URLSearchParams({
            action: 'addMember',
            name: memberData.name,
            role: memberData.role,
            discord: memberData.discord,
            steamId: memberData.steamId || '',
            avatar: memberData.avatar || '',
            status: memberData.status || 'Онлайн',
            joinDate: formattedJoinDate,
            rating: memberData.rating || '3',
            category: memberData.category || 'Младший состав',
            callback: callbackName
        });
        
        const url = `${COMMENTS_API_URL}?${params.toString()}`;
        console.log('📤 Отправка запроса:', url);
        
        script.src = url;
        script.onerror = (e) => {
            console.error('🔴 Ошибка загрузки скрипта:', e);
            delete window[callbackName];
            if (script.parentNode) document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        
        // Таймаут 15 секунд
        setTimeout(() => {
            if (window[callbackName]) {
                console.error('🔴 Таймаут запроса');
                delete window[callbackName];
                if (script.parentNode) document.body.removeChild(script);
                resolve({ success: false, error: 'Timeout' });
            }
        }, 15000);
        
        document.body.appendChild(script);
    });
}
async function refreshTeamData() {
    showGlobalLoading();
    
    try {
        const members = await loadTeamFromSheet();
        console.log('📥 Загружено из Google Sheets:', members);
        
        if (members && members.length > 0) {
            teamData = members.map((m, index) => ({
                id: index + 1,
                name: m.name,
                role: m.role,
                discord: m.discord,
                steamId: m.steamId || '',
                status: m.status || 'Онлайн',
                eventsCount: '-',
                joinDate: m.joinDate,
                rating: m.rating || 'Нет ранга',
                category: m.category || 'Младший состав'
            }));
            
            console.log('✅ Команда обновлена, участников:', teamData.length);
            
            // ОБНОВЛЯЕМ ТАБЛИЦУ ИВЕНТОВ И СТАТИСТИКУ
            await refreshEventsData();  // ← ВАЖНО! Обновляем ивенты
            renderTeamTable();          // Перерисовываем команду
            renderEventsTable();        // Перерисовываем ивенты (обновит статистику)
            
            // Обновляем статистику пользователя в настройках
            if (typeof updateStatsDisplay === 'function') {
                updateStatsDisplay();
            }
        } else {
            console.log('⚠️ Нет данных из Google Sheets');
        }
    } catch(e) {
        console.error('❌ Ошибка загрузки:', e);
    }
    
    hideGlobalLoading();
}

// Сохранение команды в localStorage




// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ТИКЕТАМИ ==========

const TICKETS_API_URL = 'https://script.google.com/macros/s/AKfycbw9rkaeH7klWbWXgD26uIVLxRQt1dbWJ41mPtOikEyWjnL4hqSscMT4vL8kMNJoSvLBVw/exec';

// Загрузка тикетов из Google Sheets
function loadTicketsFromSheet() {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_tickets_load_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('Загруженные тикеты:', data);
            // data приходит в формате { "имя": { done: X, goal: Y, eventsGoal: Z } }
            resolve(data || {});
        };
        
        script.src = `${COMMENTS_API_URL}?action=getTickets&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({});
        };
        document.body.appendChild(script);
    });
}

// Сохранение тикетов в Google Sheets
function saveTicketsToSheet(name, ticketsDone, ticketsGoal, eventsGoal) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_tickets_save_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('Ответ сервера:', data);
            resolve(data || { success: true });
        };
        
        const params = new URLSearchParams({
            action: 'updateTickets',
            userName: name,
            ticketsDone: ticketsDone.toString(),
            ticketsGoal: ticketsGoal.toString(),
            eventsGoal: eventsGoal.toString(),
            updatedBy: currentUser || 'Система',
            callback: callbackName
        });
        
        script.src = `${COMMENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

async function renderTicketsEditor() {
    console.log('renderTicketsEditor вызвана!');
    if (!isEditor) {
        showNotif('❌ Нет доступа', true);
        return;
    }
    
    const existingModal = document.getElementById('ticketsEditorModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'ticketsEditorModal';
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-card" style="max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <span>📊 Управление нормой (только сотрудники с нормой)</span>
                <button class="close-modal" id="closeTicketsEditorBtn">
                    <svg class="icon"><use href="#ic-close"/></svg>
                </button>
            </div>
            <div class="modal-body" id="ticketsEditorBody">
                <div style="text-align: center; padding: 20px;">Загрузка...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeTicketsEditorBtn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    showGlobalLoading();
    
    let ticketsData;
    try {
        ticketsData = await loadTicketsFromSheet();
        console.log('Загружены тикеты:', ticketsData);
    } catch (error) {
        console.error('Ошибка загрузки тикетов:', error);
        ticketsData = {};
    }
    
    // 👇 ВАЖНО: берем ВСЕХ, у кого есть норма (НЕ младший состав)
    // То есть: Старший состав + другие категории (кроме младшего)
    const membersWithNorm = teamData.filter(m => m.category === "Младший состав");
    
    if (membersWithNorm.length === 0) {
        document.getElementById('ticketsEditorBody').innerHTML = '<div style="text-align:center; padding:20px;">Нет сотрудников с нормой</div>';
        hideGlobalLoading();
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    html += '<p style="color: #ffaa44; margin-bottom: 5px;">⚙️ Редактирование нормы для сотрудников (не младший состав)</p>';
    
    for (const member of membersWithNorm) {
        const current = ticketsData[member.name] || { done: 0, goal: 25, eventsGoal: 2 };
        html += `
            <div style="background: var(--badge-bg); border-radius: 20px; padding: 12px; border: 1px solid var(--card-border);">
                <div style="font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <span>${escapeHtml(member.name)}</span>
                    <span style="font-size: 0.7rem; color: #888;">👑 ${escapeHtml(member.category)}</span>
                    <span style="font-size: 0.7rem; color: #888;">Discord: ${member.discord || 'не указан'}</span>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 100px;">
                        <label style="font-size: 0.7rem;">✅ Выполнено тикетов</label>
                        <input type="number" id="tickets_done_${member.name.replace(/\s/g, '_')}" value="${current.done}" class="tickets-input" style="width: 100%; padding: 6px; border-radius: 12px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);">
                    </div>
                    <div style="flex: 1; min-width: 100px;">
                        <label style="font-size: 0.7rem;">🎯 Нужно тикетов</label>
                        <input type="number" id="tickets_goal_${member.name.replace(/\s/g, '_')}" value="${current.goal}" class="tickets-input" style="width: 100%; padding: 6px; border-radius: 12px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);">
                    </div>
                    <div style="flex: 1; min-width: 100px;">
                        <label style="font-size: 0.7rem;">🏆 Нужно ивентов</label>
                        <input type="number" id="events_goal_${member.name.replace(/\s/g, '_')}" value="${current.eventsGoal || 2}" class="events-input" style="width: 100%; padding: 6px; border-radius: 12px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);">
                    </div>
                    <button class="save-tickets-btn" data-name="${member.name}" style="background: linear-gradient(95deg, rgba(85,85,85,0.5), rgba(51,51,51,0.5)); border: none; border-radius: 40px; padding: 8px 16px; color: white; cursor: pointer;">💾 Сохранить</button>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    document.getElementById('ticketsEditorBody').innerHTML = html;
    hideGlobalLoading();
    
    document.querySelectorAll('.save-tickets-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const name = btn.dataset.name;
            const nameId = name.replace(/\s/g, '_');
            const doneInput = document.getElementById(`tickets_done_${nameId}`);
            const goalInput = document.getElementById(`tickets_goal_${nameId}`);
            const eventsInput = document.getElementById(`events_goal_${nameId}`);
            
            const done = parseInt(doneInput.value);
            const goal = parseInt(goalInput.value);
            const eventsGoal = parseInt(eventsInput.value);
            
            if (isNaN(done) || isNaN(goal) || isNaN(eventsGoal)) {
                showNotif('❌ Введите корректные числа', true);
                return;
            }
            
            btn.disabled = true;
            btn.textContent = '⏳ Сохранение...';
            
            const result = await saveTicketsToSheet(name, done, goal, eventsGoal);
            
            if (result.success) {
                showNotif(`✅ Данные для ${name} сохранены!`);
            } else {
                showNotif(`❌ Ошибка сохранения: ${result.error || 'неизвестная ошибка'}`, true);
            }
            
            btn.disabled = false;
            btn.textContent = '💾 Сохранить';
        });
    });
}

function countEventsByPlatform() {
    const counts = {};
    
    // Создаём карту соответствия имён (на случай если имена в ивентах и команде отличаются)
    const teamNames = teamData.map(m => m.name);
    
    for (let event of eventsData) {
        let organizer = event.organizer;
        
        // Пропускаем пустые/дефисные значения
        if (!organizer || organizer === "-" || organizer === "Нет" || organizer === "Неизвестно") {
            continue;
        }
        
        // Ищем точное совпадение с именем из команды
        const exactMatch = teamNames.find(name => name === organizer);
        if (exactMatch) {
            counts[organizer] = (counts[organizer] || 0) + 1;
        } else {
            // Если точного совпадения нет, пробуем частичное (убираем пробелы и приводим к нижнему регистру)
            const normalizedOrganizer = organizer.toLowerCase().trim();
            const found = teamNames.find(name => name.toLowerCase().trim() === normalizedOrganizer);
            if (found) {
                counts[found] = (counts[found] || 0) + 1;
            }
        }
    }
    
    console.log('📊 Подсчёт ивентов по организаторам:', counts);
    return counts;
}
function calculateTotalPrizes() {
    let total = 0;
    for (let event of eventsData) {
        let ratingStr = String(event.rating);
        let cleanStr = ratingStr.replace('$', '').replace(/\./g, '');
        let match = cleanStr.match(/(\d+(?:[.,]\d+)?)/);
        if (match) {
            let num = parseFloat(match[1].replace(',', '.'));
            if (!isNaN(num)) total += num;
        }
    }
    return total;
}


function updateNormStats() {
    const totalPrizes = calculateTotalPrizes();
    const normContainer = document.getElementById('normStatsContainer');
    if (normContainer) {
        const prizeCard = normContainer.querySelector('.stat-card:last-child .stat-value');
        if (prizeCard) {
            prizeCard.innerHTML = totalPrizes.toLocaleString('ru-RU') + '$';
            prizeCard.style.color = '#5fe147';
        }
    }
}

function saveAllData() {
    const statusMap = {};
    for (let event of eventsData) {
        statusMap[event.id] = event.callStatus;
    }
    localStorage.setItem('unionEventsStatuses', JSON.stringify(statusMap));
    const prizesMap = {};
    for (let event of eventsData) {
        prizesMap[event.id] = event.rating;
    }
    localStorage.setItem('unionEventsPrizes', JSON.stringify(prizesMap));
}

function loadAllData() {
    const savedStatuses = localStorage.getItem('unionEventsStatuses');
    if (savedStatuses) {
        try {
            const statusMap = JSON.parse(savedStatuses);
            for (let event of eventsData) {
                if (statusMap[event.id]) event.callStatus = statusMap[event.id];
            }
        } catch(e) {}
    }
}

let cachedConfig = null;

const VALID_LOGINS = [
    "кусочек шаурмы", "Foxy", "somcop", "T1Ran", "manisule",
    "Гербикс", "Arbuz madrazo", "Дмитрий Морозов", "Гофикал", "Himas", "yaroslav1432", "gans7824"
];


// Глобальные уведомления (все уведомления идут сюда)
function showNotif(msg, isErr = false, type = 'info') {
    const panel = document.getElementById('globalNotificationPanel');
    if (!panel) return;
    
    const notification = document.createElement('div');
    notification.className = `notification-global ${isErr ? 'error' : type}`;
    
    let title = '';
    if (isErr) title = '❌ Ошибка';
    else if (type === 'success') title = '✅ Успех';
    else if (type === 'warning') title = '⚠️ Внимание';
    else title = 'ℹ️ Информация';
    
    notification.innerHTML = `
        <div class="notification-global-title">${title}</div>
        <div class="notification-global-message">${msg}</div>
        <div class="notification-global-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    panel.appendChild(notification);
    
    // Автоматическое удаление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    // Клик для закрытия
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
}

(function() {
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    
    if (!cursor || !cursorDot) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    const clickables = document.querySelectorAll('a, button, .clickable-row, .clickable-card, .nav-item, .status-change-btn, .comment-send-btn, .continue-btn, .login-btn, .submit-btn, .close-modal, .settings-save, .logout-btn');
    
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    document.body.style.cursor = 'none';
})();

function showGlobalLoading() {
    const overlay = document.getElementById('globalLoadingOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideGlobalLoading() {
    const overlay = document.getElementById('globalLoadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function escapeHtml(s) { 
    if(!s) return ''; 
    return s.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); 
}



function changeEventStatus(eventId, newStatus) {
    if (!isEditor) {
        showNotif('❌ Нет прав для изменения статуса', true);
        return false;
    }
    
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
        showNotif('❌ Ивент не найден', true);
        return false;
    }
    
    // Сохраняем старый статус
    const oldStatus = event.callStatus;
    
    // Обновляем локально
    event.callStatus = newStatus;
    renderEventsTable();
    showNotif(`🔄 Статус изменён на "${newStatus}", синхронизация...`);
    
    // ========== ДОБАВЬ ЛОГИРОВАНИЕ СТАТУСА ==========
    sendAuditLog('CHANGE_STATUS', {
        eventId: eventId,
        eventName: event.name,
        oldStatus: oldStatus,
        newStatus: newStatus
    }).catch(err => console.error('Ошибка отправки лога статуса:', err));
    // =================================================
    
    // Отправляем в Google Sheets
    syncStatusToSheet(eventId, newStatus, currentUser).then(result => {
        if (result.success) {
            showNotif(`✅ Статус успешно изменён на "${newStatus}"`);
            refreshEventsData();
        } else {
            event.callStatus = oldStatus;
            renderEventsTable();
            showNotif(`❌ Ошибка синхронизации статуса`, true);
        }
    });
    
    return true;
}

function renderEventsTable() {
    const container = document.getElementById('eventDynamicContent');
    const showActions = currentUser !== null;
    
    container.innerHTML = `
        <div class="page-header"><h2>📅 Таблица мероприятий</h2></div>
        <div class="click-hint">🔽 ${showActions ? 'Вы можете редактировать и удалять СВОИ ивенты' : '🔽 Режим просмотра'}</div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>ИВЕНТ</th><th>ОРГАНИЗАТОР</th><th>ПОМОЩНИКИ</th><th>ДАТА</th><th>СТАТУС</th><th>ПРИЗОВЫЕ</th><th>УЧАСТНИКИ</th><th>ОДОБРЕН</th>${showActions ? '<th>ДЕЙСТВИЯ</th>' : ''}</tr></thead>
                <tbody id="eventsTableBody"></tbody>
             </table>
        </div>
    `;
    
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '';
    
    eventsData.forEach(event => {
        const row = tbody.insertRow();
        row.classList.add('clickable-row');
        row.setAttribute('data-type', 'event');
        row.setAttribute('data-id', event.id);
        row.insertCell(0).innerHTML = `<strong>${escapeHtml(event.name)}</strong>`;
        row.insertCell(1).textContent = event.organizer;
        row.insertCell(2).textContent = event.helpers;
        row.insertCell(3).textContent = event.date;
        row.insertCell(4).innerHTML = `<span class="status-badge status-active">${event.status}</span>`;
        row.insertCell(5).innerHTML = `<span class="rating-star">${event.rating}</span>`;
        row.insertCell(6).innerHTML = `<span style="font-weight:600;">${event.members}</span>`;
        row.insertCell(7).innerHTML = `<span style="background:var(--badge-bg); padding:0.2rem 0.6rem; border-radius:20px;">${event.callStatus}</span>`;
        
        if (showActions) {
            const cell = row.insertCell(8);
            // ИСПРАВЛЕНО: сравниваем с event.organizer
            const canModify = isEditor || (currentUser && currentUser === event.organizer);
            
            // Кнопки статусов - ТОЛЬКО для редактора (isEditor)
            const statusButtons = isEditor ? `
                <button class="status-change-btn btn-approved" data-id="${event.id}" data-status="✅Одобрен">✅ Одобрен</button>
                <button class="status-change-btn btn-soon" data-id="${event.id}" data-status="🟡Скоро">🟡 Скоро</button>
                <button class="status-change-btn btn-completed" data-id="${event.id}" data-status="🔴Отказано">🔴 Отказано</button>
            ` : '';
            
            // Кнопки редактирования/удаления - для создателя ИЛИ организатора ивента
            const editButtons = canModify ? `
                <button class="edit-event-btn" data-id="${event.id}" style="margin-top:5px;">Редактировать</button>
                <button class="delete-event-btn" data-id="${event.id}" style="margin-top:5px;">Удалить</button>                           
            ` : '';
            
            cell.innerHTML = statusButtons + editButtons;
            
            // ПРЯМЫЕ ОБРАБОТЧИКИ на кнопки (чтобы не было всплытия)
            if (canModify) {
                const editBtn = cell.querySelector('.edit-event-btn');
                const deleteBtn = cell.querySelector('.delete-event-btn');
                
                if (editBtn) {
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('Редактирование ивента:', event.id);
                        openEditEventModal(event.id);
                    });
                }
                
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('Удаление ивента:', event.id);
                        if (confirm('🗑️ Удалить ивент навсегда? Это действие нельзя отменить!')) {
                            deleteEventHandler(event.id);
                        }
                    });
                }
            }
            
            if (isEditor) {
                const statusBtns = cell.querySelectorAll('.status-change-btn');
                statusBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const eventId = parseInt(btn.dataset.id);
                        const newStatus = btn.dataset.status;
                        changeEventStatus(eventId, newStatus);
                    });
                });
            }
        }
    });
    
    attachRowClicks();
}

function renderTeamTable() {
    const container = document.getElementById('eventDynamicContent');
    const eventCounts = countEventsByPlatform();
    const seniorMembers = teamData.filter(m => m.category === "Старший состав");
    const juniorMembers = teamData.filter(m => m.category === "Младший состав");
    
    function renderMemberCard(m, type) {
        let eventsCount = eventCounts[m.name] || 0;
        if (m.eventsCount !== "-" && m.eventsCount !== "Нет нормы" && m.eventsCount !== "Отпуск" && !isNaN(parseInt(m.eventsCount))) {
            eventsCount = m.eventsCount;
        } else if (m.eventsCount === "Нет нормы" || m.eventsCount === "Отпуск") {
            eventsCount = m.eventsCount;
        }
        
        const cardClass = type === 'senior' ? 'senior' : 'junior';
        
        // ПРОСТО ПОКАЗЫВАЕМ РАНГ КАК ТЕКСТ ИЗ ТАБЛИЦЫ
        const rankText = m.rating || 'Нет ранга';
        
        const statusHtml = m.status === "Онлайн" ? '<span class="team-status online">🟢 Онлайн</span>' : '<span class="team-status offline">🔴 ' + m.status + '</span>';
        
        const avatarUrl = avatarMap[m.name] || "https://i.imgur.com/IAIJe65.png";
        const formattedJoinDate = formatDate(m.joinDate);
        
        const editButton = isEditor ? `
            <button class="edit-member-btn" data-id="${m.id}" style="position: absolute; top: 10px; right: 10px; background: rgba(76, 175, 80, 0.3); border: none; border-radius: 20px; padding: 4px 8px; color: #4caf50; cursor: pointer; font-size: 11px; z-index: 10; transition: all 0.2s;">
                ✏️
            </button>
        ` : '';
        
        return `
            <div class="team-card ${cardClass} clickable-card" data-type="team" data-id="${m.id}" style="position: relative;">
                ${editButton}
                <div class="team-card-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${avatarUrl}" class="team-avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,215,0,0.5);">
                        <div>
                            <div class="team-name">${escapeHtml(m.name)}</div>
                            <div class="team-role">${escapeHtml(m.role)}</div>
                        </div>
                    </div>
                    ${statusHtml}
                </div>
                <div class="team-card-body">
                    <div class="team-info-item">
                        <div class="team-info-label">DISCORD</div>
                        <div class="team-info-value">${m.discord}</div>
                    </div>
                    <div class="team-info-item">
                        <div class="team-info-label">STEAM ID</div>
                        <div class="team-info-value">${m.steamId || 'Не указан'}</div>
                    </div>
                    <div class="team-info-item">
                        <div class="team-info-label">ИВЕНТОВ</div>
                        <div class="team-info-value">${eventsCount}</div>
                    </div>
                    <div class="team-info-item">
                        <div class="team-info-label">ВСТУПИЛ</div>
                        <div class="team-info-value">${formattedJoinDate}</div>
                    </div>
                </div>
                <div class="team-card-footer">
    <span class="team-badge ${type === 'senior' ? 'senior-badge' : 'junior-badge'}">
        ${type === 'senior' ? '👑' : '🌟'} ${type === 'senior' ? 'Старший' : 'Младший'} состав
    </span>
    <!-- УБИРАЕМ team-rating ПОЛНОСТЬЮ -->
</div>
            </div>
        `;
    }
    
    let seniorHtml = '', juniorHtml = '';
    seniorMembers.forEach(m => { seniorHtml += renderMemberCard(m, 'senior'); });
    juniorMembers.forEach(m => { juniorHtml += renderMemberCard(m, 'junior'); });
    
    container.innerHTML = `
        <div class="page-header">
            <h2>👥 Команда ивент-отдела</h2>
            ${isEditor ? `
            <button id="manageTeamFromTableBtn" class="add-btn" style="background: linear-gradient(95deg, rgba(85,85,85,0.5), rgba(51,51,51,0.5));">
                <svg class="icon" style="fill:#fff; width:16px; height:16px;"><use href="#ic-plus"/></svg>
                Управление командой
            </button>
            ` : ''}
        </div>
        
        <div class="team-section">
            <div class="section-header senior">
                <span class="section-icon">👑</span>
                <span class="section-title senior">Старший состав</span>
                <span class="section-count">${seniorMembers.length} чел</span>
            </div>
            <div class="team-grid">
                ${seniorHtml || '<div style="text-align:center; padding:2rem;">Нет участников</div>'}
            </div>
        </div>
        
        <div class="team-section">
            <div class="section-header junior">
                <span class="section-icon">🌟</span>
                <span class="section-title junior">Младший состав</span>
                <span class="section-count">${juniorMembers.length} чел</span>
            </div>
            <div class="team-grid">
                ${juniorHtml || '<div style="text-align:center; padding:2rem;">Нет участников</div>'}
            </div>
        </div>
    `;

    // Добавляем обработчик для кнопки управления командой
    const manageBtn = document.getElementById('manageTeamFromTableBtn');
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (addTeamMemberModal) {
                document.getElementById('teamMemberName').value = '';
                document.getElementById('teamMemberRole').value = '';
                document.getElementById('teamMemberDiscord').value = '';
                document.getElementById('teamMemberAvatar').value = '';
                document.getElementById('teamMemberJoinDate').value = '';
                document.getElementById('teamMemberRating').value = '';
                document.getElementById('teamMemberCategory').value = 'Младший состав';
                document.getElementById('teamMemberStatus').value = 'Онлайн';
                addTeamMemberModal.style.display = 'flex';
            }
        });
    }
    
    // Добавляем обработчики для кнопок редактирования участников
    document.querySelectorAll('.edit-member-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const memberId = parseInt(btn.dataset.id);
            if (typeof openEditMemberModal === 'function') {
                openEditMemberModal(memberId);
            }
        });
    });
    
    // Добавляем обработчики кликов по карточкам
    document.querySelectorAll('.clickable-card').forEach(card => {
        const oldHandler = card._clickHandler;
        if (oldHandler) card.removeEventListener('click', oldHandler);
        
        const handler = () => {
            const id = parseInt(card.dataset.id);
            const member = teamData.find(m => m.id === id);
            if (member) openTeamModal(member);
        };
        card._clickHandler = handler;
        card.addEventListener('click', handler);
    });
}

function showNotif(msg, isErr = false, type = 'info') {
    const panel = document.getElementById('notificationPanelTop');
    if (!panel) return;
    
    const toast = document.createElement('div');
    toast.className = `notification-toast ${isErr ? 'error' : type}`;
    
    let title = '';
    if (isErr) title = '❌ Ошибка';
    else if (type === 'success') title = '✅ Успех';
    else if (type === 'warning') title = '⚠️ Внимание';
    else title = 'ℹ️ Информация';
    
    toast.innerHTML = `
        <div class="notification-toast-title">${title}</div>
        <div class="notification-toast-message">${msg}</div>
    `;
    
    panel.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
}



function attachRowClicks() {
    document.querySelectorAll('.clickable-row').forEach(row => {
        row.removeEventListener('click', row._h);
        const h = () => {
            const type = row.dataset.type;
            const id = parseInt(row.dataset.id);
            if (type === 'event') {
                const ev = eventsData.find(e => e.id === id);
                if (ev) openEventModal(ev);
            } else if (type === 'team') {
                const m = teamData.find(t => t.id === id);
                if (m) openTeamModal(m);
            }
        };
        row.addEventListener('click', h);
        row._h = h;
    });
}

function openEventModal(ev) {
    document.getElementById('modalTitle').innerHTML = `
        <svg class="icon icon-accent" style="flex-shrink:0;"><use href="#ic-detail"/></svg>
        Детали ивента
    `;
    
    const formattedDate = formatDate(ev.date);  // 👈 ФОРМАТИРУЕМ
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row"><span class="detail-label">Название:</span><span>${escapeHtml(ev.name)}</span></div>
        <div class="detail-row"><span class="detail-label">Организатор:</span><span>${ev.platform}</span></div>
        <div class="detail-row"><span class="detail-label">Дата:</span><span>${formattedDate}</span></div>  <!-- 👈 ЗДЕСЬ -->
        <div class="detail-row"><span class="detail-label">Категория:</span><span>${ev.callStatus}</span></div>
        <div style="margin-top:12px; background:var(--card-bg); padding:12px; border-radius:24px;">
            <b>Описание:</b><br>${ev.fullDetails.description}
        </div>
        <div id="commentsContainer"></div>
    `;
    
    const commentsContainer = document.getElementById('commentsContainer');
    renderCommentsSection(ev.id, commentsContainer);
    
    document.getElementById('infoModal').style.display = 'flex';
}   

function openTeamModal(m) {
    document.getElementById('modalTitle').innerHTML = '👤 Информация о сотруднике';
    document.getElementById('modalBody').innerHTML = `
        <div class="detail-row"><span class="detail-label">Имя:</span><span><strong>${escapeHtml(m.name)}</strong></span></div>
        <div class="detail-row"><span class="detail-label">Роль:</span><span>${m.role}</span></div>
        <div class="detail-row"><span class="detail-label">Discord ID:</span><span>${m.discord}</span></div>
        <div class="detail-row"><span class="detail-label">Steam ID:</span><span>${m.steamId || 'Не указан'}</span></div>
        <div class="detail-row"><span class="detail-label">Статус:</span><span>${m.status}</span></div>
        <div class="detail-row"><span class="detail-label">В отделе с:</span><span>${formatDate(m.joinDate)}</span></div>
        <div class="detail-row"><span class="detail-label">Категория:</span><span>${m.category === 'Старший состав' ? '👑 Старший состав' : '🌟 Младший состав'}</span></div>
        <div class="detail-row"><span class="detail-label">Обязанности:</span><span>${m.fullDetails?.responsibilities || 'Не указаны'}</span></div>
    `;
    document.getElementById('infoModal').style.display = 'flex';
}

function updateClock() { 
    const el = document.getElementById('liveClockEvent'); 
    if(el) el.innerText = new Date().toLocaleTimeString('ru-RU'); 
}
setInterval(updateClock, 1000); 
updateClock();
    
document.body.classList.add('dark');

// НАВИГАЦИЯ
const navs = document.querySelectorAll('.nav-item');
navs.forEach(n => {
    n.addEventListener('click', () => {
        navs.forEach(i => i.classList.remove('active'));
        n.classList.add('active');
        const tab = n.dataset.tab;
        if (tab === 'events_table') renderEventsTable();
        else if (tab === 'team_table') renderTeamTable();
        else if (tab === 'add_event') renderAddEventForm();
        else if (tab === 'event_adons') renderAddonsPage();
        else if (tab === 'event_guidee') {
    showGlobalLoading();
    
    (async () => {
        // Загружаем тикеты из Google Sheets
        const ticketsFromSheet = await loadTicketsFromSheet();
        console.log('Данные из таблицы Тикеты:', ticketsFromSheet);
        
        const totalPrizes = calculateTotalPrizes();
        const eventsCount = eventsData.length;
        
        // 👇 ИСПРАВЛЕНО: ТОЛЬКО МЛАДШИЙ СОСТАВ
        const membersWithNorm = teamData.filter(m => m.category === "Младший состав");
        const teamMembersCount = membersWithNorm.length;
        const onlineCount = membersWithNorm.filter(m => m.status === "Онлайн").length;
        
        // ПРАВИЛЬНО
        const eventCounts = {};
        eventsData.forEach(event => {
            const organizer = event.organizer;  // ✅ используем organizer
            if (organizer && organizer !== "Нет" && organizer !== "") {
                eventCounts[organizer] = (eventCounts[organizer] || 0) + 1;
            }
        }); 
        
        // Формируем данные
        const membersStats = [];
        
        for (const member of membersWithNorm) {
            const memberName = member.name;
            const ticketsData = ticketsFromSheet[memberName] || { done: 0, goal: 25, eventsGoal: 1 };
            
            membersStats.push({
                name: memberName,
                discordId: member.discord || '',
                eventsDone: eventCounts[memberName] || 0,
                eventsGoal: ticketsData.eventsGoal || 2,
                ticketsDone: ticketsData.done || 0,
                ticketsGoal: ticketsData.goal || 25,
                status: member.status || 'Онлайн',
                role: member.role || '',
                category: member.category
            });
        }
        
        // Сортируем по имени
        membersStats.sort((a, b) => a.name.localeCompare(b.name));
        
        // Формируем HTML
        let membersHtml = '';
        let membersLinesForCopy = [];
        
        for (const stats of membersStats) {
            const isEventsCompleted = stats.eventsDone >= stats.eventsGoal;
            const eventsIcon = isEventsCompleted ? '✅' : '❌';
            
            const isTicketsCompleted = (stats.ticketsDone || 0) >= (stats.ticketsGoal || 25);
            const ticketsIcon = isTicketsCompleted ? '✅' : '❌';
            
            let statusIcon = '';
            if (stats.status === 'Онлайн') statusIcon = '🟢';
            else if (stats.status === 'Заморозка') statusIcon = '⏸️';
            else if (stats.status === 'Отпуск') statusIcon = '🏖️';
            else statusIcon = '⚫';
            
            const copyLine = `<@${stats.discordId}> - ${statusIcon} Ивенты: ${stats.eventsDone}/${stats.eventsGoal} ${eventsIcon} | Тикеты: ${stats.ticketsDone || 0}/${stats.ticketsGoal || 25} ${ticketsIcon}`;
            membersLinesForCopy.push(copyLine);
            
            membersHtml += `
                <div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 2;">
                        <strong style="color: #ffd6aa;">${escapeHtml(stats.name)}</strong>
                        <span style="font-size: 0.7rem; color: #888; margin-left: 8px;">${escapeHtml(stats.role)}</span>
                        <span style="font-size: 0.7rem; margin-left: 8px;">${statusIcon} ${stats.status}</span>
                    </div>
                    <div style="flex: 3; display: flex; gap: 20px; flex-wrap: wrap;">
                        <span>🎯 Ивенты: <strong>${stats.eventsDone}/${stats.eventsGoal}</strong> ${eventsIcon}</span>
                        <span>🎫 Тикеты: <strong>${stats.ticketsDone || 0}/${stats.ticketsGoal || 25}</strong> ${ticketsIcon}</span>
                    </div>
                </div>
            `;
        }
        
        const allMembersTextToCopy = membersLinesForCopy.join('\n');
        
        const ticketsEditorButton = isEditor ? `
            <div style="text-align: right; margin-bottom: 15px;">
                <button id="ticketsEditorFromNormBtn" style="background: linear-gradient(95deg, rgba(85,85,85,0.5), rgba(51,51,51,0.5)); border: none; border-radius: 40px; padding: 8px 16px; color: white; cursor: pointer; font-size: 0.8rem;">
                    📊 Управление нормой
                </button>
            </div>
        ` : '';
        
        document.getElementById('eventDynamicContent').innerHTML = `
            <style>
                .norm-container {
                    background: var(--card-bg);
                    border-radius: 32px;
                    padding: 1.5rem;
                    border: 1px solid var(--card-border);
                    backdrop-filter: blur(20px);
                }
                .norm-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--table-row-border);
                }
                .norm-header h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #fff, #aaa);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 0.5rem;
                }
                .norm-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .norm-stat-card {
                    background: rgba(0,0,0,0.2);
                    border-radius: 24px;
                    padding: 1.2rem;
                    text-align: center;
                    border: 1px solid var(--card-border);
                }
                .norm-stat-value {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #fff, #aaa);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                .norm-stat-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: var(--text-muted);
                    margin-top: 0.3rem;
                }
                .member-stats-section {
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }
                .member-stats-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 1rem;
                    padding-left: 0.5rem;
                    border-left: 4px solid #c9a0ff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .member-stats-block {
                    background: rgba(0,0,0,0.2);
                    border-radius: 24px;
                    padding: 1.2rem;
                    font-size: 0.9rem;
                    line-height: 1.8;
                    color: var(--text-primary);
                    border: 1px solid var(--card-border);
                }
                .member-stats-note {
                    margin-top: 1rem;
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-align: center;
                    padding-top: 0.8rem;
                    border-top: 1px solid var(--card-border);
                }
                .copy-section-btn {
                    background: var(--badge-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 40px;
                    padding: 8px 20px;
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .copy-section-btn:hover {
                    background: var(--input-bg);
                    border-color: rgba(255,255,255,0.3);
                }
            </style>
            
            <div class="norm-container">
                <div class="norm-header">
                    <h2>📊 НОРМА ОТДЕЛА</h2>
                    <p>Статистика выполнения норм (младший состав)</p>
                </div>
                
                ${ticketsEditorButton}
                
                <div class="norm-stats-grid">
                    <div class="norm-stat-card">
                        <div class="norm-stat-value">${teamMembersCount}</div>
                        <div class="norm-stat-label">👥 Младший состав</div>
                    </div>
                    <div class="norm-stat-card">
                        <div class="norm-stat-value">${eventsCount}</div>
                        <div class="norm-stat-label">📅 Проведено ивентов</div>
                    </div>
                    <div class="norm-stat-card">
                        <div class="norm-stat-value">${onlineCount}</div>
                        <div class="norm-stat-label">🟢 Сейчас онлайн</div>
                    </div>
                    <div class="norm-stat-card">
                        <div class="norm-stat-value" style="color: #5fe147;">${totalPrizes.toLocaleString('ru-RU')}$</div>
                        <div class="norm-stat-label">💰 Всего призовых</div>
                    </div>
                </div>
                
                <div class="member-stats-section">
                    <div class="member-stats-title">
                        <span>📋 МЛАДШИЙ СОСТАВ (с нормой)</span>
                        <button class="copy-section-btn" id="copyAllMembersBtn">📋 Копировать строки</button>
                    </div>
                    <div class="member-stats-block">
                        ${membersHtml || '<div style="text-align:center; padding:20px;">Нет сотрудников в младшем составе</div>'}
                    </div>
                    <div class="member-stats-note">
                        ✅ - норма выполнена | ❌ - норма не выполнена<br>
                        🎫 Тикеты и 🎯 Ивенты считаются автоматически
                    </div>
                </div>
            </div>
        `;
        
        async function copyToClipboard(text, btn, successMessage) {
            try {
                await navigator.clipboard.writeText(text);
                showNotif(successMessage);
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Скопировано!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                showNotif('❌ Не удалось скопировать', true);
            }
        }
        
        const copyAllBtn = document.getElementById('copyAllMembersBtn');
        if (copyAllBtn && allMembersTextToCopy) {
            copyAllBtn.addEventListener('click', () => {
                copyToClipboard(allMembersTextToCopy, copyAllBtn, `✅ Скопировано ${membersStats.length} строк!`);
            });
        }
        
        hideGlobalLoading();
        
        if (isEditor) {
            const ticketsEditorBtn = document.getElementById('ticketsEditorFromNormBtn');
            if (ticketsEditorBtn) {
                ticketsEditorBtn.addEventListener('click', () => {
                    renderTicketsEditor();
                });
            }
        }
    })();
}
   
        else if (tab === 'event_guide') {
    document.getElementById('eventDynamicContent').innerHTML = ` 
        <style>
            .methodology-container {
                background: var(--card-bg);
                border-radius: 32px;
                padding: 2rem;
                border: 1px solid var(--card-border);
                box-shadow: 0 8px 32px var(--shadow-color);
            }
            
            .methodology-header {
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
                border-bottom: 2px solid var(--card-border);
            }
            
            .methodology-title {
                font-size: 2.5rem;
                font-weight: 800;
                background: linear-gradient(135deg, #fd72f4, #ffaa44, #44ffaa);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                margin-bottom: 0.5rem;
            }
            
            .methodology-subtitle {
                font-size: 1.3rem;
                color: var(--text-muted);
                letter-spacing: 2px;
            }
            
            .section-block {
                background: var(--badge-bg);
                border-radius: 24px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                transition: transform 0.2s;
            }
            
            .section-block:hover {
                transform: translateY(-2px);
            }
            
            .section-title {
                font-size: 1.6rem;
                font-weight: 700;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 3px solid;
                display: inline-block;
            }
            
            .section-title.green { color: #44ffaa; border-color: #44ffaa; }
            .section-title.orange { color: #ffaa44; border-color: #ffaa44; }
            .section-title.red { color: #ff6666; border-color: #ff6666; }
            .section-title.blue { color: #44aaff; border-color: #44aaff; }
            .section-title.purple { color: #fd72f4; border-color: #fd72f4; }
            .section-title.pink { color: #ff66cc; border-color: #ff66cc; }
            
            .rule-list {
                list-style: none;
                padding: 0;
            }
            
            .rule-list li {
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
                color: var(--text-primary);
            }
            
            .rule-list li::before {
                content: "•";
                position: absolute;
                left: 0;
                color: #ffaa44;
                font-size: 1.2rem;
            }
            
            .rank-card {
                background: var(--card-bg);
                border-radius: 20px;
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 4px solid;
                transition: all 0.2s;
            }
            
            .rank-card:hover {
                transform: translateX(5px);
            }
            
            .rank-card.ivent { border-left-color: #ffaa44; }
            .rank-card.senior { border-left-color: #44ffaa; }
            .rank-card.zam { border-left-color: #fd72f4; }
            .rank-card.glava { border-left-color: #ff4444; }
            
            .rank-name {
                font-size: 1.2rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .rank-desc {
                font-size: 0.85rem;
                color: var(--text-muted);
                margin-top: 0.5rem;
                line-height: 1.4;
            }
            
            .norm-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .norm-card {
                background: var(--card-bg);
                border-radius: 16px;
                padding: 1rem;
                text-align: center;
                border: 1px solid var(--card-border);
            }
            
            .norm-day {
                font-size: 1rem;
                font-weight: 700;
                color: #ffaa44;
            }
            
            .norm-value {
                font-size: 0.85rem;
                color: var(--text-primary);
                margin-top: 0.3rem;
            }
            
            .punishment-card {
                background: linear-gradient(135deg, rgba(255,68,68,0.1), rgba(255,68,68,0.05));
                border-radius: 16px;
                padding: 1rem;
                margin-bottom: 0.8rem;
                border-left: 3px solid #ff4444;
            }
            
            .stats-mini {
                display: inline-block;
                background: var(--badge-bg);
                padding: 0.2rem 0.6rem;
                border-radius: 20px;
                font-size: 0.7rem;
                color: var(--text-muted);
                margin-left: 0.5rem;
            }
        </style>
        
        <div class="methodology-container">
            <div class="methodology-header">
                <div class="methodology-title">Методичка Ивентологов</div>
                <div class="methodology-subtitle">ОСНОВНЫЕ ПРАВИЛА ОТДЕЛА ИВЕНТОЛОГИИ</div>
            </div>
            
            <!-- ЧТО МОЖНО ДЕЛАТЬ -->
            <div class="section-block">
                <div class="section-title green">ЧТО МОЖНО ДЕЛАТЬ?</div>
                <div class="rank-card ivent">
                    <div class="rank-name">Кто может проводить ивенты?</div>
                    <div class="rank-desc">Проводить ивенты можно с ранга «Оператор», если вы состоите в отделе Ивентологии. С рангов ниже — только с разрешения Главы отдела или Куратора сервера.</div>
                </div>
                <div class="rank-card ivent">
                    <div class="rank-name">Кол-во администрации на ивенте</div>
                    <div class="rank-desc">В ивенте может участвовать не более 25% от всей наборной администрации. <span class="stats-mini">Например: 10 админов → максимум 3</span></div>
                </div>
                <div class="rank-card ivent">
                    <div class="rank-name">⏸ Игнор завалов</div>
                    <div class="rank-desc">Если завал начался во время ивента, его разрешено игнорировать.</div>
                </div>
                <div class="rank-card ivent">
                    <div class="rank-name">Самостоятельность</div>
                    <div class="rank-desc">Каждый Ивентер может проводить ивенты без разрешения от Ст. Администрации. Если ты на испытательном сроке — нужно одобрение от Ст. Ивентера.</div>
                </div>
                <div class="rank-card ivent">
                    <div class="rank-name">Награды</div>
                    <div class="rank-desc">Если игрок использует баги/преимущества/нарушал правила — Ивентер может не выдавать приз. Если победа честная — Ивентер обязан выдать приз.</div>
                </div>
                <div class="rank-card ivent">
                    <div class="rank-name">RP-Мероприятия</div>
                    <div class="rank-desc">Помимо ивентов, вам также доступны РП-Мероприятия — сюжетные ролевые отыгровки в пределах RP-зоны. РП-мероприятие засчитывается как полноценный ивент.</div>
                </div>
            </div>
            
            <!-- ЧТО ВЫ ОБЯЗАНЫ ДЕЛАТЬ -->
            <div class="section-block">
                <div class="section-title orange">ЧТО ВЫ ОБЯЗАНЫ ДЕЛАТЬ?</div>
                <div class="rank-card senior">
                    <div class="rank-name">После ивента/РП-Мероприятия</div>
                    <div class="rank-desc">Убрать всё, что было построено/создано. Написать отчёт в специальный канал.</div>
                </div>
                <div class="rank-card senior">
                    <div class="rank-name">Лаги</div>
                    <div class="rank-desc">Если во время ивента появились лаги или высокий пинг — ивент нужно как можно быстрее прекратить и сообщить Главе/Зам. Главы.</div>
                </div>
            </div>
            
            <!-- ЧТО НЕЛЬЗЯ ДЕЛАТЬ -->
            <div class="section-block">
                <div class="section-title red">ЧТО НЕЛЬЗЯ ДЕЛАТЬ?</div>
                <ul class="rule-list">
                    <li>Запрещается привлекать игроков к РП-мероприятию через /OOC, участие должно происходить естественным RP путем.</li>
                    <li>Нельзя принуждать игроков к участию в мероприятии.</li>
                    <li>Создавать мероприятия, мешающие обычному RP-процессу сервера.</li>
                    <li>Запрещено начинать ивенты во время активных завалов.</li>
                    <li>Запрещено проводить 2 и более ивентов одновременно. Если кто-то уже проводит ивент — ждём, пока закончат.</li>
                    <li>Запрещено мешать подготовке или проведению ивентов (включая ивент-мастеров).</li>
                    <li>Категорически запрещено проводить ивенты в RP зоне. Исключение: РП-Мероприятия.</li>
                    <li>Запрещается проводить ивенты, которые нацелены на разжигание ненависти, дискриминацию, имеют деструктивный или политический контент.</li>
                    <li>Запрещено выпрашивать бонусы/привилегии за ивенты (будут наказания и возможно снятие).</li>
                    <li>Донатной администрации категорически запрещено проводить ивенты. Даже под вашим присмотром и даже в качестве помощников.</li>
                </ul>
            </div>
            
            <!-- УТОЧНЕНИЯ -->
            <div class="section-block">
                <div class="section-title purple">УТОЧНЕНИЯ</div>
                <ul class="rule-list">
                    <li>При проведении РП-мероприятий обязательно соблюдение всех действующих правил сервера.</li>
                    <li>Повышение до Ивент-Мастера не будет. Однако попросить его помощь вы можете в канале ┣🍽️・запрос-вещей.</li>
                    <li>Набирать людей в Ивентологию могут только Глава и Зам. Главы отдела.</li>
                    <li>Отдел Ивентологии является «совмещенным». Любой администратор из другого отдела может попасть к нам при наличии свободных слотов.</li>
                </ul>
            </div>
            
            <!-- МАКСИМАЛЬНОЕ КОЛИЧЕСТВО МЕСТ -->
            <div class="section-block">
                <div class="section-title blue">Максимальное количество мест в отделе — 9</div>
                <div class="norm-grid">
                    <div class="norm-card"><div class="norm-day">👑 Глава</div><div class="norm-value">1 место</div></div>
                    <div class="norm-card"><div class="norm-day">📿 Зам. Главы</div><div class="norm-value">1 место</div></div>
                    <div class="norm-card"><div class="norm-day">🍉 Ст. Ивентер</div><div class="norm-value">1 место</div></div>
                    <div class="norm-card"><div class="norm-day">🤡 Ивентеры</div><div class="norm-value">7 мест</div></div>
                </div>
            </div>
            
            <!-- РАНГИ -->
            <div class="section-block">
                <div class="section-title pink">РАНГИ</div>
                <div class="rank-card ivent"><div class="rank-name">Ивентер</div><div class="rank-desc">Имеет право проводить ивенты без разрешения со стороны Ст. Ивентера, но обязуется подчиняться всем адекватным приказам со стороны старших представителей отдела. Может игнорировать завал в случае, если ивент начался до завала.</div></div>
                <div class="rank-card senior"><div class="rank-name">Ст. Ивентер</div><div class="rank-desc">Имеет все полномочия Ивентера, а также имеет право корректировать работу Ивентеров и давать рекомендации по поводу ивентов, выдавать наказания за их ошибки, а также одобрять отчётности.</div></div>
                <div class="rank-card zam"><div class="rank-name">Зам. Главы Ивентологии</div><div class="rank-desc">Имеет все полномочия нижестоящих рангов, а также имеет право набирать новых кадров в отдел, определять курс развития отдела и изменять норму и правила.</div></div>
                <div class="rank-card glava"><div class="rank-name">Глава Ивентологии</div><div class="rank-desc">Имеет полное владение над отделом Ивентологии, может самостоятельно изменять состав отдела Ивентологии и их норму/правила.</div></div>
            </div>
            
            <!-- НОРМА -->
            <div class="section-block">
                <div class="section-title pink">НОРМА</div>
                <ul class="rule-list">
                    <li>Ивентер из другого отдела — кол-во тикетов из вашего отдела | 2 ивента в неделю</li>
                    <li>Ивентер — 30 тикетов | 2 ивента в неделю</li>
                    <li>Ст. Ивентер — 25 тикетов</li>
                    <li>Зам. Главы Ивентологии — не имеет нормы</li>
                    <li>Глава Ивентологии — не имеет нормы</li>
                </ul>
            </div>
            
            <!-- НОРМА ПОСЛЕ ОТПУСКА -->
            <div class="section-block">
                <div class="section-title orange">Норма после отпуска/заморозки/вступлении в отдел</div>
                <div class="norm-grid">
                    <div class="norm-card"><div class="norm-day">ПН</div><div class="norm-value">30 тикетов | 3 ивента</div></div>
                    <div class="norm-card"><div class="norm-day">ВТ</div><div class="norm-value">30 тикетов | 3 ивента</div></div>
                    <div class="norm-card"><div class="norm-day">СР</div><div class="norm-value">25 тикетов | 2 ивента</div></div>
                    <div class="norm-card"><div class="norm-day">ЧТ</div><div class="norm-value">20 тикетов | 1 ивент</div></div>
                    <div class="norm-card"><div class="norm-day">ПТ</div><div class="norm-value">15 тикетов | 1 ивент</div></div>
                    <div class="norm-card"><div class="norm-day">СБ</div><div class="norm-value">10 тикетов | 1 ивент</div></div>
                    <div class="norm-card"><div class="norm-day">ВС</div><div class="norm-value">Освобождены от нормы</div></div>
                </div>
                <div class="rank-card ivent" style="margin-top: 1rem;">
                    <div class="rank-name">Примечание</div>
                    <div class="rank-desc">Если вы состоите в другом отделе и вышли с отпуска/мороза — с четверга вы обязуетесь провести 1 ивент. Если с понедельника и до среды – 2 ивента.</div>
                </div>
            </div>
            
            <!-- НАКАЗАНИЯ -->
            <div class="section-block">
                <div class="section-title red">Наказания за невыполнение нормы</div>
                <div class="punishment-card"><strong>25-35 тикетов и 2-3 ивента:</strong> В случае уважительной причины недобор прощается, в другом случае выдается предупреждение.</div>
                <div class="punishment-card"><strong>15-24 тикета и 1-2 ивента:</strong> В случае уважительной причины выдается предупреждение, в другом случае выдается выговор.</div>
                <div class="punishment-card"><strong>0-14 тикета и 0-1 ивент:</strong> В случае уважительной причины выдается выговор, в другом случае снятие или два выговора.</div>
                <div class="punishment-card"><strong>Для ивентеров из другого отдела:</strong> Если проведено менее двух ивентов, выдается предупреждение. При уважительной причине недобор прощается.</div>
            </div>
            
            <!-- ЗАРПЛАТА -->
            <div class="section-block">
                <div class="section-title green">Зарплата</div>
                <div class="rank-card glava">
                    <div class="rank-desc">Зарплата выдаётся только за выполненные тикеты. Тех. Администрация не намеревается выдавать ЗП за ивенты, возможно когда-то в будущем у вас будет вознаграждение за ваши прекрасные ивенты.</div>
                </div>
            </div>
        </div>
    `;
}
    });
});

function renderAddonsPage() {
    const container = document.getElementById('eventDynamicContent');
    container.innerHTML = `
        <div class="page-header"><h2>🔧 Аддоны для строительства</h2></div>
        <div class="addons-grid">
            <div class="addon-card"><div class="addon-icon">🛠️</div><div class="addon-title">Вайт-Лист пропов 3-ого сервера</div><div class="addon-desc">Счётчик в 75 пропов</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3488412511" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">📋</div><div class="addon-title">Advanced Duplicator</div><div class="addon-desc">Копирование построек</div><a href="https://steamcommunity.com/workshop/filedetails/?id=773402917" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">📍</div><div class="addon-title">Precision Tool</div><div class="addon-desc">Точная установка пропов</div><a href="https://steamcommunity.com/workshop/filedetails/?id=104482086" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">📦</div><div class="addon-title">Stacker</div><div class="addon-desc">Удобная укладка пропов</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=264467687" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">🎨</div><div class="addon-title">Material</div><div class="addon-desc">Больше материалов</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=105841291" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">🎨</div><div class="addon-title">Ещё больше материалов</div><div class="addon-desc">Дополнительные текстуры</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=730187817" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">🌍</div><div class="addon-title">Весь контент 3-ого сервера</div><div class="addon-desc">Полный пак</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3277571435" target="_blank" class="addon-link">Скачать</a></div>
            <div class="addon-card"><div class="addon-icon">🗺️</div><div class="addon-title">Карта 3-ого сервера</div><div class="addon-desc">Тематическая карта</div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3277568392" target="_blank" class="addon-link">Скачать</a></div>
        </div>
    `;
}
function renderAddEventForm() {
    const container = document.getElementById('eventDynamicContent');
    container.innerHTML = `
        <div class="page-header">
            <h2>📝 Добавить новый ивент</h2>
            <button class="add-btn" id="backToEventsBtn">← Назад</button>
        </div>
        <div style="background:var(--card-bg); border-radius:28px; padding:1.8rem; border:1px solid var(--card-border);">
            
            <div class="form-group">
                <label>👤 Ваш ник *</label>
                <input type="text" id="eventNick" placeholder="Введите ваш никнейм" value="${currentUser || ''}">
            </div>
            
            <div class="form-group">
                <label>👥 Количество участников *</label>
                <input type="number" id="eventMembers" placeholder="Сколько человек участвовало" min="1">
            </div>
            
            <div class="form-group">
                <label>💰 Призовой фонд</label>
                <input type="text" id="eventPrize" placeholder="Например: 5000$ (или - если нет)">
                <small style="color: var(--text-muted);">Поставьте "-" если призового фонда нет</small>
            </div>
            
            <div class="form-group">
                <label>📌 Название ивента *</label>
                <input type="text" id="eventName" placeholder="Введите название ивента">
            </div>
            
            <div class="form-group">
                <label>📝 Вкратце распишите свой ивент *</label>
                <textarea id="eventDescription" rows="4" placeholder="Опишите суть ивента, правила, что нужно делать игрокам..."></textarea>
            </div>
            
            <div class="form-group">
                <label>🤝 Помогали в проведении</label>
                <input type="text" id="eventHelpers" placeholder="Ники помощников через запятую">
                <small style="color: var(--text-muted);">Если помогали несколько человек, пишите через запятую</small>
            </div>
            
            <div class="form-group">
                <label>📊 Количество ивентов за неделю</label>
                <input type="number" id="eventWeekCount" placeholder="Сколько ивентов вы провели за эту неделю" min="1" value="1">
            </div>
            
            <div class="form-group">
                <label>🎥 Видео ивента</label>
                <input type="text" id="eventVideo" placeholder="Ссылка на YouTube или Imgur">
                <small style="color: var(--text-muted);">Загрузите видео на YouTube/Imgur и вставьте ссылку</small>
            </div>
            
            <div class="form-group">
                <label>📏 Тип ивента *</label>
                <select id="eventType">
                    <option value="Малый">🔹 Малый</option>
                    <option value="Средний">🔸 Средний</option>
                    <option value="Большой">🔶 Большой</option>
                </select>
            </div>
            
            <div class="form-group" style="background: var(--badge-bg); border-radius: 20px; padding: 1rem; margin-top: 1rem;">
                <label style="color: #ffaa44;">⚠️ ВАЖНО</label>
                <p style="font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-secondary);">
                    Все скриншоты и видео отправляйте в <strong>ветку бот-отчетность</strong> в Discord
                </p>
                <small style="color: var(--text-muted);">
                    Ссылку на видео укажите в поле выше
                </small>
            </div>
            
            <button class="submit-btn" id="sendEventToDiscordBtn">📤 Отправить ивент</button>
        </div>
    `;
    
    document.getElementById('backToEventsBtn')?.addEventListener('click', () => renderEventsTable());
    document.getElementById('sendEventToDiscordBtn')?.addEventListener('click', sendEventToDiscord);
}

async function sendEventToDiscord() {
    const nick = document.getElementById('eventNick')?.value.trim();
    const members = document.getElementById('eventMembers')?.value.trim();
    const prize = document.getElementById('eventPrize')?.value.trim() || '-';
    const name = document.getElementById('eventName')?.value.trim();
    const description = document.getElementById('eventDescription')?.value.trim();
    const helpers = document.getElementById('eventHelpers')?.value.trim() || 'Нет';
    const weekCount = document.getElementById('eventWeekCount')?.value.trim() || '1';
    const video = document.getElementById('eventVideo')?.value.trim() || 'Не указано';
    const eventType = document.getElementById('eventType')?.value;
    
    // Валидация
    if (!nick) {
        showNotif('❌ Введите ваш ник!', true);
        return;
    }
    if (!members || parseInt(members) < 1) {
        showNotif('❌ Укажите количество участников!', true);
        return;
    }
    if (!name) {
        showNotif('❌ Введите название ивента!', true);
        return;
    }
    if (!description) {
        showNotif('❌ Опишите ивент!', true);
        return;
    }
    
    const sendBtn = document.getElementById('sendEventToDiscordBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = '🔄 Отправка...';
    
    try {
        const now = new Date();
        const mskTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
        const day = String(mskTime.getUTCDate()).padStart(2, '0');
        const month = String(mskTime.getUTCMonth() + 1).padStart(2, '0');
        const year = String(mskTime.getUTCFullYear()).slice(-2);
        const hours = String(mskTime.getUTCHours()).padStart(2, '0');
        const minutes = String(mskTime.getUTCMinutes()).padStart(2, '0');
        const dateStr = `${day}.${month}.${year}, ${hours}:${minutes}`;
        
        const rating = prize === '-' ? '0$' : prize.replace(/[^0-9]/g, '') + '$';
        
        // Сохраняем в Google Sheets
        const sheetResult = await addEventToSheet({
            name: name,
            organizer: nick,
            helpers: helpers,
            date: dateStr,
            status: 'Проведен',
            rating: rating,
            members: members,
            description: description
        });
        
        if (!sheetResult.success) {
            throw new Error('Ошибка сохранения в таблицу');
        }
        
        // Отправка в Discord
        const embed = {
            title: '📌 НОВЫЙ ИВЕНТ',
            color: eventType === 'Большой' ? 0xff8800 : eventType === 'Средний' ? 0xffaa44 : 0xffcc88,
            fields: [
                { name: '👤 Организатор', value: nick, inline: true },
                { name: '📏 Тип ивента', value: eventType, inline: true },
                { name: '👥 Участников', value: members, inline: true },
                { name: '💰 Призовой фонд', value: prize, inline: true },
                { name: '📊 Ивентов за неделю', value: weekCount, inline: true },
                { name: '📅 Дата', value: dateStr, inline: true },
                { name: '📌 Название', value: name, inline: false },
                { name: '📝 Описание', value: description, inline: false },
                { name: '🤝 Помощники', value: helpers, inline: true },
                { name: '🎥 Видео', value: video, inline: true }
            ],
            timestamp: new Date().toISOString()
        };
        
        await fetch(`${CLOUDFLARE_API}/api/send-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: name,
        description: description,
        date: dateStr,
        members: members,
        prizes: prize,
        organizer: nick,
        helpers: helpers,
        eventType: eventType,
        video: video,
        weekCount: weekCount
    })
});
        
        // Аудит-лог
        await sendAuditLog('ADD_EVENT', {
            name: name,
            organizer: nick,
            helpers: helpers,
            date: dateStr,
            rating: rating,
            members: members,
            description: description,
            eventType: eventType,
            video: video
        });
        
        showNotif('✅ Ивент успешно добавлен!');
        
        // Очищаем форму
        document.getElementById('eventNick').value = currentUser || '';
        document.getElementById('eventMembers').value = '';
        document.getElementById('eventPrize').value = '';
        document.getElementById('eventName').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventHelpers').value = '';
        document.getElementById('eventWeekCount').value = '1';
        document.getElementById('eventVideo').value = '';
        document.getElementById('eventType').value = 'Малый';
        
        // Обновляем данные
        showGlobalLoading();
        setTimeout(async () => {
            await refreshEventsData();
            renderEventsTable();
            hideGlobalLoading();
            showNotif('📊 Таблица обновлена!');
        }, 2000);
        
        // Переключаем на таблицу
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector('[data-tab="events_table"]')?.classList.add('active');
        
    } catch (error) {
        console.error('Send event error:', error);
        showNotif('❌ Ошибка: ' + error.message, true);
        hideGlobalLoading();
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Отправить ивент';
    }
}

// АВТОРИЗАЦИЯ
const loginOverlay = document.getElementById('loginOverlay');
const welcomeContainer = document.getElementById('welcomeContainer');
const mainDashboard = document.getElementById('mainDashboard');
const loginBtn = document.getElementById('loginBtn');
const loginInput = document.getElementById('loginInput');
const passInput = document.getElementById('passwordInput');
const errMsg = document.getElementById('errorMsg');
const contBtn = document.getElementById('continueBtn');
const logoutBtn = document.getElementById('logoutBtn');



function updateUIBasedOnRole() {
    const addMemberBtn = document.getElementById('addMemberNavBtn');
    if (addMemberBtn) {
        addMemberBtn.style.display = isEditor ? 'flex' : 'none';
    }
    
    const ticketsEditorBtn = document.getElementById('ticketsEditorBtn');
    if (ticketsEditorBtn) {
        ticketsEditorBtn.style.display = isEditor ? 'flex' : 'none';
    }
    
    const manageTeamBtn = document.getElementById('manageTeamBtn');
    if (manageTeamBtn) {
        manageTeamBtn.style.display = isEditor ? 'flex' : 'none';
    }
    
    // Добавляем кнопку импорта тикетов
    const importTicketsBtn = document.getElementById('importTicketsBtn');
    if (importTicketsBtn) {
        importTicketsBtn.style.display = isEditor ? 'flex' : 'none';
    }
}

// Инициализация модального окна добавления участника
const addMemberModal = document.getElementById('addMemberModal');
const addMemberNavBtn = document.getElementById('addMemberNavBtn');
const closeAddMemberModal = document.getElementById('closeAddMemberModal');
const saveMemberBtn = document.getElementById('saveMemberBtn');

if (addMemberNavBtn) {
    addMemberNavBtn.addEventListener('click', () => {
        addMemberModal.style.display = 'flex';
    });
}

if (closeAddMemberModal) {
    closeAddMemberModal.addEventListener('click', () => {
        addMemberModal.style.display = 'none';
    });
}

// Закрытие по клику на фон
window.addEventListener('click', (e) => {
    if (e.target === addMemberModal) {
        addMemberModal.style.display = 'none';
    }
});

function checkAuth() {
    const saved = sessionStorage.getItem('user');
    const savedIsEditor = sessionStorage.getItem('isEditor');
    const continued = sessionStorage.getItem('continued');
    
    if (saved && VALID_LOGINS.includes(saved)) {
        currentUser = saved;
        updateSidebarAvatar(saved);
        isEditor = savedIsEditor === 'true';
        loginOverlay.style.display = 'none';
        updateUIBasedOnRole();
        
        if (continued === 'true') {
            welcomeContainer.classList.add('hidden');
            mainDashboard.style.display = 'block';

            // Скрываем лишнее для гостя
if (currentUser === 'Гость') {
    document.querySelector('[data-tab="add_event"]').style.display = 'none';
    document.getElementById('ticketsEditorBtn').style.display = 'none';
    document.getElementById('manageTeamBtn').style.display = 'none';
    document.getElementById('importTicketsBtn').style.display = 'none';
}
            
            // ЗАГРУЖАЕМ ДАННЫЕ ПРИ СТАРТЕ
            showGlobalLoading();
            Promise.all([
                refreshEventsData(),
                refreshTeamData()
            ]).finally(() => {
                hideGlobalLoading();
                renderEventsTable();
            });
            
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            const eventsTab = document.querySelector('[data-tab="events_table"]');
            if (eventsTab) {
                eventsTab.classList.add('active');
            }
        } else {
            welcomeContainer.classList.remove('hidden');
            mainDashboard.style.display = 'none';
        }
    } else {
        currentUser = null;
        isEditor = false;
        loginOverlay.style.display = 'flex';
        welcomeContainer.classList.add('hidden');
        mainDashboard.style.display = 'none';
        
    }
}

async function onContinue() {
    showBugReportMessage();
    sessionStorage.setItem('continued', 'true');
    welcomeContainer.classList.add('hidden');
    mainDashboard.style.display = 'block';

    // Скрываем вкладки для гостя после входа
if (currentUser === 'Гость') {
    document.querySelector('[data-tab="add_event"]').style.display = 'none';
    document.querySelector('[data-tab="event_guidee"]').style.display = 'none';
    document.querySelector('[data-tab="event_guide"]').style.display = 'none';
    document.querySelector('[data-tab="event_adons"]').style.display = 'none';
    document.getElementById('salaryBtn').style.display = 'none';
    
    var creatorSection = document.querySelector('.nav-section:last-child');
    if (creatorSection) creatorSection.style.display = 'none';
}
    
    showGlobalLoading();
    
    // ЗАГРУЖАЕМ ОБА НАБОРА ДАННЫХ ПАРАЛЛЕЛЬНО
    await Promise.all([
        refreshEventsData(),
        refreshTeamData()
    ]);
    
    hideGlobalLoading();
    renderEventsTable();
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    const eventsTab = document.querySelector('[data-tab="events_table"]');
    if (eventsTab) {
        eventsTab.classList.add('active');
    }
}

let cachedPasswords = null;



async function doLogin() {
    const login = loginInput.value.trim();
    const pwd = passInput.value;
    
    if (!login || !pwd) {
        errMsg.textContent = "❌ Введите логин и пароль!";
        errMsg.classList.add('show');
        setTimeout(() => errMsg.classList.remove('show'), 2000);
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳ Вход...';
    
    try {
        const response = await fetch(`${CLOUDFLARE_API}/api/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'  // 👈 ЭТОТ ЗАГОЛОВОК ВАЖЕН!
            },
            body: JSON.stringify({ login, password: pwd })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem('user', data.user);
            sessionStorage.setItem('isEditor', data.isEditor);
            sessionStorage.setItem('continued', 'false');
            
            currentUser = data.user;
            isEditor = data.isEditor;
            
            sendAuditLog('LOGIN', {}).catch(err => console.error('Ошибка отправки лога входа:', err));
            
            loginOverlay.style.display = 'none';
            welcomeContainer.classList.remove('hidden');
            mainDashboard.style.display = 'none';
            
            updateSidebarAvatar(login);
            errMsg.classList.remove('show');
            showNotif(`✅ Добро пожаловать, ${login}!`);
            
            refreshEventsData();
        } else {
            errMsg.textContent = `❌ ${data.error || "Неверный логин или пароль!"}`;
            errMsg.classList.add('show');
            setTimeout(() => errMsg.classList.remove('show'), 2000);
        }
    } catch (error) {
        console.error('Login error:', error);
        errMsg.textContent = "❌ Ошибка соединения с сервером!";
        errMsg.classList.add('show');
        setTimeout(() => errMsg.classList.remove('show'), 2000);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Войти';
    }
}

async function onContinue() {
    showBugReportMessage();

    sessionStorage.setItem('continued', 'true');
    welcomeContainer.classList.add('hidden');
    mainDashboard.style.display = 'block';
    renderEventsTable();
    
    showGlobalLoading();
    await refreshEventsData();
    await refreshTeamData();  // 👈 ДОБАВЬ ЭТУ СТРОКУ
    hideGlobalLoading();
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    const eventsTab = document.querySelector('[data-tab="events_table"]');
    if (eventsTab) {
        eventsTab.classList.add('active');
    }
}

// Принудительная загрузка команды при старте
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (currentUser) {
            refreshTeamData();
        }
    });
} else {
    if (currentUser) {
        refreshTeamData();
    }
}

function logout() {
    if (currentUser) {
        sendAuditLog('LOGOUT', {}).catch(err => console.error('Ошибка отправки лога выхода:', err));
    }
    
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isEditor');
    sessionStorage.removeItem('continued');
    checkAuth();
    showNotif('👋 Вы вышли из системы');
}

loginBtn.addEventListener('click', doLogin);
// ГОСТЕВОЙ РЕЖИМ
// ГОСТЕВОЙ РЕЖИМ
document.getElementById('guestBtn').addEventListener('click', function() {
    currentUser = 'Гость';
    isEditor = false;
    
    sessionStorage.setItem('user', 'Гость');
    sessionStorage.setItem('isEditor', 'false');
    sessionStorage.setItem('continued', 'false');
    
    loginOverlay.style.display = 'none';
    welcomeContainer.classList.remove('hidden');
    mainDashboard.style.display = 'none';
    
    updateSidebarAvatar('Гость');
    updateUIBasedOnRole();
    errMsg.classList.remove('show');
    
    // ===== СКРЫВАЕМ ЛИШНИЕ ВКЛАДКИ ДЛЯ ГОСТЯ =====
    document.querySelector('[data-tab="add_event"]').style.display = 'none';       // Добавить ивент
    document.querySelector('[data-tab="event_guidee"]').style.display = 'none';     // Норма
    document.querySelector('[data-tab="event_guide"]').style.display = 'none';      // Методичка
    document.querySelector('[data-tab="event_adons"]').style.display = 'none';      // Адонны
    document.getElementById('salaryBtn').style.display = 'none';                    // Повышение
    
    // Скрываем всю секцию "КРЕАТОРЫ"
    var creatorSection = document.querySelector('.nav-section:last-child');
    if (creatorSection) creatorSection.style.display = 'none';
    
    // Скрываем заголовки секций если они пустые
    var navSections = document.querySelectorAll('.nav-section');
    navSections.forEach(function(section) {
        var visibleItems = section.querySelectorAll('.nav-item:not([style*="display: none"])');
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        }
    });
    // =============================================
});

// ===== ВОЗВРАЩАЕМ ВКЛАДКИ ПРИ ВЫХОДЕ ИЗ ГОСТЯ =====
// Найди функцию logout и добавь в неё восстановление вкладок
var originalLogoutFunc = logout;
logout = function() {
    // Восстанавливаем все скрытые вкладки
    var allTabs = ['add_event', 'event_guidee', 'event_guide', 'event_adons'];
    allTabs.forEach(function(tab) {
        var el = document.querySelector('[data-tab="' + tab + '"]');
        if (el) el.style.display = '';
    });
    
    var salaryBtn = document.getElementById('salaryBtn');
    if (salaryBtn) salaryBtn.style.display = '';
    
    var creatorSection = document.querySelector('.nav-section:last-child');
    if (creatorSection) creatorSection.style.display = '';
    
    var navSections = document.querySelectorAll('.nav-section');
    navSections.forEach(function(section) {
        section.style.display = '';
    });
    
    // Вызываем оригинальный logout
    originalLogoutFunc();
};
contBtn.addEventListener('click', onContinue);
logoutBtn.addEventListener('click', logout);
loginInput.addEventListener('keypress', e => e.key === 'Enter' && doLogin());
passInput.addEventListener('keypress', e => e.key === 'Enter' && doLogin());

const modal = document.getElementById('infoModal');
document.getElementById('closeModalBtn')?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

loadAllData();
checkAuth();

const bg = document.getElementById('moving-bg');
if (bg) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    function smoothAnimate() {
        currentX += (targetX - currentX) * 1.5;
        currentY += (targetY - currentY) * 1.5;
        bg.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
        requestAnimationFrame(smoothAnimate);
    }
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 25;
        targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    });
    smoothAnimate();
    }

const toggleNavBtn = document.getElementById('toggleNavStyleBtn');
if (toggleNavBtn) {
    toggleNavBtn.addEventListener('click', toggleNavStyle);
}
// ========== ДВА ВИДА КНОПОК ДЛЯ САЙДБАРА ==========
let currentNavStyle = localStorage.getItem('navStyle') || 'style1';

function applyNavStyle() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('style-1', 'style-2');
        item.classList.add(currentNavStyle);
    });
}

function toggleNavStyle() {
    currentNavStyle = currentNavStyle === 'style1' ? 'style2' : 'style1';
    localStorage.setItem('navStyle', currentNavStyle);
    applyNavStyle();
    showNotificationGlobal('Стиль кнопок меню изменён', 'info');
}



// Применяем при загрузке
applyNavStyle();
function updateSidebarAvatar(username) {
    const avatarImg = document.querySelector('.sidebar-logo');
    if (!avatarImg) return;

    const avatarMap = {
    "Gl1tchFrost": "https://shared.fastly.steamstatic.com/community_assets/images/items/2861720/5ae020a665661d3e6499da7fb601f373fa998228.gif",
    "Zoffi" : "https://avatars.akamai.steamstatic.com/b65685aae297d33e2263633211872decb95191b6_full.jpg",
    "Артур П" : "https://avatars.akamai.steamstatic.com/613bc9ebf037ac39219ed8f1240f6d2c8d85518b_full.jpg",
    "Тявкобай" : "https://avatars.akamai.steamstatic.com/61ab70962972708287fbe01bbf30a073e02557fb_full.jpg",
    "ki-p": "https://avatars.akamai.steamstatic.com/7c0568b92eabda5703516fa7e03ba4676d8b03e5_full.jpg",
    "T1Ran": "https://avatars.akamai.steamstatic.com/57dac1d4d44de03338708c08310198b23192ab51_full.jpg",
    "manisule": "https://avatars.akamai.steamstatic.com/3973c828510cfd75f32b6a4d09bffa642f6c975f_full.jpg",
    "Гербикс": "https://avatars.akamai.steamstatic.com/3acd2544afbc953feb4af6da64440fa4bf48618e_full.jpg",
    "Arbuz Madrazo": "https://avatars.akamai.steamstatic.com/60c2b352131f11a8bcbd08f452decd9dfea10a32_full.jpg",
    "somcop": "https://avatars.akamai.steamstatic.com/181420ae4a4f46eabd79c3b6b56e5e5e70aa4b91_full.jpg",
    "Foxy": "https://avatars.akamai.steamstatic.com/e2ae91fee516fc12a05fbfe995f52891db03c63f_full.jpg",
    "Дмитрий Морозов": "https://avatars.akamai.steamstatic.com/5a54395d65879aed3fc59787f1d9eaf21a839ff5_full.jpg",
    "Гофикал": "https://avatars.akamai.steamstatic.com/ed77d818ec20ca4aad3417f5033647f79229c92a_full.jpg",
    "Himas": "https://avatars.akamai.steamstatic.com/40ddf358c9028e084e617b8edecfdc620e5c12c9_full.jpg",
    "yaroslav1432": "https://shared.akamai.steamstatic.com/community_assets/images/items/1313140/4ae9f2b8739631ea806a9508785f0445557e9bff.gif",
    "кусочек шаурмы": "https://avatars.akamai.steamstatic.com/a350434d0216c11358393f13cf8a95bfcf1509db_full.jpg",
    "Гарик Харламовв" : "https://avatars.akamai.steamstatic.com/9dd518738e6c1db81cf5184e3ae43c2ac5150ada_full.jpg",
    "gans7824": "https://avatars.akamai.steamstatic.com/7ccb0ac2e182c765a7ddf35bb64dde75e26ddfc2_full.jpg"
};
    
    const newAvatar = avatarMap[username] || "https://i.ytimg.com/vi/_pMmC52HB2k/hqdefault.jpg";
    avatarImg.src = newAvatar;
}

doLogin

const avatarImg = document.querySelector('.sidebar-logo');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const bgOptions = document.querySelectorAll('.bg-option');
const userEventsCountSpan = document.getElementById('userEventsCount');
const userPrizesCountSpan = document.getElementById('userPrizesCount');
const userJoinDateSpan = document.getElementById('userJoinDate');

// Функция форматирования даты (убедись, что она есть в начале файла)
function formatDate(dateString) {
    if (!dateString) return 'Дата не указана';
    
    // Если дата уже в нормальном формате (ДД.ММ.ГГ)
    if (dateString.match(/^\d{2}\.\d{2}\.\d{2}/)) {
        return dateString;
    }
    
    // Пробуем распарсить ISO формат (2026-03-13T21:00:00.000Z)
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}.${month}.${year}`;
        }
    } catch(e) {
        console.error('Ошибка парсинга даты:', e);
    }
    
    // Если ничего не помогло, возвращаем как есть
    return dateString;
}

// Функция получения статистики пользователя (ИСПРАВЛЕННАЯ)
function getUserStats() {
    const username = currentUser || sessionStorage.getItem('user') || 'Гость';
    // ИСПРАВЛЕНО: ищем по event.organizer
    let userEvents = eventsData.filter(e => e.organizer === username).length;
    let totalPrizes = 0;
    eventsData.forEach(e => {
        // ИСПРАВЛЕНО: ищем по event.organizer
        if (e.organizer === username) {
            let clean = String(e.rating).replace(/[^0-9]/g, '');
            let num = parseInt(clean);
            if (!isNaN(num)) totalPrizes += num;
        }
    });
    
    // Берем дату вступления из teamData
    const userInfo = teamData.find(m => m.name === username);
    let joinDate = "14.03.26";
    if (userInfo && userInfo.joinDate) {
        joinDate = formatDate(userInfo.joinDate);
    }
    
    return { events: userEvents, prizes: totalPrizes, joinDate: joinDate };
}


function updateStatsDisplay() {
    const stats = getUserStats();
    if (userEventsCountSpan) userEventsCountSpan.textContent = stats.events;
    if (userPrizesCountSpan) userPrizesCountSpan.textContent = stats.prizes.toLocaleString() + '$';
    if (userJoinDateSpan) userJoinDateSpan.textContent = stats.joinDate;
}

function applyBrightness(value) {
    const percent = value / 100;
    const bg = document.getElementById('moving-bg');
    if (bg) {
        bg.style.filter = `brightness(${percent}) blur(8px) saturate(0) grayscale(1)`;
    }
    let overlay = document.getElementById('brightnessOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'brightnessOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9998';
        overlay.style.transition = 'background-color 0.2s ease';
        document.body.appendChild(overlay);
    }
    if (value < 100) {
        const darkAmount = (100 - value) / 100;
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${darkAmount * 0.5})`;
    } else if (value > 100) {
        const lightAmount = (value - 100) / 100;
        overlay.style.backgroundColor = `rgba(255, 255, 255, ${lightAmount * 0.3})`;
    } else {
        overlay.style.backgroundColor = 'transparent';
    }
    if (brightnessValue) brightnessValue.textContent = value + '%';
}

function applyBackground(bgId) {
    const bgUrls = {
        1: 'https://s.fotora.ru/53ed6c1638eeb0c3.png',
        2: 'https://s.fotora.ru/428d4435cf52dbd9.png',
        3: 'https://s.fotora.ru/685ca425d754b424.png',
        4: 'https://s.fotora.ru/a95e1a74f4e1a6d6.png',
        5: 'https://s.fotora.ru/96a91f558437979e.png',
        6: 'https://s.fotora.ru/5583442297c8d4c5.png',
        7: 'https://s.fotora.ru/536ddcc63cff044b.png',
        8: 'https://s.fotora.ru/00a6f25b03700d71.png',
        9: 'https://s.fotora.ru/887ddbf1ff2f6a2c.png',
        10: 'https://s.fotora.ru/dc5ad1b288acf115.png',
        11: 'https://s.fotora.ru/7fc75b13766b24d9.png',
        12: 'https://s.fotora.ru/cad6e89b6485693f.png'
    };
    
    const bgElement = document.getElementById('moving-bg');
    if (bgElement && bgUrls[bgId]) {
        // Принудительно меняем фон
        bgElement.style.backgroundImage = `url('${bgUrls[bgId]}')`;
        bgElement.style.backgroundSize = "cover";
        bgElement.style.backgroundPosition = "center";
        bgElement.style.backgroundRepeat = "no-repeat";
        
        // Сохраняем в localStorage
        localStorage.setItem('selectedBg', bgId);
        
        console.log(`✅ Фон изменён на ${bgId}`);
        showNotif(`🖼️ Фон изменён`, false, 'success');
    } else {
        console.error('Фон не найден или ID не существует');
    }
}

function openSettings() {
    updateStatsDisplay();
    settingsModal.classList.add('show');
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

function loadSavedSettings() {
    const savedBrightness = localStorage.getItem('brightness');
    if (savedBrightness && brightnessSlider) {
        brightnessSlider.value = savedBrightness;
        applyBrightness(savedBrightness);
    }
    const savedBg = localStorage.getItem('selectedBg');
    if (savedBg) {
        applyBackground(savedBg);
        bgOptions.forEach(opt => {
            if (opt.dataset.bg === savedBg) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }
}

function saveAllSettings() {
    const brightness = brightnessSlider.value;
    localStorage.setItem('brightness', brightness);
    applyBrightness(brightness);
    const selectedBg = document.querySelector('.bg-option.selected');
    if (selectedBg) {
        localStorage.setItem('selectedBg', selectedBg.dataset.bg);
        applyBackground(selectedBg.dataset.bg);
    }
    closeSettings();
    showNotif('✅ Настройки сохранены!');
}

bgOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        bgOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
    });
});

if (brightnessSlider) {
    brightnessSlider.addEventListener('input', (e) => {
        applyBrightness(parseInt(e.target.value));
    });
}

if (avatarImg) avatarImg.addEventListener('click', openSettings);
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveAllSettings);
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });
}
openEditEventModal
loadSavedSettings();

const salaryBtn = document.getElementById('salaryBtn');
const salaryModal = document.getElementById('salaryModal');
const closeSalaryBtn = document.getElementById('closeSalaryBtn');
const salaryAudio = document.getElementById('salaryAudio');

function openSalaryModal() {
    salaryModal.classList.add('show');
    if (salaryAudio) {
        salaryAudio.play().catch(e => console.log('Автовоспроизведение заблокировано, нажмите на окно'));
    }
}

function closeSalaryModal() {
    salaryModal.classList.remove('show');
    if (salaryAudio) {
        salaryAudio.pause();
        salaryAudio.currentTime = 0; 
    }
}

if (salaryBtn) {
    salaryBtn.addEventListener('click', openSalaryModal);
}

if (closeSalaryBtn) {
    closeSalaryBtn.addEventListener('click', closeSalaryModal);
}

if (salaryModal) {
    salaryModal.addEventListener('click', function(e) {
        if (e.target === salaryModal) {
            closeSalaryModal();
        }
    });
}

if (salaryModal) {
    salaryModal.addEventListener('click', function() {
        if (salaryModal.classList.contains('show') && salaryAudio && salaryAudio.paused) {
            salaryAudio.play().catch(e => console.log('Всё ещё заблокировано'));
        }
    });
}

   const BanConfig = {
        containerId:     'banContainer',
        texts: [
            { text: 'БАН',            weight: 4 },
            { text: 'ВЫГОВОР',        weight: 3 },
            { text: 'ПРЕДУПРЕЖДЕНИЕ', weight: 2 },
            { text: 'ЧСП',            weight: 2 }
        ],
        spawnRateMs:     250,
        initialBurst:    40,
        burstIntervalMs: 120,
        minSize: 8,
        maxSize: 20,
        animations: ['flyRight', 'flyLeft', 'flyUp', 'flyDiagonal']
    };

    function getRandomText() {
        const totalWeight = BanConfig.texts.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of BanConfig.texts) { random -= item.weight; if (random <= 0) return item.text; }
        return BanConfig.texts[0].text;
    }

    function createBanText() {
        if (document.hidden) return;
        const container = document.getElementById(BanConfig.containerId);
        if (!container) return;
        const el           = document.createElement('span');
        el.className       = 'ban-text';
        el.setAttribute('aria-hidden', 'true');
        const selectedText = getRandomText();
        el.textContent     = selectedText;
        el.dataset.type    = selectedText.toLowerCase();
        if (Math.random() > 0.75) el.classList.add('glow');
        let size = BanConfig.minSize + Math.random() * (BanConfig.maxSize - BanConfig.minSize);
        if (selectedText.length > 6) size *= 0.7;
        el.style.fontSize = `${size}px`;
        el.style.setProperty('--max-opacity', (0.10 + Math.random() * 0.18).toFixed(2));
        el.style.setProperty('--rot', `${-25 + Math.random() * 50}deg`);
        el.style.top  = `${Math.random() * 100}%`;
        el.style.left = `${Math.random() * 100}%`;
        const anim     = BanConfig.animations[Math.floor(Math.random() * BanConfig.animations.length)];
        const duration = 6 + Math.random() * 8;
        el.style.animation = `${anim} ${duration}s linear forwards, gradientPulse ${2 + Math.random() * 2}s ease-in-out infinite`;
        container.appendChild(el);
        setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000 + 300);
    }

    function startBanAnimation() {
        for (let i = 0; i < BanConfig.initialBurst; i++) setTimeout(createBanText, i * BanConfig.burstIntervalMs);
        setInterval(createBanText, BanConfig.spawnRateMs);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startBanAnimation);
    else startBanAnimation();

    let sweetEarnIsOpen       = false;
    let sweetEarnCloseTimer   = null;
    let sweetEarnCleanupTimer = null;

    function initSweetEarnFeature() {
    if (window.__sweetEarnFeatureInit) return;
    window.__sweetEarnFeatureInit = true;

    function getSweetEarnEls() {
        return {
            overlay:   document.getElementById('sweetEarnOverlay'),
            text:      document.getElementById('sweetEarnText'),
            imageWrap: document.getElementById('sweetEarnImageWrap')
        };
    }

    function clearSweetEarnTimers() {
        if (sweetEarnCloseTimer)   { clearTimeout(sweetEarnCloseTimer);   sweetEarnCloseTimer   = null; }
        if (sweetEarnCleanupTimer) { clearTimeout(sweetEarnCleanupTimer); sweetEarnCleanupTimer = null; }
    }

    function openSweetEarn() {
        const { overlay, text, imageWrap } = getSweetEarnEls();
        if (!overlay || !text || !imageWrap) { console.error('SweetEarn: элементы не найдены'); return; }
        clearSweetEarnTimers();
        sweetEarnIsOpen = true;
        overlay.classList.remove('sweet-earn-hide', 'is-closing', 'is-active', 'is-flashing');
        text.classList.remove('animate');
        imageWrap.classList.remove('animate');
        void overlay.offsetWidth; void text.offsetWidth; void imageWrap.offsetWidth;
        overlay.classList.add('is-active', 'is-flashing');
        overlay.setAttribute('aria-hidden', 'false');
        text.classList.add('animate');
        setTimeout(() => imageWrap.classList.add('animate'), 180);
        sweetEarnCloseTimer = setTimeout(closeSweetEarn, 7000);
    }

    function closeSweetEarn() {
        const { overlay, text, imageWrap } = getSweetEarnEls();
        if (!overlay) return;
        clearSweetEarnTimers();
        sweetEarnIsOpen = false;
        overlay.classList.remove('is-active', 'is-flashing');
        overlay.classList.add('is-closing');
        overlay.setAttribute('aria-hidden', 'true');
        sweetEarnCleanupTimer = setTimeout(() => {
            overlay.classList.add('sweet-earn-hide');
            overlay.classList.remove('is-closing');
            if (text)      text.classList.remove('animate');
            if (imageWrap) imageWrap.classList.remove('animate');
        }, 450);
    }
initSweetEarnFeature()

// Закрытие модалки
const closeEditModalBtn = document.getElementById('closeEditEventModal');
if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', function() {
        document.getElementById('editEventModal').style.display = 'none';
    });
}

// ========== ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ СТАТУСОВ ==========

// Функция для полного обновления статусов
async function forceUpdateAllStatuses() {
    console.log('🔄 Принудительное обновление статусов...');
    await refreshStatusesFromSheet();
    await loadAndApplyStatuses();
    renderEventsTable();
    console.log('✅ Статусы обновлены');
}

// Обновляем статусы при загрузке страницы
window.addEventListener('load', async () => {
    console.log('📢 Страница загружена, обновляем статусы...');
    await forceUpdateAllStatuses();
});

// Обновляем статусы при каждом обновлении ивентов
const originalRefreshEventsData = refreshEventsData;
refreshEventsData = async function() {
    console.log('📊 Обновление ивентов...');
    await originalRefreshEventsData();
    await forceUpdateAllStatuses();
    console.log('✅ Ивенты и статусы обновлены');
};

// Сохранение
const saveEditBtn = document.getElementById('saveEditEventBtn');
// В обработчике saveEditBtn
if (saveEditBtn) {
    saveEditBtn.addEventListener('click', async function() {
        const eventId = parseInt(document.getElementById('editEventId').value);
        const name = document.getElementById('editEventName').value.trim();
        const description = document.getElementById('editEventDescription').value.trim();
        const date = document.getElementById('editEventDate').value.trim();
        const rating = document.getElementById('editEventRating').value.trim();
        const members = document.getElementById('editEventMembers').value.trim();
        const helpers = document.getElementById('editEventHelpers').value.trim();
        
        if (!name) {
            showNotif('❌ Название ивента обязательно!', true);
            return;
        }
        
        // Сохраняем старые данные для лога
        const oldEvent = eventsData.find(e => e.id === eventId);
        
        this.disabled = true;
        this.textContent = '💾 Сохранение...';
        
        // Обновляем в Google Sheets
        const result = await updateEventInSheet({
            id: eventId,
            name: name,
            description: description,
            date: date,
            rating: rating,
            members: members,
            helpers: helpers
        });
        
        if (result.success) {
            showNotif('✅ Ивент сохранён! Обновление через 2 секунды...');
            document.getElementById('editEventModal').style.display = 'none';
            
            // Отправляем лог
            await sendAuditLog('EDIT_EVENT', 
                { eventId: eventId, name: name },
                { 
                    name: oldEvent?.name,
                    description: oldEvent?.fullDetails?.description,
                    date: oldEvent?.date,
                    rating: oldEvent?.rating,
                    members: oldEvent?.members,
                    helpers: oldEvent?.helpers
                },
                {
                    name: name,
                    description: description,
                    date: date,
                    rating: rating,
                    members: members,
                    helpers: helpers
                }
            );
            
            // ВАЖНО: Ждём 2 секунды перед обновлением
            showGlobalLoading();
            
            setTimeout(async () => {
                await refreshEventsData();  // Полная перезагрузка из Google Sheets
                renderEventsTable();
                hideGlobalLoading();
                showNotif('✅ Таблица обновлена!');
                
                // Обновляем норму, если открыта
                const activeTab = document.querySelector('.nav-item.active')?.dataset.tab;
                if (activeTab === 'event_guidee') {
                    document.querySelector('[data-tab="event_guidee"]').click();
                }
            }, 2000);
            
        } else {
            showNotif('❌ Ошибка обновления: ' + (result.error || 'неизвестная ошибка'), true);
            this.disabled = false;
            this.textContent = '💾 Сохранить';
            hideGlobalLoading();
        }
        
        this.disabled = false;
        this.textContent = '💾 Сохранить';
    });
}

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sweetEarnIsOpen) closeSweetEarn();
    });
}

// Функция для полной синхронизации ивентов
async function forceSyncEvents() {
    console.log('🔄 Принудительная синхронизация ивентов...');
    showGlobalLoading();
    
    try {
        // Очищаем кэш
        for (let key in commentsCache) {
            delete commentsCache[key];
        }
        
        // Перезагружаем данные
        await refreshEventsData();
        await refreshTeamData();
        
        // Перерисовываем
        renderEventsTable();
        renderTeamTable();
        
        // Обновляем статистику
        if (typeof updateStatsDisplay === 'function') {
            updateStatsDisplay();
        }
        
        showNotif('✅ Данные синхронизированы');
    } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
        showNotif('❌ Ошибка синхронизации', true);
    } finally {
        hideGlobalLoading();
    }
}

// Добавляем кнопку синхронизации в интерфейс
function addSyncButtonToEvents() {
    const pageHeader = document.querySelector('#eventDynamicContent .page-header');
    if (pageHeader && !document.getElementById('forceSyncEventsBtn')) {
        const syncBtn = document.createElement('button');
        syncBtn.id = 'forceSyncEventsBtn';
        syncBtn.innerHTML = 'Синхронизировать';
        syncBtn.style.cssText = `
            background: linear-gradient(95deg, rgba(85,85,85,0.5), rgba(51,51,51,0.5));
            border: none;
            border-radius: 40px;
            padding: 0.5rem 1.2rem;
            color: white;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.8rem;
            margin-left: auto;
            transition: all 0.2s;
        `;
        syncBtn.addEventListener('click', forceSyncEvents);
        pageHeader.appendChild(syncBtn);
    }
}

// Вызываем после отрисовки таблицы
const originalRenderEventsTable = renderEventsTable;
renderEventsTable = function() {
    originalRenderEventsTable();
    addSyncButtonToEvents();
};

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbysN7LWXHd_gzDQTVqmTrUUQy2u0qjAArPg6rORlFGNjEymH0eB-qSx2d3crBHp0HM5dg/exec';

async function forceSyncAllStatuses() {
    showGlobalLoading();
    
    for (const event of eventsData) {
        // Получаем статус из отдельной таблицы
        const statuses = await loadStatusesFromSheet();
        const found = statuses.find(s => s['ID ивента'] == event.id);
        
        if (found && found['Статус']) {
            let cleanStatus = found['Статус'];
            if (cleanStatus === 'Одобрен') cleanStatus = '✅Одобрен';
            else if (cleanStatus === 'Отказано') cleanStatus = '🔴Отказано';
            else if (cleanStatus === 'Скоро') cleanStatus = '🟡Скоро';
            
            if (event.callStatus !== cleanStatus) {
                event.callStatus = cleanStatus;
                console.log(`Обновлён статус ивента ${event.id}: ${cleanStatus}`);
            }
        }
    }
    
    saveAllData();
    renderEventsTable();
    hideGlobalLoading();
    showNotif('✅ Статусы синхронизированы');
}

// Вызовите эту функцию для принудительной синхронизации
forceSyncAllStatuses();

function syncStatusToSheet(eventId, newStatus, userName) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_status_sync_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('✅ Статус сохранён в Google Sheets:', eventId, newStatus, data);
            resolve(data || { success: true });
        };
        
        const params = new URLSearchParams({
            action: 'updateStatus',
            eventId: eventId,
            newStatus: newStatus,
            userName: userName || 'Система',
            callback: callbackName
        });
        
        script.src = `${GOOGLE_SHEETS_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.error('❌ Ошибка сохранения статуса');
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

// ========== ПОИСКОВАЯ СИСТЕМА ДЛЯ ТАБЛИЦЫ ИВЕНТОВ ==========
let currentSearchFilter = 'all'; // all, my, approved, rejected, pending
let currentSearchQuery = '';

// Функция для рендеринга таблицы с поиском
function renderEventsTableWithSearch() {
    const container = document.getElementById('eventDynamicContent');
    const showActions = currentUser !== null;
    const currentUsername = currentUser || sessionStorage.getItem('user');
    
    // Фильтруем ивенты
    let filteredEvents = [...eventsData];
    
    // Фильтр по категории
    switch(currentSearchFilter) {
        case 'my':
            filteredEvents = filteredEvents.filter(e => e.organizer === currentUsername);
            break;
        case 'approved':
            filteredEvents = filteredEvents.filter(e => e.callStatus === '✅Одобрен');
            break;
        case 'rejected':
            filteredEvents = filteredEvents.filter(e => e.callStatus === '🔴Отказано');
            break;
        case 'pending':
            filteredEvents = filteredEvents.filter(e => e.callStatus === '🟡Скоро');
            break;
        default:
            break;
    }
    
    // Фильтр по поисковому запросу (по названию)
    if (currentSearchQuery.trim()) {
        const query = currentSearchQuery.trim().toLowerCase();
        filteredEvents = filteredEvents.filter(e => 
            e.name.toLowerCase().includes(query)
        );
    }
    
    const resultsCount = filteredEvents.length;
    
    container.innerHTML = `
        <div class="page-header">
            <h2>📅 Таблица мероприятий</h2>
        </div>
        
        <!-- ПОИСКОВАЯ СИСТЕМА -->
        <div class="search-container">
            <div class="search-input-wrapper">
                <input type="text" id="searchEventsInput" placeholder="🔍 Поиск по названию ивента..." value="${escapeHtml(currentSearchQuery)}">
            </div>
            <div class="search-filters">
                <button class="search-filter-btn ${currentSearchFilter === 'all' ? 'active' : ''}" data-filter="all">📋 Все ивенты</button>
                ${currentUser ? `<button class="search-filter-btn ${currentSearchFilter === 'my' ? 'active' : ''}" data-filter="my">👤 Мои ивенты</button>` : ''}
                <button class="search-filter-btn ${currentSearchFilter === 'approved' ? 'active' : ''}" data-filter="approved">✅ Одобренные</button>
                <button class="search-filter-btn ${currentSearchFilter === 'pending' ? 'active' : ''}" data-filter="pending">🟡 На ожидании</button>
                <button class="search-filter-btn ${currentSearchFilter === 'rejected' ? 'active' : ''}" data-filter="rejected">🔴 Отказанные</button>
            </div>
            <div class="search-results-count" id="searchResultsCount">
                📊 Найдено: ${resultsCount}
            </div>
        </div>
        
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ИВЕНТ</th>
                        <th>ОРГАНИЗАТОР</th>
                        <th>ПОМОЩНИКИ</th>
                        <th>ДАТА</th>
                        <th>СТАТУС</th>
                        <th>ПРИЗОВЫЕ</th>
                        <th>УЧАСТНИКИ</th>
                        ${showActions ? '<th>ДЕЙСТВИЯ</th>' : ''}
                    </tr>
                </thead>
                <tbody id="eventsTableBody"></tbody>
            </table>
        </div>
    `;
    
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${showActions ? 8 : 7}" style="text-align:center; padding:40px;">🔍 Ничего не найдено</td></tr>`;
    } else {
        filteredEvents.forEach(event => {
            const row = tbody.insertRow();
            row.classList.add('clickable-row');
            row.setAttribute('data-type', 'event');
            row.setAttribute('data-id', event.id);
            row.insertCell(0).innerHTML = `<strong>${escapeHtml(event.name)}</strong>`;
            row.insertCell(1).textContent = event.organizer;
            row.insertCell(2).textContent = event.helpers;
            row.insertCell(3).textContent = event.date;
            row.insertCell(4).innerHTML = `<span class="status-badge status-active">${event.status}</span>`;
            row.insertCell(5).innerHTML = `<span class="rating-star">${event.rating}</span>`;
            row.insertCell(6).innerHTML = `<span style="font-weight:600;">${event.members}</span>`;
            row.insertCell(7).innerHTML = `<span style="background:var(--badge-bg); padding:0.2rem 0.6rem; border-radius:20px;">${event.callStatus}</span>`;
            
            if (showActions) {
                const cell = row.insertCell(8);
                const canModify = isEditor || (currentUser && currentUser === event.organizer);
                
                const statusButtons = isEditor ? `
                    <button class="status-change-btn btn-approved" data-id="${event.id}" data-status="✅Одобрен">✅ Одобрен</button>
                    <button class="status-change-btn btn-soon" data-id="${event.id}" data-status="🟡Скоро">🟡 Скоро</button>
                    <button class="status-change-btn btn-completed" data-id="${event.id}" data-status="🔴Отказано">🔴 Отказано</button>
                ` : '';
                
                const editButtons = canModify ? `
                    <button class="edit-event-btn" data-id="${event.id}" style="margin-top:5px;">Редактировать</button>
                    <button class="delete-event-btn" data-id="${event.id}" style="margin-top:5px;">Удалить</button>
                ` : '';
                
                cell.innerHTML = statusButtons + editButtons;
                
                if (canModify) {
                    const editBtn = cell.querySelector('.edit-event-btn');
                    const deleteBtn = cell.querySelector('.delete-event-btn');
                    
                    if (editBtn) {
                        editBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openEditEventModal(event.id);
                        });
                    }
                    
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (confirm('🗑️ Удалить ивент навсегда?')) {
                                deleteEventHandler(event.id);
                            }
                        });
                    }
                }
                
                if (isEditor) {
                    cell.querySelectorAll('.status-change-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            changeEventStatus(parseInt(btn.dataset.id), btn.dataset.status);
                        });
                    });
                }
            }
        });
    }
    
    attachRowClicks();
    
    // Навешиваем обработчики поиска
    const searchInput = document.getElementById('searchEventsInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            renderEventsTableWithSearch();
        });
    }
    
    document.querySelectorAll('.search-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSearchFilter = btn.dataset.filter;
            renderEventsTableWithSearch();
        });
    });
}

// Переопределяем renderEventsTable на новую версию с поиском
const originalRender = renderEventsTable;
renderEventsTable = function() {
    renderEventsTableWithSearch();
};

// Также обновляем refreshEventsData чтобы сохранить поиск
const originalRefresh = refreshEventsData;
refreshEventsData = async function() {
    const events = await loadEventsFromSheet();
    if (events && events.length > 0) {
        eventsData = events.map(e => ({
            id: e.id,
            name: e.name || 'Без названия',
            organizer: e.organizer || 'Неизвестно',
            helpers: e.helpers || 'Нет',
            date: e.date || 'Дата не указана',
            status: e.status || 'Проведен',
            rating: e.rating || '0$',
            members: parseInt(e.members) || 0,
            callStatus: e.callStatus || '🟡Скоро',
            fullDetails: { description: e.description || '' }
        }));
        saveAllData();
        renderEventsTableWithSearch(); // Используем новую версию
        const activeTab = document.querySelector('.nav-item.active')?.dataset.tab;
        if (activeTab === 'event_guidee') {
            document.querySelector('[data-tab="event_guidee"]')?.click();
        }
        showNotif('📊 Ивенты обновлены');
    } else {
        eventsData = [];
        renderEventsTableWithSearch();
    }
};

// Применяем при загрузке
setTimeout(() => {
    if (document.querySelector('[data-tab="events_table"]')?.classList.contains('active')) {
        renderEventsTableWithSearch();
    }
}, 100);

function loadStatusesFromSheet() {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_status_load_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('📥 Сырые данные из таблицы статусов:', data);
            
            // data приходит как массив объектов
            // Ожидаемая структура: [{ "ID ивента": 1, "Статус": "✅Одобрен", ... }]
            const result = Array.isArray(data) ? data : [];
            resolve(result);
        };
        
        script.src = `${GOOGLE_SHEETS_URL}?callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.error('❌ Ошибка загрузки статусов');
            resolve([]);
        };
        document.body.appendChild(script);
    });
}

async function loadAndApplyStatuses() {
    const statuses = await loadStatusesFromSheet();
    console.log('📊 Загруженные статусы из таблицы:', statuses);
    
    if (statuses && statuses.length > 0) {
        let updated = 0;
        
        statuses.forEach(item => {
            const eventId = parseInt(item['ID ивента']);
            let statusFromSheet = item['Статус'];
            
            if (eventId && statusFromSheet) {
                const event = eventsData.find(e => e.id === eventId);
                if (event) {
                    // ПРЯМО СТАВИМ ТО, ЧТО В ТАБЛИЦЕ
                    event.callStatus = statusFromSheet;
                    updated++;
                    console.log(`✅ Ивент ${eventId} (${event.name}): статус = ${statusFromSheet}`);
                } else {
                    console.log(`⚠️ Ивент с ID ${eventId} не найден`);
                }
            }
        });
        
        if (updated > 0) {
            saveAllData();
            renderEventsTable();
            showNotif(`✅ Обновлено ${updated} статусов`);
        } else {
            console.log('⚠️ Статусы не изменились');
        }
    } else {
        console.log('⚠️ Нет данных из таблицы статусов');
    }
}


async function initStatuses() {
    await loadAndApplyStatuses();
    renderEventsTable();
    console.log('Статусы загружены из Google Sheets');
}



initStatuses();

function refreshStatusesFromSheet() {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_status_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = async (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            
            console.log('📊 Получены статусы из таблицы:', data);
            
            let updated = false;
            if (Array.isArray(data) && data.length > 0) {
                for (const item of data) {
                    const eventId = parseInt(item['ID ивента']);
                    let newStatus = item['Статус'];
                    
                    // Нормализация статуса
                    let cleanStatus = newStatus;
                    if (newStatus === 'Одобрен' || newStatus === '✅Одобрен') cleanStatus = '✅Одобрен';
                    else if (newStatus === 'Отказано' || newStatus === '🔴Отказано') cleanStatus = '🔴Отказано';
                    else if (newStatus === 'Скоро' || newStatus === '🟡Скоро') cleanStatus = '🟡Скоро';
                    else cleanStatus = '🟡Скоро';
                    
                    const event = eventsData.find(e => e.id === eventId);
                    if (event && event.callStatus !== cleanStatus) {
                        event.callStatus = cleanStatus;
                        updated = true;
                        console.log(`✅ Обновлён статус ивента ${eventId}: ${event.name} → ${cleanStatus}`);
                    }
                }
            }
            
            if (updated) {
                saveAllData();
                renderEventsTable(); // Перерисовываем таблицу
                showNotif('📊 Статусы обновлены из таблицы');
            } else {
                console.log('⚠️ Статусы не изменились или таблица пуста');
                // Принудительно показываем текущие статусы
                renderEventsTable();
            }
            
            resolve(data);
        };
        
        script.src = `${GOOGLE_SHEETS_URL}?callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.error('❌ Ошибка загрузки статусов');
            resolve([]);
        };
        document.body.appendChild(script);
    });
}

// Проверка текущих статусов
function checkEventStatuses() {
    console.log('=== ТЕКУЩИЕ СТАТУСЫ ИВЕНТОВ ===');
    eventsData.forEach(event => {
        console.log(`ID: ${event.id}, Название: ${event.name}, Статус: ${event.callStatus}`);
    });
    
    // Также показываем в уведомлении
    const statusCount = {
        '✅Одобрен': 0,
        '🟡Скоро': 0,
        '🔴Отказано': 0
    };
    eventsData.forEach(e => {
        if (statusCount[e.callStatus] !== undefined) statusCount[e.callStatus]++;
        else statusCount['🟡Скоро']++;
    });
    
    showNotif(`📊 Статистика: Одобрено: ${statusCount['✅Одобрен']}, Ожидают: ${statusCount['🟡Скоро']}, Отказано: ${statusCount['🔴Отказано']}`);
    
    return statusCount;
}

// Вызовите в консоли для проверки:
// checkEventStatuses()

showImportButton();
initImportButton();

setInterval(() => {
    refreshStatusesFromSheet();
}, 180000);
    
function openEditEventModal(eventId) {
    const event = eventsData.find(ev => ev.id === eventId);
    if (!event) {
        console.error('Ивент не найден:', eventId);
        showNotif('❌ Ивент не найден', true);
        return;
    }
    
    const modal = document.getElementById('editEventModal');
    if (!modal) {
        console.error('Модалка editEventModal не найдена в DOM');
        showNotif('❌ Ошибка: модальное окно не найдено', true);
        return;
    }
    
    // Заполняем поля
    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventName').value = event.name || '';
    document.getElementById('editEventDescription').value = event.fullDetails?.description || '';
    document.getElementById('editEventDate').value = event.date || '';
    document.getElementById('editEventRating').value = event.rating || '';
    document.getElementById('editEventMembers').value = event.members || '';
    
    // ИСПРАВЛЕНО: helpers - это помощники, а organizer - это организатор
    document.getElementById('editEventHelpers').value = event.helpers || '';  // ПОМОЩНИКИ
    
    // Показываем модалку
    modal.style.display = 'flex';
}



async function deleteEventHandler(eventId) {
    if (!confirm('🗑️ Удалить ивент навсегда? Это действие нельзя отменить!')) {
        return;
    }
    
    // ========== СОХРАНЯЕМ ДАННЫЕ ДО УДАЛЕНИЯ ==========
    const eventToDelete = eventsData.find(e => e.id === eventId);
    if (!eventToDelete) {
        showNotif('❌ Ивент не найден', true);
        return;
    }
    // =================================================
    
    const result = await deleteEventFromSheet(eventId);
    if (result.success) {
        // ========== ОТПРАВЛЯЕМ ЛОГ ПОСЛЕ УСПЕШНОГО УДАЛЕНИЯ ==========
        await sendAuditLog('DELETE_EVENT', {
            eventId: eventId,
            name: eventToDelete.name,
            organizer: eventToDelete.organizer || eventToDelete.platform,
            date: eventToDelete.date,
            rating: eventToDelete.rating
        });
        // ============================================================
        
        showNotif('✅ Ивент удалён');
        await refreshEventsData();
        renderEventsTable();
    } else {
        showNotif('❌ Ошибка удаления: ' + (result.error || 'неизвестная ошибка'), true);
    }
}




// Глобальный обработчик кликов для кнопок (ОСНОВНОЙ)
document.addEventListener('click', function(e) {
    // Кнопка редактирования
    const editBtn = e.target.closest('.edit-event-btn');
    if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        const eventId = parseInt(editBtn.dataset.id);
        console.log('Редактирование ивента:', eventId);
        openEditEventModal(eventId);
        return;
    }
    
    // Кнопка удаления
    const deleteBtn = e.target.closest('.delete-event-btn');
    if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const eventId = parseInt(deleteBtn.dataset.id);
        console.log('Удаление ивента:', eventId);
        deleteEventHandler(eventId);
        return;
    }
});

// ========== ПОКАЗ СООБЩЕНИЯ О БАГАХ ПОСЛЕ КНОПКИ "ПРОДОЛЖИТЬ" ==========
let bugMessageActive = false;

// Функция для принудительного скрытия сообщения (если нужно)
function hideBugReportMessage() {
    const messageDiv = document.getElementById('bugMessageBlock');
    if (messageDiv) {
        messageDiv.remove();
        bugMessageActive = false;
    }
}

// Закрытие модалки редактирования
const closeEditModalBtn = document.getElementById('closeEditEventModal');
if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', function() {
        document.getElementById('editEventModal').style.display = 'none';
    });
}

// Закрытие по клику на фон
const editEventModal = document.getElementById('editEventModal');
if (editEventModal) {
    editEventModal.addEventListener('click', function(e) {
        if (e.target === editEventModal) {
            editEventModal.style.display = 'none';
        }
    });
}

// Сохранение изменений ивента
const saveEditBtn = document.getElementById('saveEditEventBtn');
if (saveEditBtn) {
    // Удаляем старые обработчики
    const newSaveBtn = saveEditBtn.cloneNode(true);
    saveEditBtn.parentNode.replaceChild(newSaveBtn, saveEditBtn);
    
    newSaveBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔵 Кнопка СОХРАНИТЬ нажата');
        
        const eventId = parseInt(document.getElementById('editEventId').value);
        const name = document.getElementById('editEventName').value.trim();
        const description = document.getElementById('editEventDescription').value.trim();
        const date = document.getElementById('editEventDate').value.trim();
        const rating = document.getElementById('editEventRating').value.trim();
        const members = document.getElementById('editEventMembers').value.trim();
        const helpers = document.getElementById('editEventHelpers').value.trim();
        
        if (!name) {
            showNotif('❌ Название ивента обязательно!', true);
            this.classList.add('error');
            setTimeout(() => this.classList.remove('error'), 500);
            return;
        }
        
        // Сохраняем старые данные
        const oldEvent = eventsData.find(e => e.id === eventId);
        const oldStatus = oldEvent ? oldEvent.callStatus : null;
        
        this.disabled = true;
        this.textContent = '💾 Сохранение...';
        this.classList.add('loading');
        
        try {
            // Обновляем в Google Sheets
            const result = await updateEventInSheet({
                id: eventId,
                name: name,
                description: description,
                date: date,
                rating: rating,
                members: members,
                helpers: helpers
            });
            
            console.log('📥 Результат сохранения:', result);
            
            if (result && result.success) {
                // Обновляем локальные данные БЕЗ СБРОСА СТАТУСА
                const eventIndex = eventsData.findIndex(e => e.id === eventId);
                if (eventIndex !== -1) {
                    eventsData[eventIndex] = {
                        ...eventsData[eventIndex],
                        name: name,
                        organizer: eventsData[eventIndex].organizer,
                        helpers: helpers,
                        date: date,
                        rating: rating,
                        members: parseInt(members) || 0,
                        fullDetails: { ...eventsData[eventIndex].fullDetails, description: description }
                    };
                    // ВАЖНО: НЕ ТРОГАЕМ callStatus!
                }
                
                this.classList.remove('loading');
                this.classList.add('success');
                this.textContent = '✅ Сохранено!';
                
                document.getElementById('editEventModal').style.display = 'none';
                
                // Отправляем лог
                if (oldEvent) {
                    await sendAuditLog('EDIT_EVENT', 
                        { eventId: eventId, name: name },
                        { 
                            name: oldEvent.name,
                            description: oldEvent.fullDetails?.description,
                            date: oldEvent.date,
                            rating: oldEvent.rating,
                            members: oldEvent.members,
                            helpers: oldEvent.helpers
                        },
                        {
                            name: name,
                            description: description,
                            date: date,
                            rating: rating,
                            members: members,
                            helpers: helpers
                        }
                    );
                }
                
                // Просто перерисовываем таблицу, НЕ перезагружаем данные
                renderEventsTable();
                showNotif(`✅ Ивент "${name}" успешно сохранён!`);
                
                // Обновляем норму, если открыта
                const activeTab = document.querySelector('.nav-item.active')?.dataset.tab;
                if (activeTab === 'event_guidee') {
                    document.querySelector('[data-tab="event_guidee"]')?.click();
                }
                
                setTimeout(() => {
                    this.classList.remove('success');
                    this.textContent = '💾 Сохранить';
                }, 1500);
                
            } else {
                throw new Error(result?.error || 'Неизвестная ошибка');
            }
            
        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.classList.remove('loading');
            this.classList.add('error');
            this.textContent = '❌ Ошибка!';
            showNotif(`❌ Ошибка сохранения: ${error.message}`, true);
            
            setTimeout(() => {
                this.classList.remove('error');
                this.textContent = '💾 Сохранить';
            }, 2000);
        } finally {
            this.disabled = false;
        }
    });
}

// ========== УВЕДОМЛЕНИЕ ПРИ ВХОДЕ ==========

// Функция для показа уведомления о настройках
function showSettingsNotification() {
    setTimeout(() => {
        addNotif(
            '⚙️ Настройки профиля', 
            'Вы можете изменить задний фон или яркость, нажав сверху слева на аватарку'
        );
    }, 1500); // Показываем через 1.5 секунды после входа
}

// Перехватываем вход в систему
const originalDoLogin = doLogin;
if (originalDoLogin) {
    window.doLogin = async function() {
        const result = await originalDoLogin();
        if (result !== false && currentUser) {
            showSettingsNotification();
        }
        return result;
    };
}

// Также проверяем при загрузке страницы если пользователь уже вошёл
if (currentUser) {
    showSettingsNotification();
}

// ========== ПЕРЕХВАТ ДЕЙСТВИЙ ДЛЯ УВЕДОМЛЕНИЙ ==========
setTimeout(() => {
    // Изменение статуса
    const originalChange = changeEventStatus;
    if (originalChange) {
        window.changeEventStatus = function(eventId, newStatus) {
            const event = eventsData?.find(e => e.id === eventId);
            if (event) addNotif('🔄 Статус ивента', `"${event.name}" → ${newStatus}`);
            return originalChange(eventId, newStatus);
        };
    }
    
    // Удаление ивента
    const originalDelete = deleteEventHandler;
    if (originalDelete) {
        window.deleteEventHandler = async function(eventId) {
            const event = eventsData?.find(e => e.id === eventId);
            if (event) addNotif('🗑️ Удаление ивента', `"${event.name}" удалён`);
            return originalDelete(eventId);
        };
    }
    
    // Добавление комментария
    const originalAddComm = addComment;
    if (originalAddComm) {
        window.addComment = async function(eventId, userName, text) {
            addNotif('💬 Новый комментарий', `${userName}: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`);
            return originalAddComm(eventId, userName, text);
        };
    }
    
    // Смена фона
    const bgOpts = document.querySelectorAll('.bg-option');
    bgOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const bgName = opt.querySelector('span')?.textContent || 'новый фон';
            addNotif('🖼️ Смена фона', `Выбран фон: "${bgName}"`);
        });
    });
    
    // Сохранение настроек
    const settingsBtn = document.getElementById('saveSettingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const brightness = document.getElementById('brightnessSlider')?.value;
            addNotif('⚙️ Настройки', `Сохранены (яркость: ${brightness}%)`);
        });
    }
    
    console.log('✅ Все действия подключены к уведомлениям!');
}, 1000);

// ========== СТИЛИ КНОПОК (2 ВИДА, НЕ ЦВЕТА!) ==========

// Вид 1: Закруглённые мягкие кнопки
const buttonStyle1 = `
    .action-btn {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 40px;
        padding: 8px 18px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s ease;
        font-size: 0.8rem;
        backdrop-filter: blur(8px);
    }
    .action-btn:hover {
        background: rgba(255,255,255,0.18);
        transform: translateY(-2px);
        border-color: rgba(255,255,255,0.3);
    }
    .action-btn:active {
        transform: translateY(0);
    }
    .action-btn-primary {
        background: linear-gradient(135deg, rgba(108,92,231,0.3), rgba(168,85,247,0.3));
        border-color: rgba(168,85,247,0.5);
    }
    .action-btn-primary:hover {
        background: linear-gradient(135deg, rgba(108,92,231,0.5), rgba(168,85,247,0.5));
    }
    .action-btn-danger {
        background: linear-gradient(135deg, rgba(244,67,54,0.2), rgba(211,47,47,0.2));
        border-color: rgba(244,67,54,0.4);
    }
    .action-btn-danger:hover {
        background: linear-gradient(135deg, rgba(244,67,54,0.35), rgba(211,47,47,0.35));
    }
`;

// Вид 2: Прямоугольные строгие кнопки
const buttonStyle2 = `
    .action-btn {
        background: rgba(0,0,0,0.4);
        border: none;
        border-radius: 8px;
        padding: 8px 18px;
        color: #ddd;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .action-btn:hover {
        background: rgba(0,0,0,0.6);
        color: white;
        transform: scale(0.98);
    }
    .action-btn-primary {
        background: #2c3e50;
        color: white;
    }
    .action-btn-primary:hover {
        background: #1a252f;
    }
    .action-btn-danger {
        background: #c0392b;
        color: white;
    }
    .action-btn-danger:hover {
        background: #a93226;
    }
`;

let currentButtonStyle = localStorage.getItem('buttonDesign') || 'style1';

// Применить стиль ко всем кнопкам
function applyGlobalButtonStyle() {
    const styleId = 'globalButtonStyle';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = currentButtonStyle === 'style1' ? buttonStyle1 : buttonStyle2;
}

// Переключить стиль
function switchButtonStyle() {
    currentButtonStyle = currentButtonStyle === 'style1' ? 'style2' : 'style1';
    localStorage.setItem('buttonDesign', currentButtonStyle);
    applyGlobalButtonStyle();
    addNotification('Стиль кнопок', `Выбран ${currentButtonStyle === 'style1' ? 'мягкий закруглённый' : 'строгий прямоугольный'} стиль`, 'info');
}



// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    applyGlobalButtonStyle();
    
    // Кнопка уведомлений
    const notifBtn = document.getElementById('notificationTopBtn');
    const dropdown = document.getElementById('notificationDropdown');
    const clearBtn = document.getElementById('clearNotificationsBtn');
    
    if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearAllNotifications();
            addNotification('Уведомления', 'Все уведомления очищены', 'info');
        });
    }
    
    // Закрытие при клике вне
    document.addEventListener('click', () => {
        if (dropdown) dropdown.classList.remove('show');
    });
    
    if (dropdown) {
        dropdown.addEventListener('click', (e) => e.stopPropagation());
    }
    
    // Добавляем уведомление при входе в систему
    const originalDoLogin = doLogin;
    window.doLogin = async function() {
        const result = await originalDoLogin();
        if (currentUser) {
            addNotification('Вход в систему', `Пользователь ${currentUser} вошёл в панель управления`, 'success');
        }
        return result;
    };
});



const switchBtn = document.getElementById('switchButtonStyleBtn');
if (switchBtn) {
    switchBtn.addEventListener('click', switchButtonStyle);
    const styleText = document.getElementById('currentStyleText');
    if (styleText) {
        styleText.textContent = currentButtonStyle === 'style1' ? 'мягкий закруглённый' : 'строгий прямоугольный';
    }
}

// Добавляем уведомление при логауте
const originalLogout = logout;
window.logout = function() {
    addNotification('Выход из системы', `Пользователь ${currentUser} вышел из панели`, 'info');
    originalLogout();
};

(function() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    

    const PARTICLE_COUNT = 120;        
    const COLORS = ['#ff66cc', '#c9a0ff', '#ff99ff', '#ff66aa', '#d4b8ff', '#ff88dd'];
    const MOUSE_RADIUS = 100;          
    
    let particles = [];
    let mouseX = null, mouseY = null;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.6 + 0.3;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.05;
            this.sizePulse = Math.random() * 0.05 + 0.02;
            this.pulseDir = 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            this.size += this.sizePulse * this.pulseDir;
            if (this.size > 6) this.pulseDir = -1;
            if (this.size < 2) this.pulseDir = 1;
            
            this.angle += this.angleSpeed;
            
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 3;
                    this.y += Math.sin(angle) * force * 3;
                }
            }
            
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const radius = this.size * (i % 2 === 0 ? 1 : 0.5);
                const x = Math.cos(i * 72 * Math.PI / 180) * radius;
                const y = Math.sin(i * 72 * Math.PI / 180) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.globalAlpha = this.alpha * 0.5;
            ctx.fill();
            
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let p of particles) {
            p.update();
            p.draw();
        }
        
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].color;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        
        requestAnimationFrame(animateParticles);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();

    
})();

// ========== КАСТОМНЫЙ КУРСОР ==========
(function() {
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    
    if (!cursor || !cursorDot) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.2)';
        cursor.style.transition = 'transform 0.1s ease';
        cursorDot.style.transition = 'transform 0.1s ease';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.transition = 'transform 0.15s ease-out';
        cursorDot.style.transition = 'transform 0.15s ease-out';
    });
    
    const clickables = document.querySelectorAll('a, button, .clickable-row, .clickable-card, .nav-item, .status-change-btn, .comment-send-btn, .continue-btn, .login-btn, .submit-btn, .close-modal, .settings-save, .logout-btn');
    
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    document.body.style.cursor = 'none';
})();

// ========== КНОПКА 67 ==========
function play67Track() {
    const audio = new Audio();
    audio.src = 'https://videotourl.com/audio/1776950054502-7076b567-2429-4db8-8053-ece161ff38ac.mp3';
    audio.volume = 0.7;
    showNotif('Вам конец, ребенок 67 взломал вас');
    audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        showNotif('Успешный взлом!');
    }, 6000);
}

const play67Btn = document.getElementById('play67FooterBtn');
if (play67Btn) {
    play67Btn.addEventListener('click', play67Track);
}

// ========== КНОПКА УПРАВЛЕНИЯ ТИКЕТАМИ ==========
const ticketsEditorBtn = document.getElementById('ticketsEditorBtn');
if (ticketsEditorBtn) {
    ticketsEditorBtn.addEventListener('click', () => {
        console.log('Кнопка нажата!');
        renderTicketsEditor();
    });
} else {
    console.log('Кнопка ticketsEditorBtn НЕ НАЙДЕНА');
}

// ========== УПРАВЛЕНИЕ КОМАНДОЙ ==========
const manageTeamBtn = document.getElementById('manageTeamBtn');
const addTeamMemberModal = document.getElementById('addTeamMemberModal');
const closeTeamMemberModal = document.getElementById('closeTeamMemberModal');
const saveTeamMemberBtn = document.getElementById('saveTeamMemberBtn');

// Открытие модального окна добавления участника
if (manageTeamBtn) {
    manageTeamBtn.addEventListener('click', () => {
        if (!isEditor) {
            showNotif('❌ Нет прав для управления командой', true);
            return;
        }
        // Очищаем поля
        document.getElementById('teamMemberName').value = '';
        document.getElementById('teamMemberRole').value = '';
        document.getElementById('teamMemberDiscord').value = '';
        document.getElementById('teamMemberAvatar').value = '';
        document.getElementById('teamMemberJoinDate').value = '';
        document.getElementById('teamMemberRating').value = '';
        document.getElementById('teamMemberCategory').value = 'Младший состав';
        document.getElementById('teamMemberStatus').value = 'Онлайн';
        addTeamMemberModal.style.display = 'flex';
    });
}

// Закрытие модального окна
if (closeTeamMemberModal) {
    closeTeamMemberModal.addEventListener('click', () => {
        addTeamMemberModal.style.display = 'none';
    });
}

// Закрытие по клику на фон
if (addTeamMemberModal) {
    addTeamMemberModal.addEventListener('click', (e) => {
        if (e.target === addTeamMemberModal) {
            addTeamMemberModal.style.display = 'none';
        }
    });
}

// Сохранение нового участника
if (saveTeamMemberBtn) {
    // Удаляем старые обработчики
    const newSaveBtn = saveTeamMemberBtn.cloneNode(true);
    saveTeamMemberBtn.parentNode.replaceChild(newSaveBtn, saveTeamMemberBtn);
    
    newSaveBtn.addEventListener('click', async () => {
        console.log('🔵 Кнопка "Добавить участника" нажата');
        
        const name = document.getElementById('teamMemberName')?.value.trim();
        const role = document.getElementById('teamMemberRole')?.value.trim();
        const discord = document.getElementById('teamMemberDiscord')?.value.trim();
        let avatar = document.getElementById('teamMemberAvatar')?.value.trim();
        const joinDate = document.getElementById('teamMemberJoinDate')?.value.trim();
        const rating = document.getElementById('teamMemberRating')?.value.trim();
        const category = document.getElementById('teamMemberCategory')?.value;
        const status = document.getElementById('teamMemberStatus')?.value;
        const steamId = document.getElementById('teamMemberSteamId')?.value.trim();
        
        console.log('📝 Данные из формы:', { name, role, discord, steamId, avatar, joinDate, rating, category, status });
        
        // Валидация
        if (!name) {
            showNotif('❌ Введите никнейм!', true);
            return;
        }
        if (!role) {
            showNotif('❌ Введите роль!', true);
            return;
        }
        if (!discord) {
            showNotif('❌ Введите Discord ID!', true);
            return;
        }
        if (!joinDate) {
            showNotif('❌ Введите дату вступления!', true);
            return;
        }
        if (!rating) {
            showNotif('❌ Введите ранг!', true);
            return;
        }
        
        if (!avatar) {
            avatar = "https://i.imgur.com/IAIJe65.png";
        }
        
        avatarMap[name] = avatar;
        
        newSaveBtn.disabled = true;
        newSaveBtn.textContent = '⏳ Добавление...';
        
        try {
            const result = await addMemberToSheet({
                name: name,
                role: role,
                discord: discord,
                steamId: steamId || '',
                avatar: avatar,
                joinDate: joinDate,
                rating: rating,
                category: category,
                status: status
            });
            
            console.log('📥 Результат:', result);
            
            if (result && result.success) {
                showNotif(`✅ Участник ${name} добавлен!`);
                
                await sendAuditLog('ADD_MEMBER', {
                    name: name,
                    role: role,
                    rating: rating,
                    category: category
                });
                
                addTeamMemberModal.style.display = 'none';
                
                // Очищаем форму
                document.getElementById('teamMemberName').value = '';
                document.getElementById('teamMemberRole').value = '';
                document.getElementById('teamMemberDiscord').value = '';
                document.getElementById('teamMemberAvatar').value = '';
                document.getElementById('teamMemberJoinDate').value = '';
                document.getElementById('teamMemberRating').value = '';
                document.getElementById('teamMemberSteamId').value = '';
                
                // Обновляем отображение
                await refreshTeamData();
                renderTeamTable();
            } else {
                const errorMsg = result?.error || 'неизвестная ошибка';
                showNotif(`❌ Ошибка: ${errorMsg}`, true);
            }
        } catch (error) {
            console.error('❌ Исключение:', error);
            showNotif(`❌ Ошибка: ${error.message}`, true);
        } finally {
            newSaveBtn.disabled = false;
            newSaveBtn.textContent = '➕ Добавить участника';
        }
    });
}

function updateMemberInSheet(memberData) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_update_member_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('Ответ сервера при обновлении участника:', data);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'updateMember',
            id: memberData.id,
            name: memberData.name,
            role: memberData.role,
            discord: memberData.discord,
            steamId: memberData.steamId || '',  // 👈 ДОБАВЬ
            avatar: memberData.avatar,
            joinDate: memberData.joinDate,
            rating: memberData.rating,
            category: memberData.category,
            status: memberData.status,
            callback: callbackName
        });
        
        script.src = `${COMMENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}

// Удаление участника из Google Sheets
function deleteMemberFromSheet(memberId, memberName) {
    return new Promise((resolve) => {
        const callbackName = 'jsonp_delete_member_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const script = document.createElement('script');
        
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            console.log('Ответ сервера при удалении участника:', data);
            resolve(data);
        };
        
        const params = new URLSearchParams({
            action: 'deleteMember',
            id: memberId,
            name: memberName,
            callback: callbackName
        });
        
        script.src = `${COMMENTS_API_URL}?${params.toString()}`;
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve({ success: false, error: 'Network error' });
        };
        document.body.appendChild(script);
    });
}



// ========== МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ УЧАСТНИКА ==========
const editTeamMemberModal = document.getElementById('editTeamMemberModal');
const closeEditTeamMemberModal = document.getElementById('closeEditTeamMemberModal');
const saveEditMemberBtn = document.getElementById('saveEditMemberBtn');
const deleteMemberBtn = document.getElementById('deleteMemberBtn');

async function openEditMemberModal(memberId) {
    const member = teamData.find(m => m.id === memberId);
    if (!member) {
        showNotif('❌ Участник не найден', true);
        return;
    }
    
    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberRole').value = member.role;
    document.getElementById('editMemberDiscord').value = member.discord;
    document.getElementById('editMemberSteamId').value = member.steamId || '';  // 👈 ДОБАВЬ
    document.getElementById('editMemberAvatar').value = avatarMap[member.name] || '';
    document.getElementById('editMemberJoinDate').value = member.joinDate;
    document.getElementById('editMemberRating').value = member.rating;
    document.getElementById('editMemberCategory').value = member.category;
    document.getElementById('editMemberStatus').value = member.status;
    
    editTeamMemberModal.style.display = 'flex';
} 

// Закрытие модалки редактирования
if (closeEditTeamMemberModal) {
    closeEditTeamMemberModal.addEventListener('click', () => {
        editTeamMemberModal.style.display = 'none';
    });
}

// Закрытие по клику на фон
if (editTeamMemberModal) {
    editTeamMemberModal.addEventListener('click', (e) => {
        if (e.target === editTeamMemberModal) {
            editTeamMemberModal.style.display = 'none';
        }
    });
}

// Сохранение изменений участника
if (saveEditMemberBtn) {
    saveEditMemberBtn.addEventListener('click', async () => {
        const memberId = parseInt(document.getElementById('editMemberId').value);
        const oldMember = teamData.find(m => m.id === memberId);
        
        const name = document.getElementById('editMemberName').value.trim();
        const role = document.getElementById('editMemberRole').value.trim();
        const discord = document.getElementById('editMemberDiscord').value.trim();
        let avatar = document.getElementById('editMemberAvatar').value.trim();
        const joinDate = document.getElementById('editMemberJoinDate').value.trim();
        const rating = document.getElementById('editMemberRating').value.trim();
        const category = document.getElementById('editMemberCategory').value;
        const status = document.getElementById('editMemberStatus').value;
        
        // Валидация
        if (!name) {
            showNotif('❌ Введите никнейм!', true);
            return;
        }
        if (!role) {
            showNotif('❌ Введите роль!', true);
            return;
        }
        if (!discord) {
            showNotif('❌ Введите Discord ID!', true);
            return;
        }
        if (!joinDate) {
            showNotif('❌ Введите дату вступления!', true);
            return;
        }
        if (!rating) {
            showNotif('❌ Введите ранг!', true);
            return;
        }
        
        // Если аватарка не указана, используем дефолтную
        if (!avatar) {
            avatar = "https://i.imgur.com/IAIJe65.png";
        }
        
        // Обновляем аватарку в avatarMap
        if (oldMember && oldMember.name !== name) {
            delete avatarMap[oldMember.name];
        }
        avatarMap[name] = avatar;
        
        saveEditMemberBtn.disabled = true;
        saveEditMemberBtn.textContent = '⏳ Сохранение...';
        
        // Формируем список изменений для лога
        let changesList = [];
        if (oldMember.name !== name) changesList.push(`Имя: "${oldMember.name}" → "${name}"`);
        if (oldMember.role !== role) changesList.push(`Роль: "${oldMember.role}" → "${role}"`);
        if (oldMember.discord !== discord) changesList.push(`Discord: ${oldMember.discord} → ${discord}`);
        if (oldMember.joinDate !== joinDate) changesList.push(`Дата: ${oldMember.joinDate} → ${joinDate}`);
        if (oldMember.rating !== rating) changesList.push(`Ранг: "${oldMember.rating}" → "${rating}"`);
        if (oldMember.category !== category) changesList.push(`Категория: ${oldMember.category === 'Старший состав' ? '👑' : '🌟'} → ${category === 'Старший состав' ? '👑' : '🌟'}`);
        if (oldMember.status !== status) changesList.push(`Статус: ${oldMember.status} → ${status}`);
        
        try {
            const steamId = document.getElementById('editMemberSteamId').value.trim();  // 👈 ДОБАВЬ

            // Потом в объект для отправки:
            const result = await updateMemberInSheet({
                id: memberId,
                name: name,
                role: role,
                discord: discord,
                steamId: steamId,  // 👈 ДОБАВЬ
                avatar: avatar,
                joinDate: joinDate,
                rating: rating,
                category: category,
                status: status
            });
            
            if (result.success) {
                showNotif(`✅ Данные участника ${name} обновлены!`);
                
                // Отправляем лог в аудит
                if (changesList.length > 0) {
                    await sendAuditLog('EDIT_MEMBER', {
                        name: name,
                        changes: changesList.join('; ')
                    });
                }
                
                // Закрываем модалку
                editTeamMemberModal.style.display = 'none';
                
                // Обновляем данные команды
                await refreshTeamData();
                
                // Обновляем отображение
                renderTeamTable();
            } else {
                showNotif(`❌ Ошибка: ${result.error || 'неизвестная ошибка'}`, true);
            }
        } catch (error) {
            console.error('Ошибка обновления участника:', error);
            showNotif('❌ Ошибка соединения с сервером', true);
        } finally {
            saveEditMemberBtn.disabled = false;
            saveEditMemberBtn.textContent = '💾 Сохранить изменения';
        }
    });
}

// Удаление участника
if (deleteMemberBtn) {
    deleteMemberBtn.addEventListener('click', async () => {
        const memberId = parseInt(document.getElementById('editMemberId').value);
        const memberName = document.getElementById('editMemberName').value.trim();
        
        if (!confirm(`🗑️ Вы уверены, что хотите удалить участника "${memberName}" из команды? Это действие нельзя отменить!`)) {
            return;
        }
        
        deleteMemberBtn.disabled = true;
        deleteMemberBtn.textContent = '⏳ Удаление...';
        
        try {
            const result = await deleteMemberFromSheet(memberId, memberName);
            
            if (result.success) {
                showNotif(`✅ Участник ${memberName} удалён из команды!`);
                
                // Отправляем лог в аудит
                await sendAuditLog('DELETE_MEMBER', {
                    name: memberName,
                    role: 'участник команды'
                });
                
                // Удаляем аватарку из avatarMap
                delete avatarMap[memberName];
                
                // Закрываем модалку
                editTeamMemberModal.style.display = 'none';
                
                // Обновляем данные команды
                await refreshTeamData();
                
                // Обновляем отображение
                renderTeamTable();
            } else {
                showNotif(`❌ Ошибка удаления: ${result.error || 'неизвестная ошибка'}`, true);
            }
        } catch (error) {
            console.error('Ошибка удаления участника:', error);
            showNotif('❌ Ошибка соединения с сервером', true);
        } finally {
            deleteMemberBtn.disabled = false;
            deleteMemberBtn.textContent = '🗑️ Удалить';
        }
    });
}

function showBugReportMessage() {
    console.log('🟢 Показываем сообщение о багах');
    
    // Если сообщение уже показано - не создаём новое
    if (bugMessageActive) {
        console.log('⚠️ Сообщение уже показано');
        return;
    }
    
    const welcomeCard = document.querySelector('.welcome-card');
    if (!welcomeCard) {
        console.log('❌ welcome-card не найден');
        return;
    }
    
    // Удаляем старое сообщение, если есть
    const oldMessage = document.getElementById('bugMessageBlock');
    if (oldMessage) oldMessage.remove();
    
    // Создаем блок с сообщением
    const messageDiv = document.createElement('div');
    messageDiv.id = 'bugMessageBlock';
    messageDiv.style.cssText = `
        margin: 20px 0 15px 0;
        padding: 20px 16px;
        background: linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3));
        border-radius: 24px;
        border: 1px solid rgba(255,170,68,0.4);
        text-align: center;
        animation: fadeInUp 0.4s ease;
        backdrop-filter: blur(8px);
    `;
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 12px;">
            <svg class="icon" style="fill:#c9a0ff; width: 55px; height: 55px;">
                <use href="#ic-eagle"/>
            </svg>
        </div>
        <div style="font-size: 0.95rem; color: #ffd6aa; margin-bottom: 8px;">
            ⚠️ Если нашли баг или ошибку
        </div>
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 15px;">
            Пишите <span style="color: #ffaa44; text-decoration: underline;">T1Ran</span> в Discord ➜ 🎫
        </div>
        <button id="closeBugMessageBtn" style="
            background: linear-gradient(95deg, rgba(85,85,85,0.6), rgba(51,51,51,0.6));
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 40px;
            padding: 8px 24px;
            color: white;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            backdrop-filter: blur(8px);
        ">✕ Понятно, закрыть</button>
    `;
    
    // Находим кнопку "Продолжить" и вставляем ПЕРЕД НЕЙ
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        welcomeCard.insertBefore(messageDiv, continueBtn);
        console.log('✅ Сообщение вставлено перед кнопкой');
    } else {
        welcomeCard.appendChild(messageDiv);
        console.log('✅ Сообщение вставлено в конец');
    }
    
    bugMessageActive = true;
    
    // Обработчик для кнопки закрытия
    const closeBtn = document.getElementById('closeBugMessageBtn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-15px)';
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.remove();
                    bugMessageActive = false;
                }
            }, 300);
        };
    }
}

// ========== ПРИНУДИТЕЛЬНАЯ УСТАНОВКА ФОНА ==========
setTimeout(function() {
    const bgElement = document.getElementById('moving-bg');
    if (bgElement) {
        bgElement.style.backgroundImage = "url('https://i.imgur.com/xp9Z6zO.jpeg')";
        bgElement.style.backgroundSize = "cover";
        bgElement.style.backgroundPosition = "center";
        bgElement.style.backgroundRepeat = "no-repeat";
        bgElement.style.filter = "blur(0px)";
        bgElement.style.opacity = "1";
        console.log('✅ Фон установлен принудительно');
    }
    
    const overlayElement = document.getElementById('bg-overlay');
    if (overlayElement) {
        overlayElement.style.display = "none";
    }
    
    const dashboardElement = document.getElementById('mainDashboard');
    if (dashboardElement) {
        dashboardElement.style.background = "transparent";
    }
}, 100);

// ========== ФИКС ФОНА (РАБОЧАЯ ВЕРСИЯ) ==========
(function fixBackground() {
    setTimeout(function() {
        const movingBg = document.getElementById('moving-bg');
        if (movingBg) {
            movingBg.style.backgroundImage = "url('https://i.imgur.com/xp9Z6zO.jpeg')";
            movingBg.style.backgroundSize = "cover";
            movingBg.style.backgroundPosition = "center";
            movingBg.style.backgroundRepeat = "no-repeat";
            movingBg.style.filter = "blur(0px)";
            movingBg.style.opacity = "1";
            console.log('✅ ФОН УСТАНОВЛЕН');
        } else {
            console.log('❌ #moving-bg не найден');
        }
        
        const bgOverlay = document.getElementById('bg-overlay');
        if (bgOverlay) {
            bgOverlay.style.display = "none";
        }
        
        const dashboardEl = document.getElementById('mainDashboard');
        if (dashboardEl) {
            dashboardEl.style.background = "transparent";
        }
    }, 100);
})();

// ========== АВТОМАТИЧЕСКАЯ УСТАНОВКА ФОНА ==========
(function autoFixBackground() {
    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBackgroundFix);
    } else {
        applyBackgroundFix();
    }
    
    function applyBackgroundFix() {
        setTimeout(function() {
            const movingBg = document.getElementById('moving-bg');
            if (movingBg) {
                movingBg.style.backgroundImage = "url('https://i.imgur.com/xp9Z6zO.jpeg')";
                movingBg.style.backgroundSize = "cover";
                movingBg.style.backgroundPosition = "center";
                movingBg.style.backgroundRepeat = "no-repeat";
                movingBg.style.filter = "blur(0px)";
            }
            
            const bgOverlay = document.getElementById('bg-overlay');
            if (bgOverlay) {
                bgOverlay.style.display = "none";
            }
            
            const dashboard = document.getElementById('mainDashboard');
            if (dashboard) {
                dashboard.style.background = "transparent";
            }
            
            console.log('✅ Фон автоматически установлен');
        }, 50);
    }
})();

// ========== ФИКС ЧЁРНОГО ФОНА ПОСЛЕ ВХОДА ==========
(function fixBlackBackground() {
    // Функция, которая возвращает прозрачный фон
    function makeBackgroundTransparent() {
        const dashboard = document.getElementById('mainDashboard');
        if (dashboard) {
            dashboard.style.background = 'transparent';
            dashboard.style.backgroundColor = 'transparent';
            dashboard.style.backdropFilter = 'none';
        }
        
        const movingBg = document.getElementById('moving-bg');
        if (movingBg) {
            movingBg.style.zIndex = '0';
            movingBg.style.opacity = '1';
        }
        
        const overlay = document.getElementById('bg-overlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    // Запускаем сразу
    makeBackgroundTransparent();
    
    // Следим за изменениями и возвращаем прозрачность если кто-то ставит чёрный фон
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const dashboard = document.getElementById('mainDashboard');
                if (dashboard && (dashboard.style.background !== 'transparent' || dashboard.style.backgroundColor !== 'transparent')) {
                    dashboard.style.background = 'transparent';
                    dashboard.style.backgroundColor = 'transparent';
                }
            }
        });
    });
    
    if (document.getElementById('mainDashboard')) {
        observer.observe(document.getElementById('mainDashboard'), { attributes: true });
    }
    
    // Дополнительная задержка для перехвата
    setTimeout(makeBackgroundTransparent, 100);
    setTimeout(makeBackgroundTransparent, 500);
    setTimeout(makeBackgroundTransparent, 1000);
})();



// ========== ТЕМЫ (СВЕТЛАЯ / ТЁМНАЯ) ==========
(function initThemes() {
    var themeBtns = document.querySelectorAll('.theme-btn');
    if (!themeBtns.length) return;
    
    themeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var theme = this.getAttribute('data-theme');
            document.body.classList.remove('light-mode');
            if (theme === 'light') {
                document.body.classList.add('light-mode');
            }
            localStorage.setItem('theme', theme);
            
            themeBtns.forEach(function(b) {
                b.style.border = '2px solid transparent';
            });
            this.style.border = '2px solid #888';
        });
    });
    
    // Загружаем сохранённую тему
    var savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// ========== ЦВЕТ ТЕКСТА ==========
(function initAccentColor() {
    var colorDots = document.querySelectorAll('.color-dot');
    if (!colorDots.length) return;
    
    function setTextColor(color) {
        // Меняем CSS-переменные
        document.documentElement.style.setProperty('--text-primary', color);
        document.documentElement.style.setProperty('--text-secondary', color);
        document.documentElement.style.setProperty('--accent', color);
        
        // Меняем цвет у всех span, div, p, td, th, h1-h4, label, strong, a
        var textElements = document.querySelectorAll('span, div, p, td, th, h1, h2, h3, h4, label, strong, a, .stat-value, .team-name, .comment-text, .nav-item span, .detail-row span, .page-header h2, .section-title, .team-info-value');
        textElements.forEach(function(el) {
            // Не трогаем кнопки, инпуты, иконки
            if (!el.closest('button') && !el.closest('input') && !el.closest('select') && !el.closest('textarea') && !el.closest('svg') && !el.closest('.icon') && !el.closest('.color-dot') && !el.closest('.theme-btn')) {
                el.style.color = color;
            }
        });
    }
    
    colorDots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var color = this.getAttribute('data-color');
            setTextColor(color);
            localStorage.setItem('accentColor', color);
            
            // Обновляем обводку у всех точек
            colorDots.forEach(function(d) {
                var dotColor = d.getAttribute('data-color');
                if (dotColor === '#ffffff') {
                    d.style.border = '3px solid rgba(0,0,0,0.3)';
                } else if (dotColor === '#1a1a1a') {
                    d.style.border = '3px solid rgba(255,255,255,0.3)';
                } else {
                    d.style.border = '3px solid transparent';
                }
            });
            
            // Активная точка
            if (color === '#ffffff') {
                this.style.border = '3px solid #000';
            } else if (color === '#1a1a1a') {
                this.style.border = '3px solid #fff';
            } else {
                this.style.border = '3px solid #fff';
            }
        });
    });
    
    // Загружаем сохранённый цвет
    var savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        setTextColor(savedColor);
    }
})();

// ========== ПРОЗРАЧНОСТЬ БЛОКОВ ==========
(function initOpacity() {
    var slider = document.getElementById('opacitySlider');
    if (!slider) return;
    
    function setOpacity(value) {
        var opacity = value / 100;
        var blocks = document.querySelectorAll('.sidebar, .table-wrapper, .modal-card, .team-card, .addon-card, .settings-card, .welcome-card, .login-modal');
        blocks.forEach(function(block) {
            block.style.opacity = opacity;
        });
        localStorage.setItem('opacity', value);
    }
    
    slider.addEventListener('input', function() {
        setOpacity(this.value);
    });
    
    // Загружаем сохранённое значение
    var savedOpacity = localStorage.getItem('opacity') || '100';
    slider.value = savedOpacity;
    setOpacity(savedOpacity);
})();

// ========== ПРИМЕНЯЕМ ЦВЕТ ПРИ ЗАГРУЗКЕ (ДУБЛЬ-ФИКС) ==========
document.addEventListener('DOMContentLoaded', function() {
    var savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--text-primary', savedColor);
        document.documentElement.style.setProperty('--text-secondary', savedColor);
        document.documentElement.style.setProperty('--accent', savedColor);
    }
});

// ========== СМЕНА ФОНА ==========
(function() {
    var bgUrls = {
        '1': 'https://i.imgur.com/MpiTIPp.jpeg',
        '2': 'https://i.imgur.com/5xGFarZ.png',
        '3': 'https://i.imgur.com/5251qqI.jpeg',
        '4': 'https://i.imgur.com/HN4JFFC.png',
        '5': 'https://i.imgur.com/dPp05Jv.png',
        '6': 'https://i.imgur.com/xp9Z6zO.jpeg',
        '7': 'https://i.imgur.com/HN4JFFC.png',
        '8': 'https://i.imgur.com/dPp05Jv.png',
        '9': 'https://i.imgur.com/xp9Z6zO.jpeg',
        '10': 'https://i.imgur.com/xp9Z6zO.jpeg'
    };
    
    // Навешиваем клики на все варианты фона
    var bgOptions = document.querySelectorAll('.bg-option');
    
    bgOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            var bgId = this.getAttribute('data-bg');
            var bgElement = document.getElementById('moving-bg');
            
            if (!bgElement || !bgUrls[bgId]) return;
            
            // Меняем фон
            bgElement.style.backgroundImage = "url('" + bgUrls[bgId] + "')";
            bgElement.style.backgroundSize = 'cover';
            bgElement.style.backgroundPosition = 'center';
            bgElement.style.backgroundRepeat = 'no-repeat';
            
            // Сохраняем выбор
            localStorage.setItem('selectedBg', bgId);
            
            // Обновляем выделение
            bgOptions.forEach(function(opt) {
                opt.classList.remove('selected');
                opt.style.border = '2px solid transparent';
            });
            this.classList.add('selected');
            this.style.border = '2px solid #ffaa44';
            
            // Уведомление
            var name = this.querySelector('span').textContent;
            showNotif('🖼️ Фон изменён на: ' + name);
        });
    });
    
    // Загружаем сохранённый фон при старте
    var savedBg = localStorage.getItem('selectedBg');
    if (savedBg && bgUrls[savedBg]) {
        var bgElement = document.getElementById('moving-bg');
        if (bgElement) {
            bgElement.style.backgroundImage = "url('" + bgUrls[savedBg] + "')";
            bgElement.style.backgroundSize = 'cover';
            bgElement.style.backgroundPosition = 'center';
        }
        
        // Подсвечиваем выбранный
        bgOptions.forEach(function(opt) {
            if (opt.getAttribute('data-bg') === savedBg) {
                opt.classList.add('selected');
                opt.style.border = '2px solid #ffaa44';
            }
        });
    }
})();