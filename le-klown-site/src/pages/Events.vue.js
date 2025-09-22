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
var client_1 = require("@/supabase/client");
var EventCard_vue_1 = require("@/components/EventCard.vue");
var EventModal_vue_1 = require("@/components/EventModal.vue");
var events = (0, vue_1.ref)([]);
var selectedEvent = (0, vue_1.ref)(null);
function fetchEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client_1.supabase
                        .from('evenements')
                        .select('*')
                        .order('date', { ascending: true })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error)
                        events.value = data;
                    else
                        console.error(error);
                    return [2 /*return*/];
            }
        });
    });
}
var now = new Date();
var upcomingEvents = (0, vue_1.computed)(function () {
    return events.value.filter(function (e) { return new Date(e.date) >= now; });
});
var pastEvents = (0, vue_1.computed)(function () {
    return events.value.filter(function (e) { return new Date(e.date) < now; }).reverse();
});
function openModal(event) {
    selectedEvent.value = event;
}
(0, vue_1.onMounted)(fetchEvents);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pt-24 max-w-7xl flex flex-col align-center justify-center px-4 text-light bg-dark mx-auto" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-3xl font-heading text-light uppercase mb-6 text-start" }));
(__VLS_ctx.$t('events.upcoming'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ class: "flex justify-center md:justify-start flex-wrap gap-4 mb-12" }));
var _loop_1 = function (event_1) {
    /** @type {[typeof EventCard, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(EventCard_vue_1.default, new EventCard_vue_1.default(__assign({ 'onClick': {} }, { key: (event_1.id), event: (event_1) })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { key: (event_1.id), event: (event_1) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.openModal(event_1);
        }
    };
};
var __VLS_2;
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.upcomingEvents)); _i < _a.length; _i++) {
    var event_1 = _a[_i][0];
    _loop_1(event_1);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-3xl font-heading text-light uppercase mb-6 text-start" }));
(__VLS_ctx.$t('events.past'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-center md:justify-start flex-wrap gap-4" }));
var _loop_2 = function (event_2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)(__assign({ key: (event_2.id) }, { class: "grayscale opacity-60 hover:opacity-90 transition" }));
    /** @type {[typeof EventCard, ]} */ ;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(EventCard_vue_1.default, new EventCard_vue_1.default(__assign({ 'onClick': {} }, { event: (event_2) })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { event: (event_2) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_10 = void 0;
    var __VLS_11 = void 0;
    var __VLS_12 = void 0;
    var __VLS_13 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.openModal(event_2);
        }
    };
};
var __VLS_9;
for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.pastEvents)); _b < _c.length; _b++) {
    var event_2 = _c[_b][0];
    _loop_2(event_2);
}
if (__VLS_ctx.selectedEvent) {
    /** @type {[typeof EventModal, ]} */ ;
    // @ts-ignore
    var __VLS_14 = __VLS_asFunctionalComponent(EventModal_vue_1.default, new EventModal_vue_1.default(__assign({ 'onClose': {} }, { event: (__VLS_ctx.selectedEvent) })));
    var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { event: (__VLS_ctx.selectedEvent) })], __VLS_functionalComponentArgsRest(__VLS_14), false));
    var __VLS_17 = void 0;
    var __VLS_18 = void 0;
    var __VLS_19 = void 0;
    var __VLS_20 = {
        onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.selectedEvent))
                return;
            __VLS_ctx.selectedEvent = null;
        }
    };
    var __VLS_16;
}
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grayscale']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            EventCard: EventCard_vue_1.default,
            EventModal: EventModal_vue_1.default,
            selectedEvent: selectedEvent,
            upcomingEvents: upcomingEvents,
            pastEvents: pastEvents,
            openModal: openModal,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
