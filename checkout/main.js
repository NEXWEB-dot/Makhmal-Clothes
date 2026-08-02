// ---- STATE ----
let currentStep = 1;
let shippingMethod = 'standard';
const SHIPPING_COST = { standard: 0, express: 350 };

// ---- CART HELPERS ----
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('makhmal_cart') || '[]');
  } catch(e) { return []; }
}
function saveCart(c) {
  localStorage.setItem('makhmal_cart', JSON.stringify(c));
}
function updateBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = total;
}
function getSubtotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}
function getTotal() {
  return getSubtotal() + SHIPPING_COST[shippingMethod];
}

// ---- RENDER CART ----
function renderCartItems() {
  const cart = getCart();
  const listEl = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('empty-cart-msg');
  const actionsEl = document.getElementById('cart-actions');
  const summaryEl = document.getElementById('summary-items');

  if (cart.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    actionsEl.classList.add('hidden');
    summaryEl.innerHTML = '<p style="font-size:12px;color:#999;text-align:center;padding:1rem 0;">No items in cart.</p>';
    updateTotals();
    return;
  }

  emptyEl.classList.add('hidden');
  actionsEl.classList.remove('hidden');

  // Cart items list
  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <p class="cart-item-brand">MAKHMAL</p>
        <p class="cart-item-title">${item.name}</p>
        <p class="cart-item-meta">Size: ${item.size || '—'}</p>
        <p class="cart-item-price">Rs. ${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-item-right">
        <button class="remove-item-btn" onclick="removeItem('${item.id}')">
          <i class="ph ph-x"></i>
        </button>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Sidebar summary
  summaryEl.innerHTML = cart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img-wrap">
        <img src="${item.image}" alt="${item.name}">
        <span class="summary-item-qty-badge">${item.qty}</span>
      </div>
      <div class="summary-item-info">
        <p class="summary-item-name">${item.name}</p>
        <p class="summary-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</p>
      </div>
    </div>
  `).join('');

  updateTotals();
}

function updateTotals() {
  const sub = getSubtotal();
  const ship = SHIPPING_COST[shippingMethod];
  const total = sub + ship;
  const subtotalEl = document.getElementById('subtotal-display');
  const shippingEl = document.getElementById('shipping-display');
  const totalEl = document.getElementById('total-display');
  if (subtotalEl) subtotalEl.textContent = 'Rs. ' + sub.toLocaleString();
  if (shippingEl) {
    shippingEl.textContent = ship === 0 ? 'FREE' : 'Rs. ' + ship.toLocaleString();
    shippingEl.className = ship === 0 ? 'shipping-free' : '';
  }
  if (totalEl) totalEl.textContent = 'Rs. ' + total.toLocaleString();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateBadge();
  renderCartItems();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateBadge();
  renderCartItems();
}

function clearCart() {
  if (!confirm('Remove all items from cart?')) return;
  saveCart([]);
  updateBadge();
  renderCartItems();
}

// ---- STEP NAVIGATION ----
function goToStep(step) {
  const sections = { 1: 'section-cart', 2: 'section-delivery', 3: 'section-payment' };
  Object.values(sections).forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById(sections[step]).classList.remove('hidden');
  currentStep = step;
  updateStepUI(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepUI(step) {
  const c1 = document.getElementById('step-1-circle');
  const c2 = document.getElementById('step-2-circle');
  const c3 = document.getElementById('step-3-circle');
  const l1 = document.getElementById('line-1');
  const l2 = document.getElementById('line-2');
  const s3label = document.getElementById('step-3-label');
  const indicators = [
    document.getElementById('step-1-indicator'),
    document.getElementById('step-2-indicator'),
    document.getElementById('step-3-indicator')
  ];

  // Reset all
  [c1, c2, c3].forEach(c => { c.className = 'step-circle'; });
  [l1, l2].forEach(l => l.classList.remove('done'));
  indicators.forEach(ind => ind.classList.remove('active'));

  // Apply active states
  if (step >= 1) { c1.classList.add('active'); indicators[0].classList.add('active'); }
  if (step >= 2) { c2.classList.add('active'); l1.classList.add('done'); indicators[1].classList.add('active'); }
  if (step >= 3) { c3.classList.add('active'); l2.classList.add('done'); indicators[2].classList.add('active'); }

  // Only current step is truly 'active' visually
  indicators.forEach((ind, i) => {
    if (i + 1 !== step) ind.classList.remove('active');
  });
  // But keep circles filled for completed steps
  if (step >= 1) c1.classList.add('active');
  if (step >= 2) c2.classList.add('active');
  if (step >= 3) c3.classList.add('active');
}

// ---- DELIVERY ----
function submitDelivery() {
  const required = ['first-name', 'last-name', 'phone', 'address', 'city'];
  let valid = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) el.style.borderColor = '#ef4444';
      valid = false;
    } else {
      if (el) el.style.borderColor = '#e0e0e0';
    }
  });

  if (!valid) {
    alert('Please fill in all required fields.');
    return;
  }

  // Populate delivery summary
  const name = document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value;
  const city = document.getElementById('city').value;
  const addr = document.getElementById('address').value + ', ' + city;
  const phone = document.getElementById('phone').value;
  document.getElementById('summary-name').textContent = name;
  document.getElementById('summary-address').textContent = addr;
  document.getElementById('summary-phone').textContent = phone;

  goToStep(3);
}

// ---- SHIPPING SELECT ----
function selectShipping(method, el) {
  shippingMethod = method;
  document.querySelectorAll('.radio-card[id^="ship-"]').forEach(c => c.classList.remove('selected'));
  document.getElementById('ship-' + method + '-card').classList.add('selected');
  updateTotals();
}

// ---- PAYMENT OPTIONS STYLE TOGGLE ----
function initPaymentToggle() {
  const paymentContainer = document.getElementById('payment-options-container');
  if (!paymentContainer) return;

  // Initial setup for default checked
  setTimeout(() => {
    const checkedInput = document.querySelector('input[name="payment"]:checked');
    if (checkedInput) {
      const parent = checkedInput.closest('.payment-option-clean');
      if (parent) {
        parent.style.backgroundColor = '#f9fafb';
        const instructions = parent.querySelector('.payment-instructions');
        if (instructions) instructions.classList.remove('hidden');
      }
    }
  }, 200);

  paymentContainer.addEventListener('change', (e) => {
    if (e.target.name === 'payment') {
      document.querySelectorAll('.payment-option-clean').forEach(lbl => {
        lbl.style.backgroundColor = '#ffffff';
        const instr = lbl.querySelector('.payment-instructions');
        if (instr) instr.classList.add('hidden');
      });
      const parentLabel = e.target.closest('.payment-option-clean');
      if (parentLabel) {
        parentLabel.style.backgroundColor = '#f9fafb';
        const currentInstr = parentLabel.querySelector('.payment-instructions');
        if (currentInstr) currentInstr.classList.remove('hidden');
      }
    }
  });
}

// Watch for location.js to inject payment options
const paymentObserver = new MutationObserver(() => { initPaymentToggle(); });
const payContainer = document.getElementById('payment-options-container');
if (payContainer) paymentObserver.observe(payContainer, { childList: true });

// ---- PLACE ORDER ----
function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) { alert('Your cart is empty!'); return; }

  // Check if payment option selected
  const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
  if (!selectedPaymentInput) {
    alert('Please select a payment method.');
    return;
  }

  const btn = document.getElementById('btn-place-order');
  btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
  btn.disabled = true;

  setTimeout(() => {
    const paymentVal = selectedPaymentInput.value;
    buildReceipt(paymentVal, cart);

    // Show success overlay
    const overlay = document.getElementById('success-overlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Clear cart
    saveCart([]);
    updateBadge();

    btn.innerHTML = '<i class="ph ph-lock-key"></i> Complete Order';
    btn.disabled = false;
  }, 800);
}

function buildReceipt(paymentVal, cart) {
  const fName = document.getElementById('first-name').value;
  const lName = document.getElementById('last-name').value;
  const phone = document.getElementById('phone').value;
  const orderNum = Math.floor(100000 + Math.random() * 900000);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const total = getTotal();
  const formattedTotal = 'Rs. ' + total.toLocaleString();

  const paymentLabels = {
    easypaisa: 'Easypaisa',
    jazzcash: 'Jazz Cash',
    banktransfer: 'Bank Transfer',
    cod: 'Cash on Delivery',
    remitly: 'Remitly',
    moneygram: 'MoneyGram',
    taptapsend: 'Tap Tap Send'
  };

  document.getElementById('order-id').textContent = '#MK-' + orderNum;
  document.getElementById('r-name').textContent = `${fName} ${lName}`;
  document.getElementById('r-phone').textContent = phone;
  document.getElementById('success-items').textContent = itemCount + ' item(s)';
  document.getElementById('r-total').textContent = formattedTotal;
  document.getElementById('r-payment-label').textContent = paymentLabels[paymentVal] || 'Pending';

  // Account Details Box
  const accountBox = document.getElementById('r-account-details-box');
  const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
  const accPhone = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-acc') : null;
  const accNum = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-accnum') : null;
  const accIban = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-iban') : null;
  const accName = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-name') : null;

  if (accPhone && paymentVal !== 'cod') {
    accountBox.classList.remove('hidden');
    document.getElementById('r-account-number').innerHTML =
      `${accName}<br>📱 ${accPhone}` +
      (accNum ? `<br>Acc: ${accNum}` : '') +
      (accIban ? `<br>IBAN: ${accIban}` : '');
    document.getElementById('r-account-name').textContent = '';
  } else {
    accountBox.classList.add('hidden');
  }
}

// ---- WHATSAPP ----
document.addEventListener('DOMContentLoaded', () => {
  const wabtn = document.getElementById('btn-wa-send');
  if (wabtn) {
    wabtn.addEventListener('click', async () => {
      wabtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> PREPARING...';
      wabtn.disabled = true;

      // Try to screenshot
      try {
        const card = document.getElementById('receipt-modal-content');
        if (card && typeof html2canvas !== 'undefined') {
          const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#fafafa' });
          const link = document.createElement('a');
          link.download = 'Makhmal-Order.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      } catch(e) { console.warn('Screenshot failed:', e); }

      const name = document.getElementById('r-name').textContent;
      const phone = document.getElementById('r-phone').textContent;
      const total = document.getElementById('r-total').textContent;
      const payment = document.getElementById('r-payment-label').textContent;

      const msg = `🧾 *New Order — Makhmal*\n\n`
        + `👤 *Name:* ${name}\n`
        + `📞 *Phone:* ${phone}\n`
        + `💰 *Total:* ${total}\n`
        + `💳 *Payment:* ${payment}\n\n`
        + `📎 _Screenshot attached._\n`
        + `Please confirm my order!`;

      setTimeout(() => {
        window.open(`https://wa.me/923165521689?text=${encodeURIComponent(msg)}`, '_blank');
        wabtn.innerHTML = '<i class="ph-fill ph-whatsapp-logo"></i> Send via WhatsApp';
        wabtn.disabled = false;
      }, 600);
    });
  }
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateBadge();
  initPaymentToggle();
});
