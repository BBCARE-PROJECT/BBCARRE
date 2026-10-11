/* =========================================================
   3. BẢNG TÍNH GIÁ WIZARD ĐẶT CA
========================================================= */
function ymd(off){const d=new Date();d.setDate(d.getDate()+off);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dmy(s){return s?s.split('-').reverse().join('/'):'';}

if (typeof window !== 'undefined') {
  window.ymd = ymd;
  window.dmy = dmy;
}

function resetBooking(){
  let defaultDist = 'Liên Chiểu';
  let defaultAddr = 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, Đà Nẵng';
  let defaultName = 'Nguyễn Văn An';
  let defaultPhone = '0908786168';
  let defaultPayment = 'VIETQR';
  
  if (typeof localStorage !== 'undefined') {
    defaultName = localStorage.getItem('bbcare_user_name') || defaultName;
    defaultPhone = localStorage.getItem('bbcare_user_phone') || defaultPhone;
    defaultAddr = localStorage.getItem('bbcare_user_addr') || defaultAddr;
    defaultPayment = localStorage.getItem('bbcare_user_payment') || defaultPayment;
  }
  
  Object.assign(B,{
    step:1, selectedSkillKeys:[], patient:'WALK', 
    patientAgeGroup:'ELDER', patientExactAge:'', medicalHistory:'',
    patientName:'', isSamePerson:false,
    timingMode:'preset', shiftKey:'CA_2H', shiftChosen:false,
    timeDropdownOpen:false, timeActiveTab:'preset',
    customStartTime:'08:00', customEndTime:'12:00', timeMode:'custom', pickedDates:[], calMonth:new Date().getMonth(), calYear:new Date().getFullYear(), dateStr:ymd(0), customDays:3,
    selectedDaysOfWeek:[1,3,5], monthModeType:'full30',
    customMonthDaysCount:20,
    cardType:'VISA', cardBank:'VCB',
    cardNumber:'', cardHolder:'', cardExpiry:'', cardCvv:'', atmNumber:'', atmHolder:'',
    disc:0, nurseId:'', place:'HOME', paymentMethod:defaultPayment, saveToAccount:true,
    name:defaultName, phone:defaultPhone, addr:defaultAddr, district:defaultDist, userCoords:null, notes:'', code:'',
    nurseAcceptedForThisBooking:false
  });
}

const DISTRICT_COORDS = {
  'Liên Chiểu': { lat: 16.0680, lng: 108.1500 },
  'Hải Châu': { lat: 16.0600, lng: 108.2200 },
  'Thanh Khê': { lat: 16.0630, lng: 108.1850 },
  'Sơn Trà': { lat: 16.0900, lng: 108.2400 },
  'Ngũ Hành Sơn': { lat: 16.0150, lng: 108.2500 },
  'Cẩm Lệ': { lat: 16.0200, lng: 108.1900 }
};

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}

function getNursesSortedByDistance() {
  const userDistrict = B.district || 'Liên Chiểu';
  const userPos = B.userCoords || DISTRICT_COORDS[userDistrict] || DISTRICT_COORDS['Liên Chiểu'];

  return NURSES_DATABASE.map(n => {
    let dist = 1.0;
    if (n.lat && n.lng && userPos) {
      dist = calculateDistanceKm(userPos.lat, userPos.lng, n.lat, n.lng);
      if (n.district === userDistrict && dist < 1.0) dist = 0.8;
      if (dist === 0) dist = 0.8;
    } else {
      dist = n.district === userDistrict ? 0.8 : 4.5;
    }
    const etaMins = Math.round(15 + dist * 2.5);
    return { ...n, distanceKm: dist, etaMins: etaMins, isSameDistrict: n.district === userDistrict };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

function changeUserDistrict(district) {
  B.district = district;
  B.userCoords = DISTRICT_COORDS[district];
  if (!B.addr || B.addr.includes('Đà Nẵng')) {
    B.addr = `Quận ${district}, TP. Đà Nẵng`;
  }
  renderStep();
}

function detectUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        B.userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        let closestDistrict = 'Liên Chiểu';
        let minDist = 9999;
        for (let [distName, coords] of Object.entries(DISTRICT_COORDS)) {
          let d = calculateDistanceKm(pos.coords.latitude, pos.coords.longitude, coords.lat, coords.lng);
          if (d < minDist) { minDist = d; closestDistrict = distName; }
        }
        B.district = closestDistrict;
        alert(`📍 Đã định vị thành công! Vị trí của bạn gần ${closestDistrict} (Đà Nẵng). Đội ngũ y tá đã được tự động sắp xếp theo khoảng cách gần bạn nhất.`);
        renderStep();
      },
      err => {
        alert('Không thể lấy vị trí tự động từ trình duyệt. Bạn có thể chọn quận trực tiếp trong danh sách!');
      }
    );
  } else {
    alert('Trình duyệt không hỗ trợ định vị GPS!');
  }
}

function nurseObj(){return NURSES_DATABASE.find(n=>n.id===B.nurseId);}

function isOnlyHoiLyOrSinhHieuSelected(){
  if(B.selectedSkillKeys.length === 0) return false;
  return B.selectedSkillKeys.every(k => {
    const s = WZ_SKILLS.find(item => item.k === k);
    return s && s.allows24h === true;
  });
}

function calculateBookingPrice(overrideMode = null, overrideDays = null){
  let servicesTotal = 0;
  const serviceBreakdown = [];
  B.selectedSkillKeys.forEach(key => {
    const skill = WZ_SKILLS.find(s => s.k === key);
    if(skill) { servicesTotal += skill.basePrice; serviceBreakdown.push({ name: skill.n, price: skill.basePrice }); }
  });

  let shiftPrice = 0;
  let shiftName = '';
  let totalDays = 1, discountPercent = 0;

  if(B.timingMode === 'custom'){
    shiftName = `Tự chọn (${B.customStartTime} đến ${B.customEndTime})`;
    shiftPrice = 300000;
  } else {
    const shift = SHIFTS_DATA[B.shiftKey] || SHIFTS_DATA.CA_2H;
    shiftName = `${shift.name} (${shift.timeRange})`;
    shiftPrice = shift.price;
  }

  const mode = overrideMode || B.timeMode;
  if(B.shiftKey === 'CA_24H' && B.timingMode === 'preset'){
    totalDays = 1; discountPercent = 0;
  } else {
    if (mode === 'week') { 
      totalDays = (B.selectedDaysOfWeek && B.selectedDaysOfWeek.length > 0) ? B.selectedDaysOfWeek.length : 7; 
      discountPercent = 0.08; 
    }
    else if (mode === 'month') { 
      if(B.monthModeType === 'full30') {
        totalDays = 30;
      } else {
        totalDays = B.customMonthDaysCount || 20;
      }
      discountPercent = 0.15; 
    }
    else if (mode === 'custom') {
      totalDays = overrideDays || (B.pickedDates.length || 1);
      if (totalDays >= 30) discountPercent = 0.15;
      else if (totalDays >= 7) discountPercent = 0.08;
      else if (totalDays >= 3) discountPercent = 0.05;
    }
  }

  const dailyUnitCost = servicesTotal + shiftPrice;
  const rawTotal = dailyUnitCost * totalDays;
  const discountAmount = Math.round(rawTotal * discountPercent);
  const finalTotal = rawTotal - discountAmount;

  return { serviceBreakdown, servicesTotal, shiftPrice, shiftName, dailyUnitCost, totalDays, rawTotal, discountPercent, discountAmount, finalTotal };
}

function openBooking(){
  if(B.step === 5){
    resetBooking();
    renderStep();
  }
  loadServiceDetail('dieuduong');
  setTimeout(()=>scrollToEl('bookingSection'),100);
}

function loadServiceDetail(key){
  const d = SERVICES_DATA[key] || SERVICES_DATA.dieuduong;
  $('detailBannerTitle').innerHTML = d.bannerTitle;
  $('detailMainTitle').innerText = d.title;
  $('detailMainContent').innerHTML = d.content;
  navigateTo('serviceDetailPage');
}

function renderSteps(){
  document.querySelectorAll('#wzSteps li').forEach(li=>{
    const n = Number(li.dataset.step);
    li.className = (n === B.step) ? 'active' : (n < B.step ? 'done' : '');
  });
  $('wzNav').style.display = B.step > 4 ? 'none' : 'flex';$('wzBack').style.visibility = B.step === 1 ? 'hidden' : 'visible';
  const nx = $('wzNext'); nx.textContent = WZ_NEXT[B.step-1] || ''; nx.classList.toggle('final', B.step === 4);
}

