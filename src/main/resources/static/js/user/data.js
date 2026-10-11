/* =========================================================
   1. DỮ LIỆU CƠ BẢN
========================================================= */
let isLoggedIn = false;
let currentUser = { name: 'Nguyễn Văn An', phone: '0908786168' };

const SHIFTS_DATA = {
  CA_2H:{key:'CA_2H',name:'Ca Sáng',timeRange:'07:00 – 09:00',price:220000,unit:'ca'},
  CA_2H_2:{key:'CA_2H_2',name:'Ca Sáng',timeRange:'09:00 – 11:00',price:220000,unit:'ca'},
  CA_2H_3:{key:'CA_2H_3',name:'Ca Chiều',timeRange:'14:00 – 16:00',price:220000,unit:'ca'},
  CA_2H_4:{key:'CA_2H_4',name:'Ca Chiều',timeRange:'16:00 – 18:00',price:220000,unit:'ca'},
  CA_5H:{key:'CA_5H',name:'Ca Sáng',timeRange:'07:00 – 12:00',price:400000,unit:'ca'},
  CA_5H_2:{key:'CA_5H_2',name:'Ca Chiều',timeRange:'13:00 – 18:00',price:400000,unit:'ca'},
  CA_5H_3:{key:'CA_5H_3',name:'Ca Tối',timeRange:'18:00 – 23:00',price:400000,unit:'ca'},
  CA_NGAY:{key:'CA_NGAY',name:'Ca Ngày',timeRange:'07:00 – 19:00',price:800000,unit:'ca'},
  CA_DEM:{key:'CA_DEM',name:'Ca Đêm',timeRange:'19:00 – 07:00',price:800000,unit:'ca'},
  CA_24H:{key:'CA_24H',name:'Trọn Gói 24/24',timeRange:'24 giờ liên tục',price:1400000,unit:'ngày',is24hOnly:true}
};

const WZ_SKILLS=[
  {k:'thay_bang',n:'Thay băng & cắt chỉ',d:'Rửa vết mổ, vết loét, cắt chỉ vô trùng',i:'fa-bandage',basePrice:120000},
  {k:'truyen_dich',n:'Tiêm & truyền dịch',d:'Truyền nước, đạm, vitamin theo đơn bác sĩ',i:'fa-syringe',basePrice:150000},
  {k:'cho_an_sonde',n:'Cho ăn qua ống Sonde',d:'Bơm thức ăn, rửa & vệ sinh ống sonde',i:'fa-utensils',basePrice:130000},
  {k:'phuc_hoi',n:'Phục hồi chức năng',d:'Tập đi lại, vật lý trị liệu, xoa bóp cơ',i:'fa-child-reaching',basePrice:180000},
  {k:'ho_tro_oxy',n:'Theo dõi sinh hiệu & thở Oxy',d:'Canh monitor, SpO2, huyết áp liên tục',i:'fa-lungs',basePrice:160000, allows24h:true},
  {k:'ho_ly_sinh_hoat',n:'Hộ lý sinh hoạt',d:'Tắm rửa, thay tã, dìu đi lại & cho ăn',i:'fa-hands-holding-child',basePrice:130000, allows24h:true}
];

const WZ_PATIENT=[['WALK','🚶 Tự đi lại được'],['WHEELCHAIR','🦽 Xe lăn / yếu sức'],['BEDRIDDEN','🛏️ Nằm liệt giường'],['VENTILATOR','🫁 Thở Oxy / có ống thông']];

const WZ_AGE_GROUPS = [
  { id: 'ELDER', name: 'Người cao tuổi (≥ 60 tuổi)', icon: 'fa-person-cane' },
  { id: 'ADULT', name: 'Người lớn (18 – 59 tuổi)', icon: 'fa-user' },
  { id: 'TEEN', name: 'Thanh thiếu niên (12 – 17 tuổi)', icon: 'fa-user-graduate' },
  { id: 'CHILD', name: 'Trẻ em (< 12 tuổi)', icon: 'fa-child' }
];

const WZ_PAYMENTS = [
  { id: 'VIETQR', name: 'VietQR / Chuyển khoản', desc: 'Quét mã QR mọi ứng dụng ngân hàng 24/7', icon: 'fa-qrcode', tag: 'Khuyên dùng' },
  { id: 'MOMO', name: 'Ví điện tử MoMo', desc: 'Thanh toán một chạm qua MoMo', icon: 'fa-wallet', tag: 'Nhanh chóng' },
  { id: 'CARD', name: 'Thẻ ATM / Visa / Master', desc: 'Liên kết tài khoản & cổng thanh toán', icon: 'fa-credit-card', tag: 'Bảo mật' },
  { id: 'COD', name: 'Tiền mặt sau ca', desc: 'Thanh toán trực tiếp cho Điều dưỡng', icon: 'fa-money-bill-1-wave', tag: 'Truyền thống' }
];

