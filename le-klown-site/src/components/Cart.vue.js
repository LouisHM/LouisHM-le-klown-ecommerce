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
var vue_i18n_1 = require("vue-i18n");
var useCart_1 = require("@/composables/useCart");
var t = (0, vue_i18n_1.useI18n)().t;
var props = defineProps();
var emit = defineEmits();
function closeCart() { emit('update:open', false); }
/* État d'ouverture robuste (contrôlé OU interne) */
var internalOpen = (0, vue_1.ref)(false);
var isOpen = (0, vue_1.computed)(function () { return internalOpen.value || !!props.open; });
function openCart() { internalOpen.value = true; emit('update:open', true); }
(0, vue_1.watch)(function () { return props.open; }, function (v) { if (typeof v === 'boolean')
    internalOpen.value = !!v; });
/* Store panier */
var cart = (0, useCart_1.useCart)();
/* Helpers de normalisation -> tableau sûr */
function toArray(maybe) {
    var v = (0, vue_1.unref)(maybe);
    if (!v)
        return [];
    if (Array.isArray(v))
        return v;
    if (v instanceof Map)
        return Array.from(v.values());
    if (typeof v === 'object') {
        if (Array.isArray(v.items))
            return v.items;
        var values = Object.values(v);
        if (values.every(function (x) { return typeof x === 'object'; }))
            return values;
        return [];
    }
    if (typeof v === 'string') {
        try {
            var parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch (_a) {
            return [];
        }
    }
    return [];
}
function firstNonEmpty() {
    var lists = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lists[_i] = arguments[_i];
    }
    for (var _a = 0, lists_1 = lists; _a < lists_1.length; _a++) {
        var l = lists_1[_a];
        if (l && l.length)
            return l;
    }
    return [];
}
/* Sélecteurs */
var items = (0, vue_1.computed)(function () {
    var _a;
    var candidates = [
        toArray(cart.items),
        toArray(cart.cartItems),
        toArray((_a = cart.value) === null || _a === void 0 ? void 0 : _a.items),
        toArray(cart.value),
    ];
    return firstNonEmpty.apply(void 0, candidates);
});
var count = (0, vue_1.computed)(function () {
    return items.value.reduce(function (n, it) { return n + (Number(it.quantity) || 0); }, 0);
});
var subtotal = (0, vue_1.computed)(function () {
    return items.value.reduce(function (s, it) { return s + (Number(it.quantity) || 0) * (Number(it.price) || 0); }, 0);
});
var fallbackImg = '/assets/img/default-product.jpg';
/* Actions overlay */
function close() { closeCart(); } // alias pour @click
/* Actions ligne */
function lineTotal(it) {
    return (Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1);
}
function setQty(it, q) {
    var newQ = Math.max(1, Math.min(Number(q) || 1, 999));
    if (typeof cart.updateQuantity === 'function') {
        cart.updateQuantity(it.productId, it.size, newQ);
    }
    else if (typeof cart.updateItem === 'function') {
        cart.updateItem(__assign(__assign({}, it), { quantity: newQ }));
    }
    else if (Array.isArray(cart.items)) {
        var idx = cart.items.findIndex(function (x) { return x.productId === it.productId && x.size === it.size; });
        if (idx >= 0)
            cart.items[idx].quantity = newQ;
    }
    else {
        it.quantity = newQ;
    }
}
function inc(it) { setQty(it, (Number(it.quantity) || 1) + 1); }
function dec(it) { setQty(it, (Number(it.quantity) || 1) - 1); }
function remove(it) {
    if (typeof cart.removeItem === 'function') {
        cart.removeItem(it.productId, it.size);
    }
    else if (typeof cart.remove === 'function') {
        cart.remove(it);
    }
    else if (Array.isArray(cart.items)) {
        cart.items = cart.items.filter(function (x) {
            return !(x.productId === it.productId && x.size === it.size);
        });
    }
}
function clearCart() {
    if (typeof cart.clear === 'function')
        cart.clear();
    else if (typeof cart.reset === 'function')
        cart.reset();
    else if (Array.isArray(cart.items))
        cart.items = [];
}
/* Libellés */
function stockLabel(s) {
    if (s === 'inStock')
        return t('shop.stock.inStock') || 'En stock';
    if (s === 'lowStock')
        return t('shop.stock.lowStock') || 'Bientôt épuisé';
    return t('shop.stock.outOfStock') || 'Épuisé';
}
/* Auto-ouverture après ajout (0 -> >0) */
var lastCount = 0;
(0, vue_1.watch)(count, function (c) {
    if (lastCount === 0 && c > 0)
        openCart();
    lastCount = c;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.openCart();
    } }, { type: "button" }), { class: "\u0021\u0066\u0069\u0078\u0065\u0064\u0020\u006c\u0065\u0066\u0074\u002d\u0061\u0075\u0074\u006f\u0020\u0072\u0069\u0067\u0068\u0074\u002d\u0034\u0020\u0062\u006f\u0074\u0074\u006f\u006d\u002d\u0034\u0020\u006d\u0064\u003a\u0072\u0069\u0067\u0068\u0074\u002d\u0036\u0020\u006d\u0064\u003a\u0062\u006f\u0074\u0074\u006f\u006d\u002d\u0036\u0020\u007a\u002d\u005b\u0031\u0030\u0030\u005d\u0020\u0072\u0065\u006c\u0061\u0074\u0069\u0076\u0065\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0077\u002d\u0031\u0034\u0020\u0068\u002d\u0031\u0034\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0073\u0068\u0061\u0064\u006f\u0077\u002d\u0078\u006c\u0020\u0062\u0067\u002d\u0070\u0072\u0069\u006d\u0061\u0072\u0079\u0020\u0062\u0061\u0063\u006b\u0064\u0072\u006f\u0070\u002d\u0062\u006c\u0075\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0069\u006e\u006c\u0069\u006e\u0065\u002d\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0068\u006f\u0076\u0065\u0072\u003a\u0062\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u0020\u0074\u0065\u0078\u0074\u002d\u0064\u0061\u0072\u006b\u0020\u0074\u0072\u0061\u006e\u0073\u0069\u0074\u0069\u006f\u006e\u0020\u0070\u006f\u0069\u006e\u0074\u0065\u0072\u002d\u0065\u0076\u0065\u006e\u0074\u0073\u002d\u0061\u0075\u0074\u006f" }), { 'aria-label': (__VLS_ctx.t('cart.open', 1) || 'Ouvrir le panier') }));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (!__VLS_ctx.isOpen) }), null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-6 h-6 text-light" }), { viewBox: "0 0 24 24", fill: "currentColor", 'aria-hidden': "true" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 10 19h9v-2h-9l1.1-2h7.45a2 2 0 0 0 1.8-1.12L22 8H7.42l-.7-1.4L7 4z",
});
if (__VLS_ctx.count > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u002d\u0074\u006f\u0070\u002d\u0031\u0020\u002d\u0072\u0069\u0067\u0068\u0074\u002d\u0031\u0020\u006d\u0069\u006e\u002d\u0077\u002d\u0035\u0020\u0068\u002d\u0035\u0020\u0070\u0078\u002d\u0031\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0066\u0075\u006c\u006c\u0020\u0074\u0065\u0078\u0074\u002d\u005b\u0031\u0031\u0070\u0078\u005d\u0020\u0066\u006f\u006e\u0074\u002d\u0062\u006f\u006c\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0062\u0067\u002d\u0065\u0072\u0072\u006f\u0072\u0020\u0066\u006c\u0065\u0078\u0020\u0069\u0074\u0065\u006d\u0073\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u006a\u0075\u0073\u0074\u0069\u0066\u0079\u002d\u0063\u0065\u006e\u0074\u0065\u0072\u0020\u0072\u0069\u006e\u0067\u002d\u0032\u0020\u0072\u0069\u006e\u0067\u002d\u0064\u0061\u0072\u006b" }, { 'aria-label': ("".concat(__VLS_ctx.count, " ").concat(__VLS_ctx.t('cart.items') || 'articles')) }));
    (__VLS_ctx.count);
}
var __VLS_3;
var __VLS_4 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "body",
}));
var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([{
        to: "body",
    }], __VLS_functionalComponentArgsRest(__VLS_5), false));
