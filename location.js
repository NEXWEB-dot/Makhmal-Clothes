document.addEventListener('DOMContentLoaded', () => {
  // Initialize region
  let userLocation = localStorage.getItem('userLocation') || 'Pakistan';
  
  // Set all region selectors to the current location
  const regionSelectors = document.querySelectorAll('.region-selector');
  regionSelectors.forEach(select => {
    select.value = userLocation;
    select.addEventListener('change', (e) => {
      const newLoc = e.target.value;
      localStorage.setItem('userLocation', newLoc);
      userLocation = newLoc;
      
      // Update all other selectors on the page to match
      regionSelectors.forEach(s => { s.value = newLoc; });
      
      // Re-apply logic if on checkout page
      applyLocationLogic(newLoc);
    });
  });

  // Apply initial logic
  applyLocationLogic(userLocation);

  // ===== MAIN LOGIC: apply payment options + shipping dropdowns =====
  function applyLocationLogic(loc) {
    applyPaymentOptions(loc);
    applyShippingDropdowns(loc);
  }

  // ===== PAYMENT OPTIONS (Checkout page only) =====
  function applyPaymentOptions(loc) {
    const paymentContainer = document.getElementById('payment-options-container');
    if (!paymentContainer) return;

    if (loc === 'Pakistan') {
      paymentContainer.innerHTML = `
        <label class="payment-option-clean">
          <input type="radio" name="payment" value="easypaisa" checked
            data-acc="03165521689"
            data-accnum="01070010128864860018"
            data-iban="PK67ABPA0010128864860018"
            data-name="Amama Malik">
          <i class="ph ph-device-mobile icon"></i>
          <div class="info">
            <p class="title">Easypaisa</p>
            <div class="payment-instructions hidden" style="font-size:12px; color:#555; margin-top:8px; line-height:1.8;">
              Send the amount to:<br>
              <strong>Amama Malik</strong><br>
              📱 <strong>03165521689</strong><br>
              Acc: <strong>01070010128864860018</strong><br>
              IBAN: <strong>PK67ABPA0010128864860018</strong>
            </div>
          </div>
        </label>
        <label class="payment-option-clean">
          <input type="radio" name="payment" value="banktransfer"
            data-acc="01070010128864860018"
            data-iban="PK67ABPA0010128864860018"
            data-name="Amama Malik">
          <i class="ph ph-bank icon"></i>
          <div class="info">
            <p class="title">Bank Transfer</p>
            <div class="payment-instructions hidden" style="font-size:12px; color:#555; margin-top:8px; line-height:1.8;">
              Transfer to:<br>
              <strong>Amama Malik</strong><br>
              Acc: <strong>01070010128864860018</strong><br>
              IBAN: <strong>PK67ABPA0010128864860018</strong>
            </div>
          </div>
        </label>
      `;
    } else {
      paymentContainer.innerHTML = `
        <label class="payment-option-clean">
          <input type="radio" name="payment" value="remitly" checked data-acc="Contact Support" data-name="Global Transfer">
          <i class="ph ph-globe icon"></i>
          <div class="info">
            <p class="title">Remitly</p>
            <div class="payment-instructions hidden" style="font-size:12px; color:#555; margin-top:8px;">
              Please contact our WhatsApp support to get Remitly transfer details.
            </div>
          </div>
        </label>
        <label class="payment-option-clean">
          <input type="radio" name="payment" value="moneygram" data-acc="Contact Support" data-name="Global Transfer">
          <i class="ph ph-money icon"></i>
          <div class="info">
            <p class="title">MoneyGram</p>
            <div class="payment-instructions hidden" style="font-size:12px; color:#555; margin-top:8px;">
              Please contact our WhatsApp support to get MoneyGram transfer details.
            </div>
          </div>
        </label>
        <label class="payment-option-clean">
          <input type="radio" name="payment" value="taptapsend" data-acc="Contact Support" data-name="Global Transfer">
          <i class="ph ph-paper-plane-tilt icon"></i>
          <div class="info">
            <p class="title">Tap Tap Send</p>
            <div class="payment-instructions hidden" style="font-size:12px; color:#555; margin-top:8px;">
              Please contact our WhatsApp support to get Tap Tap Send details.
            </div>
          </div>
        </label>
      `;
    }
  }

  // ===== SHIPPING DROPDOWNS (Checkout page only) =====
  function applyShippingDropdowns(loc) {
    const stateContainer = document.getElementById('state-container');
    const cityContainer = document.getElementById('city-container');
    if (!stateContainer || !cityContainer) return;

    // Use Aura-style floating inputs
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
        <select id="state" required>
          <option value="" disabled selected></option>
          ${Object.keys(provinces).map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <label for="state">Province *</label>
      `;

      cityContainer.innerHTML = `
        <select id="city" required disabled style="background:#f5f5f5;color:#999;">
          <option value="" disabled selected></option>
        </select>
        <label for="city">City *</label>
      `;

      const stateSelect = document.getElementById('state');
      const citySelect = document.getElementById('city');

      stateSelect.addEventListener('change', () => {
        const prov = stateSelect.value;
        if (prov && provinces[prov]) {
          citySelect.innerHTML = '<option value="" disabled selected></option>' +
            provinces[prov].map(c => `<option value="${c}">${c}</option>`).join('');
          citySelect.disabled = false;
          citySelect.style.background = '#fff';
          citySelect.style.color = '#333';
        } else {
          citySelect.innerHTML = '<option value="" disabled selected></option>';
          citySelect.disabled = true;
          citySelect.style.background = '#f5f5f5';
          citySelect.style.color = '#999';
        }
      });

    } else {
      stateContainer.innerHTML = `
        <input type="text" id="state" placeholder=" ">
        <label for="state">State / Province</label>
      `;
      cityContainer.innerHTML = `
        <input type="text" id="city" required placeholder=" ">
        <label for="city">City *</label>
      `;
    }
  }

  // Also expose for main.js to call if needed
  window.updateShippingFields = applyShippingDropdowns;
});
