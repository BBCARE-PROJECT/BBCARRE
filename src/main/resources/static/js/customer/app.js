/* =========================================================
   2. HÀM ĐIỀU HƯỚNG TRANG & CHUYỂN MỤC
========================================================= */
if (typeof $ === 'undefined') {
  window.$ = id => document.getElementById(id);
}
let currentStoreCategory = 'all';
let currentStoreKeyword = '';

function navigateTo(pageId){
  // Nếu đang ở bước hoàn tất đặt ca mà chuyển sang trang khác, tự động reset booking về ban đầu
  if(pageId !== 'serviceDetailPage' && typeof B !== 'undefined' && B.step === 5){
    resetBooking();
    renderStep();
  }

  document.querySelectorAll('.page-section').forEach(p=>p.classList.remove('page-active'));
  const target = $(pageId);
  if(target){
    target.classList.add('page-active');
    window.scrollTo({top:0, behavior:'smooth'});
  }
  if(pageId==='cartPage') renderCartPage();
  if(pageId==='storePage') renderStorePage(currentStoreCategory, currentStoreKeyword);
  if(pageId==='profilePage') renderProfilePage();
  if(pageId==='newsPage') renderNewsPage();
}

function scrollToEl(id){
  const el = $(id);
  if(el){ 
    const navHeight = 70;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
  }
}

function goHomeAnchor(id){
  navigateTo('homePage');
  setTimeout(()=> scrollToEl(id), 120);
}

