import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { colors, fonts, WIDTH } from '@app/theme'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import RenderHTML from 'react-native-render-html'
import { DebounceButton } from '@app/components/Button/Button'
import NavigationUtil from '@app/navigation/NavigationUtil'
import reactotron from 'ReactotronConfig'
import { HTML } from '@app/config/Constants'
import iframe, { iframeModel } from '@native-html/iframe-plugin'
import WebView from 'react-native-webview'
import IframeRenderer from '@native-html/iframe-plugin'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { getNewsDetail } from '@app/service/Network/home/HomeApi'

const scale = WIDTH / 375
export let content = `KHO HOA THANH TƯỚC KÍNH CHÀO QUÝ KHÁCH !
- Để bắt nhịp với xu hướng hiện tại ,kho hoa thanh tước ra mắt app thương mại điện tử để nâng cao trải nhiệm cho khách hàng .
- Khi bạn đăng nhập vào app bạn có thể mua hoa online như bạn đang có mặt tại kho của chúng tôi .
- Hãy coi Hoa Thanh Tước là kho hàng của bạn . Khi nào bạn cần, chỉ với thao tác đơn giản chúng tôi sẽ đem hoa đến cho bạn .
- Hãy Để Chúng Tôi Giúp Bạn Giảm Thiểu Tối Đa Rủi Do Khi Kinh Doanh Hoa Tươi !
✔️ Địa chỉ cung cấp hoa tươi uy tín, GIÁ TỐT so với thị trường
✔️ Đa dạng nhiều loại hoa với mẫu mã đẹp, đáp ứng mọi nhu cầu kinh doanh.
✔️ Hoa ĐƯỢC BẢO HÀNH, đảm bảo về chất lượng
✔️ Luôn sẵn sàng phục vụ 24/24
👉 Bạn sẽ nhận được gì khi hợp tác với chúng tôi:
▪️ Nhập sỉ CHIẾT KHẤU CAO cùng các chương trình ƯU ĐÃI hấp dẫn .
▪️Không cần tồn hoa tại cửa hàng tránh rủi do , hãy để chúng tôi tồn giúp bạn .
▪️ Hoa về liên tục theo mùa, đi đầu xu hướng . 
▪️ Đội ngũ nhân viên hỗ trợ nhiệt tình, hướng dẫn chốt sale từ A-Z .
▪️ Chia sẻ kho hình ảnh ĐẸP MÊ, tất cả đều là ảnh thật 100% cập nhật hàng ngày .
Kho hoa Thanh Tước - Lựa chọn TỐT NHẤT cho những ai đang kinh doanh tiệm hoa, kinh doanh online. Hiện nay, chúng tôi có 3 cơ sở ở Hà Nội ,1 cơ sở Sài Gòn và 1 cơ sở tại thành phố Đà Lạt . Chúng tôi đang là kho cung cấp hoa lá nội, ngoại Số 1 tại Việt Nam.
🔰 Inbox ngay cho chúng tôi để được đăng ký tài khoản app hỗ trợ đặt hàng .
=============
HOA THANH TƯỚC - KHO HOA SỐ 1 VIỆT NAM
📞 Hotline Hà Nội: 0986046868
📞 Hotline Sài Gòn: 0869.888.001
      Hotline Đà Lạt : 0933.35.29.29
🌐 Website: http://hoathanhtuoc.vn/
🏡 Các cơ sở của Kho Hoa Thanh Tước:
▪️ Cơ sở 1: Kho Cầu Giấy
Số nhà 26c3 - Ngõ 20 Trần Kim Xuyến - Yên Hoà - Cầu Giấy - Hà Nội
▪️ Hotline: 02466.84.85.86
——
▪️ Cơ sở 2: Kho Đống Đa
Số nhà 2 - Ngõ 81 Hồ Ba Mẫu - P.Phương Liên - Đống Đa - Hà Nội
▪️ Hotline: 02435.65.66.67
——
▪️ Cơ sở 3: Kho Sài Gòn
Số nhà 16/26 - Trần Thiện Chánh- P.12- Q.10 - TP. Hồ Chí Minh
▪️ Hotline: 02862.72.76.86
——
▪️ Cơ sở 4: Kho Âu Cơ- Chợ Hoa Quảng Bá
Số nhà 72 Phố Đường Hoa - Ngõ 238 Âu Cơ - Tây Hồ - Hà Nội
(Đằng sau chợ Quảng Bá)
▪️ Hotline: 0915.234.238

  Cơ sở 5 : 104 Phước Thành - Phường 7 - Thành Phố Đà Lạt ,
  Hotline : 0933.35.29.29

PHỤNG SỰ ĐỂ THÀNH CÔNG !
`

const source = {
  html: `<div class="entry-content single-page">
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
}

const NewsDetailScreen = (props: any) => {
  const { type, item, id } = props.route.params
  const [data, setData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const getNewDetail = async () => {
    callAPIHook({
      API: getNewsDetail,
      payload: id,
      useLoading: setIsLoading,
      onSuccess(res) {
        setData(res.data)
      },
    })
  }
  React.useEffect(() => {
    id ? getNewDetail() : null
  }, [])
  const renderIntro = () => {
    return (
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FastImage
          source={R.images.image_logo}
          style={{
            width: 188 * scale,
            height: 124 * scale,
            marginTop: '10%',
            alignSelf: 'center',
          }}
        />
        {/* <Text
          style={{ ...fonts.bold16 }}
          children={'Kinh doanh hoa tươi - vốn tí, lãi nhiều'}
        /> */}
        <Text
          style={{ ...fonts.regular16, color: '#8C8C8C', marginTop: 5 }}
          children={content}
        />
      </View>
    )
  }
  const renderers = {
    iframe: IframeRenderer,
  }
  const customHTMLElementModels = {
    iframe: iframeModel,
  }
  const renderNewsDetail = (item: any) => {
    return (
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <Text
          style={{ ...fonts.bold16, marginTop: 16, marginBottom: 10 }}
          children={data?.title}
        />
        <RenderHTML
          contentWidth={WIDTH - 30}
          renderers={renderers}
          WebView={WebView}
          source={{ html: data?.content }}
          customHTMLElementModels={customHTMLElementModels}
          defaultWebViewProps={
            {
              /* Any prop you want to pass to all WebViews */
            }
          }
          renderersProps={{
            iframe: {
              scalesPageToFit: true,
              webViewProps: {
                /* Any prop you want to pass to iframe WebViews */
              },
            },
          }}
        />
      </View>
    )
  }

  const renderBody = () => {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.white }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '10%' }}
      >
        {type == 1 ? renderIntro() : renderNewsDetail(item)}
      </ScrollView>
    )
  }
  return (
    <ScreenWrapper
      back
      unsafe
      titleHeader={type == 2 ? item.title : undefined}
      backgroundHeader={colors.white}
      color={colors.black}
    >
      {renderBody()}
      {type == 1 && (
        <DebounceButton
          style={{ position: 'absolute', left: '5%', top: '5%' }}
          onPress={() => {
            NavigationUtil.goBack()
          }}
          children={
            <>
              <FastImage
                source={R.images.ic_back}
                style={{ width: 25, height: 25 }}
              />
            </>
          }
        />
      )}
    </ScreenWrapper>
  )
}

export default NewsDetailScreen

const styles = StyleSheet.create({})
