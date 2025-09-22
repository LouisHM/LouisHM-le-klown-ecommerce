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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_i18n_1 = require("vue-i18n");
var client_1 = require("@/supabase/client");
var EventCard_vue_1 = require("@/components/EventCard.vue");
var AdminEventForm_vue_1 = require("@/components/AdminEventForm.vue");
var AdminProductForm_vue_1 = require("@/components/AdminProductForm.vue");
var EventModal_vue_1 = require("@/components/EventModal.vue");
var useProducts_1 = require("@/composables/useProducts");
// mode d’affichage
var mode = (0, vue_1.ref)('events');
var t = (0, vue_i18n_1.useI18n)().t;
// classes onglets
var activeClass = 'px-4 py-2 rounded-t-lg bg-gray-800 text-light font-semibold';
var inactiveClass = 'px-4 py-2 rounded-t-lg bg-dark border-t border-r border-l border-light hover:bg-gray-700';
// --- ÉVÉNEMENTS ---
var events = (0, vue_1.ref)([]);
var formEvent = (0, vue_1.ref)(null); // ← édition
var modalEvent = (0, vue_1.ref)(null); // ← aperçu (modal)
// fetch events
function fetchEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client_1.supabase
                        .from('evenements')
                        .select('*')
                        .order('date', { ascending: true })];
                case 1:
                    data = (_a.sent()).data;
                    events.value = data || [];
                    return [2 /*return*/];
            }
        });
    });
}
function editEvent(e) {
    formEvent.value = __assign({}, e); // n’ouvre plus la modale
}
function onEventSaved() {
    formEvent.value = null;
    fetchEvents();
}
// --- PRODUITS ---
var _e = (0, useProducts_1.useProducts)(), products = _e.products, fetchProducts = _e.fetchProducts, deleteProduct = _e.deleteProduct;
var selectedProduct = (0, vue_1.ref)(null);
function editProduct(p) {
    selectedProduct.value = __assign({}, p);
}
function onProductSaved() {
    selectedProduct.value = null;
    fetchProducts();
}
// --- DELETE confirmation ---
var showConfirm = (0, vue_1.ref)(false);
var deleteTarget = null;
function confirmDelete(type, id) {
    deleteTarget = { type: type, id: id };
    showConfirm.value = true;
}
function performDelete() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteTarget)
                        return [2 /*return*/];
                    if (!(deleteTarget.type === 'event')) return [3 /*break*/, 2];
                    return [4 /*yield*/, client_1.supabase.from('evenements').delete().eq('id', deleteTarget.id)];
                case 1:
                    _a.sent();
                    fetchEvents();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, deleteProduct(deleteTarget.id)];
                case 3:
                    _a.sent();
                    fetchProducts();
                    _a.label = 4;
                case 4:
                    showConfirm.value = false;
                    deleteTarget = null;
                    return [2 /*return*/];
            }
        });
    });
}
// initialisation
(0, vue_1.onMounted)(function () {
    fetchEvents();
    fetchProducts();
});
// Tris + modal
var now = new Date().getTime();
var upcomingEvents = (0, vue_1.computed)(function () {
    return events.value.filter(function (e) { return new Date(e.date).getTime() >= now; });
});
var pastEvents = (0, vue_1.computed)(function () {
    return events.value.filter(function (e) { return new Date(e.date).getTime() < now; }).reverse();
});
function openModal(event) { modalEvent.value = event; }
// --- Helpers images produits ---
function firstImage(p) {
    var imgs = Array.isArray(p === null || p === void 0 ? void 0 : p.images) ? p.images : [];
    return imgs.find(function (u) { return !!u; }) || null;
}
function onImgError(ev) {
    var el = ev.target;
    el.style.display = 'none';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pt-24 px-4 md:px-10 min-h-screen bg-dark text-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex space-x-4 justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.mode = 'events';
    } }, { class: (__VLS_ctx.mode === 'events' ? __VLS_ctx.activeClass : __VLS_ctx.inactiveClass) }));
(__VLS_ctx.$t('admin.tabEvents'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.mode = 'products';
    } }, { class: (__VLS_ctx.mode === 'products' ? __VLS_ctx.activeClass : __VLS_ctx.inactiveClass) }));
