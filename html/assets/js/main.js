/* ==========================================================================
   EVN CORE JS v3.0
   ========================================================================== */

// 1. THEME MANAGER
function initTheme() {
    const savedTheme = localStorage.getItem('evn-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', target);
    localStorage.setItem('evn-theme', target);
}

// 2. DRAWER & MODAL LOGIC
function openDrawer(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
}

function closeDrawer(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
}

// Auto close on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('drawer-backdrop') || e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('open');
    }
});

// 3. TOAST NOTIFICATION
function showToast(message = 'Thao tác thành công!', type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = '';
    if (type === 'success') {
        toast.style.borderLeftColor = 'var(--success)';
        icon = '✅';
    } else if (type === 'error') {
        toast.style.borderLeftColor = 'var(--danger)';
        icon = '❌';
    } else if (type === 'info') {
        toast.style.borderLeftColor = 'var(--info)';
        icon = '💡';
    }

    toast.innerHTML = `
        <span style="font-size:16px">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. CONFIG TABS LOGIC
function selectTab(el) {
    // Tìm parent chứa các tab (để hỗ trợ nhiều bộ tab trên 1 trang)
    const wrapper = el.parentElement;
    wrapper.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function addNewTab() {
    const wrapper = document.getElementById('tabsWrapper');
    if (!wrapper) return;
    const btnAdd = wrapper.querySelector('.btn-add-tab');

    const newTab = document.createElement('div');
    newTab.className = 'tab-item active';
    newTab.setAttribute('onclick', 'selectTab(this)');
    newTab.innerHTML = `
        <span class="tab-text" contenteditable="true">Mới</span>
        <span class="tab-close" onclick="removeTab(this, event)">×</span>
    `;

    wrapper.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    wrapper.insertBefore(newTab, btnAdd);

    const textSpan = newTab.querySelector('.tab-text');
    textSpan.focus();
}

function removeTab(el, event) {
    event.stopPropagation();
    if (confirm('Xóa tab này?')) {
        const tab = el.parentElement;
        if (tab.classList.contains('active')) {
            const prev = tab.previousElementSibling;
            if (prev) prev.classList.add('active');
        }
        tab.remove();
    }
}

// 5. COLOR PICKER LOGIC
function initColorPickers() {
    document.querySelectorAll('.color-input').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.parentElement.style.borderColor = e.target.value;
        });
    });
}

// 6. AUTO INIT & WELCOME HINT
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initColorPickers();

    // Demo Hints based on URL
    const path = window.location.pathname;

    // Chỉ hiện hint nếu chưa từng hiện (để đỡ phiền) -> Demo thì cứ hiện luôn
    if (path.includes('camera')) {
        setTimeout(() => showToast('Mẹo: Rê chuột vào Joystick để xoay Camera!', 'info'), 1000);
    } else if (path.includes('config')) {
        setTimeout(() => showToast('Mẹo: Bấm tên Tab để sửa, hoặc thêm Tab mới.', 'info'), 1000);
    } else {
        // Dashboard
        setTimeout(() => showToast('Chào Admin! Hệ thống hoạt động tốt.', 'success'), 1500);
    }
});