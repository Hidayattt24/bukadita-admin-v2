(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/poin-details.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enhancedMaterialService",
    ()=>enhancedMaterialService,
    "poinDetailService",
    ()=>poinDetailService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript)");
;
const poinDetailService = {
    // List poin details for a sub_materi
    list: async function(subMateriId) {
        let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const query = new URLSearchParams();
        if (params.page) query.set("page", String(params.page));
        if (params.limit) query.set("limit", String(params.limit));
        // Add include_drafts parameter
        query.set("include_drafts", "true");
        // Try admin endpoint first with include_drafts
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(subMateriId)), "/poins?").concat(query.toString()), {
            method: "GET"
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular materials endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/sub-materis/".concat(encodeURIComponent(String(subMateriId)), "/poins?").concat(query.toString()), {
            method: "GET"
        });
    },
    // Get single poin detail
    get: async (id)=>{
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/poins/".concat(encodeURIComponent(String(id))), {
            method: "GET"
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/poins/".concat(encodeURIComponent(String(id))), {
            method: "GET"
        });
    },
    // Create new poin detail
    create: async (payload)=>{
        console.log("Creating poin with payload:", payload);
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(payload.sub_materi_id)), "/poins"), {
            method: "POST",
            body: payload
        });
        console.log("Admin result:", adminResult);
        if (!adminResult.ok) {
            console.error("Admin endpoint error:", adminResult.error);
            console.error("Raw response:", JSON.stringify(adminResult.raw, null, 2));
        }
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/poins", {
            method: "POST",
            body: payload
        });
    },
    // Update poin detail
    update: async (id, payload)=>{
        // Filter only valid fields to prevent backend errors with non-existent columns
        const validPayload = {};
        if (payload.title !== undefined) validPayload.title = payload.title;
        if (payload.content_html !== undefined) validPayload.content_html = payload.content_html;
        if (payload.duration_label !== undefined) validPayload.duration_label = payload.duration_label;
        if (payload.order_index !== undefined) validPayload.order_index = payload.order_index;
        if (payload.duration_minutes !== undefined) validPayload.duration_minutes = payload.duration_minutes;
        console.log("Updating poin with ID:", id);
        console.log("Update payload:", validPayload);
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/poins/".concat(encodeURIComponent(String(id))), {
            method: "PUT",
            body: validPayload
        });
        console.log("Update result:", adminResult);
        if (!adminResult.ok) {
            console.error("Update error:", adminResult.error);
            console.error("Raw response:", JSON.stringify(adminResult.raw, null, 2));
        }
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/poins/".concat(encodeURIComponent(String(id))), {
            method: "PUT",
            body: validPayload
        });
    },
    // Delete poin detail
    remove: async (id)=>{
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/poins/".concat(encodeURIComponent(String(id))), {
            method: "DELETE"
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/poins/".concat(encodeURIComponent(String(id))), {
            method: "DELETE"
        });
    },
    // Mark poin as complete (for testing progress flow)
    markComplete: async (poinId, materiId)=>{
        // Try both admin and regular endpoints
        const endpoints = [
            "/api/v1/admin/sub-materis/".concat(materiId, "/points/").concat(poinId, "/complete"),
            "/api/v1/materials/".concat(materiId, "/points/").concat(poinId, "/complete"),
            "/api/v1/admin/points/".concat(poinId, "/complete"),
            "/api/v1/points/".concat(poinId, "/complete")
        ];
        for (const endpoint of endpoints){
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(endpoint, {
                    method: "POST"
                });
                if (result.ok) return result;
            } catch (e) {
                continue;
            }
        }
        // If all fail, return error
        return {
            ok: false,
            status: 404,
            error: "Complete endpoint not found"
        };
    }
};
const enhancedMaterialService = {
    // Get material with poin details - try admin endpoint first, then fallback
    getWithPoins: async (id)=>{
        // Try admin endpoint first with include_drafts and include_media parameters
        const adminResultWithDrafts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(id)), "?include_drafts=true&include_media=true&with_media=true"), {
            method: "GET"
        });
        if (adminResultWithDrafts.ok) {
            return adminResultWithDrafts;
        }
        // Try admin endpoint with media inclusion
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(id)), "?include_media=true&with_media=true"), {
            method: "GET"
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Try regular materials endpoint with admin flag and media inclusion
        const regularWithAdmin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/materials/".concat(encodeURIComponent(String(id)), "?admin=true&include_drafts=true&include_media=true&with_media=true"), {
            method: "GET"
        });
        if (regularWithAdmin.ok) {
            return regularWithAdmin;
        }
        // Try alternative admin endpoint for getting material with poins and media
        const altAdminWithMedia = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(id)), "/with-media"), {
            method: "GET"
        });
        if (altAdminWithMedia.ok) {
            return altAdminWithMedia;
        }
        // Final fallback to regular materials endpoint with media params
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/materials/".concat(encodeURIComponent(String(id)), "?include_media=true"), {
            method: "GET"
        });
    },
    // Update material order index - try admin endpoint first, then fallback
    updateOrder: async (id, order_index)=>{
        // Try admin endpoint first
        const adminResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(id))), {
            method: "PUT",
            body: {
                order_index
            }
        });
        if (adminResult.ok || adminResult.status !== 404 && adminResult.status !== 405) {
            return adminResult;
        }
        // Fallback to regular materials endpoint
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/materials/".concat(encodeURIComponent(String(id))), {
            method: "PUT",
            body: {
                order_index
            }
        });
    },
    // Create poin with media files in one request
    createWithMedia: async (payload)=>{
        const formData = new FormData();
        // Append poin data
        formData.append("title", payload.title);
        formData.append("content_html", payload.content_html);
        if (payload.duration_label) formData.append("duration_label", payload.duration_label);
        if (payload.duration_minutes) formData.append("duration_minutes", String(payload.duration_minutes));
        if (payload.order_index) formData.append("order_index", String(payload.order_index));
        // Append media files
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file)=>{
                formData.append("media", file);
            });
            // Append captions if provided
            if (payload.captions && payload.captions.length > 0) {
                formData.append("captions", JSON.stringify(payload.captions));
            }
        }
        console.log("Creating poin with media, sub_materi_id:", payload.sub_materi_id);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/api/v1/admin/sub-materis/".concat(encodeURIComponent(String(payload.sub_materi_id)), "/poins-with-media"), {
            method: "POST",
            body: formData
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MaterialPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function MaterialPreview(param) {
    let { poins, materialTitle } = param;
    _s();
    const [imageErrors, setImageErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const getPoinMedia = (poin)=>{
        return poin.poin_media || [];
    };
    // Process HTML content with media placeholders
    const processContentWithMedia = (html, media)=>{
        if (!html) return {
            processedHtml: '',
            hasMedia: false
        };
        let processedHtml = html;
        let hasMediaPlaceholders = false;
        // First, try to find and replace media placeholders by matching media ID
        media.forEach((mediaItem)=>{
            // Try with media ID first (for new content)
            const mediaIdPlaceholderPattern = new RegExp("\\[MEDIA_PLACEHOLDER_".concat(mediaItem.id, "\\]"), 'g');
            const mediaIdDivPattern = new RegExp('<div[^>]*data-block-id="'.concat(mediaItem.id, '"[^>]*>\\[MEDIA_PLACEHOLDER_').concat(mediaItem.id, "\\]</div>"), 'g');
            if (processedHtml.includes("MEDIA_PLACEHOLDER_".concat(mediaItem.id))) {
                hasMediaPlaceholders = true;
                const mediaHtml = generateMediaHtml(mediaItem);
                processedHtml = processedHtml.replace(mediaIdDivPattern, mediaHtml);
                processedHtml = processedHtml.replace(mediaIdPlaceholderPattern, mediaHtml);
            }
        });
        // If no placeholders found with media IDs, try to find any MEDIA_PLACEHOLDER and match by order
        if (!hasMediaPlaceholders) {
            const placeholderMatches = [
                ...processedHtml.matchAll(/<div[^>]*data-block-type="media"[^>]*data-block-order="(\d+)"[^>]*>\[MEDIA_PLACEHOLDER_([^\]]+)\]<\/div>/g)
            ];
            if (placeholderMatches.length > 0) {
                hasMediaPlaceholders = true;
                // Sort placeholders by order and media by created_at (to maintain input order)
                const sortedMedia = [
                    ...media
                ].sort((a, b)=>{
                    if (a.created_at && b.created_at) {
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    }
                    return 0; // Keep original order if no created_at
                });
                placeholderMatches.sort((a, b)=>parseInt(a[1]) - parseInt(b[1])) // Sort by data-block-order
                .forEach((match, index)=>{
                    if (sortedMedia[index]) {
                        const mediaHtml = generateMediaHtml(sortedMedia[index]);
                        processedHtml = processedHtml.replace(match[0], mediaHtml);
                    }
                });
            }
        }
        // If still no placeholders found, try to find any MEDIA_PLACEHOLDER and replace sequentially
        if (!hasMediaPlaceholders) {
            const anyPlaceholderPattern = /\[MEDIA_PLACEHOLDER_[^\]]+\]/g;
            const placeholderMatches = processedHtml.match(anyPlaceholderPattern);
            if (placeholderMatches && placeholderMatches.length > 0) {
                hasMediaPlaceholders = true;
                // Sort media by created_at to maintain input order
                const sortedMedia = [
                    ...media
                ].sort((a, b)=>{
                    if (a.created_at && b.created_at) {
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    }
                    return 0;
                });
                placeholderMatches.forEach((placeholder, index)=>{
                    if (sortedMedia[index]) {
                        const mediaHtml = generateMediaHtml(sortedMedia[index]);
                        processedHtml = processedHtml.replace(placeholder, mediaHtml);
                    }
                });
            }
        }
        return {
            processedHtml,
            hasMedia: hasMediaPlaceholders || media.length > 0
        };
    };
    const generateMediaHtml = (media)=>{
        const mimeType = media.mime_type;
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/')) {
            return '\n        <div class="my-4">\n          <div class="relative">\n            <img \n              src="'.concat(media.file_url, '" \n              alt="').concat(media.caption || 'Gambar', '"\n              class="w-full max-w-3xl rounded-lg shadow-sm"\n              loading="lazy"\n              style="display: none;"\n              onload="this.style.display=\'block\'; this.nextElementSibling.style.display=\'none\';"\n              onerror="this.style.display=\'none\'; this.nextElementSibling.innerHTML=\'<div class=&quot;bg-gray-100 rounded-lg flex items-center justify-center h-32&quot;><div class=&quot;text-center text-gray-500&quot;><p class=&quot;text-sm&quot;>Gambar tidak dapat dimuat</p></div></div>\';"\n            />\n            <div class="bg-gray-50 rounded-lg flex items-center justify-center h-32">\n              <div class="text-center text-gray-500">\n                <div class="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>\n                <p class="text-sm">Memuat gambar...</p>\n              </div>\n            </div>\n          </div>\n          ').concat(media.caption ? '<p class="text-sm text-gray-600 mt-2 italic">'.concat(media.caption, "</p>") : '', "\n        </div>\n      ");
        }
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/')) {
            return '\n        <div class="my-4">\n          <video src="'.concat(media.file_url, '" controls class="w-full max-w-3xl rounded-lg shadow-sm" preload="metadata">\n            Browser tidak mendukung video.\n          </video>\n          ').concat(media.caption ? '<p class="text-sm text-gray-600 mt-2 italic">'.concat(media.caption, "</p>") : '', "\n        </div>\n      ");
        }
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('audio/')) {
            return '\n        <div class="my-4">\n          <audio src="'.concat(media.file_url, '" controls class="w-full max-w-md" preload="metadata">Browser tidak mendukung audio.</audio>\n          ').concat(media.caption ? '<p class="text-sm text-gray-600 mt-2 italic">'.concat(media.caption, "</p>") : '', "\n        </div>\n      ");
        }
        // Other file types
        return '\n      <div class="my-4">\n        <a href="'.concat(media.file_url, '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">\n          ').concat(mimeType === 'application/pdf' ? 'Buka PDF' : 'Download File', "\n        </a>\n        ").concat(media.caption ? '<p class="text-sm text-gray-600 mt-2 italic">'.concat(media.caption, "</p>") : '', "\n      </div>\n    ");
    };
    const renderMediaItem = (media)=>{
        const mimeType = media.mime_type;
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/')) {
            if (imageErrors.has(media.id)) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center h-32",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                className: "w-8 h-8 mx-auto mb-2"
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "Gambar tidak dapat dimuat"
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                lineNumber: 171,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 169,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                    lineNumber: 168,
                    columnNumber: 11
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: media.file_url,
                        alt: media.caption || 'Gambar',
                        width: 800,
                        height: 600,
                        className: "w-full max-w-3xl rounded-lg shadow-sm",
                        unoptimized: true,
                        onError: ()=>setImageErrors((prev)=>new Set(prev).add(media.id)),
                        onLoad: ()=>{
                            setImageErrors((prev)=>{
                                const newSet = new Set(prev);
                                newSet.delete(media.id);
                                return newSet;
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    media.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-2 italic",
                        children: media.caption
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 195,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this);
        }
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        src: media.file_url,
                        controls: true,
                        className: "w-full max-w-3xl rounded-lg shadow-sm",
                        preload: "metadata",
                        children: "Browser tidak mendukung video."
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    media.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-2 italic",
                        children: media.caption
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 206,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 202,
                columnNumber: 9
            }, this);
        }
        if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('audio/')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                        src: media.file_url,
                        controls: true,
                        className: "w-full max-w-md",
                        preload: "metadata",
                        children: "Browser tidak mendukung audio."
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this),
                    media.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-2 italic",
                        children: media.caption
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 215,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: media.file_url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this),
                        mimeType === 'application/pdf' ? 'Buka PDF' : 'Download File'
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this),
                media.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 mt-2 italic",
                    children: media.caption
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                    lineNumber: 226,
                    columnNumber: 27
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
            lineNumber: 221,
            columnNumber: 7
        }, this);
    };
    const sortedPoins = [
        ...poins
    ].sort((a, b)=>(a.order_index || 0) - (b.order_index || 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl shadow-sm border border-gray-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-gray-900",
                        children: [
                            "Preview: ",
                            materialTitle
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-1",
                        children: [
                            poins.length,
                            " poin pembelajaran tersedia"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "divide-y divide-gray-200",
                children: sortedPoins.map((poin, index)=>{
                    const media = getPoinMedia(poin);
                    const { processedHtml, hasMedia } = processContentWithMedia(poin.content_html, media);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900",
                                            children: [
                                                index + 1,
                                                ". ",
                                                poin.title
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 249,
                                            columnNumber: 19
                                        }, this),
                                        poin.duration_label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium",
                                            children: poin.duration_label
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 250,
                                            columnNumber: 44
                                        }, this),
                                        poin.duration_minutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full",
                                            children: [
                                                poin.duration_minutes,
                                                " menit"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 251,
                                            columnNumber: 46
                                        }, this),
                                        hasMedia && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium",
                                            children: [
                                                "📎 ",
                                                media.length,
                                                " Media"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 252,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                    lineNumber: 248,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                lineNumber: 247,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "prose prose-sm max-w-none text-gray-700",
                                children: processedHtml && processedHtml !== poin.content_html ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    dangerouslySetInnerHTML: {
                                        __html: processedHtml
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                    lineNumber: 259,
                                    columnNumber: 19
                                }, this) : // Fallback: show original content + media inline (no separate section header)
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            dangerouslySetInnerHTML: {
                                                __html: poin.content_html || '<p>Konten kosong</p>'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 263,
                                            columnNumber: 21
                                        }, this),
                                        media.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 mt-6",
                                            children: [
                                                ...media
                                            ].sort((a, b)=>{
                                                if (a.created_at && b.created_at) {
                                                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                                                }
                                                return 0;
                                            }).map((mediaItem)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "my-4",
                                                    children: renderMediaItem(mediaItem)
                                                }, mediaItem.id, false, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 29
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                            lineNumber: 265,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                                lineNumber: 256,
                                columnNumber: 15
                            }, this)
                        ]
                    }, poin.id, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 246,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            poins.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-12 text-center text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        className: "w-16 h-16 mx-auto mb-4 text-gray-300"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-medium",
                        children: "Belum ada poin untuk ditampilkan"
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: 'Tambahkan poin di tab "Kelola Poin" terlebih dahulu'
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
_s(MaterialPreview, "ziridM/f+aOiC+mlp4ZoPQMpkg8=");
_c = MaterialPreview;
var _c;
__turbopack_context__.k.register(_c, "MaterialPreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MaterialPoinManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/poin-details.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$MaterialPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPreview.tsx [app-client] (ecmascript)");
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
function MaterialPoinManager(param) {
    let { materialId } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [material, setMaterial] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [poins, setPoins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showAddPoin, setShowAddPoin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEditPoin, setShowEditPoin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingPoin, setEditingPoin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imageErrors, setImageErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Add/Edit poin form state
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [durationLabel, setDurationLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [durationMinutes, setDurationMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [contentBlocks, setContentBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: '1',
            type: 'text',
            order: 0,
            content: ''
        }
    ]);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [existingMedia, setExistingMedia] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mediaToDelete, setMediaToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Tab state
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('manage');
    // Helper function to load individual poin with media
    const loadPoinWithMedia = async (poinId)=>{
        try {
            const { apiFetch } = await __turbopack_context__.A("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript, async loader)");
            const res = await apiFetch("/api/v1/admin/poins/".concat(encodeURIComponent(String(poinId))), {
                method: "GET"
            });
            if (res.ok) {
                // Backend now includes media by default, but if not present, get from direct endpoint
                if (!res.data.poin_media || res.data.poin_media.length === 0) {
                    try {
                        const mediaRes = await apiFetch("/api/v1/admin/poins/".concat(encodeURIComponent(String(poinId)), "/media"), {
                            method: "GET"
                        });
                        if (mediaRes.ok && mediaRes.data) {
                            res.data.poin_media = mediaRes.data;
                        }
                    } catch (mediaError) {
                        console.warn('Failed to fetch media from direct endpoint:', mediaError);
                    }
                }
                return res.data;
            } else {
                console.error('Failed to load poin with media:', res);
                return null;
            }
        } catch (error) {
            console.error('Error loading poin with media:', error);
            return null;
        }
    };
    // Helper function to get media from poin (backend now consistently uses poin_media)
    const getPoinMedia = (poin)=>{
        return poin.poin_media || [];
    };
    // Block editor functions
    const addTextBlock = ()=>{
        const newBlock = {
            id: Date.now().toString(),
            type: 'text',
            order: contentBlocks.length,
            content: ''
        };
        setContentBlocks([
            ...contentBlocks,
            newBlock
        ]);
    };
    const addMediaBlock = ()=>{
        const newBlock = {
            id: Date.now().toString(),
            type: 'media',
            order: contentBlocks.length,
            caption: ''
        };
        setContentBlocks([
            ...contentBlocks,
            newBlock
        ]);
    };
    const updateTextBlock = (blockId, content)=>{
        setContentBlocks((blocks)=>blocks.map((block)=>block.id === blockId ? {
                    ...block,
                    content
                } : block));
    };
    const updateMediaBlock = function(blockId, file) {
        let caption = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setContentBlocks((blocks)=>blocks.map((block)=>block.id === blockId ? {
                    ...block,
                    file,
                    caption,
                    preview: previewUrl
                } : block));
    };
    const removeBlock = (blockId)=>{
        setContentBlocks((blocks)=>{
            const filtered = blocks.filter((block)=>block.id !== blockId);
            // Reorder remaining blocks
            return filtered.map((block, index)=>({
                    ...block,
                    order: index
                }));
        });
    };
    const moveBlock = (blockId, direction)=>{
        setContentBlocks((blocks)=>{
            const index = blocks.findIndex((b)=>b.id === blockId);
            if (direction === 'up' && index === 0 || direction === 'down' && index === blocks.length - 1) {
                return blocks;
            }
            const newBlocks = [
                ...blocks
            ];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            // Swap elements
            [newBlocks[index], newBlocks[newIndex]] = [
                newBlocks[newIndex],
                newBlocks[index]
            ];
            // Update order indices
            return newBlocks.map((block, idx)=>({
                    ...block,
                    order: idx
                }));
        });
    };
    // Convert blocks to HTML for backend storage
    const convertBlocksToHTML = ()=>{
        return contentBlocks.sort((a, b)=>a.order - b.order) // Ensure correct order
        .map((block)=>{
            var _block_content;
            if (block.type === 'text' && ((_block_content = block.content) === null || _block_content === void 0 ? void 0 : _block_content.trim())) {
                return '<div data-block-id="'.concat(block.id, '" data-block-type="text" data-block-order="').concat(block.order, '">').concat(block.content, "</div>");
            } else if (block.type === 'media') {
                // Create placeholder for media that will be replaced during preview
                return '<div data-block-id="'.concat(block.id, '" data-block-type="media" data-block-order="').concat(block.order, '" data-media-caption="').concat(block.caption || '', '" class="media-placeholder">[MEDIA_PLACEHOLDER_').concat(block.id, "]</div>");
            }
            return '';
        }).filter((html)=>html.trim()).join('\n\n');
    };
    // Get media files from blocks for upload
    const getBlockMediaFiles = ()=>{
        return contentBlocks.filter((block)=>block.type === 'media' && block.file).map((block)=>({
                file: block.file,
                caption: block.caption || '',
                blockId: block.id,
                order: block.order
            }));
    };
    // Update HTML content to replace block IDs with actual media IDs after upload
    const updateHtmlWithMediaIds = (html, mediaMapping)=>{
        let updatedHtml = html;
        Object.entries(mediaMapping).forEach((param)=>{
            let [blockId, mediaId] = param;
            // Update both placeholder text and div attributes
            updatedHtml = updatedHtml.replace(new RegExp("\\[MEDIA_PLACEHOLDER_".concat(blockId, "\\]"), 'g'), "[MEDIA_PLACEHOLDER_".concat(mediaId, "]"));
            updatedHtml = updatedHtml.replace(new RegExp('data-block-id="'.concat(blockId, '"'), 'g'), 'data-block-id="'.concat(mediaId, '"'));
        });
        return updatedHtml;
    };
    // Parse existing HTML content back to blocks (for editing)
    const parseHTMLToBlocks = function(html) {
        let media = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        const blocks = [];
        if (html) {
            // Split by double newlines to get individual block parts
            const parts = html.split('\n\n').filter((part)=>part.trim());
            parts.forEach((part)=>{
                // Check if this is a media placeholder
                if (part.includes('data-block-type="media"') && part.includes('MEDIA_PLACEHOLDER_')) {
                    // Extract media block info from placeholder
                    const blockIdMatch = part.match(/data-block-id="([^"]+)"/);
                    const orderMatch = part.match(/data-block-order="([^"]+)"/);
                    const captionMatch = part.match(/data-media-caption="([^"]*)"/);
                    const placeholderMatch = part.match(/\[MEDIA_PLACEHOLDER_([^\]]+)\]/);
                    if (blockIdMatch && placeholderMatch) {
                        const blockId = blockIdMatch[1];
                        const order = orderMatch ? parseInt(orderMatch[1]) : blocks.length;
                        const caption = captionMatch ? captionMatch[1] : '';
                        // Try to find matching media item
                        const mediaItem = media.find((m)=>m.id === blockId || part.includes("MEDIA_PLACEHOLDER_".concat(m.id)));
                        blocks.push({
                            id: blockId,
                            type: 'media',
                            order: order,
                            caption: caption,
                            preview: mediaItem === null || mediaItem === void 0 ? void 0 : mediaItem.file_url
                        });
                    }
                } else if (part.includes('data-block-type="text"') || !part.includes('data-block-type=')) {
                    // This is a text block
                    const blockIdMatch = part.match(/data-block-id="([^"]+)"/);
                    const orderMatch = part.match(/data-block-order="([^"]+)"/);
                    const blockId = blockIdMatch ? blockIdMatch[1] : "text-".concat(blocks.length);
                    const order = orderMatch ? parseInt(orderMatch[1]) : blocks.length;
                    const content = part.replace(/<div[^>]*>|<\/div>/g, '').trim();
                    if (content) {
                        blocks.push({
                            id: blockId,
                            type: 'text',
                            order: order,
                            content: content
                        });
                    }
                }
            });
            // Add any remaining media items that weren't found in placeholders
            media.forEach((mediaItem)=>{
                const existingBlock = blocks.find((b)=>b.type === 'media' && (b.id === mediaItem.id || b.preview === mediaItem.file_url));
                if (!existingBlock) {
                    blocks.push({
                        id: "existing-media-".concat(mediaItem.id),
                        type: 'media',
                        order: blocks.length,
                        caption: mediaItem.caption || '',
                        preview: mediaItem.file_url
                    });
                }
            });
        } else {
            // No HTML content, just add media blocks if any
            media.forEach((mediaItem, index)=>{
                blocks.push({
                    id: "media-".concat(mediaItem.id),
                    type: 'media',
                    order: index,
                    caption: mediaItem.caption || '',
                    preview: mediaItem.file_url
                });
            });
        }
        // Sort blocks by order
        blocks.sort((a, b)=>a.order - b.order);
        // If no blocks, add an empty text block
        if (blocks.length === 0) {
            blocks.push({
                id: '1',
                type: 'text',
                order: 0,
                content: ''
            });
        }
        return blocks;
    };
    // Load material and poin details
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MaterialPoinManager.useEffect": ()=>{
            const loadMaterial = {
                "MaterialPoinManager.useEffect.loadMaterial": async ()=>{
                    setLoading(true);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enhancedMaterialService"].getWithPoins(materialId);
                        if (res.ok) {
                            // Load complete media data for each poin for preview
                            if (res.data.poin_details && res.data.poin_details.length > 0) {
                                const poinsWithMedia = await Promise.all(res.data.poin_details.map({
                                    "MaterialPoinManager.useEffect.loadMaterial": async (poin)=>{
                                        const poinWithMedia = await loadPoinWithMedia(poin.id);
                                        if (poinWithMedia) {
                                            return poinWithMedia;
                                        }
                                        return poin;
                                    }
                                }["MaterialPoinManager.useEffect.loadMaterial"]));
                                res.data.poin_details = poinsWithMedia;
                            }
                            setMaterial(res.data);
                            setPoins(res.data.poin_details || []);
                        } else {
                            console.error('Failed to load material:', res);
                            let errorMsg = 'Gagal memuat materi';
                            if (res.status === 403) {
                                errorMsg = 'Akses ditolak. Materi mungkin masih dalam status draft atau Anda tidak memiliki izin admin. Coba gunakan endpoint admin.';
                            } else if (res.status === 401) {
                                errorMsg = 'Sesi login sudah berakhir. Silakan login ulang.';
                            } else if (res.status === 404) {
                                errorMsg = 'Materi tidak ditemukan. Periksa apakah ID materi benar.';
                            }
                            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                                icon: 'error',
                                title: 'Error',
                                text: errorMsg,
                                footer: "Status: ".concat(res.status, " - ").concat(res.error)
                            });
                        }
                    } catch (error) {
                        console.error('Error loading material:', error);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Terjadi kesalahan saat memuat materi'
                        });
                    } finally{
                        setLoading(false);
                    }
                }
            }["MaterialPoinManager.useEffect.loadMaterial"];
            loadMaterial();
        }
    }["MaterialPoinManager.useEffect"], [
        materialId
    ]);
    const resetForm = ()=>{
        setTitle("");
        setDurationLabel("");
        setDurationMinutes("");
        setEditingPoin(null);
        setExistingMedia([]);
        setMediaToDelete([]);
        // Reset to single empty text block
        setContentBlocks([
            {
                id: '1',
                type: 'text',
                order: 0,
                content: ''
            }
        ]);
        // Cleanup preview URLs to prevent memory leaks
        contentBlocks.forEach((block)=>{
            if (block.preview && block.preview.startsWith('blob:')) {
                URL.revokeObjectURL(block.preview);
            }
        });
    };
    const loadPoinToForm = async (poin)=>{
        setTitle(poin.title);
        setDurationLabel(poin.duration_label || "");
        const durationValue = poin.duration_minutes !== null && poin.duration_minutes !== undefined ? String(poin.duration_minutes) : "";
        setDurationMinutes(durationValue);
        setEditingPoin(poin);
        // Convert existing content to blocks
        const media = getPoinMedia(poin);
        const blocks = parseHTMLToBlocks(poin.content_html, media);
        setContentBlocks(blocks);
        // Load existing media using helper function
        const poinMedia = getPoinMedia(poin);
        if (poinMedia.length > 0) {
            setExistingMedia(poinMedia);
        } else {
            // Load full poin data with media from backend
            const fullPoin = await loadPoinWithMedia(poin.id);
            if (fullPoin) {
                const fullPoinMedia = getPoinMedia(fullPoin);
                setExistingMedia(fullPoinMedia);
            } else {
                setExistingMedia([]);
            }
        }
        setMediaToDelete([]);
    };
    // Existing media management functions
    const updateExistingMediaCaption = (mediaId, caption)=>{
        setExistingMedia((prev)=>prev.map((media)=>media.id === mediaId ? {
                    ...media,
                    caption,
                    captionChanged: true
                } : media));
    };
    const markMediaForDeletion = (mediaId)=>{
        setMediaToDelete((prev)=>[
                ...prev,
                mediaId
            ]);
        setExistingMedia((prev)=>prev.filter((media)=>media.id !== mediaId));
    };
    const deleteMediaFromServer = async (mediaId)=>{
        try {
            const { apiFetch } = await __turbopack_context__.A("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript, async loader)");
            const res = await apiFetch("/api/v1/admin/poins/media/".concat(encodeURIComponent(mediaId)), {
                method: "DELETE"
            });
            if (res.ok) {
                return true;
            } else {
                console.error('Failed to delete media:', res);
                return false;
            }
        } catch (error) {
            console.error('Error deleting media:', error);
            return false;
        }
    };
    const addNewMediaToPoin = async (poinId, file, caption)=>{
        try {
            const formData = new FormData();
            formData.append('media', file);
            if (caption.trim()) {
                formData.append('caption', caption.trim());
            }
            const { apiFetch } = await __turbopack_context__.A("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript, async loader)");
            const res = await apiFetch("/api/v1/admin/poins/".concat(encodeURIComponent(String(poinId)), "/media"), {
                method: "POST",
                body: formData,
                asJson: false
            });
            if (res.ok) {
                return res.data;
            } else {
                console.error('Failed to add new media:', res);
                return null;
            }
        } catch (error) {
            console.error('Error adding new media:', error);
            return null;
        }
    };
    const updateMediaCaption = async (mediaId, caption)=>{
        try {
            const { apiFetch } = await __turbopack_context__.A("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript, async loader)");
            const res = await apiFetch("/api/v1/admin/poins/media/".concat(encodeURIComponent(mediaId)), {
                method: "PUT",
                body: {
                    caption
                }
            });
            if (res.ok) {
                return true;
            } else {
                console.error('Failed to update media caption:', res);
                return false;
            }
        } catch (error) {
            console.error('Error updating media caption:', error);
            return false;
        }
    };
    const handleAddPoin = async (e)=>{
        e.preventDefault();
        // Enhanced validation
        const trimmedTitle = title.trim();
        // Convert blocks to HTML and get media files
        const contentHtml = convertBlocksToHTML();
        const mediaFiles = getBlockMediaFiles();
        const trimmedContentHtml = contentHtml.trim();
        if (!trimmedTitle) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Judul poin harus diisi'
            });
            return;
        }
        if (!trimmedContentHtml) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Konten poin harus diisi'
            });
            return;
        }
        setSubmitting(true);
        try {
            // Use new endpoint that supports media upload
            const payload = {
                sub_materi_id: materialId,
                title: trimmedTitle,
                content_html: contentHtml,
                duration_label: durationLabel.trim() || undefined,
                order_index: poins.length + 1,
                duration_minutes: durationMinutes ? Number(durationMinutes) : undefined
            };
            // Use createWithMedia for files, fallback to regular create if no files
            let res;
            if (mediaFiles.length > 0) {
                // Direct API call to createWithMedia endpoint since method might not be available yet
                try {
                    const formData = new FormData();
                    // Append required poin data - sub_materi_id is critical for backend
                    formData.append('sub_materi_id', materialId);
                    formData.append('title', payload.title);
                    formData.append('content_html', payload.content_html);
                    // Append optional data
                    if (payload.duration_label) formData.append('duration_label', payload.duration_label);
                    if (payload.duration_minutes) formData.append('duration_minutes', String(payload.duration_minutes));
                    if (payload.order_index) formData.append('order_index', String(payload.order_index));
                    // Append media files
                    mediaFiles.forEach((mediaFile)=>{
                        formData.append('media', mediaFile.file);
                    });
                    // Append captions if provided
                    const captions = mediaFiles.map((mf)=>mf.caption);
                    if (captions.length > 0) {
                        formData.append('captions', JSON.stringify(captions));
                    }
                    // Import apiFetch directly for this call
                    const { apiFetch } = await __turbopack_context__.A("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/lib/api/client.ts [app-client] (ecmascript, async loader)");
                    res = await apiFetch("/api/v1/admin/sub-materis/".concat(encodeURIComponent(materialId), "/poins-with-media"), {
                        method: "POST",
                        body: formData,
                        asJson: false
                    });
                } catch (error) {
                    console.error('Direct API call failed:', error);
                    throw error;
                }
            } else {
                res = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poinDetailService"].create(payload);
            }
            if (res.ok) {
                var _res_data;
                // If media was uploaded, we need to update the HTML with correct media IDs
                if (mediaFiles.length > 0 && ((_res_data = res.data) === null || _res_data === void 0 ? void 0 : _res_data.poin_media)) {
                    // Create mapping of block IDs to media IDs based on upload order
                    const mediaMapping = {};
                    mediaFiles.forEach((mediaFile, index)=>{
                        var _res_data_poin_media;
                        if ((_res_data_poin_media = res.data.poin_media) === null || _res_data_poin_media === void 0 ? void 0 : _res_data_poin_media[index]) {
                            mediaMapping[mediaFile.blockId] = res.data.poin_media[index].id;
                        }
                    });
                    // Update the poin's content_html with correct media IDs
                    if (Object.keys(mediaMapping).length > 0) {
                        const updatedHtml = updateHtmlWithMediaIds(res.data.content_html, mediaMapping);
                        // Update the poin with correct HTML
                        try {
                            const updateRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poinDetailService"].update(res.data.id, {
                                content_html: updatedHtml
                            });
                            if (!updateRes.ok) {
                                console.warn('Failed to update poin HTML with media IDs:', updateRes);
                            }
                        } catch (updateError) {
                            console.warn('Error updating poin HTML:', updateError);
                        }
                    }
                }
                // Reload material to get updated poins with full media data
                const materialRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enhancedMaterialService"].getWithPoins(materialId);
                if (materialRes.ok) {
                    // Load complete media data for each poin for preview
                    if (materialRes.data.poin_details && materialRes.data.poin_details.length > 0) {
                        const poinsWithMedia = await Promise.all(materialRes.data.poin_details.map(async (poin)=>{
                            const poinWithMedia = await loadPoinWithMedia(poin.id);
                            if (poinWithMedia) {
                                return poinWithMedia;
                            }
                            return poin;
                        }));
                        materialRes.data.poin_details = poinsWithMedia;
                    }
                    setMaterial(materialRes.data);
                    setPoins(materialRes.data.poin_details || []);
                }
                resetForm();
                setShowAddPoin(false);
                const mediaCount = mediaFiles.length;
                const successMessage = mediaCount > 0 ? "Poin berhasil ditambahkan dengan ".concat(mediaCount, " file media") : 'Poin berhasil ditambahkan';
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: successMessage,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Enhanced error handling based on backend documentation
                let errorTitle = 'Gagal Menambah Poin';
                let errorMessage = 'Terjadi kesalahan saat menambah poin';
                if (res.status === 401) {
                    errorTitle = 'Akses Ditolak';
                    errorMessage = 'Sesi login telah berakhir. Silakan login kembali.';
                } else if (res.status === 413) {
                    errorTitle = 'File Terlalu Besar';
                    errorMessage = 'Ukuran file melebihi batas maksimal 50MB per file.';
                } else if (res.status === 400) {
                    errorTitle = 'Data Tidak Valid';
                    errorMessage = res.error || 'Data yang dikirim tidak valid. Periksa kembali form Anda.';
                } else if (res.status === 500) {
                    errorTitle = 'Server Error';
                    errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    title: errorTitle,
                    text: errorMessage,
                    footer: mediaFiles.length > 0 ? 'Tip: Coba kurangi jumlah atau ukuran file yang diunggah' : undefined
                });
            }
        } catch (error) {
            console.error('Error adding poin:', error);
            // Enhanced catch error handling
            let errorMessage = 'Terjadi kesalahan saat menambah poin';
            if (error instanceof Error) {
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    errorMessage = 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.';
                } else if (error.message.includes('timeout')) {
                    errorMessage = 'Upload memakan waktu terlalu lama. Coba kurangi ukuran file atau jumlah file.';
                }
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                footer: mediaFiles.length > 0 ? "Mencoba upload ".concat(mediaFiles.length, " file") : undefined
            });
        } finally{
            setSubmitting(false);
        }
    };
    const handleEditPoin = async (poin)=>{
        await loadPoinToForm(poin);
        setShowEditPoin(true);
        setShowAddPoin(false); // Hide add form if open
    };
    const handleUpdatePoin = async (e)=>{
        e.preventDefault();
        if (!editingPoin) return;
        // Convert blocks to HTML and get media files for update
        const contentHtml = convertBlocksToHTML();
        const mediaFiles = getBlockMediaFiles();
        if (!title.trim() || !contentHtml.trim()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                title: 'Error',
                text: 'Judul dan konten harus diisi'
            });
            return;
        }
        setSubmitting(true);
        try {
            // 1. Update poin text fields
            const payload = {
                title: title.trim(),
                content_html: contentHtml.trim(),
                duration_label: durationLabel.trim() || undefined,
                duration_minutes: durationMinutes ? Number(durationMinutes) : undefined
            };
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poinDetailService"].update(editingPoin.id, payload);
            if (!res.ok) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal memperbarui poin'
                });
                return;
            }
            // 2. Delete marked media
            for (const mediaId of mediaToDelete){
                await deleteMediaFromServer(mediaId);
            }
            // 3. Update existing media captions that were changed
            for (const media of existingMedia){
                if (media.captionChanged) {
                    await updateMediaCaption(media.id, media.caption || '');
                }
            }
            // 4. Add new media files from blocks
            const newMediaIds = [];
            for (const mediaFile of mediaFiles){
                const newMediaResponse = await addNewMediaToPoin(editingPoin.id, mediaFile.file, mediaFile.caption);
                if (newMediaResponse && typeof newMediaResponse === 'object' && 'id' in newMediaResponse) {
                    newMediaIds.push(newMediaResponse.id);
                }
            }
            // 5. Update HTML with new media IDs if any new media was added
            if (mediaFiles.length > 0 && newMediaIds.length > 0) {
                const mediaMapping = {};
                mediaFiles.forEach((mediaFile, index)=>{
                    if (newMediaIds[index]) {
                        mediaMapping[mediaFile.blockId] = newMediaIds[index];
                    }
                });
                if (Object.keys(mediaMapping).length > 0) {
                    const currentPoin = await loadPoinWithMedia(editingPoin.id);
                    if (currentPoin) {
                        const updatedHtml = updateHtmlWithMediaIds(currentPoin.content_html, mediaMapping);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poinDetailService"].update(editingPoin.id, {
                            content_html: updatedHtml
                        });
                    }
                }
            }
            // Reload material to get updated poins with full media data
            const materialRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enhancedMaterialService"].getWithPoins(materialId);
            if (materialRes.ok) {
                // Load complete media data for each poin for preview
                if (materialRes.data.poin_details && materialRes.data.poin_details.length > 0) {
                    const poinsWithMedia = await Promise.all(materialRes.data.poin_details.map(async (poin)=>{
                        const poinWithMedia = await loadPoinWithMedia(poin.id);
                        if (poinWithMedia) {
                            return poinWithMedia;
                        }
                        return poin;
                    }));
                    materialRes.data.poin_details = poinsWithMedia;
                }
                setMaterial(materialRes.data);
                setPoins(materialRes.data.poin_details || []);
            }
            resetForm();
            setShowEditPoin(false);
            const mediaChanges = mediaToDelete.length + mediaFiles.length + existingMedia.filter((m)=>m.captionChanged).length;
            const successMessage = mediaChanges > 0 ? 'Poin berhasil diperbarui dengan perubahan media' : 'Poin berhasil diperbarui';
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'success',
                title: 'Berhasil',
                text: successMessage,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error updating poin:', error);
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan saat memperbarui poin'
            });
        } finally{
            setSubmitting(false);
        }
    };
    const handleCancelEdit = ()=>{
        resetForm();
        setShowEditPoin(false);
    };
    const handleDeletePoin = async (poin)=>{
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
            title: 'Hapus Poin?',
            text: 'Poin "'.concat(poin.title, '" akan dihapus.'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });
        if (result.isConfirmed) {
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poinDetailService"].remove(poin.id);
                if (res.ok) {
                    // Reload material with full media data
                    const materialRes = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$lib$2f$api$2f$poin$2d$details$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enhancedMaterialService"].getWithPoins(materialId);
                    if (materialRes.ok) {
                        // Load complete media data for each poin for preview
                        if (materialRes.data.poin_details && materialRes.data.poin_details.length > 0) {
                            const poinsWithMedia = await Promise.all(materialRes.data.poin_details.map(async (poin)=>{
                                const poinWithMedia = await loadPoinWithMedia(poin.id);
                                if (poinWithMedia) {
                                    return poinWithMedia;
                                }
                                return poin;
                            }));
                            materialRes.data.poin_details = poinsWithMedia;
                        }
                        setMaterial(materialRes.data);
                        setPoins(materialRes.data.poin_details || []);
                    }
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Poin berhasil dihapus',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Gagal menghapus poin'
                    });
                }
            } catch (error) {
                console.error('Error deleting poin:', error);
                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Terjadi kesalahan saat menghapus poin'
                });
            }
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 bg-gray-50 min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-500",
                    children: "Memuat materi..."
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                    lineNumber: 887,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                lineNumber: 886,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
            lineNumber: 885,
            columnNumber: 7
        }, this);
    }
    if (!material) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 bg-gray-50 min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500",
                    children: "Materi tidak ditemukan"
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                    lineNumber: 897,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                lineNumber: 896,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
            lineNumber: 895,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-gray-50 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.back(),
                            className: "flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                    lineNumber: 912,
                                    columnNumber: 13
                                }, this),
                                "Kembali"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                            lineNumber: 908,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 907,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl p-6 shadow-sm border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900 mb-2",
                                children: material.title
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 918,
                                columnNumber: 11
                            }, this),
                            material.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-gray-600 mb-4 max-h-24 overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    dangerouslySetInnerHTML: {
                                        __html: material.content.slice(0, 200) + '...'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                    lineNumber: 921,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 920,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-4 text-sm text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            poins.length,
                                            " Poin Materi"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 925,
                                        columnNumber: 13
                                    }, this),
                                    material.published ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-600",
                                        children: "Terbit"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 927,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-amber-600",
                                        children: "Draf"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 929,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 924,
                                columnNumber: 11
                            }, this),
                            !material.published && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-amber-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Mode Draft:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 938,
                                                columnNumber: 19
                                            }, this),
                                            " Materi ini belum dipublikasi, namun Anda tetap bisa menambahkan dan mengelola poin-poin pembelajaran. Poin akan tersimpan dan siap digunakan saat materi dipublikasikan."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 937,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                    lineNumber: 936,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 935,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 917,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                lineNumber: 906,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-gray-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex space-x-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('manage'),
                                className: "py-2 px-1 border-b-2 font-medium text-sm transition-colors ".concat(activeTab === 'manage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'),
                                children: "Kelola Poin"
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 951,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('preview'),
                                className: "py-2 px-1 border-b-2 font-medium text-sm transition-colors ".concat(activeTab === 'preview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'),
                                children: [
                                    "Preview Materi",
                                    poins.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full",
                                        children: [
                                            poins.length,
                                            " poin"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 969,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 960,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 950,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                    lineNumber: 949,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                lineNumber: 948,
                columnNumber: 7
            }, this),
            activeTab === 'manage' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    !showEditPoin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowAddPoin(!showAddPoin);
                                if (showAddPoin) {
                                    resetForm(); // Reset form when closing
                                }
                            },
                            className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                    lineNumber: 993,
                                    columnNumber: 17
                                }, this),
                                showAddPoin ? 'Tutup Form' : 'Tambah Poin'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                            lineNumber: 984,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 983,
                        columnNumber: 13
                    }, this),
                    (showAddPoin || showEditPoin) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: editingPoin ? handleUpdatePoin : handleAddPoin,
                        className: "bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-gray-900 mb-4",
                                children: editingPoin ? 'Edit Poin' : 'Tambah Poin Baru'
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1002,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 text-black",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Judul Poin *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: title,
                                                onChange: (e)=>setTitle(e.target.value),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                placeholder: "Masukkan judul poin...",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Label Durasi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1021,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: durationLabel,
                                                        onChange: (e)=>setDurationLabel(e.target.value),
                                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                        placeholder: "contoh: Bacaan 5 menit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1020,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Durasi (menit)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1032,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: "0",
                                                        value: durationMinutes,
                                                        onChange: (e)=>setDurationMinutes(e.target.value),
                                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                        placeholder: "Estimasi menit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1031,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 17
                                    }, this),
                                    editingPoin && existingMedia.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-3",
                                                children: "Media yang Sudah Ada"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                    className: "text-xs text-blue-800",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                            className: "cursor-pointer font-medium",
                                                            children: "🔍 Debug Info (klik untuk expand)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1070,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Media Count:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1072,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        " ",
                                                                        existingMedia.length
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1072,
                                                                    columnNumber: 27
                                                                }, this),
                                                                existingMedia.map((media, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "p-2 bg-white rounded border",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                    children: [
                                                                                        "Media #",
                                                                                        idx + 1,
                                                                                        ":"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1075,
                                                                                    columnNumber: 34
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1075,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "ID:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1076,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    " ",
                                                                                    media.id
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1076,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "Filename:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1077,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    " ",
                                                                                    media.original_filename
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1077,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "MIME:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1078,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    " ",
                                                                                    media.mime_type
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1078,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "Size:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1079,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    " ",
                                                                                    media.file_size ? "".concat((media.file_size / 1024 / 1024).toFixed(2), " MB") : 'Unknown'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1079,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "URL:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1080,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                        href: media.file_url,
                                                                                        target: "_blank",
                                                                                        rel: "noopener noreferrer",
                                                                                        className: "text-blue-600 hover:underline break-all",
                                                                                        children: media.file_url
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1081,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    media.file_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "ml-2",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>{
                                                                                                const testImg = document.createElement('img');
                                                                                                testImg.onload = ()=>{};
                                                                                                testImg.onerror = ()=>{};
                                                                                                testImg.src = media.file_url;
                                                                                            },
                                                                                            className: "text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700",
                                                                                            children: "Test URL"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                            lineNumber: 1086,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1085,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1080,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: "Caption:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1100,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    " ",
                                                                                    media.caption || 'No caption'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1100,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, media.id, true, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1074,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1071,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                    lineNumber: 1069,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: existingMedia.map((media)=>{
                                                    var _media_mime_type, _media_mime_type1, _media_mime_type2, _media_mime_type3, _media_mime_type4, _media_mime_type5, _media_mime_type6;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-amber-50 rounded-lg border border-amber-200",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-shrink-0",
                                                                    children: ((_media_mime_type = media.mime_type) === null || _media_mime_type === void 0 ? void 0 : _media_mime_type.startsWith('image/')) && !imageErrors.has(media.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        src: media.file_url,
                                                                        alt: media.caption || media.original_filename,
                                                                        width: 80,
                                                                        height: 80,
                                                                        className: "w-20 h-20 object-cover rounded-lg border border-gray-300",
                                                                        unoptimized: true,
                                                                        onError: (e)=>{
                                                                            console.error('Image load error:', {
                                                                                media_id: media.id,
                                                                                file_url: media.file_url,
                                                                                mime_type: media.mime_type,
                                                                                original_filename: media.original_filename,
                                                                                error: e
                                                                            });
                                                                            setImageErrors((prev)=>new Set(prev).add(media.id));
                                                                        },
                                                                        onLoad: ()=>{
                                                                            setImageErrors((prev)=>{
                                                                                const newSet = new Set(prev);
                                                                                newSet.delete(media.id);
                                                                                return newSet;
                                                                            });
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1113,
                                                                        columnNumber: 33
                                                                    }, this) : ((_media_mime_type1 = media.mime_type) === null || _media_mime_type1 === void 0 ? void 0 : _media_mime_type1.startsWith('image/')) && imageErrors.has(media.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-20 h-20 bg-red-100 border border-red-200 rounded-lg flex flex-col items-center justify-center p-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                                                                className: "w-4 h-4 text-red-600 mb-1"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1140,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: media.file_url,
                                                                                target: "_blank",
                                                                                rel: "noopener noreferrer",
                                                                                className: "text-xs text-red-600 hover:text-red-800 text-center leading-tight",
                                                                                children: "URL Error"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1141,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1139,
                                                                        columnNumber: 33
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center",
                                                                        children: ((_media_mime_type2 = media.mime_type) === null || _media_mime_type2 === void 0 ? void 0 : _media_mime_type2.startsWith('video/')) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                                                            className: "w-6 h-6 text-purple-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1153,
                                                                            columnNumber: 37
                                                                        }, this) : ((_media_mime_type3 = media.mime_type) === null || _media_mime_type3 === void 0 ? void 0 : _media_mime_type3.startsWith('audio/')) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "w-6 h-6 text-blue-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1155,
                                                                            columnNumber: 37
                                                                        }, this) : media.mime_type === 'application/pdf' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "w-6 h-6 text-red-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1157,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "w-6 h-6 text-gray-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1159,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1151,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1111,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-medium text-gray-900",
                                                                                    children: media.original_filename
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1168,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: [
                                                                                        ((_media_mime_type4 = media.mime_type) === null || _media_mime_type4 === void 0 ? void 0 : _media_mime_type4.startsWith('image/')) ? 'Gambar' : ((_media_mime_type5 = media.mime_type) === null || _media_mime_type5 === void 0 ? void 0 : _media_mime_type5.startsWith('video/')) ? 'Video' : ((_media_mime_type6 = media.mime_type) === null || _media_mime_type6 === void 0 ? void 0 : _media_mime_type6.startsWith('audio/')) ? 'Audio' : media.mime_type === 'application/pdf' ? 'PDF' : 'File',
                                                                                        " •",
                                                                                        media.file_size ? " ".concat((media.file_size / 1024 / 1024).toFixed(2), " MB") : ' Unknown size'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1169,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1167,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: media.caption || '',
                                                                                onChange: (e)=>updateExistingMediaCaption(media.id, e.target.value),
                                                                                placeholder: "Edit caption untuk media ini...",
                                                                                className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1180,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1179,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1166,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>markMediaForDeletion(media.id),
                                                                    className: "flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors",
                                                                    title: "Hapus media",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1197,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1191,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1109,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, media.id, false, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1108,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1106,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-amber-700",
                                                    children: [
                                                        "📝 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Media yang Ada:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1207,
                                                            columnNumber: 28
                                                        }, this),
                                                        ' Edit caption atau hapus media yang tidak diperlukan. Perubahan akan disimpan saat Anda menekan "Perbarui Poin".'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1205,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1064,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Konten Poin *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1216,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: addTextBlock,
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1226,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1225,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Add Text"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1220,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: addMediaBlock,
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-md text-sm font-medium transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1236,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1235,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Add Media"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1230,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1219,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 border border-gray-200 rounded-lg p-4 min-h-[200px]",
                                                children: [
                                                    contentBlocks.map((block, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "group relative",
                                                            children: [
                                                                block.type === 'text' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                        value: block.content || '',
                                                                        onChange: (e)=>updateTextBlock(block.id, e.target.value),
                                                                        placeholder: "Type your text content here...",
                                                                        className: "w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                                        rows: 3
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1248,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1247,
                                                                    columnNumber: 27
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "border-2 border-dashed border-gray-300 rounded-md p-4",
                                                                        children: block.file || block.preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-3",
                                                                            children: [
                                                                                block.preview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "relative",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                        src: block.preview,
                                                                                        alt: "Preview",
                                                                                        width: 200,
                                                                                        height: 200,
                                                                                        className: "max-w-full h-auto max-h-48 object-contain rounded",
                                                                                        unoptimized: true
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1265,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1264,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: block.caption || '',
                                                                                    onChange: (e)=>{
                                                                                        setContentBlocks((blocks)=>blocks.map((b)=>b.id === block.id ? {
                                                                                                    ...b,
                                                                                                    caption: e.target.value
                                                                                                } : b));
                                                                                    },
                                                                                    placeholder: "Enter caption (optional)",
                                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1277,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1261,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-center py-6",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "file",
                                                                                    accept: "image/*,video/*,audio/*,.pdf,.doc,.docx",
                                                                                    onChange: (e)=>{
                                                                                        var _e_target_files;
                                                                                        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
                                                                                        if (file) {
                                                                                            updateMediaBlock(block.id, file);
                                                                                        }
                                                                                    },
                                                                                    className: "hidden",
                                                                                    id: "media-".concat(block.id)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1295,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    htmlFor: "media-".concat(block.id),
                                                                                    className: "cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                            className: "w-8 h-8",
                                                                                            fill: "none",
                                                                                            stroke: "currentColor",
                                                                                            viewBox: "0 0 24 24",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                strokeLinecap: "round",
                                                                                                strokeLinejoin: "round",
                                                                                                strokeWidth: 2,
                                                                                                d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                                lineNumber: 1312,
                                                                                                columnNumber: 39
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                            lineNumber: 1311,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm font-medium",
                                                                                            children: "Click to upload media"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                            lineNumber: 1314,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs",
                                                                                            children: "Images, videos, documents"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                            lineNumber: 1315,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1307,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1294,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1259,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1257,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col gap-1 bg-white border border-gray-200 rounded-md shadow-sm",
                                                                        children: [
                                                                            index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>moveBlock(block.id, 'up'),
                                                                                className: "p-1.5 hover:bg-gray-50 text-gray-600 hover:text-gray-800",
                                                                                title: "Move up",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    className: "w-4 h-4",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    viewBox: "0 0 24 24",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                        strokeLinecap: "round",
                                                                                        strokeLinejoin: "round",
                                                                                        strokeWidth: 2,
                                                                                        d: "M5 15l7-7 7 7"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1334,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1333,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1327,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            index < contentBlocks.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>moveBlock(block.id, 'down'),
                                                                                className: "p-1.5 hover:bg-gray-50 text-gray-600 hover:text-gray-800",
                                                                                title: "Move down",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    className: "w-4 h-4",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    viewBox: "0 0 24 24",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                        strokeLinecap: "round",
                                                                                        strokeLinejoin: "round",
                                                                                        strokeWidth: 2,
                                                                                        d: "M19 9l-7 7-7-7"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1346,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1345,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1339,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>removeBlock(block.id),
                                                                                className: "p-1.5 hover:bg-red-50 text-red-600 hover:text-red-800",
                                                                                title: "Delete block",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    className: "w-4 h-4",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    viewBox: "0 0 24 24",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                        strokeLinecap: "round",
                                                                                        strokeLinejoin: "round",
                                                                                        strokeWidth: 2,
                                                                                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                        lineNumber: 1357,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                    lineNumber: 1356,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1350,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1325,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1324,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, block.id, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1245,
                                                            columnNumber: 23
                                                        }, this)),
                                                    contentBlocks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center py-8 text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "No content blocks yet."
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1367,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm",
                                                                children: "Click “Add Text” or “Add Media” to start creating content."
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1368,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1243,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 text-xs text-gray-500",
                                                children: "Use the block editor to create content with mixed text and media. Order will be preserved in the final display."
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                lineNumber: 1373,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1215,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1006,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: submitting,
                                        className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors disabled:opacity-60",
                                        children: submitting ? getBlockMediaFiles().length > 0 ? "Mengupload ".concat(getBlockMediaFiles().length, " file...") : 'Menyimpan...' : editingPoin ? 'Perbarui Poin' : 'Simpan Poin'
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1380,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: editingPoin ? handleCancelEdit : ()=>{
                                            resetForm();
                                            setShowAddPoin(false);
                                        },
                                        className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-colors",
                                        children: "Batal"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1393,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1379,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 1001,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-gray-900",
                                    children: [
                                        "Daftar Poin (",
                                        poins.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                    lineNumber: 1410,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1409,
                                columnNumber: 13
                            }, this),
                            poins.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8 text-center text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "w-12 h-12 mx-auto mb-3 text-gray-300"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1415,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: 'Belum ada poin. Klik "Tambah Poin" untuk mulai membuat konten materi.'
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1416,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1414,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-200",
                                children: poins.sort((a, b)=>(a.order_index || 0) - (b.order_index || 0)).map((poin, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 hover:bg-gray-50 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-semibold text-gray-900",
                                                                    children: [
                                                                        index + 1,
                                                                        ". ",
                                                                        poin.title
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1427,
                                                                    columnNumber: 29
                                                                }, this),
                                                                poin.duration_label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium",
                                                                    children: poin.duration_label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1431,
                                                                    columnNumber: 31
                                                                }, this),
                                                                poin.duration_minutes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full",
                                                                    children: [
                                                                        poin.duration_minutes,
                                                                        " menit"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1436,
                                                                    columnNumber: 31
                                                                }, this),
                                                                getPoinMedia(poin).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium",
                                                                    children: [
                                                                        getPoinMedia(poin).length,
                                                                        " Media"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1441,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1426,
                                                            columnNumber: 27
                                                        }, this),
                                                        getPoinMedia(poin).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2 mb-3",
                                                            children: [
                                                                getPoinMedia(poin).slice(0, 4).map((media)=>{
                                                                    var _media_mime_type, _media_mime_type1, _media_mime_type2;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-shrink-0",
                                                                        children: ((_media_mime_type = media.mime_type) === null || _media_mime_type === void 0 ? void 0 : _media_mime_type.startsWith('image/')) && !imageErrors.has(media.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: media.file_url,
                                                                            alt: media.caption || media.original_filename,
                                                                            width: 60,
                                                                            height: 60,
                                                                            className: "w-15 h-15 object-cover rounded-lg border border-gray-200",
                                                                            unoptimized: true,
                                                                            onError: ()=>{
                                                                                setImageErrors((prev)=>new Set(prev).add(media.id));
                                                                            },
                                                                            onLoad: ()=>{
                                                                                setImageErrors((prev)=>{
                                                                                    const newSet = new Set(prev);
                                                                                    newSet.delete(media.id);
                                                                                    return newSet;
                                                                                });
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1453,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-15 h-15 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center",
                                                                            children: ((_media_mime_type1 = media.mime_type) === null || _media_mime_type1 === void 0 ? void 0 : _media_mime_type1.startsWith('video/')) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                                                                className: "w-6 h-6 text-purple-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1474,
                                                                                columnNumber: 41
                                                                            }, this) : ((_media_mime_type2 = media.mime_type) === null || _media_mime_type2 === void 0 ? void 0 : _media_mime_type2.startsWith('audio/')) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                className: "w-6 h-6 text-blue-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1476,
                                                                                columnNumber: 41
                                                                            }, this) : media.mime_type === 'application/pdf' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                className: "w-6 h-6 text-red-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1478,
                                                                                columnNumber: 41
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                className: "w-6 h-6 text-gray-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                                lineNumber: 1480,
                                                                                columnNumber: 41
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                            lineNumber: 1472,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, media.id, false, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1451,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                }),
                                                                getPoinMedia(poin).length > 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-15 h-15 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-gray-600 font-medium",
                                                                        children: [
                                                                            "+",
                                                                            getPoinMedia(poin).length - 4
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                        lineNumber: 1488,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                    lineNumber: 1487,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1449,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "prose prose-sm max-w-none text-gray-600",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                dangerouslySetInnerHTML: {
                                                                    __html: poin.content_html.slice(0, 200) + (poin.content_html.length > 200 ? '...' : '')
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1497,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1496,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                    lineNumber: 1425,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 ml-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleEditPoin(poin),
                                                            className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors",
                                                            title: "Edit",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1507,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1502,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDeletePoin(poin),
                                                            className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                                                            title: "Hapus",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                                lineNumber: 1514,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                            lineNumber: 1509,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                                    lineNumber: 1501,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                            lineNumber: 1424,
                                            columnNumber: 23
                                        }, this)
                                    }, poin.id, false, {
                                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                                lineNumber: 1419,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                        lineNumber: 1408,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            activeTab === 'preview' && material && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$MaterialPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                poins: poins,
                materialTitle: material.title
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
                lineNumber: 1528,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx",
        lineNumber: 904,
        columnNumber: 5
    }, this);
}
_s(MaterialPoinManager, "bGPu+inNAZM5TQuzfYCDf3y0fAc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = MaterialPoinManager;
var _c;
__turbopack_context__.k.register(_c, "MaterialPoinManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NestedMaterialPoinPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$MaterialPoinManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/components/admin/MaterialPoinManager.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function NestedMaterialPoinPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const moduleId = String((params === null || params === void 0 ? void 0 : params.id) || "");
    const materialId = String((params === null || params === void 0 ? void 0 : params.materialId) || "");
    if (!moduleId || !materialId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 bg-gray-50 min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold mb-2",
                            children: "Parameter Tidak Valid"
                        }, void 0, false, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
                            lineNumber: 16,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Module ID: ",
                                moduleId || 'Missing'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Material ID: ",
                                materialId || 'Missing'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
                            lineNumber: 18,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
                    lineNumber: 15,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
                lineNumber: 14,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$src$2f$components$2f$admin$2f$MaterialPoinManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            materialId: materialId
        }, void 0, false, {
            fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/KULIAH/Pengabdian Website Posyandu/bukadita_backoffice/src/app/admin/modul/[id]/materi/[materialId]/poin/page.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(NestedMaterialPoinPage, "+jVsTcECDRo3yq2d7EQxlN9Ixog=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$KULIAH$2f$Pengabdian__Website__Posyandu$2f$bukadita_backoffice$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = NestedMaterialPoinPage;
var _c;
__turbopack_context__.k.register(_c, "NestedMaterialPoinPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_KULIAH_Pengabdian%20Website%20Posyandu_bukadita_backoffice_src_282d25bf._.js.map