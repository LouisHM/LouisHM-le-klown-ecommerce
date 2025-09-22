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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var ProductModal_vue_1 = require("@/components/ProductModal.vue");
var props = defineProps();
var showModal = (0, vue_1.ref)(false);
var index = (0, vue_1.ref)(0);
var images = (0, vue_1.computed)(function () { var _a; return ((_a = props.product.images) === null || _a === void 0 ? void 0 : _a.length) ? props.product.images : ['/assets/img/default-product.jpg']; });
var hasMultiple = (0, vue_1.computed)(function () { return images.value.length > 1; });
var currentImage = (0, vue_1.computed)(function () { return images.value[index.value] || images.value[0]; });
function prev() {
    index.value = (index.value - 1 + images.value.length) % images.value.length;
}
function next() {
    index.value = (index.value + 1) % images.value.length;
}
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showModal = true;
    } }, { class: "group relative rounded-md overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative aspect-square bg-black/10" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: (__VLS_ctx.currentImage), alt: (__VLS_ctx.product.name) }, { class: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105" }));
if (__VLS_ctx.hasMultiple) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.prev) }, { class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u006c\u0065\u0066\u0074\u002d\u0032\u0020\u0074\u006f\u0070\u002d\u0031\u002f\u0032\u0020\u002d\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0031\u002f\u0032\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0069\u006e\u006c\u0069\u006e\u0065\u002d\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0031\u0030\u0020\u0068\u002d\u0031\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0062\u0067\u002d\u0062\u006c\u0061\u0063\u006b\u002f\u0035\u0030\u0020\u0062\u0061\u0063\u006b\u0064\u0072\u006f\u0070\u002d\u0062\u006c\u0075\u0072\u002d\u0073\u006d\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006d\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0030\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0068\u006f\u0076\u0065\u0072\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u0020\u0072\u0069\u006e\u0067\u002d\u0031\u0020\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0032\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0034\u0030" }), { 'aria-label': "Image précédente" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-5 h-5" }), { viewBox: "0 0 20 20", fill: "currentColor" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z",
        'clip-rule': "evenodd",
    });
}
if (__VLS_ctx.hasMultiple) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.next) }, { class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u0072\u0069\u0067\u0068\u0074\u002d\u0032\u0020\u0074\u006f\u0070\u002d\u0031\u002f\u0032\u0020\u002d\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0031\u002f\u0032\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0069\u006e\u006c\u0069\u006e\u0065\u002d\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0031\u0030\u0020\u0068\u002d\u0031\u0030\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0062\u0067\u002d\u0062\u006c\u0061\u0063\u006b\u002f\u0035\u0030\u0020\u0062\u0061\u0063\u006b\u0064\u0072\u006f\u0070\u002d\u0062\u006c\u0075\u0072\u002d\u0073\u006d\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006d\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0030\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0068\u006f\u0076\u0065\u0072\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u0020\u0066\u006f\u0063\u0075\u0073\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u0020\u0072\u0069\u006e\u0067\u002d\u0031\u0020\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0032\u0030\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0072\u0069\u006e\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u002f\u0034\u0030" }), { 'aria-label': "Image suivante" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-5 h-5 transform -scale-x-100" }), { viewBox: "0 0 20 20", fill: "currentColor" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M12.293 15.707a1 1 0 01-1.414 0L5.586 10l5.293-5.707a1 1 0 111.414 1.414L8.414 10l3.879 4.293a1 1 0 010 1.414z",
        'clip-rule': "evenodd",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u0069\u006e\u0073\u0065\u0074\u002d\u0078\u002d\u0030\u0020\u0062\u006f\u0074\u0074\u006f\u006d\u002d\u0030\u0020\u007a\u002d\u0031\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u0067\u002d\u0064\u0061\u0072\u006b\u002f\u0038\u0030\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0070\u002d\u0033\u0020\u0070\u0074\u002d\u0031\u0032\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0030\u0020\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006d\u0064\u003a\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0066\u0075\u006c\u006c\u0020\u006d\u0064\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0068\u006f\u0076\u0065\u0072\u003a\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0030\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0068\u006f\u0076\u0065\u0072\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0066\u006f\u0063\u0075\u0073\u002d\u0077\u0069\u0074\u0068\u0069\u006e\u003a\u0074\u0072\u0061\u006e\u0073\u006c\u0061\u0074\u0065\u002d\u0079\u002d\u0030\u0020\u006d\u0064\u003a\u0067\u0072\u006f\u0075\u0070\u002d\u0066\u006f\u0063\u0075\u0073\u002d\u0077\u0069\u0074\u0068\u0069\u006e\u003a\u006f\u0070\u0061\u0063\u0069\u0074\u0079\u002d\u0031\u0030\u0030\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u002d\u0061\u006c\u006c\u0020\u0064\u0075\u0072\u0061\u0074\u0069\u006f\u006e\u002d\u0035\u0030\u0030\u0020\u0065\u0061\u0073\u0065\u002d\u006f\u0075\u0074\u0020\u0077\u0069\u006c\u006c\u002d\u0063\u0068\u0061\u006e\u0067\u0065\u002d\u0074\u0072\u0061\u006e\u0073\u0066\u006f\u0072\u006d" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-start" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-base font-heading font-semibold truncate drop-shadow" }));
(__VLS_ctx.product.name);
if (__VLS_ctx.product.has_sizes) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-wrap gap-1 justify-end" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.product.sizes)); _i < _a.length; _i++) {
        var sz = _a[_i][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ key: (sz) }, { class: "px-2 py-0.5 border border-white/30 rounded text-[11px] bg-black/20" }));
        (sz);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-1 flex justify-between items-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm font-bold text-red-400 drop-shadow" }));
(__VLS_ctx.product.price.toFixed(2));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: (['inline-block px-2 py-1 text-[10px] font-semibold rounded', __VLS_ctx.stockClass]) }));
(__VLS_ctx.$t("shop.stock.".concat(__VLS_ctx.stockStatus)));
/** @type {[typeof ProductModal, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(ProductModal_vue_1.default, new ProductModal_vue_1.default(__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showModal), product: (__VLS_ctx.product) })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showModal), product: (__VLS_ctx.product) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3;
var __VLS_4;
var __VLS_5;
var __VLS_6 = {
    onClose: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showModal = false;
    }
};
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['md:opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['md:opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-white/40']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-scale-x-100']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-x-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark/80']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['md:translate-y-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-hover:translate-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-focus-within:translate-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:group-focus-within:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-out']} */ ;
/** @type {__VLS_StyleScopedClasses['will-change-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['drop-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['drop-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            ProductModal: ProductModal_vue_1.default,
            showModal: showModal,
            hasMultiple: hasMultiple,
            currentImage: currentImage,
            prev: prev,
            next: next,
            stockStatus: stockStatus,
            stockClass: stockClass,
        };
    },
    __typeProps: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
