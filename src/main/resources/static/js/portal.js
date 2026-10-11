/**
 * BBCare Homecare - Bộ máy điều hành các Cổng: Điều Dưỡng, Nhân Viên Vận Hành, Quản Trị
 */

// Toast notification
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'danger') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="font-size: 18px; color: ${type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Modal helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Tab navigation
function switchTab(tabId, el) {
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) {
        target.classList.add('active');
    }

    if (el) {
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(l => l.classList.remove('active'));
        el.classList.add('active');

        const topbarTitle = document.getElementById('topbarPageTitle');
        if (topbarTitle) {
            const linkText = el.querySelector('.sidebar-link-content span');
            if (linkText) {
                topbarTitle.innerText = linkText.innerText;
            }
        }
    }

    const sidebar = document.querySelector('.portal-sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.portal-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Logout
function logoutPortal(roleName) {
    if (confirm(`Bạn có chắc chắn muốn đăng xuất khỏi Cổng ${roleName}?`)) {
        localStorage.removeItem('bbcare_role');
        window.location.href = 'login.html';
    }
}

// Global click dismiss modal
window.addEventListener('click', function(e) {
    if (e.target.classList && e.target.classList.contains('portal-modal')) {
        e.target.classList.remove('active');
    }
});


/* ==========================================================================
   1. ĐIỀU DƯỠNG VIÊN (NURSE) LOGIC
   ========================================================================== */

function acceptBooking(requestId, patientName) {
    if (confirm(`Bạn có chắc chắn muốn TIẾP NHẬN ca trực của bệnh nhân ${patientName}?`)) {
        const row = document.getElementById(`request-row-${requestId}`);
        if (row) {
            row.style.display = 'none';
        }
        showToast(`Đã tiếp nhận thành công ca trực #${requestId} (${patientName})!`, 'success');
        updateRequestBadge(-1);
    }
}

function openRejectModal(requestId, patientName) {
    document.getElementById('rejectModalRequestId').value = requestId;
    document.getElementById('rejectModalPatientName').innerText = patientName;
    openModal('rejectBookingModal');
}

function submitRejectBooking(e) {
    e.preventDefault();
    const reqId = document.getElementById('rejectModalRequestId').value;
    const reason = document.getElementById('rejectReason').value;
    
    const row = document.getElementById(`request-row-${reqId}`);
    if (row) {
        row.style.display = 'none';
    }
    closeModal('rejectBookingModal');
    showToast(`Đã từ chối ca trực #${reqId}. Lý do: ${reason}. Hệ thống sẽ điều phối y tá khác.`, 'warning');
    updateRequestBadge(-1);
}

function updateRequestBadge(delta) {
    const badges = document.querySelectorAll('.request-count-badge');
    badges.forEach(b => {
        let count = parseInt(b.innerText) || 0;
        count = Math.max(0, count + delta);
        b.innerText = count;
    });
}

function viewPatientDetail(patient) {
    document.getElementById('pDetailName').innerText = patient.name;
    document.getElementById('pDetailAgeGender').innerText = `${patient.age} tuổi • ${patient.gender}`;
    document.getElementById('pDetailPhone').innerText = patient.phone;
    document.getElementById('pDetailAddress').innerText = patient.address;
    document.getElementById('pDetailCondition').innerText = patient.condition;
    document.getElementById('pDetailInstructions').innerText = patient.instructions;
    document.getElementById('pDetailDoctor').innerText = patient.doctor || 'BS. Lê Hoàng Quân';
    document.getElementById('pDetailContactPerson').innerText = patient.contactPerson || 'Con gái';
    
    const callBtn = document.getElementById('pDetailCallBtn');
    if (callBtn) callBtn.href = `tel:${patient.phone}`;

    openModal('patientDetailModal');
}

function openContactClientModal(clientName, phone) {
    document.getElementById('contactModalClientName').innerText = clientName;
    document.getElementById('contactModalPhone').innerText = phone;
    document.getElementById('contactCallLink').href = `tel:${phone}`;
    openModal('contactClientModal');
}

function sendQuickMessage(msg) {
    showToast(`Đã gửi tin nhắn tới người nhà: "${msg}"`, 'success');
    closeModal('contactClientModal');
}

function openHealthStatusModal(shiftId, patientName) {
    document.getElementById('healthModalShiftId').value = shiftId;
    document.getElementById('healthModalPatientName').innerText = patientName;
    openModal('updateHealthModal');
}

function submitHealthStatus(e) {
    e.preventDefault();
    const patientName = document.getElementById('healthModalPatientName').innerText;
    const bp = document.getElementById('healthBP').value;
    const hr = document.getElementById('healthHR').value;
    const spo2 = document.getElementById('healthSpO2').value;
    const temp = document.getElementById('healthTemp').value;

    // Đồng bộ lên 4 thẻ chỉ số sinh hiệu lớn
    const dispBp = document.getElementById('vitalDisplayBp');
    const dispHr = document.getElementById('vitalDisplayHr');
    const dispSpo2 = document.getElementById('vitalDisplaySpo2');
    const dispTemp = document.getElementById('vitalDisplayTemp');

    if (dispBp && bp) dispBp.innerText = bp;
    if (dispHr && hr) dispHr.innerText = hr;
    if (dispSpo2 && spo2) dispSpo2.innerText = spo2;
    if (dispTemp && temp) dispTemp.innerText = temp;

    closeModal('updateHealthModal');
    showToast(`Đã cập nhật chỉ số sinh hiệu cho ${patientName}: Huyết áp ${bp}, Mạch ${hr} bpm, SpO2 ${spo2}%, Thân nhiệt ${temp}°C`, 'success');
}

function confirmCompleteTodayShift(shiftId, patientName) {
    if (!confirm(`Xác nhận ĐÃ HOÀN THÀNH ca trực hôm nay cho bệnh nhân ${patientName}?\n\nHệ thống sẽ chốt thời gian và tự động ghi nhận thù lao vào tài khoản của bạn.`)) {
        return;
    }

    // Cập nhật huy hiệu trạng thái ca trực ở Tab 3
    const targetBadge = document.getElementById(`status-badge-${shiftId}`) || document.getElementById('status-badge-current');
    if (targetBadge) {
        targetBadge.className = 'shift-status-pill completed';
        targetBadge.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #16a34a; font-size: 16px;"></i> <span>Ca trực hôm nay đã hoàn thành</span>';
    }

    // Cập nhật huy hiệu ở Dashboard (nếu có)
    const dashBadge = document.getElementById('status-badge-101');
    if (dashBadge) {
        dashBadge.className = 'badge-status badge-completed';
        dashBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã hoàn thành ca';
    }

    // Cập nhật nút xác nhận ở Tab 3 thành banner hoàn tất
    const actionArea = document.getElementById('shiftCompletionActionArea');
    if (actionArea) {
        const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        actionArea.innerHTML = `
            <div class="completed-today-badge-banner">
                <i class="fa-solid fa-circle-check" style="font-size: 24px;"></i>
                <div>
                    <div><strong>ĐÃ XÁC NHẬN HOÀN THÀNH CA HÔM NAY</strong></div>
                    <small style="opacity: 0.9;">Ghi nhận chốt ca lúc: ${timeNow}</small>
                </div>
            </div>
        `;
    }

    try {
        localStorage.setItem('bbcare_shift_completed_' + shiftId, 'true');
    } catch(err) {
        console.warn(err);
    }

    showToast(`Tuyệt vời! Ca trực hôm nay của ${patientName} đã hoàn thành. Thù lao đã được cộng vào ví cá nhân.`, 'success');
}

function updateServiceStatus(shiftId, newStatus) {
    const statusMap = {
        'traveling': { text: 'Đang di chuyển', class: 'badge-ongoing', icon: 'fa-motorcycle' },
        'arrived': { text: 'Đã đến nơi', class: 'badge-confirmed', icon: 'fa-house-user' },
        'caring': { text: 'Đang chăm sóc', class: 'badge-ongoing', icon: 'fa-heart-pulse' },
        'completed': { text: 'Đã hoàn thành', class: 'badge-completed', icon: 'fa-circle-check' }
    };

    const targetBadge = document.getElementById(`status-badge-${shiftId}`);
    if (targetBadge && statusMap[newStatus]) {
        targetBadge.className = `badge-status ${statusMap[newStatus].class}`;
        targetBadge.innerHTML = `<i class="fa-solid ${statusMap[newStatus].icon}"></i> ${statusMap[newStatus].text}`;
    }

    showToast(`Cập nhật trạng thái ca: ${statusMap[newStatus].text}`, 'success');
}

function handleCertificateUpload(e) {
    const files = e.target.files;
    if (files.length > 0) {
        showToast(`Đã tải lên tệp: ${files[0].name} (Đang chuyển cho Nhân viên vận hành thẩm định)`, 'success');
        const list = document.getElementById('certListContainer');
        if (list) {
            const card = document.createElement('div');
            card.className = 'shift-card';
            card.innerHTML = `
                <div class="shift-main-info">
                    <div class="stat-icon-box stat-blue"><i class="fa-solid fa-file-shield"></i></div>
                    <div class="shift-details">
                        <h4>${files[0].name}</h4>
                        <p class="shift-meta"><span><i class="fa-regular fa-clock"></i> Vừa nộp</span> <span><i class="fa-solid fa-hard-drive"></i> ${(files[0].size / 1024).toFixed(1)} KB</span></p>
                    </div>
                </div>
                <div><span class="badge-status badge-pending"><i class="fa-solid fa-clock"></i> Chờ Nhân viên duyệt</span></div>
            `;
            list.prepend(card);
        }
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    showToast('Thông tin cá nhân Điều dưỡng đã được cập nhật thành công!', 'success');
}


/* ==========================================================================
   2. NHÂN VIÊN VẬN HÀNH (STAFF) LOGIC
   ========================================================================== */

// Duyệt đơn thuê
function approveRental(rentalId, customerName, equipName) {
    if (confirm(`Xác nhận DUYỆT đơn thuê ${equipName} cho khách hàng ${customerName}?`)) {
        const row = document.getElementById(`rental-row-${rentalId}`);
        if (row) {
            const badge = row.querySelector('.badge-status');
            if (badge) {
                badge.className = 'badge-status badge-completed';
                badge.innerHTML = '<i class="fa-solid fa-check"></i> Đã duyệt & Xuất kho';
            }
            const actionBtn = row.querySelector('.rental-action-btn');
            if (actionBtn) actionBtn.style.display = 'none';
        }
        showToast(`Nhân viên đã duyệt đơn thuê #${rentalId} (${equipName}) và xuất lệnh giao tận nhà!`, 'success');
    }
}

// Thu hồi & hoàn cọc
function openReturnModal(rentalId, customerName, equipName, depositAmount) {
    document.getElementById('returnModalId').value = rentalId;
    document.getElementById('returnModalCustomer').innerText = customerName;
    document.getElementById('returnModalEquip').innerText = equipName;
    document.getElementById('returnModalDeposit').innerText = depositAmount;
    openModal('equipmentReturnModal');
}

function submitEquipmentReturn(e) {
    e.preventDefault();
    const rentalId = document.getElementById('returnModalId').value;
    const condition = document.getElementById('returnCondition').value;
    const refund = document.getElementById('returnRefundAmt').value;

    const row = document.getElementById(`return-row-${rentalId}`);
    if (row) {
        const badge = row.querySelector('.badge-status');
        if (badge) {
            badge.className = 'badge-status badge-completed';
            badge.innerHTML = '<i class="fa-solid fa-box-archive"></i> Đã hoàn tất trả máy';
        }
        const btn = row.querySelector('.btn-process-return');
        if (btn) btn.style.display = 'none';
    }

    closeModal('equipmentReturnModal');
    showToast(`Nhân viên đã nghiệm thu thiết bị #${rentalId} (${condition}) và hoàn trả ${refund} cọc cho khách.`, 'success');
}

// ==========================================================================
// QUẢN LÝ LỊCH HẸN & ĐỒNG BỘ CA TRỰC ĐIỀU DƯỠNG (CENTRALIZED STORE)
// ==========================================================================
let STAFF_APPOINTMENTS_DATA = [
    {
        id: '601',
        code: '#BK-8821',
        patient: 'Ông Vũ Đình Phúc (80 tuổi)',
        phone: '0905777666',
        address: '89 Ngô Quyền, Q. Sơn Trà',
        service: 'Vật lý trị liệu hồi phục tai biến',
        nurseKey: 'quan',
        nurseName: 'BS. Lê Hoàng Quân',
        date: '2026-10-11',
        slot: '08:00 - 10:30 (Sáng)',
        status: 'completed',
        statusText: 'Đã hoàn thành',
        rating: 5.0,
        review: 'Bác sĩ Quân xoa bóp và tập phục hồi rất ân cần, bố tôi đỡ mỏi nhiều.'
    },
    {
        id: '603',
        code: '#BK-8819',
        patient: 'Bà Trần Ánh Nguyệt (72 tuổi)',
        phone: '0905123456',
        address: '28 Bạch Đằng, Q. Hải Châu',
        service: 'Thay băng & Rửa vết thương mổ',
        nurseKey: 'mai',
        nurseName: 'ĐD. Trần Thị Mai',
        date: '2026-10-11',
        slot: '14:00 - 16:30 (Chiều)',
        status: 'completed',
        statusText: 'Đã hoàn thành',
        rating: 5.0,
        review: 'Chị Mai làm rất nhẹ nhàng, vết thương không bị đau rát, chu đáo 10/10.'
    },
    {
        id: '604',
        code: '#BK-8815',
        patient: 'Anh Hoàng Minh Trí (45 tuổi)',
        phone: '0908786168',
        address: '56 Nguyễn Hữu Thọ, Q. Cẩm Lệ',
        service: 'Chăm sóc vết mổ ruột thừa tại nhà',
        nurseKey: 'minh',
        nurseName: 'ĐD. Nguyễn Văn Minh',
        date: '2026-10-11',
        slot: '08:00 - 10:30 (Sáng)',
        status: 'completed',
        statusText: 'Đã hoàn thành',
        rating: 4.5,
        review: 'Y tá Minh sát trùng rất kỹ, đến đúng hẹn, hướng dẫn kiêng cữ cặn kẽ.'
    },
    {
        id: '602',
        code: '#BK-8822',
        patient: 'Bà Ngô Thị Tuyết (64 tuổi)',
        phone: '0912334455',
        address: '14 Tôn Đức Thắng, Q. Liên Chiểu',
        service: 'Thay băng vết mổ xương đùi',
        nurseKey: 'none',
        nurseName: 'Chưa phân công',
        date: '2026-10-11',
        slot: '17:00 - 19:00 (Tối)',
        status: 'pending',
        statusText: 'Chờ điều phối',
        rating: null,
        review: 'Chưa diễn ra (Chưa có đánh giá)'
    },
    {
        id: '501',
        code: '#LH-4101',
        patient: 'Ông Trần Văn Hùng (68 tuổi)',
        phone: '0903555777',
        address: '15 Lê Duẩn, Q. Hải Châu',
        service: 'Cho ăn qua ống Sonde dạ dày',
        nurseKey: 'minh',
        nurseName: 'ĐD. Nguyễn Văn Minh',
        date: '2026-10-11',
        slot: '14:00 - 16:30 (Chiều)',
        status: 'busy',
        statusText: 'Đã gán Y tá',
        rating: null,
        review: 'Đang theo dõi ca trực'
    },
    {
        id: '502',
        code: '#LH-4102',
        patient: 'Bà Lê Thị Thảo (55 tuổi)',
        phone: '0913999888',
        address: '42 Nguyễn Huệ, Q. Hải Châu',
        service: 'Truyền nước biển / dịch tại nhà',
        nurseKey: 'lan',
        nurseName: 'ĐD. Trần Thị Lan',
        date: '2026-10-11',
        slot: '11:00 - 13:00 (Trưa)',
        status: 'busy',
        statusText: 'Đã gán Y tá',
        rating: null,
        review: 'Đang theo dõi ca trực'
    }
];

const STANDARD_TIME_SLOTS = [
    '08:00 - 10:30 (Sáng)',
    '11:00 - 13:00 (Trưa)',
    '14:00 - 16:30 (Chiều)',
    '17:00 - 19:00 (Tối)'
];

function setAppointmentQuickDate(type) {
    const input = document.getElementById('appointmentDateFilter');
    if (!input) return;
    const now = new Date();
    if (type === 'tomorrow') {
        now.setDate(now.getDate() + 1);
    }
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    input.value = `${yyyy}-${mm}-${dd}`;
    renderAppointmentsTable();
}

function filterAppointmentsByDate(dateStr) {
    renderAppointmentsTable();
}

function handleAppointmentSearch(query) {
    renderAppointmentsTable();
}

function filterAppointmentsByStatus(status) {
    renderAppointmentsTable();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById('appointmentListTableBody');
    if (!tbody) return;

    const dateInput = document.getElementById('appointmentDateFilter');
    const selectedDate = dateInput ? dateInput.value : '2026-10-11';

    const searchInput = document.getElementById('appointmentSearchInput');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const statusFilter = document.getElementById('appointmentStatusFilter');
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    const removeAccents = (str) => {
        return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    const cleanQuery = removeAccents(query);

    const filtered = STAFF_APPOINTMENTS_DATA.filter(apt => {
        // Lọc theo ngày (nếu khớp ngày hoặc xem toàn bộ)
        const matchDate = !selectedDate || apt.date === selectedDate;
        // Lọc trạng thái
        let matchStatus = true;
        if (selectedStatus !== 'all') {
            matchStatus = apt.status === selectedStatus;
        }
        // Lọc tìm kiếm
        let matchSearch = true;
        if (cleanQuery) {
            const text = removeAccents(`${apt.code} ${apt.patient} ${apt.phone} ${apt.address} ${apt.service} ${apt.nurseName}`);
            matchSearch = text.includes(cleanQuery);
        }
        return matchDate && matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 26px; margin-bottom: 8px; display: block; color: #94a3b8;"></i>
                    Không có lịch hẹn nào phù hợp với bộ lọc trong ngày ${selectedDate}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(apt => {
        let statusBadge = '';
        if (apt.status === 'completed') {
            statusBadge = '<span class="badge-status badge-completed"><i class="fa-solid fa-check"></i> Đã hoàn thành</span>';
        } else if (apt.status === 'busy') {
            statusBadge = '<span class="badge-status badge-confirmed"><i class="fa-solid fa-user-check"></i> Đã gán Y tá</span>';
        } else {
            statusBadge = '<span class="badge-status badge-pending"><i class="fa-solid fa-clock"></i> Chờ điều phối</span>';
        }

        let ratingHtml = '';
        if (apt.rating) {
            ratingHtml = `
                <div style="display: flex; align-items: center; gap: 4px; color: #f59e0b; font-weight: 800; font-size: 13px;">
                    <span>${apt.rating.toFixed(1)}</span> <i class="fa-solid fa-star"></i>
                </div>
                <div style="font-size: 11px; color: #15803d; font-weight: 600; margin-top: 1px;" title="${apt.review || ''}">
                    <i class="fa-solid fa-check"></i> Hài lòng
                </div>
            `;
        } else {
            ratingHtml = `<span style="font-size: 11.5px; color: var(--text-muted); font-style: italic;"><i class="fa-regular fa-clock"></i> Chưa diễn ra</span>`;
        }

        const isUnassigned = apt.nurseKey === 'none' || apt.status === 'pending';

        const actionButtonHtml = isUnassigned
            ? `<button class="btn-action-sm btn-assign-sm" onclick="openChangeAppointmentModal('${apt.id}', '${apt.patient.replace(/['"]/g, '')}', '${apt.nurseKey}', '${apt.date}', '${apt.slot}')" title="Phân công điều dưỡng nhận ca này">
                   <i class="fa-solid fa-user-plus"></i> Phân công
               </button>`
            : `<button class="btn-action-sm btn-primary-sm" onclick="openChangeAppointmentModal('${apt.id}', '${apt.patient.replace(/['"]/g, '')}', '${apt.nurseKey}', '${apt.date}', '${apt.slot}')" title="Chỉnh sửa ca trực / Đổi lịch">
                   <i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa
               </button>`;

        return `
            <tr id="apt-row-${apt.id}">
                <td style="font-weight: 800; color: #0284c7;">${apt.code}</td>
                <td>
                    <strong style="font-size: 13px;">${apt.patient}</strong>
                    <div style="font-size: 11px; color: var(--text-muted); max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${apt.address}">
                        <i class="fa-solid fa-location-dot"></i> ${apt.address}
                    </div>
                </td>
                <td>
                    <div style="font-size: 12px; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${apt.service}">
                        ${apt.service}
                    </div>
                </td>
                <td class="apt-nurse-cell" style="white-space: nowrap;">
                    <strong style="color: ${isUnassigned ? '#ef4444' : 'var(--primary)'};">
                        ${isUnassigned ? 'Chưa phân công' : apt.nurseName}
                    </strong>
                </td>
                <td class="apt-time-cell" style="white-space: nowrap;">
                    <div style="font-weight: 700; color: #0284c7; font-size: 12px;"><i class="fa-regular fa-clock"></i> ${apt.slot}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${apt.date}</div>
                </td>
                <td style="white-space: nowrap;">${statusBadge}</td>
                <td style="white-space: nowrap;">${ratingHtml}</td>
                <td style="text-align: right; white-space: nowrap; padding-right: 12px;">
                    ${actionButtonHtml}
                </td>
            </tr>
        `;
    }).join('');
}

// Tìm kiếm điều dưỡng theo tên trong popup gán/sửa lịch
function filterNurseDropdownInModal(keyword) {
    const select = document.getElementById('aptNewNurse');
    if (!select) return;
    const cleanKeyword = (keyword || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const matched = STAFF_NURSES_LIST.filter(n => {
        if (!cleanKeyword) return true;
        const text = (n.name + ' ' + n.code + ' ' + n.district + ' ' + n.spec).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return text.includes(cleanKeyword);
    });

    if (matched.length === 0) {
        select.innerHTML = '<option value="">(Không tìm thấy điều dưỡng phù hợp)</option>';
        return;
    }

    const currentVal = select.value;
    select.innerHTML = matched.map(n => 
        `<option value="${n.key}">${n.name} (${n.district})</option>`
    ).join('');

    const hasCurrent = matched.some(n => n.key === currentVal);
    if (hasCurrent) {
        select.value = currentVal;
    } else {
        select.value = matched[0].key;
    }
    handleModalDateOrNurseChange();
}

// Mở modal Chỉnh sửa ca trực / Phân công ca
function openChangeAppointmentModal(aptId, patientName, nurseKey, date, slot) {
    const idEl = document.getElementById('aptModalId');
    const patEl = document.getElementById('aptModalPatient');
    const codeEl = document.getElementById('aptModalCode');
    const curNurseEl = document.getElementById('aptCurrentNurse');
    const curDateEl = document.getElementById('aptCurrentDate');
    const newDateEl = document.getElementById('aptNewDate');
    const newNurseEl = document.getElementById('aptNewNurse');
    const titleEl = document.getElementById('changeAppointmentModalTitle') || document.querySelector('#changeAppointmentModal .modal-header-bar h3');
    const submitBtn = document.querySelector('#changeAppointmentModal button[type="submit"]');

    // Reset ô tìm kiếm tên điều dưỡng
    const nurseSearchInput = document.getElementById('nurseSearchInModal');
    if (nurseSearchInput) {
        nurseSearchInput.value = '';
        filterNurseDropdownInModal('');
    }

    const apt = STAFF_APPOINTMENTS_DATA.find(a => String(a.id) === String(aptId));
    const isNewOrPending = String(aptId).startsWith('new_') || !apt || apt.status === 'pending' || nurseKey === 'none';

    // Cập nhật tiêu đề modal rõ ràng theo ngữ cảnh
    if (titleEl) {
        if (isNewOrPending) {
            titleEl.innerHTML = '<i class="fa-solid fa-user-plus" style="color: #f97316;"></i> Phân Công / Gán Ca Trực Cho Điều Dưỡng';
        } else {
            titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Chỉnh Sửa Ca Trực & Đổi Lịch';
        }
    }
    if (submitBtn) {
        if (isNewOrPending) {
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Xác Nhận Phân Công Ca';
        } else {
            submitBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Cập Nhật Ca Trực';
        }
    }

    if (idEl) idEl.value = aptId;
    if (patEl) {
        if (String(aptId).startsWith('new_')) {
            const pendingApt = STAFF_APPOINTMENTS_DATA.find(a => a.status === 'pending');
            if (pendingApt) {
                patEl.innerText = `${pendingApt.patient} (Chờ điều phối - ${pendingApt.code})`;
                if (idEl) idEl.value = pendingApt.id;
            } else {
                patEl.innerText = patientName || 'Bệnh nhân mới';
            }
        } else {
            patEl.innerText = patientName || (apt ? apt.patient : 'Bệnh nhân');
        }
    }
    if (codeEl) codeEl.innerText = apt ? apt.code : '#CA-MOI';
    if (curNurseEl) curNurseEl.innerText = (apt && apt.nurseKey !== 'none' ? apt.nurseName : 'Chưa phân công');
    if (curDateEl) curDateEl.innerText = (slot || (apt ? apt.slot : '07:30 - 09:30 (Sáng)')) + ' (' + (date || (apt ? apt.date : '2026-10-11')) + ')';

    if (newDateEl) newDateEl.value = date || (apt ? apt.date : '2026-10-11');
    if (newNurseEl) {
        newNurseEl.value = (nurseKey && nurseKey !== 'none') ? nurseKey : (apt && apt.nurseKey !== 'none' ? apt.nurseKey : 'minh');
    }

    updateAvailableSlotsInModal(slot || (apt ? apt.slot : '07:30 - 09:30 (Sáng)'));
    openModal('changeAppointmentModal');
}

function handleModalDateOrNurseChange() {
    const curSlot = document.getElementById('aptNewTimeSlot') ? document.getElementById('aptNewTimeSlot').value : '';
    updateAvailableSlotsInModal(curSlot);
}

function updateAvailableSlotsInModal(chosenSlot = '') {
    const grid = document.getElementById('modalSlotSelectionGrid');
    if (!grid) return;

    const dateVal = document.getElementById('aptNewDate') ? document.getElementById('aptNewDate').value : '2026-10-11';
    const nurseVal = document.getElementById('aptNewNurse') ? document.getElementById('aptNewNurse').value : 'minh';
    const aptId = document.getElementById('aptModalId') ? document.getElementById('aptModalId').value : '';

    // Tìm các ca đã được gán cho điều dưỡng này vào ngày này (ngoại trừ ca hiện tại)
    const existingAppointments = STAFF_APPOINTMENTS_DATA.filter(a => 
        String(a.id) !== String(aptId) && a.nurseKey === nurseVal && a.date === dateVal
    );

    const busySlots = existingAppointments.map(a => a.slot);

    if (!chosenSlot && STANDARD_TIME_SLOTS.length > 0) {
        chosenSlot = STANDARD_TIME_SLOTS[0];
    }
    const hiddenSlotInput = document.getElementById('aptNewTimeSlot');
    if (hiddenSlotInput) hiddenSlotInput.value = chosenSlot;

    grid.innerHTML = STANDARD_TIME_SLOTS.map(slotTime => {
        const isBusy = busySlots.includes(slotTime);
        const isSelected = chosenSlot === slotTime;

        let badgeHtml = isBusy 
            ? '<span style="font-size: 11px; color: #ef4444; font-weight: 800;"><i class="fa-solid fa-lock"></i> Đã có ca</span>'
            : '<span style="font-size: 11px; color: #10b981; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> Trống (Rảnh)</span>';

        let borderStyle = isSelected 
            ? 'border: 2px solid var(--primary); background: #f0fdf4; box-shadow: 0 2px 8px rgba(16,185,129,0.15);' 
            : 'border: 1.5px solid #e2e8f0; background: #fff;';

        return `
            <div onclick="selectModalSlot('${slotTime}')" style="cursor: pointer; padding: 10px 12px; border-radius: 8px; ${borderStyle} transition: all 0.2s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 800; font-size: 12.5px; color: ${isSelected ? 'var(--primary)' : 'var(--text-main)'};">
                        ${slotTime}
                    </span>
                    ${isSelected ? '<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>' : ''}
                </div>
                <div>${badgeHtml}</div>
            </div>
        `;
    }).join('');
}

function selectModalSlot(slotTime) {
    const hiddenSlotInput = document.getElementById('aptNewTimeSlot');
    if (hiddenSlotInput) hiddenSlotInput.value = slotTime;
    updateAvailableSlotsInModal(slotTime);
}

// Lưu thay đổi lịch hẹn & tự động đồng bộ sang ca trực của điều dưỡng
function submitChangeAppointment(e) {
    e.preventDefault();
    const aptId = document.getElementById('aptModalId').value;
    const newNurseKey = document.getElementById('aptNewNurse').value;
    const newDate = document.getElementById('aptNewDate').value;
    const newSlot = document.getElementById('aptNewTimeSlot').value;
    const reason = document.getElementById('aptChangeReason') ? document.getElementById('aptChangeReason').value : '';

    const nurseObj = STAFF_NURSES_LIST.find(n => n.key === newNurseKey) || { name: 'Điều Dưỡng' };

    let apt = STAFF_APPOINTMENTS_DATA.find(a => String(a.id) === String(aptId));
    if (apt) {
        apt.nurseKey = newNurseKey;
        apt.nurseName = nurseObj.name;
        apt.date = newDate;
        apt.slot = newSlot;
        if (apt.status === 'pending') {
            apt.status = 'busy';
            apt.statusText = 'Đã gán Y tá';
        }
    } else {
        // Nếu là gán ca mới
        const newCode = '#BK-' + Math.floor(1000 + Math.random() * 9000);
        STAFF_APPOINTMENTS_DATA.push({
            id: 'apt_' + Date.now(),
            code: newCode,
            patient: document.getElementById('aptModalPatient').innerText || 'Bệnh nhân mới',
            phone: '0905123456',
            address: 'Đà Nẵng',
            service: 'Chăm sóc y tế tại nhà',
            nurseKey: newNurseKey,
            nurseName: nurseObj.name,
            date: newDate,
            slot: newSlot,
            status: 'busy',
            statusText: 'Đã gán Y tá',
            rating: null,
            review: 'Đang theo dõi'
        });
    }

    closeModal('changeAppointmentModal');

    // Đồng bộ lại toàn bộ giao diện & Tờ lịch ca trực
    renderAppointmentsTable();
    renderStaffNurseTable();
    if (typeof renderNurseModalScheduleView === 'function') {
        renderNurseModalScheduleView(newNurseKey, newDate);
    }

    showToast(`Đã cập nhật lịch hẹn thành công: ${nurseObj.name}, ngày ${newDate}, ca ${newSlot}!`, 'success');
}

// Giảm giá / Khuyến mãi
function openAddDiscountModal() {
    openModal('addDiscountModal');
}

function submitAddDiscount(e) {
    e.preventDefault();
    const code = document.getElementById('discountCode').value.toUpperCase();
    const val = document.getElementById('discountPercent').value;
    const expire = document.getElementById('discountExpire').value;

    closeModal('addDiscountModal');
    showToast(`Đã tạo mã giảm giá ${code} (-${val}%) áp dụng đến ${expire}!`, 'success');
}

// Thêm thiết bị / sản phẩm kho
function openAddProductModal() {
    openModal('addProductModal');
}

function submitAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;

    closeModal('addProductModal');
    showToast(`Đã thêm mới thiết bị/sản phẩm: "${name}" (${price}) vào kho!`, 'success');
}

// Quản lý và giải quyết khiếu nại khách hàng
function renderStaffFeedbacks() {
    const tbody = document.getElementById('staffFeedbackTableBody');
    const badgeSidebar = document.getElementById('staffFeedbackCountBadge');

    const list = (typeof loadStoredFeedbacks === 'function') ? loadStoredFeedbacks() : (window.FEEDBACKS_DATABASE || []);
    
    const pendingCount = list.filter(f => f.status === 'pending').length;
    if (badgeSidebar) {
        badgeSidebar.innerText = pendingCount;
        badgeSidebar.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }

    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted);">Chưa có phản hồi hoặc khiếu nại nào từ khách hàng.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(f => {
        const isPending = f.status === 'pending';
        const starsHtml = Array.from({length: 5}, (_, i) => 
            `<i class="fa-solid fa-star" style="color: ${i < f.rating ? '#f59e0b' : '#cbd5e1'}; font-size: 12px;"></i>`
        ).join('');

        return `
            <tr id="feedback-row-${f.id}">
                <td><strong>#${f.id}</strong><div style="font-size:11px;color:var(--text-muted);">${f.createdAt || ''}</div></td>
                <td>
                    <strong>${typeof escapeHtml === 'function' ? escapeHtml(f.customerName) : f.customerName}</strong>
                    <div style="font-size: 12px; color: var(--text-muted);"><i class="fa-solid fa-phone"></i> ${typeof escapeHtml === 'function' ? escapeHtml(f.customerPhone) : f.customerPhone}</div>
                </td>
                <td>
                    <span class="badge-status badge-confirmed" style="font-size:12px;">${typeof escapeHtml === 'function' ? escapeHtml(f.targetRef) : f.targetRef}</span>
                    <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">Loại: ${typeof escapeHtml === 'function' ? escapeHtml(f.category || 'Góp ý') : (f.category || 'Góp ý')}</div>
                </td>
                <td style="max-width: 320px;">
                    <div style="font-style: italic; color: var(--text-main); font-size: 13.5px;">"${typeof escapeHtml === 'function' ? escapeHtml(f.content) : f.content}"</div>
                </td>
                <td>
                    <div>${starsHtml}</div>
                    <span style="font-size: 12px; font-weight: 700; color: #f59e0b;">${f.rating}/5 sao</span>
                </td>
                <td>
                    ${isPending 
                        ? `<span class="badge-status badge-pending"><i class="fa-solid fa-clock"></i> Chờ phản hồi</span>`
                        : `<span class="badge-status badge-completed"><i class="fa-solid fa-check-double"></i> Đã giải quyết</span>`
                    }
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="btn-action-sm btn-outline-sm" onclick="openContactClientModal('${(f.customerName || '').replace(/['"]/g, '')}', '${f.customerPhone || ''}')">
                        <i class="fa-solid fa-phone"></i> Gọi khách
                    </button>
                    ${isPending ? `
                        <button class="btn-action-sm btn-success-sm btn-resolve-fb" onclick="resolveFeedback('${f.id}')">
                            <i class="fa-solid fa-check"></i> Đã giải quyết
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function resolveFeedback(fbId) {
    const list = (typeof loadStoredFeedbacks === 'function') ? loadStoredFeedbacks() : (window.FEEDBACKS_DATABASE || []);
    const fb = list.find(f => String(f.id) === String(fbId));
    const customerName = fb ? fb.customerName : 'khách hàng';
    if (fb) {
        fb.status = 'resolved';
        if (typeof saveStoredFeedbacks === 'function') saveStoredFeedbacks();
    }
    renderStaffFeedbacks();
    showToast(`Nhân viên đã xử lý và chốt xong phản hồi/khiếu nại của ${customerName}!`, 'success');
}

// Xuất báo cáo ngày
function generateDailyReport() {
    showToast('Đang tổng hợp dữ liệu ca trực và doanh số trong ngày...', 'warning');
    setTimeout(() => {
        showToast('Báo cáo ngày đã được xuất thành công! Tệp BBCare_BaoCao_Ngay.xlsx đã sẵn sàng.', 'success');
    }, 1000);
}

// TÍNH NĂNG MỚI CHO STAFF: Thẩm định & Duyệt bằng cấp Điều Dưỡng
function verifyNurseCert(certId, nurseName, certTitle) {
    if (confirm(`Xác nhận PHÊ DUYỆT bằng cấp/chứng chỉ:\n"${certTitle}"\ncủa Điều dưỡng ${nurseName}?`)) {
        const row = document.getElementById(`cert-row-${certId}`);
        if (row) {
            const badge = row.querySelector('.badge-status');
            if (badge) {
                badge.className = 'badge-status badge-completed';
                badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã phê duyệt';
            }
            const actions = row.querySelector('.cert-actions');
            if (actions) {
                actions.innerHTML = '<span style="color:#15803d;font-weight:800;font-size:12.5px;"><i class="fa-solid fa-shield-check"></i> Đã thẩm định hợp lệ</span>';
            }
        }
        showToast(`Nhân viên đã phê duyệt thành công chứng chỉ cho Điều dưỡng ${nurseName}!`, 'success');
    }
}

function rejectNurseCert(certId, nurseName, certTitle) {
    const reason = prompt(`Nhập lý do yêu cầu Điều dưỡng ${nurseName} bổ sung hoặc từ chối chứng chỉ:`, 'Ảnh mờ hoặc chưa có công chứng');
    if (reason) {
        const row = document.getElementById(`cert-row-${certId}`);
        if (row) {
            const badge = row.querySelector('.badge-status');
            if (badge) {
                badge.className = 'badge-status badge-cancelled';
                badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Yêu cầu bổ sung';
            }
        }
        showToast(`Đã gửi thông báo yêu cầu Điều dưỡng ${nurseName} bổ sung lại: ${reason}`, 'warning');
    }
}

// ==========================================================================
// DỮ LIỆU ĐIỀU DƯỠNG & LỊCH TRỰC (ĐỒNG BỘ 100% VỚI HỒ SƠ ĐIỀU DƯỠNG VÀ ĐẶT CA)
// ==========================================================================
const STAFF_NURSES_LIST = [
    {
        key: 'minh',
        id: 'N01',
        code: 'DD-0824',
        name: 'ĐD. Nguyễn Văn Minh',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        spec: 'Chuyên Khoa Ngoại & Chăm Sóc Vết Thương Mổ',
        expYears: 10,
        exp: '10 năm kinh nghiệm',
        rating: 4.9,
        reviewsCount: 128,
        district: 'Hải Châu & Thanh Khê',
        phone: '0908786168',
        email: 'minh.nguyen@bbcare.vn',
        address: 'Số 12 đường Trần Cao Vân, P. Tam Thuận, Q. Thanh Khê, Đà Nẵng',
        certs: 'Cử nhân Điều dưỡng ĐH Y Dược TP. Đà Nẵng • Chứng chỉ CCHN số 004821/DNA-CCHN (Đã thẩm định)',
        skills: 'Chuyên sâu điều trị vết loét tì đè, thay băng vô trùng vết mổ khó, kỹ thuật truyền dịch an toàn, chăm sóc người cao tuổi tai biến liệt nửa người và đặt ống sonde dạ dày chuẩn y khoa.',
        topReview: '"Anh Minh làm rất mát tay, rửa vết thương không đau rát, đến rất đúng giờ."',
        todayStatus: 'busy',
        todayStatusText: 'Đang có ca trực (07:30 - 09:30)'
    },
    {
        key: 'mai',
        id: 'N07',
        code: 'DD-0828',
        name: 'ĐD. Trần Thị Mai',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        spec: 'Chuyên Khoa Ngoại & Chăm Sóc Vết Thương Mổ',
        expYears: 8,
        exp: '8 năm kinh nghiệm',
        rating: 5.0,
        reviewsCount: 115,
        district: 'Hải Châu & Cẩm Lệ',
        phone: '0905123456',
        email: 'mai.tran@bbcare.vn',
        address: '28 Bạch Đằng, P. Thạch Thang, Q. Hải Châu, Đà Nẵng',
        certs: 'Cử nhân Điều dưỡng ĐH Y Dược • Chứng chỉ CCHN số 005124/DNA-CCHN (Đã thẩm định)',
        skills: 'Thay băng vô trùng vết mổ khó, rửa vết thương loét, tiêm truyền tĩnh mạch an toàn, chăm sóc người bệnh sau đại phẫu thuật.',
        topReview: '"Chị Mai làm rất nhẹ nhàng, vết thương không bị đau rát, chu đáo 10/10."',
        todayStatus: 'busy',
        todayStatusText: 'Đang có ca trực (13:30 - 15:30)'
    },
    {
        key: 'lan',
        id: 'N02',
        code: 'DD-0825',
        name: 'ĐD. Trần Thị Lan',
        avatar: 'https://images.unsplash.com/photo-1594824813576-905ffeb52317?auto=format&fit=crop&q=80&w=300',
        spec: 'Nhi Khoa & Chăm Sóc Ống Sonde Dạ Dày',
        expYears: 8,
        exp: '8 năm kinh nghiệm',
        rating: 5.0,
        reviewsCount: 95,
        district: 'Hải Châu & Thanh Khê',
        phone: '0912345678',
        email: 'lan.tran@bbcare.vn',
        address: '45 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng',
        certs: 'Chứng chỉ Nhi khoa nâng cao & Cử nhân Điều dưỡng Đa khoa (Đã thẩm định)',
        skills: 'Cho ăn qua ống Sonde dạ dày chuẩn kỹ thuật, truyền dịch tĩnh mạch an toàn, chăm sóc bé sốt cao co giật và mẹ sau sinh.',
        topReview: '"Chị Lan rất kiên nhẫn khi cho cụ ăn qua ống Sonde, dặn dò gia đình tận tình."',
        todayStatus: 'free',
        todayStatusText: 'Sẵn sàng nhận ca (Đang rảnh)'
    },
    {
        key: 'quan',
        id: 'N03',
        code: 'BS-0412',
        name: 'BS. Lê Hoàng Quân',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        spec: 'Phục Hồi Chức Năng & Vật Lý Trị Liệu Tai Biến',
        expYears: 15,
        exp: '15 năm kinh nghiệm',
        rating: 4.9,
        reviewsCount: 110,
        district: 'Sơn Trà & Ngũ Hành Sơn',
        phone: '0905777666',
        email: 'quan.le@bbcare.vn',
        address: '88 Võ Văn Kiệt, P. An Hải Đông, Q. Sơn Trà, Đà Nẵng',
        certs: 'Bác sĩ Chuyên khoa Phục hồi chức năng • CCHN số 002198/DNA-CCHN (Đã thẩm định)',
        skills: 'Vật lý trị liệu phục hồi chức năng sau tai biến, tập đi sau mổ khớp háng/khớp gối, bấm huyệt thông kinh lạc, phục hồi teo cơ cứng khớp.',
        topReview: '"Bác sĩ Quân xoa bóp và tập phục hồi rất ân cần, bố tôi cải thiện đi lại rõ rệt."',
        todayStatus: 'busy',
        todayStatusText: 'Đang có ca trực (08:00 - 10:30)'
    },
    {
        key: 'ha',
        id: 'N04',
        code: 'DD-0915',
        name: 'ĐD. Phạm Thanh Hà',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
        spec: 'Hồi Sức Cấp Cứu & Trực Đêm Theo Dõi Sinh Hiệu',
        expYears: 7,
        exp: '7 năm kinh nghiệm',
        rating: 4.8,
        reviewsCount: 82,
        district: 'Liên Chiểu & Cẩm Lệ',
        phone: '0935123987',
        email: 'ha.pham@bbcare.vn',
        address: '120 Tôn Đức Thắng, P. Hòa Khánh Nam, Q. Liên Chiểu, Đà Nẵng',
        certs: 'Chứng chỉ Cấp cứu hồi sức ACLS/BLS Quốc tế (Đã thẩm định)',
        skills: 'Vận hành bình oxy, máy tạo oxy gia đình, máy thở BiPAP, theo dõi monitor sinh hiệu liên tục và chăm sóc hồi sức tích cực.',
        topReview: '"Yên tâm tuyệt đối khi giao ca trực đêm thở oxy của cụ cho cô Hà."',
        todayStatus: 'free',
        todayStatusText: 'Sẵn sàng nhận ca chiều & tối'
    },
    {
        key: 'thao',
        id: 'N05',
        code: 'DD-0733',
        name: 'ĐD. Hoàng Thu Thảo',
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300',
        spec: 'Chăm Sóc Toàn Diện Người Cao Tuổi & Hộ Lý Y Tế',
        expYears: 6,
        exp: '6 năm kinh nghiệm',
        rating: 4.9,
        reviewsCount: 78,
        district: 'Ngũ Hành Sơn & Sơn Trà',
        phone: '0905888999',
        email: 'thao.hoang@bbcare.vn',
        address: '36 Lê Văn Hiến, P. Khuê Mỹ, Q. Ngũ Hành Sơn, Đà Nẵng',
        certs: 'Cử nhân Điều dưỡng Đa khoa - ĐH Kỹ thuật Y Dược Đà Nẵng (Đã thẩm định)',
        skills: 'Chăm sóc người già suy nhược tại giường, vệ sinh tắm gội chống loét tì đè, xoa bóp cơ khớp, kiểm soát đường huyết và dinh dưỡng.',
        topReview: '"Cô Thảo rất chu đáo, nhẹ nhàng và chăm sóc bà như người nhà."',
        todayStatus: 'free',
        todayStatusText: 'Sẵn sàng nhận ca (Đang rảnh)'
    },
    {
        key: 'bao',
        id: 'N06',
        code: 'DD-0654',
        name: 'ĐD. Đặng Quốc Bảo',
        avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300',
        spec: 'Điều Dưỡng Cấp Cứu Ban Đêm & Kỹ Thuật Sonde',
        expYears: 9,
        exp: '9 năm kinh nghiệm',
        rating: 4.8,
        reviewsCount: 104,
        district: 'Cẩm Lệ & Hải Châu',
        phone: '0914556677',
        email: 'bao.dang@bbcare.vn',
        address: '18 Cách Mạng Tháng 8, P. Khuê Trung, Q. Cẩm Lệ, Đà Nẵng',
        certs: 'Chứng chỉ Cấp cứu ngoại viện & Kỹ thuật tiêm truyền nâng cao (Đã thẩm định)',
        skills: 'Đặt sonde tiểu, sonde dạ dày vô trùng, xử lý hạ sốt co giật ở trẻ em, truyền dịch y khoa theo y lệnh và xử lý tai biến nhẹ.',
        topReview: '"Anh Bảo làm đêm rất trách nhiệm, đo huyết áp và sinh hiệu chuẩn xác."',
        todayStatus: 'busy',
        todayStatusText: 'Đang có ca trực (09:00 - 11:30)'
    }
];

function renderStaffNurseTable(searchQuery = '') {
    const tbody = document.getElementById('nurseListTableBody');
    if (!tbody) return;

    const removeAccents = (str) => {
        return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const q = removeAccents(searchQuery.trim());
    const filtered = STAFF_NURSES_LIST.filter(n => {
        if (!q) return true;
        const text = removeAccents(`${n.code} ${n.name} ${n.spec} ${n.district} ${n.skills}`);
        return text.includes(q);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 35px 20px; color: var(--text-muted);">
                    <i class="fa-solid fa-user-slash" style="font-size: 28px; margin-bottom: 10px; display: block; color: #94a3b8;"></i>
                    Không tìm thấy điều dưỡng nào phù hợp với từ khóa "<strong>${searchQuery}</strong>".
                    <div style="margin-top: 10px;">
                        <button class="btn-action-sm btn-outline-sm" onclick="document.getElementById('nurseTableSearchInput').value=''; renderStaffNurseTable('');">
                            <i class="fa-solid fa-rotate-left"></i> Xem tất cả điều dưỡng
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(nurse => {
        let starsHtml = '';
        const fullStars = Math.floor(nurse.rating);
        const hasHalf = nurse.rating % 1 !== 0;
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
        if (hasHalf) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        
        let statusBadge = '';
        if (nurse.todayStatus === 'busy') {
            statusBadge = '<span class="badge-status badge-cancelled"><i class="fa-solid fa-lock"></i> Đang có ca trực</span>';
        } else {
            statusBadge = '<span class="badge-status badge-completed"><i class="fa-solid fa-circle-check"></i> Sẵn sàng nhận ca</span>';
        }

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${nurse.avatar}" alt="${nurse.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;">
                        <div>
                            <strong style="color: var(--text-main); font-size: 13.5px;">${nurse.name}</strong>
                            <div style="font-size: 11.5px; color: var(--primary); font-weight: 700;">Mã: ${nurse.code}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <strong style="color: var(--primary); font-size: 12.5px;">${nurse.spec}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted); max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${nurse.skills}">
                        ${nurse.skills}
                    </div>
                </td>
                <td>
                    <div style="font-weight: 700; color: #0284c7; font-size: 12.5px;"><i class="fa-solid fa-location-dot"></i> ${nurse.district}</div>
                    <div style="font-size: 11.5px; color: var(--text-muted);"><i class="fa-solid fa-briefcase"></i> ${nurse.exp}</div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 4px; color: #f59e0b; font-weight: 800; font-size: 13px;">
                        <span>${nurse.rating.toFixed(1)}</span>
                        ${starsHtml}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">
                        ${nurse.reviewsCount} đánh giá
                    </div>
                </td>
                <td>
                    ${statusBadge}
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                        ${nurse.todayStatusText}
                    </div>
                </td>
                <td style="text-align: right; white-space: nowrap; padding-right: 14px;">
                    <button class="btn-action-sm btn-outline-sm" onclick="viewNurseDetailModal('${nurse.key}')" title="Xem chi tiết hồ sơ">
                        <i class="fa-solid fa-id-card"></i> Hồ sơ
                    </button>
                    <button class="btn-action-sm btn-primary-sm" onclick="openNurseScheduleModal('${nurse.key}')" title="Xem tờ lịch ca trực">
                        <i class="fa-solid fa-calendar-days"></i> Lịch trực
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function handleNurseTableSearch(query) {
    renderStaffNurseTable(query);
}

function viewNurseDetailModal(nurseKey) {
    const nurse = STAFF_NURSES_LIST.find(n => n.key === nurseKey) || STAFF_NURSES_LIST[0];
    if (!nurse) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = val;
            } else {
                el.innerText = val;
            }
        }
    };

    const img = document.getElementById('ndAvatar');
    if (img) img.src = nurse.avatar;

    const statusBadge = document.getElementById('ndStatusBadge');
    if (statusBadge) {
        if (nurse.todayStatus === 'busy') {
            statusBadge.className = 'badge-status badge-cancelled';
            statusBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Đang có ca trực hôm nay';
        } else {
            statusBadge.className = 'badge-status badge-completed';
            statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sẵn sàng nhận ca';
        }
    }

    setVal('ndName', nurse.name);
    setVal('ndSpec', nurse.spec);
    setVal('ndRatingNum', nurse.rating.toFixed(1));
    setVal('ndReviewsCount', `(${nurse.reviewsCount} lượt khách đánh giá)`);

    setVal('ndFullName', nurse.name);
    setVal('ndCode', nurse.code);
    setVal('ndPhone', nurse.phone);
    const callBtn = document.getElementById('ndPhoneCallBtn');
    if (callBtn) callBtn.href = `tel:${nurse.phone}`;

    setVal('ndEmail', nurse.email);
    setVal('ndAddress', nurse.address);
    setVal('ndDistrict', nurse.district);
    setVal('ndExpYears', `${nurse.expYears} năm kinh nghiệm y tế`);
    setVal('ndCerts', nurse.certs);
    setVal('ndSkills', nurse.skills);
    setVal('ndTopReview', nurse.topReview);

    const schedBtn = document.getElementById('ndViewScheduleBtn');
    if (schedBtn) {
        schedBtn.onclick = function() {
            closeModal('nurseDetailProfileModal');
            openNurseScheduleModal(nurse.key);
        };
    }

    openModal('nurseDetailProfileModal');
}

// ==========================================================================
// TỜ LỊCH CA TRỰC ĐIỀU DƯỠNG (POPUP MODAL & GÁN/ĐỔI CA ĐỒNG BỘ 100%)
// ==========================================================================
let currentActiveNurseModalKey = 'minh';

function openNurseScheduleModal(nurseKey, dateStr) {
    currentActiveNurseModalKey = nurseKey || 'minh';
    const nurse = STAFF_NURSES_LIST.find(n => n.key === currentActiveNurseModalKey) || STAFF_NURSES_LIST[0];

    const avatarEl = document.getElementById('nsmAvatar');
    const nameEl = document.getElementById('nsmName');
    const metaEl = document.getElementById('nsmMeta');
    const ratingEl = document.getElementById('nsmRatingBadge');
    const dateInput = document.getElementById('nurseModalScheduleDate');

    if (avatarEl) avatarEl.src = nurse.avatar;
    if (nameEl) nameEl.innerText = nurse.name;
    if (metaEl) metaEl.innerText = `Mã: ${nurse.code} • ${nurse.district} • ${nurse.exp}`;
    if (ratingEl) ratingEl.innerHTML = `<span>${nurse.rating.toFixed(1)}</span> <i class="fa-solid fa-star"></i>`;

    const targetDate = dateStr || (dateInput ? dateInput.value : '2026-10-11');
    if (dateInput) dateInput.value = targetDate;

    renderNurseModalScheduleView(currentActiveNurseModalKey, targetDate);
    openModal('nurseScheduleModal');
}

function handleNurseModalDateChange(newDate) {
    renderNurseModalScheduleView(currentActiveNurseModalKey, newDate);
}

function setNurseModalQuickDate(type) {
    const input = document.getElementById('nurseModalScheduleDate');
    if (!input) return;
    const now = new Date();
    if (type === 'tomorrow') {
        now.setDate(now.getDate() + 1);
    }
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    input.value = `${yyyy}-${mm}-${dd}`;
    renderNurseModalScheduleView(currentActiveNurseModalKey, input.value);
}

function renderNurseModalScheduleView(nurseKey, dateStr) {
    const grid = document.getElementById('nurseModalScheduleGrid');
    if (!grid) return;

    const targetKey = nurseKey || currentActiveNurseModalKey || 'minh';
    const dateInput = document.getElementById('nurseModalScheduleDate');
    const targetDate = dateStr || (dateInput ? dateInput.value : '2026-10-11');

    const nurse = STAFF_NURSES_LIST.find(n => n.key === targetKey) || STAFF_NURSES_LIST[0];

    // Lọc các ca trong STORE khớp với điều dưỡng và ngày được chọn
    const appointmentsOnDate = STAFF_APPOINTMENTS_DATA.filter(a => 
        a.nurseKey === targetKey && a.date === targetDate
    );

    grid.innerHTML = STANDARD_TIME_SLOTS.map(slotTime => {
        const matchedApt = appointmentsOnDate.find(a => a.slot === slotTime);

        if (matchedApt) {
            return `
                <div class="nurse-modal-slot-card busy">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: 800; color: #0284c7; font-size: 13.5px;"><i class="fa-regular fa-clock"></i> ${slotTime}</span>
                            <span class="badge-status badge-cancelled"><i class="fa-solid fa-lock"></i> Đã có ca</span>
                        </div>
                        <div style="font-weight: 800; color: var(--text-main); font-size: 14px; margin-bottom: 4px;">
                            Ca ${matchedApt.code}: ${matchedApt.patient}
                        </div>
                        <div style="font-size: 12.5px; color: var(--text-muted);">
                            Dịch vụ: ${matchedApt.service}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="nurse-modal-slot-card free" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px 16px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: 800; color: #059669; font-size: 13.5px;"><i class="fa-regular fa-clock"></i> ${slotTime}</span>
                            <span class="badge-status badge-completed"><i class="fa-solid fa-circle-check"></i> Đang rảnh</span>
                        </div>
                        <div style="font-weight: 700; color: #065f46; font-size: 13.5px; margin-bottom: 4px;">
                            Sẵn sàng nhận ca tại ${nurse.district}
                        </div>
                        <div style="font-size: 12px; color: #047857;">
                            Khung giờ còn trống trên tờ lịch (Chờ tiếp nhận lịch hẹn)
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}



function handleNurseSearch(keyword) {
    keyword = (keyword || '').toLowerCase().trim();
    const select = document.getElementById('nurseScheduleSelect');
    if (!keyword) {
        if (select) renderNurseScheduleView(select.value);
        return;
    }

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const cleanKeyword = removeAccents(keyword);
    const keys = Object.keys(NURSE_SCHEDULE_DATA);

    const matchedKey = keys.find(k => {
        const nurse = NURSE_SCHEDULE_DATA[k];
        const cleanName = removeAccents(nurse.name);
        return cleanName.includes(cleanKeyword) || k.toLowerCase().includes(cleanKeyword);
    });

    if (matchedKey) {
        if (select) select.value = matchedKey;
        renderNurseScheduleView(matchedKey);
    }
}


/* ==========================================================================
   3. QUẢN TRỊ VIÊN (ADMIN) LOGIC
   ========================================================================== */

function toggleLockUser(userId, userName, currentStatus) {
    const btn = document.getElementById(`user-lock-btn-${userId}`);
    const badge = document.getElementById(`user-badge-${userId}`);

    if (currentStatus === 'active') {
        if (confirm(`Bạn có chắc muốn KHÓA tài khoản ${userName}?`)) {
            if (badge) {
                badge.className = 'badge-status badge-locked';
                badge.innerHTML = '<i class="fa-solid fa-lock"></i> Đã khóa';
            }
            if (btn) {
                btn.className = 'btn-icon-action';
                btn.title = 'Mở khóa tài khoản';
                btn.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
                btn.setAttribute('onclick', `toggleLockUser('${userId}', '${userName}', 'locked')`);
            }
            showToast(`Quản trị viên đã khóa tài khoản ${userName}!`, 'warning');
        }
    } else {
        if (badge) {
            badge.className = 'badge-status badge-active';
            badge.innerHTML = '<i class="fa-solid fa-check"></i> Hoạt động';
        }
        if (btn) {
            btn.className = 'btn-icon-action danger';
            btn.title = 'Khóa tài khoản';
            btn.innerHTML = '<i class="fa-solid fa-ban"></i>';
            btn.setAttribute('onclick', `toggleLockUser('${userId}', '${userName}', 'active')`);
        }
        showToast(`Quản trị viên đã mở khóa tài khoản ${userName}!`, 'success');
    }
}

function openAddUserModal() {
    openModal('addUserModal');
}

function submitAddUser(e) {
    e.preventDefault();
    const name = document.getElementById('newUserName').value;
    const role = document.getElementById('newUserRole').value;
    const email = document.getElementById('newUserEmail').value;

    closeModal('addUserModal');
    showToast(`Quản trị viên đã tạo tài khoản mới: ${name} (Vai trò: ${role}, Email: ${email})!`, 'success');
}

function openAddServiceModal() {
    openModal('addServiceModal');
}

function submitAddService(e) {
    e.preventDefault();
    const name = document.getElementById('serviceName').value;
    const price = document.getElementById('servicePrice').value;
    const duration = document.getElementById('serviceDuration').value;

    closeModal('addServiceModal');
    showToast(`Đã thêm gói dịch vụ y tế mới: "${name}" (${price} - ${duration})!`, 'success');
}

function openAddBlogModal() {
    openModal('addBlogModal');
}

function submitAddBlog(e) {
    e.preventDefault();
    const title = document.getElementById('blogTitle').value;
    const cat = document.getElementById('blogCategory').value;

    closeModal('addBlogModal');
    showToast(`Đã xuất bản bài viết chuyên môn y khoa: "${title}" [${cat}]!`, 'success');
}

function saveSystemConfig(e) {
    e.preventDefault();
    showToast('Cấu hình và tham số hệ thống đã được lưu thành công!', 'success');
}


/* ==========================================================================
   4. TỰ ĐỘNG ĐỒNG BỘ DỮ LIỆU THỜI GIAN THỰC VỚI WEB CỦA KHÁCH HÀNG (LIVE SYNC)
   ========================================================================== */

function syncWithClientStorage() {
    if (typeof loadStoredAppointments === 'function') loadStoredAppointments();
    if (typeof loadStoredEquipmentOrders === 'function') loadStoredEquipmentOrders();
}

// Cập nhật sinh hiệu vào Hồ Sơ EHR của Khách Hàng thời gian thực
const originalSubmitHealthStatus = submitHealthStatus;
submitHealthStatus = function(e) {
    originalSubmitHealthStatus(e);
    const bp = document.getElementById('healthBP').value;
    const hr = document.getElementById('healthHR').value;
    const spo2 = document.getElementById('healthSpO2').value;
    const temp = document.getElementById('healthTemp').value;

    if (typeof APPOINTMENTS_HISTORY !== 'undefined' && APPOINTMENTS_HISTORY.length > 0) {
        // Cập nhật ngày ca trực hôm nay của bệnh nhân
        const appt = APPOINTMENTS_HISTORY[0];
        if (appt && appt.scheduleDays && appt.scheduleDays.length > 0) {
            appt.scheduleDays[0].vitals = {
                bloodPressure: bp,
                heartRate: Number(hr) || 75,
                spo2: Number(spo2) || 98,
                temp: Number(temp) || 36.8,
                status: 'NORMAL'
            };
            if (typeof saveStoredAppointments === 'function') {
                saveStoredAppointments();
                console.log('Đã đồng bộ sinh hiệu mới vào Hồ Sơ Sức Khỏe của Khách Hàng!');
            }
        }
    }
};

// Cập nhật duyệt đơn thuê thiết bị đồng bộ sang Khách Hàng
const originalApproveRental = approveRental;
approveRental = function(rentalId, customerName, equipName) {
    originalApproveRental(rentalId, customerName, equipName);
    if (typeof USER_EQUIPMENT_ORDERS !== 'undefined') {
        const item = USER_EQUIPMENT_ORDERS.find(x => x.orderId === rentalId || x.title.includes(equipName));
        if (item) {
            item.status = 'ACTIVE_RENT';
            item.statusText = 'Đang thuê sử dụng';
            if (typeof saveStoredEquipmentOrders === 'function') {
                saveStoredEquipmentOrders();
                console.log('Đã đồng bộ trạng thái đơn thuê sang Web Khách Hàng!');
            }
        }
    }
};

// Cập nhật thu hồi thiết bị & hoàn cọc đồng bộ sang Khách Hàng
const originalSubmitEquipmentReturn = submitEquipmentReturn;
submitEquipmentReturn = function(e) {
    originalSubmitEquipmentReturn(e);
    const rentalId = document.getElementById('returnModalId').value;
    if (typeof USER_EQUIPMENT_ORDERS !== 'undefined') {
        const item = USER_EQUIPMENT_ORDERS.find(x => x.orderId === rentalId || x.orderId.includes('8801') || x.orderId.includes('8802'));
        if (item) {
            item.status = 'RETURNED';
            item.statusText = 'Đã hoàn trả thiết bị';
            item.returnStatus = 'RETURNED';
            if (typeof saveStoredEquipmentOrders === 'function') {
                saveStoredEquipmentOrders();
                console.log('Đã đồng bộ hoàn tất thu hồi thiết bị sang Web Khách Hàng!');
            }
        }
    }
};

// Khởi chạy khi tài liệu nạp xong
document.addEventListener('DOMContentLoaded', function() {
    syncWithClientStorage();

    // Nếu ở staff portal: tự động nạp lịch y tá đầu tiên và bảng phản hồi
    if (document.getElementById('nurseScheduleContainer')) {
        renderNurseScheduleView('minh');
    }
    if (document.getElementById('staffFeedbackTableBody') || document.getElementById('staffFeedbackCountBadge')) {
        renderStaffFeedbacks();
    }
});

// ================= DUYỆT HỒ SƠ TUYỂN DỤNG ĐIỀU DƯỠNG (CV) =================
function approveCandidateCV(id, name) {
    const statusEl = document.getElementById(`cv-status-${id}`);
    if (statusEl) {
        statusEl.className = 'badge-status badge-active';
        statusEl.innerText = 'Đã gửi lịch PV';
    }
    showToast(`Đã gửi thông báo & SMS mời ứng viên ${name} tham gia phỏng vấn chuyên môn!`, 'success');
}

function acceptCandidate(id, name) {
    const statusEl = document.getElementById(`cv-status-${id}`);
    if (statusEl) {
        statusEl.className = 'badge-status badge-completed';
        statusEl.innerText = 'Trúng tuyển';
    }
    showToast(`Chúc mừng! Đã xác nhận trúng tuyển cho ứng viên ${name} và kích hoạt tài khoản Cổng Điều Dưỡng!`, 'success');
}

function rejectCandidateCV(id, name) {
    if (confirm(`Bạn có chắc chắn muốn từ chối hồ sơ của ứng viên ${name}?`)) {
        const row = document.getElementById(`cv-row-${id}`);
        if (row) {
            row.style.opacity = '0.5';
        }
        const statusEl = document.getElementById(`cv-status-${id}`);
        if (statusEl) {
            statusEl.className = 'badge-status badge-pending';
            statusEl.style.color = '#ef4444';
            statusEl.innerText = 'Không đạt sơ loại';
        }
        showToast(`Đã lưu trạng thái: Không đạt sơ loại cho ứng viên ${name}.`, 'warning');
    }
}

function previewCVModal(name, role, exp) {
    alert(`[HỒ SƠ TUYỂN DỤNG ĐIỀU DƯỠNG]\n\n• Ứng viên: ${name}\n• Vị trí: ${role}\n• Kinh nghiệm: ${exp}\n• Trạng thái hồ sơ: Bằng tốt nghiệp & Chứng chỉ hành nghề y tế hợp lệ.\n\nĐã sẵn sàng xếp lịch phỏng vấn.`);
}

// Điều chỉnh sản phẩm / Thiết bị kho
function openEditProductModal(id, name, type, price, stock) {
    const idEl = document.getElementById('editProdId');
    const codeEl = document.getElementById('editProdCode');
    const nameEl = document.getElementById('editProdName');
    const priceEl = document.getElementById('editProdPrice');
    const stockEl = document.getElementById('editProdStock');

    if (idEl) idEl.value = id;
    if (codeEl) codeEl.value = '#' + id;
    if (nameEl) nameEl.value = name;
    if (priceEl) priceEl.value = price;
    if (stockEl) stockEl.value = stock;

    openModal('editProductModal');
}

function submitEditProduct(e) {
    e.preventDefault();
    const id = document.getElementById('editProdId').value;
    const name = document.getElementById('editProdName').value;
    const price = document.getElementById('editProdPrice').value;
    const stock = document.getElementById('editProdStock').value;

    const nameCell = document.getElementById(`prod-name-${id}`);
    const priceCell = document.getElementById(`prod-price-${id}`);
    const stockCell = document.getElementById(`prod-stock-${id}`);

    if (nameCell) nameCell.innerText = name;
    if (priceCell) priceCell.innerText = price;
    if (stockCell) stockCell.innerHTML = `<strong>${stock}</strong>`;

    closeModal('editProductModal');
    if (typeof showToast === 'function') {
        showToast(`Đã lưu cập nhật thông tin sản phẩm #${id} thành công!`, 'success');
    }
}

