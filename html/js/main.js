let map1, map2;
const tileUrlDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const tileUrlLight = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

document.addEventListener('DOMContentLoaded', () => {
    initMaps();
    initChart();
});

function initMaps() {
    if (typeof L === 'undefined') return;

    // Map 1 (Đà Nẵng)
    map1 = L.map('map1', { zoomControl: false }).setView([16.0544, 108.2022], 14);
    L.tileLayer(tileUrlDark, { maxZoom: 19 }).addTo(map1);
    L.marker([16.0544, 108.2022]).addTo(map1);

    // Map 2 (Phú Quốc)
    map2 = L.map('map2', { zoomControl: false }).setView([10.2899, 103.9840], 14);
    L.tileLayer(tileUrlDark, { maxZoom: 19 }).addTo(map2);
    L.marker([10.2899, 103.9840]).addTo(map2);
}

function setMapMode(mode) {
    const container = document.getElementById('mapContainer');
    const btnSingle = document.getElementById('btnSingle');
    const btnSplit = document.getElementById('btnSplit');

    if (mode === 'single') {
        container.className = 'map-view-container mode-single';
        btnSingle.classList.add('active');
        btnSplit.classList.remove('active');
    } else {
        container.className = 'map-view-container mode-split';
        btnSplit.classList.add('active');
        btnSingle.classList.remove('active');
    }

    setTimeout(() => {
        if (map1) map1.invalidateSize();
        if (map2) map2.invalidateSize();
    }, 300);
}

let chart;
function initChart() {
    const chartEl = document.querySelector("#tempChart");
    if (typeof ApexCharts === 'undefined' || !chartEl) return;

    const options = {
        series: [{ name: 'Nhiệt độ', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }],
        chart: { type: 'area', height: 250, toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter' },
        colors: ['#3B82F6'], stroke: { curve: 'smooth' }, dataLabels: { enabled: false },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], labels: { style: { colors: '#94A3B8' } } },
        yaxis: { labels: { style: { colors: '#94A3B8' } } },
        grid: { borderColor: '#334155' },
        theme: { mode: 'dark' }
    };
    chart = new ApexCharts(chartEl, options);
    chart.render();
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', target);

    const url = target === 'dark' ? tileUrlDark : tileUrlLight;
    if (map1) map1.eachLayer(l => { if (l instanceof L.TileLayer) l.setUrl(url) });
    if (map2) map2.eachLayer(l => { if (l instanceof L.TileLayer) l.setUrl(url) });

    if (chart) {
        chart.updateOptions({
            theme: { mode: target },
            xaxis: { labels: { style: { colors: target === 'dark' ? '#94A3B8' : '#6B7280' } } },
            yaxis: { labels: { style: { colors: target === 'dark' ? '#94A3B8' : '#6B7280' } } },
            grid: { borderColor: target === 'dark' ? '#334155' : '#E5E7EB' }
        });
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mainMenu');
    menu.classList.toggle('open');
    document.body.classList.toggle('menu-open-body');
}

// Mobile menu & Dropdown toggle logic
document.addEventListener('DOMContentLoaded', () => {

    // Auto-label table cells for mobile card view
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index] && !cell.hasAttribute('data-label')) {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    });

    // Attach click listeners to all nav wrappers with dropdowns
    const navWrappers = document.querySelectorAll('.nav-wrapper');

    navWrappers.forEach(wrapper => {
        const navLink = wrapper.querySelector('.nav-link');
        const dropdown = wrapper.querySelector('.dropdown-menu, .mega-menu');

        if (dropdown && navLink) {
            navLink.addEventListener('click', (e) => {
                // Only prevent default and toggle if on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other open menus
                    navWrappers.forEach(w => {
                        if (w !== wrapper) {
                            w.classList.remove('active');
                        }
                    });

                    // Toggle current
                    wrapper.classList.toggle('active');
                }
            });
        }
    });

    // Close menu when clicking outside (Mobile only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && document.body.classList.contains('menu-open-body')) {
            const menu = document.getElementById('mainMenu');
            const toggleBtn = document.querySelector('.mobile-btn');

            // If click is outside menu and not on the toggle button
            if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        }
    });
});
// Standard Tree Toggle Function
function toggleAreaNode(el) {
    const node = el.closest('.at-node') || el.closest('.modern-at-node') || el.closest('.tree-node');
    if (node) {
        node.classList.toggle('expanded');
        node.classList.toggle('open'); // Compatibility with old styles
    }
}
