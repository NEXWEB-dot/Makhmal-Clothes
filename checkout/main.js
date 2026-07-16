document.addEventListener('DOMContentLoaded', () => {
  
  // ===== SLIDER & STEPPER LOGIC =====
  let currentStage = 1;
  const slider = document.getElementById('slider');
  
  // Buttons
  const btnTo2 = document.getElementById('btn-to-2');
  const btnTo3 = document.getElementById('btn-to-3');
  const btnBack1 = document.getElementById('btn-back-1');
  const btnBack2 = document.getElementById('btn-back-2');
  
  // Indicators
  const ind1 = document.getElementById('indicator-1');
  const ind2 = document.getElementById('indicator-2');
  const ind3 = document.getElementById('indicator-3');
  const line1 = document.getElementById('line-1');
  const line2 = document.getElementById('line-2');

  function updateSlider() {
    // Move slider
    const translateX = -(currentStage - 1) * 33.3333;
    slider.style.transform = `translateX(${translateX}%)`;
    
    // Reset classes
    [ind1, ind2, ind3].forEach(el => el.classList.remove('active', 'completed'));
    [line1, line2].forEach(el => el.classList.remove('active'));

    // Apply active/completed
    if (currentStage >= 1) ind1.classList.add('completed');
    if (currentStage >= 2) {
      line1.classList.add('active');
      ind2.classList.add('completed');
    }
    if (currentStage >= 3) {
      line2.classList.add('active');
      ind3.classList.add('completed');
    }

    if (currentStage === 1) ind1.classList.add('active');
    if (currentStage === 2) ind2.classList.add('active');
    if (currentStage === 3) ind3.classList.add('active');
  }

  // Next/Back Event Listeners
  btnTo2.addEventListener('click', () => {
    currentStage = 2;
    updateSlider();
  });

  btnTo3.addEventListener('click', () => {
    // Validate Stage 2 inputs before proceeding
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const fName = document.getElementById('first-name').value;
    const city = document.getElementById('city').value;
    
    if (!email || !phone || !fName || !city) {
      alert("Please fill in all required delivery fields.");
      return;
    }
    
    currentStage = 3;
    updateSlider();
  });

  btnBack1.addEventListener('click', () => {
    currentStage = 1;
    updateSlider();
  });

  btnBack2.addEventListener('click', () => {
    currentStage = 2;
    updateSlider();
  });

  // ===== PRODUCT / CART LOGIC =====
  const products = {
    1: { title: "EMBROIDERED COTTON VISCOSE SHIRT", price: "Rs.4,990", image: "clothes/images/product-1.png", sku: "MK-RTW-24-001" },
    2: { title: "PRINTED SATIN SHIRT", price: "Rs.10,990", image: "clothes/images/product-2.png", sku: "MK-RTW-24-002" },
    3: { title: "EMBROIDERED COTTON VISCOSE SHIRT", price: "Rs.6,990", image: "clothes/images/product-3.png", sku: "MK-RTW-24-003" }
  };

  const urlParams = new URLSearchParams(window.location.search);
  let productId = urlParams.get('id') || 2;
  let productQty = urlParams.get('qty') || 1;
  let productSize = urlParams.get('size') || 'S';
  
  // Read Sanity data from URL params directly, fallback to local database
  let productTitle = urlParams.get('title') || (products[productId] ? products[productId].title : products[2].title);
  let productPrice = urlParams.get('price') || (products[productId] ? products[productId].price : products[2].price);
  let productImage = urlParams.get('image') || (products[productId] ? products[productId].image : products[2].image);
  
  // Calculate Totals
  const rawPriceStr = productPrice.replace(/[^0-9]/g, '');
  const priceNum = parseInt(rawPriceStr, 10);
  const totalPrice = priceNum * parseInt(productQty, 10);
  const formattedTotal = `Rs.${totalPrice.toLocaleString()}`;

  // Populate DOM
  document.getElementById('cart-image').src = productImage;
  document.getElementById('cart-title').innerText = productTitle;
  document.getElementById('cart-size').innerText = productSize;
  document.getElementById('cart-qty').innerText = productQty;
  document.getElementById('cart-price').innerText = productPrice;
  document.getElementById('subtotal').innerText = formattedTotal;
  document.getElementById('total').innerText = formattedTotal;

  // ===== PAYMENT OPTIONS STYLE TOGGLE =====
  const paymentOptionsContainer = document.getElementById('payment-options-container');
  if (paymentOptionsContainer) {
    // Initial setup for default checked
    setTimeout(() => {
      const checkedInput = document.querySelector('input[name="payment"]:checked');
      if(checkedInput) {
        checkedInput.closest('.payment-option-clean').style.backgroundColor = '#f9fafb';
        const instructions = checkedInput.closest('.payment-option-clean').querySelector('.payment-instructions');
        if(instructions) instructions.classList.remove('hidden');
      }
    }, 100);

    paymentOptionsContainer.addEventListener('change', (e) => {
      if (e.target.name === 'payment') {
        // Hide all instructions and reset background
        document.querySelectorAll('.payment-option-clean').forEach(lbl => {
          lbl.style.backgroundColor = '#ffffff';
          const instr = lbl.querySelector('.payment-instructions');
          if(instr) instr.classList.add('hidden');
        });
        // Show current instruction and highlight
        const parentLabel = e.target.closest('.payment-option-clean');
        parentLabel.style.backgroundColor = '#f9fafb';
        const currentInstr = parentLabel.querySelector('.payment-instructions');
        if(currentInstr) currentInstr.classList.remove('hidden');
      }
    });
  }

  // ===== FORM SUBMIT (SHOW RECEIPT) =====
  const checkoutForm = document.getElementById('checkout-form');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if payment option selected
    const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
    if (!selectedPaymentInput) {
      alert("Please select a payment method.");
      return;
    }

    const btn = document.getElementById('btn-place-order');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      buildReceipt(selectedPaymentInput.value);
      showReceiptOverlay();
      btn.innerHTML = '<i class="ph ph-lock-key"></i> Complete Order';
      btn.disabled = false;
    }, 800);
  });

  function buildReceipt(paymentVal) {
    const fName = document.getElementById('first-name').value;
    const lName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    
    const paymentLabels = {
      easypaisa: 'Easypaisa',
      jazzcash: 'Jazz Cash',
      banktransfer: 'Bank Transfer',
      cod: 'Cash on Delivery',
      remitly: 'Remitly',
      moneygram: 'MoneyGram',
      taptapsend: 'Tap Tap Send'
    };

    document.getElementById('order-number').textContent = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('r-name').textContent = `${fName} ${lName}`;
    document.getElementById('r-phone').textContent = phone;
    document.getElementById('r-payment-label').textContent = paymentLabels[paymentVal] || 'Pending';
    document.getElementById('r-total').textContent = formattedTotal;

    // Items
    document.getElementById('r-items').innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span>${productTitle} (Size: ${productSize}) x ${productQty}</span>
        <span style="font-weight:600;">${formattedTotal}</span>
      </div>
    `;

    // Account Details Box
    const accountBox = document.getElementById('r-account-details-box');
    const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
    const accPhone  = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-acc') : null;
    const accNum    = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-accnum') : null;
    const accIban   = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-iban') : null;
    const accName   = selectedPaymentInput ? selectedPaymentInput.getAttribute('data-name') : null;

    if (accPhone && paymentVal !== 'cod') {
      accountBox.classList.remove('hidden');
      document.getElementById('r-account-number').innerHTML =
        `${accName}<br>
         📱 ${accPhone}` +
        (accNum  ? `<br>Acc: ${accNum}`  : '') +
        (accIban ? `<br>IBAN: ${accIban}` : '');
      document.getElementById('r-account-name').textContent = '';
    } else {
      accountBox.classList.add('hidden');
    }
  }

  function showReceiptOverlay() {
    const overlay = document.getElementById('receipt-overlay');
    const modalContent = document.getElementById('receipt-modal-content');
    overlay.style.display = 'flex';
    setTimeout(() => {
      modalContent.style.transform = 'scale(1)';
      modalContent.style.opacity = '1';
    }, 10);
  }

  // ===== WHATSAPP INTEGRATION =====
  document.getElementById('btn-wa-send')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-wa-send');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> PREPARING...';
    btn.disabled = true;

    const card = document.getElementById('receipt-modal-content');
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#fafafa' });

    // Download screenshot
    const link = document.createElement('a');
    link.download = 'Makhmal-Order.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Prepare message
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
      btn.innerHTML = `<i class="ph-fill ph-whatsapp-logo"></i> Send via WhatsApp`;
      btn.disabled = false;
      
      // Redirect after success
      window.location.href = 'index.html';
    }, 800);
  });
});
