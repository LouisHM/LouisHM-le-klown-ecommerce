"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var useCart_1 = require("@/composables/useCart");
var props = defineProps();
var emit = defineEmits(['close']);
var addItem = (0, useCart_1.useCart)().addItem;
var selectedSize = (0, vue_1.ref)('');
var quantity = (0, vue_1.ref)(1);
var sizeError = (0, vue_1.ref)(false);
var sizeSelectEl = (0, vue_1.ref)(null);
var sizeErrorId = "size-error-".concat((_b = (_a = props.product) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 'p');
// Images
var index = (0, vue_1.ref)(0);
var images = (0, vue_1.computed)(function () { var _a, _b; return ((_b = (_a = props.product) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.length) ? props.product.images : ['/assets/img/default-product.jpg']; });
var hasMultiple = (0, vue_1.computed)(function () { return images.value.length > 1; });
var currentImage = (0, vue_1.computed)(function () { return images.value[index.value] || images.value[0]; });
function select(i) { index.value = i; }
function prev() { index.value = (index.value - 1 + images.value.length) % images.value.length; }
function next() { index.value = (index.value + 1) % images.value.length; }
// Stock pill
var stockStatus = (0, vue_1.computed)(function () {
    if (props.product.stock === 0)
        return 'outOfStock';
    if (props.product.stock < 10)
        return 'lowStock';
    return 'inStock';
});
var stockClass = (0, vue_1.computed)(function () {
    switch (stockStatus.value) {
        case 'inStock': return 'bg-success text-dark';
        case 'lowStock': return 'bg-warning text-dark';
        case 'outOfStock': return 'bg-error text-light';
    }
});
function close() { emit('close'); }
// Reset à l’ouverture
(0, vue_1.watch)(function () { return props.visible; }, function (v) {
    if (v) {
        selectedSize.value = '';
        quantity.value = 1;
        sizeError.value = false;
        index.value = 0;
    }
});
(0, vue_1.watch)(selectedSize, function (val) {
    if (val)
        sizeError.value = false;
});
function addToCart() {
    var _a, _b, _c;
    // Taille requise si nécessaire
    if (props.product.has_sizes && !selectedSize.value) {
        sizeError.value = true;
        (_a = sizeSelectEl.value) === null || _a === void 0 ? void 0 : _a.focus();
        return;
    }
    // Clamp quantité (évite NaN/0/négatif)
    var max = Number.isFinite(props.product.stock) ? Math.max(props.product.stock, 0) : 9999;
    var q = Math.max(1, Math.min(Number(quantity.value) || 1, max));
    quantity.value = q;
    // ✅ Payload identique à ta version qui fonctionnait
    addItem({
        productId: props.product.id,
        name: props.product.name,
        price: props.product.price,
        size: selectedSize.value || undefined,
        quantity: q,
        image: ((_b = props.product.images) === null || _b === void 0 ? void 0 : _b[0]) || undefined,
    });
    console.log('Added to cart:', {
        productId: props.product.id,
        name: props.product.name,
        price: props.product.price,
        size: selectedSize.value || undefined,
        quantity: q,
        image: ((_c = props.product.images) === null || _c === void 0 ? void 0 : _c[0]) || undefined,
    });
    close();
}
(0, vue_1.watch)(function () { return props.visible; }, function (v) {
    var html = document.documentElement;
    if (v) {
        // lock
        var scrollBarComp = window.innerWidth - html.clientWidth;
        html.style.overflow = 'hidden';
        if (scrollBarComp > 0)
            html.style.paddingRight = scrollBarComp + 'px';
    }
    else {
        // unlock
        html.style.overflow = '';
        html.style.paddingRight = '';
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
var __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        to: "body",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_3.slots.default;
var __VLS_4 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "fade",
}));
var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([{
        name: "fade",
    }], __VLS_functionalComponentArgsRest(__VLS_5), false));
__VLS_7.slots.default;
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.close) }, { class: "fixed inset-0 z-[10060] bg-black/70 flex items-stretch md:items-center justify-center p-0 md:p-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign(__assign({ onClick: function () { } }, { onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.visible))
                return;
            __VLS_ctx.hasMultiple && __VLS_ctx.prev();
        } }), { onKeydown: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.visible))
                return;
            __VLS_ctx.hasMultiple && __VLS_ctx.next();
        } }), { class: "\u0062\u0067\u002d\u0062\u0061\u0063\u006b\u0067\u0072\u006f\u0075\u006e\u0064\u0044\u0061\u0072\u006b\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006e\u006f\u006e\u0065\u0020\u006d\u0064\u003a\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0032\u0078\u006c\u0020\u0073\u0068\u0061\u0064\u006f\u0077\u002d\u0032\u0078\u006c\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0073\u0063\u0072\u0065\u0065\u006e\u0020\u006d\u0064\u003a\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0068\u002d\u005b\u0031\u0030\u0030\u0064\u0076\u0068\u005d\u0020\u006d\u0064\u003a\u0068\u002d\u0061\u0075\u0074\u006f\u0020\u006d\u0064\u003a\u006d\u0061\u0078\u002d\u0068\u002d\u005b\u0038\u0035\u0076\u0068\u005d\u0020\u006d\u0061\u0078\u002d\u0077\u002d\u0034\u0078\u006c\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006f\u0076\u0065\u0072\u0066\u006c\u006f\u0077\u002d\u0068\u0069\u0064\u0064\u0065\u006e\u0020\u0072\u0065\u006c\u0061\u0074\u0069\u0076\u0065" }), { tabindex: "0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.close) }, { 'aria-label': "Close" }), { class: "absolute right-3 top-3 md:left-4 ring-1 ring-white/20 hover:ring-white/40 md:top-4 z-10 w-8 h-8 md:w-10 md:h-10 inline-flex items-center justify-center rounded-full bg-dark/70 hover:bg-black/90 text-light" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "\u0067\u0072\u0069\u0064\u0020\u0067\u0072\u0069\u0064\u002d\u0063\u006f\u006c\u0073\u002d\u0031\u0020\u006d\u0064\u003a\u0067\u0072\u0069\u0064\u002d\u0063\u006f\u006c\u0073\u002d\u0032\u0020\u0067\u0061\u0070\u002d\u0030\u0020\u006d\u0064\u003a\u0067\u0061\u0070\u002d\u0036\u0020\u0070\u002d\u0033\u0020\u006d\u0064\u003a\u0070\u002d\u0036\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006f\u0076\u0065\u0072\u0066\u006c\u006f\u0077\u002d\u0079\u002d\u0061\u0075\u0074\u006f\u0020\u0068\u002d\u005b\u0063\u0061\u006c\u0063\u0028\u0031\u0030\u0030\u0064\u0076\u0068\u002d\u0030\u002e\u0037\u0035\u0072\u0065\u006d\u0029\u005d\u0020\u006d\u0064\u003a\u0068\u002d\u0061\u0075\u0074\u006f\u0020\u006d\u0064\u003a\u006d\u0061\u0078\u002d\u0068\u002d\u006e\u006f\u006e\u0065" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-3 md:p-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-black/10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: (__VLS_ctx.currentImage), alt: (__VLS_ctx.product.name) }, { class: "absolute inset-0 w-full h-full object-cover" }));
    if (__VLS_ctx.hasMultiple) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.prev) }, { class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u006c\u0065\u0066\u0074\u002d\u0033\u0020\u0074\u006f\u0070\u002d\u0031\u002f\u0032\u0020\u002d\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0031\u002f\u0032\u0020\u0069\u006e\u006c\u0069\u006e\u0065\u002d\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0039\u0020\u0068\u002d\u0039\u0020\u006d\u0064\u003a\u0077\u002d\u0031\u0030\u0020\u006d\u0064\u003a\u0068\u002d\u0031\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0062\u0067\u002d\u0062\u006c\u0061\u0063\u006b\u002f\u0035\u0030\u0020\u0062\u0061\u0063\u006b\u0064\u0072\u006f\u0070\u002d\u0062\u006c\u0075\u0072\u002d\u0073\u006d\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0072\u0069\u006e\u0067\u002d\u0031\u0020\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0032\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0034\u0030\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e" }), { 'aria-label': "Image précédente" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-5 h-5" }), { viewBox: "0 0 20 20", fill: "currentColor" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'fill-rule': "evenodd",
            d: "M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z",
            'clip-rule': "evenodd",
        });
    }
    if (__VLS_ctx.hasMultiple) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.next) }, { class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u0072\u0069\u0067\u0068\u0074\u002d\u0033\u0020\u0074\u006f\u0070\u002d\u0031\u002f\u0032\u0020\u002d\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0031\u002f\u0032\u0020\u0069\u006e\u006c\u0069\u006e\u0065\u002d\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0039\u0020\u0068\u002d\u0039\u0020\u006d\u0064\u003a\u0077\u002d\u0031\u0030\u0020\u006d\u0064\u003a\u0068\u002d\u0031\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0062\u0067\u002d\u0062\u006c\u0061\u0063\u006b\u002f\u0035\u0030\u0020\u0062\u0061\u0063\u006b\u0064\u0072\u006f\u0070\u002d\u0062\u006c\u0075\u0072\u002d\u0073\u006d\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0072\u0069\u006e\u0067\u002d\u0031\u0020\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0032\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0034\u0030\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e" }), { 'aria-label': "Image suivante" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-5 h-5 -scale-x-100" }), { viewBox: "0 0 20 20", fill: "currentColor" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'fill-rule': "evenodd",
            d: "M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z",
            'clip-rule': "evenodd",
        });
    }
    if (__VLS_ctx.hasMultiple) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute bottom-3 right-3 text-xs bg-black/50 px-2 py-1 rounded-full" }, { 'aria-live': "polite" }));
        (__VLS_ctx.index + 1);
        (__VLS_ctx.images.length);
    }
    if (__VLS_ctx.images.length > 1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-3 flex gap-2 overflow-x-auto no-scrollbar" }));
        var _loop_1 = function (img, i) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.visible))
                        return;
                    if (!(__VLS_ctx.images.length > 1))
                        return;
                    __VLS_ctx.select(i);
                } }, { key: (i) }), { class: "relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg m-1 overflow-hidden ring-2 transition" }), { class: (i === __VLS_ctx.index ? 'ring-primary' : 'ring-white/10 hover:ring-white/30') }), { 'aria-label': "Choisir l'image" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: (img), alt: ("".concat(__VLS_ctx.product.name, " miniature ").concat(i + 1)) }, { class: "w-full h-full object-cover" }));
        };
        for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.images)); _i < _c.length; _i++) {
            var _d = _c[_i], img = _d[0], i = _d[1];
            _loop_1(img, i);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-3 md:p-0 pr-3 md:pr-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-start justify-between gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl md:text-3xl font-heading leading-tight" }));
    (__VLS_ctx.product.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: (['inline-block px-2 py-1 text-[11px] md:text-xs font-semibold rounded whitespace-nowrap', __VLS_ctx.stockClass]) }));
    (__VLS_ctx.$t("shop.stock.".concat(__VLS_ctx.stockStatus)));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2 text-red-400 font-bold text-lg md:text-2xl" }));
    (__VLS_ctx.product.price.toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "mt-3 text-sm md:text-base text-gray-300 leading-relaxed max-h-40 md:max-h-56 overflow-auto pr-1" }));
    (__VLS_ctx.product.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-4 space-y-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-3 items-end" }));
    if (__VLS_ctx.product.has_sizes) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "font-semibold mb-1 block text-xs md:text-sm" }));
        (__VLS_ctx.$t('cart.chooseSize'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign(__assign({ value: (__VLS_ctx.selectedSize), ref: "sizeSelectEl" }, { class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0068\u002d\u005b\u0034\u0032\u0070\u0078\u005d\u0020\u006d\u0064\u003a\u0068\u002d\u005b\u0034\u0034\u0070\u0078\u005d\u0020\u0070\u0078\u002d\u0033\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0062\u0067\u002d\u0064\u0061\u0072\u006b\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0075\u0074\u006c\u0069\u006e\u0065\u002d\u006e\u006f\u006e\u0065" }), { class: (__VLS_ctx.sizeError ? 'border-error ring-1 ring-error' : 'border-gray-600 focus:border-gray-400') }), { 'aria-invalid': (__VLS_ctx.sizeError ? 'true' : 'false'), 'aria-describedby': (__VLS_ctx.sizeError ? __VLS_ctx.sizeErrorId : undefined) }));
        /** @type {typeof __VLS_ctx.sizeSelectEl} */ ;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            disabled: true,
            value: "",
        });
        (__VLS_ctx.$t('cart.chooseSize'));
        for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.product.sizes)); _e < _f.length; _e++) {
            var sz = _f[_e][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (sz),
                value: (sz),
            });
            (sz);
        }
        if (__VLS_ctx.sizeError) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign(__assign({ id: (__VLS_ctx.sizeErrorId) }, { class: "mt-1 text-sm text-error" }), { role: "alert" }));
            (__VLS_ctx.$t('cart.mustChooseSize'));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: (__VLS_ctx.product.has_sizes ? 'w-28' : 'flex-1') }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "font-semibold mb-1 block text-xs md:text-sm" }));
    (__VLS_ctx.$t('cart.quantity'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number", min: "1", max: (__VLS_ctx.product.stock) }, { class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0068\u002d\u005b\u0034\u0032\u0070\u0078\u005d\u0020\u006d\u0064\u003a\u0068\u002d\u005b\u0034\u0034\u0070\u0078\u005d\u0020\u0070\u0078\u002d\u0033\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u0020\u0062\u0067\u002d\u0064\u0061\u0072\u006b\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0067\u0072\u0061\u0079\u002d\u0036\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0075\u0074\u006c\u0069\u006e\u0065\u002d\u006e\u006f\u006e\u0065\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u0062\u006f\u0072\u0064\u0065\u0072\u002d\u0067\u0072\u0061\u0079\u002d\u0034\u0030\u0030" }));
    (__VLS_ctx.quantity);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.addToCart) }, { disabled: (__VLS_ctx.product.stock === 0) }), { class: "\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0062\u0067\u002d\u0070\u0072\u0069\u006d\u0061\u0072\u0079\u0020\u0074\u0065\u0078\u0074\u002d\u0064\u0061\u0072\u006b\u0020\u006d\u0064\u003a\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0070\u0079\u002d\u0032\u002e\u0035\u0020\u006d\u0064\u003a\u0070\u0079\u002d\u0033\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u0067\u0020\u0066\u006f\u006e\u0074\u002d\u0073\u0065\u006d\u0069\u0062\u006f\u006c\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0074\u0065\u0078\u0074\u002d\u0064\u0061\u0072\u006b\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0036\u0030\u0020\u0064\u0069\u0073\u0061\u0062\u006c\u0065\u0064\u003a\u0063\u0075\u0072\u0073\u006f\u0072\u002d\u006e\u006f\u0074\u002d\u0061\u006c\u006c\u006f\u0077\u0065\u0064" }));
    (__VLS_ctx.$t('cart.addToCart'));
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[10060]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-stretch']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100dvh]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-h-[85vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['md:top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark/70']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/90']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[calc(100dvh-0.75rem)]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-h-none']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['-scale-x-100']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-3']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['m-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pr-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-40']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-h-56']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[42px]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-[44px]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-error']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[42px]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-[44px]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            selectedSize: selectedSize,
            quantity: quantity,
            sizeError: sizeError,
            sizeSelectEl: sizeSelectEl,
            sizeErrorId: sizeErrorId,
            index: index,
            images: images,
            hasMultiple: hasMultiple,
            currentImage: currentImage,
            select: select,
            prev: prev,
            next: next,
            stockStatus: stockStatus,
            stockClass: stockClass,
            close: close,
            addToCart: addToCart,
        };
    },
    emits: {},
    __typeProps: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
