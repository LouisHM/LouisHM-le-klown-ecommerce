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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var client_1 = require("@/supabase/client");
var TABLE = 'products';
var props = defineProps();
var emit = defineEmits();
var form = (0, vue_1.reactive)({
    id: '', // vide quand nouveau
    name: '',
    description: '',
    price: 0,
    sizes: [],
    stock: 0,
    deleted: false,
    created_at: '',
    has_sizes: false,
    images: []
});
var sizesInput = (0, vue_1.ref)('');
var imagesInput = (0, vue_1.ref)('');
var submitting = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)(null);
var v = (0, vue_1.reactive)({});
var isEditing = (0, vue_1.computed)(function () { return !!form.id; });
var isValid = (0, vue_1.computed)(function () {
    v.name = !form.name ? 'Le nom est requis.' : undefined;
    v.price = (!isFinite(Number(form.price)) || Number(form.price) < 0) ? 'Le prix doit être un nombre ≥ 0.' : undefined;
    var imgs = parseList(imagesInput.value);
    v.images = imgs.length === 0 ? 'Au moins une image est requise.' : undefined;
    v.stock = (form.stock !== undefined && form.stock !== null && Number(form.stock) < 0) ? 'Le stock doit être ≥ 0.' : undefined;
    return !v.name && !v.price && !v.images && !v.stock;
});
(0, vue_1.watch)(function () { return props.product; }, function (p) {
    var _a, _b, _c;
    if (p) {
        Object.assign(form, {
            id: ((_a = p.id) !== null && _a !== void 0 ? _a : ''),
            name: p.name || '',
            description: p.description || '',
            price: Number((_b = p.price) !== null && _b !== void 0 ? _b : 0),
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            stock: Number((_c = p.stock) !== null && _c !== void 0 ? _c : 0),
            deleted: !!p.deleted,
            created_at: p.created_at || '',
            has_sizes: !!p.has_sizes,
            images: Array.isArray(p.images) ? p.images : []
        });
        sizesInput.value = form.sizes.join(',');
        imagesInput.value = form.images.join(',');
    }
    else {
        reset();
    }
}, { immediate: true });
function reset() {
    Object.assign(form, {
        id: '',
        name: '',
        description: '',
        price: 0,
        sizes: [],
        stock: 0,
        deleted: false,
        created_at: '',
        has_sizes: false,
        images: []
    });
    sizesInput.value = '';
    imagesInput.value = '';
    error.value = null;
}
function parseList(input) {
    return input
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
}
function formatDateTime(iso) {
    if (!iso)
        return '';
    try {
        return new Date(iso).toLocaleString('fr-FR');
    }
    catch (_a) {
        return iso;
    }
}
function onSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var payload, q, _a, data, e, _b, e_1, code;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    error.value = null;
                    if (!isValid.value) {
                        error.value = 'Merci de renseigner les champs obligatoires (*)';
                        return [2 /*return*/];
                    }
                    form.sizes = form.has_sizes ? parseList(sizesInput.value) : [];
                    form.images = parseList(imagesInput.value);
                    form.stock = Number((_c = form.stock) !== null && _c !== void 0 ? _c : 0);
                    form.price = Number((_d = form.price) !== null && _d !== void 0 ? _d : 0);
                    submitting.value = true;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 8]);
                    payload = {
                        name: form.name,
                        description: form.description || null,
                        price: Number(form.price),
                        sizes: form.sizes,
                        stock: Number(form.stock),
                        deleted: !!form.deleted,
                        has_sizes: !!form.has_sizes,
                        images: form.images,
                    };
                    q = client_1.supabase.from(TABLE);
                    if (!isEditing.value) return [3 /*break*/, 3];
                    return [4 /*yield*/, q.update(payload).eq('id', form.id).select().single()];
                case 2:
                    _b = _e.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, q.insert(payload).select().single()];
                case 4:
                    _b = _e.sent();
                    _e.label = 5;
                case 5:
                    _a = _b, data = _a.data, e = _a.error;
                    if (e)
                        throw e;
                    if (!data)
                        throw new Error('Aucune donnée retournée.');
                    emit('saved');
                    reset();
                    return [3 /*break*/, 8];
                case 6:
                    e_1 = _e.sent();
                    code = (e_1 === null || e_1 === void 0 ? void 0 : e_1.code) || (e_1 === null || e_1 === void 0 ? void 0 : e_1.status);
                    if (code === 401)
                        error.value = 'Vous devez être connecté.';
                    else if (code === 403)
                        error.value = 'Accès refusé (droits insuffisants).';
                    else
                        error.value = (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || 'Erreur lors de la sauvegarde.';
                    return [3 /*break*/, 8];
                case 7:
                    submitting.value = false;
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.onSubmit) }, { class: "rounded-2xl bg-gray-800 p-5 md:p-6 shadow-xl space-y-5" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-xl font-heading" }));
(__VLS_ctx.isEditing ? (__VLS_ctx.$t('admin.editProduct') || 'Modifier un produit') : (__VLS_ctx.$t('admin.addProduct') || 'Ajouter un produit'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs opacity-70 mt-1" }));
(__VLS_ctx.$t('admin.required') || 'Champs obligatoires');
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40" }));
    (__VLS_ctx.form.id);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60" }, { required: true, placeholder: "T-shirt Le KLOWN" }));
(__VLS_ctx.form.name);
if (__VLS_ctx.v.name) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "number", step: "0.01", min: "0" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60" }), { required: true }));
(__VLS_ctx.form.price);
if (__VLS_ctx.v.price) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.price);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.form.description), rows: "3" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "inline-flex items-center gap-2 text-sm" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "checkbox" }, { class: "rounded accent-primary" }));
(__VLS_ctx.form.has_sizes);
(__VLS_ctx.$t('admin.sizes') || 'Tailles disponibles');
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ disabled: (!__VLS_ctx.form.has_sizes) }, { class: "mt-2 w-full rounded-lg p-2 bg-backgroundDark border border-light/10 disabled:opacity-60" }), { placeholder: "Ex: S,M,L,XL" }));
(__VLS_ctx.sizesInput);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-[11px] opacity-60 mt-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }, { placeholder: "https://.../1.jpg, https://.../2.jpg", required: true }));
(__VLS_ctx.imagesInput);
if (__VLS_ctx.v.images) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.images);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-[11px] opacity-60 mt-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "number", step: "1", min: "0" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: "0" }));
(__VLS_ctx.form.stock);
if (__VLS_ctx.v.stock) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.stock);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ id: "deleted", type: "checkbox" }, { class: "rounded accent-primary" }));
(__VLS_ctx.form.deleted);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "deleted" }, { class: "text-sm" }));
if (__VLS_ctx.form.created_at) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2 text-xs opacity-70" }));
    (__VLS_ctx.formatDateTime(__VLS_ctx.form.created_at));
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-red-300" }));
    (__VLS_ctx.error);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-end gap-3 pt-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.reset) }, { type: "button" }), { class: "px-4 py-2 rounded-xl bg-backgroundDark border border-light/10" }));
(__VLS_ctx.$t('admin.reset') || 'Réinitialiser');
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ type: "submit", disabled: (__VLS_ctx.submitting || !__VLS_ctx.isValid) }, { class: "px-5 py-2 rounded-xl bg-primary text-dark font-semibold disabled:opacity-60 disabled:cursor-not-allowed" }));
(__VLS_ctx.submitting ? (__VLS_ctx.$t('admin.saving') || 'Enregistrement…') : (__VLS_ctx.isEditing ? (__VLS_ctx.$t('admin.save') || 'Enregistrer') : (__VLS_ctx.$t('admin.add') || 'Ajouter')));
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary/40']} */ ;
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
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/60']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary/60']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['accent-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[11px]']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['accent-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-70']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
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
            form: form,
            sizesInput: sizesInput,
            imagesInput: imagesInput,
            submitting: submitting,
            error: error,
            v: v,
            isEditing: isEditing,
            isValid: isValid,
            reset: reset,
            formatDateTime: formatDateTime,
            onSubmit: onSubmit,
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