function firstWeekDay(){
  return [1,2,3,4,5,6,0].find(d=>B.selectedDaysOfWeek.includes(d));
}
function dowOf(str){ return new Date(str+'T00:00:00').getDay(); }
function nextDatesOfWeekday(wd,count){
  const out=[]; for(let i=0;i<120 && out.length<count;i++){ const s=ymd(i); if(dowOf(s)===wd) out.push(s); } return out;
}
function weekdayLabel(wd){ return wd===0?'Chủ Nhật':'Thứ '+(wd+1); }
function isWeekMode(){ return B.timeMode==='week' && !(B.shiftKey==='CA_24H' && B.timingMode==='preset'); }
function skillsSum(){return B.selectedSkillKeys.reduce((t,k)=>t+((WZ_SKILLS.find(x=>x.k===k)||{}).basePrice||0),0);}
function timeOptions(sel){
  let o='';
  for(let m=0;m<1440;m+=30){ const t=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); o+=`<option value="${t}" ${t===sel?'selected':''}>${t}</option>`; }
  return o;
}
function openNurseProfileModal(nurseId) {
  const n = NURSES_DATABASE.find(x => x.id === nurseId);
  if (!n) return;
  const av = $('modalNurseAvatar'); if(av) av.src = n.avatar;
  const nm = $('modalNurseName'); if(nm) nm.textContent = n.name;
  const sp = $('modalNurseSpec'); if(sp) sp.textContent = n.spec;
  const ex = $('modalNurseExp'); if(ex) ex.textContent = n.exp + ' · ' + n.district;
  const cr = $('modalNurseCerts'); if(cr) cr.textContent = n.certs;
  const sk = $('modalNurseSkills'); if(sk) sk.textContent = n.skills;
  const rv = $('modalNurseReview'); if(rv) rv.textContent = n.topReview;
  const btn = $('modalSelectBtn');
  if(btn){
    btn.onclick = () => {
      B.nurseId = n.id;
      closeModal('nurseProfileModal');
      renderStep();
    };
  }
  openModal('nurseProfileModal');
}

let timeModalActiveTab = 'preset';

function openUnifiedTimeModal(tab = 'preset') {
  timeModalActiveTab = tab;
  renderUnifiedTimeModalContent();
  openModal('timePickerModal');
}

function switchTimeModalTab(tab) {
  timeModalActiveTab = tab;
  renderUnifiedTimeModalContent();
}

function renderUnifiedTimeModalContent() {
  const isPreset = timeModalActiveTab === 'preset';
  const tabPreset = $('tabBtnPreset');
  const tabCustom = $('tabBtnCustom');
  if (tabPreset) tabPreset.classList.toggle('active', isPreset);
  if (tabCustom) tabCustom.classList.toggle('active', !isPreset);

  const body = $('timePickerModalBody');
  if (!body) return;

  if (isPreset) {
    const allow24h = isOnlyHoiLyOrSinhHieuSelected();
    const groups = [
      ['Buổi sáng', ['CA_2H', 'CA_2H_2', 'CA_5H']],
      ['Buổi chiều', ['CA_2H_3', 'CA_2H_4', 'CA_5H_2']],
      ['Buổi tối', ['CA_5H_3']],
      ['Cả ngày / đêm', ['CA_NGAY', 'CA_DEM', 'CA_24H']]
    ];

    let html = `<div class="modal-shifts-scroll">`;
    html += groups.map(([title, keys]) => {
      const full = title.startsWith('Cả');
      const tiles = keys.filter(k => allow24h || !SHIFTS_DATA[k].is24hOnly).map(k => {
        const c = SHIFTS_DATA[k];
        const isSel = B.timingMode === 'preset' && B.shiftChosen && B.shiftKey === k;
        return `
        <button type="button" class="shift-tile-modal ${isSel ? 'sel' : ''}" onclick="selectShiftFromModal('${k}')">
          <div class="stm-title">${full ? c.name : c.timeRange}</div>
          ${full ? `<div class="stm-sub">${c.timeRange}</div>` : ''}
          <div class="stm-price">${fmt(c.price + skillsSum())}đ / ${c.unit}</div>
        </button>`;
      }).join('');
      return `
        <div class="shift-modal-group">
          <div class="shift-modal-group-title">${title}</div>
          <div class="shift-modal-tiles-grid">${tiles}</div>
        </div>`;
    }).join('');
    html += `</div>`;
    body.innerHTML = html;
  } else {
    body.innerHTML = `
      <div class="modal-custom-time-container">
        <p class="modal-custom-desc">
          Bạn có thể tự chọn khung giờ điều dưỡng đến chăm sóc phù hợp với lịch sinh hoạt của gia đình:
        </p>
        <div class="modal-custom-inputs-row">
          <div class="modal-custom-field">
            <label>Giờ bắt đầu:</label>
            <select id="modalCustomStart" class="form-control modal-select-time">
              ${timeOptions(B.customStartTime || '08:00')}
            </select>
          </div>
          <div class="modal-custom-field">
            <label>Giờ kết thúc:</label>
            <select id="modalCustomEnd" class="form-control modal-select-time">
              ${timeOptions(B.customEndTime || '12:00')}
            </select>
          </div>
        </div>
        <button type="button" class="btn-card modal-confirm-btn" onclick="confirmCustomTimeFromModal()">
          <i class="fa-solid fa-check"></i> XÁC NHẬN CHỌN KHUNG GIỜ NÀY
        </button>
      </div>`;
  }
}

function selectShiftFromModal(k) {
  B.shiftKey = k;
  B.timingMode = 'preset';
  B.shiftChosen = true;
  B.timeDropdownOpen = false;
  closeModal('timePickerModal');
  renderStep();
}

function confirmCustomTimeFromModal() {
  const s = $('modalCustomStart');
  const e = $('modalCustomEnd');
  if (s) B.customStartTime = s.value;
  if (e) B.customEndTime = e.value;
  B.timingMode = 'custom';
  B.shiftChosen = true;
  B.timeDropdownOpen = false;
  closeModal('timePickerModal');
  renderStep();
}

function openShiftPickerModal() { openUnifiedTimeModal('preset'); }
function openCustomTimePickerModal() { openUnifiedTimeModal('custom'); }
function openShiftModal() { openUnifiedTimeModal('preset'); }
function renderCalendar(){
  const y=B.calYear, m=B.calMonth, pad=n=>String(n).padStart(2,'0');
  const offset=(new Date(y,m,1).getDay()+6)%7;
  const dim=new Date(y,m+1,0).getDate(), today=ymd(0);
  let cells=['T2','T3','T4','T5','T6','T7','CN'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<offset;i++) cells+='<span></span>';
  for(let d=1;d<=dim;d++){
    const s=`${y}-${pad(m+1)}-${pad(d)}`;
    cells+=`<button type="button" class="cal-day ${B.pickedDates.includes(s)?'sel':''} ${s===today?'today':''}" ${s<today?'disabled':''} data-act="calDay" data-v="${s}">${d}</button>`;
  }
  return `<div class="cal-box">
    <div class="cal-head">
      <button type="button" class="cal-nav" data-act="calPrev">&lt;</button>
      <strong>Tháng ${m+1} / ${y}</strong>
      <button type="button" class="cal-nav" data-act="calNext">&gt;</button>
    </div>
    <div class="cal-grid">${cells}</div>
    <div class="cal-foot">
      <span>Đã chọn: <span style="color:var(--primary-blue)">${B.pickedDates.length} ngày</span></span>
      <button type="button" class="cal-clear" data-act="calClear">Xóa tất cả</button>
    </div>
  </div>`;
}

