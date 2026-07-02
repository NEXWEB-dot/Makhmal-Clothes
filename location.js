document.addEventListener('DOMContentLoaded', () => {
  // ===== LOCATION MODAL =====
  const userLocation = localStorage.getItem('userLocation');

  const modalHTML = `
    <div id="location-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 opacity-0 pointer-events-none">
      <div class="bg-white p-10 max-w-md w-full relative mx-4 shadow-2xl transform transition-transform duration-500 scale-95 flex flex-col items-center" style="border-radius:0;">
        <h2 class="text-2xl font-bold tracking-[0.2em] mb-2 uppercase text-center" style="color:#000;font-family:Montserrat,sans-serif;">Select Location</h2>
        <p class="text-xs tracking-widest mb-8 uppercase text-center" style="color:#999;">Choose your region for shipping</p>
        <div class="flex flex-col w-full gap-3">
          <button class="location-btn" data-loc="Pakistan" style="width:100%;border:1px solid #000;padding:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:transparent;cursor:pointer;transition:all 0.2s;">Pakistan</button>
          <button class="location-btn" data-loc="USA" style="width:100%;border:1px solid #000;padding:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:transparent;cursor:pointer;transition:all 0.2s;">USA</button>
          <button class="location-btn" data-loc="UK" style="width:100%;border:1px solid #000;padding:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:transparent;cursor:pointer;transition:all 0.2s;">UK</button>
          <button class="location-btn" data-loc="UAE" style="width:100%;border:1px solid #000;padding:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:transparent;cursor:pointer;transition:all 0.2s;">UAE</button>
          <button class="location-btn" data-loc="Global" style="width:100%;border:1px solid #000;padding:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;background:transparent;cursor:pointer;transition:all 0.2s;">Global</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Hover effects on buttons
  document.querySelectorAll('.location-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.background = '#000'; btn.style.color = '#fff'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent'; btn.style.color = '#000'; });
  });

  const modal = document.getElementById('location-modal');
  const modalInner = modal.querySelector('div');

  // Only show modal on the home/index page, not on checkout or product pages
  const isHomePage = window.location.pathname === '/' || 
                     window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/');
  const isCheckout = window.location.pathname.includes('checkout');

  // Show modal if no location AND we're on the home page
  if (!userLocation && isHomePage && !isCheckout) {
    setTimeout(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto');
      modalInner.classList.remove('scale-95');
      modalInner.classList.add('scale-100');
    }, 300);
  } else {
    applyLocationLogic(userLocation || 'Pakistan');
  }

  // Handle button clicks
  document.querySelectorAll('.location-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const loc = e.target.getAttribute('data-loc');
      localStorage.setItem('userLocation', loc);

      // Close modal
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalInner.classList.remove('scale-100');
      modalInner.classList.add('scale-95');

      applyLocationLogic(loc);
    });
  });

  // ===== MAIN LOGIC: apply payment options + shipping dropdowns =====
  function applyLocationLogic(loc) {
    applyPaymentOptions(loc);
    applyShippingDropdowns(loc);
  }

  // ===== PAYMENT OPTIONS (Checkout page only) =====
  function applyPaymentOptions(loc) {
    const paymentContainer = document.getElementById('payment-options-container');
    if (!paymentContainer) return;

    const labelClass = 'loc-payment-label';

    if (loc === 'Pakistan') {
      paymentContainer.innerHTML = `
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="easypaisa" checked style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-device-mobile" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">EASYPAISA</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">Mobile wallet payment</p>
            </div>
          </div>
        </label>
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="jazzcash" style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-wallet" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">JAZZ CASH</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">Mobile wallet payment</p>
            </div>
          </div>
        </label>
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="banktransfer" style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-bank" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">BANK TRANSFER</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">Direct bank transfer</p>
            </div>
          </div>
        </label>
      `;
    } else {
      paymentContainer.innerHTML = `
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="remitly" checked style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-globe" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">REMITLY</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">International money transfer</p>
            </div>
          </div>
        </label>
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="moneygram" style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-money" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">MONEYGRAM</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">Global payment service</p>
            </div>
          </div>
        </label>
        <label class="${labelClass}" style="display:flex;align-items:center;gap:16px;border:1px solid #ddd;border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;">
          <input type="radio" name="payment" value="taptapsend" style="accent-color:#000;width:16px;height:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <i class="ph ph-paper-plane-tilt" style="font-size:1.2rem;"></i>
            <div>
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">TAP TAP SEND</p>
              <p style="font-size:0.6rem;color:#666;letter-spacing:0.05em;">Fast transfer service</p>
            </div>
          </div>
        </label>
      `;
    }

    // Hover highlight on payment labels
    paymentContainer.querySelectorAll('label').forEach(lbl => {
      lbl.addEventListener('mouseenter', () => lbl.style.borderColor = '#000');
      lbl.addEventListener('mouseleave', () => {
        const inp = lbl.querySelector('input');
        lbl.style.borderColor = inp && inp.checked ? '#000' : '#ddd';
      });
      const inp = lbl.querySelector('input');
      if (inp) {
        inp.addEventListener('change', () => {
          paymentContainer.querySelectorAll('label').forEach(l => l.style.borderColor = '#ddd');
          lbl.style.borderColor = '#000';
        });
      }
    });
  }

  // ===== SHIPPING DROPDOWNS (Checkout page only) =====
  function applyShippingDropdowns(loc) {
    const stateContainer = document.getElementById('state-container');
    const cityContainer = document.getElementById('city-container');
    if (!stateContainer || !cityContainer) return;

    const inputStyle = 'width:100%;border:1px solid #ddd;border-radius:6px;padding:12px 16px;font-size:0.875rem;outline:none;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:all 0.2s;';
    const labelStyle = 'display:block;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;margin-bottom:8px;';

    if (loc === 'Pakistan') {
      const provinces = {
        "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpur Khas"],
        "Punjab": ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot"],
        "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat"],
        "Balochistan": ["Quetta", "Gwadar", "Khuzdar", "Chaman"],
        "Islamabad Capital Territory": ["Islamabad"],
        "Gilgit-Baltistan": ["Gilgit", "Skardu"],
        "AJK": ["Muzaffarabad", "Mirpur"]
      };

      stateContainer.innerHTML = `
        <label for="state" style="${labelStyle}">PROVINCE *</label>
        <select id="state" required style="${inputStyle}">
          <option value="">Select Province</option>
          ${Object.keys(provinces).map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      `;

      cityContainer.innerHTML = `
        <label for="city" style="${labelStyle}">CITY *</label>
        <select id="city" required disabled style="${inputStyle}background:#f5f5f5;color:#999;">
          <option value="">Select City</option>
        </select>
      `;

      const stateSelect = document.getElementById('state');
      const citySelect = document.getElementById('city');

      stateSelect.addEventListener('change', () => {
        const prov = stateSelect.value;
        if (prov && provinces[prov]) {
          citySelect.innerHTML = '<option value="">Select City</option>' +
            provinces[prov].map(c => `<option value="${c}">${c}</option>`).join('');
          citySelect.disabled = false;
          citySelect.style.background = '#fff';
          citySelect.style.color = '#000';
        } else {
          citySelect.innerHTML = '<option value="">Select City</option>';
          citySelect.disabled = true;
          citySelect.style.background = '#f5f5f5';
          citySelect.style.color = '#999';
        }
      });

    } else {
      stateContainer.innerHTML = `
        <label for="state" style="${labelStyle}">STATE / PROVINCE</label>
        <input type="text" id="state" placeholder="Enter state" style="${inputStyle}">
      `;
      cityContainer.innerHTML = `
        <label for="city" style="${labelStyle}">CITY *</label>
        <input type="text" id="city" required placeholder="Enter city" style="${inputStyle}">
      `;
    }
  }

  // Also expose for main.js to call if needed
  window.updateShippingFields = applyShippingDropdowns;
});