__VLS_7.slots.default;
var __VLS_8 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    name: "overlay-fade",
    appear: true,
    persisted: true,
}));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
        name: "overlay-fade",
        appear: true,
        persisted: true,
    }], __VLS_functionalComponentArgsRest(__VLS_9), false));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.close();
    } }, { class: "fixed inset-0 z-[8000] bg-black/70" }));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.isOpen) }), null, null);
var __VLS_11;
var __VLS_12 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    name: "slide-right",
    appear: true,
    persisted: true,
}));
var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([{
        name: "slide-right",
        appear: true,
        persisted: true,
    }], __VLS_functionalComponentArgsRest(__VLS_13), false));
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)(__assign({ onClick: function () { } }, { class: "\u0066\u0069\u0078\u0065\u0064\u0020\u0072\u0069\u0067\u0068\u0074\u002d\u0030\u0020\u0074\u006f\u0070\u002d\u0030\u0020\u0068\u002d\u0066\u0075\u006c\u006c\u0020\u0077\u002d\u005b\u0039\u0032\u0025\u005d\u0020\u006d\u0061\u0078\u002d\u0077\u002d\u006d\u0064\u0020\u007a\u002d\u005b\u0039\u0030\u0030\u0030\u005d\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0062\u0067\u002d\u0062\u0061\u0063\u006b\u0067\u0072\u006f\u0075\u006e\u0064\u0044\u0061\u0072\u006b\u0020\u0074\u0065\u0078\u0074\u002d\u006c\u0069\u0067\u0068\u0074\u0020\u0073\u0068\u0061\u0064\u006f\u0077\u002d\u0032\u0078\u006c\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u006c\u002d\u0032\u0078\u006c\u0020\u006f\u0076\u0065\u0072\u0066\u006c\u006f\u0077\u002d\u0068\u0069\u0064\u0064\u0065\u006e\u0020\u0066\u006c\u0065\u0078\u0020\u0066\u006c\u0065\u0078\u002d\u0063\u006f\u006c" }));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.isOpen) }), null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "px-4 py-4 flex items-center justify-between border-b border-white/10" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-9 h-9 rounded-full bg-primary/20 inline-flex items-center justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "w-5 h-5 text-primary" }), { viewBox: "0 0 24 24", fill: "currentColor", 'aria-hidden': "true" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    d: "M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 10 19h9v-2h-9l1.1-2h7.45a2 2 0 0 0 1.8-1.12L22 8H7.42l-.7-1.4L7 4z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-heading" }));
(__VLS_ctx.t('cart.title') || 'Panier');
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.close();
    } }, { class: "w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 inline-flex items-center justify-center" }), { 'aria-label': (__VLS_ctx.t('common.close') || 'Fermer le panier') }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 overflow-y-auto p-4 space-y-3" }));