(__VLS_ctx.$t('admin.tabProducts'));
if (__VLS_ctx.mode === 'events') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "space-y-12" }));
    /** @type {[typeof AdminEventForm, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(AdminEventForm_vue_1.default, new AdminEventForm_vue_1.default(__assign(__assign({ 'onSaved': {} }, { key: (((_a = __VLS_ctx.formEvent) === null || _a === void 0 ? void 0 : _a.id) || 'new-event'), event: (__VLS_ctx.formEvent) }), { class: "max-w-3xl mx-auto" })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign(__assign({ 'onSaved': {} }, { key: (((_b = __VLS_ctx.formEvent) === null || _b === void 0 ? void 0 : _b.id) || 'new-event'), event: (__VLS_ctx.formEvent) }), { class: "max-w-3xl mx-auto" })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onSaved: (__VLS_ctx.onEventSaved)
    };
    var __VLS_2;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-3xl font-heading text-light uppercase mb-6 text-start" }));
    (__VLS_ctx.$t('events.upcoming'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "flex justify-center md:justify-start flex-wrap gap-4 mb-12" }));
    var _loop_1 = function (event_1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.openModal(event_1);
            } }, { key: (event_1.id) }), { class: "relative" }));
        /** @type {[typeof EventCard, ]} */ ;
        // @ts-ignore
        var __VLS_7 = __VLS_asFunctionalComponent(EventCard_vue_1.default, new EventCard_vue_1.default(__assign({ event: (event_1) }, { class: "pointer-events-none" })));
        var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ event: (event_1) }, { class: "pointer-events-none" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute top-2 right-2 z-50 flex gap-2 pointer-events-auto" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.editEvent(event_1);
            } }), { class: "px-2 py-1 rounded-md bg-backgroundDark/80 border border-light/20 hover:bg-backgroundDark text-sm" }));
        (__VLS_ctx.$t('admin.edit'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.confirmDelete('event', event_1.id);
            } }), { class: "px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-600 text-light text-sm" }));
        (__VLS_ctx.$t('admin.delete'));
    };
    for (var _i = 0, _f = __VLS_getVForSourceType((__VLS_ctx.upcomingEvents)); _i < _f.length; _i++) {
        var event_1 = _f[_i][0];
        _loop_1(event_1);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-3xl font-heading text-light uppercase mb-6 text-start" }));
    (__VLS_ctx.$t('events.past'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "flex justify-center md:justify-start flex-wrap gap-4" }));
    var _loop_2 = function (event_2) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.openModal(event_2);
            } }, { key: (event_2.id) }), { class: "relative grayscale opacity-60 hover:opacity-90 transition" }));
        /** @type {[typeof EventCard, ]} */ ;
        // @ts-ignore
        var __VLS_10 = __VLS_asFunctionalComponent(EventCard_vue_1.default, new EventCard_vue_1.default(__assign({ event: (event_2) }, { class: "pointer-events-none" })));
        var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ event: (event_2) }, { class: "pointer-events-none" })], __VLS_functionalComponentArgsRest(__VLS_10), false));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute top-2 right-2 z-50 flex gap-2 pointer-events-auto" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.editEvent(event_2);
            } }), { class: "px-2 py-1 rounded-md bg-backgroundDark/80 border border-light/20 hover:bg-backgroundDark text-sm" }));
        (__VLS_ctx.$t('admin.edit'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.confirmDelete('event', event_2.id);
            } }), { class: "px-2 py-1 rounded-md bg-red-600/90 hover:bg-red-600 text-light text-sm" }));
        (__VLS_ctx.$t('admin.delete'));
    };
    for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.pastEvents)); _g < _h.length; _g++) {
        var event_2 = _h[_g][0];
        _loop_2(event_2);
    }
    if (__VLS_ctx.modalEvent) {
        /** @type {[typeof EventModal, ]} */ ;
        // @ts-ignore
        var __VLS_13 = __VLS_asFunctionalComponent(EventModal_vue_1.default, new EventModal_vue_1.default(__assign({ 'onClose': {} }, { event: (__VLS_ctx.modalEvent) })));
        var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { event: (__VLS_ctx.modalEvent) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
        var __VLS_16 = void 0;
        var __VLS_17 = void 0;
        var __VLS_18 = void 0;
        var __VLS_19 = {
            onClose: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.mode === 'events'))
                    return;
                if (!(__VLS_ctx.modalEvent))
                    return;
                __VLS_ctx.modalEvent = null;
            }
        };
        var __VLS_15;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "space-y-12" }));
    /** @type {[typeof AdminProductForm, ]} */ ;
    // @ts-ignore
    var __VLS_20 = __VLS_asFunctionalComponent(AdminProductForm_vue_1.default, new AdminProductForm_vue_1.default(__assign(__assign({ 'onSaved': {} }, { key: (((_c = __VLS_ctx.selectedProduct) === null || _c === void 0 ? void 0 : _c.id) || 'new-product'), product: (__VLS_ctx.selectedProduct) }), { class: "max-w-3xl mx-auto" })));
    var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign(__assign({ 'onSaved': {} }, { key: (((_d = __VLS_ctx.selectedProduct) === null || _d === void 0 ? void 0 : _d.id) || 'new-product'), product: (__VLS_ctx.selectedProduct) }), { class: "max-w-3xl mx-auto" })], __VLS_functionalComponentArgsRest(__VLS_20), false));
    var __VLS_23 = void 0;
    var __VLS_24 = void 0;
    var __VLS_25 = void 0;
    var __VLS_26 = {
        onSaved: (__VLS_ctx.onProductSaved)
    };
    var __VLS_22;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-3xl font-heading text-primary mb-6" }));
    (__VLS_ctx.$t('shop.title'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }));
    var _loop_3 = function (p) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (p.id) }, { class: "bg-gray-800 p-4 rounded-lg flex flex-col border border-light/10" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative aspect-[4/3] bg-backgroundDark rounded-md overflow-hidden" }));
        if (__VLS_ctx.firstImage(p)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign(__assign({ onError: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.mode === 'events'))
                        return;
                    if (!(__VLS_ctx.firstImage(p)))
                        return;
                    __VLS_ctx.onImgError($event);
                } }, { src: (__VLS_ctx.firstImage(p)), alt: "" }), { class: "w-full h-full object-cover" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-full grid place-items-center text-xs opacity-60" }));
            (__VLS_ctx.$t('admin.noImage') || 'Aucune image');
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "mt-3 font-semibold text-lg" }));
        (p.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-gray-400 truncate" }));
        (p.description);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2 flex-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-bold" }));
        ((Number(p.price) || 0).toFixed(2));
        if (p.has_sizes) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "ml-2 text-sm" }));
            (__VLS_ctx.$t('admin.sizes'));
            ((p.sizes || []).join(', '));
        }
        if ((p.images || []).length > 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2 flex gap-2 overflow-x-auto" }));
            for (var _l = 0, _m = __VLS_getVForSourceType((p.images)); _l < _m.length; _l++) {
                var _o = _m[_l], img = _o[0], i = _o[1];
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign(__assign({ key: (i), src: (img) }, { class: "w-12 h-12 rounded-md object-cover border border-light/10" }), { alt: "" }));
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-2 mt-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.editProduct(p);
            } }), { class: "px-3 py-1 text-light border rounded hover:bg-light hover:text-dark transition" }));
        (__VLS_ctx.$t('admin.edit'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onPointerdown: function () { } }, { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.mode === 'events'))
                    return;
                __VLS_ctx.confirmDelete('product', p.id);
            } }), { class: "px-3 py-1 bg-primary text-dark rounded hover:opacity-90 transition" }));
        (__VLS_ctx.$t('admin.delete'));
    };
    for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.products)); _j < _k.length; _j++) {
        var p = _k[_j][0];
        _loop_3(p);
    }
}
if (__VLS_ctx.showConfirm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-light text-dark p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-md" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-2xl font-heading mb-4" }));
    (__VLS_ctx.$t('admin.confirmDelete'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-end space-x-4 mt-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showConfirm))
                return;
            __VLS_ctx.showConfirm = false;
        } }, { class: "px-4 py-2 rounded border border-dark hover:bg-gray-200" }));
    (__VLS_ctx.$t('admin.cancel'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.performDelete) }, { class: "px-4 py-2 rounded bg-red-600 text-light hover:bg-dark" }));
    (__VLS_ctx.$t('admin.confirm'));
}
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:px-10']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-12']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark/80']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600/90']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['grayscale']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark/80']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/20']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600/90']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-12']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[90%]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-dark']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            EventCard: EventCard_vue_1.default,
            AdminEventForm: AdminEventForm_vue_1.default,
            AdminProductForm: AdminProductForm_vue_1.default,
            EventModal: EventModal_vue_1.default,
            mode: mode,
            activeClass: activeClass,
            inactiveClass: inactiveClass,
            formEvent: formEvent,
            modalEvent: modalEvent,
            editEvent: editEvent,
            onEventSaved: onEventSaved,
            products: products,
            selectedProduct: selectedProduct,
            editProduct: editProduct,
            onProductSaved: onProductSaved,
            showConfirm: showConfirm,
            confirmDelete: confirmDelete,
            performDelete: performDelete,
            upcomingEvents: upcomingEvents,
            pastEvents: pastEvents,
            openModal: openModal,
            firstImage: firstImage,
            onImgError: onImgError,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
