document.addEventListener('DOMContentLoaded', () => {
  // ===== EMAILJS INIT =====
  if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with actual EmailJS Public Key
  }

  // ===== TOAST SYSTEM =====
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'bg-black text-brand-white px-6 py-4 text-xs font-bold tracking-widest uppercase shadow-2xl flex items-center space-x-3 toast-enter pointer-events-auto';
    let icon = 'ph-info';
    if (type === 'success') icon = 'ph-check-circle';
    if (type === 'error') icon = 'ph-warning-circle';
    toast.innerHTML = `<i class="ph ${icon} text-lg"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== READ PRODUCT DATA FROM URL =====
  const urlParams = new URLSearchParams(window.location.search);
  const productTitle = urlParams.get('title') || 'PRINTED SATIN SHIRT';
  const productPrice = urlParams.get('price') || 'Rs.10,990';
  const productImage = urlParams.get('image') || 'clothes/images/product-2.png';
  const productQty = parseInt(urlParams.get('qty')) || 1;
  const productSize = urlParams.get('size') || 'S';

  // Parse numeric price
  const numericPrice = parseInt(productPrice.replace(/[^0-9]/g, '')) || 10990;
  const totalPrice = numericPrice * productQty;

  // Update order summary sidebar
  document.getElementById('checkout-title').innerText = productTitle;
  document.getElementById('checkout-price').innerText = `Rs.${totalPrice.toLocaleString()}`;
  document.getElementById('checkout-qty').innerText = productQty;
  document.getElementById('checkout-size').innerText = productSize;
  document.getElementById('subtotal').innerText = `Rs.${totalPrice.toLocaleString()}`;
  document.getElementById('total').innerText = `Rs.${totalPrice.toLocaleString()}`;

  // Fix image path (from product page context, images are relative to ../clothes/)
  const imgEl = document.getElementById('checkout-image');
  if (imgEl) imgEl.src = productImage;

  const totalEl = document.getElementById('total');

  // ===== STEP NAVIGATION =====
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step1Circle = document.getElementById('step-1-circle');
  const step2Circle = document.getElementById('step-2-circle');
  const step3Circle = document.getElementById('step-3-circle');
  const stepLine1 = document.getElementById('step-line-1');
  const stepLine2 = document.getElementById('step-line-2');

  function goToStep(stepNum) {
    // Hide all steps
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');

    if (stepNum === 1) {
      step1.classList.remove('hidden');
      step1Circle.className = 'step-circle active';
      step2Circle.className = 'step-circle inactive';
      step3Circle.className = 'step-circle inactive';
      stepLine1.className = 'step-line';
      stepLine2.className = 'step-line';
    } else if (stepNum === 2) {
      step2.classList.remove('hidden');
      step1Circle.className = 'step-circle completed';
      step1Circle.innerHTML = '<i class="ph ph-check"></i>';
      step2Circle.className = 'step-circle active';
      step3Circle.className = 'step-circle inactive';
      stepLine1.className = 'step-line completed';
      stepLine2.className = 'step-line';
    } else if (stepNum === 3) {
      step3.classList.remove('hidden');
      step1Circle.className = 'step-circle completed';
      step1Circle.innerHTML = '<i class="ph ph-check"></i>';
      step2Circle.className = 'step-circle completed';
      step2Circle.innerHTML = '<i class="ph ph-check"></i>';
      step3Circle.className = 'step-circle completed';
      step3Circle.innerHTML = '<i class="ph ph-check"></i>';
      stepLine1.className = 'step-line completed';
      stepLine2.className = 'step-line completed';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // Shipping dropdowns are handled by location.js (self-contained)


  // ===== SHIPPING FORM =====
  const shippingForm = document.getElementById('shipping-form');
  shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validate
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zip = document.getElementById('zip').value.trim();

    if (!firstName || !lastName || !email || !phone || !address || !city || !zip) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    showToast('Shipping info saved', 'success');
    goToStep(2);
  });

  // ===== PAYMENT FORM =====
  const paymentForm = document.getElementById('payment-form');
  const cardDetails = document.getElementById('card-details');
  // Toggle card details visibility using event delegation
  paymentForm.addEventListener('change', (e) => {
    if (e.target.name === 'payment') {
      const radioValue = e.target.value;
      if (radioValue === 'card') {
        cardDetails.classList.remove('hidden');
      } else {
        cardDetails.classList.add('hidden');
      }
    }
  });

  // Card number formatting
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }

  // Expiry formatting
  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      e.target.value = value;
    });
  }

  const WHATSAPP_NUMBER = '923000000000';

  function buildReceipt(payMethod, orderNum) {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();

    document.getElementById('receipt-date').textContent = new Date().toLocaleString('en-PK', { dateStyle:'long', timeStyle:'short' }) + ` | Order #MK-${orderNum}`;
    
    document.getElementById('r-name').textContent = firstName + ' ' + lastName;
    document.getElementById('r-phone').textContent = phone;
    document.getElementById('r-address').textContent = address;
    document.getElementById('r-city').textContent = city;

    if (email) {
      document.getElementById('r-email').textContent = email;
      document.getElementById('r-email-row').style.display = 'flex';
    } else {
      document.getElementById('r-email-row').style.display = 'none';
    }

    // Items
    document.getElementById('r-items').innerHTML = `
      <div class="flex justify-between text-xs mb-1 text-black font-semibold">
        <span>${productTitle} × ${productQty} (Size ${productSize})</span>
        <span>Rs.${totalPrice.toLocaleString()}</span>
      </div>
    `;

    document.getElementById('r-subtotal').textContent = `Rs.${totalPrice.toLocaleString()}`;
    document.getElementById('r-total').textContent = totalEl.innerText;

    // Payment Info
    let label = '';
    let instrTitle = '';
    let instrText = '';
    
    const instrBox = document.getElementById('r-instructions-box');
    const instrTitleEl = document.getElementById('r-instruction-title');
    const instrTextEl = document.getElementById('r-instruction-text');

    if (payMethod === 'easypaisa') {
      label = 'EasyPaisa — Pending Payment';
      instrTitle = 'EasyPaisa Instructions';
      instrText = 'Send payment to <strong>0300 0000000</strong> (Makhmal).';
      instrBox.classList.remove('hidden');
    } else if (payMethod === 'jazzcash') {
      label = 'Jazz Cash — Pending Payment';
      instrTitle = 'Jazz Cash Instructions';
      instrText = 'Send payment to <strong>0300 0000000</strong> (Makhmal).';
      instrBox.classList.remove('hidden');
    } else if (payMethod === 'banktransfer') {
      label = 'Bank Transfer — Pending Payment';
      instrTitle = 'Bank Transfer Instructions';
      instrText = 'Transfer to HBL Account: <strong>0123-4567890</strong> (Makhmal).';
      instrBox.classList.remove('hidden');
    } else if (payMethod === 'card') {
      label = 'Credit / Debit Card — Pending Payment';
      instrTitle = 'Card Payment Processing';
      instrText = 'Your card payment will be processed securely.';
      instrBox.classList.remove('hidden');
    } else if (payMethod === 'remitly' || payMethod === 'moneygram' || payMethod === 'taptapsend') {
      label = `${payMethod.toUpperCase()} — Pending Payment`;
      instrTitle = 'Global Payment Instructions';
      instrText = `Please send the payment via ${payMethod.toUpperCase()} to the details provided by our support team.`;
      instrBox.classList.remove('hidden');
    }

    document.getElementById('r-payment-label').textContent = label;
    if(instrTitle) instrTitleEl.textContent = instrTitle;
    if(instrText) instrTextEl.innerHTML = instrText;
  }

  function showReceiptOverlay() {
    const overlay = document.getElementById('receipt-overlay');
    const modalContent = document.getElementById('receipt-modal-content');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    setTimeout(() => {
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
    }, 10);
  }

  function hideReceiptOverlay() {
    const overlay = document.getElementById('receipt-overlay');
    const modalContent = document.getElementById('receipt-modal-content');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
      overlay.classList.remove('flex');
      overlay.classList.add('hidden');
    }, 300);
  }

  document.getElementById('close-receipt-btn')?.addEventListener('click', () => {
    hideReceiptOverlay();
    goToStep(3); // after closing receipt, show success
  });

  // Screenshot logic
  document.getElementById('btn-screenshot')?.addEventListener('click', () => {
    const card = document.getElementById('receipt-card');
    html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Makhmal-Receipt.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Screenshot saved!', 'success');
    });
  });

  // WhatsApp logic inside receipt
  document.getElementById('btn-wa-send')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-wa-send');
    btn.innerHTML = 'PREPARING...';
    btn.disabled = true;

    // Send EmailJS Confirmation
    if (typeof emailjs !== 'undefined') {
      const name = document.getElementById('r-name').textContent;
      const phone = document.getElementById('r-phone').textContent;
      const email = document.getElementById('r-email').textContent;
      const address = document.getElementById('r-address').textContent;
      const city = document.getElementById('r-city').textContent;
      const paymentLabel = document.getElementById('r-payment-label').textContent;

      const templateParams = {
        to_name: 'Makhmal Admin & ' + name,
        from_name: 'Makhmal System',
        message: `New Order Received!\n\nCustomer: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}, ${city}\n\nItem: ${productTitle}\nQty: ${productQty} (Size ${productSize})\nTotal: ${totalEl.innerText}\nPayment: ${paymentLabel}`
      };

      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then((response) => console.log('Email SUCCESS!', response.status), 
              (error) => console.log('Email FAILED...', error));
    }

    const card = document.getElementById('receipt-card');
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

    // Auto-download screenshot
    const link = document.createElement('a');
    link.download = 'Makhmal-Receipt.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Build message
    const name = document.getElementById('r-name').textContent;
    const phone = document.getElementById('r-phone').textContent;
    const city = document.getElementById('r-city').textContent;
    const total = document.getElementById('r-total').textContent;
    const payment = document.getElementById('r-payment-label').textContent;

    const msg = `🧾 *Order Receipt — Makhmal*\n\n`
        + `👤 *Name:* ${name}\n`
        + `📞 *Phone:* ${phone}\n`
        + `📍 *City:* ${city}\n`
        + `💰 *Total:* ${total}\n`
        + `💳 *Payment:* ${payment}\n\n`
        + `📎 _Receipt screenshot has been downloaded — please attach it to this chat._\n\n`
        + `Please confirm my order. Thank you! 🙏`;

    setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        btn.innerHTML = `<i class="ph-fill ph-whatsapp-logo text-base"></i> Send via WhatsApp`;
        btn.disabled = false;
        hideReceiptOverlay();
        goToStep(3);
    }, 800);
  });

  // Direct WhatsApp Order
  document.getElementById('whatsapp-order-btn')?.addEventListener('click', () => {
    const firstName = document.getElementById('first-name').value.trim() || 'Customer';
    const msg = `🛍️ *New Order — Makhmal*\n\n`
      + `👤 *Customer:* ${firstName}\n`
      + `👟 *Item:* ${productTitle}\n`
      + `📦 *Qty:* ${productQty} × Size ${productSize}\n`
      + `💰 *Total Paid:* ${totalEl.innerText}\n\n`
      + `Please confirm my order. Thank you! 🙏`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (selectedPayment === 'card') {
      const cardNum = document.getElementById('card-number').value.trim();
      const expiry = document.getElementById('card-expiry').value.trim();
      const cvv = document.getElementById('card-cvv').value.trim();
      if (!cardNum || !expiry || !cvv) {
        showToast('Please fill in card details', 'error');
        return;
      }
    }

    const orderNum = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-number').innerText = orderNum;

    // Fill confirmation details
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const confirmationDetails = document.getElementById('confirmation-details');
    const paymentLabel = selectedPayment === 'card' ? 'Credit/Debit Card' : selectedPayment.toUpperCase();

    confirmationDetails.innerHTML = `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Shipping:</strong> ${address}, ${city}</p>
      <p><strong>Payment:</strong> ${paymentLabel}</p>
      <p><strong>Item:</strong> ${productTitle}</p>
      <p><strong>Qty:</strong> ${productQty} × Size ${productSize}</p>
      <p class="pt-2 border-t border-grey-3 mt-2"><strong>Total Paid:</strong> ${totalEl.innerText}</p>
    `;

    // Always show receipt for WhatsApp processing
    buildReceipt(selectedPayment, orderNum);
    showReceiptOverlay();
  });

  // Back button
  document.getElementById('back-to-shipping').addEventListener('click', () => {
    goToStep(1);
  });

  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
});
