// Random Chinese product names
const chineseNames = [
    '潘家多拉S925纯银心形闪耀许愿星链扣头蛇骨链手链新品DIY配件',
    '2024新款秋冬季加厚羊毛衫男士圆领针织衫保暖毛衣外套休闲',
    '高品质纯棉短袖T恤男女同款潮牌印花宽松休闲百搭情侣装',
    '韩版时尚休闲运动鞋男女跑步鞋透气网面轻便舒适软底',
    '新款智能手表心率血压监测防水多功能运动蓝牙手环',
    '日系简约双肩包男女学生书包大容量旅行背包电脑包',
    '高档真皮钱包男士短款牛皮钱夹商务休闲卡包零钱包',
    '户外登山徒步鞋防滑耐磨透气运动鞋越野跑鞋男女款',
    '复古文艺小众设计感项链锁骨链轻奢高级感饰品女',
    '北欧风简约创意家居装饰摆件客厅书房办公桌面收纳'
];

// Generate random order ID
function generateOrderId() {
    return 'O' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

// Get random Chinese name
function getRandomChineseName() {
    return chineseNames[Math.floor(Math.random() * chineseNames.length)];
}

// Default products data
let products = [
    {
        orderId: 'O250624982954',
        storeName: 'taobao',
        weight: 'With Box524g/Without Box 524g',
        imageUrl: 'media/no_item_img.webp',
        name: '潘家多拉S925纯银心形闪耀许愿星链扣头蛇骨链手链新品DIY配件',
        price: 7.17
    },
    {
        orderId: 'O250703083745',
        storeName: 'taobao',
        weight: 'With Box1681g/Without Box 1681g',
        imageUrl: 'media/no_item_img.webp',
        name: '2024新款秋冬季加厚羊毛衫男士圆领针织衫保暖毛衣外套休闲',
        price: 15.66
    },
    {
        orderId: 'O250706418565',
        storeName: 'taobao',
        weight: 'With Box232g/Without Box 232g',
        imageUrl: 'media/no_item_img.webp',
        name: '高品质纯棉短袖T恤男女同款潮牌印花宽松休闲百搭情侣装',
        price: 7.90
    }
];

// Load products from localStorage
function loadProducts() {
    const saved = localStorage.getItem('parcelProducts');
    if (saved) {
        products = JSON.parse(saved);
    }
    renderProducts();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('parcelProducts', JSON.stringify(products));
}

// Render products in the overlay
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-header">
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${p.orderId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Store Name:</span>
                    <span class="detail-value">${p.storeName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Weight:</span>
                    <span class="detail-value">${p.weight}</span>
                </div>
            </div>
            <div class="product-body">
                <img src="${p.imageUrl}" alt="Product" class="product-image" onerror="this.src='media/no_item_img.webp'">
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                </div>
            </div>
            <div class="product-footer">
                <span class="product-price">¥ ${(parseFloat(p.price) * 6.96).toFixed(2)}</span>
                <span class="product-qty">x1</span>
            </div>
        </div>
    `).join('');
    
    // Update grand total after rendering
    updateGrandTotal();
}

// Calculate and update grand total (shipping + products)
function updateGrandTotal() {
    const grandTotalEl = document.getElementById('ov-grand-total');
    if (!grandTotalEl) return;
    
    // Get shipping total from localStorage or DOM
    let shippingTotalYen = 0;
    let shippingTotalUsd = 0;
    let couponTotalYen = 0;
    let couponTotalUsd = 0;
    const conversionYen = 6.96;
    
    const savedData = localStorage.getItem('parcelData');
    if (savedData) {
        const data = JSON.parse(savedData);
        shippingTotalYen = parseFloat(data.totalYen) || 0;
        shippingTotalUsd = parseFloat(String(data.totalUsd).replace(/[^0-9.]/g, '')) || 0;
        couponTotalUsd = parseFloat(String(data.couponUsd).replace(/[^0-9.]/g, '')) || 0;
    } else {
        const totalYenEl = document.querySelector(".data-total-yen");
        const totalUsdEl = document.querySelector(".data-total-usd");
       
        if (totalYenEl) shippingTotalYen = parseFloat(totalYenEl.textContent) || 0;
        if (totalUsdEl) shippingTotalUsd = parseFloat(totalUsdEl.textContent.replace(/[^0-9.]/g, '')) || 0;
        
        const couponUsdEl = document.querySelector(".data-coupon-usd");
        if (couponUsdEl) couponTotalUsd = parseFloat(couponUsdEl.textContent.replace(/[^0-9.]/g, '')) || 0;
    }
    
    couponTotalYen = couponTotalUsd * conversionYen;
    
    // Sum all product prices (now in USD)
    const productsTotalUsd = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    
    // Grand total
    const productsTotalYen = productsTotalUsd * conversionYen;
    
    // Subtract coupon from the shipping base
    const effectiveShippingYen = shippingTotalYen - couponTotalYen;
    const effectiveShippingUsd = shippingTotalUsd - couponTotalUsd;
    
    const grandTotalYen = effectiveShippingYen + productsTotalYen;
    const grandTotalUsd = effectiveShippingUsd + productsTotalUsd;
    
    grandTotalEl.textContent = `¥ ${grandTotalYen.toFixed(2)} ($${grandTotalUsd.toFixed(2)})`;
}

// Render product forms in editor
function renderProductForms() {
    const container = document.getElementById('products-form-container');
    if (!container) return;
    
    container.innerHTML = products.map((p, i) => `
        <div class="product-form" data-index="${i}">
            <h4>
                Product ${i + 1}
                <button class="remove-product-btn" onclick="removeProduct(${i})">Remove</button>
            </h4>
            <div class="form-group">
                <label>Weight:</label>
                <input type="text" value="${p.weight}" data-field="weight">
            </div>
            <div class="form-group">
                <label>Product Name:</label>
                <textarea data-field="name">${p.name}</textarea>
            </div>
            <div class="form-group">
                <label>Price ($):</label>
                <input type="number" value="${p.price}" step="0.01" data-field="price">
            </div>
        </div>
    `).join('');
}

// Add new product
function addNewProduct() {
    products.push({
        orderId: generateOrderId(),
        storeName: 'taobao',
        weight: 'With Box0g/Without Box 0g',
        imageUrl: 'media/no_item_img.webp',
        name: getRandomChineseName(),
        price: 0
    });
    renderProductForms();
}

// Remove product
function removeProduct(index) {
    products.splice(index, 1);
    renderProductForms();
}

// Save products from forms
function saveProductsFromForms() {
    const forms = document.querySelectorAll('.product-form');
    const newProducts = [];
    
    forms.forEach((form, i) => {
        const product = {
            orderId: products[i]?.orderId || generateOrderId(),
            storeName: 'taobao',
            imageUrl: 'media/no_item_img.webp'
        };
        form.querySelectorAll('input, textarea').forEach(input => {
            const field = input.dataset.field;
            let value = input.value;
            if (field === 'price') value = parseFloat(value) || 0;
            product[field] = value;
        });
        newProducts.push(product);
    });
    
    products = newProducts;
    saveProducts();
    renderProducts();
}

// Open details overlay
function openDetailsOverlay() {
    const overlay = document.getElementById('details-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        loadProducts();
    }
}

// Close details overlay
function closeDetailsOverlay() {
    const overlay = document.getElementById('details-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Open products editor
function openProductsEditor() {
    const modal = document.getElementById('products-editor-modal');
    if (modal) {
        renderProductForms();
        modal.classList.remove('hidden');
    }
}

// Close products editor
function closeProductsEditor() {
    const modal = document.getElementById('products-editor-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const modal = document.getElementById('editor-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const editableCard = document.getElementById('editable-parcel');

    // Data elements in the card
    const dataElements = {
        id: editableCard?.querySelector('.data-id'),
        method: editableCard?.querySelector('.data-method'),
        volume: editableCard?.querySelector('.data-volume'),
        oldWeight: editableCard?.querySelector('.data-old-weight'),
        weight: editableCard?.querySelector('.data-weight'),
        date: editableCard?.querySelector('.data-date'),
        shippingYen: editableCard?.querySelector('.data-shipping-yen'),
        shippingUsd: editableCard?.querySelector('.data-shipping-usd'),
        couponYen: editableCard?.querySelector('.data-coupon-yen'),
        couponUsd: editableCard?.querySelector('.data-coupon-usd'),
        totalYen: editableCard?.querySelector('.data-total-yen'),
        totalUsd: editableCard?.querySelector('.data-total-usd'),
        insurance: editableCard?.querySelector('.data-insurance'),
        package: editableCard?.querySelector('.data-package'),
        tracking: editableCard?.querySelector('.data-tracking'),
        service: editableCard?.querySelector('.data-service'),
        vat: editableCard?.querySelector('.data-vat'),
        customYen: editableCard?.querySelector('.data-custom-yen'),
        customUsd: editableCard?.querySelector('.data-custom-usd')
    };

    // Input elements in the modal
    const inputs = {
        id: document.getElementById('edit-id'),
        volume: document.getElementById('edit-volume'),
        oldWeight: document.getElementById('edit-old-weight'),
        weight: document.getElementById('edit-weight'),
        date: document.getElementById('edit-date'),
        shippingYen: document.getElementById('edit-shipping-yen'),
        shippingUsd: document.getElementById('edit-shipping-usd'),
        couponUsd: document.getElementById('edit-coupon-usd'),
        totalYen: document.getElementById('edit-total-yen'),
        totalUsd: document.getElementById('edit-total-usd'),
        tracking: document.getElementById('edit-tracking'),
        // Address fields
        country: document.getElementById('edit-country'),
        city: document.getElementById('edit-city'),
        address: document.getElementById('edit-address'),
        recipient: document.getElementById('edit-recipient'),
        zip: document.getElementById('edit-zip')
    };
    
    // Address overlay elements
    const addressElements = {
        country: document.getElementById('ov-country'),
        city: document.getElementById('ov-city'),
        address: document.getElementById('ov-address'),
        recipient: document.getElementById('ov-recipient'),
        zip: document.getElementById('ov-zip'),
        coupon: document.getElementById('ov-coupon')
    };

    // Load saved data from localStorage on page load
    const loadSavedData = () => {
        const savedData = localStorage.getItem('parcelData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            if (dataElements.id && data.id) dataElements.id.textContent = data.id;
            if (dataElements.method && data.method) dataElements.method.textContent = data.method;
            if (dataElements.volume && data.volume) dataElements.volume.textContent = data.volume;
            if (dataElements.oldWeight && data.oldWeight) dataElements.oldWeight.textContent = data.oldWeight;
            if (dataElements.weight && data.weight) dataElements.weight.textContent = data.weight;
            if (dataElements.date && data.date) dataElements.date.textContent = data.date;
            if (dataElements.shippingYen && data.shippingYen) dataElements.shippingYen.textContent = data.shippingYen;
            if (dataElements.shippingUsd && data.shippingUsd) dataElements.shippingUsd.textContent = data.shippingUsd;
            if (dataElements.couponYen && data.couponYen !== undefined) dataElements.couponYen.textContent = data.couponYen;
            if (dataElements.couponUsd && data.couponUsd !== undefined) dataElements.couponUsd.textContent = data.couponUsd;
            if (dataElements.totalYen && data.totalYen) dataElements.totalYen.textContent = data.totalYen;
            if (dataElements.totalUsd && data.totalUsd) dataElements.totalUsd.textContent = data.totalUsd;
            if (dataElements.insurance && data.insurance) dataElements.insurance.textContent = data.insurance;
            if (dataElements.package && data.package) dataElements.package.textContent = data.package;
            if (dataElements.tracking && data.tracking) dataElements.tracking.textContent = data.tracking;
            if (dataElements.service && data.service) dataElements.service.textContent = data.service;
            if (dataElements.vat && data.vat) dataElements.vat.textContent = data.vat;
            if (dataElements.customYen && data.customYen) dataElements.customYen.textContent = data.customYen;
            if (dataElements.customUsd && data.customUsd) dataElements.customUsd.textContent = data.customUsd;
            
            // Load address
            if (addressElements.country && data.country) addressElements.country.textContent = data.country;
            if (addressElements.city && data.city) addressElements.city.textContent = data.city;
            if (addressElements.address && data.address) addressElements.address.textContent = data.address;
            if (addressElements.recipient && data.recipient) addressElements.recipient.textContent = data.recipient;
            if (addressElements.zip && data.zip) addressElements.zip.textContent = data.zip;
            if (addressElements.coupon && data.couponYen !== undefined) addressElements.coupon.textContent = `-¥ ${data.couponYen}`;
        }
    };

    loadSavedData();

    // Open modal and populate with current values
    const openModal = () => {
        if (inputs.id) inputs.id.value = dataElements.id?.textContent || '';
        if (inputs.volume) inputs.volume.value = dataElements.volume?.textContent || '';
        if (inputs.oldWeight) inputs.oldWeight.value = dataElements.oldWeight?.textContent || '';
        if (inputs.weight) inputs.weight.value = dataElements.weight?.textContent || '';
        if (inputs.date) inputs.date.value = dataElements.date?.textContent || '';
        if (inputs.shippingYen) inputs.shippingYen.value = dataElements.shippingYen?.textContent || '';
        if (inputs.shippingUsd) inputs.shippingUsd.value = dataElements.shippingUsd?.textContent || '';
        if (inputs.couponUsd) inputs.couponUsd.value = dataElements.couponUsd?.textContent || '';
        if (inputs.totalYen) inputs.totalYen.value = dataElements.totalYen?.textContent || '';
        if (inputs.totalUsd) inputs.totalUsd.value = dataElements.totalUsd?.textContent || '';
        if (inputs.tracking) inputs.tracking.value = dataElements.tracking?.textContent || '';
        
        // Populate address
        if (inputs.country) inputs.country.value = addressElements.country?.textContent || '';
        if (inputs.city) inputs.city.value = addressElements.city?.textContent || '';
        if (inputs.address) inputs.address.value = addressElements.address?.textContent || '';
        if (inputs.recipient) inputs.recipient.value = addressElements.recipient?.textContent || '';
        if (inputs.zip) inputs.zip.value = addressElements.zip?.textContent || '';
        
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // Save changes
    const saveChanges = () => {
        if (dataElements.id) dataElements.id.textContent = inputs.id.value;
        if (dataElements.volume) dataElements.volume.textContent = inputs.volume.value;
        if (dataElements.oldWeight) dataElements.oldWeight.textContent = inputs.oldWeight.value;
        if (dataElements.weight) dataElements.weight.textContent = inputs.weight.value;
        const couponUsdVal = parseFloat(inputs.couponUsd?.value) || 0;
        const couponYenVal = (couponUsdVal * 6.96).toFixed(2);
        
        if (dataElements.date) dataElements.date.textContent = inputs.date.value;
        if (dataElements.shippingYen) dataElements.shippingYen.textContent = inputs.shippingYen.value;
        if (dataElements.shippingUsd) dataElements.shippingUsd.textContent = inputs.shippingUsd.value;
        if (dataElements.couponYen) dataElements.couponYen.textContent = couponYenVal;
        if (dataElements.couponUsd) dataElements.couponUsd.textContent = couponUsdVal.toFixed(2);
        if (dataElements.totalYen) dataElements.totalYen.textContent = inputs.totalYen.value;
        if (dataElements.totalUsd) dataElements.totalUsd.textContent = inputs.totalUsd.value;
        if (dataElements.tracking) dataElements.tracking.textContent = inputs.tracking.value;
        
        // Update address in overlay
        if (addressElements.country) addressElements.country.textContent = inputs.country.value;
        if (addressElements.city) addressElements.city.textContent = inputs.city.value;
        if (addressElements.address) addressElements.address.textContent = inputs.address.value;
        if (addressElements.recipient) addressElements.recipient.textContent = inputs.recipient.value;
        if (addressElements.zip) addressElements.zip.textContent = inputs.zip.value;
        if (addressElements.coupon) addressElements.coupon.textContent = `-¥ ${couponYenVal}`;
        
        // Save to localStorage
        const dataToSave = {
            id: inputs.id?.value,
            method: dataElements.method?.textContent,
            volume: inputs.volume?.value,
            oldWeight: inputs.oldWeight?.value,
            weight: inputs.weight?.value,
            date: inputs.date?.value,
            shippingYen: inputs.shippingYen?.value,
            shippingUsd: inputs.shippingUsd?.value,
            couponYen: couponYenVal,
            couponUsd: couponUsdVal.toFixed(2),
            totalYen: inputs.totalYen?.value,
            totalUsd: inputs.totalUsd?.value,
            insurance: dataElements.insurance?.textContent,
            package: dataElements.package?.textContent,
            tracking: inputs.tracking?.value,
            service: dataElements.service?.textContent,
            vat: dataElements.vat?.textContent,
            customYen: dataElements.customYen?.textContent,
            customUsd: dataElements.customUsd?.textContent,
            // Address
            country: inputs.country?.value,
            city: inputs.city?.value,
            address: inputs.address?.value,
            recipient: inputs.recipient?.value,
            zip: inputs.zip?.value
        };
        
        localStorage.setItem('parcelData', JSON.stringify(dataToSave));
        closeModal();
    };

    // Event listeners
    if (editBtn) editBtn.addEventListener('click', openModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (saveBtn) saveBtn.addEventListener('click', saveChanges);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Products editor event listeners (Track button)
    const trackBtn = document.getElementById('track-btn');
    const cancelProductsBtn = document.getElementById('cancel-products-btn');
    const saveProductsBtn = document.getElementById('save-products-btn');
    
    if (trackBtn) trackBtn.addEventListener('click', openProductsEditor);
    if (cancelProductsBtn) cancelProductsBtn.addEventListener('click', closeProductsEditor);
    if (saveProductsBtn) {
        saveProductsBtn.addEventListener('click', () => {
            saveProductsFromForms();
            closeProductsEditor();
        });
    }
});

// Toggle details collapse
function toggleDetails(header) {
    header.classList.toggle('collapsed');
    const detailsBody = header.nextElementSibling;
    if (detailsBody && detailsBody.classList.contains('details-body')) {
        detailsBody.classList.toggle('collapsed');
    }
}

// ==================== PDF PARSER ====================

// Parse AFIP declaration PDF and extract items
async function parsePdfDeclaration(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
    }
    
    return extractItemsFromText(fullText);
}

// Extract items from the parsed text using regex patterns
function extractItemsFromText(text) {
    const items = [];
    
    // Normalize text: remove extra spaces and newlines
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Common rubros in AFIP declarations
    const rubros = [
        'Bijouterie',
        'Calzado', 
        'Ropa de vestir y deporte',
        'Juguetes',
        'Electrónica',
        'Accesorios',
        'Hogar',
        'Deportes',
        'Cosmética',
        'Alimentos',
        'Libros',
        'Instrumentos musicales',
        'Artículos de pesca',
        'Artículos de camping'
    ];
    
    // Find ALL sections that contain items (there may be multiple in multi-page PDFs)
    // Each section starts with "ITEMS QUE COMPONEN EL ENVÍO" and ends before "CONTROLES Y LIQUIDACIONES"
    const sectionPattern = /ITEMS QUE COMPONEN EL ENV[ÍI]O.*?RUBRO\s+DESCRIPCI[ÓO]N\s+CANT\.?\s*UNID\.?\s+IMPORTE \(USD\)(.*?)(?:CONTROLES|UTILIZA|CANTIDAD DE [ÍI]TEMS|DERECHO DE IMPORTACI[ÓO]N)/gi;
    
    let sectionMatch;
    while ((sectionMatch = sectionPattern.exec(normalizedText)) !== null) {
        const itemsSection = sectionMatch[1].trim();
        
        // Create a pattern that matches: RUBRO + description + number + UN + price
        const itemPattern = new RegExp(
            `(${rubros.join('|')})\\s+(.*?)\\s+(\\d+)\\s*UN\\s+(\\d+(?:\\.\\d+)?)`,
            'gi'
        );
        
        let match;
        while ((match = itemPattern.exec(itemsSection)) !== null) {
            const [, rubro, descripcion, cantidad, precio] = match;
            items.push({
                rubro: rubro.trim(),
                descripcion: descripcion.trim(),
                cantidad: parseInt(cantidad),
                precioUsd: parseFloat(precio)
            });
        }
    }
    
    // Fallback: try a more generic pattern if no items found
    if (items.length === 0) {
        // Look for patterns like: "text description 2 UN 5.0"
        const genericPattern = /([A-Za-záéíóúñÁÉÍÓÚÑ\s]+?)\s+(\d+)\s*UN\s+(\d+(?:\.\d+)?)/gi;
        let match;
        while ((match = genericPattern.exec(normalizedText)) !== null) {
            const [fullMatch, descripcion, cantidad, precio] = match;
            // Filter out false positives (too short descriptions)
            if (descripcion.trim().length > 3 && !descripcion.includes('CANT')) {
                items.push({
                    rubro: 'General',
                    descripcion: descripcion.trim(),
                    cantidad: parseInt(cantidad),
                    precioUsd: parseFloat(precio)
                });
            }
        }
    }
    
    return items;
}

// Convert extracted items to product format for the app
// Creates multiple products based on quantity (cantidad)
// Uses random Chinese names like the original app
function convertToProducts(items) {
    const products = [];
    
    items.forEach((item) => {
        // Create N products based on quantity
        for (let i = 0; i < item.cantidad; i++) {
            products.push({
                orderId: generateOrderId(),
                storeName: 'taobao',
                weight: `With Box0g/Without Box 0g`,
                imageUrl: 'media/no_item_img.webp',
                name: getRandomChineseName(),
                price: item.precioUsd / item.cantidad // Divide price equally among items
            });
        }
    });
    
    return products;
}

// Handle PDF file selection
document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const contactSupportBtn = document.getElementById('contact-support-btn');
    
    // Camouflaged: Contact support button triggers PDF upload
    if (contactSupportBtn && pdfInput) {
        contactSupportBtn.addEventListener('click', () => {
            pdfInput.click();
        });
    }
    
    if (pdfInput) {
        pdfInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Show loading on the button
            const originalBtnText = contactSupportBtn.innerHTML;
            contactSupportBtn.innerHTML = `<i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i> Cargando...`;
            contactSupportBtn.disabled = true;
            lucide.createIcons();
            
            try {
                const items = await parsePdfDeclaration(file);
                
                if (items.length === 0) {
                    alert('No se encontraron items en el PDF. Verificá que sea una declaración de AFIP/Correo Argentino.');
                    contactSupportBtn.innerHTML = originalBtnText;
                    contactSupportBtn.disabled = false;
                    lucide.createIcons();
                    return;
                }
                
                // Convert to products and add to existing ones
                const newProducts = convertToProducts(items);
                const totalUnidades = items.reduce((sum, i) => sum + i.cantidad, 0);
                
                // Ask user if they want to replace or append
                const shouldReplace = confirm(
                    `Se encontraron ${items.length} tipos de items (${totalUnidades} unidades totales):\n\n` +
                    items.map(i => `• ${i.descripcion} (${i.cantidad} UN) - $${i.precioUsd}`).join('\n') +
                    `\n\n¿Reemplazar los productos actuales? (Cancelar para agregarlos)`
                );
                
                if (shouldReplace) {
                    products = newProducts;
                } else {
                    products = [...products, ...newProducts];
                }
                
                saveProducts();
                
                // Open the products editor to show the imported items
                openProductsEditor();
                
            } catch (error) {
                console.error('Error parsing PDF:', error);
                alert('Error al procesar el PDF: ' + error.message);
            }
            
            // Restore button
            contactSupportBtn.innerHTML = originalBtnText;
            contactSupportBtn.disabled = false;
            lucide.createIcons();
            
            // Reset input
            pdfInput.value = '';
        });
    }
});