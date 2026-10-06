// ================================================================
//  ДАННЫЕ — 5 ТОВАРОВ С КАТЕГОРИЯМИ
// ================================================================
// ================================================================
//  API
// ================================================================

const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://amazonia-medievalis-api.onrender.com';

let currentProducts = []; // товары, загруженные с API

const EXCHANGE_RATES = { rub: 1, usd: 0.011, ducat: 0.008 };
const CURRENCY_SYMBOLS = { rub: '₽', usd: '$', ducat: '⛃' };

// ================================================================
//  UI-ТЕКСТЫ
// ================================================================
const UI_TEXTS = {
  ru: {
    searchPlaceholder: '🔍 Поиск товара...',
    searchBtn: '⚔️ Искать',
    catAll: '📜 Все товары',
    catClothing: '👕 Одежда',
    catBooks: '📖 Свитки',
    catInquisition: '🔥 Инквизиция',
    addBtn: 'Добавить в сундук',
    footerText: '🏰 Доставляем быстрее, чем Чума по Европе',
    footerSmall: '© 1347 — 2026 · Amazonia Medievalis · Все грехи прощены',
    toastDefault: '🔥 Добро пожаловать, грешник!',
    toastAdd: (name) => `📦 «${name}» добавлен в сундук!`,
    toastRemove: (name) => `🗑️ «${name}» удалён из сундука!`,
    inquisitionAlert: '🔥 Святая инквизиция запросила ваш IP. Продолжить?',
    cartEmpty: '☠ Сундук пуст. Добавь товар, грешник!',
    cartCleared: '☠ Сундук очищен! Все грехи смыты... пока.',
    searchEmpty: '🔍 Напиши что-нибудь, грешник!',
    searchFound: (count) => `🔍 Найдено ${count} товаров!`,
    searchNotFound:
      '☠ Ничего не найдено. Попробуй "свитки", "мантию", "пояс", "индульгенцию" или "лошадь"',
    cartTitle: '📦 СУНДУК ГРЕШНИКА',
    cartTotal: 'ИТОГО:',
    cartEmptyText: '☠ СУНДУК ПУСТ\nДОБАВЬ ТОВАР, ГРЕШНИК!',
    cartClearBtn: '✖ ОЧИСТИТЬ',
    cartCloseBtn: '✕ ЗАКРЫТЬ',
    cartItemRemove: '✕',
    discountToast: '🔥 ТЫ ПОЛУЧИЛ СКИДКУ 10%! Инквизиция гордится тобой!',
    marquee:
      '⚜️ КУПИ 3 ИНДУЛЬГЕНЦИИ — ПОЛУЧИ 10% СКИДКИ НА ВЕСЬ ЗАКАЗ! ⚜️ • 🕯️ ПРЕДЛОЖЕНИЕ ДЕЙСТВУЕТ ДО КОНЦА НЕДЕЛИ. ИНКВИЗИЦИЯ СЛЕДИТ ЗА ВАМИ.',
    emptyCategory: '☠ В этой категории пусто...',
  },
  en: {
    searchPlaceholder: '🔍 Search for items...',
    searchBtn: '⚔️ Search',
    catAll: '📜 All Items',
    catClothing: '👕 Clothing',
    catBooks: '📖 Scrolls',
    catInquisition: '🔥 Inquisition',
    addBtn: 'Add to Chest',
    footerText: '🏰 We deliver faster than the Plague across Europe',
    footerSmall: '© 1347 — 2026 · Amazonia Medievalis · All sins forgiven',
    toastDefault: '🔥 Welcome, sinner!',
    toastAdd: (name) => `📦 «${name}» added to the chest!`,
    toastRemove: (name) => `🗑️ «${name}» removed from the chest!`,
    inquisitionAlert: '🔥 The Holy Inquisition has requested your IP. Continue?',
    cartEmpty: '☠ The chest is empty. Add an item, sinner!',
    cartCleared: '☠ Chest cleared! All sins are washed away... for now.',
    searchEmpty: '🔍 Write something, sinner!',
    searchFound: (count) => `🔍 Found ${count} items!`,
    searchNotFound: '☠ Nothing found. Try "scrolls", "cloak", "belt", "indulgence" or "horse"',
    cartTitle: "📦 SINNER'S CHEST",
    cartTotal: 'TOTAL:',
    cartEmptyText: '☠ CHEST IS EMPTY\nADD AN ITEM, SINNER!',
    cartClearBtn: '✖ CLEAR',
    cartCloseBtn: '✕ CLOSE',
    cartItemRemove: '✕',
    discountToast: '🔥 YOU GOT 10% DISCOUNT! The Inquisition is proud of you!',
    marquee:
      '⚜️ BUY 3 INDULGENCES — GET 10% OFF YOUR ENTIRE ORDER! ⚜️ • 🕯️ OFFER VALID UNTIL THE END OF THE WEEK. THE INQUISITION IS WATCHING YOU.',
    emptyCategory: '☠ Nothing in this category...',
  },
  la: {
    searchPlaceholder: '🔍 QUAERE MERCEM...',
    searchBtn: '⚔️ QUAERE',
    catAll: '📜 OMNIA',
    catClothing: '👕 VESTIS',
    catBooks: '📖 CODICES',
    catInquisition: '🔥 INQUISITIO',
    addBtn: 'AD ARCAM',
    footerText: '🏰 CITIUS QUAM PESTIS PER EUROPA',
    footerSmall: '© ANNO DOMINI MCCCXLVII — MMXXVI · AMAZONIA MEDIEVALIS · OMNIA PECCATA DIMISSA',
    toastDefault: '🔥 SALVE, PECCATOR!',
    toastAdd: (name) => `📦 «${name}» AD ARCAM ADDITUM!`,
    toastRemove: (name) => `🗑️ «${name}» DE ARCA REMOTUM!`,
    inquisitionAlert: '🔥 INQUISITIO SANCTA IP TUUM PETIVIT. PERGERE?',
    cartEmpty: '☠ ARCA VACUA EST. ADDE MERCEM, PECCATOR!',
    cartCleared: '☠ ARCA PURGATA! OMNIA PECCATA ABLUTA... PRO NUNC.',
    searchEmpty: '🔍 ALIQUID SCRIBE, PECCATOR!',
    searchFound: (count) => `🔍 ${count} MERCES INVENTAE!`,
    searchNotFound:
      '☠ NIHIL INVENTUM. TENTA "VOLUMINA", "PALLIUM", "CINGULUM", "INDULGENTIA" VEL "EQUUS"',
    cartTitle: '📦 ARCA PECCATORIS',
    cartTotal: 'SUMMA:',
    cartEmptyText: '☠ ARCA VACUA EST\nADDE MERCEM, PECCATOR!',
    cartClearBtn: '✖ PURGARE',
    cartCloseBtn: '✕ CLAUDE',
    cartItemRemove: '✕',
    discountToast: '🔥 10% REMISSIONEM ACCEPISTI! Inquisitio de te superba est!',
    marquee:
      '⚜️ EMITTE 3 INDULGENTIAS — ACCIPE 10% REMISSIONEM IN TOTO ORDINE! ⚜️ • 🕯️ OFFERTUM VALET USQUE AD FINEM HEBDOMADAE. INQUISITIO TE OBSERVAT.',
    emptyCategory: '☠ IN HAC CATEGORIA NIHIL EST...',
  },
};