const NURSES_DATABASE = [
 {id:'N01',name:'ĐĐ. Nguyễn Văn Minh',spec:'Chuyên Khoa Ngoại & Vết Thương Mổ',exp:'10 năm kinh nghiệm',rating:4.9,reviewsCount:128,district:'Liên Chiểu',station:'Hoàng Trung Thông, Q. Liên Chiểu',lat:16.0680,lng:108.1500,avatar:'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',certs:'Cử nhân Điều dưỡng ĐH Y Dược',skills:'Thạo cắt chỉ vết mổ, rửa vết thương, truyền dịch y khoa',topReview:'"Anh Minh làm rất mát tay, rửa vết thương không đau."' },
 {id:'N02',name:'ĐĐ. Trần Thị Lan',spec:'Nhi Khoa & Chăm Sóc Ống Sonde',exp:'8 năm kinh nghiệm',rating:5.0,reviewsCount:95,district:'Hải Châu',station:'Nguyễn Văn Linh, Q. Hải Châu',lat:16.0600,lng:108.2200,avatar:'https://images.unsplash.com/photo-1594824813576-905ffeb52317?auto=format&fit=crop&q=80&w=300',certs:'Chứng chỉ Nhi khoa nâng cao',skills:'Cho ăn qua ống Sonde, truyền dịch, chăm sóc trẻ nhỏ',topReview:'"Chị Lan rất kiên nhẫn khi cho cụ ăn qua ống Sonde."' },
 {id:'N03',name:'BS. Lê Hoàng Quân',spec:'Phục Hồi Chức Năng & VLTL',exp:'15 năm kinh nghiệm',rating:4.9,reviewsCount:110,district:'Thanh Khê',station:'Điện Biên Phủ, Q. Thanh Khê',lat:16.0630,lng:108.1850,avatar:'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',certs:'Bác sĩ Chuyên khoa PHCN',skills:'Vật lý trị liệu, tập đi sau mổ, bấm huyệt',topReview:'"Bài tập của bác sĩ Quân giúp ông phục hồi tai biến rất nhanh."' },
 {id:'N04',name:'ĐĐ. Phạm Thanh Hà',spec:'Hồi Sức Cấp Cứu & Trực Đêm Oxy',exp:'7 năm kinh nghiệm',rating:4.8,reviewsCount:82,district:'Sơn Trà',station:'Võ Văn Kiệt, Q. Sơn Trà',lat:16.0900,lng:108.2400,avatar:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',certs:'Chứng chỉ BLS/ACLS',skills:'Vận hành bình Oxy, máy thở, canh Monitor',topReview:'"Yên tâm khi giao ca đêm cho cô Hà."' },
 {id:'N05',name:'ĐĐ. Hoàng Thu Thảo',spec:'Chăm Sóc Người Già & Hộ Lý',exp:'6 năm kinh nghiệm',rating:4.9,reviewsCount:78,district:'Ngũ Hành Sơn',station:'Lê Văn Hiến, Q. Ngũ Hành Sơn',lat:16.0150,lng:108.2500,avatar:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300',certs:'Cử nhân Điều dưỡng Đa khoa',skills:'Chăm sóc người già suy nhược, xoa bóp, chế độ ăn kiêng',topReview:'"Cô Thảo rất chu đáo, chăm bà như người nhà."' },
 {id:'N06',name:'ĐĐ. Đặng Quốc Bảo',spec:'Điều Dưỡng Cấp Cứu Ban Đêm',exp:'9 năm kinh nghiệm',rating:4.8,reviewsCount:104,district:'Cẩm Lệ',station:'Cách Mạng Tháng 8, Q. Cẩm Lệ',lat:16.0200,lng:108.1900,avatar:'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300',certs:'Chứng chỉ Cấp cứu ngoại viện',skills:'Theo dõi oxy, truyền dịch, xử lý sốt cao co giật',topReview:'"Anh Bảo trực đêm rất cẩn thận, túc trực liên tục."' }
];

const PRODUCTS = [
  // =========================================================
  // 1. THIẾT BỊ HỖ TRỢ THỞ & HÔ HẤP
  // =========================================================
  {
    id: 'p_oxy_machine',
    cat: 'hohap',
    title: 'Máy Tạo Oxy (5L / 10L)',
    full: 'Máy Tạo Oxy Y Tế Chuyên Dụng (5L / 10L Gia Đình)',
    desc: 'Tự lọc oxy tinh khiết từ không khí, cắm điện dùng liên tục 24/7 mà không lo hết khí như bình nén truyền thống.',
    tag: 'Thiết bị Hô hấp & Thở',
    hasDualAction: true,
    rentPrice: 350000,
    rentText: '350.000 VNĐ / ngày',
    buyPrice: 12500000,
    buyText: '12.500.000 VNĐ',
    price: 350000,
    priceText: '350.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_cpap_bipap',
    cat: 'hohap',
    title: 'Máy Trợ Thở CPAP / BiPAP',
    full: 'Máy Trợ Thở Cá Nhân CPAP / BiPAP Thông Minh',
    desc: 'Hỗ trợ thở cho người bị suy hô hấp, viêm phổi tắc nghẽn mạn tính (COPD), hoặc hội chứng ngưng thở khi ngủ.',
    tag: 'Thiết bị Hô hấp & Thở',
    hasDualAction: true,
    rentPrice: 400000,
    rentText: '400.000 VNĐ / ngày',
    buyPrice: 18000000,
    buyText: '18.000.000 VNĐ',
    price: 400000,
    priceText: '400.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_ventilator',
    cat: 'hohap',
    title: 'Máy Thở Xâm Nhập & Không Xâm Nhập',
    full: 'Máy Thở Đa Năng Ventilator Xâm Nhập / Không Xâm Nhập',
    desc: 'Dùng cho bệnh nhân nặng, mở khí quản hoặc liệt cơ hô hấp điều trị hồi sức tích cực tại nhà.',
    tag: 'Thiết bị Hô hấp & Thở',
    hasDualAction: true,
    rentPrice: 850000,
    rentText: '850.000 VNĐ / ngày',
    buyPrice: 45000000,
    buyText: '45.000.000 VNĐ',
    price: 850000,
    priceText: '850.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_suction_machine',
    cat: 'hohap',
    title: 'Máy Hút Đờm / Hút Dịch Y Tế',
    full: 'Máy Hút Đờm / Hút Dịch Nhớ Họng Áp Lực Tiêu Chuẩn',
    desc: 'Giúp làm sạch đường thở thông thoáng cho người già, người nằm một chỗ hoặc bệnh nhân sau phẫu thuật.',
    tag: 'Thiết bị Hô hấp & Thở',
    hasDualAction: true,
    rentPrice: 120000,
    rentText: '120.000 VNĐ / ngày',
    buyPrice: 2200000,
    buyText: '2.200.000 VNĐ',
    price: 120000,
    priceText: '120.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_spo2_monitor',
    cat: 'hohap',
    title: 'Máy Đo SpO2 & Monitor Sinh Hiệu',
    full: 'Máy Đo Nồng Độ Oxy SpO2 & Monitor Theo Dõi Sinh Hiệu',
    desc: 'Theo dõi liên tục nhịp tim, huyết áp động mạch và nồng độ bão hòa oxy trong máu cảnh báo tự động.',
    tag: 'Thiết bị Hô hấp & Thở',
    hasDualAction: true,
    rentPrice: 150000,
    rentText: '150.000 VNĐ / ngày',
    buyPrice: 5800000,
    buyText: '5.800.000 VNĐ',
    price: 150000,
    priceText: '150.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
  },

  // =========================================================
  // 2. THIẾT BỊ HỖ TRỢ DI CHUYỂN & CHĂM SÓC NẰM TẠI CHỖ
  // =========================================================
  {
    id: 'p_hospital_bed',
    cat: 'dichuyen',
    title: 'Giường Bệnh Nhân Y Tế (Tay Quay / Điện)',
    full: 'Giường Bệnh Nhân Y Tế Đa Năng (1-2 Tay Quay / Giường Điện)',
    desc: 'Nâng hạ đầu, nâng hạ chân, tích hợp bô vệ sinh tại giường và thành chắn an toàn chống té ngã.',
    tag: 'Di chuyển & Chăm sóc nằm',
    hasDualAction: true,
    rentPrice: 250000,
    rentText: '250.000 VNĐ / ngày',
    buyPrice: 9500000,
    buyText: '9.500.000 VNĐ',
    price: 250000,
    priceText: '250.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_anti_bedsore_mat',
    cat: 'dichuyen',
    title: 'Đệm Hơi Chống Loét Y Khoa',
    full: 'Đệm Hơi Y Tế Chống Loét Đảo Khí Tự Động',
    desc: 'Cơ chế luân chuyển múi khí liên tục giúp giảm áp lực tiếp xúc, chống hoại tử da cho người nằm liệt lâu ngày.',
    tag: 'Di chuyển & Chăm sóc nằm',
    hasDualAction: true,
    rentPrice: 80000,
    rentText: '80.000 VNĐ / ngày',
    buyPrice: 1150000,
    buyText: '1.150.000 VNĐ',
    price: 80000,
    priceText: '80.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_wheelchair',
    cat: 'dichuyen',
    title: 'Xe Lăn Y Tế / Xe Lăn Điện',
    full: 'Xe Lăn Y Tế Gấp Gọn & Xe Lăn Điện Tự Động',
    desc: 'Hỗ trợ đưa bệnh nhân đi lại trong nhà, tắm rửa hoặc di chuyển ra ngoài hóng mát thuận tiện.',
    tag: 'Di chuyển & Chăm sóc nằm',
    hasDualAction: true,
    rentPrice: 100000,
    rentText: '100.000 VNĐ / ngày',
    buyPrice: 2800000,
    buyText: '2.800.000 VNĐ',
    price: 100000,
    priceText: '100.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_commode_walker',
    cat: 'dichuyen',
    title: 'Ghế Bô Vệ Sinh / Khung Tập Đi / Nạng',
    full: 'Bộ Ghế Bô Vệ Sinh, Khung Tập Đi Inox & Nạng Y Tế',
    desc: 'Cho người phục hồi chức năng sau tai biến, gãy xương hoặc phẫu thuật khớp háng, khớp gối.',
    tag: 'Di chuyển & Chăm sóc nằm',
    hasDualAction: true,
    rentPrice: 50000,
    rentText: '50.000 VNĐ / ngày',
    buyPrice: 650000,
    buyText: '650.000 VNĐ',
    price: 50000,
    priceText: '50.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600'
  },

  // =========================================================
  // 3. THIẾT BỊ HỖ TRỢ ĐIỀU TRỊ & PHỤC HỒI
  // =========================================================
  {
    id: 'p_syringe_pump',
    cat: 'dieutri',
    title: 'Bơm Tiêm Điện & Máy Truyền Dịch',
    full: 'Bơm Tiêm Điện Tự Động & Máy Kiểm Soát Tốc Độ Truyền Dịch',
    desc: 'Kiểm soát chính xác tuyệt đối tốc độ và liều lượng thuốc, dung dịch dinh dưỡng truyền vào cơ thể người bệnh.',
    tag: 'Điều trị & Phục hồi',
    hasDualAction: true,
    rentPrice: 180000,
    rentText: '180.000 VNĐ / ngày',
    buyPrice: 14000000,
    buyText: '14.000.000 VNĐ',
    price: 180000,
    priceText: '180.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_infrared_lamp',
    cat: 'dieutri',
    title: 'Đèn Hồng Ngoại / Máy Vật Lý Trị Liệu',
    full: 'Đèn Hồng Ngoại Sưởi Ấm & Máy Vật Lý Trị Liệu Di Động',
    desc: 'Hỗ trợ giảm đau nhức, tan bầm tím, giảm sưng và phục hồi chức năng cơ xương khớp tại nhà.',
    tag: 'Điều trị & Phục hồi',
    hasDualAction: true,
    rentPrice: 90000,
    rentText: '90.000 VNĐ / ngày',
    buyPrice: 1650000,
    buyText: '1.650.000 VNĐ',
    price: 90000,
    priceText: '90.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_jaundice_lamp',
    cat: 'dieutri',
    title: 'Máy Chiếu Đèn Trị Vàng Da Trẻ Sơ Sinh',
    full: 'Máy Chiếu Đèn LED Ánh Sáng Xanh Trị Vàng Da Sơ Sinh',
    desc: 'Dùng trong trường hợp trẻ sơ sinh bị vàng da sinh lý nhẹ theo chỉ định theo dõi của bác sĩ tại nhà.',
    tag: 'Điều trị & Phục hồi',
    hasDualAction: true,
    rentPrice: 200000,
    rentText: '200.000 VNĐ / ngày',
    buyPrice: 7200000,
    buyText: '7.200.000 VNĐ',
    price: 200000,
    priceText: '200.000 VNĐ / ngày',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
  },

  // =========================================================
  // 4. THỰC PHẨM CHỨC NĂNG (TPCN) - PHÂN LOẠI RIÊNG
  // =========================================================
  {
    id: 'p_tpcn1',
    cat: 'tpcn',
    title: 'TPCN Hỗ Trợ Xương Khớp Glucosamine',
    full: 'TPCN Hỗ Trợ Khớp & Tái Tạo Sụn Glucosamine 1500mg',
    desc: 'Bổ sung dịch khớp, giúp sụn khớp vận động linh hoạt và phòng ngừa thoái hóa ở người cao tuổi.',
    tag: 'Thực phẩm chức năng',
    hasDualAction: false,
    buyPrice: 350000,
    buyText: '350.000 VNĐ',
    price: 350000,
    priceText: '350.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_tpcn3',
    cat: 'tpcn',
    title: 'Viên Uống Hoạt Huyết Bổ Não Ginkgo',
    full: 'Viên Uống Bổ Não & Tăng Tuần Hoàn Não Ginkgo Biloba 120mg',
    desc: 'Tăng cường tuần hoàn máu não, giảm hoa mắt, chóng mặt, đau đầu và hỗ trợ giấc ngủ ngon.',
    tag: 'Thực phẩm chức năng',
    hasDualAction: false,
    buyPrice: 280000,
    buyText: '280.000 VNĐ',
    price: 280000,
    priceText: '280.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_tpcn_omega',
    cat: 'tpcn',
    title: 'Dầu Cá Tinh Khiết Omega-3 Tim Mạch',
    full: 'Dầu Cá Hồi Tinh Khiết Omega-3 EPA & DHA (Hộp 100 viên)',
    desc: 'Bảo vệ thành mạch, hỗ trợ giảm cholesterol máu, tăng cường thị lực và tim mạch khỏe mạnh.',
    tag: 'Thực phẩm chức năng',
    hasDualAction: false,
    buyPrice: 320000,
    buyText: '320.000 VNĐ',
    price: 320000,
    priceText: '320.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_tpcn_calci',
    cat: 'tpcn',
    title: 'Canxi Nano & Vitamin D3 Chống Loãng Xương',
    full: 'Viên Uống Canxi Nano Hấp Thu Nhanh & Vitamin D3 MK7',
    desc: 'Bổ sung canxi hữu cơ không gây nóng, phòng ngừa giòn xương xốp xương cho phụ nữ và người già.',
    tag: 'Thực phẩm chức năng',
    hasDualAction: false,
    buyPrice: 250000,
    buyText: '250.000 VNĐ',
    price: 250000,
    priceText: '250.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
  },

  // =========================================================
  // 5. THUỐC & VẬT TƯ TIÊU HAO Y TẾ
  // =========================================================
  {
    id: 'p_gac',
    cat: 'vattu',
    title: 'Bộ Gạc Tiệt Trùng & Nước Muối Sinh Lý',
    full: 'Bộ Gạc Tiệt Trùng Y Tế 10 Gói & Nước Muối Rửa Vết Thương',
    desc: 'Dụng cụ thiết yếu để rửa và thay băng vết thương vô trùng hàng ngày tại gia đình.',
    tag: 'Vật tư & Thuốc y tế',
    hasDualAction: false,
    buyPrice: 60000,
    buyText: '60.000 VNĐ',
    price: 60000,
    priceText: '60.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p_bang',
    cat: 'vattu',
    title: 'Băng Dán Vô Trùng Urgo Chống Nước',
    full: 'Băng Dán Y Tế Cá Nhân Urgo Chống Nước Vô Trùng (Hộp 100 miếng)',
    desc: 'Băng dán vết thương chống thấm nước, vô trùng ngăn ngừa nhiễm khuẩn hiệu quả.',
    tag: 'Vật tư & Thuốc y tế',
    hasDualAction: false,
    buyPrice: 45000,
    buyText: '45.000 VNĐ',
    price: 45000,
    priceText: '45.000 VNĐ',
    img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=600'
  }
];

// =========================================================
// QUẢN LÝ THIẾT BỊ & ĐƠN HÀNG ĐÃ MUA / THUÊ / ĐANG THUÊ
// =========================================================
let USER_EQUIPMENT_ORDERS = [
  // 1. THIẾT BỊ ĐANG THUÊ
  {
    orderId: 'RNT-8801',
    type: 'RENT',
    itemType: 'device',
    title: 'Máy Tạo Oxy Y Tế 5L Gia Đình',
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
    startDate: '08/10/2026',
    endDate: '15/10/2026',
    durationDays: 7,
    dailyRate: 350000,
    totalPrice: 2450000,
    status: 'ACTIVE_RENT', // 'ACTIVE_RENT' | 'WAITING_RETURN' | 'RETURNED'
    statusText: 'Đang thuê sử dụng',
    returnStatus: 'NOT_RETURNED', // 'NOT_RETURNED' | 'WAITING_STAFF' | 'RETURNED'
    assignedStaff: 'ĐĐ. Trần Thị Mai (KTV Kho BBCare)',
    staffPhone: '0905 123 456',
    serialNumber: 'OXY-5L-VN992',
    notes: 'Kèm bình tạo ẩm & dây thở cannula vô trùng'
  },
  {
    orderId: 'RNT-8802',
    type: 'RENT',
    itemType: 'device',
    title: 'Đệm Hơi Y Tế Chống Loét Đảo Khí Tự Động',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    startDate: '05/10/2026',
    endDate: '20/10/2026',
    durationDays: 15,
    dailyRate: 80000,
    totalPrice: 1200000,
    status: 'ACTIVE_RENT',
    statusText: 'Đang thuê sử dụng',
    returnStatus: 'NOT_RETURNED',
    assignedStaff: 'ĐĐ. Nguyễn Văn Minh (KTV Thiết Bị)',
    staffPhone: '0908 786 168',
    serialNumber: 'MAT-ANTI-441',
    notes: 'Bơm khí đảo tự động 12 phút/chu kỳ'
  },

  // 2. THIẾT BỊ ĐÃ THUÊ VÀ ĐÃ TRẢ (STAFF ĐÃ KIỂM TRA THU HỒI)
  {
    orderId: 'RNT-7605',
    type: 'RENT',
    itemType: 'device',
    title: 'Giường Bệnh Nhân Y Tế 2 Tay Quay',
    img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400',
    startDate: '10/09/2026',
    endDate: '25/09/2026',
    durationDays: 15,
    dailyRate: 250000,
    totalPrice: 3750000,
    status: 'RETURNED',
    statusText: 'Đã hoàn trả thiết bị',
    returnStatus: 'RETURNED',
    returnedDate: '25/09/2026',
    assignedStaff: 'KTV. Lê Văn Hùng (Kho Thiết Bị Y Tế BBCare)',
    staffPhone: '0905 888 999',
    staffCheckNote: 'Đã kiểm tra kỹ thuật: Tay quay hoạt động tốt, đệm sạch sẽ, đạt chuẩn nhập kho lưu trữ.',
    serialNumber: 'BED-MED-092'
  },

  // 3. THỰC PHẨM CHỨC NĂNG & THUỐC ĐÃ MUA
  {
    orderId: 'BUY-5521',
    type: 'BUY',
    itemType: 'tpcn',
    title: 'TPCN Hỗ Trợ Xương Khớp Glucosamine',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    orderDate: '01/10/2026',
    quantity: 2,
    unitPrice: 350000,
    totalPrice: 700000,
    status: 'DELIVERED',
    statusText: 'Đã giao hàng tận nhà',
    categoryName: 'Thực phẩm chức năng (TPCN)',
    usageNote: 'Uống 1 viên/ngày sau bữa ăn sáng'
  },
  {
    orderId: 'BUY-5522',
    type: 'BUY',
    itemType: 'tpcn',
    title: 'Viên Uống Hoạt Huyết Bổ Não Ginkgo Biloba',
    img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400',
    orderDate: '01/10/2026',
    quantity: 1,
    unitPrice: 280000,
    totalPrice: 280000,
    status: 'DELIVERED',
    statusText: 'Đã giao hàng tận nhà',
    categoryName: 'Thực phẩm chức năng (TPCN)',
    usageNote: 'Uống 1 viên vào buổi tối trước khi đi ngủ'
  },
  {
    orderId: 'BUY-5410',
    type: 'BUY',
    itemType: 'vattu',
    title: 'Máy Đo Huyết Áp Bắp Tay Omron',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=400',
    orderDate: '28/09/2026',
    quantity: 1,
    unitPrice: 750000,
    totalPrice: 750000,
    status: 'DELIVERED',
    statusText: 'Đã giao hàng tận nhà',
    categoryName: 'Thuốc & Dụng cụ y tế',
    serialNumber: 'OMRON-HEM-7120',
    usageNote: 'Bảo hành chính hãng 5 năm'
  }
];

const SERVICES_DATA = {
  xecuuThuong: {
    title: 'Dịch Vụ Xe Cứu Thương Chuyển Viện Khẩn Cấp',
    bannerTitle: '<i class="fa-solid fa-truck-medical"></i> ĐẶT XE CẤP CỨU CHUYỂN VIỆN KHẨN CẤP 24/7',
    content: `<p><strong>Homecare BBCare</strong> cung cấp dịch vụ xe cấp cứu và chuyển viện khẩn cấp 24/7 tại TP. Đà Nẵng và các tỉnh lân cận với trang thiết bị hồi sức hiện đại trên xe.</p><h3>Ưu Điểm Của Đội Xe Cấp Cứu BBCare:</h3><ul><li>Có mặt sau 10 - 15 phút gọi điện.</li><li>Trang bị máy thở, bình oxy y tế, máy Monitor theo dõi nhịp tim và cáng cứu thương chống xóc.</li><li>Có Y tá / Điều dưỡng đi kèm chăm sóc bệnh nhân suốt lộ trình.</li><li>Đưa đón bệnh nhân chuyển viện hoặc xuất viện về nhà an toàn.</li></ul>`
  },
  binhoxy: {
    title: 'Dịch Vụ Cho Thuê Bình Oxy & Máy Tạo Oxy Tận Nhà',
    bannerTitle: '<i class="fa-solid fa-cloud"></i> THUÊ BÌNH OXY & MÁY TẠO OXY TẬN NHÀ 24/7',
    content: `<p>Cung cấp giải pháp cho thuê bình oxy 10L - 40L tận nhà 24/7 tại Đà Nẵng.</p><h3>Ưu Điểm Dịch Vụ:</h3><ul><li>Oxy tinh khiết 99.5% chuẩn Bộ Y Tế.</li><li>Giao nhanh 15-30 phút tận nhà.</li><li>Lắp đặt và hướng dẫn vận hành chu đáo bởi Kỹ thuật viên y tế.</li></ul>`
  },
  dieuduong: {
    title: 'Dịch Vụ Đặt Ca Điều Dưỡng & Hộ Lý Chăm Sóc Tại Nhà',
    bannerTitle: '<i class="fa-solid fa-user-nurse"></i> ĐẶT CA Y TÁ TẠI NHÀ',
    content: `<p>Chăm sóc người bệnh tại nhà chuyên nghiệp chuẩn y khoa.</p>`
  },
  tuVanSucKhoe: {
    title: 'Dịch Vụ Tư Vấn Sức Khỏe & Chăm Sóc Y Tế Tận Nhà',
    bannerTitle: '<i class="fa-solid fa-comments"></i> TƯ VẤN SỨC KHỎE BỆNH NHÂN TRỰC TUYẾN',
    content: `<p>Đội ngũ Bác sĩ/Y tá tư vấn sức khỏe miễn phí 24/7 qua tổng đài và chat trực tuyến.</p>`
  }
};

let APPOINTMENTS_HISTORY = [
  {
    code: 'APP-102',
    patientName: 'Nguyễn Văn An',
    service: 'Theo dõi sinh hiệu & Thở Oxy tại nhà (Gói 3 ngày)',
    nurseName: 'ĐĐ. Trần Thị Mai',
    nurseTitle: 'Cử nhân Điều dưỡng ĐH Y Dược Đà Nẵng · 6 năm kinh nghiệm',
    nursePhone: '0905 123 456',
    nurseTasks: [
      'Đến đúng giờ tại địa chỉ bệnh nhân, chuẩn bị bình và dây thở Oxy vô khuẩn',
      'Gắn máy đo sinh hiệu SpO2 và theo dõi nhịp thở, độ bão hòa oxy trong máu',
      'Hỗ trợ cho người bệnh thở Oxy lưu lượng 2-3 lít/phút theo đúng chỉ định y khoa',
      'Đo kiểm tra huyết áp động mạch và thân nhiệt định kỳ trong suốt ca trực',
      'Vỗ rung lồng ngực nhẹ nhàng hỗ trợ giãn phế quản và lưu thông đường hô hấp',
      'Dặn dò người nhà cách chăm sóc và các dấu hiệu cần lưu ý khi thở oxy'
    ],
    duration: 'Ca 2 giờ (14:00 - 16:00)',
    time: '14:00 - 16:00 (10/10 - 12/10/2026)',
    dateStr: '2026-10-10',
    timeRange: '14:00 - 16:00 (Chiều)',
    addr: 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, TP. Đà Nẵng',
    notes: 'Bệnh nhân 70 tuổi, kiểm tra huyết áp và SpO2 định kỳ',
    status: 'CONFIRMED',
    statusText: 'Đã chốt lịch · Sắp trực',
    amount: 960000,
    rating: 0,
    totalDays: 3,
    scheduleDays: [
      {
        dayIndex: 1,
        date: '2026-10-10',
        label: 'Ngày 1 - 10/10 (Chiều nay 14:00 - 16:00)',
        status: 'UPCOMING',
        statusText: 'Sắp trực',
        vitals: null // Y tá chưa đến đo
      },
      {
        dayIndex: 2,
        date: '2026-10-11',
        label: 'Ngày 2 - 11/10 (Ngày mai 14:00 - 16:00)',
        status: 'UPCOMING',
        statusText: 'Chưa diễn ra',
        vitals: null
      },
      {
        dayIndex: 3,
        date: '2026-10-12',
        label: 'Ngày 3 - 12/10 (Ngày kia 14:00 - 16:00)',
        status: 'UPCOMING',
        statusText: 'Chưa diễn ra',
        vitals: null
      }
    ]
  },
  {
    code: 'APP-101',
    patientName: 'Nguyễn Văn An',
    service: 'Thay băng & Rửa vết thương mổ',
    nurseName: 'ĐĐ. Nguyễn Văn Minh',
    nurseTitle: 'Điều dưỡng Chăm sóc Vết thương Ngoại khoa · 7 năm kinh nghiệm',
    nursePhone: '0908 786 168',
    nurseTasks: [
      'Mang hộp dụng cụ y tế tiệt trùng, gạc vô khuẩn và dung dịch sát khuẩn ngoại khoa',
      'Rửa và sát khuẩn vết mổ phẫu thuật đúng quy trình vô trùng Bộ Y tế',
      'Kiểm tra tình trạng liền miệng vết khâu, đảm bảo khô ráo, không có dấu hiệu sưng đỏ',
      'Thay băng gạc tiệt trùng mới và băng ép bảo vệ miệng vết mổ an toàn',
      'Đo kiểm tra 3 chỉ số sinh hiệu (Huyết áp 120/80 mmHg, Mạch 75 bpm, SpO2 98%)',
      'Dặn dò người nhà cách giữ khô vết thương khi vệ sinh thân thể và chế độ dinh dưỡng'
    ],
    duration: 'Ca 2 giờ (08:00 - 10:00)',
    time: '08:00 - 10:00 (Sáng hôm nay 10/10)',
    dateStr: '2026-10-10',
    timeRange: '08:00 - 10:00 (Sáng)',
    addr: 'Lô 02-B2-05 Hoàng Trung Thông, Q. Liên Chiểu, TP. Đà Nẵng',
    notes: 'Rửa vết mổ vô trùng, thay băng sạch sẽ',
    status: 'COMPLETED',
    statusText: 'Đã hoàn thành ca trực hôm nay',
    amount: 250000,
    rating: 5,
    totalDays: 1,
    scheduleDays: [
      {
        dayIndex: 1,
        date: '2026-10-10',
        label: 'Ca sáng 10/10 (08:00 - 10:00)',
        status: 'COMPLETED',
        statusText: 'Đã hoàn thành',
        vitals: {
          bp: '120/80 mmHg',
          bpStatus: 'Ổn định',
          hr: '75 nhịp/phút',
          spo2: '98%',
          measuredAt: '09:15 sáng nay (bởi ĐĐ. Nguyễn Văn Minh)'
        }
      }
    ]
  }
];

let cart = [
  { id: 1, title: 'TPCN Hỗ Trợ Xương Khớp', price: 350000, qty: 1, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200' }
];

const WZ_NEXT=['Tiếp tục: chọn thời gian','Tiếp tục: chọn người chăm sóc','Tiếp tục: thanh toán & liên hệ','XÁC NHẬN ĐẶT CA'];
const B = {};

const $ = id => document.getElementById(id);
const fmt = n => n ? n.toLocaleString('vi-VN') : '0';
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

const NEWS_DATABASE = [
  {
    id: 'news_1',
    title: 'Cẩm nang theo dõi sinh hiệu tại nhà: Nhận biết dấu hiệu nguy hiểm ở người cao tuổi',
    category: 'Cẩm nang điều dưỡng',
    catSlug: 'dieuduong',
    author: 'BS. CK1 Lê Hoàng Quân',
    authorRole: 'Cố vấn Chuyên môn BBCare',
    date: '08/10/2026',
    readTime: '5 phút đọc',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    summary: 'Hướng dẫn chuẩn Bộ Y tế cách theo dõi 3 chỉ số sinh hiệu vàng: Huyết áp, nhịp tim và nồng độ SpO2 tại nhà, cùng các dấu hiệu cảnh báo cần gọi điều dưỡng can thiệp ngay lập tức.',
    content: `
      <h4>1. Tại sao cần đo sinh hiệu định kỳ cho người lớn tuổi?</h4>
      <p>Sinh hiệu (dấu hiệu sinh tồn) gồm Huyết áp, Nhịp mạch, Nhiệt độ và Độ bão hòa Oxy trong máu (SpO2). Ở người cao tuổi hoặc bệnh nhân sau phẫu thuật, các biến chứng tim mạch và suy hô hấp thường diễn biến âm thầm nhưng rất nhanh.</p>
      <h4>2. Các ngưỡng chỉ số an toàn chuẩn y khoa:</h4>
      <ul>
        <li><strong>Huyết áp tâm thu/tâm trương:</strong> Lý tưởng từ 110/70 đến 130/80 mmHg. Nếu huyết áp tâm thu > 160 mmHg hoặc < 90 mmHg, cần báo ngay cho nhân viên y tế.</li>
        <li><strong>Nhịp tim (Mạch):</strong> Dao động từ 60 – 90 nhịp/phút lúc nghỉ ngơi.</li>
        <li><strong>Nồng độ Oxy trong máu (SpO2):</strong> Trên 95% là bình thường. Nếu SpO2 tụt dưới 93%, bệnh nhân đang thiếu oxy tổ chức mô, cần cho thở oxy bổ sung.</li>
      </ul>
      <h4>3. Lời khuyên từ Điều dưỡng BBCare:</h4>
      <p>Nên đo sinh hiệu vào 2 thời điểm cố định: Buổi sáng sau khi thức dậy 30 phút và buổi tối trước khi đi ngủ. Ghi chép nhật ký theo dõi sinh hiệu vào Sổ sức khỏe điện tử để bác sĩ điều trị có cơ sở điều chỉnh liều lượng thuốc.</p>
    `
  },
  {
    id: 'news_2',
    title: 'Kỹ thuật rửa & thay băng vết mổ vô trùng tại nhà: Phòng ngừa nhiễm trùng chuẩn y khoa',
    category: 'Chăm sóc vết thương',
    catSlug: 'vetthuong',
    author: 'ĐĐ. Nguyễn Văn Minh',
    authorRole: 'Điều dưỡng Chuyên khoa Ngoại',
    date: '06/10/2026',
    readTime: '4 phút đọc',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    summary: 'Quy trình 5 bước thay băng rửa vết thương phẫu thuật, mổ đẻ, vết loét tì đè đúng kỹ thuật vô trùng vô khuẩn, bảo đảm miệng vết mổ nhanh liền sẹo.',
    content: `
      <h4>1. Nguy cơ nhiễm trùng vết mổ tại gia đình</h4>
      <p>Theo thống kê y tế, hơn 65% trường hợp nhiễm trùng vết mổ sau xuất viện xuất phát từ việc thay băng bằng dụng cụ không được hấp tiệt trùng hoặc thao tác tay trần của người nhà.</p>
      <h4>2. Quy tắc vô trùng tuyệt đối khi thay băng:</h4>
      <ul>
        <li>Rửa tay sát khuẩn 6 bước bằng dung dịch cồn y tế trước khi chạm vào gạc.</li>
        <li>Chỉ dùng nước muối sinh lý NaCl 0.9% hoặc dung dịch Povidine pha loãng theo chỉ định, không rắc thuốc bột lạ lên vết khâu.</li>
        <li>Rửa từ trong mép vết thương ra ngoài theo một chiều, không lau ngược lại tránh lây nhiễm chéo.</li>
        <li>Băng ép vừa phải, dùng gạc xốp vô trùng bảo vệ miệng vết mổ luôn khô ráo.</li>
      </ul>
      <h4>3. Dấu hiệu cảnh báo nhiễm trùng:</h4>
      <p>Nếu thấy vết mổ sưng tấy đỏ, đau tăng dần, rỉ dịch vàng đục hoặc người bệnh sốt trên 38°C, hãy đặt ca điều dưỡng BBCare đến kiểm tra xử lý khẩn cấp.</p>
    `
  },
  {
    id: 'news_3',
    title: 'Hướng dẫn sử dụng bình Oxy và máy tạo Oxy an toàn tuyệt đối cho người suy hô hấp',
    category: 'Thở Oxy & Hồi sức',
    catSlug: 'oxy',
    author: 'ĐĐ. Phạm Thanh Hà',
    authorRole: 'Điều dưỡng Hồi sức Cấp cứu',
    date: '04/10/2026',
    readTime: '6 phút đọc',
    img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600',
    summary: 'Cách vận hành đồng hồ áp suất, điều chỉnh lưu lượng lít/phút, bảo quản bình oxy gia đình chống cháy nổ và cách chăm sóc đường thở khi người bệnh thở oxy dài ngày.',
    content: `
      <h4>1. Nguyên tắc an toàn phòng chống cháy nổ với bình Oxy:</h4>
      <ul>
        <li>Đặt bình oxy ở nơi thoáng mát, cách xa nguồn nhiệt, bếp gas và công tắc điện ít nhất 3 mét.</li>
        <li>Tuyệt đối không hút thuốc lá trong phòng bệnh nhân đang thở oxy.</li>
        <li>Bình phải được cố định trên giá đỡ hoặc xe đẩy chuyên dụng, tránh ngã đổ làm gãy van áp lực.</li>
      </ul>
      <h4>2. Cách điều chỉnh lưu lượng thở đúng y lệnh:</h4>
      <p>Chỉ cho thở đúng lưu lượng lít/phút mà bác sĩ chỉ định (thường từ 1.5 đến 3 lít/phút đối với ống thở gọng kính Canula). Thở quá liều oxy trong thời gian dài có thể gây ức chế trung tâm hô hấp ở bệnh nhân COPD.</p>
      <h4>3. Làm ẩm đường thở:</h4>
      <p>Bình tạo ẩm phải luôn có nước cất hoặc nước tinh khiết ở mức giữa vạch Min và Max để tránh làm khô rát niêm mạc mũi họng của người bệnh.</p>
    `
  },
  {
    id: 'news_4',
    title: 'Chăm sóc dinh dưỡng cho bệnh nhân ăn qua ống Sonde dạ dày: Những điều cấm kỵ',
    category: 'Nhi & Dinh dưỡng',
    catSlug: 'dinhduong',
    author: 'ĐĐ. Trần Thị Lan',
    authorRole: 'Điều dưỡng Nhi & Nội khoa',
    date: '02/10/2026',
    readTime: '5 phút đọc',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    summary: 'Quy trình kiểm tra vị trí ống thông dạ dày trước khi bơm thức ăn, tư thế nằm của người bệnh, nhiệt độ thức ăn và cách phòng tránh trào ngược hít sặc vào phổi.',
    content: `
      <h4>1. Kiểm tra vị trí ống trước mỗi cữ ăn:</h4>
      <p>Luôn dùng bơm tiêm hút dịch dạ dày kiểm tra hoặc bơm 20ml khí nghe tiếng ùng ục ở vùng thượng vị để đảm bảo ống vẫn nằm đúng trong dạ dày, không bị tuột vào khí quản.</p>
      <h4>2. Tư thế chuẩn khi bơm thức ăn:</h4>
      <p>Nâng đầu giường hoặc kê gối cao từ 30 – 45 độ trong suốt quá trình ăn và giữ nguyên tư thế đó ít nhất 45 phút sau khi ăn để chống trào ngược thức ăn vào phổi gây viêm phổi hít sặc nguy hiểm.</p>
      <h4>3. Tráng ống sạch sẽ:</h4>
      <p>Bơm tráng ống bằng 30 – 50ml nước ấm chín sau mỗi bữa ăn hoặc sau khi uống thuốc để tránh tắc ống và ngăn ngừa vi khuẩn lên men.</p>
    `
  },
  {
    id: 'news_5',
    title: 'Quy tắc "3 Giờ Vàng" sơ cứu bệnh nhân đột quỵ tai biến mạch máu não tại gia đình',
    category: 'Sơ cấp cứu khẩn cấp',
    catSlug: 'socapcuu',
    author: 'BS. Đặng Quốc Bảo',
    authorRole: 'Bác sĩ Cấp cứu Ngoại viện',
    date: '29/09/2026',
    readTime: '7 phút đọc',
    img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    summary: 'Nhận diện quy tắc FAST trong chẩn đoán sớm đột quỵ, những việc nên làm và những sai lầm chết người (như cạo gió, chích máu đầu ngón tay) cần tránh.',
    content: `
      <h4>1. Nhận biết đột quỵ bằng quy tắc FAST:</h4>
      <ul>
        <li><strong>F (Face - Khuôn mặt):</strong> Miệng méo, nhân trung lệch sang một bên, cười méo mó.</li>
        <li><strong>A (Arm - Tay):</strong> Một bên tay yếu, rơi thõng, không giơ lên song song được.</li>
        <li><strong>S (Speech - Giọng nói):</strong> Nói ngọng, phát âm khó khăn hoặc không nói được từ tròn vành.</li>
        <li><strong>T (Time - Thời gian):</strong> Gọi ngay cấp cứu 115 hoặc xe cấp cứu BBCare để đưa đến bệnh viện có đơn vị đột quỵ trong vòng 3 - 4.5 giờ vàng.</li>
      </ul>
      <h4>2. Những việc TUYỆT ĐỐI KHÔNG LÀM:</h4>
      <p>Không cạo gió, không chích lể 10 đầu ngón tay, không cho uống thuốc hạ huyết áp ngậm dưới lưỡi hoặc uống nước/ăn cháo vì có thể gây sặc tắc đường thở tử vong ngay lập tức.</p>
    `
  },
  {
    id: 'news_6',
    title: 'Các bài tập vận động thụ động & phục hồi chức năng sau mổ xương khớp tại nhà',
    category: 'Phục hồi chức năng',
    catSlug: 'phuchoi',
    author: 'BS. CK1 Lê Hoàng Quân',
    authorRole: 'Chuyên gia Vật lý Trị liệu',
    date: '25/09/2026',
    readTime: '5 phút đọc',
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    summary: 'Hướng dẫn các động tác xoa bóp, gập duỗi khớp gối, khớp háng và bài tập ngồi dậy an toàn cho bệnh nhân phẫu thuật gãy xương, thay khớp nhân tạo.',
    content: `
      <h4>1. Tầm quan trọng của vận động sớm:</h4>
      <p>Bệnh nhân nằm bất động quá 48 giờ sau mổ dễ đối mặt với nguy cơ huyết khối tĩnh mạch sâu, cứng khớp và teo cơ. Vận động thụ động nhẹ nhàng do kỹ thuật viên hướng dẫn giúp tăng lưu thông tuần hoàn máu.</p>
      <h4>2. Bài tập cổ chân và ngón chân:</h4>
      <p>Gập duỗi mu bàn chân 20 lần mỗi giờ giúp bơm tĩnh mạch ngoại biên hoạt động, ngăn ngừa phù nề cẳng chân.</p>
      <h4>3. Kỹ thuật xoay trở tư thế:</h4>
      <p>Thay đổi tư thế nằm nghiêng trái, nghiêng phải 2 giờ một lần, chèn gối mềm ở các điểm tì đè (xương cùng cụt, gót chân, mắt cá) để chống loét ép da.</p>
    `
  }
];


// =========================================================
// HỆ THỐNG ĐỒNG BỘ DỮ LIỆU LIÊN THÔNG (REAL-TIME LOCALSTORAGE)
// =========================================================
function loadStoredAppointments() {
  if (typeof localStorage === 'undefined') return APPOINTMENTS_HISTORY;
  try {
    const raw = localStorage.getItem('bbcare_appointments_db');
    if (raw) {
      APPOINTMENTS_HISTORY = JSON.parse(raw);
    } else {
      localStorage.setItem('bbcare_appointments_db', JSON.stringify(APPOINTMENTS_HISTORY));
    }
  } catch(e) { console.error(e); }
  return APPOINTMENTS_HISTORY;
}

function saveStoredAppointments() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('bbcare_appointments_db', JSON.stringify(APPOINTMENTS_HISTORY));
  } catch(e) { console.error(e); }
}

function loadStoredEquipmentOrders() {
  if (typeof localStorage === 'undefined') return USER_EQUIPMENT_ORDERS;
  try {
    const raw = localStorage.getItem('bbcare_equipment_orders_db');
    if (raw) {
      USER_EQUIPMENT_ORDERS = JSON.parse(raw);
    } else {
      localStorage.setItem('bbcare_equipment_orders_db', JSON.stringify(USER_EQUIPMENT_ORDERS));
    }
  } catch(e) { console.error(e); }
  return USER_EQUIPMENT_ORDERS;
}

function saveStoredEquipmentOrders() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('bbcare_equipment_orders_db', JSON.stringify(USER_EQUIPMENT_ORDERS));
  } catch(e) { console.error(e); }
}