function openModal(id){
  const m = $(id);
  if(!m) return;
  m.classList.add('open');
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal(id){
  const m = $(id);
  if(!m) return;
  m.classList.remove('open');
  m.style.display = 'none';
  document.body.style.overflow = '';
}

function openEmergencyModal(){
  openModal('emergencyModal');
}
function closeEmergencyModal(){
  closeModal('emergencyModal');
}
function handleEmergencySubmit(e){
  e.preventDefault();
  alert('🚨 YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN!\nĐội điều phối xe cấp cứu BBCare đang liên hệ lại ngay lập tức trong 60 giây và xuất phát xe đến địa chỉ của bạn.');
  closeEmergencyModal();
}

function scrollToApplyForm(job){
  navigateTo('recruitmentPage');
  setTimeout(()=>{
    const s=$('applyJobSelect'); if(s) s.value=job;
    scrollToEl('applyFormBox');
  }, 100);
}

/* =========================================================
   4. GIỎ HÀNG SẢN PHẨM & CỬA HÀNG Y TẾ
========================================================= */
let currentHomeProductCategory = 'all';

function filterHomeProducts(cat, btn) {
  currentHomeProductCategory = cat;
  document.querySelectorAll('.home-ptab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(cat);
}

function buyNow(title, price, img) {
  addToCart(title, price, img);
  navigateTo('cartPage');
}

function renderProducts(category = 'all'){
  const grid = $('productGrid');
  if(!grid || typeof PRODUCTS === 'undefined') return;

  let displayItems = [];
  if (category === 'all') {
    // 4 sản phẩm tiêu biểu đa dạng từ các nhóm: Máy thở/oxy, Giường y tế, Máy đo SpO2, TPCN khớp
    const featuredIds = ['p_oxy_machine', 'p_hospital_bed', 'p_spo2_monitor', 'p_tpcn1'];
    displayItems = featuredIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    if (displayItems.length < 4) displayItems = PRODUCTS.slice(0, 4);
  } else {
    displayItems = PRODUCTS.filter(p => p.cat === category).slice(0, 4);
  }

  grid.innerHTML = displayItems.map(p => {
    const isDual = p.hasDualAction;
    const catIcon = p.cat === 'hohap' ? 'fa-lungs' : (p.cat === 'dichuyen' ? 'fa-bed-pulse' : (p.cat === 'tpcn' ? 'fa-pills' : 'fa-shield-heart'));

    return `
      <div class="product-card">
        <div class="product-img-box">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600'">
          <span class="product-tag"><i class="fa-solid ${catIcon}"></i> ${escapeHtml(p.tag)}</span>
        </div>
        <h4 class="product-title" title="${escapeHtml(p.full || p.title)}">${escapeHtml(p.full || p.title)}</h4>
        <p class="product-desc">${escapeHtml(p.desc || '')}</p>
        
        <div class="product-price-box">
          ${isDual ? `
            <div class="price-row-item rent">
              <span class="p-lbl"><i class="fa-regular fa-clock"></i> Thuê:</span>
              <span class="p-val">${escapeHtml(p.rentText)}</span>
            </div>
            <div class="price-row-item buy">
              <span class="p-lbl"><i class="fa-solid fa-bag-shopping"></i> Mua:</span>
              <span class="p-val">${escapeHtml(p.buyText)}</span>
            </div>
          ` : `
            <div class="price-single-tag">
              <span class="p-lbl"><i class="fa-solid fa-tag"></i> Đơn giá:</span>
              <span class="p-val">${escapeHtml(p.buyText || p.priceText || (fmt(p.buyPrice || p.price) + ' VNĐ'))}</span>
            </div>
          `}
        </div>

        <div class="product-actions-duo">
          ${isDual ? `
            <button type="button" class="btn-card-rent" onclick="addEquipmentToCart('${p.id}', 'rent')">
              <i class="fa-solid fa-calendar-days"></i> Thuê Máy
            </button>
            <button type="button" class="btn-card-buy" onclick="addEquipmentToCart('${p.id}', 'buy')">
              <i class="fa-solid fa-cart-plus"></i> Mua Mới
            </button>
          ` : `
            <button type="button" class="btn-card-rent" onclick="addToCart('${p.title}', ${p.buyPrice || p.price}, '${p.img}')" style="background:#f1f5f9;color:#334155;border-color:#cbd5e1">
              <i class="fa-solid fa-cart-plus"></i> Thêm Giỏ
            </button>
            <button type="button" class="btn-card-buy" onclick="buyNow('${p.title}', ${p.buyPrice || p.price}, '${p.img}')">
              <i class="fa-solid fa-bolt"></i> Mua Ngay
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function renderStorePage(category = 'all', keyword = '') {
  currentStoreCategory = category;
  currentStoreKeyword = keyword.toLowerCase().trim();
  const grid = $('storeProductGrid');
  if(!grid) return;

  let filtered = PRODUCTS;
  if(category !== 'all'){
    filtered = filtered.filter(p => p.cat === category);
  }
  if(currentStoreKeyword){
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(currentStoreKeyword) || 
      p.full.toLowerCase().includes(currentStoreKeyword) ||
      p.tag.toLowerCase().includes(currentStoreKeyword) ||
      (p.desc && p.desc.toLowerCase().includes(currentStoreKeyword))
    );
  }

  if(filtered.length === 0){
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:50px 20px;background:#f8fafc;border-radius:14px;border:1px dashed #cbd5e1">
        <i class="fa-solid fa-box-open" style="font-size:38px;color:#94a3b8;margin-bottom:12px"></i>
        <h4 style="font-size:16px;font-weight:800;color:#334155">Không tìm thấy thiết bị y tế phù hợp</h4>
        <p style="font-size:13px;color:#64748b;margin-top:4px">Vui lòng thử lại với từ khóa khác hoặc chọn xem Tất cả thiết bị.</p>
        <button type="button" class="btn-pill" style="margin-top:12px;background:var(--primary-blue);color:#fff" onclick="filterStore('all', document.querySelector('.store-tab-btn[data-cat=\\'all\\']'))">Xem tất cả thiết bị</button>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    if (p.hasDualAction) {
      return `
        <div class="product-card store-card-item">
          <div class="product-img-box">
            <img src="${p.img}" alt="${escapeHtml(p.title)}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'">
            <span class="store-device-cat-badge"><i class="fa-solid fa-shield-heart"></i> ${escapeHtml(p.tag)}</span>
          </div>
          <h4 class="store-device-title">${escapeHtml(p.full)}</h4>
          <p class="store-device-desc">${escapeHtml(p.desc || '')}</p>
          <div class="shop-prices-duo">
            <div class="price-duo-row rent">
              <span class="price-label"><i class="fa-regular fa-clock"></i> Giá thuê:</span>
              <span class="price-val">${escapeHtml(p.rentText)}</span>
            </div>
            <div class="price-duo-row buy">
              <span class="price-label"><i class="fa-solid fa-bag-shopping"></i> Giá mua:</span>
              <span class="price-val">${escapeHtml(p.buyText)}</span>
            </div>
          </div>
          <div class="store-dual-action-btns">
            <button type="button" class="btn-shop-rent" onclick="addEquipmentToCart('${p.id}', 'rent')">
              <i class="fa-solid fa-calendar-days"></i> Thuê Thiết Bị
            </button>
            <button type="button" class="btn-shop-buy" onclick="addEquipmentToCart('${p.id}', 'buy')">
              <i class="fa-solid fa-cart-plus"></i> Mua Mới
            </button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="product-card store-card-item">
          <div class="product-img-box">
            <img src="${p.img}" alt="${escapeHtml(p.title)}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'">
            <span class="store-device-cat-badge">${escapeHtml(p.tag)}</span>
          </div>
          <h4 class="store-device-title">${escapeHtml(p.full)}</h4>
          <p class="store-device-desc">${escapeHtml(p.desc || '')}</p>
          <div class="shop-prices-duo">
            <div class="price-duo-row buy">
              <span class="price-label"><i class="fa-solid fa-bag-shopping"></i> Đơn giá mua:</span>
              <span class="price-val">${escapeHtml(p.buyText)}</span>
            </div>
          </div>
          <div class="store-dual-action-btns" style="grid-template-columns:1fr">
            <button type="button" class="btn-shop-buy" onclick="addEquipmentToCart('${p.id}', 'buy')">
              <i class="fa-solid fa-cart-plus"></i> Mua Ngay
            </button>
          </div>
        </div>
      `;
    }
  }).join('');

  renderUserEquipmentList();
}

function filterStore(cat, el) {
  document.querySelectorAll('.store-tab-btn').forEach(b => b.classList.remove('active'));
  if(el) el.classList.add('active');
  renderStorePage(cat, currentStoreKeyword);
}

function onStoreSearch(e) {
  const kw = e.target.value;
  renderStorePage(currentStoreCategory, kw);
}

function addEquipmentToCart(productId, actionType) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  const isRent = (actionType === 'rent');
  const price = isRent ? p.rentPrice : p.buyPrice;
  const title = isRent ? `${p.title} (Thuê thiết bị)` : `${p.title} (Mua mới)`;
  const typeTag = isRent ? 'rent' : 'buy';

  const ex = cart.find(x => x.productId === productId && x.type === typeTag);
  if (ex) {
    ex.qty++;
  } else {
    cart.push({
      id: Date.now(),
      productId: p.id,
      title: title,
      price: price,
      qty: 1,
      img: p.img,
      type: typeTag,
      typeLabel: isRent ? 'Thuê Thiết Bị' : 'Mua Mới'
    });
  }

  updateSummary();
  showToast(`Đã thêm [${isRent ? 'Thuê' : 'Mua'}] ${p.title} vào giỏ hàng!`);
}

function buyNow(title, price, img) {
  addToCart(title, price, img);
  navigateTo('cartPage');
}

function renderCartPage(){
  const area=$('cartContentArea');
  if(!area) return;
  if(!cart.length){
    area.innerHTML=`<div style="text-align:center;padding:50px 20px;background:#f8fafc;border-radius:12px;border:1px dashed #cbd5e1">
      <i class="fa-solid fa-cart-arrow-down" style="font-size:40px;color:#94a3b8;margin-bottom:12px"></i>
      <h3 style="font-size:17px;font-weight:800;color:#334155">Giỏ hàng của bạn đang trống</h3>
      <p style="font-size:13.5px;color:#64748b;margin-top:6px">Hãy khám phá các thiết bị y tế hỗ trợ thở, di chuyển và phục hồi của BBCare nhé!</p>
      <button type="button" onclick="navigateTo('storePage')" class="btn-pill" style="margin-top:14px;background:var(--primary-blue);color:#fff"><i class="fa-solid fa-store"></i> Đến Cửa Hàng Thiết Bị Y Tế</button>
    </div>`;
  } else {
    area.innerHTML=`<table class="cart-table">
      <thead><tr><th>Sản phẩm / Thiết bị</th><th>Hình thức</th><th>Đơn giá</th><th style="text-align:center">Số lượng</th><th>Thành tiền</th><th></th></tr></thead>
      <tbody>`+
      cart.map((it, idx)=>{
        const isRent = (it.type === 'rent');
        return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:12px">
              <img src="${it.img}" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover;border:1px solid #e2e8f0">
              <div>
                <strong>${escapeHtml(it.title)}</strong>
              </div>
            </div>
          </td>
          <td>
            <span class="cart-type-badge ${isRent ? 'rent' : 'buy'}">
              <i class="fa-solid ${isRent ? 'fa-calendar-days' : 'fa-bag-shopping'}"></i> ${isRent ? 'Thuê thiết bị' : 'Mua mới'}
            </span>
          </td>
          <td>${fmt(it.price)} VNĐ ${isRent ? '<small style="color:#64748b">/ngày</small>' : ''}</td>
          <td style="text-align:center">
            <div style="display:inline-flex;align-items:center;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden">
              <button type="button" style="padding:4px 8px;border:none;background:#f1f5f9;cursor:pointer" onclick="changeCartQty(${idx}, -1)">-</button>
              <span style="padding:4px 10px;font-weight:700;font-size:13px">${it.qty}</span>
              <button type="button" style="padding:4px 8px;border:none;background:#f1f5f9;cursor:pointer" onclick="changeCartQty(${idx}, 1)">+</button>
            </div>
          </td>
          <td><strong style="color:var(--danger-red)">${fmt(it.price*it.qty)} VNĐ</strong></td>
          <td><button type="button" onclick="removeCartItem(${idx})" style="border:none;background:none;color:#ef4444;cursor:pointer" title="Xóa"><i class="fa-solid fa-trash-can"></i></button></td>
        </tr>`;
      }).join('')+`</tbody></table>`;
  }
  updateSummary();
}

function changeCartQty(idx, delta) {
  if(!cart[idx]) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCartPage();
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  renderCartPage();
}

function addToCart(title,price,img){
  const ex=cart.find(x=>x.title===title);
  if(ex)ex.qty++; else cart.push({id:Date.now(),title,price,qty:1,img,type:'buy',typeLabel:'Mua mới'});
  updateSummary();
  showToast(`Đã thêm "${title}" vào giỏ hàng!`);
}

function showToast(msg) {
  let toast = $('bbcareToast');
  if(!toast) {
    toast = document.createElement('div');
    toast.id = 'bbcareToast';
    toast.className = 'bbcare-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function updateSummary(){
  const q=cart.reduce((s,i)=>s+i.qty,0), t=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cBadge = $('cartCount'); if(cBadge) cBadge.innerText=q;
  const sTotal = $('cartSubtotal'); if(sTotal) sTotal.innerText=fmt(t)+' VNĐ';
  const cTotal = $('cartTotal'); if(cTotal) cTotal.innerText=fmt(t)+' VNĐ';
}

function checkoutCartPage(){
  if(!cart.length){
    alert('Giỏ hàng đang trống!');
    return;
  }

  // Chuyển các món trong giỏ sang USER_EQUIPMENT_ORDERS
  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;
  const endD = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const endStr = `${String(endD.getDate()).padStart(2,'0')}/${String(endD.getMonth()+1).padStart(2,'0')}/${endD.getFullYear()}`;

  cart.forEach(item => {
    const isRent = (item.type === 'rent');
    const orderCode = (isRent ? 'RNT-' : 'BUY-') + Math.floor(1000 + Math.random() * 9000);
    const isTpcn = item.title.toLowerCase().includes('tpcn') || item.title.toLowerCase().includes('ginkgo') || item.title.toLowerCase().includes('glucosamine') || item.title.toLowerCase().includes('omega');
    USER_EQUIPMENT_ORDERS.unshift({
      orderId: orderCode,
      type: isRent ? 'RENT' : 'BUY',
      itemType: isRent ? 'device' : (isTpcn ? 'tpcn' : 'vattu'),
      title: item.title,
      img: item.img,
      startDate: todayStr,
      endDate: endStr,
      orderDate: todayStr,
      durationDays: 7,
      dailyRate: isRent ? item.price : 0,
      unitPrice: item.price,
      quantity: item.qty,
      totalPrice: item.price * item.qty,
      status: isRent ? 'ACTIVE_RENT' : 'DELIVERED',
      statusText: isRent ? 'Đang thuê sử dụng' : 'Đã giao hàng tận nhà',
      returnStatus: isRent ? 'NOT_RETURNED' : 'NOT_APPLICABLE',
      assignedStaff: 'ĐĐ. Trần Thị Mai (KTV Kho BBCare)',
      staffPhone: '0905 123 456',
      serialNumber: isRent ? 'DEV-' + Math.floor(100 + Math.random() * 900) : '',
      categoryName: isRent ? 'Thiết bị y tế thuê' : (isTpcn ? 'Thực phẩm chức năng (TPCN)' : 'Thuốc & Dụng cụ y tế'),
      notes: isRent ? 'Kèm đầy đủ phụ kiện tiệt trùng' : 'Giao hàng tận nơi'
    });
  });

  const boughtCount = cart.length;
  cart = [];
  renderCartPage();

  alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\nĐã tiếp nhận ${boughtCount} sản phẩm/thiết bị. Đơn hàng đã được lưu vào mục Lịch Sử Đã Mua & Đang Thuê trong Cửa Hàng Y Tế của bạn.`);
  navigateTo('storePage');
  switchStoreMainTab('history');
}

function handleAccountClick(){ if(isLoggedIn) navigateTo('accountPage'); else window.location.href = 'login.html'; }
function handleConsultSubmit(e){ e.preventDefault(); alert('BBCare sẽ gọi tư vấn trong 5 phút!'); closeModal('bookingModal'); }

function logoutAccount(){
  isLoggedIn = false;
  localStorage.removeItem('bbcare_logged_in');
  localStorage.removeItem('bbcare_user_name');
  $('accountLabel').innerText = 'TÀI KHOẢN';
  window.location.href = 'login.html';
}

function switchAccTab(tab, el){
  document.querySelectorAll('.account-menu-item').forEach(i => i.classList.remove('active'));
  if(el) el.classList.add('active');
  ['profile', 'orders', 'booking', 'feedback', 'password'].forEach(t => {
    const target = $('accTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if(target) target.style.display = (t === tab) ? 'block' : 'none';
  });
  if(tab === 'feedback') renderCustomerFeedbacks();
}

function saveAccProfile(e){
  e.preventDefault();
  const name = $('accInputName')?.value.trim() || 'Nguyễn Văn An';
  const phone = $('accInputPhone')?.value.trim() || '0908786168';
  const addr = $('accInputAddr')?.value.trim() || '';

  localStorage.setItem('bbcare_logged_in', 'true');
  localStorage.setItem('bbcare_user_name', name);
  localStorage.setItem('bbcare_user_phone', phone);
  if(addr) localStorage.setItem('bbcare_user_addr', addr);

  currentUser.name = name;
  currentUser.phone = phone;

  const lbl = $('accountLabel'); if(lbl) lbl.innerText = name;
  const avatarChar = $('accAvatarChar'); if(avatarChar) avatarChar.innerText = name.charAt(0).toUpperCase();
  const accDisplayName = $('accDisplayName'); if(accDisplayName) accDisplayName.innerText = name.toUpperCase();
  const accDisplayPhone = $('accDisplayPhone'); if(accDisplayPhone) accDisplayPhone.innerText = 'SĐT: ' + phone;

  if(typeof B !== 'undefined') {
    B.name = name;
    B.phone = phone;
    if(addr) B.addr = addr;
    if(typeof renderStep === 'function') renderStep();
  }

  alert('🎉 Đã cập nhật thông tin tài khoản thành công! Địa chỉ và SĐT này sẽ được tự động điền sẵn khi bạn đặt ca y tế.');
}

/* =========================================================
   5. HỒ SƠ SỨC KHỎE CHI TIẾT & CUỐN LỊCH TƯƠNG TÁC
========================================================= */
let profCalYear = 2026;
let profCalMonth = 9; // Tháng 10 (0-indexed: 9 = tháng 10)
let selectedProfDate = '2026-10-10';

function changeProfCalMonth(delta) {
  profCalMonth += delta;
  if (profCalMonth < 0) { profCalMonth = 11; profCalYear--; }
  else if (profCalMonth > 11) { profCalMonth = 0; profCalYear++; }
  renderProfilePage();
}

function gotoTodayProfCal() {
  profCalYear = 2026;
  profCalMonth = 9;
  selectedProfDate = '2026-10-10';
  renderProfilePage();
}

function selectProfDate(dateStr) {
  selectedProfDate = dateStr;
  renderProfilePage();
}

let isFetchingHistory = false;

// 🚀 FETCH API: Tải lịch sử ca hẹn và nhật ký sinh hiệu từ Backend SQL Server (GET /api/appointments/my-history)
function loadPatientAppointmentHistory(phone) {
  let userPhone = phone;
  if (!userPhone && typeof localStorage !== 'undefined') {
    userPhone = localStorage.getItem('bbcare_user_phone');
  }
  if (!userPhone && typeof currentUser !== 'undefined' && currentUser) {
    userPhone = currentUser.phone;
  }
  if (!userPhone) {
    userPhone = '0905 123 456';
  }

  return fetch(`/api/appointments/my-history?phone=${encodeURIComponent(userPhone)}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        console.log('>> [Backend API] Đã tải danh sách ca hẹn & sinh hiệu từ Database SQL Server:', data);
        let hasChanges = false;
        data.forEach(srv => {
          const vitalsObj = (srv.bloodPressure || srv.spo2 || srv.heartRate || srv.nurseNotes) ? {
            bp: srv.bloodPressure || '--',
            bloodPressure: srv.bloodPressure || '--',
            spo2: srv.spo2 ? (srv.spo2.includes('%') ? srv.spo2 : srv.spo2 + '%') : '--',
            hr: srv.heartRate ? (srv.heartRate.includes('bpm') ? srv.heartRate : srv.heartRate + ' bpm') : '--',
            heartRate: srv.heartRate || '--',
            temp: '36.8°C',
            note: srv.nurseNotes || srv.nurseCareNotes || srv.reason || '',
            measuredAt: `${srv.appointmentDate} (${srv.timeSlot})`,
            bpStatus: 'Bình thường'
          } : null;

          const existing = APPOINTMENTS_HISTORY.find(x => x.code === srv.code || (srv.id && x.id === srv.id));
          if (existing) {
            existing.status = (srv.status || existing.status).toUpperCase();
            existing.statusText = existing.status === 'COMPLETED' ? 'Đã hoàn thành' : (existing.status === 'CONFIRMED' ? 'Đã xếp lịch · Y tá nhận ca' : 'Chờ điều phối');
            if (vitalsObj) existing.vitals = vitalsObj;
            hasChanges = true;
          } else {
            const shiftDuration = srv.timeSlot || '08:00 - 10:30 (Sáng)';
            const newAppt = {
              id: srv.id,
              code: srv.code,
              patientName: srv.patientName || 'Bệnh nhân',
              service: srv.serviceName || 'Chăm sóc y tế tại nhà',
              nurseName: srv.nurse ? srv.nurse.fullName : 'Điều dưỡng hệ thống',
              nurseTitle: srv.nurse ? (srv.nurse.specialty || 'Điều dưỡng chuyên khoa') : 'Điều dưỡng tại nhà',
              nursePhone: srv.nurse ? (srv.nurse.phone || '0905 111 222') : '0905 111 222',
              duration: shiftDuration,
              time: `${srv.appointmentDate} (${shiftDuration})`,
              dateStr: srv.appointmentDate,
              timeRange: shiftDuration,
              addr: srv.patientAddress || 'Đà Nẵng',
              notes: srv.reason || '',
              status: (srv.status || 'PENDING').toUpperCase(),
              statusText: srv.status === 'completed' ? 'Đã hoàn thành' : (srv.status === 'confirmed' ? 'Đã xếp lịch · Y tá nhận ca' : 'Chờ điều phối'),
              amount: srv.price || 300000,
              rating: 0,
              totalDays: 1,
              scheduleDays: [
                {
                  dayIndex: 1,
                  date: srv.appointmentDate,
                  label: `${srv.appointmentDate} (${shiftDuration})`,
                  status: (srv.status || 'PENDING').toUpperCase(),
                  statusText: srv.status === 'completed' ? 'Đã hoàn thành' : 'Sắp trực',
                  vitals: vitalsObj
                }
              ],
              vitals: vitalsObj
            };
            APPOINTMENTS_HISTORY.unshift(newAppt);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          if (typeof saveStoredAppointments === 'function') {
            saveStoredAppointments();
          }
          renderProfilePage(true);
        }
      }
    })
    .catch(err => {
      console.warn('>> [Fetch API Warning] Không thể tải dữ liệu từ /api/appointments/my-history:', err);
    });
}

function renderProfilePage(skipFetch){
  const area = $('profileScheduleArea');
  if(!area || typeof APPOINTMENTS_HISTORY === 'undefined') return;

  if (!skipFetch && !isFetchingHistory) {
    isFetchingHistory = true;
    loadPatientAppointmentHistory().finally(() => {
      setTimeout(() => { isFetchingHistory = false; }, 2000);
    });
  }

  const pad = n => String(n).padStart(2, '0');
  const safeDmy = s => (typeof dmy === 'function' ? dmy(s) : (s ? s.split('-').reverse().join('/') : ''));
  const safeYmd = off => (typeof ymd === 'function' ? ymd(off) : '2026-10-10');

  const dim = new Date(profCalYear, profCalMonth + 1, 0).getDate();
  const offset = (new Date(profCalYear, profCalMonth, 1).getDay() + 6) % 7; // T2 = 0

  // 1. TẠO MA TRẬN CUỐN LỊCH
  let calCells = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => `<div class="pcal-dow ${d === 'CN' ? 'sunday' : ''}">${d}</div>`).join('');
  for(let i = 0; i < offset; i++) {
    calCells += `<div class="pcal-cell empty"></div>`;
  }

  for(let d = 1; d <= dim; d++) {
    const curDateStr = `${profCalYear}-${pad(profCalMonth + 1)}-${pad(d)}`;
    
    // Tìm các ca có trong ngày này
    const apptsInDay = [];
    APPOINTMENTS_HISTORY.forEach(appt => {
      if (appt.scheduleDays && appt.scheduleDays.length) {
        appt.scheduleDays.forEach(sd => {
          if (sd.date === curDateStr) apptsInDay.push({ appt, day: sd });
        });
      } else if (appt.dateStr === curDateStr) {
        apptsInDay.push({ appt, day: { status: appt.status, vitals: null } });
      }
    });

    let cellColorClass = '';
    let pillBadge = '';
    if (apptsInDay.length > 0) {
      const hasDone = apptsInDay.some(x => x.day.status === 'COMPLETED' || x.appt.status === 'COMPLETED');
      const hasUpcoming = apptsInDay.some(x => x.day.status === 'UPCOMING' || x.appt.status === 'CONFIRMED');

      if (hasDone && hasUpcoming) {
        cellColorClass = 'cal-has-booked';
        pillBadge = `<span class="pcal-pill blue">2 ca</span>`;
      } else if (hasDone) {
        cellColorClass = 'cal-has-done';
        pillBadge = '<span class="pcal-pill green">✓ Xong</span>';
      } else if (hasUpcoming) {
        cellColorClass = 'cal-has-booked';
        pillBadge = '<span class="pcal-pill blue">Đã đặt</span>';
      }
    }

    const isSelected = curDateStr === selectedProfDate;
    const isToday = curDateStr === '2026-10-10';

    calCells += `
      <div class="pcal-cell ${cellColorClass} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" onclick="selectProfDate('${curDateStr}')" title="${isToday ? 'Hôm nay: ' : ''}${curDateStr}">
        <span class="pcal-num">${d}</span>
        ${pillBadge}
      </div>
    `;
  }

  // 2. LỌC CHI TIẾT CÁC CA TRONG NGÀY ĐANG CHỌN (selectedProfDate)
  const selectedDayAppts = [];
  APPOINTMENTS_HISTORY.forEach(appt => {
    if (appt.scheduleDays && appt.scheduleDays.length) {
      appt.scheduleDays.forEach(sd => {
        if (sd.date === selectedProfDate) selectedDayAppts.push({ appt, day: sd });
      });
    } else if (appt.dateStr === selectedProfDate) {
      selectedDayAppts.push({ appt, day: { status: appt.status, label: appt.time, vitals: appt.vitals || null, dayIndex: 1 } });
    }
  });

  const dayVitals = selectedDayAppts.find(x => (x.day && x.day.vitals))?.day?.vitals ||
                    selectedDayAppts.find(x => (x.appt && x.appt.vitals))?.appt?.vitals || null;

  let dayDetailsHtml = '';
  if (!selectedDayAppts.length) {
    dayDetailsHtml = `
      <div class="pcs-empty-card">
        <div class="pcs-empty-icon"><i class="fa-regular fa-calendar-plus"></i></div>
        <h4>Ngày ${safeDmy(selectedProfDate)} chưa có ca trực</h4>
        <p>Quý khách có thể đặt ca điều dưỡng chăm sóc sức khỏe, thay băng hoặc theo dõi sinh hiệu tận nhà cho ngày này.</p>
        <button type="button" class="btn btn-primary" onclick="bookForSpecificDate('${selectedProfDate}')" style="margin-top:14px;padding:12px 24px">
          <i class="fa-solid fa-plus"></i> Đặt Ca Y Tá Cho Ngày ${safeDmy(selectedProfDate)}
        </button>
      </div>
    `;
  } else {
    dayDetailsHtml = selectedDayAppts.map(({ appt, day }) => {
      const isDone = (day.status === 'COMPLETED' || appt.status === 'COMPLETED');
      const isCancelled = appt.status === 'CANCELLED';

      let statusBadge = '';
      if (isDone) {
        statusBadge = '<span class="pcs-badge-status done"><i class="fa-solid fa-circle-check"></i> ĐÃ HOÀN THÀNH</span>';
      } else if (isCancelled) {
        statusBadge = '<span class="pcs-badge-status cancelled"><i class="fa-solid fa-circle-xmark"></i> ĐÃ HỦY CA</span>';
      } else {
        statusBadge = '<span class="pcs-badge-status booked"><i class="fa-solid fa-calendar-check"></i> ĐÃ XẾP LỊCH · SẮP TRỰC</span>';
      }

      const nurseName = appt.nurseName || 'ĐĐ. Nguyễn Văn Minh';
      const nurseTitle = appt.nurseTitle || 'Điều dưỡng viên Chuyên khoa';
      const nursePhone = appt.nursePhone || '0908 786 168';
      const nurseTime = appt.timeRange || appt.time || 'Ca trực tiêu chuẩn';

      return `
        <div class="pcs-card">
          <!-- 1. HEADER CA TRỰC GỌN GÀNG -->
          <div class="pcs-head">
            <div class="pcs-title-row">
              <span class="pcs-code">${appt.code}</span>
              <h4 class="pcs-service-title">${escapeHtml(appt.service)}</h4>
            </div>
            <div>${statusBadge}</div>
          </div>

          <!-- 2. MỤC Y TÁ TO LÊN, RÕ RÀNG NỔI BẬT -->
          <div class="pcs-nurse-highlight-box">
            <div class="nurse-highlight-avatar">
              <i class="fa-solid fa-user-nurse"></i>
            </div>
            <div class="nurse-highlight-details">
              <div class="nurse-highlight-badge"><i class="fa-solid fa-shield-halved"></i> ĐIỀU DƯỠNG VIÊN TRỰC CA NÀY</div>
              <h3 class="nurse-highlight-name">${escapeHtml(nurseName)}</h3>
              <div class="nurse-highlight-sub">${escapeHtml(nurseTitle)}</div>
              <div class="nurse-highlight-contact">
                <span class="nurse-phone-badge-text">Số điện thoại: <strong>${escapeHtml(nursePhone)}</strong></span>
                <span class="dot-sep">•</span>
                <span class="nurse-time-badge">
                  <i class="fa-regular fa-clock"></i> Khung giờ: <strong>${escapeHtml(nurseTime)}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- 4. CỤM NÚT THAO TÁC ĐỒNG BỘ Ở TẤT CẢ CÁC CA LỊCH -->
          <div class="pcs-actions-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:14px;padding-top:12px;border-top:1px dashed #e2e8f0;">
            ${isCancelled ? `
              <span style="font-size:12.5px;color:#dc2626;font-weight:700"><i class="fa-solid fa-ban"></i> Ca hẹn đã được hủy thành công</span>
              <button type="button" class="btn btn-warning" style="padding:6px 14px;font-size:12px;font-weight:750;" onclick="openFeedbackModal('${appt.code}', '${escapeHtml(nurseName)}')"><i class="fa-solid fa-star"></i> Đánh giá & Khiếu nại</button>
            ` : `
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="btn-action-appt btn-edit-appt" onclick="openEditAppointmentModal('${appt.code}')"><i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa ca</button>
                <button type="button" class="btn-action-appt btn-cancel-appt" onclick="openCancelAppointmentModal('${appt.code}')"><i class="fa-solid fa-ban"></i> Hủy ca này</button>
              </div>
              <button type="button" class="btn btn-warning" style="padding:7px 16px;font-size:12.5px;font-weight:800;border-radius:10px;" onclick="openFeedbackModal('${appt.code}', '${escapeHtml(nurseName)}')"><i class="fa-solid fa-star"></i> Đánh giá & Gửi khiếu nại ca trực</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. RENDER TỔNG THỂ DẠNG CUỐN LỊCH VÀ CHI TIẾT
  area.innerHTML = `
    <div class="prof-calendar-layout">
      <!-- CỘT TRÁI: CUỐN LỊCH ĐỂ BÀN / SỔ LỊCH CHĂM SÓC -->
      <div class="pcal-desk-book">
        <!-- NẸP GÁY SỔ LỊCH KIM LOẠI SANG TRỌNG -->
        <div class="pcal-binder-strip">
          <span class="binder-ring"></span>
          <span class="binder-ring"></span>
          <span class="binder-ring"></span>
          <span class="binder-ring"></span>
          <span class="binder-ring"></span>
          <span class="binder-ring"></span>
        </div>

        <!-- HEADER TRANG LỊCH -->
        <div class="pcal-month-head">
          <div class="pcal-head-top">
            <span class="pcal-badge-hdr"><i class="fa-solid fa-book-medical"></i> SỔ LỊCH CHĂM SÓC</span>
            <button type="button" class="pcal-today-btn" onclick="gotoTodayProfCal()"><i class="fa-solid fa-clock-rotate-left"></i> Hôm nay</button>
          </div>
          <div class="pcal-month-nav">
            <button type="button" class="pcal-nav-btn" onclick="changeProfCalMonth(-1)" title="Tháng trước">&lt;</button>
            <div class="pcal-month-title">THÁNG ${profCalMonth + 1} / ${profCalYear}</div>
            <button type="button" class="pcal-nav-btn" onclick="changeProfCalMonth(1)" title="Tháng sau">&gt;</button>
          </div>
        </div>

        <!-- MA TRẬN CÁC NGÀY TRONG THÁNG -->
        <div class="pcal-grid">
          ${calCells}
        </div>

        <!-- CHÚ THÍCH MÀU SẮC RÕ RÀNG (LEGEND) -->
        <div class="pcal-legend-box">
          <div class="pcal-legend-row">
            <div class="pcal-legend-item">
              <span class="pcal-color-box blue"></span>
              <span><strong>Màu Xanh Dương:</strong> Ca đã đặt / Sắp trực</span>
            </div>
            <div class="pcal-legend-item">
              <span class="pcal-color-box green"></span>
              <span><strong>Màu Xanh Lá:</strong> Ca đã hoàn thành</span>
            </div>
            <div class="pcal-legend-item">
              <span class="pcal-color-box white"></span>
              <span><strong>Màu Trắng:</strong> Ngày trống lịch</span>
            </div>
          </div>
          <div class="pcal-legend-hint">
            <i class="fa-solid fa-hand-pointer" style="color:#0284c7"></i> Bấm vào bất kỳ ngày nào trên cuốn lịch để xem y tá nào làm gì!
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: BẢNG CHI TIẾT NGÀY ĐƯỢC CHỌN (NHẬT KÝ CA TRỰC) -->
      <div class="pcal-details-panel">
        <div class="pcs-panel-head">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <div class="pcs-panel-icon"><i class="fa-solid fa-calendar-check"></i></div>
            <div>
              <div class="pcs-title-vitals-row">
                <h3 class="pcs-panel-title">
                  Nhật Ký Chăm Sóc: Ngày ${safeDmy(selectedProfDate)}
                  ${selectedProfDate === '2026-10-10' ? '<span class="pcs-today-tag">Hôm nay</span>' : ''}
                </h3>
                ${selectedDayAppts.length ? `
                  <button type="button" class="btn-vitals-popup-trigger ${dayVitals ? 'has-data' : ''}" onclick="openVitalsPopupForDate('${selectedProfDate}')" title="Bấm để xem chỉ số sinh hiệu chi tiết">
                    <i class="fa-solid fa-heart-pulse"></i>
                    <span>Chỉ Số Sinh Hiệu</span>
                    ${dayVitals ? '<span class="vitals-live-dot"></span>' : ''}
                  </button>
                ` : ''}
              </div>
              <p class="pcs-panel-subtitle">Chi tiết điều dưỡng phụ trách & các đầu việc y tá thực hiện trong ca trực.</p>
            </div>
          </div>
          <div class="pcs-head-count-badge">
            ${selectedDayAppts.length} ca trực
          </div>
        </div>

        <div class="pcal-details-body">
          ${dayDetailsHtml}
        </div>
      </div>
    </div>
  `;

  renderUserEquipmentList();
}

/* =========================================================
   QUẢN LÝ TỦ THIẾT BỊ & ĐƠN THUỐC / TPCN (PROFILE & STORE TABS)
========================================================= */
let currentEquipFilter = 'all';

function switchStoreMainTab(tab) {
  const btnCatalog = $('storeMainTabCatalog');
  const btnHistory = $('storeMainTabHistory');
  const panelCatalog = $('storeCatalogArea');
  const panelHistory = $('storeHistoryArea');

  if (tab === 'catalog') {
    if (btnCatalog) btnCatalog.classList.add('active');
    if (btnHistory) btnHistory.classList.remove('active');
    if (panelCatalog) { panelCatalog.style.display = 'block'; panelCatalog.classList.add('active'); }
    if (panelHistory) { panelHistory.style.display = 'none'; panelHistory.classList.remove('active'); }
  } else {
    if (btnCatalog) btnCatalog.classList.remove('active');
    if (btnHistory) btnHistory.classList.add('active');
    if (panelCatalog) { panelCatalog.style.display = 'none'; panelCatalog.classList.remove('active'); }
    if (panelHistory) { panelHistory.style.display = 'block'; panelHistory.classList.add('active'); }
    renderUserEquipmentList();
  }
}

function switchProfileMainTab(tab) {
  const btnSchedule = $('profTabBtnSchedule');
  const btnEquip = $('profTabBtnEquipment');
  const panelSchedule = $('profileScheduleArea');
  const panelEquip = $('profileEquipmentArea');

  if (tab === 'schedule') {
    if (btnSchedule) btnSchedule.classList.add('active');
    if (btnEquip) btnEquip.classList.remove('active');
    if (panelSchedule) { panelSchedule.style.display = 'block'; panelSchedule.classList.add('active'); }
    if (panelEquip) { panelEquip.style.display = 'none'; panelEquip.classList.remove('active'); }
  } else {
    if (btnSchedule) btnSchedule.classList.remove('active');
    if (btnEquip) btnEquip.classList.add('active');
    if (panelSchedule) { panelSchedule.style.display = 'none'; panelSchedule.classList.remove('active'); }
    if (panelEquip) { panelEquip.style.display = 'block'; panelEquip.classList.add('active'); }
    renderUserEquipmentList();
  }
}

function filterUserEquipment(filterType, el) {
  currentEquipFilter = filterType;
  document.querySelectorAll('.equip-ftab').forEach(b => {
    if (b.getAttribute('data-filter') === filterType) b.classList.add('active');
    else b.classList.remove('active');
  });
  renderUserEquipmentList();
}

function renderUserEquipmentList() {
  const grids = [$('userEquipmentListGrid'), $('storeEquipmentListGrid')].filter(Boolean);
  if (!grids.length || typeof USER_EQUIPMENT_ORDERS === 'undefined') return;

  const allCount = USER_EQUIPMENT_ORDERS.length;
  const activeRentCount = USER_EQUIPMENT_ORDERS.filter(x => x.type === 'RENT' && x.status === 'ACTIVE_RENT').length;
  const returnedCount = USER_EQUIPMENT_ORDERS.filter(x => x.type === 'RENT' && x.status === 'RETURNED').length;
  const tpcnCount = USER_EQUIPMENT_ORDERS.filter(x => x.itemType === 'tpcn').length;
  const buyCount = USER_EQUIPMENT_ORDERS.filter(x => x.type === 'BUY').length;

  document.querySelectorAll('.countEquipAll, #countEquipAll').forEach(el => el.innerText = allCount);
  document.querySelectorAll('.countEquipActiveRent, #countEquipActiveRent').forEach(el => el.innerText = activeRentCount);
  document.querySelectorAll('.countEquipReturned, #countEquipReturned').forEach(el => el.innerText = returnedCount);
  document.querySelectorAll('.countEquipTpcn, #countEquipTpcn').forEach(el => el.innerText = tpcnCount);
  document.querySelectorAll('.countEquipBuy, #countEquipBuy').forEach(el => el.innerText = buyCount);

  const badgeText = `${activeRentCount} đang thuê`;
  const badgeTabProf = $('profRentingBadge'); if (badgeTabProf) badgeTabProf.innerText = badgeText;
  const badgeTabStore = $('storeHistoryBadge'); if (badgeTabStore) badgeTabStore.innerText = badgeText;

  let list = USER_EQUIPMENT_ORDERS;
  if (currentEquipFilter === 'active_rent') {
    list = list.filter(x => x.type === 'RENT' && x.status === 'ACTIVE_RENT');
  } else if (currentEquipFilter === 'returned') {
    list = list.filter(x => x.type === 'RENT' && x.status === 'RETURNED');
  } else if (currentEquipFilter === 'tpcn') {
    list = list.filter(x => x.itemType === 'tpcn');
  } else if (currentEquipFilter === 'purchased') {
    list = list.filter(x => x.type === 'BUY');
  }

  if (!list.length) {
    const emptyHtml = `
      <div style="grid-column:1/-1;text-align:center;padding:50px 20px;background:#f8fafc;border-radius:14px;border:1.5px dashed #cbd5e1">
        <i class="fa-solid fa-box-open" style="font-size:40px;color:#94a3b8;margin-bottom:12px"></i>
        <h4 style="font-size:16px;font-weight:800;color:#334155">Chưa có mục nào trong danh mục này</h4>
        <p style="font-size:13px;color:#64748b;margin-top:4px">Quý khách có thể thuê thêm thiết bị y tế hoặc mua thực phẩm chức năng / thuốc tại cửa hàng.</p>
        <button type="button" class="btn btn-primary" onclick="switchStoreMainTab('catalog');navigateTo('storePage')" style="margin-top:14px;padding:9px 20px">
          <i class="fa-solid fa-store"></i> Đến Danh Mục Sản Phẩm & Thiết Bị
        </button>
      </div>
    `;
    grids.forEach(g => { g.innerHTML = emptyHtml; });
    return;
  }

  const cardsHtml = list.map(item => {
    if (item.type === 'RENT') {
      const isReturned = (item.status === 'RETURNED');
      const isWaitingStaff = (item.returnStatus === 'WAITING_STAFF');

      return `
        <div class="equip-card ${isReturned ? 'returned' : 'renting'}">
          <div class="equip-card-top">
            <img src="${item.img}" alt="${escapeHtml(item.title)}" class="equip-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400'">
            <div class="equip-info-head">
              <span class="equip-order-code">${item.orderId} · THUÊ THIẾT BỊ</span>
              <h4 class="equip-card-title">${escapeHtml(item.title)}</h4>
              ${item.serialNumber ? `<div class="equip-serial-tag"><i class="fa-solid fa-barcode"></i> Mã máy: <strong>${item.serialNumber}</strong></div>` : ''}
            </div>
          </div>

          <div class="equip-meta-rows">
            <div class="equip-meta-row">
              <span>Thời gian thuê:</span>
              <strong>${item.startDate} – ${item.endDate} (${item.durationDays} ngày)</strong>
            </div>
            <div class="equip-meta-row">
              <span>Đơn giá thuê:</span>
              <strong>${fmt(item.dailyRate)} VNĐ / ngày</strong>
            </div>
            <div class="equip-meta-row">
              <span>Trạng thái:</span>
              <span class="equip-status-badge ${isReturned ? 'returned' : (isWaitingStaff ? 'waiting' : 'renting')}">
                ${isReturned ? '<i class="fa-solid fa-check"></i> ĐÃ HOÀN TRẢ' : (isWaitingStaff ? '<i class="fa-solid fa-hourglass-half"></i> CHỜ STAFF THU HỒI' : '<i class="fa-solid fa-house-chimney-medical"></i> ĐANG THUÊ TẠI NHÀ')}
              </span>
            </div>
          </div>

          <!-- KHỐI QUẢN LÝ CỦA STAFF BBCARE (XÁC NHẬN ĐÃ TRẢ HÀNG CHƯA) -->
          <div class="equip-staff-control-box">
            <div class="equip-staff-title">
              <i class="fa-solid fa-user-doctor"></i> QUẢN LÝ BỞI STAFF BBCARE
            </div>
            <div class="equip-staff-name">
              Nhân viên phụ trách: <strong>${escapeHtml(item.assignedStaff || 'KTV BBCare')}</strong> (SĐT: ${item.staffPhone || '1900.1234'})
            </div>

            ${isReturned ? `
              <div style="font-size:12px;color:#166534;font-weight:700;line-height:1.4">
                <i class="fa-solid fa-circle-check" style="color:#16a34a"></i> ${escapeHtml(item.staffCheckNote || 'Đã kiểm tra kỹ thuật đạt chuẩn và thu hồi về kho.')}
                <div style="color:#64748b;font-size:11px;margin-top:2px">Thời gian trả: ${item.returnedDate || 'Đã xác nhận'}</div>
              </div>
            ` : `
              <div style="margin-bottom:8px;font-size:12px;color:#475569">
                ${isWaitingStaff ? '⚠️ Khách đã báo trả. Staff đang trên đường kiểm tra & thu hồi máy.' : '📌 Thiết bị đang sử dụng. Staff sẽ đến nghiệm thu khi hoàn trả.'}
              </div>
              <button type="button" class="btn-staff-confirm-return" onclick="staffConfirmReturn('${item.orderId}')" title="Nhân viên Staff BBCare bấm xác nhận khi đã kiểm tra máy đạt chuẩn">
                <i class="fa-solid fa-clipboard-check"></i> Staff Xác Nhận Đã Nhận Lại Thiết Bị
              </button>
            `}
          </div>

          <!-- NÚT THAO TÁC CỦA KHÁCH HÀNG -->
          ${!isReturned ? `
            <div class="equip-client-actions">
              ${isWaitingStaff ? `
                <button type="button" class="btn-equip-req-return" style="background:#fef3c7;border-color:#fde68a;color:#b45309" disabled>
                  <i class="fa-solid fa-spinner fa-spin"></i> Chờ Thu Hồi
                </button>
              ` : `
                <button type="button" class="btn-equip-req-return" onclick="requestReturnEquipment('${item.orderId}')">
                  <i class="fa-solid fa-truck-ramp-box"></i> Thu Hồi
                </button>
              `}
              <button type="button" class="btn-equip-extend" onclick="extendRental('${item.orderId}')">
                <i class="fa-solid fa-calendar-plus"></i> Gia Hạn Thuê
              </button>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      // ĐƠN HÀNG ĐÃ MUA (TPCN HOẶC VẬT TƯ/THUỐC)
      const isTpcn = (item.itemType === 'tpcn');
      return `
        <div class="equip-card purchased">
          <div class="equip-card-top">
            <img src="${item.img}" alt="${escapeHtml(item.title)}" class="equip-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'">
            <div class="equip-info-head">
              <span class="equip-order-code" style="background:${isTpcn ? '#dcfce7' : '#f1f5f9'};color:${isTpcn ? '#15803d' : '#334155'}">
                ${item.orderId} · ${isTpcn ? 'THỰC PHẨM CHỨC NĂNG' : 'THUỐC & DỤNG CỤ'}
              </span>
              <h4 class="equip-card-title">${escapeHtml(item.title)}</h4>
              <div class="equip-serial-tag"><i class="fa-solid fa-tag"></i> Phân loại: <strong>${escapeHtml(item.categoryName || 'Sản phẩm mua')}</strong></div>
            </div>
          </div>

          <div class="equip-meta-rows">
            <div class="equip-meta-row">
              <span>Ngày mua / Đặt hàng:</span>
              <strong>${item.orderDate || '01/10/2026'}</strong>
            </div>
            <div class="equip-meta-row">
              <span>Số lượng & Đơn giá:</span>
              <strong>${item.quantity || 1} x ${fmt(item.unitPrice || item.totalPrice)} VNĐ</strong>
            </div>
            <div class="equip-meta-row">
              <span>Tổng thanh toán:</span>
              <strong style="color:var(--danger-red)">${fmt(item.totalPrice)} VNĐ</strong>
            </div>
            <div class="equip-meta-row">
              <span>Tình trạng đơn:</span>
              <span class="equip-status-badge delivered">
                <i class="fa-solid fa-circle-check" style="color:#16a34a"></i> ĐÃ GIAO HÀNG TẬN NHÀ
              </span>
            </div>
          </div>

          ${item.usageNote ? `
            <div style="background:#f8fafc;border:1px dashed #cbd5e1;padding:8px 12px;border-radius:10px;font-size:12px;color:#475569;margin-bottom:12px">
              <i class="fa-solid fa-circle-info" style="color:#0284c7"></i> Hướng dẫn dùng: <strong>${escapeHtml(item.usageNote)}</strong>
            </div>
          ` : ''}

          <div class="equip-client-actions">
            <button type="button" class="btn-equip-req-return" onclick="buyAgain('${item.title}', ${item.unitPrice || item.totalPrice}, '${item.img}')" style="width:100%">
              <i class="fa-solid fa-cart-plus"></i> Đặt Mua Lại Sản Phẩm Này
            </button>
          </div>
        </div>
      `;
    }
  }).join('');

  grids.forEach(g => {
    g.innerHTML = cardsHtml;
  });
}

function requestReturnEquipment(orderId) {
  const item = USER_EQUIPMENT_ORDERS.find(x => x.orderId === orderId);
  if (!item) return;

  item.returnStatus = 'WAITING_STAFF';
  if (typeof saveStoredEquipmentOrders === 'function') saveStoredEquipmentOrders();
  renderUserEquipmentList();
  showToast(`Đã gửi yêu cầu thu hồi [${item.title}]! Nhân viên điều phối BBCare sẽ liên hệ bạn.`);
}

function staffConfirmReturn(orderId) {
  const item = USER_EQUIPMENT_ORDERS.find(x => x.orderId === orderId);
  if (!item) return;

  const staffName = prompt('Nhập tên Staff BBCare xác nhận kiểm tra và nhận lại thiết bị:', 'ĐĐ. Trần Thị Mai (KTV Kho BBCare)');
  if (!staffName) return;

  const now = new Date();
  const returnTimeStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  item.status = 'RETURNED';
  item.statusText = 'Đã hoàn trả thiết bị';
  item.returnStatus = 'RETURNED';
  item.returnedDate = returnTimeStr;
  item.assignedStaff = staffName;
  item.staffCheckNote = `Đã kiểm tra kỹ thuật: Thiết bị nguyên vẹn, linh kiện hoạt động tốt, đã vệ sinh vô khuẩn và nhập kho bởi ${staffName}.`;

  renderUserEquipmentList();
  showToast(`Staff [${staffName}] đã xác nhận thu hồi thiết bị [${orderId}] thành công!`);
}

function extendRental(orderId) {
  const item = USER_EQUIPMENT_ORDERS.find(x => x.orderId === orderId);
  if (!item) return;

  const days = prompt(`Gia hạn thuê thêm cho [${item.title}]\nNhập số ngày muốn thuê thêm:`, '7');
  if (!days || isNaN(days) || Number(days) <= 0) return;

  item.durationDays += Number(days);
  item.totalPrice += item.dailyRate * Number(days);
  if (typeof saveStoredEquipmentOrders === 'function') saveStoredEquipmentOrders();
  renderUserEquipmentList();
  showToast(`Đã gia hạn thuê thêm ${days} ngày cho thiết bị [${item.title}]!`);
}

function buyAgain(title, price, img) {
  addToCart(title, price, img);
  navigateTo('cartPage');
}

function bookForSpecificDate(dateStr) {
  if (typeof B !== 'undefined') {
    B.dateStr = dateStr;
    B.step = 1;
    if (typeof renderStep === 'function') renderStep();
  }
  openBooking();
}

function recordVitalsForDay(code, dayIndex) {
  const appt = APPOINTMENTS_HISTORY.find(x => x.code === code);
  if (!appt || !appt.scheduleDays) return;

  const dayObj = appt.scheduleDays.find(d => d.dayIndex === dayIndex) || appt.scheduleDays[0];
  if (!dayObj) return;

  const bp = prompt(`[${dayObj.label}]\nNhập huyết áp do y tá đo được (Ví dụ: 120/80 mmHg):`, '120/80 mmHg');
  if (!bp) return;
  const hr = prompt('Nhập nhịp tim (nhịp/phút):', '75 nhịp/phút');
  if (!hr) return;
  const spo2 = prompt('Nhập nồng độ SpO2 (%):', '98%');
  if (!spo2) return;

  dayObj.vitals = {
    bp: bp,
    hr: hr,
    spo2: spo2,
    measuredAt: `Đo lúc ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2,'0')} bởi ${appt.nurseName}`
  };

  renderProfilePage();
  showToast(`Đã lưu chỉ số sinh hiệu cho [${dayObj.label}]!`);
}

/* =========================================================
   POPUP CHỈ SỐ SINH HIỆU BỆNH NHÂN (MODAL)
========================================================= */
function openVitalsPopupForDate(dateStr) {
  const targetDate = dateStr || selectedProfDate;
  const modal = $('vitalsDetailModal');
  const body = $('vitalsModalBody');
  const dateEl = $('vitalsModalDate');
  if (!modal || !body) return;

  if (dateEl) dateEl.innerText = `Ghi nhận ngày ${safeDmy(targetDate)}`;

  let foundVitals = null;
  let nurseInfo = '';

  APPOINTMENTS_HISTORY.forEach(appt => {
    if (appt.scheduleDays && appt.scheduleDays.length) {
      appt.scheduleDays.forEach(sd => {
        if (sd.date === targetDate && sd.vitals) {
          foundVitals = sd.vitals;
          nurseInfo = appt.nurseName ? `${appt.nurseName} (${appt.service})` : '';
        }
      });
    } else if (appt.dateStr === targetDate && appt.vitals) {
      foundVitals = appt.vitals;
      nurseInfo = appt.nurseName ? `${appt.nurseName} (${appt.service})` : '';
    }
  });

  if (foundVitals) {
    body.innerHTML = `
      <div class="vmd-meta-bar">
        <div><i class="fa-regular fa-clock"></i> Thời điểm đo: <strong>${escapeHtml(foundVitals.measuredAt || 'Trong ca trực')}</strong></div>
        ${nurseInfo ? `<div style="font-size:12px;color:#0284c7;margin-top:3px"><i class="fa-solid fa-user-nurse"></i> Điều dưỡng phụ trách: <strong>${escapeHtml(nurseInfo)}</strong></div>` : ''}
      </div>

      <div class="vmd-grid">
        <div class="vmd-card blood-pressure">
          <div class="vmd-card-top">
            <span class="vmd-card-label">Huyết Áp</span>
            <span class="vmd-card-badge normal">✓ ${escapeHtml(foundVitals.bpStatus || 'Ổn định')}</span>
          </div>
          <div class="vmd-card-num" style="color:#0284c7">${escapeHtml(foundVitals.bp)}</div>
          <div class="vmd-card-sub">Chuẩn y khoa: 110/70 - 130/80 mmHg</div>
        </div>

        <div class="vmd-card heart-rate">
          <div class="vmd-card-top">
            <span class="vmd-card-label">Nhịp Tim / Mạch</span>
            <span class="vmd-card-badge normal">✓ Đều</span>
          </div>
          <div class="vmd-card-num" style="color:#ef4444">${escapeHtml(foundVitals.hr)}</div>
          <div class="vmd-card-sub">Chuẩn nghỉ ngơi: 60 - 90 bpm</div>
        </div>

        <div class="vmd-card spo2">
          <div class="vmd-card-top">
            <span class="vmd-card-label">Nồng Độ SpO2</span>
            <span class="vmd-card-badge normal">✓ Tốt</span>
          </div>
          <div class="vmd-card-num" style="color:#16a34a">${escapeHtml(foundVitals.spo2)}</div>
          <div class="vmd-card-sub">Mức an toàn oxy máu: ≥ 95%</div>
        </div>
      </div>

      <div class="vmd-summary-note">
        <i class="fa-solid fa-stethoscope" style="color:#0284c7;font-size:18px"></i>
        <div>
          <strong style="color:#0f172a;display:block;margin-bottom:2px">Đánh giá chung của Điều dưỡng:</strong>
          <span>Các chỉ số sinh hiệu của bệnh nhân trong ca trực đạt ngưỡng an toàn, nhịp thở đều và đáp ứng chăm sóc tốt.</span>
        </div>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="vmd-empty-box">
        <div class="vmd-empty-ico"><i class="fa-solid fa-heart-pulse"></i></div>
        <h4>Chưa có dữ liệu sinh hiệu cho ngày ${safeDmy(targetDate)}</h4>
        <p>Điều dưỡng phụ trách sẽ tiến hành đo 3 chỉ số sinh hiệu (Huyết áp, Mạch, SpO2) và cập nhật ngay khi đến phục vụ tại nhà.</p>
        <button type="button" class="btn btn-primary" onclick="promptUpdateVitalsCurrentDate()" style="margin-top:14px;padding:9px 20px">
          <i class="fa-solid fa-plus"></i> Nhập Chỉ Số Đo Thủ Công
        </button>
      </div>
    `;
  }

  openModal('vitalsDetailModal');
}

function promptUpdateVitalsCurrentDate() {
  const targetDate = selectedProfDate;
  const bp = prompt(`Nhập huyết áp ngày ${safeDmy(targetDate)} (Ví dụ: 120/80 mmHg):`, '120/80 mmHg');
  if (!bp) return;
  const hr = prompt('Nhập nhịp tim / mạch (nhịp/phút):', '75 nhịp/phút');
  if (!hr) return;
  const spo2 = prompt('Nhập nồng độ SpO2 (%):', '98%');
  if (!spo2) return;

  const newVitals = {
    bp: bp,
    bpStatus: 'Ổn định',
    hr: hr,
    spo2: spo2,
    measuredAt: `Đo lúc ${new Date().getHours()}h${String(new Date().getMinutes()).padStart(2, '0')} (Gia đình cập nhật)`
  };

  let saved = false;
  APPOINTMENTS_HISTORY.forEach(appt => {
    if (appt.scheduleDays && appt.scheduleDays.length) {
      const matchDay = appt.scheduleDays.find(sd => sd.date === targetDate);
      if (matchDay) {
        matchDay.vitals = newVitals;
        saved = true;
      }
    } else if (appt.dateStr === targetDate) {
      appt.vitals = newVitals;
      saved = true;
    }
  });

  if (!saved && APPOINTMENTS_HISTORY.length) {
    if (!APPOINTMENTS_HISTORY[0].scheduleDays) APPOINTMENTS_HISTORY[0].scheduleDays = [];
    APPOINTMENTS_HISTORY[0].scheduleDays.push({
      date: targetDate,
      label: `Ngày ${safeDmy(targetDate)}`,
      status: 'CONFIRMED',
      vitals: newVitals
    });
  }

  renderProfilePage();
  openVitalsPopupForDate(targetDate);
  showToast(`Đã lưu chỉ số sinh hiệu cho ngày ${safeDmy(targetDate)}!`);
}

// =========================================================
// 1. TÍNH NĂNG HỦY CA ĐẶT QUA POPUP XÁC NHẬN CHUYÊN NGHIỆP
// =========================================================
let currentCancellingApptCode = null;

function openCancelAppointmentModal(code) {
  const appt = APPOINTMENTS_HISTORY.find(x => x.code === code);
  if (!appt) return;

  currentCancellingApptCode = code;
  const cCode = $('cancelModalCode'); if (cCode) cCode.innerText = code;
  const cServ = $('cancelModalService'); if (cServ) cServ.innerText = appt.service;
  const cNurse = $('cancelModalNurse'); if (cNurse) cNurse.innerText = `${appt.nurseName} (${appt.nursePhone || 'Hotline'})`;
  const cTime = $('cancelModalTime'); if (cTime) cTime.innerText = `${safeDmy(appt.dateStr || selectedProfDate)} | ${appt.timeRange || appt.duration || 'Ca trực'}`;

  openModal('cancelApptModal');
}

function executeCancelAppointment() {
  if (!currentCancellingApptCode) return;
  const appt = APPOINTMENTS_HISTORY.find(x => x.code === currentCancellingApptCode);
  if (!appt) return;

  appt.status = 'CANCELLED';
  appt.statusText = 'Đã hủy ca';

  if (appt.scheduleDays && appt.scheduleDays.length) {
    const curDay = appt.scheduleDays.find(d => d.date === selectedProfDate);
    if (curDay) curDay.status = 'CANCELLED';
  }

  closeModal('cancelApptModal');
  renderProfilePage();
  showToast(`Đã hủy ca đặt [${currentCancellingApptCode}] thành công! Lịch điều dưỡng đã được cập nhật.`);
}

function cancelAppointment(code) {
  openCancelAppointmentModal(code);
}

// =========================================================
// 2. TÍNH NĂNG CHỈNH SỬA CA ĐẶT QUA POPUP
// =========================================================
let currentEditingApptCode = null;

function openEditAppointmentModal(code) {
  const appt = APPOINTMENTS_HISTORY.find(x => x.code === code);
  if (!appt) return;

  currentEditingApptCode = code;
  const codeEl = $('editApptCode'); if (codeEl) codeEl.innerText = code;
  const servEl = $('editApptService'); if (servEl) servEl.innerText = appt.service;
  const nurseEl = $('editApptNurse'); if (nurseEl) nurseEl.innerText = `${appt.nurseName || 'ĐĐ. Nguyễn Văn Minh'} (SĐT: ${appt.nursePhone || '0908 786 168'})`;
  
  // Điền ngày hẹn
  const dateEl = $('editApptDate');
  if (dateEl) {
    const todayStr = (window.ymd ? window.ymd(new Date()) : new Date().toISOString().split('T')[0]);
    dateEl.min = todayStr;
    const matchSelectedDay = (selectedProfDate && appt.scheduleDays && appt.scheduleDays.some(s => s.date === selectedProfDate));
    dateEl.value = matchSelectedDay ? selectedProfDate : (appt.dateStr || todayStr);
  }

  // Điền khung giờ
  const timeEl = $('editApptTimeRange');
  if (timeEl && appt.timeRange) {
    const optFound = Array.from(timeEl.options).some(o => o.value === appt.timeRange);
    if (optFound) timeEl.value = appt.timeRange;
  }

  // Điền địa chỉ & ghi chú
  const addrEl = $('editApptAddr');
  if (addrEl) addrEl.value = appt.addr || localStorage.getItem('bbcare_user_addr') || 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, TP. Đà Nẵng';

  const notesEl = $('editApptNotes');
  if (notesEl) notesEl.value = appt.notes || '';

  openModal('editAppointmentModal');
}

function handleEditAppointmentSubmit(e) {
  e.preventDefault();
  if (!currentEditingApptCode) return;

  const appt = APPOINTMENTS_HISTORY.find(x => x.code === currentEditingApptCode);
  if (!appt) return;

  const dateVal = $('editApptDate')?.value || '';
  const timeVal = $('editApptTimeRange')?.value || '';
  const addrVal = $('editApptAddr')?.value.trim() || '';
  const notesVal = $('editApptNotes')?.value.trim() || '';

  const oldDate = selectedProfDate;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Hệ thống đang kiểm tra & điều phối y tá...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    appt.dateStr = dateVal;
    appt.timeRange = timeVal;
    appt.time = `${dateVal ? dateVal.split('-').reverse().join('/') : ''} (${timeVal})`;
    appt.addr = addrVal;
    appt.notes = notesVal;

    // Đồng bộ lại lịch trong scheduleDays (nếu có gói nhiều ngày)
    if (appt.scheduleDays && appt.scheduleDays.length) {
      const targetDay = appt.scheduleDays.find(sd => sd.date === oldDate) || appt.scheduleDays[0];
      if (targetDay) {
        targetDay.date = dateVal;
        targetDay.label = `Ngày ${targetDay.dayIndex} - ${dateVal.split('-').reverse().slice(0, 2).join('/')} (${timeVal})`;
      }
    }

    // Tự động chuyển cuốn lịch sang ngày mới vừa chỉnh sửa
    if (dateVal) {
      selectedProfDate = dateVal;
      const parts = dateVal.split('-').map(Number);
      if (parts.length >= 2) {
        profCalYear = parts[0];
        profCalMonth = parts[1] - 1;
      }
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Lưu & Cập Nhật Lịch Hẹn';
      submitBtn.disabled = false;
    }

    closeModal('editAppointmentModal');
    renderProfilePage();
    showToast(`Đã điều chỉnh lịch ca [${currentEditingApptCode}] sang ngày ${safeDmy(dateVal)} thành công!`);
  }, 600);
}

// =========================================================
// QUẢN LÝ ĐÁNH GIÁ & GỬI KHIẾU NẠI KHÁCH HÀNG (CLIENT)
// =========================================================
function setFeedbackRating(stars) {
  stars = Math.max(1, Math.min(5, Number(stars) || 5));
  const hidden = $('custFbRating');
  if (hidden) hidden.value = stars;

  const descMap = {
    1: '1/5 Sao - Rất tệ / Không hài lòng',
    2: '2/5 Sao - Chưa đạt yêu cầu',
    3: '3/5 Sao - Tạm ổn',
    4: '4/5 Sao - Hài lòng',
    5: '5/5 Sao - Rất xuất sắc'
  };

  const textEl = $('custRatingText');
  if (textEl) textEl.innerText = descMap[stars] || `${stars}/5 Sao`;

  const starIcons = document.querySelectorAll('#custStarRatingContainer i');
  starIcons.forEach((icon, idx) => {
    if (idx < stars) {
      icon.style.color = '#f59e0b';
    } else {
      icon.style.color = '#cbd5e1';
    }
  });
}

function openFeedbackModal(refCode, nurseName) {
  const modal = $('feedbackCustomerModal');
  if (!modal) return;

  const targetRefInput = $('custFbTargetRef');
  if (targetRefInput) {
    if (refCode && nurseName) {
      targetRefInput.value = `Ca trực #${refCode} (ĐD. ${nurseName})`;
    } else if (refCode) {
      targetRefInput.value = `Ca trực #${refCode}`;
    } else {
      targetRefInput.value = 'Dịch vụ y tế chăm sóc tại nhà';
    }
  }

  const nameInput = $('custFbName');
  if (nameInput) {
    const curName = (typeof currentUser !== 'undefined' && currentUser.name) ? currentUser.name : (localStorage.getItem('bbcare_user_name') || 'Nguyễn Văn An');
    nameInput.value = curName;
  }

  const phoneInput = $('custFbPhone');
  if (phoneInput) {
    const curPhone = (typeof currentUser !== 'undefined' && currentUser.phone) ? currentUser.phone : (localStorage.getItem('bbcare_user_phone') || '0908786168');
    phoneInput.value = curPhone;
  }

  const contentInput = $('custFbContent');
  if (contentInput) contentInput.value = '';

  const catSelect = $('custFbCategory');
  if (catSelect) catSelect.value = 'Góp ý dịch vụ';

  setFeedbackRating(5);
  modal.style.display = 'flex';
}

function handleCustomerFeedbackSubmit(e) {
  e.preventDefault();
  const category = $('custFbCategory')?.value || 'Góp ý dịch vụ';
  const targetRef = $('custFbTargetRef')?.value.trim() || 'Dịch vụ y tế tại nhà';
  const rating = Number($('custFbRating')?.value) || 5;
  const customerName = $('custFbName')?.value.trim() || 'Khách hàng BBCare';
  const customerPhone = $('custFbPhone')?.value.trim() || '0908786168';
  const content = $('custFbContent')?.value.trim() || '';

  if (!content) {
    alert('Vui lòng nhập nội dung phản hồi hoặc khiếu nại của bạn!');
    return;
  }

  if (typeof addNewFeedback === 'function') {
    const newFb = addNewFeedback({
      category,
      targetRef,
      rating,
      customerName,
      customerPhone,
      content
    });

    closeModal('feedbackCustomerModal');
    alert(`🎉 Cảm ơn bạn!\nBBCare đã tiếp nhận khiếu nại/góp ý mã [#${newFb.id}].\nBan Giám Sát Chất Lượng sẽ liên hệ hỗ trợ bạn qua SĐT ${customerPhone} trong thời gian sớm nhất.`);
    
    // Cập nhật lại danh sách ở accountPage nếu đang xem
    if (typeof renderCustomerFeedbacks === 'function') {
      renderCustomerFeedbacks();
    }
  } else {
    closeModal('feedbackCustomerModal');
    alert('Đã gửi phản hồi thành công!');
  }
}

function renderCustomerFeedbacks() {
  const container = $('accFeedbackListContainer');
  if (!container) return;

  const list = (typeof loadStoredFeedbacks === 'function') ? loadStoredFeedbacks() : (window.FEEDBACKS_DATABASE || []);
  
  if (!list.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:36px 20px;background:#f8fafc;border-radius:14px;border:1px dashed #cbd5e1;">
        <i class="fa-regular fa-comment-dots" style="font-size:36px;color:#94a3b8;margin-bottom:10px;"></i>
        <h4 style="font-size:16px;color:#1e293b;margin-bottom:4px;">Bạn chưa gửi khiếu nại hoặc góp ý nào</h4>
        <p style="font-size:13.5px;color:#64748b;margin:0;">Nếu có bất kỳ điều gì chưa hài lòng về điều dưỡng hay thiết bị, hãy gửi để BBCare hỗ trợ ngay.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="appointment-table">
        <thead>
          <tr>
            <th>Mã phản hồi</th>
            <th>Dịch vụ liên quan</th>
            <th>Loại yêu cầu</th>
            <th>Nội dung gửi</th>
            <th>Đánh giá</th>
            <th>Trạng thái xử lý</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(f => {
            const isPending = f.status === 'pending';
            return `
              <tr>
                <td><strong>#${f.id}</strong><div style="font-size:11px;color:#64748b;">${f.createdAt || ''}</div></td>
                <td><strong>${escapeHtml(f.targetRef)}</strong></td>
                <td><span class="badge-blue" style="font-size:11.5px;padding:3px 8px;border-radius:6px;">${escapeHtml(f.category || 'Góp ý')}</span></td>
                <td style="max-width:240px;font-size:13px;color:#334155;"><em>"${escapeHtml(f.content)}"</em></td>
                <td><span style="color:#f59e0b;font-weight:700;"><i class="fa-solid fa-star"></i> ${f.rating}/5</span></td>
                <td>
                  ${isPending 
                    ? `<span class="badge-warning" style="background:#fef3c7;color:#b45309;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;"><i class="fa-solid fa-clock"></i> Đang chờ xử lý</span>` 
                    : `<span class="badge-success" style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;"><i class="fa-solid fa-check"></i> Đã giải quyết</span>`
                  }
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function rateAppointment(code) {
  openFeedbackModal(code);
}

// 3. CẬP NHẬT CHỈ SỐ SINH HIỆU
function updateVitalsPrompt() {
  const bp = prompt('Nhập huyết áp đo mới (Ví dụ: 125/82 mmHg):', '120/80 mmHg');
  if (!bp) return;
  const hr = prompt('Nhập nhịp tim (nhịp/phút):', '76 nhịp/phút');
  if (!hr) return;
  const spo2 = prompt('Nhập nồng độ SpO2 (%):', '99%');
  if (!spo2) return;

  const elBP = $('profVitalsBP'); if (elBP) elBP.innerText = bp;
  const elHR = $('profVitalsHR'); if (elHR) elHR.innerText = hr;
  const elSpO2 = $('profVitalsSpO2'); if (elSpO2) elSpO2.innerText = spo2;

  showToast('Đã cập nhật chỉ số sinh hiệu mới của bệnh nhân!');
}

/* =========================================================
   6. CHATBOT AI BBAI 24/7
========================================================= */
function toggleBBAIChat(){
  const box = $('bbaiChatBox');
  if(!box) return;
  box.classList.toggle('open');
  if(box.classList.contains('open')){
    const input = $('bbaiInputText');
    if(input) setTimeout(() => input.focus(), 200);
  }
}

function sendBBAIMessage(userText = null){
  const input = $('bbaiInputText');
  const text = (userText || (input ? input.value : '')).trim();
  if(!text) return;
  if(input) input.value = '';

  const msgContainer = $('bbaiChatMessages');
  if(!msgContainer) return;

  // Render tin nhắn của User
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'bbai-msg user';
  userMsgEl.innerHTML = `<div class="bbai-bubble">${escapeHtml(text)}</div>`;
  msgContainer.appendChild(userMsgEl);
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'bbai-msg bot typing';
  typingEl.innerHTML = `<div class="bbai-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  msgContainer.appendChild(typingEl);
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Xử lý phản hồi AI sau 600ms
  setTimeout(() => {
    typingEl.remove();
    let reply = '';
    const lower = text.toLowerCase();

    if(lower.includes('y tá') || lower.includes('đặt ca') || lower.includes('điều dưỡng') || lower.includes('chăm sóc')){
      reply = `Dạ, BBCare cung cấp dịch vụ Điều dưỡng & Y tá chăm sóc tại nhà (thay băng, tiêm truyền, cho ăn ống Sonde, vật lý trị liệu, trực đêm 24/24).<br><br>👉 Bạn có thể <a href="javascript:void(0)" onclick="openBooking();toggleBBAIChat();" style="color:#0284c7;font-weight:800;text-decoration:underline">BẤM VÀO ĐÂY ĐỂ ĐẶT CA Y TÁ</a> ngay ạ!`;
    } else if(lower.includes('cấp cứu') || lower.includes('xe cứu thương') || lower.includes('khẩn cấp')){
      reply = `🚨 <strong>TRƯỜNG HỢP CẤP CỨU KHẨN CẤP:</strong><br>Xe cứu thương BBCare túc trực 24/7 tại Đà Nẵng, có mặt sau 10-15 phút có đầy đủ oxy và máy thở.<br><br>📞 Gọi ngay Hotline: <a href="tel:0908786168" style="color:#ef4444;font-size:16px;font-weight:900">0908.786.168</a> hoặc <a href="javascript:void(0)" onclick="openEmergencyModal();toggleBBAIChat();" style="color:#0284c7;font-weight:800">Đặt xe cấp cứu tại đây</a>!`;
    } else if(lower.includes('oxy') || lower.includes('bình oxy') || lower.includes('máy thở')){
      reply = `💨 <strong>Dịch vụ Oxy Y Tế Tận Nhà:</strong><br>• Bình Oxy 10L: 200.000đ/ngày (kèm đồng hồ & dây thở)<br>• Bình Oxy 40L: 450.000đ/ngày<br>• Máy tạo oxy y tế 5L: 350.000đ/ngày<br>• Bình oxy mini cầm tay: 160.000đ.<br>👉 Xem tại <a href="javascript:void(0)" onclick="navigateTo('storePage');filterStore('oxy');toggleBBAIChat();" style="color:#0284c7;font-weight:800">Mục Thuê Bình Oxy Cửa Hàng</a>.`;
    } else if(lower.includes('giá') || lower.includes('chi phí') || lower.includes('bao nhiêu tiền')){
      reply = `💰 <strong>Bảng giá tham khảo:</strong><br>• Ca trực 2 giờ: từ 160.000đ - 220.000đ<br>• Ca trực ngày (8h): 380.000đ<br>• Ca trực 24/24: 850.000đ/ngày<br>• Đặt theo tuần giảm 8%, theo tháng giảm 15%!`;
    } else if(lower.includes('mua') || lower.includes('thuốc') || lower.includes('huyết áp') || lower.includes('thiết bị')){
      reply = `🩺 Cửa hàng y tế BBCare có sẵn: Máy đo huyết áp Omron, que đo đường huyết, máy xông khí dung, băng y tế Urgo, bao cao su & gel bôi trơn y tế.<br><br>👉 <a href="javascript:void(0)" onclick="navigateTo('storePage');toggleBBAIChat();" style="color:#0284c7;font-weight:800">Bấm để mở Cửa Hàng Y Tế</a> nhé!`;
    } else {
      reply = `Dạ chào bạn! BBAI là trợ lý trí tuệ nhân tạo của BBCare. Tôi có thể hỗ trợ bạn:<br>1. 🩺 <a href="javascript:void(0)" onclick="openBooking();toggleBBAIChat();" style="color:#0284c7;font-weight:800">Đặt ca y tá chăm sóc tại nhà</a><br>2. 🚑 <a href="javascript:void(0)" onclick="openEmergencyModal();toggleBBAIChat();" style="color:#0284c7;font-weight:800">Gọi xe cấp cứu khẩn cấp 24/7</a><br>3. 💨 <a href="javascript:void(0)" onclick="navigateTo('storePage');filterStore('oxy');toggleBBAIChat();" style="color:#0284c7;font-weight:800">Thuê bình oxy tận nhà</a><br>4. 💊 <a href="javascript:void(0)" onclick="navigateTo('storePage');toggleBBAIChat();" style="color:#0284c7;font-weight:800">Mua TPCN & Thiết bị y tế</a>.<br>Bạn cần BBAI hỗ trợ cụ thể thông tin nào ạ?`;
    }

    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'bbai-msg bot';
    botMsgEl.innerHTML = `<div class="bbai-bubble">${reply}</div>`;
    msgContainer.appendChild(botMsgEl);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 500);
}

function sendBBAIQuickPrompt(promptText){
  sendBBAIMessage(promptText);
}

/* KHỞI TẠO */
document.addEventListener('DOMContentLoaded',function(){
  renderProducts(); updateSummary(); initBooking(); renderProfilePage();
  if(localStorage.getItem('bbcare_logged_in') === 'true' || localStorage.getItem('bbcare_user_name')){
    isLoggedIn = true;
    const savedName = localStorage.getItem('bbcare_user_name') || 'Nguyễn Văn An';
    const savedPhone = localStorage.getItem('bbcare_user_phone') || '0908786168';
    const savedAddr = localStorage.getItem('bbcare_user_addr') || 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, Đà Nẵng';

    currentUser.name = savedName;
    currentUser.phone = savedPhone;

    const accLbl = $('accountLabel'); if(accLbl) accLbl.innerText = savedName;
    const avatarChar = $('accAvatarChar'); if(avatarChar) avatarChar.innerText = savedName.charAt(0).toUpperCase();
    const accDisplayName = $('accDisplayName'); if(accDisplayName) accDisplayName.innerText = savedName.toUpperCase();
    const accDisplayPhone = $('accDisplayPhone'); if(accDisplayPhone) accDisplayPhone.innerText = 'SĐT: ' + savedPhone;

    const inputName = $('accInputName'); if(inputName) inputName.value = savedName;
    const inputPhone = $('accInputPhone'); if(inputPhone) inputPhone.value = savedPhone;
    const inputAddr = $('accInputAddr'); if(inputAddr) inputAddr.value = savedAddr;
  }
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('account') === 'true'){
    navigateTo('accountPage');
  }
});

/* =========================================================
   7. TRANG TIN TỨC & CẨM NANG Y TẾ CHUYÊN KHOA
========================================================= */
let currentNewsCategory = 'all';
let currentNewsKeyword = '';

function renderNewsPage(cat, search) {
  if (cat !== undefined) currentNewsCategory = cat;
  if (search !== undefined) currentNewsKeyword = search;

  const container = $('newsArticlesGrid');
  if (!container) return;

  const db = (typeof NEWS_DATABASE !== 'undefined') ? NEWS_DATABASE : [];
  const filtered = db.filter(item => {
    const matchCat = (currentNewsCategory === 'all' || item.catSlug === currentNewsCategory);
    const kw = currentNewsKeyword.trim().toLowerCase();
    const matchSearch = (!kw || item.title.toLowerCase().includes(kw) || item.summary.toLowerCase().includes(kw) || item.category.toLowerCase().includes(kw));
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div class="news-empty-state">
        <i class="fa-regular fa-newspaper"></i>
        <h3>Không tìm thấy bài viết y tế phù hợp</h3>
        <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn chuyên mục bài viết khác.</p>
        <button type="button" class="btn btn-primary" onclick="filterNewsCategory('all')" style="margin-top:12px">Xem tất cả bài viết</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="news-article-card" onclick="openNewsDetail('${item.id}')">
      <div class="news-card-thumb-wrap">
        <img src="${item.img}" alt="${escapeHtml(item.title)}" class="news-card-thumb" onerror="this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'">
        <span class="news-card-badge">${escapeHtml(item.category)}</span>
      </div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(item.date)}</span>
          <span class="dot-sep">•</span>
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(item.readTime)}</span>
        </div>
        <h3 class="news-card-title">${escapeHtml(item.title)}</h3>
        <p class="news-card-excerpt">${escapeHtml(item.summary)}</p>
        <div class="news-card-footer">
          <div class="news-author-info">
            <i class="fa-solid fa-user-doctor"></i>
            <div>
              <strong>${escapeHtml(item.author)}</strong>
              <small>${escapeHtml(item.authorRole || 'Chuyên gia BBCare')}</small>
            </div>
          </div>
          <span class="news-read-more">Đọc bài viết <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </div>
    </article>
  `).join('');
}

function filterNewsCategory(cat, btn) {
  currentNewsCategory = cat;
  if (btn) {
    document.querySelectorAll('.news-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  } else {
    document.querySelectorAll('.news-pill').forEach(b => {
      if (b.getAttribute('onclick')?.includes(`'${cat}'`)) b.classList.add('active');
      else b.classList.remove('active');
    });
  }
  renderNewsPage();
}

function handleNewsSearch(val) {
  currentNewsKeyword = val;
  renderNewsPage();
}

function openNewsDetail(id) {
  const db = (typeof NEWS_DATABASE !== 'undefined') ? NEWS_DATABASE : [];
  const item = db.find(x => x.id === id);
  if (!item) return;

  const modal = $('newsDetailModal');
  if (!modal) return;

  const catEl = $('newsModalCat'); if (catEl) catEl.innerText = item.category;
  const titleEl = $('newsModalTitle'); if (titleEl) titleEl.innerText = item.title;
  const authorEl = $('newsModalAuthor'); if (authorEl) authorEl.innerText = `${item.author} (${item.authorRole || 'BBCare'})`;
  const dateEl = $('newsModalDate'); if (dateEl) dateEl.innerText = item.date;
  const timeEl = $('newsModalReadTime'); if (timeEl) timeEl.innerText = item.readTime;
  const imgEl = $('newsModalImg'); if (imgEl) imgEl.src = item.img;
  const contentEl = $('newsModalContent'); if (contentEl) contentEl.innerHTML = item.content;

  openModal('newsDetailModal');
}

if (typeof window !== 'undefined') {
  window.renderNewsPage = renderNewsPage;
  window.filterNewsCategory = filterNewsCategory;
  window.handleNewsSearch = handleNewsSearch;
  window.openNewsDetail = openNewsDetail;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.openVitalsPopupForDate = openVitalsPopupForDate;
  window.promptUpdateVitalsCurrentDate = promptUpdateVitalsCurrentDate;
  window.openCancelAppointmentModal = openCancelAppointmentModal;
  window.executeCancelAppointment = executeCancelAppointment;
  window.cancelAppointment = cancelAppointment;
  window.openEditAppointmentModal = openEditAppointmentModal;
  window.handleEditAppointmentSubmit = handleEditAppointmentSubmit;
  window.addEquipmentToCart = addEquipmentToCart;
  window.filterStore = filterStore;
  window.switchProfileMainTab = switchProfileMainTab;
  window.switchStoreMainTab = switchStoreMainTab;
  window.filterUserEquipment = filterUserEquipment;
  window.renderUserEquipmentList = renderUserEquipmentList;
  window.requestReturnEquipment = requestReturnEquipment;
  window.staffConfirmReturn = staffConfirmReturn;
  window.extendRental = extendRental;
  window.buyAgain = buyAgain;
  window.filterHomeProducts = filterHomeProducts;
  window.buyNow = buyNow;
  window.renderProducts = renderProducts;
  window.navigateTo = navigateTo;
  window.goHomeAnchor = goHomeAnchor;
  window.openEmergencyModal = openEmergencyModal;
  window.closeEmergencyModal = closeEmergencyModal;
  window.handleAccountClick = handleAccountClick;
  window.openFeedbackModal = openFeedbackModal;
  window.setFeedbackRating = setFeedbackRating;
  window.handleCustomerFeedbackSubmit = handleCustomerFeedbackSubmit;
  window.renderCustomerFeedbacks = renderCustomerFeedbacks;
  window.loadPatientAppointmentHistory = loadPatientAppointmentHistory;
}
