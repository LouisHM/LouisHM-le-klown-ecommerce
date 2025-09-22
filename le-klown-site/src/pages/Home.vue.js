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
var ContactModal_vue_1 = require("@/components/ContactModal.vue");
var showContact = (0, vue_1.ref)(false);
var showHero = (0, vue_1.ref)(false);
var showScroll = (0, vue_1.ref)(false);
(0, vue_1.onMounted)(function () {
    setTimeout(function () { return showHero.value = true; }, 2000);
    setTimeout(function () { return showScroll.value = true; }, 3000);
});
function scrollToNextSection() {
    var next = document.getElementById('section-1');
    if (next)
        next.scrollIntoView({ behavior: 'smooth' });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-dark text-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: " pt-24 relative min-h-screen flex flex-col justify-center gap-5 w-full overflow-hidden text-light bg-black" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)(__assign({ autoplay: true, muted: true, loop: true, playsinline: true }, { class: "absolute inset-0 w-full h-full object-cover brightness-[0.4]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.source)({
    src: "/assets/videos/show1.mp4",
    type: "video/mp4",
});
(__VLS_ctx.$t('home.errorVideo'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative  z-10 flex flex-col justify-center items-center h-full gap-5 text-center px-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: (__VLS_ctx.showHero ? 'animate-slide-in-left' : 'opacity-0 -translate-x-full') }, { class: "text-5xl md:text-7xl font-heading mb-6 tracking-tight transition-all duration-700" }));
(__VLS_ctx.$t('home.welcome'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: (__VLS_ctx.showHero ? 'animate-slide-in-right  w-full' : 'opacity-0 translate-x-full') }, { class: "text-xl max-w-5xl mb-10 transition-all duration-700 text-xs md:text-xl" }));
(__VLS_ctx.$t('home.intro'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col md:flex-col gap-3 mb-16 " }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showContact = true;
    } }, { class: (__VLS_ctx.showHero ? 'animate-slide-in-right opacity-85' : 'opacity-0 translate-x-full') }), { class: "bg-primary  text-light px-6 py-3 rounded-full font-semibold hover:bg-light hover:text-dark transition-all duration-700" }));
(__VLS_ctx.$t('home.bookMe'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof ContactModal, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(ContactModal_vue_1.default, new ContactModal_vue_1.default(__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showContact) })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showContact) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
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
        __VLS_ctx.showContact = false;
    }
};
var __VLS_2;
var __VLS_7 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
var __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7(__assign(__assign({ to: "/events" }, { class: (__VLS_ctx.showHero ? 'animate-slide-in-left opacity-85' : 'opacity-0 -translate-x-full') }), { class: "hover:bg-light  hover:text-dark px-6 py-3 rounded-full font-semibold bg-dark text-light hover:text-dark transition-all duration-700" })));
var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign(__assign({ to: "/events" }, { class: (__VLS_ctx.showHero ? 'animate-slide-in-left opacity-85' : 'opacity-0 -translate-x-full') }), { class: "hover:bg-light  hover:text-dark px-6 py-3 rounded-full font-semibold bg-dark text-light hover:text-dark transition-all duration-700" })], __VLS_functionalComponentArgsRest(__VLS_8), false));
__VLS_10.slots.default;
(__VLS_ctx.$t('home.seeLive'));
var __VLS_10;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.scrollToNextSection) }, { class: "opacity-0 animate-fade-in text-3xl text-dark bg-light text-primary rounded-full px-3 py-1 hover:text-light hover:bg-dark transition" }));
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.showHero) }), null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "relative group" }, { id: "section-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ src: "/assets/img/leklown1.jpg", alt: "LE KLOWN sur scène" }, { class: "w-full h-[70vh] object-cover grayscale group-hover:grayscale-0 transition duration-700" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center opacity-90 group-hover:opacity-0 transition duration-700" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-5xl md:text-6xl font-heading mb-4" }));
(__VLS_ctx.$t('home.section1Title'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xl md:text-2xl max-w-2xl" }));
(__VLS_ctx.$t('home.section1Text'));
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['brightness-[0.4]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[70vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['grayscale']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:grayscale-0']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            ContactModal: ContactModal_vue_1.default,
            showContact: showContact,
            showHero: showHero,
            scrollToNextSection: scrollToNextSection,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
