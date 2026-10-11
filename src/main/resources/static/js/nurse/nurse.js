/**
 * BBCare Homecare - Logic Cổng Điều Dưỡng Viên (Nurse Portal)
 * Kiến trúc sẵn sàng cho Spring Boot + Thymeleaf
 */

document.addEventListener('DOMContentLoaded', function() {
    if (typeof syncWithClientStorage === 'function') {
        syncWithClientStorage();
    }
    console.log('[BBCare Nurse] Cổng Điều Dưỡng đã sẵn sàng hoạt động.');
});
