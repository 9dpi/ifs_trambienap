/**
 * Responsive Helper Functions
 * Handles mobile-specific interactions
 */

// Toggle sidebar on mobile (for giamsattructiep.html)
function toggleSidebar() {
    const sidebar = document.querySelector('.tree-sidebar') || document.querySelector('.live-sidebar');
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
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
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
        // Skip for specific page
        if (window.location.href.includes('quantrihethong_loaithietbi_them.html')) return;

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

// Add filter toggle button for mobile
function addFilterToggle() {
    if (window.innerWidth <= 768) {
        // Exclude <details> elements because they already have built-in summary toggle
        const filters = Array.from(document.querySelectorAll('.filter-section-modern, .filter-section, .filter-card'))
            .filter(el => el.tagName.toLowerCase() !== 'details');

        filters.forEach((filter, index) => {
            // Check if toggle already exists
            const prev = filter.previousElementSibling;
            if (prev && prev.classList.contains('btn-filter-toggle')) return;

            // Create toggle button
            const btn = document.createElement('button');
            btn.className = 'btn-filter-toggle collapsed'; // Default collapsed
            btn.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span>Bộ lọc tìm kiếm</span>
                </div>
                <svg class="toggle-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            `;

            // Insert before filter
            filter.parentNode.insertBefore(btn, filter);

            // Add ID if needed for aria (optional)
            const filterId = filter.id || `filter-section-${index}`;
            filter.id = filterId;

            // Initial state: Collapsed
            filter.classList.add('mobile-hidden');

            // Click handler
            btn.onclick = function () {
                const isHidden = filter.classList.contains('mobile-hidden');
                if (isHidden) {
                    filter.classList.remove('mobile-hidden');
                    this.classList.remove('collapsed');
                    this.querySelector('.toggle-arrow').style.transform = 'rotate(180deg)';
                } else {
                    filter.classList.add('mobile-hidden');
                    this.classList.add('collapsed');
                    this.querySelector('.toggle-arrow').style.transform = 'rotate(0deg)';
                }
            };
        });
    } else {
        // Desktop: Remove toggles and show filters
        document.querySelectorAll('.btn-filter-toggle').forEach(btn => btn.remove());
        document.querySelectorAll('.filter-section-modern, .filter-section, .filter-card').forEach(el => {
            el.classList.remove('mobile-hidden');
        });

    }
}

// Export functions for global use
window.responsiveHelpers = {
    toggleSidebar,
    addSidebarToggleButton,
    autoSwitchViewOnMobile,
    makeTablesScrollable,
    addFilterToggle
};

// Initialize on load
document.addEventListener('DOMContentLoaded', addFilterToggle);
// Re-run on resize
window.addEventListener('resize', () => setTimeout(addFilterToggle, 250));