function renderStep(){
  const p = $('wzPanel'); let h = '';

  let step1BadgeHtml = '';
  if (B.step > 1) {
    const selectedNames = B.selectedSkillKeys.map(k => WZ_SKILLS.find(s=>s.k===k)?.n).filter(Boolean).join(', ') || 'Chưa chọn';
    const patientCond = WZ_PATIENT.find(x=>x[0]===B.patient)?.[1] || 'Tự đi lại';
    step1BadgeHtml = `
      <div class="step1-selected-badge">
        <i class="fa-solid fa-circle-check"></i>
        <div>
          Đã chọn: <strong>${selectedNames}</strong>${B.patientExactAge ? ` | Tuổi: <strong>${B.patientExactAge} tuổi</strong>` : ''} | Tình trạng: <strong>${patientCond}</strong>
          ${B.medicalHistory ? ` | Bệnh lý: <strong>${escapeHtml(B.medicalHistory)}</strong>` : ''}
        </div>
      </div>`;
  }

  if(B.step===1){
    h=`<h3 class="wz-h">Bạn cần dịch vụ theo nhu cầu nào?</h3>
    <p class="wz-sub">Lựa chọn các gói chăm sóc y tế phù hợp với nhu cầu của người bệnh</p>
    
    <div class="wz-grid2">
      ${WZ_SKILLS.map(s => `
        <div class="wz-card ${B.selectedSkillKeys.includes(s.k)?'sel':''}" data-act="toggleSkill" data-v="${s.k}">
          <div class="wz-card-text">
            <h5>${s.n}</h5>
            <span class="d">${s.d}</span>
          </div>
        </div>`).join('')}
    </div>

    <div class="wz-compact-info-row">
      <div class="wz-compact-field wz-age-field">
        <label class="wz-label-compact"><i class="fa-solid fa-cake-candles" style="color:var(--primary-blue)"></i> Tuổi bệnh nhân:</label>
        <input type="number" id="wzExactAge" class="wz-input-compact" placeholder="Ví dụ: 70" value="${escapeHtml(B.patientExactAge || '')}" min="0" max="120">
      </div>
      <div class="wz-compact-field wz-mobility-field">
        <label class="wz-label-compact"><i class="fa-solid fa-person-walking" style="color:var(--primary-blue)"></i> Tình trạng vận động:</label>
        <div class="wz-pills-compact">
          ${WZ_PATIENT.map(x=>`<button type="button" class="wz-chip-compact ${B.patient===x[0]?'sel':''}" data-act="patient" data-v="${x[0]}">${x[1]}</button>`).join('')}
        </div>
      </div>
    </div>

    <div class="wz-compact-field" style="margin-top:6px">
      <label class="wz-label-compact"><i class="fa-solid fa-notes-medical" style="color:var(--primary-blue)"></i> Tiền sử bệnh lý / Lưu ý sức khỏe: <span style="font-size:11.5px;color:var(--text-muted);font-weight:normal">(Không bắt buộc)</span></label>
      <input type="text" id="wzMedicalHistory" class="wz-input-compact" placeholder="Ví dụ: Tiểu đường type 2, cao huyết áp, di chứng tai biến, dị ứng kháng sinh..." value="${escapeHtml(B.medicalHistory || '')}">
    </div>`;
  }
  else if(B.step===2){
    const priceWeek = calculateBookingPrice('week');
    const priceMonth = calculateBookingPrice('month');
    const priceCustom = calculateBookingPrice('custom');
    if(isWeekMode()){ const wd=firstWeekDay(); if(dowOf(B.dateStr)!==wd) B.dateStr=nextDatesOfWeekday(wd,1)[0]; }

    let timeDisplayTitle = 'Chọn thời gian';
    let timeDisplaySub = 'Nhấn vào để chọn Ca trực hoặc Tùy chọn giờ';
    let timeDisplayPrice = '';

    if (B.shiftChosen) {
      if (B.timingMode === 'custom') {
        timeDisplayTitle = `Tự chọn giờ: ${B.customStartTime || '08:00'} – ${B.customEndTime || '12:00'}`;
        timeDisplaySub = 'Chăm sóc theo giờ yêu cầu riêng của gia đình';
        timeDisplayPrice = 'Theo giờ';
      } else {
        const cur = SHIFTS_DATA[B.shiftKey] || SHIFTS_DATA.CA_2H;
        timeDisplayTitle = `${cur.name} · ${cur.timeRange}`;
        timeDisplaySub = 'Khung ca trực chuẩn của BBCare';
        timeDisplayPrice = `${fmt(cur.price + skillsSum())}đ / ${cur.unit}`;
      }
    }

    h = step1BadgeHtml + `
    <h3 class="wz-h">Chọn thời gian & tần suất đặt lịch</h3>

    <div class="wz-label" style="margin-top:0">① Khung giờ chăm sóc:</div>
    <div class="shift-trigger ${B.timeDropdownOpen ? 'active' : ''} ${!B.shiftChosen ? 'empty' : ''}" data-act="toggleTimeDropdown" style="cursor:pointer;margin-bottom:6px;border:1.5px solid ${B.timeDropdownOpen ? '#0284c7' : (!B.shiftChosen ? '#0284c7' : '#bae6fd')};background:${B.timeDropdownOpen ? '#f0f9ff' : (!B.shiftChosen ? '#f0f9ff' : '#ffffff')};padding:7px 12px;border-radius:10px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <i class="fa-regular fa-clock" style="font-size:15px;color:var(--primary-blue)"></i>
        <div>
          <h5 style="margin:0;font-size:13.5px;color:var(--navy-dark);font-weight:800;line-height:1.2">${timeDisplayTitle}</h5>
          <span style="font-size:11px;color:var(--text-muted)">${timeDisplaySub}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${timeDisplayPrice ? `<span style="font-size:13px;font-weight:900;color:var(--danger-red)">${timeDisplayPrice}</span>` : ''}
        <span class="shift-arrow" style="font-size:12px;color:var(--primary-blue)">${B.timeDropdownOpen ? '▲' : '▼'}</span>
      </div>
    </div>`;

    if (B.timeDropdownOpen) {
      h += `
      <div class="time-two-bars-dropdown" style="padding:6px;gap:5px;margin-bottom:8px">
        <button type="button" class="time-bar-btn" data-act="openPresetModal" style="padding:7px 10px">
          <div class="tbb-left" style="gap:8px">
            <div class="tbb-icon" style="width:28px;height:28px;font-size:13px"><i class="fa-solid fa-calendar-check"></i></div>
            <div class="tbb-info">
              <span class="tbb-title" style="font-size:13px">Ca trực cố định</span>
              <span class="tbb-sub" style="font-size:11px">Khung ca sáng, chiều, tối hoặc cả ngày</span>
            </div>
          </div>
          <div class="tbb-action">
            <span class="tbb-badge" style="font-size:10.5px;padding:2px 8px">Chọn ca</span>
            <i class="fa-solid fa-chevron-right" style="font-size:10px"></i>
          </div>
        </button>

        <button type="button" class="time-bar-btn" data-act="openCustomModal" style="padding:7px 10px">
          <div class="tbb-left" style="gap:8px">
            <div class="tbb-icon" style="width:28px;height:28px;font-size:13px"><i class="fa-solid fa-sliders"></i></div>
            <div class="tbb-info">
              <span class="tbb-title" style="font-size:13px">Giờ tự chọn</span>
              <span class="tbb-sub" style="font-size:11px">Tự do chỉnh giờ bắt đầu & kết thúc</span>
            </div>
          </div>
          <div class="tbb-action">
            <span class="tbb-badge" style="font-size:10.5px;padding:2px 8px">Tự chỉnh giờ</span>
            <i class="fa-solid fa-chevron-right" style="font-size:10px"></i>
          </div>
        </button>
      </div>`;
    }

    if(B.shiftKey !== 'CA_24H' || B.timingMode === 'custom'){
      h+=`<div class="wz-label" style="margin-top:4px">② Chọn thời hạn / Tần suất chăm sóc:</div>
      <div class="time-options-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px">
        <div class="time-opt-card ${B.timeMode==='custom'?'sel':''}" data-act="timeMode" data-v="custom" style="border:1.5px solid ${B.timeMode==='custom'?'#0284c7':'#e2e8f0'};border-radius:9px;padding:6px 6px;text-align:center;cursor:pointer;background:${B.timeMode==='custom'?'#f0f9ff':'#fff'}">
          <h5 style="font-size:12.5px;font-weight:800;margin:0">Chọn ngày trên lịch</h5>
          <span style="font-size:12.5px;font-weight:900;color:var(--danger-red);display:block;margin-top:2px">${fmt(priceCustom.finalTotal)}đ</span>
        </div>
        <div class="time-opt-card ${B.timeMode==='week'?'sel':''}" data-act="timeMode" data-v="week" style="border:1.5px solid ${B.timeMode==='week'?'#0284c7':'#e2e8f0'};border-radius:9px;padding:6px 6px;text-align:center;cursor:pointer;background:${B.timeMode==='week'?'#f0f9ff':'#fff'}">
          <h5 style="font-size:12.5px;font-weight:800;margin:0">Theo Tuần <span style="font-size:10px;font-weight:800;color:#16a34a">(-8%)</span></h5>
          <span style="font-size:12.5px;font-weight:900;color:var(--danger-red);display:block;margin-top:2px">${fmt(priceWeek.finalTotal)}đ</span>
        </div>
        <div class="time-opt-card ${B.timeMode==='month'?'sel':''}" data-act="timeMode" data-v="month" style="border:1.5px solid ${B.timeMode==='month'?'#0284c7':'#e2e8f0'};border-radius:9px;padding:6px 6px;text-align:center;cursor:pointer;background:${B.timeMode==='month'?'#f0f9ff':'#fff'}">
          <h5 style="font-size:12.5px;font-weight:800;margin:0">Theo Tháng <span style="font-size:10px;font-weight:800;color:#16a34a">(-15%)</span></h5>
          <span style="font-size:12.5px;font-weight:900;color:var(--danger-red);display:block;margin-top:2px">${fmt(priceMonth.finalTotal)}đ</span>
        </div>
      </div>`;

      if(B.timeMode==='week'){
        const daysMap = [{v:1, l:'Thứ 2'}, {v:2, l:'Thứ 3'}, {v:3, l:'Thứ 4'}, {v:4, l:'Thứ 5'}, {v:5, l:'Thứ 6'}, {v:6, l:'Thứ 7'}, {v:0, l:'Chủ Nhật'}];
        h+=`<div class="custom-days-box" style="background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:10px;padding:10px;margin-bottom:8px">
          <label style="font-size:12px;font-weight:800;display:block;margin-bottom:6px;color:var(--primary-dark)">Chọn các thứ điều dưỡng đến:</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${daysMap.map(d=>`
              <button type="button" class="wz-chip ${B.selectedDaysOfWeek.includes(d.v)?'sel':''}" data-act="toggleDayOfWeek" data-v="${d.v}" style="padding:4px 8px;font-size:11.5px">${d.l}</button>
            `).join('')}
          </div>
        </div>`;
      }

      if(B.timeMode==='month'){
        h+=`<div class="custom-days-box" style="background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:10px;padding:10px;margin-bottom:8px">
          <div style="display:flex;gap:8px;margin-bottom:6px">
            <button type="button" class="wz-chip ${B.monthModeType==='full30'?'sel':''}" data-act="monthType" data-v="full30" style="flex:1;padding:6px;font-size:11.5px">Trọn gói 30 ngày</button>
            <button type="button" class="wz-chip ${B.monthModeType==='customMonthDays'?'sel':''}" data-act="monthType" data-v="customMonthDays" style="flex:1;padding:6px;font-size:11.5px">Chọn số ngày</button>
          </div>`;
          if(B.monthModeType==='customMonthDays'){
            h+=`<div style="display:flex;align-items:center;gap:6px">
              <label style="font-size:11.5px;font-weight:700">Số ngày:</label>
              <input type="number" id="wzCustomMonthDaysInput" class="custom-days-input" value="${B.customMonthDaysCount}" min="1" max="31" style="width:55px;padding:3px 6px">
              <span style="font-size:11.5px;font-weight:800">Ngày</span>
            </div>`;
          }
        h+=`</div>`;
      }

      if(B.timeMode==='custom'){ h+=renderCalendar(); }
    }

    if(isWeekMode()){
      const wd=firstWeekDay();
      h+=`<div class="wz-label">③ Ngày bắt đầu (${weekdayLabel(wd)})</div>
      <div class="wz-row">${nextDatesOfWeekday(wd,6).map(d=>`<button type="button" class="wz-chip ${B.dateStr===d?'sel':''}" data-act="weekDate" data-v="${d}" style="padding:4px 8px;font-size:12px">${weekdayLabel(wd)}, ${dmy(d).slice(0,5)}</button>`).join('')}</div>`;
    } else if(B.timeMode!=='custom' || (B.shiftKey==='CA_24H' && B.timingMode==='preset')) h+=`<div class="wz-label">③ Ngày bắt đầu phục vụ</div>
    <div class="wz-row">
      <input type="date" id="wzDate" class="wz-input" value="${B.dateStr}" min="${ymd(0)}" style="padding:6px 10px;font-size:13px">
      ${[['Hôm nay',0],['Ngày mai',1],['Ngày kia',2]].map(x=>`<button type="button" class="wz-chip ${B.dateStr===ymd(x[1])?'sel':''}" data-act="qdate" data-v="${x[1]}" style="padding:5px 10px;font-size:12px">${x[0]}</button>`).join('')}
    </div>`;
  }


  else if(B.step===3){
    const allSortedNurses = getNursesSortedByDistance();
    const query = (B.nurseSearchQuery || '').trim().toLowerCase();
    const sortedNurses = allSortedNurses.filter(n => {
      if (!query) return true;
      return (
        n.name.toLowerCase().includes(query) ||
        (n.spec && n.spec.toLowerCase().includes(query)) ||
        (n.skills && n.skills.toLowerCase().includes(query)) ||
        (n.certs && n.certs.toLowerCase().includes(query)) ||
        (n.district && n.district.toLowerCase().includes(query))
      );
    });

    if(!B.nurseId && sortedNurses.length > 0) {
      B.nurseId = sortedNurses[0].id;
    }
    const currentDistrict = B.district || 'Liên Chiểu';
    const districts = ['Liên Chiểu', 'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Cẩm Lệ'];

    h = step1BadgeHtml + `
    <h3 class="wz-h">Lựa chọn Người chăm sóc</h3>
    
    <div class="nurse-location-bar">
      <div class="nurse-loc-left">
        <i class="fa-solid fa-location-dot nurse-pin-icon"></i>
        <div>
          <span class="nurse-loc-lbl">Khu vực cần điều dưỡng đến chăm sóc:</span>
          <select id="userDistrictSelect" class="nurse-loc-select" onchange="changeUserDistrict(this.value)">
            ${districts.map(d=>`<option value="${d}" ${d===currentDistrict?'selected':''}>Quận ${d} (Đà Nẵng)</option>`).join('')}
          </select>
        </div>
      </div>
      <button type="button" class="btn-gps-detect" onclick="detectUserLocation()" title="Tự động quét tọa độ hiện tại">
        <i class="fa-solid fa-crosshairs"></i> Định vị gần tôi
      </button>
    </div>

    <!-- THANH TÌM KIẾM Y TÁ THEO TÊN / CHUYÊN KHOA -->
    <div class="nurse-search-box-row">
      <div class="nurse-search-input-wrap">
        <i class="fa-solid fa-magnifying-glass search-ico"></i>
        <input type="text" id="nurseSearchInput" class="nurse-search-input" placeholder="Tìm theo tên y tá, chuyên khoa (vết mổ, Sonde, thở oxy, PHCN...)..." value="${escapeHtml(B.nurseSearchQuery || '')}" oninput="handleNurseSearch(this.value)">
        ${B.nurseSearchQuery ? `<button type="button" class="clear-nurse-search-btn" onclick="clearNurseSearch()"><i class="fa-solid fa-xmark"></i></button>` : ''}
      </div>
      <span class="nurse-count-badge">Có <strong>${sortedNurses.length}</strong> y tá</span>
    </div>

    <div class="nurse-vertical-list-scroll">
      ${sortedNurses.length > 0 ? sortedNurses.map((n, idx)=>`
        <div class="nurse-row-card ${B.nurseId===n.id ? 'sel' : ''}" data-act="nurse" data-v="${n.id}">
          <div class="nrc-left">
            <img src="${n.avatar}" class="nrc-avatar" alt="${n.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1594824813576-905ffeb52317?auto=format&fit=crop&q=80&w=300'">
            <div class="nrc-info">
              <div class="nrc-name-line">
                <h5 class="nrc-name">${n.name}</h5>
                ${idx === 0 && !query ? '<span class="nearest-tag"><i class="fa-solid fa-bolt"></i> GẦN NHẤT</span>' : ''}
              </div>
              <div class="nrc-meta">
                <span class="nrc-rating"><i class="fa-solid fa-star"></i> ${n.rating} (${n.reviewsCount} đánh giá)</span>
                <span class="nrc-sep">·</span>
                <span class="nrc-exp">${n.exp}</span>
                <span class="nrc-sep">·</span>
                <span class="nrc-dist"><i class="fa-solid fa-location-dot"></i> Cách ${n.distanceKm} km</span>
              </div>
            </div>
          </div>
          <button type="button" class="nrc-btn-profile" data-act="profile" data-v="${n.id}">Xem hồ sơ</button>
        </div>
      `).join('') : `
        <div class="nurse-search-empty" style="text-align:center;padding:30px 20px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:12px;margin-top:10px">
          <i class="fa-solid fa-user-slash" style="font-size:32px;color:#94a3b8;margin-bottom:8px;display:block"></i>
          <p style="font-size:13.5px;color:#64748b;font-weight:700;margin:0 0 10px">Không tìm thấy điều dưỡng nào phù hợp với từ khóa "${escapeHtml(B.nurseSearchQuery)}"</p>
          <button type="button" class="btn" style="background:#e0f2fe;color:#0284c7;font-weight:800;padding:6px 16px;border-radius:8px" onclick="clearNurseSearch()">Xóa tìm kiếm</button>
        </div>
      `}
    </div>`;
  }
  else if(B.step===4){
    if(!B.addr && B.district){
      B.addr = `Quận ${B.district}, TP. Đà Nẵng`;
    }
    const calc = calculateBookingPrice();

    h = step1BadgeHtml + `
    <h3 class="wz-h">Thông tin người bệnh & Thanh toán</h3>
    <p class="wz-sub">Dịch vụ điều dưỡng & hộ lý chăm sóc tận nhà riêng của BBCare</p>

    <!-- FORM THÔNG TIN GỌN GÀNG, SẠCH SẼ, DỄ NHÌN -->
    <div class="step4-clean-card">
      <div class="step4-form-grid">
        <div class="s4-field">
          <label class="wz-label">Họ và tên người bệnh *</label>
          <input type="text" id="wzPatientName" class="wz-input" placeholder="Ví dụ: Cụ bà Nguyễn Thị Mai" value="${escapeHtml(B.patientName || '')}">
        </div>

        <div class="s4-field">
          <label class="wz-label">Họ tên người liên hệ đặt ca *</label>
          <input id="wzName" class="wz-input" placeholder="Nhập họ tên của bạn" value="${escapeHtml(B.name)}">
        </div>

        <div class="s4-field">
          <label class="wz-label">Số điện thoại liên hệ *</label>
          <input id="wzPhone" class="wz-input" placeholder="Ví dụ: 0908786168" value="${escapeHtml(B.phone)}">
        </div>

        <div class="s4-field full">
          <label class="wz-label">Địa chỉ chăm sóc tận nhà *</label>
          <input id="wzAddr" class="wz-input" placeholder="Ví dụ: Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, Đà Nẵng" value="${escapeHtml(B.addr)}">
        </div>
      </div>

      <div class="s4-save-acc">
        <label class="wz-check-label">
          <input type="checkbox" id="wzSaveToAccount" ${B.saveToAccount ? 'checked' : ''}>
          <span>Lưu thông tin này vào tài khoản cho lần đặt sau</span>
        </label>
        ${(typeof localStorage !== 'undefined' && localStorage.getItem('bbcare_logged_in')==='true') ? '<span class="autofill-tag"><i class="fa-solid fa-bolt"></i> Đã điền từ tài khoản</span>' : ''}
      </div>

      <!-- PHƯƠNG THỨC THANH TOÁN -->
      <!-- PHƯƠNG THỨC THANH TOÁN (HÀNG NGANG 4 Ô) -->
      <div class="step4-sub-heading">
        <i class="fa-solid fa-credit-card"></i> Phương thức thanh toán:
      </div>

      <div class="payment-methods-grid">
        ${WZ_PAYMENTS.map(pm => `
          <div class="payment-card-opt ${B.paymentMethod === pm.id ? 'sel' : ''}" data-act="payMethod" data-v="${pm.id}">
            <div class="pco-top-row">
              <div class="pco-icon"><i class="fa-solid ${pm.icon}"></i></div>
              <div class="pco-check">
                ${B.paymentMethod === pm.id ? '<i class="fa-solid fa-circle-check"></i>' : '<span class="nac-radio"></span>'}
              </div>
            </div>
            <div class="pco-info">
              <div class="pco-title">${pm.name}</div>
              <span class="pco-badge ${pm.id}">${pm.tag}</span>
              <div class="pco-desc">${pm.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- CHI TIẾT THEO PHƯƠNG THỨC -->
      ${B.paymentMethod === 'VIETQR' ? `
        <div class="payment-detail-box vietqr-box">
          <div class="pdb-left">
            <div class="qr-big-container">
              <img src="https://api.vietqr.io/image/970422-0908786168-compact2.png?amount=${calc.finalTotal}&addInfo=BBCARE%20DAT%20CA&accountName=CONG%20TY%20HOMECARE%20BBCARE" alt="VietQR" class="qr-preview-img-large" onerror="this.onerror=null;this.src='https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=BBCARE_MBBANK_0908786168_${calc.finalTotal}'">
              <div class="qr-scan-guide"><i class="fa-solid fa-camera"></i> Quét bằng mọi App Ngân hàng</div>
            </div>
          </div>
          <div class="pdb-right">
            <h5 class="pdb-title"><i class="fa-solid fa-qrcode"></i> Quét mã VietQR chuyển khoản liên ngân hàng 24/7</h5>
            <div class="pdb-row"><span>Ngân hàng:</span> <strong>MB Bank (Ngân hàng Quân Đội)</strong></div>
            <div class="pdb-row">
              <span>Số tài khoản:</span> 
              <strong style="color:var(--primary-blue);font-size:16px;letter-spacing:1px">0908 786 168</strong> 
              <button type="button" class="btn-copy-sm" onclick="navigator.clipboard.writeText('0908786168');alert('Đã sao chép số tài khoản MB Bank!');">Sao chép STK</button>
            </div>
            <div class="pdb-row"><span>Chủ tài khoản:</span> <strong>CONG TY TNHH HOMECARE BBCARE</strong></div>
            <div class="pdb-row">
              <span>Số tiền thanh toán:</span> 
              <strong style="color:var(--danger-red);font-size:17px;font-weight:900">${fmt(calc.finalTotal)} VNĐ</strong>
            </div>
            <div class="pdb-row">
              <span>Nội dung chuyển khoản:</span> 
              <strong style="color:var(--navy-dark);background:#f1f5f9;padding:3px 8px;border-radius:6px;border:1px dashed #94a3b8;font-size:13.5px">BBCARE DAT CA</strong>
              <button type="button" class="btn-copy-sm" onclick="navigator.clipboard.writeText('BBCARE DAT CA');alert('Đã sao chép nội dung chuyển khoản!');">Sao chép ND</button>
            </div>
            <div class="pdb-hint">
              <i class="fa-solid fa-shield-halved"></i> Hệ thống tự động kiểm tra giao dịch & xác nhận trong 30 giây ngay sau khi chuyển khoản.
            </div>
          </div>
        </div>
      ` : ''}

      ${B.paymentMethod === 'MOMO' ? `
        <div class="payment-detail-box momo-box">
          <div class="pdb-left">
            <div class="qr-big-container" style="border-color:#fbcfe8">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=2|99|0908786168|CONG_TY_BBCARE|bbcare@gmail.com|0|0|${calc.finalTotal}|BBCARE_CA_TRUC" class="qr-preview-img-large" alt="MoMo QR" onerror="this.onerror=null;">
              <div class="qr-scan-guide" style="color:#be185d"><i class="fa-solid fa-wallet"></i> Quét bằng Ví MoMo</div>
            </div>
          </div>
          <div class="pdb-right">
            <h5 class="pdb-title" style="color:#a50064"><i class="fa-solid fa-wallet"></i> Thanh toán siêu tốc qua Ví MoMo</h5>
            <div class="pdb-row"><span>Ví MoMo nhận:</span> <strong>0908.786.168 (Homecare BBCare)</strong></div>
            <div class="pdb-row"><span>Chủ tài khoản:</span> <strong>CONG TY TNHH HOMECARE BBCARE</strong></div>
            <div class="pdb-row"><span>Số tiền thanh toán:</span> <strong style="color:var(--danger-red);font-size:17px;font-weight:900">${fmt(calc.finalTotal)} VNĐ</strong></div>
            <div class="pdb-row">
              <span>Nội dung chuyển:</span> 
              <strong style="color:var(--navy-dark);background:#fce7f3;padding:3px 8px;border-radius:6px;border:1px dashed #f472b6;font-size:13.5px">BBCARE CA TRUC</strong>
              <button type="button" class="btn-copy-sm" onclick="navigator.clipboard.writeText('BBCARE CA TRUC');alert('Đã sao chép nội dung MoMo!');">Sao chép ND</button>
            </div>
            <div class="pdb-hint" style="color:#be185d"><i class="fa-solid fa-bolt"></i> Mở ứng dụng MoMo, bấm <strong>"Quét Mã"</strong> để quét mã QR và hoàn tất thanh toán.</div>
          </div>
        </div>
      ` : ''}

      ${B.paymentMethod === 'CARD' ? `
        <div class="payment-detail-box card-box realistic-card-container">
          <div class="card-type-tabs">
            <button type="button" class="card-tab-btn ${B.cardType === 'VISA' ? 'active' : ''}" data-act="cardType" data-v="VISA">
              <i class="fa-brands fa-cc-visa"></i> Thẻ Quốc Tế (Visa / MasterCard / JCB)
            </button>
            <button type="button" class="card-tab-btn ${B.cardType === 'NAPAS' ? 'active' : ''}" data-act="cardType" data-v="NAPAS">
              <i class="fa-solid fa-building-columns"></i> Thẻ ATM Nội Địa (Napas 40+ Ngân Hàng)
            </button>
          </div>

          ${B.cardType === 'VISA' ? `
            <div class="card-visa-layout">
              <!-- MÔ PHỎNG THẺ TÍN DỤNG CHÂN THỰC -->
              <div class="realistic-credit-card">
                <div class="rcc-top">
                  <div class="rcc-chip">
                    <span class="chip-line"></span>
                    <span class="chip-line"></span>
                  </div>
                  <div class="rcc-wireless"><i class="fa-solid fa-wifi"></i></div>
                  <div class="rcc-brand-logo"><i class="fa-brands fa-cc-visa"></i></div>
                </div>
                <div class="rcc-number">
                  ${B.cardNumber ? escapeHtml(B.cardNumber) : '•••• •••• •••• ••••'}
                </div>
                <div class="rcc-bottom">
                  <div class="rcc-holder">
                    <span class="rcc-label">CHỦ THẺ / CARDHOLDER</span>
                    <span class="rcc-val">${escapeHtml((B.cardHolder || B.name || 'NGUYEN VAN AN').toUpperCase())}</span>
                  </div>
                  <div class="rcc-expiry">
                    <span class="rcc-label">HẠN DÙNG</span>
                    <span class="rcc-val">${escapeHtml(B.cardExpiry || '12/28')}</span>
                  </div>
                </div>
              </div>

              <!-- FORM NHẬP THÔNG TIN THẺ QUỐC TẾ CHUẨN THỰC TẾ -->
              <div class="card-form-fields">
                <div class="cff-field">
                  <label class="cff-label">Số thẻ tín dụng / ghi nợ *</label>
                  <div class="cff-input-wrap">
                    <input type="text" id="cardNumInput" class="wz-input" placeholder="4123 4567 8901 2345" maxlength="19" value="${escapeHtml(B.cardNumber || '')}">
                    <div class="cff-card-icons">
                      <i class="fa-brands fa-cc-visa" style="color:#1e40af"></i>
                      <i class="fa-brands fa-cc-mastercard" style="color:#ea580c"></i>
                      <i class="fa-brands fa-cc-jcb" style="color:#0284c7"></i>
                    </div>
                  </div>
                </div>

                <div class="cff-field">
                  <label class="cff-label">Tên in trên thẻ (chữ không dấu) *</label>
                  <input type="text" id="cardNameInput" class="wz-input" placeholder="Ví dụ: NGUYEN VAN AN" style="text-transform:uppercase" value="${escapeHtml(B.cardHolder || '')}">
                </div>

                <div class="cff-row-2">
                  <div class="cff-field">
                    <label class="cff-label">Ngày hết hạn (MM/YY) *</label>
                    <input type="text" id="cardExpInput" class="wz-input" placeholder="MM/YY" maxlength="5" value="${escapeHtml(B.cardExpiry || '')}">
                  </div>
                  <div class="cff-field">
                    <label class="cff-label">Mã bảo mật CVV / CVC *</label>
                    <input type="password" id="cardCvvInput" class="wz-input" placeholder="•••" maxlength="4" value="${escapeHtml(B.cardCvv || '')}">
                  </div>
                </div>

                <div class="card-security-badges">
                  <span class="csb-badge"><i class="fa-solid fa-shield-halved"></i> PCI-DSS Level 1</span>
                  <span class="csb-badge"><i class="fa-solid fa-lock"></i> SSL 256-Bit</span>
                  <span class="csb-badge"><i class="fa-solid fa-key"></i> 3D-Secure OTP</span>
                </div>
              </div>
            </div>
          ` : `
            <!-- THẺ ATM NỘI ĐỊA NAPAS -->
            <div class="card-napas-layout">
              <label class="cff-label">Chọn ngân hàng phát hành thẻ ATM của bạn:</label>
              <div class="napas-banks-grid">
                ${[
                  { code: 'VCB', name: 'Vietcombank' },
                  { code: 'MB', name: 'MB Bank' },
                  { code: 'TCB', name: 'Techcombank' },
                  { code: 'BIDV', name: 'BIDV' },
                  { code: 'CTG', name: 'VietinBank' },
                  { code: 'ACB', name: 'ACB' },
                  { code: 'VPB', name: 'VPBank' },
                  { code: 'TPB', name: 'TPBank' }
                ].map(b => `
                  <div class="napas-bank-card ${B.cardBank === b.code ? 'sel' : ''}" data-act="cardBank" data-v="${b.code}">
                    <div class="nbc-name">${b.name}</div>
                  </div>
                `).join('')}
              </div>

              <div class="cff-field" style="margin-top:12px">
                <label class="cff-label">Số thẻ ATM Napas (in trên mặt thẻ) *</label>
                <div class="cff-input-wrap">
                  <input type="text" id="atmNumInput" class="wz-input" placeholder="Ví dụ: 9704 •••• •••• ••••" maxlength="19" value="${escapeHtml(B.atmNumber || '')}">
                  <span class="napas-tag-badge">NAPAS</span>
                </div>
              </div>

              <div class="cff-field">
                <label class="cff-label">Tên in trên thẻ (In hoa không dấu) *</label>
                <input type="text" id="atmNameInput" class="wz-input" placeholder="Ví dụ: NGUYEN VAN AN" style="text-transform:uppercase" value="${escapeHtml(B.atmHolder || '')}">
              </div>

              <div class="napas-notice-box">
                <i class="fa-solid fa-shield-halved" style="color:var(--primary-blue);font-size:18px"></i>
                <div>
                  <strong>Xác thực bảo mật Smart OTP:</strong> Giao dịch được bảo vệ trực tiếp bởi hệ thống Napas và cổng Internet Banking ngân hàng của bạn.
                </div>
              </div>
            </div>
          `}
        </div>
      ` : ''}

      ${B.paymentMethod === 'COD' ? `
        <div class="payment-detail-box cod-box">
          <i class="fa-solid fa-hand-holding-dollar" style="font-size:26px;color:#15803d"></i>
          <div style="font-size:13.5px;color:#166534">
            <strong>Thanh toán trực tiếp bằng tiền mặt:</strong> Bạn sẽ gửi tiền trực tiếp cho Điều dưỡng / Y tá sau khi hoàn tất ca trực và nghiệm thu dịch vụ tại nhà.
          </div>
        </div>
      ` : ''}
    </div>`;
  }
  else {
    const calc = calculateBookingPrice();
    const pm = WZ_PAYMENTS.find(p=>p.id===B.paymentMethod) || WZ_PAYMENTS[0];
    h=`<div class="wz-done">
      <div class="ok"><i class="fa-solid fa-check"></i></div>
      <h3 class="wz-h">Đặt ca thành công!</h3>
      <div class="code">Mã đơn: ${B.code}</div>
      <div class="done-details-box">
        <div class="dd-row"><span>Người bệnh:</span> <strong>${escapeHtml(B.patientName || 'Chưa ghi')}</strong></div>
        <div class="dd-row"><span>Người liên hệ:</span> <strong>${escapeHtml(B.name)} (${escapeHtml(B.phone)})</strong></div>
        <div class="dd-row"><span>Địa chỉ:</span> <strong>${escapeHtml(B.addr)}</strong></div>
        <div class="dd-row"><span>Phương thức thanh toán:</span> <strong style="color:var(--primary-blue)">${pm.name}</strong></div>
        <div class="dd-row"><span>Tổng thanh toán:</span> <strong style="color:var(--danger-red);font-size:18px">${fmt(calc.finalTotal)} VNĐ</strong></div>
      </div>
      <p class="wz-sub" style="margin-top:12px;color:#0284c7;font-weight:700">
        <i class="fa-solid fa-microchip"></i> Thuật toán tự động xếp lịch BBCare đang phân tích bán kính GPS & kỹ năng chuyên môn để chốt điều dưỡng tối ưu nhất cho bạn.
      </p>
      <button type="button" class="btn-card" style="width:auto;padding:12px 24px;margin-top:15px" data-act="viewProfile">Xem lịch hẹn của tôi</button>
    </div>`;
  }

  p.innerHTML = h; renderSteps(); renderSummary();
}

function renderSummary(){
  const summaryBox = $('wzSummaryBox');
  const layoutGrid = $('wzLayoutGrid');
  if(!summaryBox || !layoutGrid) return;

  if (B.step === 4 || B.step === 5) {
    summaryBox.classList.add('show');
    layoutGrid.classList.add('has-summary');
  } else {
    summaryBox.classList.remove('show');
    layoutGrid.classList.remove('has-summary');
  }

  const calc = calculateBookingPrice();
  const nurse = nurseObj();
  const pm = WZ_PAYMENTS.find(p=>p.id===B.paymentMethod) || WZ_PAYMENTS[0];

  let durationText = '1 Ca';
  if (B.shiftKey !== 'CA_24H' || B.timingMode === 'custom') {
    if (B.timeMode === 'week') {
      const daysName = [...(B.selectedDaysOfWeek||[])].sort().map(d => d===0 ? 'CN' : `Thứ ${d+1}`).join(', ');
      durationText = `Theo tuần (${daysName || 'Chưa chọn thứ'})`;
    }
    else if (B.timeMode === 'month') {
      durationText = B.monthModeType === 'full30' ? 'Trọn gói 30 ngày' : `Theo tháng (${B.customMonthDaysCount} ngày tùy chọn)`;
    }
    else if (B.timeMode === 'custom') durationText = B.pickedDates.length ? `${B.pickedDates.length} ngày: ${B.pickedDates.map(d=>dmy(d).slice(0,5)).join(', ')}` : 'Chưa chọn ngày';
  }

  const row = (l, v) => `<div class="wz-sr"><span>${l}</span><strong class="${v?'':'empty'}">${v||'Chưa chọn'}</strong></div>`;
  let skillNames = B.selectedSkillKeys.map(k => WZ_SKILLS.find(s=>s.k===k)?.n).filter(Boolean).join(', ');

  $('wzSummaryRows').innerHTML = 
    row('Người bệnh', B.patientName || 'Chưa nhập') +
    row('Dịch vụ đã chọn', skillNames) +
    row('Gói ca trực', calc.shiftName) +
    row('Lịch trình', durationText) +
    row('Ngày bắt đầu', dmy(B.dateStr)) +
    row('Người chăm sóc', nurse ? nurse.name : 'BBCare chỉ định') +
    row('Thanh toán', pm.name);

  let priceBreakdownHtml = `<div style="font-weight:800;font-size:12px;margin-bottom:6px;color:var(--primary-blue)">BẢNG GIÁ DỊCH VỤ:</div>`;
  calc.serviceBreakdown.forEach(item => {
    priceBreakdownHtml += `<div class="wz-price-item"><span>+ ${item.name}</span><strong>${fmt(item.price)} VNĐ</strong></div>`;
  });
  priceBreakdownHtml += `<div class="wz-price-item"><span>+ Phí ca trực (${calc.shiftName})</span><strong>${fmt(calc.shiftPrice)} VNĐ</strong></div>`;
  if(calc.totalDays > 1) {
    priceBreakdownHtml += `<div class="wz-price-item"><span>+ Tổng số buổi</span><strong>x ${calc.totalDays} buổi</strong></div>`;
  }

  $('wzPriceBreakdown').innerHTML = priceBreakdownHtml;
  $('wzTotal').textContent = fmt(calc.finalTotal) + ' VNĐ';
  $('wzDiscount').textContent = calc.discountAmount > 0 ? `Đã ưu đãi giảm ${fmt(calc.discountAmount)} VNĐ` : '';
}

function syncCurrentStepInputs() {
  const pName = $('wzPatientName'); if(pName) B.patientName = pName.value.trim();
  const name = $('wzName'); if(name) B.name = name.value.trim();
  const phone = $('wzPhone'); if(phone) B.phone = phone.value.trim();
  const addr = $('wzAddr'); if(addr) B.addr = addr.value.trim();
  const exactAge = $('wzExactAge'); if(exactAge) B.patientExactAge = exactAge.value.trim();
  const medHist = $('wzMedicalHistory'); if(medHist) B.medicalHistory = medHist.value.trim();
  const saveAcc = $('wzSaveToAccount'); if(saveAcc) B.saveToAccount = saveAcc.checked;
}

function wzValidate(step){
  if(step===1 && B.selectedSkillKeys.length === 0) return 'Vui lòng chọn ít nhất 1 dịch vụ theo nhu cầu.';
  if(step===2 && B.timingMode==='custom' && (!B.customStartTime || !B.customEndTime || B.customStartTime===B.customEndTime)) return 'Vui lòng chọn giờ bắt đầu và giờ kết thúc.';
  if(step===2 && B.timingMode==='preset' && !B.shiftChosen) return 'Vui lòng chọn khung giờ.';
  if(step===2 && !B.dateStr) return 'Vui lòng chọn ngày bắt đầu.';
  if(step===2 && isWeekMode() && dowOf(B.dateStr)!==firstWeekDay()) return 'Ngày bắt đầu phải trùng với '+weekdayLabel(firstWeekDay())+'.';
  if(step===2 && B.timeMode==='custom' && !(B.shiftKey==='CA_24H' && B.timingMode==='preset') && B.pickedDates.length===0) return 'Vui lòng tích chọn ít nhất 1 ngày trên lịch.';
  if(step===3 && !B.nurseId) return 'Vui lòng chọn người chăm sóc trong danh sách.';
  if(step===4){
    if(!B.patientName || !B.patientName.trim()) return 'Vui lòng nhập họ và tên của người bệnh.';
    if(!B.name || !B.name.trim() || !B.phone || !B.phone.trim() || !B.addr || !B.addr.trim()){
      return 'Vui lòng điền đầy đủ họ tên người liên hệ, số điện thoại và địa chỉ chăm sóc.';
    }
  }
  return '';
}

function showErr(m){const e=$('wzError');e.innerHTML='<i class="fa-solid fa-circle-exclamation"></i> '+m;e.classList.add('show');}
function hideErr(){$('wzError').classList.remove('show');}
function goStep(n){B.step=n;hideErr();renderStep();$('bookingSection').scrollIntoView({behavior:'smooth',block:'start'});}

let nurseWaitingTimer = null;

function wzNext(){
  syncCurrentStepInputs();
  const err = wzValidate(B.step); if(err){showErr(err);return;}
  hideErr(); 
  if(B.step===3 && !B.nurseAcceptedForThisBooking){
    openNurseWaitingModal();
    return;
  }
  if(B.step===4) submitBooking(); 
  else goStep(B.step+1);
}

function openNurseWaitingModal(){
  const nurse = nurseObj();
  if(!nurse) { goStep(4); return; }

  const modal = $('nurseWaitingModal');
  if(!modal) { goStep(4); return; }

  const av = $('waitingNurseAvatar'); if(av) av.src = nurse.avatar;
  const nm = $('waitingNurseName'); if(nm) nm.innerText = nurse.name;
  const dist = $('waitingNurseDistance'); if(dist) dist.innerHTML = `<i class="fa-solid fa-location-dot"></i> Cách bạn ${nurse.distanceKm} km · ${nurse.rating} ⭐`;
  
  const pend = $('nurseWaitingStatePending'); if(pend) pend.style.display = 'block';
  const acc = $('nurseWaitingStateAccepted'); if(acc) acc.style.display = 'none';
  const t = $('waitingModalTitle'); if(t) t.innerText = 'ĐANG KẾT NỐI ĐIỀU DƯỠNG...';
  const sub = $('waitingModalSub'); if(sub) sub.innerText = 'Phát tín hiệu trực tiếp đến Nurse App của ' + nurse.name;
  
  modal.style.display = 'flex';

  clearTimeout(nurseWaitingTimer);
  nurseWaitingTimer = setTimeout(() => {
    simulateNurseAccept();
  }, 3500);
}

function simulateNurseAccept(){
  clearTimeout(nurseWaitingTimer);
  const nurse = nurseObj();
  B.nurseAcceptedForThisBooking = true;

  const pend = $('nurseWaitingStatePending'); if(pend) pend.style.display = 'none';
  const acc = $('nurseWaitingStateAccepted'); if(acc) acc.style.display = 'block';
  const t = $('waitingModalTitle'); if(t) t.innerText = '✓ Y TÁ ĐÃ NHẬN CA!';
  const sub = $('waitingModalSub'); if(sub) sub.innerText = 'Kết nối thành công với Nurse App';
  const desc = $('acceptedNurseDesc');
  if(desc) {
    desc.innerHTML = `<strong>${nurse ? nurse.name : 'Điều dưỡng'}</strong> đã xem thông tin ca trực và bấm <strong>"Xác nhận nhận ca"</strong> trên Nurse App. Mời quý khách chuyển sang bước Thanh toán để hoàn tất.`;
  }
}

function cancelNurseWaiting(){
  clearTimeout(nurseWaitingTimer);
  B.nurseAcceptedForThisBooking = false;
  closeModal('nurseWaitingModal');
}

function proceedToPaymentStep(){
  closeModal('nurseWaitingModal');
  goStep(4);
}

function submitBooking(){
  syncCurrentStepInputs();
  if(B.saveToAccount){
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bbcare_user_name', B.name);
      localStorage.setItem('bbcare_user_phone', B.phone);
      localStorage.setItem('bbcare_user_addr', B.addr);
      localStorage.setItem('bbcare_user_payment', B.paymentMethod);
    }
    if(typeof currentUser !== 'undefined') {
      currentUser.name = B.name;
      currentUser.phone = B.phone;
    }
  }
  B.code = 'APP-' + Math.floor(1000 + Math.random() * 9000);

  // Ghi nhận lịch hẹn vào Hồ sơ sức khỏe của bệnh nhân
  if (typeof APPOINTMENTS_HISTORY !== 'undefined') {
    const serviceNames = B.selectedSkillKeys.map(k => WZ_SKILLS.find(s=>s.k===k)?.n).filter(Boolean).join(', ') || 'Chăm sóc y tế tại nhà';
    const nurseObj = NURSES_DATABASE.find(n => n.id === B.nurseId);
    const assignedNurse = nurseObj ? nurseObj.name : 'ĐĐ. Phạm Thanh Hà';
    const shiftDuration = B.shiftKey === 'CA_24H' ? 'Ca 24/24 Giờ' : (B.customStartTime ? `${B.customStartTime} - ${B.customEndTime}` : 'Ca 2 giờ (08:00 - 10:00)');
    const calc = calculateBookingPrice();

    let daysList = [];
    if(calc.totalDays > 1 && B.pickedDates && B.pickedDates.length) {
      daysList = B.pickedDates.map((d, i) => ({
        dayIndex: i + 1,
        date: d,
        label: `Ngày ${i + 1} - ${dmy(d).slice(0,5)} (${shiftDuration})`,
        status: i === 0 ? 'UPCOMING' : 'UPCOMING',
        statusText: i === 0 ? 'Sắp trực' : 'Chưa diễn ra',
        vitals: null
      }));
    } else {
      daysList = [
        {
          dayIndex: 1,
          date: B.dateStr,
          label: `${dmy(B.dateStr)} (${shiftDuration})`,
          status: 'UPCOMING',
          statusText: 'Sắp trực',
          vitals: null
        }
      ];
    }

    const newAppt = {
      code: B.code,
      patientName: B.patientName || B.name || 'Nguyễn Văn An',
      service: serviceNames + (calc.totalDays > 1 ? ` (Gói ${calc.totalDays} ngày)` : ''),
      nurseName: assignedNurse,
      nurseTitle: nurseObj?.title || 'Cử nhân Điều dưỡng ĐH Y Dược Đà Nẵng',
      nursePhone: nurseObj?.phone || '0908 786 168',
      nurseTasks: [
        'Mang đầy đủ trang thiết bị y tế chuyên dụng đã tiệt trùng đến tận nhà đúng giờ hẹn',
        `Thực hiện đúng quy trình chuyên môn kỹ thuật: ${serviceNames}`,
        'Theo dõi liên tục diễn biến sức khỏe, nhịp thở và trạng thái tinh thần của bệnh nhân',
        'Đo kiểm tra các chỉ số sinh hiệu (Huyết áp, Mạch tim, SpO2) sau ca chăm sóc',
        'Dặn dò người nhà cách chăm sóc an toàn và ghi chép nhật ký theo dõi trước khi rời ca'
      ],
      duration: shiftDuration,
      time: `${dmy(B.dateStr)} (${shiftDuration})`,
      dateStr: B.dateStr,
      timeRange: shiftDuration,
      addr: B.addr || 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, TP. Đà Nẵng',
      notes: B.medicalHistory || '',
      status: 'CONFIRMED',
      statusText: 'Đã chốt ca · Y tá đã nhận',
      amount: calc.finalTotal,
      rating: 0,
      totalDays: calc.totalDays,
      scheduleDays: daysList
    };
    APPOINTMENTS_HISTORY.unshift(newAppt);
    if (typeof saveStoredAppointments === 'function') {
      saveStoredAppointments();
    }

    // 🚀 FETCH API: Gửi thông tin đặt ca lên Backend Spring Boot lưu vào Database SQL Server
    const bookingPayload = {
      patientName: B.patientName || B.name || 'Nguyễn Văn An',
      patientPhone: B.phone || '',
      patientAddress: B.addr || '',
      serviceName: serviceNames + (calc.totalDays > 1 ? ` (Gói ${calc.totalDays} ngày)` : ''),
      appointmentDate: B.dateStr || new Date().toISOString().slice(0, 10),
      timeSlot: shiftDuration,
      notes: B.medicalHistory || '',
      price: calc.finalTotal || 0,
      nurse: (B.nurseId && B.nurseId !== 'none') ? { id: B.nurseId } : null
    };

    fetch('/api/appointments/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingPayload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.appointment) {
        console.log('>> [Backend API] Đã lưu ca hẹn vào Database SQL Server thành công:', data.appointment);
        if (data.appointment.code) {
          B.code = data.appointment.code;
          newAppt.code = data.appointment.code;
          const codeEl = document.querySelector('.wz-step5-box .code, .wz-success-card .code, .step-5 .code');
          if (codeEl) codeEl.textContent = `Mã đơn: ${data.appointment.code}`;
        }
        if (typeof saveStoredAppointments === 'function') {
          saveStoredAppointments();
        }
      }
    })
    .catch(err => {
      console.warn('>> [Fetch API Warning] Không thể kết nối API /api/appointments/book (Đang dùng offline):', err);
    });
  }

  goStep(5);
}

function initBooking(){
  resetBooking(); renderStep();
  $('wzPanel').addEventListener('click',e=>{
    if(e.target.matches && e.target.matches('input[type="time"],input[type="date"]')){ try{ e.target.showPicker(); }catch(_){} }
    const el=e.target.closest('[data-act]'); if(!el)return;
    const v=el.dataset.v, a=el.dataset.act; hideErr();
    if(a==='toggleSkill'){
      if(B.selectedSkillKeys.includes(v)) B.selectedSkillKeys = B.selectedSkillKeys.filter(k => k !== v);
      else B.selectedSkillKeys.push(v);
      if(B.shiftKey === 'CA_24H' && !isOnlyHoiLyOrSinhHieuSelected()){
        B.shiftKey = 'CA_2H'; B.shiftChosen = false;
      }
    }
    else if(a==='ageGroup') B.patientAgeGroup=v;
    else if(a==='patient') B.patient=v;
    else if(a==='timingMode') B.timingMode=v;
    else if(a==='shift') B.shiftKey=v;
    else if(a==='timeMode') B.timeMode=v;
    else if(a==='monthType') B.monthModeType=v;
    else if(a==='toggleDayOfWeek'){
      const dayNum = Number(v);
      if(B.selectedDaysOfWeek.includes(dayNum)) {
        if(B.selectedDaysOfWeek.length > 1) B.selectedDaysOfWeek = B.selectedDaysOfWeek.filter(d => d !== dayNum);
      } else {
        B.selectedDaysOfWeek.push(dayNum);
      }
    }
    else if(a==='qdate') B.dateStr=ymd(Number(v));
    else if(a==='weekDate') B.dateStr=v;
    else if(a==='calDay'){
      B.pickedDates = B.pickedDates.includes(v) ? B.pickedDates.filter(x=>x!==v) : [...B.pickedDates, v];
      B.pickedDates.sort();
      B.dateStr = B.pickedDates[0] || ymd(0);
    }
    else if(a==='calPrev'){ B.calMonth--; if(B.calMonth<0){B.calMonth=11;B.calYear--;} }
    else if(a==='calNext'){ B.calMonth++; if(B.calMonth>11){B.calMonth=0;B.calYear++;} }
    else if(a==='calClear'){ B.pickedDates=[]; }
    else if(a==='nurse'){
      if(B.nurseId !== v) {
        B.nurseId = v;
        B.nurseAcceptedForThisBooking = false;
      }
    }
    else if(a==='profile'){
      B.nurseId = v;
      openNurseProfileModal(v);
      return;
    }
    else if(a==='place') B.place=v;
    else if(a==='payMethod') B.paymentMethod=v;
    else if(a==='cardType'){ B.cardType=v; }
    else if(a==='cardBank'){ B.cardBank=v; }
    else if(a==='toggleSamePerson'){
      syncCurrentStepInputs();
      B.isSamePerson = !B.isSamePerson;
      if(B.isSamePerson){
        B.patientName = B.name;
      }
    }
    else if(a==='viewProfile'){
      resetBooking();
      renderStep();
      navigateTo('profilePage');
      return;
    }
    else if(a==='openShift' || a==='toggleTimeDropdown'){
      B.timeDropdownOpen = !B.timeDropdownOpen;
    }
    else if(a==='openPresetModal' || a==='openShiftPopup'){
      openUnifiedTimeModal('preset');
      return;
    }
    else if(a==='openCustomModal' || a==='openCustomTimePopup'){
      openUnifiedTimeModal('custom');
      return;
    }
    renderStep();
  });

  const handleTimeInput = e => {
    if(e.target.id==='wzCustomDaysInput'){
      let val = parseInt(e.target.value, 10);
      if(isNaN(val) || val < 1) val = 1;
      B.customDays = val;
      renderSummary();
    }
    if(e.target.id==='wzCustomMonthDaysInput'){
      let val = parseInt(e.target.value, 10);
      if(isNaN(val) || val < 1) val = 1;
      if(val > 31) val = 31;
      B.customMonthDaysCount = val;
      renderSummary();
    }
    if(e.target.id==='inlineCustomStart' || e.target.id==='customStart') B.customStartTime = e.target.value;
    if(e.target.id==='inlineCustomEnd' || e.target.id==='customEnd') B.customEndTime = e.target.value;
    if(e.target.id==='wzDate') B.dateStr = e.target.value;

    if(e.target.id==='cardNumInput') {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 16);
      let v = raw.replace(/(.{4})/g, '$1 ').trim();
      B.cardNumber = v;
      e.target.value = v;
      const elNum = document.querySelector('.rcc-number');
      if(elNum) elNum.textContent = v || '•••• •••• •••• ••••';
    }
    if(e.target.id==='cardNameInput') {
      B.cardHolder = e.target.value.toUpperCase();
      const elHolder = document.querySelector('.rcc-holder .rcc-val');
      if(elHolder) elHolder.textContent = B.cardHolder || 'NGUYEN VAN AN';
    }
    if(e.target.id==='cardExpInput') {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
      let v = raw;
      if(raw.length >= 3) v = raw.substring(0,2) + '/' + raw.substring(2,4);
      B.cardExpiry = v;
      e.target.value = v;
      const elExp = document.querySelector('.rcc-expiry .rcc-val');
      if(elExp) elExp.textContent = v || '12/28';
    }
    if(e.target.id==='cardCvvInput') {
      B.cardCvv = e.target.value.replace(/\D/g, '').substring(0, 4);
      e.target.value = B.cardCvv;
    }
    if(e.target.id==='atmNumInput') {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 19);
      let v = raw.replace(/(.{4})/g, '$1 ').trim();
      B.atmNumber = v;
      e.target.value = v;
    }
    if(e.target.id==='atmNameInput') {
      B.atmHolder = e.target.value.toUpperCase();
    }

    const m={
      wzName:'name',
      wzPhone:'phone',
      wzAddr:'addr',
      wzPatientName:'patientName',
      wzExactAge:'patientExactAge',
      wzMedicalHistory:'medicalHistory'
    }[e.target.id];
    if(m) {
      B[m]=e.target.value;
      if(e.target.id === 'wzName' && B.isSamePerson) {
        B.patientName = B.name;
        const pInput = $('wzPatientName');
        if(pInput) pInput.value = B.patientName;
      }
      renderSummary();
    }
    if(e.target.id==='wzSaveToAccount') B.saveToAccount = e.target.checked;
    if(e.target.id==='wzSamePerson') {
      B.isSamePerson = e.target.checked;
      if(B.isSamePerson) {
        B.patientName = B.name;
        const pInput = $('wzPatientName');
        if(pInput) pInput.value = B.patientName;
      }
      renderSummary();
    }
  };
  $('wzPanel').addEventListener('input', handleTimeInput);
  $('wzPanel').addEventListener('change', handleTimeInput);

  $('wzNext').addEventListener('click',wzNext);$('wzBack').addEventListener('click',()=>{if(B.step>1)goStep(B.step-1);});
}

function handleNurseSearch(val) {
  B.nurseSearchQuery = val;
  renderStep();
  const inp = $('nurseSearchInput');
  if (inp) {
    inp.focus();
    inp.setSelectionRange(inp.value.length, inp.value.length);
  }
}

function clearNurseSearch() {
  B.nurseSearchQuery = '';
  renderStep();
}

if (typeof window !== 'undefined') {
  window.handleNurseSearch = handleNurseSearch;
  window.clearNurseSearch = clearNurseSearch;
  window.openBooking = openBooking;
  window.initBooking = initBooking;
}

