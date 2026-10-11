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
}
