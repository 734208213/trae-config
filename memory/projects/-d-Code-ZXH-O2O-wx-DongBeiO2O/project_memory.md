## Hard Constraints
- All API fields must strictly match Swagger documentation; no self-created fields
- Development for sales-side features must be done in the 'sale' directory
- Status values for store filtering must align with backend: 0=未激活, 1=激活中, 2=已激活

## Engineering Conventions
- API response data structure follows 'AjaxResult' format (success, tValue, message)
- Pagination uses 'pageIndex' and 'pageSize' parameters
- Store statistics should use the dedicated '/Applet/Store/GetSalesStoreStats' interface instead of manual calculation

## Lessons Learned
- Using 'storeId' parameter for '/Applet/Store/GetStoreByQrCode' causes errors; use URL parameters to pass store information instead
- Pagination logic is ineffective for interfaces returning a single object with details array; remove pagination in such cases