// ================================================================
//  СОСТОЯНИЕ
// ================================================================
let currentLang = 'ru';
let currentCurrency = 'rub';
let currentCategory = 'all';
let cart = [];
let toastTimer = null;
let productContainer = document.getElementById('productGrid');
let discountActive = false;

// ================================================================
//  ФУНКЦИИ
// ================================================================

function switchLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
  document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
  renderProducts(currentLang);
  updateUITexts(currentLang);
  updateMarquee();
  updateCartBadge();
  updateCartModalTexts(lang);
}

function switchCurrency(currency) {
  if (currency === currentCurrency) return;
  currentCurrency = currency;
  document.querySelectorAll('.currency-btn').forEach((b) => b.classList.remove('active'));
  document.querySelector(`.currency-btn[data-currency="${currency}"]`).classList.add('active');
  renderProducts(currentLang);
}

function filterByCategory(category) {
  currentCategory = category;

  // Подсветка активной категории
  document.querySelectorAll('[data-cat]').forEach((el) => {
    el.style.background = '';
    el.style.borderColor = '';
  });
  const activeEl = document.querySelector(`[data-cat="${category}"]`);
  if (activeEl) {
    activeEl.style.background = '#1a0e0a';
    activeEl.style.borderColor = '#4a2a1a';
  }

  renderProducts(currentLang);
}