// =========================================================
// QUẢN LÝ PHẢN HỒI & KHIẾU NẠI KHÁCH HÀNG (FEEDBACKS DB)
// =========================================================
let FEEDBACKS_DATABASE = [
  {
    id: 'FB-201',
    customerName: 'Anh Nguyễn Minh Khang',
    customerPhone: '0905 112 999',
    targetRef: 'Ca trực #CA-8876 (ĐD. Minh)',
    content: 'Điều dưỡng tới trễ 10 phút do kẹt xe nhưng thao tác thay băng rất cẩn thận, dặn dò gia đình kỹ lưỡng.',
    rating: 4,
    category: 'Góp ý dịch vụ',
    status: 'pending',
    createdAt: '10/10/2026 14:20'
  }
];

function loadStoredFeedbacks() {
  if (typeof localStorage === 'undefined') return FEEDBACKS_DATABASE;
  try {
    const raw = localStorage.getItem('bbcare_feedbacks_db');
    if (raw) {
      FEEDBACKS_DATABASE = JSON.parse(raw);
    } else {
      localStorage.setItem('bbcare_feedbacks_db', JSON.stringify(FEEDBACKS_DATABASE));
    }
  } catch(e) { console.error(e); }
  return FEEDBACKS_DATABASE;
}

function saveStoredFeedbacks() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('bbcare_feedbacks_db', JSON.stringify(FEEDBACKS_DATABASE));
  } catch(e) { console.error(e); }
}

