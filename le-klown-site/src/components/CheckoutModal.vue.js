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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var price_1 = require("@/utils/price");
var t = (0, vue_i18n_1.useI18n)().t;
var props = defineProps();
var emit = defineEmits();
// Constants
var FREE_SHIPPING_THRESHOLD = 25;
var SHIPPING_FEE = 3;
// Form state
var form = (0, vue_1.reactive)({
    lastName: '',
    firstName: '',
    address: '',
    email: '',
    phone: '',
    instagram: '',
    notes: ''
});
var submitting = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)(null);
// Focus on open + lock scroll
var panel = (0, vue_1.ref)(null);
(0, vue_1.watch)(function () { return props.visible; }, function (v) {
    document.documentElement.style.overflow = v ? 'hidden' : '';
    if (v)
        requestAnimationFrame(function () { var _a; return (_a = panel.value) === null || _a === void 0 ? void 0 : _a.focus(); });
});
(0, vue_1.onMounted)(function () {
    var _a;
    if (props.visible)
        (_a = panel.value) === null || _a === void 0 ? void 0 : _a.focus();
});
(0, vue_1.onBeforeUnmount)(function () {
    document.documentElement.style.overflow = '';
});
// Helpers
function priceNum(raw) {
    // keep robust even if helper changes or numeric returns string
    try {
        return Number(price_1.toUnitPriceEUR ? (0, price_1.toUnitPriceEUR)(raw) : Number(raw)) || 0;
    }
    catch (_a) {
        return Number(raw) || 0;
    }
}
function lineTotal(it) {
    return priceNum(it.price) * Math.max(1, Number(it.quantity) || 1);
}
function formatPrice(n) { return n.toFixed(2); }
var subtotal = (0, vue_1.computed)(function () {
    return props.cartItems.reduce(function (s, it) { return s + lineTotal(it); }, 0);
});
var shipping = (0, vue_1.computed)(function () { return (subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE); });
var total = (0, vue_1.computed)(function () { return subtotal.value + shipping.value; });
var isValid = (0, vue_1.computed)(function () {
    return !!form.lastName &&
        !!form.firstName &&
        !!form.email &&
        !!form.address &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
});
// Actions
function onClose() { emit('close'); }
function buildOrderRef() {
    var now = new Date();
    return "KLOWN-".concat(now.getFullYear()).concat(String(now.getMonth() + 1).padStart(2, '0')).concat(String(now.getDate()).padStart(2, '0'), "-").concat(String(now.getHours()).padStart(2, '0')).concat(String(now.getMinutes()).padStart(2, '0')).concat(String(now.getSeconds()).padStart(2, '0'));
}
function submit() {
    return __awaiter(this, void 0, void 0, function () {
        var service_id, template_id, user_id, esc, rows, items_html, orderRef, template_params, res, _a, _b, _c, e_1;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    error.value = null;
                    if (!isValid.value) {
                        error.value = t('form.error') || 'Merci de remplir les champs obligatoires (*) avec un email valide.';
                        return [2 /*return*/];
                    }
                    if (!props.cartItems.length) {
                        error.value = t('cart.empty') || 'Ton panier est vide.';
                        return [2 /*return*/];
                    }
                    service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
                    template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER;
                    user_id = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
                    if (!service_id || !template_id || !user_id) {
                        error.value = 'EmailJS is not configured (missing env vars).';
                        return [2 /*return*/];
                    }
                    esc = function (s) { return String(s !== null && s !== void 0 ? s : '')
                        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
                    rows = props.cartItems.map(function (it) {
                        var qty = Math.max(1, Number(it.quantity) || 1);
                        var price = priceNum(it.price);
                        var line = (qty * price).toFixed(2);
                        var label = "".concat(esc(it.name)).concat(it.size ? ' (' + esc(it.size) + ')' : '', " \u00D7 ").concat(qty);
                        return "<tr>\n      <td style=\"padding:6px 0; color:#111;\">".concat(label, "</td>\n      <td style=\"padding:6px 0;\" align=\"right\">").concat(line, " \u20AC</td>\n    </tr>");
                    }).join('');
                    items_html = "<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"border-collapse:collapse; font-size:14px;\">".concat(rows, "</table>");
                    orderRef = buildOrderRef();
                    template_params = {
                        to_email: form.email, // buyer email for easy reply
                        // meta
                        order_ref: orderRef,
                        now: new Date().toLocaleString('fr-FR'),
                        // totals
                        subtotal_eur: subtotal.value.toFixed(2),
                        shipping_eur: shipping.value.toFixed(2),
                        total_eur: total.value.toFixed(2),
                        shipping_policy_text: 'Expédition sous 2–5 jours ouvrés',
                        free_shipping_threshold_eur: FREE_SHIPPING_THRESHOLD.toFixed(2),
                        // customer
                        customer_firstname: form.firstName,
                        customer_fullname: "".concat(form.firstName, " ").concat(form.lastName).trim(),
                        customer_email: form.email,
                        customer_address: form.address,
                        customer_phone: form.phone || '',
                        customer_instagram: form.instagram || '',
                        // notes
                        order_notes: form.notes || '',
                        // items table (render with triple braces {{{items_html}}} in the template)
                        items_html: items_html
                    };
                    submitting.value = true;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, fetch('https://api.emailjs.com/api/v1.0/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ service_id: service_id, template_id: template_id, user_id: user_id, template_params: template_params })
                        })];
                case 2:
                    res = _e.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    _a = Error.bind;
                    _c = (_b = "EmailJS error: ".concat(res.status, " ")).concat;
                    return [4 /*yield*/, res.text().catch(function () { return ''; })];
                case 3: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_e.sent()])]))();
                case 4:
                    emit('success', { orderRef: orderRef });
                    onClose();
                    return [3 /*break*/, 7];
                case 5:
                    e_1 = _e.sent();
                    console.error(e_1);
                    error.value = t('form.error') || ((_d = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _d !== void 0 ? _d : 'Une erreur est survenue. Réessaie.');
                    return [3 /*break*/, 7];
                case 6:
                    submitting.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: (__VLS_ctx.onClose) }, { onKeydown: (__VLS_ctx.onClose) }), { class: "fixed inset-0 z-[10050] bg-black/70 flex items-end md:items-center justify-center p-0 md:p-6" }), { role: "dialog", 'aria-modal': "true", 'aria-label': (__VLS_ctx.t('checkout.title')) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ onClick: function () { } }, { class: "w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-2xl bg-dark text-light md:rounded-2xl shadow-xl overflow-y-auto outline-none" }), { tabindex: "-1", ref: "panel" }));
    /** @type {typeof __VLS_ctx.panel} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between px-5 py-4 border-b border-light/10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl md:text-2xl font-heading uppercase" }));
    (__VLS_ctx.t('checkout.title'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.onClose) }, { 'aria-label': (__VLS_ctx.t('common.close')) }), { class: "text-2xl hover:text-primary" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-5 md:p-6 space-y-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-backgroundDark/60 rounded-xl p-4 border border-light/10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "font-semibold mb-3" }));
    (__VLS_ctx.t('checkout.cartTitle'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "space-y-2 text-sm" }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.cartItems)); _i < _a.length; _i++) {
        var _b = _a[_i], it = _b[0], i = _b[1];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ key: (i) }, { class: "flex justify-between gap-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "truncate" }));
        (it.name);
        if (it.size) {
            (it.size);
        }
        (it.quantity);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "whitespace-nowrap" }));
        (__VLS_ctx.formatPrice(__VLS_ctx.lineTotal(it)));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "h-px bg-light/10 my-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between text-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('checkout.subtotal'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatPrice(__VLS_ctx.subtotal));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between text-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('checkout.shipping'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatPrice(__VLS_ctx.shipping));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between font-semibold text-lg mt-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('checkout.total'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatPrice(__VLS_ctx.total));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs opacity-70 mt-2" }));
    (__VLS_ctx.t('checkout.freeShippingNote', { amount: __VLS_ctx.formatPrice(__VLS_ctx.FREE_SHIPPING_THRESHOLD) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.submit) }, { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.lastName'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }, { placeholder: (__VLS_ctx.t('checkout.lastName_ph')), required: true }));
    (__VLS_ctx.form.lastName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.firstName'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }, { placeholder: (__VLS_ctx.t('checkout.firstName_ph')), required: true }));
    (__VLS_ctx.form.firstName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.address'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)(__assign(__assign({ value: (__VLS_ctx.form.address), rows: "3" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: (__VLS_ctx.t('checkout.address_ph')), required: true }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.email'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "email" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: (__VLS_ctx.t('checkout.email_ph')), required: true }));
    (__VLS_ctx.form.email);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.phone'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "tel" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: (__VLS_ctx.t('checkout.phone_ph')) }));
    (__VLS_ctx.form.phone);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.instagram'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }, { placeholder: (__VLS_ctx.t('checkout.instagram_ph')) }));
    (__VLS_ctx.form.instagram);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
    (__VLS_ctx.t('checkout.notes'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)(__assign(__assign({ value: (__VLS_ctx.form.notes), rows: "3" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: (__VLS_ctx.t('checkout.notes_ph')) }));
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2 text-red-300 text-sm" }));
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2 flex items-center justify-end gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.onClose) }, { type: "button" }), { class: "px-4 py-2 rounded-xl bg-backgroundDark border border-light/10" }));
    (__VLS_ctx.t('common.cancel'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ type: "submit", disabled: (__VLS_ctx.submitting || !__VLS_ctx.isValid || __VLS_ctx.cartItems.length === 0) }, { class: "px-5 py-2 rounded-xl bg-primary text-dark font-semibold disabled:opacity-60 disabled:cursor-not-allowed" }));
    (__VLS_ctx.submitting ? __VLS_ctx.t('checkout.sending') : __VLS_ctx.t('checkout.confirm'));
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-[10050]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/70']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100dvh]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-h-[85vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark/60']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['my-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            t: t,
            FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD,
            form: form,
            submitting: submitting,
            error: error,
            panel: panel,
            lineTotal: lineTotal,
            formatPrice: formatPrice,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            isValid: isValid,
            onClose: onClose,
            submit: submit,
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