async function renderProducts(lang) {
  const rate = EXCHANGE_RATES[currentCurrency] || 1;
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || '₽';
  const t = UI_TEXTS[lang] || UI_TEXTS.ru;

  // Формируем query-параметры
  const params = new URLSearchParams({ lang });
  if (currentCategory !== 'all') {
    params.append('category', currentCategory);
  }

  let products = [];
  try {
    const response = await fetch(`${API_BASE}/api/products?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    products = await response.json();
    currentProducts = products;
  } catch (err) {
    console.error('Failed to load products:', err);
    productContainer.innerHTML = `<div class="cart-empty">🔥 Ошибка загрузки товаров</div>`;
    return;
  }

  productContainer.innerHTML = '';

  if (products.length === 0) {
    productContainer.innerHTML = `<div class="cart-empty">${t.emptyCategory}</div>`;
    return;
  }

  products.forEach((p) => {
    const convertedPrice = Math.round(p.price * rate * 100) / 100;
    const priceStr = convertedPrice % 1 === 0 ? convertedPrice : convertedPrice.toFixed(2);
    const oldPriceStr = p.oldPrice ? Math.round(p.oldPrice * rate) : null;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-testid', `product-${p.id}`);
    card.innerHTML = `
            <div class="product-emoji" data-testid="product-emoji-${p.id}">${p.emoji}</div>
            <div class="product-name" data-testid="product-name-${p.id}">${p.name}</div>
            <div class="product-desc" data-testid="product-desc-${p.id}">${p.desc}</div>
            <div class="product-price" data-testid="product-price-${p.id}">
                ${priceStr} ${symbol}
                ${oldPriceStr ? `<small>${oldPriceStr} ${symbol}</small>` : ''}
            </div>
            <button class="add-btn" data-testid="add-btn-${p.id}" onclick="addToCart(${p.id})">
                ${t.addBtn}
            </button>
        `;
    productContainer.appendChild(card);
  });
}

function updateUITexts(lang) {
  const t = UI_TEXTS[lang] || UI_TEXTS.ru;

  const searchInput = document.querySelector('[data-testid="search-input"]');
  const searchBtn = document.querySelector('[data-testid="search-btn"]');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  if (searchBtn) searchBtn.innerHTML = t.searchBtn;

  document.querySelectorAll('[data-cat]').forEach((el) => {
    const cat = el.getAttribute('data-cat');
    if (cat === 'all') el.textContent = t.catAll;
    else if (cat === 'clothing') el.textContent = t.catClothing;
    else if (cat === 'books') el.textContent = t.catBooks;
    else if (cat === 'inquisition') el.textContent = t.catInquisition;
  });

  const footerText = document.querySelector('[data-testid="footer-text"]');
  const footerSmall = document.querySelector('[data-testid="footer-small"]');
  if (footerText) footerText.textContent = t.footerText;
  if (footerSmall) footerSmall.textContent = t.footerSmall;
}

function updateMarquee() {
  const t = UI_TEXTS[currentLang] || UI_TEXTS.ru;
  const marqueeEl = document.getElementById('marqueeText');
  if (marqueeEl) {
    marqueeEl.textContent = t.marquee;
  }
}

// ================================================================
//  ЛОГИКА СКИДКИ
// ================================================================

function countIndulgences() {
  return cart.filter((item) => item.id === 4).length;
}

function applyDiscount(price, rate) {
  const indulgenceCount = countIndulgences();
  if (indulgenceCount >= 3) {
    return Math.round(price * rate * 0.9 * 100) / 100;
  }
  return Math.round(price * rate * 100) / 100;
}

function checkDiscount() {
  const count = countIndulgences();
  const wasActive = discountActive;
  discountActive = count >= 3;

  if (discountActive && !wasActive) {
    const t = UI_TEXTS[currentLang];
    showToast(t.discountToast);
  }
  return discountActive;
}

// ================================================================
//  КОРЗИНА / СУНДУК
// ================================================================

function addToCart(productId) {
  const product = currentProducts.find((p) => p.id === productId);
  if (!product) return;
  cart.push(product);
  updateCartBadge();
  checkDiscount();
  showToast(UI_TEXTS[currentLang].toastAdd(product.name));
  if (discountActive) {
    renderCartModal();
  }
}

function removeFromCart(index) {
  const t = UI_TEXTS[currentLang];
  const name = cart[index].name;
  cart.splice(index, 1);
  updateCartBadge();
  checkDiscount();
  showToast(t.toastRemove(name));
  renderCartModal();
}

function clearCart() {
  const t = UI_TEXTS[currentLang];
  if (cart.length === 0) return;
  const msg =
    currentLang === 'ru'
      ? 'Очистить сундук, грешник?'
      : currentLang === 'en'
        ? 'Clear the chest, sinner?'
        : 'Purgare arcam, peccator?';
  if (confirm('☠ ' + msg)) {
    cart = [];
    discountActive = false;
    updateCartBadge();
    showToast(t.cartCleared);
    renderCartModal();
  }
}

function updateCartBadge() {
  const countEl = document.querySelector('[data-testid="cart-count"]');
  if (countEl) countEl.textContent = cart.length;
}

// ================================================================
//  МОДАЛКА СУНДУКА
// ================================================================

function openCartModal() {
  const modal = document.getElementById('cartModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCartModal();
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartModal() {
  const t = UI_TEXTS[currentLang];
  const rate = EXCHANGE_RATES[currentCurrency] || 1;
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || '₽';
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty">${t.cartEmptyText.replace(/\n/g, '<br />')}</div>`;
    totalEl.textContent = `${t.cartTotal} 0 ${symbol}`;
    return;
  }

  let html = '';
  let total = 0;
  const indulgenceCount = countIndulgences();
  const discount = indulgenceCount >= 3;

  cart.forEach((item, index) => {
    const price = applyDiscount(item.price, rate);
    total += price;
    const priceStr = price % 1 === 0 ? price : price.toFixed(2);
    const oldPrice = Math.round(item.price * rate * 100) / 100;
    const oldPriceStr = oldPrice % 1 === 0 ? oldPrice : oldPrice.toFixed(2);

    html += `
                    <div class="cart-item">
                        <span class="item-emoji">${item.emoji}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">
                            ${discount && oldPrice !== price ? `<span style="text-decoration:line-through;color:#6a5a4a;font-size:0.4rem;margin-right:4px;">${oldPriceStr}</span>` : ''}
                            ${priceStr} ${symbol}
                            ${discount && item.id === 4 ? '<span style="color:#88dd88;font-size:0.4rem;">(−10%)</span>' : ''}
                        </span>
                        <button class="item-remove" onclick="removeFromCart(${index})">${t.cartItemRemove}</button>
                    </div>
                `;
  });

  let discountBadge = '';
  if (discount) {
    discountBadge = ` <span class="discount-badge">🔥 −10%</span>`;
  }

  const totalStr = total % 1 === 0 ? total : total.toFixed(2);
  container.innerHTML = html;
  totalEl.innerHTML = `${t.cartTotal} ${totalStr} ${symbol}${discountBadge}`;
}

function updateCartModalTexts(lang) {
  const t = UI_TEXTS[lang] || UI_TEXTS.ru;
  const title = document.querySelector('#cartModal .modal-title');
  const clearBtn = document.querySelector('#cartModal .clear-btn');
  const closeBtns = document.querySelectorAll('#cartModal .modal-close-btn');

  if (title) title.textContent = t.cartTitle;
  if (clearBtn) clearBtn.textContent = t.cartClearBtn;
  closeBtns.forEach((btn) => {
    btn.textContent = t.cartCloseBtn;
  });
  renderCartModal();
}

// ================================================================
//  ТОСТ
// ================================================================

function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  if (msgEl) msgEl.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

function hideToast() {
  document.getElementById('toast').classList.remove('show');
  clearTimeout(toastTimer);
}

// ================================================================
//  ИНИЦИАЛИЗАЦИЯ
// ================================================================
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('cartBadge').addEventListener('click', openCartModal);

  document.querySelectorAll('.modal-overlay').forEach((el) => {
    el.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Обработчики для всех категорий
  document.querySelectorAll('[data-cat]').forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const cat = this.getAttribute('data-cat');

      if (cat === 'inquisition') {
        const t = UI_TEXTS[currentLang];
        if (confirm(t.inquisitionAlert)) {
          showToast('🔥 INQUISITOR APPROBAT!');
        } else {
          showToast('🙏 SALVATUS ES... ADHUC.');
        }
        return;
      }

      filterByCategory(cat);
    });
  });

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  searchBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    const t = UI_TEXTS[currentLang];
    if (!query) {
      showToast(t.searchEmpty);
      return;
    }

    try {
      const params = new URLSearchParams({ lang: currentLang, search: query });
      const response = await fetch(`${API_BASE}/api/products?${params}`);
      const found = await response.json();
      showToast(found.length > 0 ? t.searchFound(found.length) : t.searchNotFound);
    } catch (err) {
      console.error('Search failed:', err);
      showToast('🔥 Ошибка поиска');
    }
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchBtn.click();
  });

  renderProducts('ru');
  updateUITexts('ru');
  updateMarquee();
  updateCartBadge();
  filterByCategory('all'); // подсветить активную категорию при загрузке
  setTimeout(() => showToast('🔥 SALVE, PECCATOR! / Добро пожаловать, грешник!'), 600);
});

window.switchLang = switchLang;
window.switchCurrency = switchCurrency;
window.filterByCategory = filterByCategory;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.hideToast = hideToast;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.renderCartModal = renderCartModal;
