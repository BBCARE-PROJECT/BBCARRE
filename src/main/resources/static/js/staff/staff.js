/**
 * BBCare Homecare - Logic Cổng Nhân Viên Vận Hành & Điều Phối (Staff Portal)
 * Kiến trúc sẵn sàng cho Spring Boot + Thymeleaf
 */

document.addEventListener('DOMContentLoaded', function() {
    if (typeof syncWithClientStorage === 'function') {
        syncWithClientStorage();
    }
    if (typeof renderAppointmentsTable === 'function' && document.getElementById('appointmentListTableBody')) {
        renderAppointmentsTable();
    }
    if (typeof renderStaffNurseTable === 'function' && document.getElementById('nurseListTableBody')) {
        renderStaffNurseTable();
    }
    console.log('[BBCare Staff] Cổng Nhân Viên Vận Hành đã sẵn sàng hoạt động.');
});

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

    // ==================== THÀNH VIÊN 5: KHO & NGHIỆM THU HOÀN CỌC ====================

    // 1. Mở Modal Nghiệm thu trả thiết bị & hoàn cọc
    function openReturnModal(orderId, customerName, equipName, depositText) {
        const modalIdEl = document.getElementById('returnModalId');
        const custEl = document.getElementById('returnModalCustomer');
        const equipEl = document.getElementById('returnModalEquip');
        const depEl = document.getElementById('returnModalDeposit');
        const refundEl = document.getElementById('returnRefundAmt');

        if (modalIdEl) modalIdEl.value = orderId;
        if (custEl) custEl.innerText = customerName;
        if (equipEl) equipEl.innerText = equipName;
        if (depEl) depEl.innerText = depositText;
        if (refundEl) refundEl.value = depositText.replace(/\D/g, ''); // Lấy số tiền nguyên

        openModal('equipmentReturnModal');
    }

    // 2. Xác nhận Nghiệm thu & Hoàn tiền cọc (Gửi API xuống Backend)
    async function submitEquipmentReturn(e) {
        e.preventDefault();
        const orderId = document.getElementById('returnModalId').value;
        const condition = document.getElementById('returnCondition').value;
        const rawRefund = document.getElementById('returnRefundAmt').value.replace(/\D/g, '');
        const refundAmount = parseFloat(rawRefund) || 0;

        try {
            const response = await fetch(`/api/staff/orders/${orderId}/return-deposit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refundAmount: refundAmount,
                    conditionNote: condition
                })
            });

            if (response.ok) {
                closeModal('equipmentReturnModal');
                alert(`✅ Nghiệm thu đơn #${orderId} thành công! Đã hoàn cọc ${refundAmount.toLocaleString()}đ và tự động nhập lại kho.`);

                // Cập nhật giao diện dòng bảng sang trạng thái đã hoàn tất
                const row = document.getElementById(`return-row-${orderId}`);
                if (row) {
                    row.style.opacity = '0.5';
                    const actionCell = row.querySelector('.btn-process-return');
                    if (actionCell) actionCell.outerHTML = '<span class="badge-status badge-completed">Đã hoàn tất</span>';
                }
            } else {
                const err = await response.text();
                alert("⚠️ Lỗi khi nghiệm thu: " + err);
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            // Fallback giao diện demo nếu chưa bật DB
            closeModal('equipmentReturnModal');
            alert(`✅ [Demo] Đã nghiệm thu thiết bị và hoàn trả ${refundAmount.toLocaleString()}đ cọc cho khách!`);
        }
    }

}
