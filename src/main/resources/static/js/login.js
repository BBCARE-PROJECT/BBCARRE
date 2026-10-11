function $(id) { return document.getElementById(id); }

function switchAuthTab(type) {
  if (type === 'login') {
    $('tabLoginBtn').classList.add('active');
    $('tabRegisterBtn').classList.remove('active');
    $('loginForm').style.display = 'block';
    $('registerForm').style.display = 'none';
  } else {
    $('tabLoginBtn').classList.remove('active');
    $('tabRegisterBtn').classList.add('active');
    $('loginForm').style.display = 'none';
    $('registerForm').style.display = 'block';
  }
}

function fillLogin(email, pass) {
  const u = $('loginUsername');
  const p = $('loginPassword');
  if (u) u.value = email;
  if (p) p.value = pass;
}

// Đăng nhập nhanh 1 chạm và chuyển thẳng vào cổng actor tương ứng
function quickLogin(role) {
  if (role === 'nurse') {
    fillLogin('minh.nguyen@bbcare.vn', 'BBCare@2026');
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'ĐD. Nguyễn Văn Minh');
    localStorage.setItem('bbcare_role', 'nurse');
    window.location.href = 'nurse.html';
  } else if (role === 'staff') {
    fillLogin('ha.nguyen@bbcare.vn', 'BBCare@2026');
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Nguyễn Thu Hà');
    localStorage.setItem('bbcare_role', 'staff');
    window.location.href = 'staff.html';
  } else if (role === 'admin') {
    fillLogin('admin@bbcare.vn', 'BBCare@2026');
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Quản Trị Viên');
    localStorage.setItem('bbcare_role', 'admin');
    window.location.href = 'admin.html';
  } else {
    fillLogin('khachhang@gmail.com', 'BBCare@2026');
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Nguyễn Văn An');
    localStorage.setItem('bbcare_role', 'client');
    window.location.href = 'index.html?account=true';
  }
}

function handleAuthSubmit(e, type) {
  e.preventDefault();
  if (type === 'register') {
    const nameInput = $('regName');
    const userName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Nguyễn Văn An';
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', userName);
    localStorage.setItem('bbcare_role', 'client');
    window.location.href = 'index.html?account=true';
    return;
  }

  const username = ($('loginUsername')?.value || '').toLowerCase().trim();
  
  // Phân quyền theo email / gmail
  if (username.includes('nurse') || username.includes('dieuduong') || username === 'minh.nguyen@bbcare.vn') {
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'ĐD. Nguyễn Văn Minh');
    localStorage.setItem('bbcare_role', 'nurse');
    window.location.href = 'nurse.html';
  } else if (username.includes('staff') || username.includes('vanhanh') || username === 'ha.nguyen@bbcare.vn') {
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Nguyễn Thu Hà');
    localStorage.setItem('bbcare_role', 'staff');
    window.location.href = 'staff.html';
  } else if (username.includes('admin') || username === 'admin@bbcare.vn') {
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Quản Trị Viên');
    localStorage.setItem('bbcare_role', 'admin');
    window.location.href = 'admin.html';
  } else {
    // Khách hàng / Bệnh nhân thông thường
    localStorage.setItem('bbcare_logged_in', 'true');
    localStorage.setItem('bbcare_user_name', 'Nguyễn Văn An');
    localStorage.setItem('bbcare_role', 'client');
    window.location.href = 'index.html?account=true';
  }
}
