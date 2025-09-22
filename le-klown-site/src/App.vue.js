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
var Navbar_vue_1 = require("@/components/Navbar.vue");
var Footer_vue_1 = require("@/components/Footer.vue");
var ContactModal_vue_1 = require("@/components/ContactModal.vue");
var Cart_vue_1 = require("@/components/Cart.vue");
var CheckoutModal_vue_1 = require("@/components/CheckoutModal.vue");
var showContact = (0, vue_1.ref)(false);
var showCart = (0, vue_1.ref)(false);
var showCheckout = (0, vue_1.ref)(false);
var checkoutItems = (0, vue_1.ref)([]);
function openCheckout(items) {
    checkoutItems.value = items;
    showCart.value = false; // close cart so the checkout is visible
    showCheckout.value = true;
}
function onOrderSuccess() {
    checkoutItems.value = [];
    showCheckout.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {[typeof Navbar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(Navbar_vue_1.default, new Navbar_vue_1.default({}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
var __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_4), false));
/** @type {[typeof Footer, ]} */ ;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(Footer_vue_1.default, new Footer_vue_1.default(__assign({ 'onContactClick': {} })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onContactClick': {} })], __VLS_functionalComponentArgsRest(__VLS_7), false));
var __VLS_10;
var __VLS_11;
var __VLS_12;
var __VLS_13 = {
    onContactClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showContact = true;
    }
};
var __VLS_9;
/** @type {[typeof ContactModal, ]} */ ;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(ContactModal_vue_1.default, new ContactModal_vue_1.default(__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showContact) })));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { visible: (__VLS_ctx.showContact) })], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17;
var __VLS_18;
var __VLS_19;
var __VLS_20 = {
    onClose: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showContact = false;
    }
};
var __VLS_16;
/** @type {[typeof Cart, ]} */ ;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent(Cart_vue_1.default, new Cart_vue_1.default(__assign({ 'onCheckout': {} }, { open: (__VLS_ctx.showCart) })));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([__assign({ 'onCheckout': {} }, { open: (__VLS_ctx.showCart) })], __VLS_functionalComponentArgsRest(__VLS_21), false));
var __VLS_24;
var __VLS_25;
var __VLS_26;
var __VLS_27 = {
    onCheckout: (__VLS_ctx.openCheckout)
};
var __VLS_23;
/** @type {[typeof CheckoutModal, ]} */ ;
// @ts-ignore
var __VLS_28 = __VLS_asFunctionalComponent(CheckoutModal_vue_1.default, new CheckoutModal_vue_1.default(__assign(__assign({ 'onClose': {} }, { 'onSuccess': {} }), { visible: (__VLS_ctx.showCheckout), cartItems: (__VLS_ctx.checkoutItems) })));
var __VLS_29 = __VLS_28.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onSuccess': {} }), { visible: (__VLS_ctx.showCheckout), cartItems: (__VLS_ctx.checkoutItems) })], __VLS_functionalComponentArgsRest(__VLS_28), false));
var __VLS_31;
var __VLS_32;
var __VLS_33;
var __VLS_34 = {
    onClose: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showCheckout = false;
    }
};
var __VLS_35 = {
    onSuccess: (__VLS_ctx.onOrderSuccess)
};
var __VLS_30;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            Navbar: Navbar_vue_1.default,
            Footer: Footer_vue_1.default,
            ContactModal: ContactModal_vue_1.default,
            Cart: Cart_vue_1.default,
            CheckoutModal: CheckoutModal_vue_1.default,
            showContact: showContact,
            showCart: showCart,
            showCheckout: showCheckout,
            checkoutItems: checkoutItems,
            openCheckout: openCheckout,
            onOrderSuccess: onOrderSuccess,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