if (__VLS_ctx.items.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-sm text-gray-300" }));
    (__VLS_ctx.t('cart.empty') || 'Votre panier est vide.');
}
var _loop_1 = function (it, i) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (i) }, { class: "bg-white/5 rounded-xl p-3 ring-1 ring-white/10 flex gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-20 h-20 rounded-lg overflow-hidden bg-black/10 flex-shrink-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: (it.image || __VLS_ctx.fallbackImg), alt: (it.name) }, { class: "w-full h-full object-cover" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 min-w-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-start justify-between gap-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "font-semibold truncate" }));
    (it.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.remove(it);
        } }, { class: "text-sm text-red-400 hover:text-red-300" }));
    (__VLS_ctx.t('cart.remove') || 'Retirer');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-1 flex items-center gap-2" }));
    if (it.size) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "inline-block px-2 py-0.5 text-[11px] rounded border border-white/20 bg-black/20" }));
        (it.size);
    }
    if (it.stockStatus) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: (['inline-block px-2 py-0.5 text-[11px] font-semibold rounded',
                it.stockStatus === 'inStock' ? 'bg-success text-dark'
                    : it.stockStatus === 'lowStock' ? 'bg-warning text-dark'
                        : 'bg-error text-light']) }));
        (__VLS_ctx.stockLabel(it.stockStatus));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2 flex items-center justify-between gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "inline-flex items-center gap-2 bg-black/30 rounded-lg p-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.dec(it);
        } }, { class: "w-7 h-7 rounded-md bg-black/40" }), { 'aria-label': "Diminuer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.setQty(it, it.quantity);
        } }, { type: "number" }), { class: "w-12 bg-transparent text-center outline-none" }), { min: (1), max: (999) }));
    (it.quantity);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.inc(it);
        } }, { class: "w-7 h-7 rounded-md bg-black/40" }), { 'aria-label': "Augmenter" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-right font-semibold" }));
    (__VLS_ctx.lineTotal(it).toFixed(2));
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.items)); _i < _a.length; _i++) {
    var _b = _a[_i], it = _b[0], i = _b[1];
    _loop_1(it, i);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-4 border-t border-white/10 bg-white/5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between mb-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-gray-300" }));
(__VLS_ctx.t('cart.subtotal') || 'Sous-total');
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-lg font-bold" }));
(__VLS_ctx.subtotal.toFixed(2));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('checkout', __spreadArray([], __VLS_ctx.items, true));
    } }, { class: "flex-1 bg-light text-dark font-semibold py-2.5 rounded-lg hover:brightness-95 transition" }), { disabled: (__VLS_ctx.items.length === 0) }));
(__VLS_ctx.t('cart.checkout') || 'Passer au paiement');
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.clearCart();
    } }, { class: "px-3 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-sm" }), { disabled: (__VLS_ctx.items.length === 0) }));
(__VLS_ctx.t('cart.clear') || 'Vider');
var __VLS_15;
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['!fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['left-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:right-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:bottom-6']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[100]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-error']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[8000]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[92%]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[9000]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-l-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['w-9']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/60']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-20']} */ ;
/** @type {__VLS_StyleScopedClasses['h-20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/30']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-7']} */ ;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-7']} */ ;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:brightness-95']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/40']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-black/60']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            t: t,
            emit: emit,
            isOpen: isOpen,
            openCart: openCart,
            items: items,
            count: count,
            subtotal: subtotal,
            fallbackImg: fallbackImg,
            close: close,
            lineTotal: lineTotal,
            setQty: setQty,
            inc: inc,
            dec: dec,
            remove: remove,
            clearCart: clearCart,
            stockLabel: stockLabel,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
