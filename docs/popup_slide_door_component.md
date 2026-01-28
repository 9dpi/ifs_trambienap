# Hướng dẫn thiết lập Popup Slide Door (Side Drawer) - IFS Project

Tài liệu này hướng dẫn cách áp dụng giao diện Popup dạng ngăn kéo trượt (Slide Door) chuẩn cho các trang danh sách/quản trị trong hệ thống.

## 1. Cấu trúc HTML (Đặt cuối thẻ `<body>`)

```html
<!-- Drawer Overlay & Container -->
<div id="sideDrawer" class="drawer-overlay" onclick="if(event.target === this) closeDrawer()">
    <div class="drawer">
        <!-- Header -->
        <div class="drawer-header">
            <h3>TIÊU ĐỀ CHI TIẾT</h3>
            <button class="close-drawer" onclick="closeDrawer()">&times;</button>
        </div>
        
        <!-- Content Body (2 Columns) -->
        <div class="drawer-body">
            <div class="info-grid">
                <!-- Cột 1 -->
                <div class="info-row">
                    <div class="info-label">NHÃN TRƯỜNG 1</div>
                    <div class="info-value">Giá trị 1</div>
                </div>
                <!-- Cột 2 -->
                <div class="info-row">
                    <div class="info-label">NHÃN TRƯỜNG 2</div>
                    <div class="info-value">Giá trị 2</div>
                </div>
                <!-- Trường rộng 100% -->
                <div class="info-row full-width">
                    <div class="info-label">TRƯỜNG DÀI</div>
                    <div class="info-value">Nội dung chiếm toàn bộ chiều ngang</div>
                </div>
            </div>

            <!-- Khu vực hình ảnh -->
            <div class="info-row full-width" style="margin-top: 10px;">
                <div class="info-label">HÌNH ẢNH MINH HỌA</div>
                <img src="path/to/image.png" style="width: 100%; border-radius: 12px; border: 1px solid var(--border); margin-top: 8px;">
            </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="drawer-footer">
            <button class="btn-update-status">CẬP NHẬT TRẠNG THÁI</button>
        </div>
    </div>
</div>
```

## 2. Các Class CSS Cần Thiết (style.css hoặc thẻ <style>)

```css
/* Lớp phủ mờ nền */
.drawer-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(4px); z-index: 1000; display: none; opacity: 0;
    transition: opacity 0.3s ease;
}
.drawer-overlay.open { display: block; opacity: 1; }

/* Thân Popup */
.drawer {
    position: fixed; top: 0; right: -800px; width: 800px; height: 100%;
    background: #1E293B; box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
    z-index: 1001; transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column;
}
.drawer-overlay.open .drawer { right: 0; }

/* Lưới thông tin 2 cột */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.info-row { display: flex; flex-direction: column; gap: 6px; }
.info-row.full-width { grid-column: span 2; }

/* Nhãn và Ô giá trị */
.info-label { font-size: 12px; font-weight: 600; color: var(--text-sub); text-transform: uppercase; }
.info-value { background: var(--bg-body); border: 1px solid var(--border); padding: 12px 16px; border-radius: 8px; color: var(--text-main); }
```

## 3. Logic điều khiển (JavaScript)

```javascript
function openDrawer() {
    const drawer = document.getElementById('sideDrawer');
    drawer.style.display = 'block';
    setTimeout(() => { drawer.classList.add('open'); }, 10);
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính
}

function closeDrawer() {
    const drawer = document.getElementById('sideDrawer');
    drawer.classList.remove('open');
    setTimeout(() => { drawer.style.display = 'none'; }, 300);
    document.body.style.overflow = 'auto'; // Mở lại cuộn trang
}
```
