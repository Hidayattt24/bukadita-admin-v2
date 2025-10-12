(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/quiz.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "quizService",
    ()=>quizService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript)");
;
const quizService = {
    // Get sub materi options for dropdown
    getSubMateriOptions: async ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quiz-sub-materis", {
            method: "GET"
        });
    },
    // List quizzes with optional filtering (Admin)
    // Returns: { success: true, data: { quizzes: [...], pagination: {...} } }
    list: async function() {
        let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        const query = new URLSearchParams();
        if (params.sub_materi_id) query.set("sub_materi_id", String(params.sub_materi_id));
        if (params.module_id) query.set("module_id", String(params.module_id));
        if (params.page) query.set("page", String(params.page));
        if (params.limit) query.set("limit", String(params.limit));
        if (params.published !== undefined) query.set("published", String(params.published));
        // Return the response structure that matches backend API documentation
        // The apiFetch should return: { success: true, data: { quizzes: [...] } }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes?".concat(query.toString()), {
            method: "GET"
        });
    },
    // Get single quiz with questions (Admin)
    get: async (id)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes/".concat(encodeURIComponent(String(id))), {
            method: "GET"
        });
    },
    // Create new quiz (Admin)
    create: async (payload)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes", {
            method: "POST",
            body: payload
        });
    },
    // Update quiz (Admin)
    update: async (id, payload)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes/".concat(encodeURIComponent(String(id))), {
            method: "PUT",
            body: payload
        });
    },
    // Delete quiz (Admin)
    remove: async (id)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes/".concat(encodeURIComponent(String(id))), {
            method: "DELETE"
        });
    },
    // Add question to quiz (Admin)
    addQuestion: async (quizId, payload)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quizzes/".concat(encodeURIComponent(String(quizId)), "/questions"), {
            method: "POST",
            body: payload
        });
    },
    // Update question (Admin)
    updateQuestion: async (questionId, payload)=>{
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quiz-questions/".concat(encodeURIComponent(String(questionId))), {
            method: "PUT",
            body: payload
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/quiz-questions/".concat(encodeURIComponent(String(questionId))), {
            method: "PUT",
            body: payload
        });
    },
    // Delete question (Admin)
    removeQuestion: async (questionId)=>{
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/quiz-questions/".concat(encodeURIComponent(String(questionId))), {
            method: "DELETE"
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/quiz-questions/".concat(encodeURIComponent(String(questionId))), {
            method: "DELETE"
        });
    },
    // Submit quiz attempt (for testing/admin preview)
    submitAttempt: async (quizId, answers, startedAt)=>{
        const payload = {
            answers,
            ...startedAt && {
                started_at: startedAt
            }
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/quizzes/".concat(encodeURIComponent(String(quizId)), "/attempts"), {
            method: "POST",
            body: payload
        });
    },
    // Get attempts for a quiz (admin only)
    getAttempts: async function(quizId) {
        let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const query = new URLSearchParams();
        if (params.page) query.set("page", String(params.page));
        if (params.limit) query.set("limit", String(params.limit));
        if (params.user_id) query.set("user_id", String(params.user_id));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/quizzes/".concat(encodeURIComponent(String(quizId)), "/attempts?").concat(query.toString()), {
            method: "GET"
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const colorVariants = {
    blue: {
        text: "text-blue-600",
        icon: "text-blue-600"
    },
    purple: {
        text: "text-purple-600",
        icon: "text-purple-600"
    },
    orange: {
        text: "text-orange-600",
        icon: "text-orange-600"
    },
    green: {
        text: "text-green-600",
        icon: "text-green-600"
    },
    red: {
        text: "text-red-600",
        icon: "text-red-600"
    },
    yellow: {
        text: "text-yellow-600",
        icon: "text-yellow-600"
    }
};
function StatCard(param) {
    let { title, value, icon: Icon, color = "blue", className = "" } = param;
    const colorClasses = colorVariants[color];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 ".concat(className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xl font-bold ".concat(colorClasses.text),
                            children: typeof value === 'number' ? value.toLocaleString() : value
                        }, void 0, false, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "w-8 h-8 ".concat(colorClasses.icon)
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c = StatCard;
var _c;
__turbopack_context__.k.register(_c, "StatCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ModuleManagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript) <export default as ListChecks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/quiz.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$shared$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/shared/StatCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const STORAGE_KEY = "admin_modules";
function ModuleManagement() {
    _s();
    const [modules, setModules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [modulesCounts, setModulesCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Create form state (not using SweetAlert for input)
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [published, setPublished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [durationLabel, setDurationLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [durationMinutes, setDurationMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(""); // keep as string for an input
    const [lessons, setLessons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Edit form state (inline, not using SweetAlert for input)
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [eTitle, setETitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [eDescription, setEDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [ePublished, setEPublished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eDurationLabel, setEDurationLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [eDurationMinutes, setEDurationMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [eLessons, setELessons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [eCategory, setECategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [eSubmitting, setESubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load modules from backend with fallback to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModuleManagement.useEffect": ()=>{
            const load = {
                "ModuleManagement.useEffect.load": async ()=>{
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].list();
                        if (res.ok) {
                            const dataAny = res.data;
                            const items = Array.isArray(dataAny) ? dataAny : dataAny.items || dataAny.data || [];
                            console.log("🛰️ Modules API list():", items);
                            setModules(items);
                            // Fetch real counts for materials and quiz
                            refreshAllCounts(items);
                            // sync to localStorage for sidebar fallback
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                            window.dispatchEvent(new Event('modules:updated'));
                            return;
                        }
                        console.warn("⚠️ Modules API list() failed:", res.error);
                    } catch (e) {
                        console.warn("⚠️ Modules API list() error:", e);
                    }
                    // fallback
                    try {
                        const raw = localStorage.getItem(STORAGE_KEY);
                        if (raw) setModules(JSON.parse(raw));
                        else setModules([]);
                    } catch (e) {
                        setModules([]);
                    }
                }
            }["ModuleManagement.useEffect.load"];
            load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ModuleManagement.useEffect"], []);
    // Save modules to localStorage and notify sidebar
    const saveModules = (next)=>{
        setModules(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('modules:updated'));
        // Refresh counts after module changes (async call, no await to avoid blocking)
        refreshAllCounts(next).catch(console.error);
    };
    // Helpers for numeric nullable
    const toNumOrNull = (v)=>{
        if (v === "" || v === null || v === undefined) return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };
    const resetForm = ()=>{
        setTitle("");
        setDescription("");
        setPublished(false);
        setDurationLabel("");
        setDurationMinutes("");
        setLessons("");
        setCategory("");
    };
    // Helpers
    const parseList = (d)=>{
        const dataAny = d;
        return Array.isArray(dataAny) ? dataAny : dataAny.items || dataAny.data || [];
    };
    // Function to fetch real counts for materials and quiz
    const fetchModuleCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ModuleManagement.useCallback[fetchModuleCounts]": async (moduleId)=>{
            try {
                var _materialsRes_data_items, _materialsRes_data, _quizRes_data, _quizRes_data1, _materialsRes_data1;
                // Fetch materials count
                const materialsRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminMaterialsApi"].list({
                    module_id: moduleId
                });
                const materialsCount = materialsRes.ok ? Array.isArray(materialsRes.data) ? materialsRes.data.length : ((_materialsRes_data = materialsRes.data) === null || _materialsRes_data === void 0 ? void 0 : (_materialsRes_data_items = _materialsRes_data.items) === null || _materialsRes_data_items === void 0 ? void 0 : _materialsRes_data_items.length) || 0 : 0;
                // Fetch quiz count - use the same approach as ModuleItemsPage
                let quizCount = 0;
                // First try direct module_id approach
                const quizRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quizService"].list({
                    module_id: moduleId
                });
                if (quizRes.ok && ((_quizRes_data = quizRes.data) === null || _quizRes_data === void 0 ? void 0 : _quizRes_data.items)) {
                    quizCount = quizRes.data.items.length;
                } else if (quizRes.ok && !((_quizRes_data1 = quizRes.data) === null || _quizRes_data1 === void 0 ? void 0 : _quizRes_data1.items) && materialsRes.ok && ((_materialsRes_data1 = materialsRes.data) === null || _materialsRes_data1 === void 0 ? void 0 : _materialsRes_data1.items)) {
                    // If no direct results, try sub_materi_id approach
                    const allQuizzes = [];
                    for (const material of materialsRes.data.items){
                        const subQuizRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$quiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quizService"].list({
                            sub_materi_id: material.id
                        });
                        if (subQuizRes.ok) {
                            const quizData = subQuizRes.data;
                            const quizDataWithQuizzes = quizData;
                            if (quizData.items) {
                                allQuizzes.push(...quizData.items);
                            } else if (quizDataWithQuizzes.quizzes) {
                                allQuizzes.push(...quizDataWithQuizzes.quizzes);
                            }
                        }
                    }
                    quizCount = allQuizzes.length;
                }
                return {
                    materials: materialsCount,
                    quiz: quizCount
                };
            } catch (error) {
                console.error('Error fetching module counts:', error);
                return {
                    materials: 0,
                    quiz: 0
                };
            }
        }
    }["ModuleManagement.useCallback[fetchModuleCounts]"], []);
    // Function to refresh counts for all modules
    const refreshAllCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ModuleManagement.useCallback[refreshAllCounts]": async (modulesList)=>{
            const countsPromises = modulesList.map({
                "ModuleManagement.useCallback[refreshAllCounts].countsPromises": async (module)=>{
                    const counts = await fetchModuleCounts(module.id);
                    return {
                        id: String(module.id),
                        counts
                    };
                }
            }["ModuleManagement.useCallback[refreshAllCounts].countsPromises"]);
            const results = await Promise.all(countsPromises);
            const newCounts = {};
            results.forEach({
                "ModuleManagement.useCallback[refreshAllCounts]": (param)=>{
                    let { id, counts } = param;
                    newCounts[id] = counts;
                }
            }["ModuleManagement.useCallback[refreshAllCounts]"]);
            setModulesCounts(newCounts);
        }
    }["ModuleManagement.useCallback[refreshAllCounts]"], [
        fetchModuleCounts
    ]);
    const beginEdit = (m)=>{
        setEditingId(m.id);
        setETitle(m.title || "");
        setEDescription(m.description || "");
        setEPublished(!!m.published);
        setEDurationLabel(m.duration_label || "");
        setEDurationMinutes(typeof m.duration_minutes === 'number' && Number.isFinite(m.duration_minutes) ? String(m.duration_minutes) : "");
        setELessons(typeof m.lessons === 'number' && Number.isFinite(m.lessons) ? String(m.lessons) : "");
        setECategory(m.category || "");
    };
    const cancelEdit = ()=>{
        setEditingId(null);
        setETitle("");
        setEDescription("");
        setEPublished(false);
        setEDurationLabel("");
        setEDurationMinutes("");
        setELessons("");
        setECategory("");
        setESubmitting(false);
    };
    const handleCreateSubmit = async (e)=>{
        e.preventDefault();
        if (!title || title.trim().length < 3) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'warning',
                title: 'Judul minimal 3 karakter'
            });
            return;
        }
        const payload = {
            title: title.trim(),
            description: (description !== null && description !== void 0 ? description : '').trim(),
            published: !!published,
            duration_label: (durationLabel === null || durationLabel === void 0 ? void 0 : durationLabel.trim()) || null,
            duration_minutes: toNumOrNull(durationMinutes),
            lessons: toNumOrNull(lessons),
            category: category || null
        };
        setSubmitting(true);
        try {
            const apiRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].create(payload);
            if (apiRes.ok) {
                const listRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].list();
                if (listRes.ok) {
                    const items = parseList(listRes.data);
                    saveModules(items);
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Modul "'.concat(payload.title, '" ditambahkan.'),
                    timer: 1400,
                    showConfirmButton: false
                });
                resetForm();
                setShowForm(false);
            } else {
                const raw = apiRes || {};
                const rawMsg = typeof raw.raw === 'object' && raw.raw && 'message' in raw.raw ? String(raw.raw.message) : undefined;
                const msg = rawMsg || raw.error || 'Gagal menambah modul';
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: msg
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan';
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                title: 'Gagal',
                text: message
            });
        } finally{
            setSubmitting(false);
        }
    };
    const saveEdit = async (m)=>{
        if (!eTitle || eTitle.trim().length < 3) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'warning',
                title: 'Judul minimal 3 karakter'
            });
            return;
        }
        const payload = {
            title: eTitle.trim(),
            description: (eDescription !== null && eDescription !== void 0 ? eDescription : '').trim(),
            published: !!ePublished,
            duration_label: (eDurationLabel === null || eDurationLabel === void 0 ? void 0 : eDurationLabel.trim()) || null,
            duration_minutes: toNumOrNull(eDurationMinutes),
            lessons: toNumOrNull(eLessons),
            category: eCategory || null
        };
        setESubmitting(true);
        try {
            const apiRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].update(m.id, payload);
            if (apiRes.ok) {
                const listRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].list();
                if (listRes.ok) {
                    const items = parseList(listRes.data);
                    saveModules(items);
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'success',
                    title: 'Tersimpan',
                    text: 'Modul "'.concat(payload.title, '" berhasil diupdate.'),
                    timer: 1000,
                    showConfirmButton: false
                });
                cancelEdit();
                return;
            } else {
                console.warn('⚠️ Modules API update() failed:', apiRes.error);
            }
        } catch (e) {
            console.warn('⚠️ Modules API update() error:', e);
        }
    };
    const deleteModule = async (m)=>{
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
            title: 'Hapus Modul?',
            text: 'Modul "'.concat(m.title, '" akan dihapus beserta sub-menu.'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
        if (result.isConfirmed) {
            try {
                const apiRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].remove(m.id);
                if (apiRes.ok) {
                    console.log("✅ Modules API remove():", m.id);
                    const listRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModulesApi"].list();
                    if (listRes.ok) {
                        const items = listRes.data.items || listRes.data.data || [];
                        saveModules(items);
                    }
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'success',
                        title: 'Dihapus',
                        text: 'Modul "'.concat(m.title, '" berhasil dihapus.'),
                        timer: 900,
                        showConfirmButton: false
                    });
                    return;
                } else {
                    console.warn("⚠️ Modules API remove() failed:", apiRes.error);
                }
            } catch (e) {
                console.warn("⚠️ Modules API remove() error:", e);
            }
        }
    };
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ModuleManagement.useMemo[filtered]": ()=>{
            const q = search.trim().toLowerCase();
            let result = modules;
            // Filter berdasarkan pencarian
            if (q) {
                result = result.filter({
                    "ModuleManagement.useMemo[filtered]": (m)=>m.title.toLowerCase().includes(q)
                }["ModuleManagement.useMemo[filtered]"]);
            }
            // Filter berdasarkan status
            if (statusFilter) {
                if (statusFilter === "published") {
                    result = result.filter({
                        "ModuleManagement.useMemo[filtered]": (m)=>m.published === true
                    }["ModuleManagement.useMemo[filtered]"]);
                } else if (statusFilter === "draft") {
                    result = result.filter({
                        "ModuleManagement.useMemo[filtered]": (m)=>m.published !== true
                    }["ModuleManagement.useMemo[filtered]"]);
                }
            }
            return result;
        }
    }["ModuleManagement.useMemo[filtered]"], [
        modules,
        search,
        statusFilter
    ]);
    // Calculate statistics
    const totalModules = modules.length;
    const publishedModules = modules.filter((m)=>m.published === true).length;
    const totalMaterials = Object.values(modulesCounts).reduce((acc, curr)=>acc + curr.materials, 0);
    const totalQuiz = Object.values(modulesCounts).reduce((acc, curr)=>acc + curr.quiz, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-gray-50 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                    className: "w-8 h-8 text-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-gray-900",
                                    children: "Kelola Modul"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 364,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Tambah, ubah, dan hapus modul. Setiap modul memiliki Materi dan Kuis."
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 360,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$shared$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Total Modul",
                        value: totalModules,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"],
                        color: "blue"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$shared$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Modul Aktif",
                        value: publishedModules,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"],
                        color: "green"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 379,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$shared$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Total Materi",
                        value: totalMaterials,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
                        color: "purple"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$shared$2f$StatCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Total Kuis",
                        value: totalQuiz,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__["ListChecks"],
                        color: "orange"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4 items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 406,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: search,
                                            onChange: (e)=>setSearch(e.target.value),
                                            placeholder: "Cari modul...",
                                            className: "pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 407,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 405,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                            className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 417,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: statusFilter,
                                            onChange: (e)=>setStatusFilter(e.target.value),
                                            className: "pl-10 pr-8 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Semua Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "published",
                                                    children: "Terbit"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "draft",
                                                    children: "Draft"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 418,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 416,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowForm((v)=>{
                                    if (v) resetForm();
                                    return !v;
                                }),
                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow ".concat(showForm ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'),
                            type: "button",
                            children: [
                                showForm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 435,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 437,
                                    columnNumber: 15
                                }, this),
                                showForm ? 'Tutup Form' : 'Tambah Modul'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                            lineNumber: 429,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                    lineNumber: 402,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleCreateSubmit,
                className: "bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-gray-900 mb-4",
                        children: "Tambah Modul Baru"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 447,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Judul Modul *"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 450,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: title,
                                        onChange: (e)=>setTitle(e.target.value),
                                        placeholder: "Judul minimal 3 karakter",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                        required: true,
                                        minLength: 3
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 451,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 449,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Deskripsi"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: description,
                                        onChange: (e)=>setDescription(e.target.value),
                                        placeholder: "Opsional",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 462,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 460,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Label Durasi"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: durationLabel,
                                        onChange: (e)=>setDurationLabel(e.target.value),
                                        placeholder: "mis. 4–6 minggu",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 472,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Durasi (menit)"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 0,
                                        value: durationMinutes,
                                        onChange: (e)=>setDurationMinutes(e.target.value),
                                        placeholder: "mis. 120",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 479,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Jumlah Pelajaran"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 492,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 0,
                                        value: lessons,
                                        onChange: (e)=>setLessons(e.target.value),
                                        placeholder: "mis. 10",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 493,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-gray-600",
                                        children: "Kategori"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: category,
                                        onChange: (e)=>setCategory(e.target.value),
                                        placeholder: "mis. Kesehatan Ibu",
                                        className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 503,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 pt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "published",
                                        type: "checkbox",
                                        checked: published,
                                        onChange: (e)=>setPublished(e.target.checked),
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "published",
                                        className: "text-sm text-gray-700",
                                        children: "Terbitkan"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 521,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 513,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 448,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-end justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: submitting,
                                className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow disabled:opacity-60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this),
                                    submitting ? 'Menyimpan...' : 'Simpan Modul'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                lineNumber: 527,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                            lineNumber: 526,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 525,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 446,
                columnNumber: 9
            }, this),
            filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl p-8 text-center text-gray-500 border border-dashed",
                children: 'Belum ada modul. Klik "Tambah Modul" untuk membuat modul pertama.'
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 541,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                children: filtered.map((m)=>{
                    var _modulesCounts_String, _modulesCounts_String1;
                    var _modulesCounts_String_materials, _ref, _ref1, _modulesCounts_String_quiz, _ref2, _ref3;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200",
                        children: editingId === m.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                lineNumber: 552,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-gray-900",
                                                        children: "Ubah Modul"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500",
                                                        children: "Perbarui detail modul lalu simpan perubahan."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                lineNumber: 555,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                        lineNumber: 551,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 550,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Judul Modul *"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: eTitle,
                                                    onChange: (e)=>setETitle(e.target.value),
                                                    placeholder: "Judul minimal 3 karakter",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                    required: true,
                                                    minLength: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 565,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 563,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Deskripsi"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 575,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: eDescription,
                                                    onChange: (e)=>setEDescription(e.target.value),
                                                    placeholder: "Opsional",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 574,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Label Durasi"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 585,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: eDurationLabel,
                                                    onChange: (e)=>setEDurationLabel(e.target.value),
                                                    placeholder: "mis. 4–6 minggu",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 584,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Durasi (menit)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: 0,
                                                    value: eDurationMinutes,
                                                    onChange: (e)=>setEDurationMinutes(e.target.value),
                                                    placeholder: "mis. 120",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 595,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 593,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Jumlah Pelajaran"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: 0,
                                                    value: eLessons,
                                                    onChange: (e)=>setELessons(e.target.value),
                                                    placeholder: "mis. 10",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 605,
                                            columnNumber: 21
                                        }, this),
                                        "                    ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm text-gray-600",
                                                    children: "Kategori"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: eCategory,
                                                    onChange: (e)=>setECategory(e.target.value),
                                                    placeholder: "mis. Kesehatan Ibu",
                                                    className: "w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 615,
                                            columnNumber: 47
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 pt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "published-".concat(m.id),
                                                    type: "checkbox",
                                                    checked: ePublished,
                                                    onChange: (e)=>setEPublished(e.target.checked),
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 626,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "published-".concat(m.id),
                                                    className: "text-sm text-gray-700",
                                                    children: "Terbitkan"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 633,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 625,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 562,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>saveEdit(m),
                                            disabled: eSubmitting,
                                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60",
                                            children: eSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 638,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: cancelEdit,
                                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow",
                                            children: "Batal"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 646,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 637,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                            lineNumber: 549,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white shadow-lg",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 661,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 660,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2 mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "font-bold text-gray-900 text-lg leading-tight",
                                                                    children: m.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 665,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ".concat(m.published ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'),
                                                                    children: m.published ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                className: "w-3 h-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                                lineNumber: 672,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            "Terbit"
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                className: "w-3 h-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                                lineNumber: 677,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            "Draft"
                                                                        ]
                                                                    }, void 0, true)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 666,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                            lineNumber: 664,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mb-2 line-clamp-2",
                                                            children: m.description || 'Tidak ada deskripsi'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                            lineNumber: 683,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-2 mb-3",
                                                            children: [
                                                                m.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                                                            className: "w-3 h-3 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                            lineNumber: 691,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        m.category
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 690,
                                                                    columnNumber: 29
                                                                }, this),
                                                                (m.duration_minutes || m.duration_label) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                            className: "w-3 h-3 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                            lineNumber: 697,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        m.duration_label || "".concat(m.duration_minutes, " menit")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 696,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                            lineNumber: 688,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 663,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 659,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 ml-2",
                                            children: [
                                                editingId !== m.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>beginEdit(m),
                                                    className: "p-2 rounded-lg hover:bg-green-50 transition-colors group",
                                                    title: "Ubah Modul",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "w-4 h-4 text-green-600 group-hover:text-green-700"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteModule(m),
                                                    className: "p-2 rounded-lg hover:bg-red-50 transition-colors group",
                                                    title: "Hapus Modul",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "w-4 h-4 text-red-600 group-hover:text-red-700"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 721,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                    lineNumber: 716,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 706,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 658,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin/modul/".concat(encodeURIComponent(m.id), "/materi"),
                                            className: "group relative rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-lg bg-blue-500 grid place-items-center text-white shadow-md group-hover:bg-blue-600 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 735,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 734,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm font-bold text-gray-900 group-hover:text-blue-700",
                                                                        children: "Materi"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                        lineNumber: 738,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-600",
                                                                        children: "Kelola konten pembelajaran"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                        lineNumber: 739,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 737,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 733,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-blue-600 group-hover:text-blue-700",
                                                                children: (_ref1 = (_ref = (_modulesCounts_String_materials = (_modulesCounts_String = modulesCounts[String(m.id)]) === null || _modulesCounts_String === void 0 ? void 0 : _modulesCounts_String.materials) !== null && _modulesCounts_String_materials !== void 0 ? _modulesCounts_String_materials : m.materiCount) !== null && _ref !== void 0 ? _ref : m.materials_count) !== null && _ref1 !== void 0 ? _ref1 : 0
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500",
                                                                children: "Materi"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 746,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 742,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                lineNumber: 732,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 728,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin/modul/".concat(encodeURIComponent(m.id), "/kuis"),
                                            className: "group relative rounded-xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 hover:border-purple-200 hover:shadow-lg transition-all duration-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-lg bg-purple-500 grid place-items-center text-white shadow-md group-hover:bg-purple-600 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__["ListChecks"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                    lineNumber: 758,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 757,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm font-bold text-gray-900 group-hover:text-purple-700",
                                                                        children: "Kuis"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                        lineNumber: 761,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-600",
                                                                        children: "Evaluasi pembelajaran"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                        lineNumber: 762,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 756,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-purple-600 group-hover:text-purple-700",
                                                                children: (_ref3 = (_ref2 = (_modulesCounts_String_quiz = (_modulesCounts_String1 = modulesCounts[String(m.id)]) === null || _modulesCounts_String1 === void 0 ? void 0 : _modulesCounts_String1.quiz) !== null && _modulesCounts_String_quiz !== void 0 ? _modulesCounts_String_quiz : m.quizCount) !== null && _ref2 !== void 0 ? _ref2 : m.quiz_count) !== null && _ref3 !== void 0 ? _ref3 : 0
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 766,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500",
                                                                children: "Kuis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                                lineNumber: 769,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                        lineNumber: 765,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                                lineNumber: 755,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                            lineNumber: 751,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                                    lineNumber: 727,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, m.id, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                        lineNumber: 547,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
                lineNumber: 545,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
_s(ModuleManagement, "t8+IeHcmtJsmUSoSkcVtkVVHQaQ=");
_c = ModuleManagement;
var _c;
__turbopack_context__.k.register(_c, "ModuleManagement");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/kelola-modul/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KelolaModulPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$ModuleManagementPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/ModuleManagementPage.tsx [app-client] (ecmascript)");
"use client";
;
;
function KelolaModulPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$ModuleManagementPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/kelola-modul/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = KelolaModulPage;
var _c;
__turbopack_context__.k.register(_c, "KelolaModulPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_KULIAH_Pengabdian%20Website%20Posyandu_bukadita_backoffice_src_293f162a._.js.map