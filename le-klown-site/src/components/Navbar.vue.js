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
var vue_router_1 = require("vue-router");
var AuthButton_vue_1 = require("@/components/AuthButton.vue");
var useAuth_1 = require("@/composables/useAuth");
var useCart_1 = require("@/composables/useCart");
var Cart_vue_1 = require("@/components/Cart.vue");
var showCart = (0, vue_1.ref)(false);
var showNavbar = (0, vue_1.ref)(false);
var isScrolled = (0, vue_1.ref)(false);
var items = (0, useCart_1.useCart)().items;
var cartCount = (0, vue_1.computed)(function () { return items.value.reduce(function (sum, i) { return sum + i.quantity; }, 0); });
function handleScroll() {
    var y = window.scrollY;
    isScrolled.value = y > 100;
    showNavbar.value = true;
}
(0, vue_1.onMounted)(function () {
    // Montre la navbar après 2s
    setTimeout(function () {
        showNavbar.value = true;
    }, 800);
    window.addEventListener('scroll', handleScroll);
});
(0, vue_1.onUnmounted)(function () {
    window.removeEventListener('scroll', handleScroll);
});
var isOpen = (0, vue_1.ref)(false);
var langMenu = (0, vue_1.ref)(false);
var locale = (0, vue_i18n_1.useI18n)().locale;
// Définition des liens avec le lien admin
var allLinks = [
    { path: '/', label: 'navbar.home' },
    { path: '/events', label: 'navbar.events' },
    { path: '/shop', label: 'navbar.shop' },
    { path: '/admin', label: 'navbar.admin' },
];
// Lien filtré selon les droits
var filteredLinks = (0, vue_1.computed)(function () {
    return allLinks.filter(function (link) { return link.path !== '/admin' || useAuth_1.role.value === 'admin'; });
});
// Mise à jour du rôle (utilisé au login/logout)
function updateUserRole() {
    (0, useAuth_1.fetchUserRole)();
}
function changeLang(lang) {
    locale.value = lang;
    langMenu.value = false;
}
// Re-fetch automatique au montage (et si besoin à chaque update réactive)
(0, vue_1.watchEffect)(function () {
    (0, useAuth_1.fetchUserRole)();
});
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
(0, vue_1.watchEffect)(function () {
    if (route.path.startsWith('/admin') && useAuth_1.role.value !== 'admin') {
        router.replace('/'); // ou '/'
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)(__assign({ class: ([
        'fixed top-0 left-0 w-full z-50 duration-500 animate-fade-in',
        __VLS_ctx.showNavbar ? 'translate-y-0' : '-translate-y-full',
        __VLS_ctx.isScrolled ? 'bg-dark shadow-md' : '',
        __VLS_ctx.isOpen ? 'bg-dark' : ''
    ]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(__assign({ class: "max-w-7xl mx-auto flex justify-between items-center p-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center text-3xl font-heading tracking-wide" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: "../../public/assets/img/logo-klown.png", alt: "LE KLOWN", width: "50" }, { class: "inline-block mr-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-light text-" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hidden lg:flex justify-center gap-4 text-base flex-1" }));
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.filteredLinks)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    var __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ key: (item.path), to: (item.path) }, { class: "relative px-4 py-1 group" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ key: (item.path), to: (item.path) }, { class: "relative px-4 py-1 group" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    __VLS_3.slots.default;
    (__VLS_ctx.$t(item.label));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "pointer-events-none absolute -top-1 left-0 h-[3px] bg-red-600 transition-all duration-300" }, { class: ({
            'w-full': __VLS_ctx.$route.path === item.path,
            'w-0 group-hover:w-full': __VLS_ctx.$route.path !== item.path
        }) }));
    var __VLS_3;
}
if (__VLS_ctx.showCart) {
    /** @type {[typeof Cart, ]} */ ;
    // @ts-ignore
    var __VLS_4 = __VLS_asFunctionalComponent(Cart_vue_1.default, new Cart_vue_1.default(__assign({ 'onClose': {} })));
    var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign({ 'onClose': {} })], __VLS_functionalComponentArgsRest(__VLS_4), false));
    var __VLS_7 = void 0;
    var __VLS_8 = void 0;
    var __VLS_9 = void 0;
    var __VLS_10 = {
        onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showCart))
                return;
            __VLS_ctx.showCart = false;
        }
    };
    var __VLS_6;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hidden lg:flex items-center gap-4 ml-4" }));
