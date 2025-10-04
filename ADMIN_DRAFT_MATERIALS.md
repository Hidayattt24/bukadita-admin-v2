# Admin vs User Material Display Logic

## 📋 **Problem Solved**

**Issue**: Admin UI hanya menampilkan materials dengan `published: true`, tidak menampilkan draft materials (`published: false`).

**Solution**: Admin seharusnya melihat SEMUA materials (termasuk draft), sedangkan user biasa hanya melihat yang published.

## 🔧 **Implementation Changes**

### 1. **Enhanced Admin Materials API** (`src/lib/api/admin.ts`)

```typescript
// NEW: Added admin-specific parameters
export const adminMaterialsApi = {
  list: async (params: {
    module_id: string | number;
    page?: number;
    limit?: number;
    include_drafts?: boolean; // 🆕 Admin-specific parameter
  }) => {
    // Admin context: always include drafts unless explicitly disabled
    const includeDrafts = params.include_drafts !== false;
    if (includeDrafts) {
      query.set("include_drafts", "true");
      query.set("admin", "true"); // Signal that this is an admin request
    }

    // Try multiple endpoints for maximum compatibility
    const endpoints = [
      `/api/v1/admin/materials?${query}`,
      `/api/v1/admin/sub-materis?${query}`,
      // ... other fallback endpoints
    ];
  },
};
```

### 2. **Admin UI Updates** (`src/components/admin/shared/ModuleItemsPage.tsx`)

#### API Calls with Admin Context

```typescript
// All admin API calls now include drafts
const res = await adminMaterialsApi.list({
  module_id: moduleId,
  include_drafts: true, // 🆕 Admin sees all materials including drafts
});
```

#### UI Status Display

```tsx
// Status column properly shows Draft vs Published
{
  key: "published",
  label: "Status",
  render: (v: boolean | undefined) => (
    <span className={`${v ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
      {v ? "Terbit" : "Draf"} {/* 🆕 Clear status indication */}
    </span>
  )
}
```

#### Admin Mode Indicator

```tsx
// Header clearly shows admin context
<div>
  <h2>Materi Modul</h2>
  <p className="text-sm text-gray-500">
    Mode Admin: Menampilkan semua materi termasuk draft {/* 🆕 */}
  </p>
</div>
```

#### Create Form Helper Text

```tsx
// Clear explanation of publish behavior
<label>
  Terbitkan
  <span className="text-xs text-gray-500">
    (Draft juga akan tampil di admin, tapi tidak di user) {/* 🆕 */}
  </span>
</label>
```

## 🎯 **Expected Behavior**

### Admin Interface (Current Implementation)

- ✅ Shows ALL materials (`published: true` AND `published: false`)
- ✅ Clear status indication: "Terbit" vs "Draf"
- ✅ Can create, edit, delete both published and draft materials
- ✅ Draft materials show with gray "Draf" badge
- ✅ Published materials show with green "Terbit" badge

### User Interface (Should be implemented in user-facing components)

- 🔄 Shows ONLY published materials (`published: true`)
- 🔄 No draft materials visible to regular users
- 🔄 Uses different API endpoints or filters

## 🚀 **Testing Steps**

1. **Create Test Materials**:

   ```
   Material 1: "Test Published" (published: true)
   Material 2: "Test Draft" (published: false)
   ```

2. **Admin View Test**:

   - Navigate to `/admin/modul/[id]/materi`
   - Should see BOTH materials
   - Published material = Green "Terbit" badge
   - Draft material = Gray "Draf" badge

3. **User View Test** (when implemented):
   - Navigate to user-facing material list
   - Should see ONLY "Test Published" material
   - No "Test Draft" material visible

## 🔍 **Debug Information**

Console logs will show:

```
🔄 Loading materials for module: [id]
🎯 Expected: Should find ALL materials including draft ones (admin context)
📍 Request URL will be: /api/v1/admin/materials?module_id=[id]&include_drafts=true&admin=true
✅ Admin Mode: Showing ALL materials including drafts (published=false)
📊 Array length: 2 (should show both published and draft)
```

## 📋 **API Contract**

### Backend Requirements

The backend should handle these parameters:

````http
GET /api/v1/admin/modules/123/materials?module_id=123&include_drafts=true&admin=true
# Returns: ALL materials including drafts (admin context) - PREFERRED

GET /api/v1/materials?module_id=123&include_drafts=true&admin=true
# Returns: ALL materials including drafts (admin context) - FALLBACK

GET /api/v1/materials?module_id=123
# Returns: ONLY published materials (user context)
```### Response Format

```json
{
  "items": [
    {
      "id": "1",
      "title": "Published Material",
      "published": true,
      "module_id": "123"
    },
    {
      "id": "2",
      "title": "Draft Material",
      "published": false,
      "module_id": "123"
    }
  ]
}
````

## 🎯 **Next Steps**

1. **Test Current Changes**: Verify admin sees both published and draft materials
2. **Backend Verification**: Ensure backend respects `include_drafts=true` parameter
3. **User Interface**: Implement user-facing components with published-only filter
4. **Documentation**: Update API docs with admin vs user endpoint differences

---

**Result**: Admin now sees ALL materials with clear draft/published status indication, while maintaining separate logic for user-facing components.
