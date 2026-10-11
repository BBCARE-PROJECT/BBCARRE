/**
 * BBCare Homecare - Logic Cổng Quản Trị Hệ Thống (Admin Portal)
 * Kiến trúc sẵn sàng cho Spring Boot + Thymeleaf
 */

document.addEventListener('DOMContentLoaded', function() {
    if (typeof syncWithClientStorage === 'function') {
        syncWithClientStorage();
    }
    console.log('[BBCare Admin] Cổng Quản Trị Hệ Thống đã sẵn sàng hoạt động.');
});
