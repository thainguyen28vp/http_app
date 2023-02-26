// import { ENVIRONMENT } from './Constants';
import R from '@app/assets/R'

export const ENVIRONMENT = {
  DEV: {
    API_URL: 'https://dev.httapi.winds.vn',
    SOCKET_URL: 'https://dev.httapi.winds.vn',
    SOCKET_LIVESTREAM_URL: 'http://dev.httapi.winds.vn:23722/',
  },
  PROD: {
    API_URL: 'https://httapi.winds.vn',
    SOCKET_URL: 'https://httapi.winds.vn',
    SOCKET_LIVESTREAM_URL: 'https://httapi.winds.vn:23722/',
  },
}
export const BASE_REQUEST = ENVIRONMENT['DEV']
// export const BASE_REQUEST = ENVIRONMENT['PROD']

export const APP_ID = 'be42a2ab-b58a-4822-aeda-0bfff809acfe'
export const CHANNEL_ID = 'b2c24e1a-393d-41c5-a6ea-ee6826e8e9b0'

export const CALL_API_STATUS = {
  SUCCESS: 1, //thành công
}

export const OS_KIND_ID = {
  IOS: 0,
  ANDROID: 1,
}

export const DEFAULT_PARAMS = {
  PAGE: 1,
  LIMIT: 24,
}

// trạng thái đơn hàng
export const ORDER_STATUS_TYPE = {
  PENDING: {
    id: 1,
    name: 'Chờ xác nhận',
    alias: 'PENDING',
  },
  CONFIRMED: {
    id: 2,
    name: 'Đã xác nhận',
    alias: 'CONFIRMED',
  },
  DELIVERING: {
    id: 3,
    name: 'Đang giao',
    alias: 'DELIVERING',
  },
  COMPLETED: {
    id: 4,
    name: 'Hoàn thành',
    alias: 'COMPLETED',
  },
  CANCEL: {
    id: 5,
    name: 'Huỷ',
    alias: 'CANCEL',
  },
}

export const LIVESTREAM_STATUS = {
  INITIAL: 0,
  STREAMING: 1,
  FINISHED: 2,
}

export const FILTER_TYPE = {
  SELL_MANY: 1,
  SELL_LITTLE: 2,
  PRICE_MAX_MIN: 1,
  PRICE_MIN_MAX: 2,
  TIME_NEW_OLD: 1,
  TIME_OLD_NEW: 2,
}

export const TYPE_ITEM = {
  LIST_PRODUCT: 1,
  LIST_PRODUCT_CART: 2,
  LIST_PRODUCT_SELL: 3,
}

export const LIVESTREAM_EVENT = {
  SERVER_STOP_LIVESTREAM: 0,
  SHOP_STOP_LIVESTREAM: 1,
  REACTION: 2,
  COMMENT: 3,
  DELETE_COMMENT: 4,
  COUNT_SUBSCRIBER: 5,
  CREATE_UPDATE_PRODUCT: 6,
  HIGHLIGHT_PRODUCT: 7,
  DELETE_PRODUCT: 8,
  WARNING_LIVESTREAM: 9,
}

export const ENABLE_LIVE = {
  OFF: 0,
  ON: 1,
}

export const DEFAULT_EVENT = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  CONNECTION_ERROR: 'connection_error',
}

export const POST_EVENT = {
  REACTION_POST: 0,
  UNREACTION_POST: 1,
  REACTION_COMMENT_POST: 2,
  UNREACTION_COMMENT_POST: 3,
  COMMENT: 4,
  DELETE_COMMENT: 5,
}

export const MESSAGE_EVENT = {
  SEND_MESSAGE: 0,
  TYPING: 1,
  READ: 2,
}

export const USER_EVENT = {
  NEW_MESSAGE: 0,
  NEW_CHANNEL_MESSAGE: 1,
  NEW_NOTIFICATION: 2,
}

export const SHOP_EVENT = {
  NEW_MESSAGE: 0,
  NEW_CHANNEL_MESSAGE: 1,
  NEW_NOTIFICATION: 2,
}