/** @type {[typeof AuthButton, ]} */ ;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(AuthButton_vue_1.default, new AuthButton_vue_1.default(__assign({ 'onAuthChanged': {} })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onAuthChanged': {} })], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14;
var __VLS_15;
var __VLS_16;
var __VLS_17 = {
    onAuthChanged: (__VLS_ctx.updateUserRole)
};
var __VLS_13;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.langMenu = !__VLS_ctx.langMenu;
    } }, { class: "flex items-center px-3 py-1 rounded-full hover:bg-gray-700 transition focus:outline-none text-sm" }));
if (__VLS_ctx.$i18n.locale === 'fr') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 ml-1" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M19 9l-7 7-7-7",
});
if (__VLS_ctx.langMenu) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute right-0 mt-2 bg-dark text-light rounded shadow-md z-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.langMenu))
                return;
            __VLS_ctx.changeLang('fr');
        } }, { class: "block w-full text-center px-4 py-2 hover:bg-gray-700 transition" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.langMenu))
                return;
            __VLS_ctx.changeLang('en');
        } }, { class: "block w-full text-center px-4 py-2 hover:bg-gray-700 transition" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.isOpen = !__VLS_ctx.isOpen;
    } }, { class: "lg:hidden focus:outline-none relative w-8 h-8 z-50 group" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ([
        'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
        __VLS_ctx.isOpen ? 'rotate-45 top-3.5' : 'top-1'
    ]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ([
        'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
        __VLS_ctx.isOpen ? 'opacity-0' : 'top-3.5'
    ]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ([
        'block absolute h-[3px] w-full bg-light transition-all duration-300 ease-in-out',
        __VLS_ctx.isOpen ? '-rotate-45 bottom-3.5' : 'bottom-1'
    ]) }));
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:hidden bg-dark flex flex-col py-6 space-y-4 items-center text-base" }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.filteredLinks)); _b < _c.length; _b++) {
        var item = _c[_b][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (item.path) }, { class: "relative w-full text-center" }));
        var __VLS_18 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(__assign(__assign({ 'onClick': {} }, { to: (item.path) }), { class: "relative px-4 py-2 group inline-block" })));
        var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { to: (item.path) }), { class: "relative px-4 py-2 group inline-block" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
        var __VLS_22 = void 0;
        var __VLS_23 = void 0;
        var __VLS_24 = void 0;
        var __VLS_25 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isOpen))
                    return;
                __VLS_ctx.isOpen = false;
            }
        };
        __VLS_21.slots.default;
        (__VLS_ctx.$t(item.label));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "pointer-events-none absolute -top-1 left-0 h-[3px] bg-red-600 transition-all duration-300" }, { class: ({
                'w-full': __VLS_ctx.$route.path === item.path,
                'w-0 group-hover:w-full': __VLS_ctx.$route.path !== item.path
            }) }));
        var __VLS_21;
    }
    /** @type {[typeof AuthButton, ]} */ ;
    // @ts-ignore
    var __VLS_26 = __VLS_asFunctionalComponent(AuthButton_vue_1.default, new AuthButton_vue_1.default(__assign({ 'onAuthChanged': {} })));
    var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([__assign({ 'onAuthChanged': {} })], __VLS_functionalComponentArgsRest(__VLS_26), false));
    var __VLS_29 = void 0;
    var __VLS_30 = void 0;
    var __VLS_31 = void 0;
    var __VLS_32 = {
        onAuthChanged: (__VLS_ctx.updateUserRole)
    };
    var __VLS_28;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex space-x-4 mt-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isOpen))
                return;
            __VLS_ctx.changeLang('fr');
        } }, { class: "text-xl hover:text-secondary" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isOpen))
                return;
            __VLS_ctx.changeLang('en');
        } }, { class: "text-xl hover:text-secondary" }));
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[3px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-secondary']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            AuthButton: AuthButton_vue_1.default,
            Cart: Cart_vue_1.default,
            showCart: showCart,
            showNavbar: showNavbar,
            isScrolled: isScrolled,
            isOpen: isOpen,
            langMenu: langMenu,
            filteredLinks: filteredLinks,
            updateUserRole: updateUserRole,
            changeLang: changeLang,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
