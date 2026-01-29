/**
 * Responsive Helper Functions
 * Handles mobile-specific interactions
 */

// Toggle sidebar on mobile (for giamsattructiep.html)
function toggleSidebar() {
    const sidebar = document.querySelector('.tree-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('open');
    }

    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Close sidebar when clicking overlay
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    // Add sidebar toggle button for mobile if on giamsattructiep page
    if (window.location.pathname.includes('giamsattructiep')) {
        addSidebarToggleButton();
    }

    // Auto-switch to card view on mobile for management pages
    if (window.location.pathname.includes('quantrihethong_camera') ||
        window.location.pathname.includes('quantrihethong_cambien') ||
        window.location.pathname.includes('quantrihethong_nguoidung') ||
        window.location.pathname.includes('quantrihethong_thietbi') ||
        window.location.pathname.includes('quantrihethong_khuvuc') ||        // ⭐ THÊM
        window.location.pathname.includes('theodoidiemdo_canhbao') ||
        window.location.pathname.includes('theodoidiemdo_canhbaoai') ||
        window.location.pathname.includes('theodoidiemdo_nhatkynhietdo') ||
        window.location.pathname.includes('theodoidiemdo_bocanhbao') ||      // ⭐ THÊM
        window.location.pathname.includes('thietlapcanhbao_kenhcanhbao')) {  // ⭐ THÊM
        autoSwitchViewOnMobile();
    }

    // Auto-convert tables for pages without card view
    autoConvertTableToCards();

    // Make tables horizontally scrollable on mobile
    makeTablesScrollable();

    // Add touch-friendly interactions
    enhanceTouchInteractions();

    console.log('✅ Responsive helpers initialized');
});

// Add sidebar toggle button for mobile
function addSidebarToggleButton() {
    if (window.innerWidth <= 768) {
        const monitorTopBar = document.querySelector('.monitor-top-bar');
        if (monitorTopBar && !document.getElementById('sidebarToggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'sidebarToggle';
            toggleBtn.className = 'mobile-btn';
            toggleBtn.style.cssText = 'position: absolute; left: 12px; top: 50%; transform: translateY(-50%); z-index: 10;';
            toggleBtn.onclick = toggleSidebar;
            toggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            `;

            monitorTopBar.style.position = 'relative';
            monitorTopBar.insertBefore(toggleBtn, monitorTopBar.firstChild);

            // Add overlay if not exists
            if (!document.querySelector('.sidebar-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
        }
    }
}

// Auto-switch to card view on mobile
function autoSwitchViewOnMobile() {
    if (window.innerWidth <= 768) {
        // Try to use existing switchView function if available
        const cardViewBtn = document.querySelector('.view-btn:last-child');
        if (cardViewBtn && typeof switchView === 'function') {
            switchView('card');
            // Update button states
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            cardViewBtn.classList.add('active');
        } else {
            // Fallback: manually hide table and show card view
            const tableView = document.getElementById('tableView');
            const cardView = document.getElementById('cardView');

            if (tableView && cardView) {
                tableView.classList.add('hidden-view');
                cardView.classList.remove('hidden-view');

                // Update button states if they exist
                const viewBtns = document.querySelectorAll('.view-btn');
                if (viewBtns.length > 0) {
                    viewBtns.forEach(btn => btn.classList.remove('active'));
                    viewBtns[viewBtns.length - 1].classList.add('active');
                }
            }
        }

        console.log('📱 Auto-switched to card view for mobile');
    }
}

// Auto-convert tables to responsive cards on mobile (for pages without card view)
function autoConvertTableToCards() {
    if (window.innerWidth > 768) return; // Only on mobile

    const tables = document.querySelectorAll('.data-table');

    tables.forEach((table, tableIndex) => {
        // Skip if already converted
        if (table.dataset.converted === 'true') return;

        // Check if this page has a card view already
        const cardView = document.getElementById('cardView');
        if (cardView) return; // Skip if card view exists

        // Mark as converted
        table.dataset.converted = 'true';

        // Add a notice above the table
        const notice = document.createElement('div');
        notice.className = 'mobile-table-notice';
        notice.style.cssText = 'padding: 8px 12px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--primary); margin-bottom: 10px; font-size: 12px; color: var(--text-sub); border-radius: 4px;';
        notice.innerHTML = '📱 Vuốt ngang để xem toàn bộ bảng';

        table.parentElement.insertBefore(notice, table);

        console.log(`📊 Added scroll notice to table ${tableIndex + 1}`);
    });
}

// Make tables scrollable on mobile
function makeTablesScrollable() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-scroll-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-scroll-wrapper';
            wrapper.style.cssText = 'overflow-x: auto; -webkit-overflow-scrolling: touch;';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// Enhance touch interactions
function enhanceTouchInteractions() {
    // Add active state for touch
    const touchElements = document.querySelectorAll('.action-btn-circle, .cam-action-btn, .btn-search, .btn-add');

    touchElements.forEach(el => {
        el.addEventListener('touchstart', function () {
            this.style.opacity = '0.7';
        });

        el.addEventListener('touchend', function () {
            this.style.opacity = '1';
        });
    });
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // Re-check mobile state
        if (window.location.pathname.includes('giamsattructiep')) {
            if (window.innerWidth > 768) {
                // Remove mobile sidebar toggle on desktop
                const toggle = document.getElementById('sidebarToggle');
                if (toggle) toggle.remove();

                // Ensure sidebar is visible
                const sidebar = document.querySelector('.tree-sidebar');
                if (sidebar) sidebar.classList.remove('open');

                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.remove('active');
            } else {
                addSidebarToggleButton();
            }
        }

        if (window.location.pathname.includes('quantrihethong_camera') ||
            window.location.pathname.includes('quantrihethong_cambien') ||
            window.location.pathname.includes('quantrihethong_nguoidung') ||
            window.location.pathname.includes('quantrihethong_thietbi') ||
            window.location.pathname.includes('quantrihethong_khuvuc') ||        // ⭐ THÊM
            window.location.pathname.includes('theodoidiemdo_canhbao') ||
            window.location.pathname.includes('theodoidiemdo_canhbaoai') ||
            window.location.pathname.includes('theodoidiemdo_nhatkynhietdo') ||
            window.location.pathname.includes('theodoidiemdo_bocanhbao') ||      // ⭐ THÊM
            window.location.pathname.includes('thietlapcanhbao_kenhcanhbao')) {  // ⭐ THÊM
            autoSwitchViewOnMobile();
        }
    }, 250);
});

// Prevent zoom on double-tap for iOS (optional)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add swipe gesture to close sidebar (optional enhancement)
function addSwipeGesture() {
    const sidebar = document.querySelector('.tree-sidebar');
    if (!sidebar) return;

    let touchStartX = 0;
    let touchEndX = 0;

    sidebar.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sidebar.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - close sidebar
            toggleSidebar();
        }
    }
}

// Initialize swipe gesture
document.addEventListener('DOMContentLoaded', addSwipeGesture);

// Orientation change handler
window.addEventListener('orientationchange', function () {
    setTimeout(function () {
        // Adjust camera grid on orientation change
        const camGrid = document.querySelector('.cam-grid');
        if (camGrid && window.innerWidth <= 768) {
            if (window.orientation === 90 || window.orientation === -90) {
                // Landscape - 2 columns
                camGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                // Portrait - 1 column
                camGrid.style.gridTemplateColumns = '1fr';
            }
        }
    }, 200);
});

// Export functions for global use
window.responsiveHelpers = {
    toggleSidebar,
    addSidebarToggleButton,
    autoSwitchViewOnMobile,
    makeTablesScrollable
};