export const EMOTIONS = {
  HEART: {
    id: 1,
    icon: R.images.ic_live_stream_heart_react,
  },
  LIKE: {
    id: 2,
    icon: R.images.ic_live_stream_like,
  },
  HAHA: {
    id: 3,
    icon: R.images.ic_live_stream_haha,
  },
  WOW: {
    id: 4,
    icon: R.images.ic_live_stream_wow,
  },
}

export const NOTIFICATION_TYPE_VIEW = {
  NOT_VIEW: 0,
  VIEWED: 1,
}

export const DF_NOTIFICATION = {
  ALL: 1, // thông báo tất cả
  ORDER_SHOP: 2, // thông báo trạng thái đơn hàng
  COMMENT_POST: 3, // thông báo có người bình luận bài viết
  LIKE_POST: 4, // thông báo có người thích bài viết
  SEND_COMMENT: 5, // thông báo shop trả lời bình luận
  LIKE_COMMENT: 6, // thông báo shop thích bình luận
  SHOP_CREATE_LIVESTREAM: 7, // thông báo shop tạo livestream
  REGISTER_USER: 8, // thông báo đăng ký tài khoản thành công được cộng điểm
  PURCHASE_GIFT: 9, // thông báo có yêu cầu đổi quà web admin
  CONFIRM_PURCHASE_GIFT: 10, // Thông báo trạng thái đổi quà của bạn
  NEW_ORDER: 11, // Thông báo shop có đơn hàng cần duyệt
  GIFT_EXCHANGE: 12, // Thông báo trừ điểm
  NEWS_POST: 13, // Thông báo bài viết
  REFERRAL_APP: 14, // Giới thiệu APP thành công
  PROMOTION_POINT: 15, // Cộng điểm khi đặt hàng thành công
  REFERRAL_CODE: 16, // Cộng điểm khi nhập mã thành công
  NEW_MESSAGE: 17, // Có tin nhắn mới
  ORDER_CANCEL: 18, // kHÁCH HÀNG HỦY ĐƠN HÀNG
  REQUESTED_FLOWER_DELIVERY: 19, // Yêu cầu điện hoa
  APROVE_FLOWER_DELIVERY: 20, // Chấp nhận điện hoa.
  REJECT_FLOWER_DELIVERY: 21,
  REJECT_PURCHASE_GIFT: 22, // Từ chối yêu cầu đổi quà
  SUBTRACT_POINT: 23, // Thông báo trừ điểm
  ADD_POINT: 24, // Cộng điểm
  NEW_REVIEW: 25, // Tạo review
  COIN: 26,
  NEWS: 27,
}

export const ORDER_STATUS_TAB = {
  PENDING: 0,
  CONFIRMED: 1,
  DELIVERING: 2,
  COMPLETED: 3,
  CANCEL: 4,
}

export const SHOP_TAB = [
  { name: 'Sản phẩm', id: 0 },
  { name: 'Danh mục', id: 1 },
  { name: 'Live stream', id: 2 },
  { name: 'Bài viết', id: 3 },
]

export const GIFT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  CACELED: 2,
  USED: 3,
}

export const GIFT_TYPE = {
  GIFT: 1,
  DISCOUNT_CODE: 2,
}

export const TYPE_POINT_TRANSACTION_HISTORY = {
  ADD: 1,
  SUB: 0,
}

export const GIFT_OWNER_STATUS = {
  USED: 1,
  NOT_USED: 2,
}

export const CONFIG = {
  cameraConfig: {
    cameraId: 1,
    cameraFrontMirror: true,
  },
  videoConfig: {
    preset: 4,
    bitrate: 400000,
    profile: 2,
    fps: 30,
    videoFrontMirror: false,
  },
  audioConfig: {
    bitrate: 32000,
    profile: 1,
    samplerate: 44100,
  },
}