function addNewFeedback(data) {
  loadStoredFeedbacks();
  const newId = 'FB-' + (Math.floor(200 + Math.random() * 800));
  const newFb = {
    id: newId,
    customerName: data.customerName || (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Khách hàng BBCare'),
    customerPhone: data.customerPhone || (typeof currentUser !== 'undefined' && currentUser ? currentUser.phone : '0908786168'),
    targetRef: data.targetRef || 'Dịch vụ y tế chăm sóc tại nhà',
    content: data.content || '',
    rating: Number(data.rating) || 5,
    category: data.category || 'Góp ý dịch vụ',
    status: 'pending',
    createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  FEEDBACKS_DATABASE.unshift(newFb);
  saveStoredFeedbacks();
  return newFb;
}

loadStoredAppointments();
loadStoredEquipmentOrders();
loadStoredFeedbacks();

if (typeof window !== 'undefined') {
  window.$ = $;
  window.fmt = fmt;
  window.escapeHtml = escapeHtml;
  window.APPOINTMENTS_HISTORY = APPOINTMENTS_HISTORY;
  window.USER_EQUIPMENT_ORDERS = USER_EQUIPMENT_ORDERS;
  window.FEEDBACKS_DATABASE = FEEDBACKS_DATABASE;
  window.NEWS_DATABASE = NEWS_DATABASE;
  window.loadStoredAppointments = loadStoredAppointments;
  window.saveStoredAppointments = saveStoredAppointments;
  window.loadStoredEquipmentOrders = loadStoredEquipmentOrders;
  window.saveStoredEquipmentOrders = saveStoredEquipmentOrders;
  window.loadStoredFeedbacks = loadStoredFeedbacks;
  window.saveStoredFeedbacks = saveStoredFeedbacks;
  window.addNewFeedback = addNewFeedback;
}
