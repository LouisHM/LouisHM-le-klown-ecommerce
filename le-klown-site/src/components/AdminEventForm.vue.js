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
var props = defineProps();
var emit = defineEmits();
// État du formulaire, aligné BDD
var form = (0, vue_1.reactive)({
    id: undefined,
    date: '',
    lieu: '',
    image_url: '',
    billeterie_url: '',
    insta_url: '',
    prix_debut: 0,
    description: '',
    nom: ''
});
var submitting = (0, vue_1.ref)(false);
var error = (0, vue_1.ref)(null);
var v = (0, vue_1.reactive)({});
var isEditing = (0, vue_1.computed)(function () { return form.id !== undefined && form.id !== null; });
function toISODateOnly(val) {
    if (!val)
        return '';
    // si jamais on reçoit un datetime ou une ISO longue, on tronque
    return val.length >= 10 ? val.slice(0, 10) : val;
}
// Pré-remplissage depuis la prop (édition)
(0, vue_1.watch)(function () { return props.event; }, function (e) {
    var _a;
    if (e) {
        Object.assign(form, {
            id: (_a = e.id) !== null && _a !== void 0 ? _a : undefined,
            date: toISODateOnly(e.date || ''),
            lieu: e.lieu || '',
            image_url: e.image_url || '',
            billeterie_url: e.billeterie_url || '',
            insta_url: e.insta_url || '',
            prix_debut: e.prix_debut !== undefined && e.prix_debut !== null ? Number(e.prix_debut) : 0,
            description: e.description || '',
            nom: e.nom || ''
        });
    }
    else {
        reset();
    }
}, { immediate: true });
var isValid = (0, vue_1.computed)(function () {
    v.nom = !form.nom ? 'Le nom est requis.' : undefined;
    v.date = !form.date ? 'La date est requise.' : undefined;
    v.lieu = !form.lieu ? 'Le lieu est requis.' : undefined;
    v.prix_debut = (!isFinite(Number(form.prix_debut)) || Number(form.prix_debut) < 0)
        ? 'Le prix doit être un nombre ≥ 0.'
        : undefined;
    return !v.nom && !v.date && !v.lieu && !v.prix_debut;
});
function reset() {
    Object.assign(form, {
        id: undefined,
        date: '',
        lieu: '',
        image_url: '',
        billeterie_url: '',
        insta_url: '',
        prix_debut: 0,
        description: '',
        nom: ''
    });
    error.value = null;
}
function onSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var payload, q, _a, data, e, _b, e_1, code;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    error.value = null;
                    if (!isValid.value) {
                        error.value = 'Merci de remplir les champs obligatoires (*)';
                        return [2 /*return*/];
                    }
                    submitting.value = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    payload = {
                        date: form.date,
                        lieu: form.lieu,
                        image_url: form.image_url || null,
                        billeterie_url: form.billeterie_url || null,
                        insta_url: form.insta_url || null,
                        prix_debut: Number(form.prix_debut),
                        description: form.description || null,
                        nom: form.nom
                    };
                    q = client_1.supabase.from('evenements');
                    if (!isEditing.value) return [3 /*break*/, 3];
                    return [4 /*yield*/, q.update(payload).eq('id', form.id).select().single()];
                case 2:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, q.insert(payload).select().single()];
                case 4:
                    _b = _c.sent();
                    _c.label = 5;
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
                    e_1 = _c.sent();
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
(__VLS_ctx.isEditing ? (__VLS_ctx.$t('admin.editEvent') || 'Modifier un événement') : (__VLS_ctx.$t('admin.addEvent') || 'Ajouter un événement'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs opacity-70 mt-1" }));
(__VLS_ctx.$t('admin.required') || 'Champs obligatoires');
if (__VLS_ctx.isEditing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/40" }));
    (__VLS_ctx.form.id);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60" }, { required: true, placeholder: "Le KLOWN @ Festival ..." }));
(__VLS_ctx.form.nom);
if (__VLS_ctx.v.nom) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.nom);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "date" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60" }), { required: true }));
(__VLS_ctx.form.date);
if (__VLS_ctx.v.date) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.date);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }, { placeholder: "Ville / salle / festival", required: true }));
(__VLS_ctx.form.lieu);
if (__VLS_ctx.v.lieu) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.lieu);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "number", step: "0.01", min: "0" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary/60" }), { required: true, placeholder: "0.00" }));
(__VLS_ctx.form.prix_debut);
if (__VLS_ctx.v.prix_debut) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-red-300 mt-1" }));
    (__VLS_ctx.v.prix_debut);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "url" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: "https://.../affiche.jpg" }));
(__VLS_ctx.form.image_url);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "url" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: "https://..." }));
(__VLS_ctx.form.billeterie_url);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "url" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: "https://instagram.com/..." }));
(__VLS_ctx.form.insta_url);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "md:col-span-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-sm mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)(__assign(__assign({ value: (__VLS_ctx.form.description), rows: "3" }, { class: "w-full rounded-lg p-2 bg-backgroundDark border border-light/10" }), { placeholder: "Infos complémentaires (horaires, guests, etc.)" }));
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
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-backgroundDark']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-light/10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-1']} */ ;
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
            submitting: submitting,
            error: error,
            v: v,
            isEditing: isEditing,
            isValid: isValid,
            reset: reset,
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