export const SOCKET_ON_MESSAGE_CHANNEL_EVENT = {
  SUBSCRIBE_MESSAGE_CHANNEL: `subscribe_message_channel`,
  UNSUBSCRIBE_MESSAGE_CHANNEL: `unsubscribe_message_channel`,
}
export const LIST_FLOWERS = [
  {
    id: 1,
    img: R.images.img_news_flower,
    title: 'Hướng dẫn chăm sóc hoa',
    shortDescription:
      'Những bó hoa tươi của chúng tôi được giao kèm với nước bên dưới để giữ hoa luôn tươi. Bạn có thể lựa chọn giữ nguyên hoặc chuyển hoa vào bình',
    description: `<div class="contain mt-5 mb-10 min-h-screen"><hr class="my-5"><div><p>Hoa tươi của chúng tôi sẽ giữ được độ tươi như lúc giao cho đến 3-5 ngày sau. Nếu bạn chăm sóc cẩn thận và tỉ mỉ thì hoa có thể giữ được đến 1 tuần đấy!&nbsp;<br><br>Tham khảo ngay những hướng dẫn dưới đây để có thể bảo quản hoa ở tình trạng tươi và đẹp mắt nhất nhé.<br><br></p>
<ul>
<li>Những bó hoa tươi của chúng tôi được giao kèm với nước bên dưới để giữ hoa luôn tươi. Bạn có thể lựa chọn giữ nguyên hoặc chuyển hoa vào bình.</li>
<li>Hãy luôn đảm bảo bình hoa của bạn được rửa sạch để vi khuẩn không tấn công và làm giảm thời gian tươi lâu của hoa.</li>
<li>Khi có cánh hoa bị héo, bạn phải bỏ ra ngay để tránh ảnh hưởng tới những bông còn tươi.</li>
<li>Bỏ những cánh hoa rụng trong bình. Điều này vừa giúp bình hoa trông đẹp hơn mà còn ngăn chặn vi khuẩn phát triển.</li>
<li>Cắt cành theo đường chéo bằng dao và để ngập cành trong nước.</li>
<li>Hoa giữ được độ tươi lâu hơn trong khí hậu lạnh, luôn giữ hoa tránh ánh nắng trực tiếp hoặc nơi có hơi nóng.</li>
<li>Để hoa tránh xa bệ cửa sổ, lỗ thông hơi và quạt vì điều này sẽ làm hoa mau mất nước.</li>
<li>Không trưng hoa gần trái cây! Khí&nbsp;ethylene sẽ làm giảm thời gian tươi của hoa.</li>
</ul>
<p>Quan trọng nhất là bạn phải luôn vệ sinh bình hoa sạch sẽ và thay nước sau 2 đến 3 ngày.<br><br></p>
<ol>
<li><img src="https://flowerstore.vn/img/note-img/care-instruct-img.png" alt="" width="861" height="558"></li>
</ol></div></div>`,
  },
  {
    img: R.images.img_flower1,
    id: 2,
    title: 'Những điều cần biết về kinh doanh, buôn bán hoa hoa',
    shortDescription:
      'Nhập được nguồn hoa chất lượng là yếu tố quyết định khá lớn đến thành công của cửa hàng và chất lượng thành phẩm bạn làm ra',
    description: `<div class="entry-content single-page">
    <h2 id="ftoc-heading-1" class="ftwp-heading"><span id="1_Nguon_nhap_hoa_tuoi_chat_luong_gia_re">1. Nguồn nhập hoa tươi chất lượng, giá rẻ</span></h2>
    <p>Nhập được nguồn hoa chất lượng là yếu tố quyết định khá lớn đến thành công của cửa hàng và chất lượng thành phẩm bạn làm ra. Chất lượng hoa ảnh hưởng đến độ tươi lâu của thành phẩm, màu sắc cũng như tính thẩm mỹ. Yêu cầu hoa cần phải tươi, hạn chế nhập hoa đông lạnh (trừ trường hợp loại hoa nhập khẩu hoặc loại hoa không được trồng trực tiếp tại tỉnh thành bạn sinh sống).</p>
    <p>Thông thường, đối với các loại hoa Việt Nam có thể trồng được, bạn có thể có các nguồn nhập hàng sau:</p>
    <ul>
    <li>
    <h3 id="ftoc-heading-2" class="ftwp-heading"><span id="Khu_vuc_phia_bac">Khu vực phía bắc</span></h3>
    </li>
    </ul>
    <p>Chợ hoa đầu mối Quảng An, thu mua hoa tại vườn như làng hoa Tây Tựu hay Nhật Tân (Hà Nội) hoặc một huyện trồng hoa nổi tiếng là Mê Linh, Hà Nội.</p>
    <ul>
    <li>
    <h3 id="ftoc-heading-3" class="ftwp-heading"><span id="Khu_vuc_phia_Nam">Khu vực phía Nam</span></h3>
    </li>
    </ul>
    <p>Tại khu vực này có 3 chợ hoa tươi bán sỉ là Chợ hoa Hồ Thị Kỷ, Chợ đầu mối Bình Điền hay Chợ hoa sỉ Hậu Giang,… Ngoài ra các tỉnh thành phía Nam thường nhập hoa từ Đà Lạt. Các tỉnh miền tây cũng trồng hoa và cung cấp một số loại hoa cơ bản hợp với thời tiết nóng ẩm.</p>
    <ul>
    <li>
    <h3 id="ftoc-heading-4" class="ftwp-heading"><span id="Nhap_khau_hoa_tu_nuoc_ngoai">Nhập khẩu hoa từ nước ngoài:</span></h3>
    </li>
    </ul>
    <p>Nếu đối tượng khách hàng mục tiêu với mức thu nhập cao, bỏ ra tiền lớn để mua hoa ngoại. Thường thì sẽ nhập qua nhà phân phối vì số lượng hoa nhập từ các cửa hàng chưa đủ lớn, nếu nhập khẩu trực tiếp thì chi phí đầu vào cao và nhiều thủ tục.</p>
    <p>Bên cạnh việc bán hoa và các thành phẩm từ hoa, các cửa hàng điện hoa thường kết hợp bán các sản phẩm làm quà tặng theo combo. Các sản phẩm có thể là socola, đồ lưu niệm hay quà tặng theo yêu cầu.</p>
    <p><img class="alignnone size-medium wp-image-4364 aligncenter entered lazyloaded" src="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg" alt="" width="800" height="535" data-lazy-srcset="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg 800w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-768x514.jpeg 768w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi.jpeg 1024w" data-lazy-sizes="(max-width: 800px) 100vw, 800px" data-lazy-src="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg" data-ll-status="loaded" sizes="(max-width: 800px) 100vw, 800px" srcset="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg 800w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-768x514.jpeg 768w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi.jpeg 1024w"><noscript><img class="alignnone size-medium wp-image-4364 aligncenter" src="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg" alt="" width="800" height="535" srcset="https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-800x535.jpeg 800w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi-768x514.jpeg 768w, https://maludesign.vn/wp-content/uploads/2021/10/dich-vu-dang-tin-gioi-thieu-shop-hoa-tuoi.jpeg 1024w" sizes="(max-width: 800px) 100vw, 800px" /></noscript></p>
    <h2 id="ftoc-heading-5" class="ftwp-heading"><span id="2_Mo_cua_hang_hoa_can_bao_nhieu_von">2. Mở cửa hàng hoa cần bao nhiêu vốn</span></h2>
    <p>Đã có nguồn hàng, nhưng chưa đủ. Bạn cần vốn để có thể biến mọi ý tưởng thành hiện thực. Và vốn chính là điều kiện cần để đầu tư cơ sở vật chất, thuê mặt bằng, sửa sang cửa hàng hay nhập hoa, quà tặng về bán.</p>
    <p>Khác với sản phẩm khác khi mà thời gian lưu kho lâu, giá trị hàng hóa lớn, mở cửa hàng hoa tươi sẽ chỉ tiêu tốn của 1/4 đến 1/5 số tiền so với kinh doanh quần áo, giày dép hay mở cửa hàng tạp hóa với cùng quy mô, thậm chí là nhỏ hơn bởi đặc điểm kinh doanh có sự khác biệt. Vốn nhập hoa không lớn vì hoa có hạn sử dụng ngắn ngày, nhập hàng liên tục và số lượng thì cũng ít hơn so với mặt hàng khác.</p>
    <p>Thông thường, mở 1 cửa hàng hoa tươi bình dân chỉ cần chi phí khoảng 20 triệu (nếu chỉ bán hoa) là có thể set up một gian hàng nhỏ. Với cửa hàng quy mô lớn và sản phẩm đa dạng hơn, chi phí vốn có thể từ 50 triệu, 80 triệu…tùy thuộc vào quy mô cửa hàng, dịch vụ cửa hàng cung cấp. Đối với cửa hàng hoa tươi cao cấp hướng tới đối tượng khách hàng trung lưu và thượng lưu thì cửa hàng cần yêu cầu mặt bằng đẹp, trang trí nội thất sang trọng, chi phí vốn sẽ cao hơn.</p>
    <p><img class="alignnone size-full wp-image-4367 aligncenter entered lazyloaded" src="https://maludesign.vn/wp-content/uploads/2021/10/0be9f9bb03.jpeg" alt="" width="660" height="441" data-lazy-src="https://maludesign.vn/wp-content/uploads/2021/10/0be9f9bb03.jpeg" data-ll-status="loaded"><noscript><img class="alignnone size-full wp-image-4367 aligncenter" src="https://maludesign.vn/wp-content/uploads/2021/10/0be9f9bb03.jpeg" alt="" width="660" height="441" /></noscript></p>
    <h2 id="ftoc-heading-6" class="ftwp-heading"><span id="3_Nhung_thiet_bi_can_co_khi_mo_cua_hang_hoa_tuoi">3. Những thiết bị cần có khi mở cửa hàng hoa tươi</span></h2>
    <h3 id="ftoc-heading-7" class="ftwp-heading"><span id="31_May_tinh_ket_noi_voi_phan_mem_quan_ly_ban_hang">3.1. Máy tính kết nối với phần mềm quản lý bán hàng</span></h3>
    <p>Rất nhiều chủ cửa hàng hoa tươi có thói quen quản lý, ghi chép doanh thu bán hàng trên sổ sách hoặc điện thoại. Tuy nhiên, quản lý sản phẩm gặp nhiều khó khăn do hoa tươi tính theo bó, theo bông hoặc combo…, hạn sử dụng của hoa ngắn ngày. Khó thống kê doanh số chính xác. Cần quản lý công nợ khách hàng nhưng thường quên ghi lại thông tin dẫn đến tình trạng nhầm lẫn, sai sót.</p>
    <p>Do đó việc đầu tư máy tính, trước hết là để lưu thông tin hàng hóa, giá cả, tra cứu sản phẩm trong excel là một điều cần thiết. Trong quá trình quản lý kho bằng excel, lại nảy sinh khó khăn sử dụng các hàm tính toán để quản lý xuất – nhập tồn chính xác, quản lý giá nhập – giá bán như thế nào để tránh nhầm lẫn và quản lý doanh thu – lợi nhuận chính xác.</p>
    <p>Do đó, sử dụng phần mềm quản lý cửa hàng hoa và quà tặng được cài đặt trên máy tính sẽ giúp bạn quản lý cửa hàng dễ dàng, hạn chế các sai sót trong việc lưu trữ, tính toán dữ liệu.</p>
    <p><img class="alignnone size-full wp-image-4366 aligncenter entered lazyloaded" src="https://maludesign.vn/wp-content/uploads/2021/10/trang-tri-shop-hoa-tuoi-4.jpeg" alt="" width="600" height="401" data-lazy-src="https://maludesign.vn/wp-content/uploads/2021/10/trang-tri-shop-hoa-tuoi-4.jpeg" data-ll-status="loaded"><noscript><img class="alignnone size-full wp-image-4366 aligncenter" src="https://maludesign.vn/wp-content/uploads/2021/10/trang-tri-shop-hoa-tuoi-4.jpeg" alt="" width="600" height="401" /></noscript></p>
    <h3 id="ftoc-heading-8" class="ftwp-heading"><span id="32_May_POS_de_banmay_POS_mini_cam_tay"><span id="2_May_POS_de_banmay_POS_mini_cam_tay">3.2. Máy POS để bàn/máy POS mini cầm tay&nbsp;</span></span></h3>
    <p>Hiện trên thị thường có máy POS mini cầm tay, máy POS 1 màn phù hợp với những quy mô cửa hàng vừa, nhỏ và lớn. Cụ thể:</p>
    <p>– Máy POS mini cầm tay phù hợp với những cửa hàng hoa, quà tặng quy mô vừa và nhỏ.</p>
    <p>– Máy POS 1 màn hình tích hợp với máy tính bán hàng, máy in hóa đơn, máy quét mã vạch và phần mềm quản lý bán hàng. Nhân viên bán hàng có thể dễ dàng thao tác tra cứu thông tin sản phẩm, tính tiền, thanh toán và in hóa đơn cho khách. Loại máy này thích hợp với cửa hàng hoa và quà tặng quy mô lớn.</p>
    <h3 id="ftoc-heading-9" class="ftwp-heading"><span id="33_Cac_thiet_bi_khac"><span id="6_Cac_thiet_bi_khac">3.3. Các thiết bị khác</span></span></h3>
    <p>– Dụng cụ trưng bày: Kinh doanh hoa tươi là kinh doanh cái đẹp do đó không gian trưng bày cần tinh tế, thoáng đãng, đủ ánh sáng. Có khu trưng bày sản phẩm, khu cắm hoa và khu khách lựa chọn hoa riêng. Nếu quy mô cửa hàng nhỏ, bạn có thể tận dụng giá đỡ để trưng bày sản phẩm.</p>
    <p><span id="62_Camera_thiet_bi_chong_trom">– Camera, thiết bị chống trộm:&nbsp;</span>Với đặc điểm sản phẩm đa dạng, nhiều loại, dễ bị thất thoát nên cửa hàng cần được trang bị hệ thống camera, chuông cửa, cửa từ chống trộm..</p>
    <p><span id="63_Thiet_bi_phong_chay_chua_chay">– Thiết bị phòng cháy chữa cháy:&nbsp;</span>Để hạn chế rủi ro có thể xảy ra, cửa hàng bạn nên trang bị hệ thống báo cháy, bình cứu hỏa mini…</p>
    <h2 id="ftoc-heading-10" class="ftwp-heading"><span id="4_Cua_hang_hoa_tuoi_nen_phat_trien_da_dang_cac_kenh_ban_hang">4. Cửa hàng hoa tươi nên phát triển đa dạng các kênh bán hàng</span></h2>
    <p>Bán hàng đa kênh là xu hướng của tất cả các ngành kinh doanh, đặc biệt sản phẩm hoa tươi và quà tặng càng phải được chú trọng phát triển. Ngoài việc bán hàng tại cửa hàng, bạn nên tạo fanpage và thiết kế website chuyên nghiệp để đáp ứng nhu cầu mua sắm trực tuyến của khách hàng. Thay vì đến mua tại cửa hàng, khách hàng có thể xem ảnh trực tuyến, đặt trên website và nhận điện hoa tiện lợi.</p>
    <p>Kinh doanh shop hoa tươi là một ngành “một vốn bốn lời” nếu bạn tìm hiểu kỹ về thị trường, nguồn hàng và nhu cầu khách hàng. Hy vọng những kinh nghiệm mở cửa hàng hoa trên đây sẽ giúp bạn có thêm một vài sự chuẩn bị để kinh doanh thuận lợi hơn. Chúc các bạn thành công!</p>
    </div>
      
      </div>`,
  },
  {
    img: R.images.img_ship,
    id: 3,
    title: 'Chính sách vận chuyển giao hàng',
    shortDescription:
      'Hàng sẽ được giao tại địa chỉ được nêu bởi khách hàng khi đặt mua',
    description: `<div class="page-inner">
    <p style="text-align: justify;"><strong>THỜI HẠN GIAO HÀNG VÀ VẬN CHUYỂN</strong></p>

<p style="text-align: justify;"><strong>1.Điều Kiện Chung</strong></p>

<p style="text-align: justify;">Hàng sẽ được giao tại địa chỉ được nêu bởi khách hàng khi đặt mua. Khách hàng có trách nhiệm cung cấp đầy đủ các thông tin cần thiết để quá trình giao hàng được diễn ra thuận lợi như&nbsp;: Tên người nhận, địa chỉ chính xác, số nhà, tỉnh, tên phố, tên quận, huyện, phường, xã, số điện thoại cần liên hệ… Chúng tôi không chịu trách nhiệm đối với các trường hợp chuyển hàng sai địa chỉ do lỗi của khách hàng.</p>

<p style="text-align: justify;">Trong trường hợp không có người nhận hoặc người người nhận không đồng ý nhận, vấn đề sẽ xử lý sẽ như sau:</p>

<p style="text-align: justify;">- Các mặt hàng không thể để lâu được: Hoa, bánh kem: Khách hàng phải trả 100% giá trị.</p>

<p style="text-align: justify;">- Các mặt hàng cây cảnh, cây trồng: Khách hàng trả 50% giá trị.</p>

<p style="text-align: justify;">- Các mặt hàng khác (Bánh kẹo, gâu bông): Khách hàng không phải trả.</p>

<p style="text-align: justify;"><strong>2.Thời Gian Giao Hàng&nbsp;</strong></p>

<p style="text-align: justify;">Sau khi nhận được thanh toán trước của khách hàng, chúng tôi sẽ giao đúng thời gian khách hàng yêu cầu, trong trường hợp giờ giao không phù hợp chúng tôi sẽ trao đổi trước. Đơn hàng chỉ được thực hiện khi có sự đồng ý của cả 2 bên.&nbsp;</p>

<p style="text-align: justify;">Thời gian giao hàng có thể sơm hoặc trễ hơn 60 phút, phụ thuộc vào các điều kiện thời tiết hoặc giao thông tại vùng địa lý nơi giao. Nếu trễ hơn thời gian này trên 60 phút, chúng tôi sẽ thông báo trên hệ thống website hoặc qua điện thoại cho người đặt và người nhận.&nbsp; &nbsp;</p>

<p style="text-align: justify;"><strong>3.Các vấn đề khi giao hàng</strong></p>

<p style="text-align: justify;">Việc giao hàng sẽ được thực hiện bởi đối tác do chúng tôi lựa chọn. Hàng hóa trong quá trình vận chuyển có thể chịu rủi ro ngoài ý muốn như gãy, hỏng … Khách hàng cần kiểm tra kỹ tình trạng gói hàng cũng như số lượng đơn hàng. Mọi khiếu nại liên quan đến việc vận chuyển hàng hóa cần phải được khách hàng thông báo lại cho chúng tôi trong vòng 1 giờ đồng hồ sau khi nhận được hàng. Khách hàng có thể thông báo&nbsp;</p>

<p style="text-align: justify;">- Liên hệ trực tiếp qua điện thoại trong phần liên hệ</p>

<p style="text-align: justify;">- Gửi thông tin ý kiến phản hồi về địa chỉ email :&nbsp;hoalaflowers@gmail.com</p>

<p style="text-align: justify;"><strong>4. Theo dõi đơn hàng</strong></p>

<p style="text-align: justify;">Khách hàng có thể theo dõi tình trạng giao hàng tại phần theo dõi đơn hàng trên website hoặc gọi điện về tổng đài của chúng tôi. Nhân viên của chúng tôi sẽ có trách nhiệm thông báo tới khách hàng về tình trạng đơn hàng.</p>
  </div>`,
  },
]

export const TYPE_GIFT = {
  GIFT: 1,
  VOUCHER: 2,
}
export const TYPE_GIFT_USE = {
  USED: 1,
  NOT_USE: 2,
}

export const ROLE_COMMENTS = {
  ADMIN: 'admin',
  USER: 'user',
}
