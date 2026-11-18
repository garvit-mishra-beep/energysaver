# EnergySaver — Complete Function Inventory & Analysis
**Document:** `docs/ENERGYSAVER_FUNCTION_INDEX.md`  
**Target Project:** EnergySaver — Electricity Usage Analyzer  
**Auditor/Author:** Full-Stack Architecture & Academic Viva Evaluator  
**Date:** November 18, 2026  
**Total Identified Functions:** 310 (Backend: 56, Frontend: 200, Testing: 54)

---

## 4.1 Master Function Index Table

The table below catalogs every project-defined function identified in the EnergySaver codebase, including declarations, async methods, expressions, and event listener callbacks. Descriptive labels (e.g. `listener_DOMContentLoaded_line_16`) denote anonymous event callbacks.

| # | Function Name | File | Lines | Type | Called By | Purpose |
|---|---|---|---|---|---|---|
| 1 | `getCsrfToken` | `public/js/api.js` | 20 | async function declaration | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for getCsrfToken |
| 2 | `request` | `public/js/api.js` | 40 | async function declaration | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for request |
| 3 | `register` | `public/js/api.js` | 128 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for register |
| 4 | `login` | `public/js/api.js` | 135 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for login |
| 5 | `logout` | `public/js/api.js` | 142 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for logout |
| 6 | `me` | `public/js/api.js` | 147 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for me |
| 7 | `updateProfile` | `public/js/api.js` | 151 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for updateProfile |
| 8 | `changePassword` | `public/js/api.js` | 158 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for changePassword |
| 9 | `deleteAccount` | `public/js/api.js` | 165 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for deleteAccount |
| 10 | `get` | `public/js/api.js` | 175 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for get |
| 11 | `update` | `public/js/api.js` | 179 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for update |
| 12 | `list` | `public/js/api.js` | 189 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for list |
| 13 | `create` | `public/js/api.js` | 202 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for create |
| 14 | `update` | `public/js/api.js` | 209 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for update |
| 15 | `delete` | `public/js/api.js` | 216 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for delete |
| 16 | `preview` | `public/js/api.js` | 222 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for preview |
| 17 | `getSummary` | `public/js/api.js` | 232 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for getSummary |
| 18 | `simulate` | `public/js/api.js` | 239 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for simulate |
| 19 | `apply` | `public/js/api.js` | 246 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for apply |
| 20 | `saveSnapshot` | `public/js/api.js` | 256 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for saveSnapshot |
| 21 | `listSnapshots` | `public/js/api.js` | 263 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for listSnapshots |
| 22 | `getSnapshot` | `public/js/api.js` | 267 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for getSnapshot |
| 23 | `logActualBill` | `public/js/api.js` | 271 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for logActualBill |
| 24 | `listActualBills` | `public/js/api.js` | 278 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for listActualBills |
| 25 | `deleteActualBill` | `public/js/api.js` | 282 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for deleteActualBill |
| 26 | `reconcile` | `public/js/api.js` | 288 | async method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for reconcile |
| 27 | `getCsvExportUrl` | `public/js/api.js` | 294 | method | Frontend modules (appliances.js, dashboard.js, etc.) | Centralized API request wrapper for getCsvExportUrl |
| 28 | `listener_DOMContentLoaded_line_16` | `public/js/appliances.js` | 16 | async event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_16 execution in appliances.js |
| 29 | `window.onDemoDataUpdated` | `public/js/appliances.js` | 25 | arrow/expression | Event / Internal | Handles window.onDemoDataUpdated execution in appliances.js |
| 30 | `window.onDataUpdated` | `public/js/appliances.js` | 28 | arrow/expression | Event / Internal | Handles window.onDataUpdated execution in appliances.js |
| 31 | `initializeApplianceState` | `public/js/appliances.js` | 39 | async function declaration | Event / Internal | Handles initializeApplianceState execution in appliances.js |
| 32 | `renderModeBadge` | `public/js/appliances.js` | 65 | function declaration | Event / Internal | Handles renderModeBadge execution in appliances.js |
| 33 | `loadAppliances` | `public/js/appliances.js` | 81 | async function declaration | Event / Internal | Handles loadAppliances execution in appliances.js |
| 34 | `applyFiltersAndRender` | `public/js/appliances.js` | 127 | function declaration | Event / Internal | Handles applyFiltersAndRender execution in appliances.js |
| 35 | `applyDemoFiltersAndRender` | `public/js/appliances.js` | 135 | function declaration | Event / Internal | Handles applyDemoFiltersAndRender execution in appliances.js |
| 36 | `list` | `public/js/appliances.js` | 154 | arrow/expression | Event / Internal | Handles list execution in appliances.js |
| 37 | `list` | `public/js/appliances.js` | 158 | arrow/expression | Event / Internal | Handles list execution in appliances.js |
| 38 | `list` | `public/js/appliances.js` | 162 | arrow/expression | Event / Internal | Handles list execution in appliances.js |
| 39 | `setupTableActions` | `public/js/appliances.js` | 178 | function declaration | Event / Internal | Handles setupTableActions execution in appliances.js |
| 40 | `listener_click_line_182` | `public/js/appliances.js` | 182 | event listener callback | Event / Internal | Handles listener_click_line_182 execution in appliances.js |
| 41 | `renderTable` | `public/js/appliances.js` | 201 | function declaration | Event / Internal | Handles renderTable execution in appliances.js |
| 42 | `setupFiltersAndSearch` | `public/js/appliances.js` | 257 | function declaration | Event / Internal | Handles setupFiltersAndSearch execution in appliances.js |
| 43 | `listener_click_line_288` | `public/js/appliances.js` | 288 | event listener callback | Event / Internal | Handles listener_click_line_288 execution in appliances.js |
| 44 | `setupPresetSelect` | `public/js/appliances.js` | 298 | function declaration | Event / Internal | Handles setupPresetSelect execution in appliances.js |
| 45 | `listener_change_line_309` | `public/js/appliances.js` | 309 | event listener callback | Event / Internal | Handles listener_change_line_309 execution in appliances.js |
| 46 | `setupFormValidationAndPreview` | `public/js/appliances.js` | 332 | function declaration | Event / Internal | Handles setupFormValidationAndPreview execution in appliances.js |
| 47 | `updateLivePreview` | `public/js/appliances.js` | 347 | function declaration | Event / Internal | Handles updateLivePreview execution in appliances.js |
| 48 | `handleFormSubmit` | `public/js/appliances.js` | 370 | async function declaration | Event / Internal | Handles handleFormSubmit execution in appliances.js |
| 49 | `showFieldError` | `public/js/appliances.js` | 467 | function declaration | Event / Internal | Handles showFieldError execution in appliances.js |
| 50 | `clearFieldError` | `public/js/appliances.js` | 481 | function declaration | Event / Internal | Handles clearFieldError execution in appliances.js |
| 51 | `setupModals` | `public/js/appliances.js` | 492 | function declaration | Event / Internal | Handles setupModals execution in appliances.js |
| 52 | `listener_click_line_495` | `public/js/appliances.js` | 495 | event listener callback | Event / Internal | Handles listener_click_line_495 execution in appliances.js |
| 53 | `listener_click_line_508` | `public/js/appliances.js` | 508 | async event listener callback | Event / Internal | Handles listener_click_line_508 execution in appliances.js |
| 54 | `openApplianceModal` | `public/js/appliances.js` | 539 | function declaration | Event / Internal | Handles openApplianceModal execution in appliances.js |
| 55 | `app` | `public/js/appliances.js` | 576 | arrow/expression | Event / Internal | Handles app execution in appliances.js |
| 56 | `closeApplianceModal` | `public/js/appliances.js` | 603 | function declaration | Event / Internal | Handles closeApplianceModal execution in appliances.js |
| 57 | `window.editAppliance` | `public/js/appliances.js` | 609 | arrow/expression | Event / Internal | Handles window.editAppliance execution in appliances.js |
| 58 | `window.confirmDeleteAppliance` | `public/js/appliances.js` | 613 | arrow/expression | Event / Internal | Handles window.confirmDeleteAppliance execution in appliances.js |
| 59 | `app` | `public/js/appliances.js` | 617 | arrow/expression | Event / Internal | Handles app execution in appliances.js |
| 60 | `closeDeleteModal` | `public/js/appliances.js` | 629 | function declaration | Event / Internal | Handles closeDeleteModal execution in appliances.js |
| 61 | `listener_DOMContentLoaded_line_9` | `public/js/auth.js` | 9 | event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_9 execution in auth.js |
| 62 | `setupPasswordVisibilityToggles` | `public/js/auth.js` | 15 | function declaration | Event / Internal | Handles setupPasswordVisibilityToggles execution in auth.js |
| 63 | `listener_click_line_17` | `public/js/auth.js` | 17 | event listener callback | Event / Internal | Handles listener_click_line_17 execution in auth.js |
| 64 | `setupLoginForm` | `public/js/auth.js` | 34 | function declaration | Event / Internal | Handles setupLoginForm execution in auth.js |
| 65 | `listener_submit_line_38` | `public/js/auth.js` | 38 | async event listener callback | Event / Internal | Handles listener_submit_line_38 execution in auth.js |
| 66 | `setupRegisterForm` | `public/js/auth.js` | 92 | function declaration | Event / Internal | Handles setupRegisterForm execution in auth.js |
| 67 | `listener_submit_line_96` | `public/js/auth.js` | 96 | async event listener callback | Event / Internal | Handles listener_submit_line_96 execution in auth.js |
| 68 | `validateEmail` | `public/js/auth.js` | 168 | function declaration | Event / Internal | Handles validateEmail execution in auth.js |
| 69 | `showFieldError` | `public/js/auth.js` | 172 | function declaration | Event / Internal | Handles showFieldError execution in auth.js |
| 70 | `clearFieldError` | `public/js/auth.js` | 186 | function declaration | Event / Internal | Handles clearFieldError execution in auth.js |
| 71 | `getApplianceSvg` | `public/js/components/appliance-illustrations.js` | 194 | function declaration | Event / Internal | Handles getApplianceSvg execution in appliance-illustrations.js |
| 72 | `listener_DOMContentLoaded_line_9` | `public/js/components/editorial-navigation.js` | 9 | event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_9 execution in editorial-navigation.js |
| 73 | `renderFloatingNavigation` | `public/js/components/editorial-navigation.js` | 13 | function declaration | Event / Internal | Handles renderFloatingNavigation execution in editorial-navigation.js |
| 74 | `listener_click_line_76` | `public/js/components/editorial-navigation.js` | 76 | event listener callback | Event / Internal | Handles listener_click_line_76 execution in editorial-navigation.js |
| 75 | `getRoomColor` | `public/js/dashboard.js` | 37 | function declaration | Event / Internal | Handles getRoomColor execution in dashboard.js |
| 76 | `listener_DOMContentLoaded_line_43` | `public/js/dashboard.js` | 43 | async event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_43 execution in dashboard.js |
| 77 | `window.onDataUpdated` | `public/js/dashboard.js` | 48 | arrow/expression | Event / Internal | Handles window.onDataUpdated execution in dashboard.js |
| 78 | `window.onDemoDataUpdated` | `public/js/dashboard.js` | 51 | arrow/expression | Event / Internal | Handles window.onDemoDataUpdated execution in dashboard.js |
| 79 | `setupDashboardActions` | `public/js/dashboard.js` | 56 | function declaration | Event / Internal | Handles setupDashboardActions execution in dashboard.js |
| 80 | `listener_click_line_59` | `public/js/dashboard.js` | 59 | event listener callback | Event / Internal | Handles listener_click_line_59 execution in dashboard.js |
| 81 | `listener_click_line_68` | `public/js/dashboard.js` | 68 | event listener callback | Event / Internal | Handles listener_click_line_68 execution in dashboard.js |
| 82 | `initializeDashboard` | `public/js/dashboard.js` | 80 | async function declaration | Event / Internal | Handles initializeDashboard execution in dashboard.js |
| 83 | `renderModeBadge` | `public/js/dashboard.js` | 113 | function declaration | Event / Internal | Handles renderModeBadge execution in dashboard.js |
| 84 | `showDashboardError` | `public/js/dashboard.js` | 121 | function declaration | Event / Internal | Handles showDashboardError execution in dashboard.js |
| 85 | `clearDashboardError` | `public/js/dashboard.js` | 139 | function declaration | Event / Internal | Handles clearDashboardError execution in dashboard.js |
| 86 | `loadDashboardData` | `public/js/dashboard.js` | 150 | async function declaration | Event / Internal | Handles loadDashboardData execution in dashboard.js |
| 87 | `renderEmptyState` | `public/js/dashboard.js` | 214 | function declaration | Event / Internal | Handles renderEmptyState execution in dashboard.js |
| 88 | `renderDashboardSummary` | `public/js/dashboard.js` | 242 | function declaration | Event / Internal | Handles renderDashboardSummary execution in dashboard.js |
| 89 | `renderConversationalHero` | `public/js/dashboard.js` | 308 | function declaration | Event / Internal | Handles renderConversationalHero execution in dashboard.js |
| 90 | `renderRoomBreakdownTrackAndLegend` | `public/js/dashboard.js` | 362 | function declaration | Event / Internal | Handles renderRoomBreakdownTrackAndLegend execution in dashboard.js |
| 91 | `listener_click_line_385` | `public/js/dashboard.js` | 385 | event listener callback | Event / Internal | Handles listener_click_line_385 execution in dashboard.js |
| 92 | `listener_click_line_396` | `public/js/dashboard.js` | 396 | event listener callback | Event / Internal | Handles listener_click_line_396 execution in dashboard.js |
| 93 | `renderRoomFilterPills` | `public/js/dashboard.js` | 404 | function declaration | Event / Internal | Handles renderRoomFilterPills execution in dashboard.js |
| 94 | `listener_click_line_418` | `public/js/dashboard.js` | 418 | event listener callback | Event / Internal | Handles listener_click_line_418 execution in dashboard.js |
| 95 | `listener_click_line_431` | `public/js/dashboard.js` | 431 | event listener callback | Event / Internal | Handles listener_click_line_431 execution in dashboard.js |
| 96 | `filterApplianceGrid` | `public/js/dashboard.js` | 446 | function declaration | Event / Internal | Handles filterApplianceGrid execution in dashboard.js |
| 97 | `renderApplianceGrid` | `public/js/dashboard.js` | 480 | function declaration | Event / Internal | Handles renderApplianceGrid execution in dashboard.js |
| 98 | `listener_input_line_538` | `public/js/dashboard.js` | 538 | event listener callback | Event / Internal | Handles listener_input_line_538 execution in dashboard.js |
| 99 | `renderBudgetCardAndAlert` | `public/js/dashboard.js` | 551 | function declaration | Event / Internal | Handles renderBudgetCardAndAlert execution in dashboard.js |
| 100 | `renderTopConsumerCard` | `public/js/dashboard.js` | 615 | function declaration | Event / Internal | Handles renderTopConsumerCard execution in dashboard.js |
| 101 | `renderRoomTable` | `public/js/dashboard.js` | 631 | function declaration | Event / Internal | Handles renderRoomTable execution in dashboard.js |
| 102 | `renderEducationalTip` | `public/js/dashboard.js` | 651 | function declaration | Event / Internal | Handles renderEducationalTip execution in dashboard.js |
| 103 | `listener_click_line_682` | `public/js/dashboard.js` | 682 | event listener callback | Event / Internal | Handles listener_click_line_682 execution in dashboard.js |
| 104 | `renderCharts` | `public/js/dashboard.js` | 705 | function declaration | Event / Internal | Handles renderCharts execution in dashboard.js |
| 105 | `listener_DOMContentLoaded_line_13` | `public/js/nav.js` | 13 | async event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_13 execution in nav.js |
| 106 | `highlightActiveNav` | `public/js/nav.js` | 23 | function declaration | Event / Internal | Handles highlightActiveNav execution in nav.js |
| 107 | `checkSessionState` | `public/js/nav.js` | 45 | async function declaration | Event / Internal | Handles checkSessionState execution in nav.js |
| 108 | `renderAuthenticatedHeader` | `public/js/nav.js` | 66 | function declaration | Event / Internal | Handles renderAuthenticatedHeader execution in nav.js |
| 109 | `renderGuestHeader` | `public/js/nav.js` | 123 | function declaration | Event / Internal | Handles renderGuestHeader execution in nav.js |
| 110 | `handleLogout` | `public/js/nav.js` | 143 | async function declaration | Event / Internal | Handles handleLogout execution in nav.js |
| 111 | `setupDemoBannerActions` | `public/js/nav.js` | 158 | function declaration | Event / Internal | Handles setupDemoBannerActions execution in nav.js |
| 112 | `listener_click_line_163` | `public/js/nav.js` | 163 | event listener callback | Event / Internal | Handles listener_click_line_163 execution in nav.js |
| 113 | `listener_click_line_176` | `public/js/nav.js` | 176 | event listener callback | Event / Internal | Handles listener_click_line_176 execution in nav.js |
| 114 | `setupGlobalEscapeHandler` | `public/js/nav.js` | 189 | function declaration | Event / Internal | Handles setupGlobalEscapeHandler execution in nav.js |
| 115 | `listener_keydown_line_190` | `public/js/nav.js` | 190 | event listener callback | Event / Internal | Handles listener_keydown_line_190 execution in nav.js |
| 116 | `escapeHtml` | `public/js/nav.js` | 201 | function declaration | Event / Internal | Handles escapeHtml execution in nav.js |
| 117 | `window.showToast` | `public/js/nav.js` | 211 | arrow/expression | Event / Internal | Handles window.showToast execution in nav.js |
| 118 | `listener_DOMContentLoaded_line_15` | `public/js/reports.js` | 15 | async event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_15 execution in reports.js |
| 119 | `initializeReportsState` | `public/js/reports.js` | 27 | async function declaration | Event / Internal | Handles initializeReportsState execution in reports.js |
| 120 | `renderModeBadge` | `public/js/reports.js` | 58 | function declaration | Event / Internal | Handles renderModeBadge execution in reports.js |
| 121 | `renderErrorBanner` | `public/js/reports.js` | 71 | function declaration | Event / Internal | Handles renderErrorBanner execution in reports.js |
| 122 | `clearErrorBanner` | `public/js/reports.js` | 84 | function declaration | Event / Internal | Handles clearErrorBanner execution in reports.js |
| 123 | `loadReportsData` | `public/js/reports.js` | 95 | async function declaration | Event / Internal | Handles loadReportsData execution in reports.js |
| 124 | `setupEventListeners` | `public/js/reports.js` | 122 | function declaration | Event / Internal | Handles setupEventListeners execution in reports.js |
| 125 | `listener_click_line_138` | `public/js/reports.js` | 138 | event listener callback | Event / Internal | Handles listener_click_line_138 execution in reports.js |
| 126 | `listener_click_line_162` | `public/js/reports.js` | 162 | event listener callback | Event / Internal | Handles listener_click_line_162 execution in reports.js |
| 127 | `listener_click_line_171` | `public/js/reports.js` | 171 | event listener callback | Event / Internal | Handles listener_click_line_171 execution in reports.js |
| 128 | `listener_click_line_183` | `public/js/reports.js` | 183 | event listener callback | Event / Internal | Handles listener_click_line_183 execution in reports.js |
| 129 | `renderSnapshots` | `public/js/reports.js` | 194 | function declaration | Event / Internal | Handles renderSnapshots execution in reports.js |
| 130 | `handleSaveSnapshot` | `public/js/reports.js` | 232 | async function declaration | Event / Internal | Handles handleSaveSnapshot execution in reports.js |
| 131 | `viewSnapshotDetails` | `public/js/reports.js` | 317 | async function declaration | Event / Internal | Handles viewSnapshotDetails execution in reports.js |
| 132 | `snap` | `public/js/reports.js` | 332 | arrow/expression | Event / Internal | Handles snap execution in reports.js |
| 133 | `renderActualBills` | `public/js/reports.js` | 375 | function declaration | Event / Internal | Handles renderActualBills execution in reports.js |
| 134 | `openActualBillModal` | `public/js/reports.js` | 413 | function declaration | Event / Internal | Handles openActualBillModal execution in reports.js |
| 135 | `handleLogActualBill` | `public/js/reports.js` | 418 | async function declaration | Event / Internal | Handles handleLogActualBill execution in reports.js |
| 136 | `deleteActualBill` | `public/js/reports.js` | 481 | async function declaration | Event / Internal | Handles deleteActualBill execution in reports.js |
| 137 | `populateReconcileDropdowns` | `public/js/reports.js` | 504 | function declaration | Event / Internal | Handles populateReconcileDropdowns execution in reports.js |
| 138 | `handleReconcile` | `public/js/reports.js` | 535 | async function declaration | Event / Internal | Handles handleReconcile execution in reports.js |
| 139 | `renderReconciliationView` | `public/js/reports.js` | 619 | function declaration | Event / Internal | Handles renderReconciliationView execution in reports.js |
| 140 | `handleExportCsv` | `public/js/reports.js` | 673 | function declaration | Event / Internal | Handles handleExportCsv execution in reports.js |
| 141 | `listener_DOMContentLoaded_line_17` | `public/js/savings-modal.js` | 17 | event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_17 execution in savings-modal.js |
| 142 | `buildModalDom` | `public/js/savings-modal.js` | 25 | function declaration | Event / Internal | Handles buildModalDom execution in savings-modal.js |
| 143 | `setupEventListeners` | `public/js/savings-modal.js` | 115 | function declaration | Event / Internal | Handles setupEventListeners execution in savings-modal.js |
| 144 | `listener_click_line_124` | `public/js/savings-modal.js` | 124 | event listener callback | Event / Internal | Handles listener_click_line_124 execution in savings-modal.js |
| 145 | `listener_change_line_131` | `public/js/savings-modal.js` | 131 | event listener callback | Event / Internal | Handles listener_change_line_131 execution in savings-modal.js |
| 146 | `listener_input_line_139` | `public/js/savings-modal.js` | 139 | event listener callback | Event / Internal | Handles listener_input_line_139 execution in savings-modal.js |
| 147 | `window.openSavingsModal` | `public/js/savings-modal.js` | 155 | async arrow/expression | Event / Internal | Handles window.openSavingsModal execution in savings-modal.js |
| 148 | `closeSavingsModal` | `public/js/savings-modal.js` | 240 | function declaration | Event / Internal | Handles closeSavingsModal execution in savings-modal.js |
| 149 | `selectAppliance` | `public/js/savings-modal.js` | 246 | function declaration | Event / Internal | Handles selectAppliance execution in savings-modal.js |
| 150 | `updateProposedHours` | `public/js/savings-modal.js` | 261 | function declaration | Event / Internal | Handles updateProposedHours execution in savings-modal.js |
| 151 | `renderScenarioResults` | `public/js/savings-modal.js` | 289 | function declaration | Event / Internal | Handles renderScenarioResults execution in savings-modal.js |
| 152 | `applyScenarioChanges` | `public/js/savings-modal.js` | 348 | async function declaration | Event / Internal | Handles applyScenarioChanges execution in savings-modal.js |
| 153 | `listener_DOMContentLoaded_line_11` | `public/js/settings.js` | 11 | async event listener callback | Event / Internal | Handles listener_DOMContentLoaded_line_11 execution in settings.js |
| 154 | `initializeSettings` | `public/js/settings.js` | 16 | async function declaration | Event / Internal | Handles initializeSettings execution in settings.js |
| 155 | `loadDemoSettings` | `public/js/settings.js` | 35 | function declaration | Event / Internal | Handles loadDemoSettings execution in settings.js |
| 156 | `loadAuthenticatedSettings` | `public/js/settings.js` | 57 | async function declaration | Event / Internal | Handles loadAuthenticatedSettings execution in settings.js |
| 157 | `renderSettingsBadge` | `public/js/settings.js` | 96 | function declaration | Event / Internal | Handles renderSettingsBadge execution in settings.js |
| 158 | `setupEventListeners` | `public/js/settings.js` | 104 | function declaration | Event / Internal | Handles setupEventListeners execution in settings.js |
| 159 | `listener_click_line_116` | `public/js/settings.js` | 116 | event listener callback | Event / Internal | Handles listener_click_line_116 execution in settings.js |
| 160 | `listener_click_line_127` | `public/js/settings.js` | 127 | event listener callback | Event / Internal | Handles listener_click_line_127 execution in settings.js |
| 161 | `listener_click_line_139` | `public/js/settings.js` | 139 | event listener callback | Event / Internal | Handles listener_click_line_139 execution in settings.js |
| 162 | `listener_click_line_146` | `public/js/settings.js` | 146 | event listener callback | Event / Internal | Handles listener_click_line_146 execution in settings.js |
| 163 | `setupPasswordToggles` | `public/js/settings.js` | 158 | function declaration | Event / Internal | Handles setupPasswordToggles execution in settings.js |
| 164 | `listener_click_line_160` | `public/js/settings.js` | 160 | event listener callback | Event / Internal | Handles listener_click_line_160 execution in settings.js |
| 165 | `setupProfileForm` | `public/js/settings.js` | 176 | function declaration | Event / Internal | Handles setupProfileForm execution in settings.js |
| 166 | `listener_submit_line_180` | `public/js/settings.js` | 180 | async event listener callback | Event / Internal | Handles listener_submit_line_180 execution in settings.js |
| 167 | `setupPasswordForm` | `public/js/settings.js` | 247 | function declaration | Event / Internal | Handles setupPasswordForm execution in settings.js |
| 168 | `listener_submit_line_251` | `public/js/settings.js` | 251 | async event listener callback | Event / Internal | Handles listener_submit_line_251 execution in settings.js |
| 169 | `handleSaveSettings` | `public/js/settings.js` | 345 | async function declaration | Event / Internal | Handles handleSaveSettings execution in settings.js |
| 170 | `handleDeleteAccount` | `public/js/settings.js` | 388 | async function declaration | Event / Internal | Handles handleDeleteAccount execution in settings.js |
| 171 | `renderRoomTags` | `public/js/settings.js` | 421 | function declaration | Event / Internal | Handles renderRoomTags execution in settings.js |
| 172 | `loadState` | `public/js/storage.js` | 124 | function declaration | Event / Internal | Handles loadState execution in storage.js |
| 173 | `saveState` | `public/js/storage.js` | 141 | function declaration | Event / Internal | Handles saveState execution in storage.js |
| 174 | `getAppliances` | `public/js/storage.js` | 150 | function declaration | Event / Internal | Handles getAppliances execution in storage.js |
| 175 | `getAppliance` | `public/js/storage.js` | 154 | function declaration | Event / Internal | Handles getAppliance execution in storage.js |
| 176 | `saveAppliance` | `public/js/storage.js` | 159 | function declaration | Event / Internal | Handles saveAppliance execution in storage.js |
| 177 | `deleteAppliance` | `public/js/storage.js` | 184 | function declaration | Event / Internal | Handles deleteAppliance execution in storage.js |
| 178 | `state.appliances` | `public/js/storage.js` | 186 | arrow/expression | Event / Internal | Handles state.appliances execution in storage.js |
| 179 | `getSettings` | `public/js/storage.js` | 192 | function declaration | Event / Internal | Handles getSettings execution in storage.js |
| 180 | `updateSettings` | `public/js/storage.js` | 196 | function declaration | Event / Internal | Handles updateSettings execution in storage.js |
| 181 | `getSnapshots` | `public/js/storage.js` | 204 | function declaration | Event / Internal | Handles getSnapshots execution in storage.js |
| 182 | `saveSnapshot` | `public/js/storage.js` | 208 | function declaration | Event / Internal | Handles saveSnapshot execution in storage.js |
| 183 | `getActualBills` | `public/js/storage.js` | 221 | function declaration | Event / Internal | Handles getActualBills execution in storage.js |
| 184 | `saveActualBill` | `public/js/storage.js` | 225 | function declaration | Event / Internal | Handles saveActualBill execution in storage.js |
| 185 | `deleteActualBill` | `public/js/storage.js` | 237 | function declaration | Event / Internal | Handles deleteActualBill execution in storage.js |
| 186 | `state.actual_bills` | `public/js/storage.js` | 239 | arrow/expression | Event / Internal | Handles state.actual_bills execution in storage.js |
| 187 | `resetToSampleData` | `public/js/storage.js` | 245 | function declaration | Event / Internal | Handles resetToSampleData execution in storage.js |
| 188 | `setEmptyState` | `public/js/storage.js` | 250 | function declaration | Event / Internal | Handles setEmptyState execution in storage.js |
| 189 | `roundTo` | `public/js/utils/calculator.js` | 22 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: roundTo |
| 190 | `calculateDailyKwh` | `public/js/utils/calculator.js` | 34 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: calculateDailyKwh |
| 191 | `calculateMonthlyKwh` | `public/js/utils/calculator.js` | 51 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: calculateMonthlyKwh |
| 192 | `calculateFlatCost` | `public/js/utils/calculator.js` | 67 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: calculateFlatCost |
| 193 | `computeApplianceMetrics` | `public/js/utils/calculator.js` | 84 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: computeApplianceMetrics |
| 194 | `calculateHouseholdTotals` | `public/js/utils/calculator.js` | 116 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: calculateHouseholdTotals |
| 195 | `calculateScenarioDelta` | `public/js/utils/calculator.js` | 227 | function declaration | Frontend UI preview components | Client-side mirror of backend calculation: calculateScenarioDelta |
| 196 | `formatCurrency` | `public/js/utils/formatters.js` | 20 | function declaration | Frontend presentation views | Presentation formatting helper: formatCurrency |
| 197 | `formatKwh` | `public/js/utils/formatters.js` | 34 | function declaration | Frontend presentation views | Presentation formatting helper: formatKwh |
| 198 | `formatHours` | `public/js/utils/formatters.js` | 47 | function declaration | Frontend presentation views | Presentation formatting helper: formatHours |
| 199 | `escapeHtml` | `public/js/utils/formatters.js` | 57 | function declaration | Frontend presentation views | Presentation formatting helper: escapeHtml |
| 200 | `sanitizeCsvCell` | `public/js/utils/formatters.js` | 72 | function declaration | Frontend presentation views | Presentation formatting helper: sanitizeCsvCell |
| 201 | `createApp` | `src/app.js` | 26 | function declaration | Event / Internal | Handles createApp execution in app.js |
| 202 | `getPool` | `src/config/database.js` | 15 | function declaration | Event / Internal | Handles getPool execution in database.js |
| 203 | `checkConnection` | `src/config/database.js` | 37 | async function declaration | Event / Internal | Handles checkConnection execution in database.js |
| 204 | `closePool` | `src/config/database.js` | 58 | async function declaration | Event / Internal | Handles closePool execution in database.js |
| 205 | `validateApplianceInput` | `src/controllers/applianceController.js` | 17 | function declaration | createAppliance, updateAppliance, previewAppliance | Validates appliance name, category, room, wattage (1-10000), quantity (1-50), hours (0.1-24), days (1-31) |
| 206 | `getUserRate` | `src/controllers/applianceController.js` | 101 | async function declaration | listAppliances, createAppliance, updateAppliance, previewAppliance | Retrieves active user tariff rate from user_settings or defaults to 8.0 |
| 207 | `listAppliances` | `src/controllers/applianceController.js` | 117 | async function declaration | GET /api/appliances route | Queries appliances table with user_id binding, room/category filtering, and sorting |
| 208 | `createAppliance` | `src/controllers/applianceController.js` | 196 | async function declaration | POST /api/appliances route | Enforces 100-item ceiling, validates input, inserts appliance row into MySQL |
| 209 | `updateAppliance` | `src/controllers/applianceController.js` | 262 | async function declaration | PUT /api/appliances/:id route | Verifies appliance ownership, updates attributes in MySQL |
| 210 | `deleteAppliance` | `src/controllers/applianceController.js` | 333 | async function declaration | DELETE /api/appliances/:id route | Verifies appliance ownership, deletes row from MySQL |
| 211 | `previewAppliance` | `src/controllers/applianceController.js` | 371 | async function declaration | POST /api/appliances/preview route | Computes stateless consumption preview without mutating database |
| 212 | `normalizeEmail` | `src/controllers/authController.js` | 19 | function declaration | register, login | Trims whitespace and converts email string to lowercase |
| 213 | `validatePassword` | `src/controllers/authController.js` | 27 | function declaration | register, changePassword | Enforces password length (min 8 chars) and character complexity |
| 214 | `regenerateSession` | `src/controllers/authController.js` | 41 | function declaration | register, login | Wraps req.session.regenerate() in a Promise to defend against session fixation |
| 215 | `saveSession` | `src/controllers/authController.js` | 53 | function declaration | register, login | Wraps req.session.save() in a Promise to commit session to MySQL |
| 216 | `destroySession` | `src/controllers/authController.js` | 65 | function declaration | logout, deleteAccount | Wraps req.session.destroy() in a Promise to purge session from MySQL |
| 217 | `register` | `src/controllers/authController.js` | 78 | async function declaration | POST /api/auth/register route | Validates user input, hashes password with bcrypt, inserts into users, initializes user_settings, binds session |
| 218 | `login` | `src/controllers/authController.js` | 185 | async function declaration | POST /api/auth/login route | Validates credentials against MySQL users, regenerates session, returns user identity |
| 219 | `logout` | `src/controllers/authController.js` | 248 | async function declaration | POST /api/auth/logout route | Destroys session in MySQL sessions table, clears energysaver_sid cookie |
| 220 | `getCurrentUser` | `src/controllers/authController.js` | 271 | async function declaration | GET /api/auth/me route | Fetches authenticated user identity (id, email, display_name) from MySQL |
| 221 | `updateProfile` | `src/controllers/authController.js` | 299 | async function declaration | PUT /api/auth/profile route | Updates user display_name in MySQL users table |
| 222 | `changePassword` | `src/controllers/authController.js` | 338 | async function declaration | PUT /api/auth/password route | Verifies current password, hashes new password with bcrypt, updates users table |
| 223 | `deleteAccount` | `src/controllers/authController.js` | 410 | async function declaration | POST /api/auth/delete-account route | Cascades deletion of user, settings, appliances, snapshots, and bills from MySQL |
| 224 | `getSummary` | `src/controllers/dashboardController.js` | 16 | async function declaration | Event / Internal | Handles getSummary execution in dashboardController.js |
| 225 | `isValidDate` | `src/controllers/reportController.js` | 17 | function declaration | Event / Internal | Handles isValidDate execution in reportController.js |
| 226 | `sanitizeCsvCell` | `src/controllers/reportController.js` | 31 | function declaration | Event / Internal | Handles sanitizeCsvCell execution in reportController.js |
| 227 | `saveSnapshot` | `src/controllers/reportController.js` | 48 | async function declaration | Event / Internal | Handles saveSnapshot execution in reportController.js |
| 228 | `listSnapshots` | `src/controllers/reportController.js` | 185 | async function declaration | Event / Internal | Handles listSnapshots execution in reportController.js |
| 229 | `getSnapshotDetails` | `src/controllers/reportController.js` | 227 | async function declaration | Event / Internal | Handles getSnapshotDetails execution in reportController.js |
| 230 | `logActualBill` | `src/controllers/reportController.js` | 307 | async function declaration | Event / Internal | Handles logActualBill execution in reportController.js |
| 231 | `listActualBills` | `src/controllers/reportController.js` | 378 | async function declaration | Event / Internal | Handles listActualBills execution in reportController.js |
| 232 | `deleteActualBill` | `src/controllers/reportController.js` | 418 | async function declaration | Event / Internal | Handles deleteActualBill execution in reportController.js |
| 233 | `reconcileBill` | `src/controllers/reportController.js` | 456 | async function declaration | Event / Internal | Handles reconcileBill execution in reportController.js |
| 234 | `exportCsv` | `src/controllers/reportController.js` | 568 | async function declaration | Event / Internal | Handles exportCsv execution in reportController.js |
| 235 | `validateModifications` | `src/controllers/savingsController.js` | 18 | function declaration | Event / Internal | Handles validateModifications execution in savingsController.js |
| 236 | `simulateSavings` | `src/controllers/savingsController.js` | 64 | async function declaration | Event / Internal | Handles simulateSavings execution in savingsController.js |
| 237 | `applySavings` | `src/controllers/savingsController.js` | 148 | async function declaration | Event / Internal | Handles applySavings execution in savingsController.js |
| 238 | `getSettings` | `src/controllers/settingsController.js` | 13 | async function declaration | Event / Internal | Handles getSettings execution in settingsController.js |
| 239 | `updateSettings` | `src/controllers/settingsController.js` | 71 | async function declaration | Event / Internal | Handles updateSettings execution in settingsController.js |
| 240 | `requireAuth` | `src/middleware/auth.js` | 6 | function declaration | Protected Express routes | Checks req.session.userId; returns HTTP 401 if unauthenticated |
| 241 | `apiNotFoundHandler` | `src/middleware/errorHandler.js` | 11 | function declaration | Express 404 middleware | Returns uniform JSON 404 error response for undefined API endpoints |
| 242 | `globalErrorHandler` | `src/middleware/errorHandler.js` | 28 | function declaration | Express error middleware | Catches unhandled errors, logs stack, emits sanitized JSON error response |
| 243 | `csrfTokenProvider` | `src/middleware/security.js` | 14 | function declaration | GET /api/csrf-token route | Generates 32-byte crypto hex token in session and emits in JSON response |
| 244 | `csrfProtection` | `src/middleware/security.js` | 40 | function declaration | State-mutating routes (POST/PUT/DELETE) | Validates X-CSRF-Token header against session token; rejects with 403 on mismatch |
| 245 | `resetRateLimits` | `src/middleware/security.js` | 95 | function declaration | Test cleanup and login success | Clears rate limit state for an IP address |
| 246 | `authRateLimiter` | `src/middleware/security.js` | 103 | function declaration | POST /api/auth/login route | Restricts failed login attempts to 5 per 15 mins per IP with memory pruning |
| 247 | `runCheck` | `src/scripts/dbCheck.js` | 9 | async function declaration | Event / Internal | Handles runCheck execution in dbCheck.js |
| 248 | `runInit` | `src/scripts/initDb.js` | 12 | async function declaration | Event / Internal | Handles runInit execution in initDb.js |
| 249 | `gracefulShutdown` | `src/server.js` | 29 | async function declaration | Event / Internal | Handles gracefulShutdown execution in server.js |
| 250 | `roundTo` | `src/services/calculator.js` | 21 | function declaration | All calculator functions | Performs exponential-shift half-up rounding avoiding binary floating point flaws |
| 251 | `calculateDailyKwh` | `src/services/calculator.js` | 34 | function declaration | computeApplianceMetrics | Calculates unrounded daily kWh via (Watts * Quantity * Hours) / 1000 |
| 252 | `calculateMonthlyKwh` | `src/services/calculator.js` | 53 | function declaration | computeApplianceMetrics | Calculates unrounded monthly kWh via Daily kWh * Days |
| 253 | `calculateFlatCost` | `src/services/calculator.js` | 70 | function declaration | computeApplianceMetrics | Calculates unrounded flat-rate cost via Monthly kWh * Tariff Rate |
| 254 | `computeApplianceMetrics` | `src/services/calculator.js` | 87 | function declaration | calculateHouseholdTotals | Augments appliance object with daily_kwh, monthly_kwh, and monthly_cost |
| 255 | `calculateHouseholdTotals` | `src/services/calculator.js` | 120 | function declaration | dashboardController, calculateScenarioDelta | Computes household total kWh, bill, budget variance, top consumer, and room breakdown |
| 256 | `calculateScenarioDelta` | `src/services/calculator.js` | 234 | function declaration | savingsController.simulateSavings | Calculates precise unrounded delta savings between baseline and proposed scenarios |
| 257 | `findChromePath` | `test/browser.test.js` | 18 | function declaration | Event / Internal | Handles findChromePath execution in browser.test.js |
| 258 | `sendCdp` | `test/browser.test.js` | 46 | function declaration | Event / Internal | Handles sendCdp execution in browser.test.js |
| 259 | `sleep` | `test/browser.test.js` | 69 | async function declaration | Event / Internal | Handles sleep execution in browser.test.js |
| 260 | `checkServerReady` | `test/browser.test.js` | 73 | async function declaration | Event / Internal | Handles checkServerReady execution in browser.test.js |
| 261 | `runBrowserVerification` | `test/browser.test.js` | 86 | async function declaration | Event / Internal | Handles runBrowserVerification execution in browser.test.js |
| 262 | `recordResult` | `test/browser.test.js` | 125 | function declaration | Event / Internal | Handles recordResult execution in browser.test.js |
| 263 | `listener_message_line_155` | `test/browser.test.js` | 155 | event listener callback | Event / Internal | Handles listener_message_line_155 execution in browser.test.js |
| 264 | `navigate` | `test/browser.test.js` | 167 | async function declaration | Event / Internal | Handles navigate execution in browser.test.js |
| 265 | `setViewport` | `test/browser.test.js` | 173 | async function declaration | Event / Internal | Handles setViewport execution in browser.test.js |
| 266 | `takeScreenshot` | `test/browser.test.js` | 184 | async function declaration | Event / Internal | Handles takeScreenshot execution in browser.test.js |
| 267 | `evalJs` | `test/browser.test.js` | 192 | async function declaration | Event / Internal | Handles evalJs execution in browser.test.js |
| 268 | `runCalculationTests` | `test/calculations.test.js` | 12 | function declaration | Event / Internal | Handles runCalculationTests execution in calculations.test.js |
| 269 | `assert` | `test/calculations.test.js` | 21 | function declaration | Event / Internal | Handles assert execution in calculations.test.js |
| 270 | `reportOutOfScope` | `test/calculations.test.js` | 31 | function declaration | Event / Internal | Handles reportOutOfScope execution in calculations.test.js |
| 271 | `runTests` | `test/phase2.test.js` | 17 | async function declaration | Event / Internal | Handles runTests execution in phase2.test.js |
| 272 | `assert` | `test/phase2.test.js` | 34 | function declaration | Event / Internal | Handles assert execution in phase2.test.js |
| 273 | `fetchHttp` | `test/phase2.test.js` | 45 | function declaration | Event / Internal | Handles fetchHttp execution in phase2.test.js |
| 274 | `runPhase3Tests` | `test/phase3.test.js` | 19 | async function declaration | Event / Internal | Handles runPhase3Tests execution in phase3.test.js |
| 275 | `assert` | `test/phase3.test.js` | 36 | function declaration | Event / Internal | Handles assert execution in phase3.test.js |
| 276 | `makeSessionClient` | `test/phase3.test.js` | 47 | function declaration | Event / Internal | Handles makeSessionClient execution in phase3.test.js |
| 277 | `request` | `test/phase3.test.js` | 51 | method | Event / Internal | Handles request execution in phase3.test.js |
| 278 | `cookieJar` | `test/phase3.test.js` | 72 | arrow/expression | Event / Internal | Handles cookieJar execution in phase3.test.js |
| 279 | `runPhase4Tests` | `test/phase4.test.js` | 19 | async function declaration | Event / Internal | Handles runPhase4Tests execution in phase4.test.js |
| 280 | `assert` | `test/phase4.test.js` | 27 | function declaration | Event / Internal | Handles assert execution in phase4.test.js |
| 281 | `makeClient` | `test/phase4.test.js` | 130 | function declaration | Event / Internal | Handles makeClient execution in phase4.test.js |
| 282 | `request` | `test/phase4.test.js` | 134 | method | Event / Internal | Handles request execution in phase4.test.js |
| 283 | `cookieJar` | `test/phase4.test.js` | 154 | arrow/expression | Event / Internal | Handles cookieJar execution in phase4.test.js |
| 284 | `runPhase5Tests` | `test/phase5.test.js` | 21 | async function declaration | Event / Internal | Handles runPhase5Tests execution in phase5.test.js |
| 285 | `assert` | `test/phase5.test.js` | 29 | function declaration | Event / Internal | Handles assert execution in phase5.test.js |
| 286 | `makeClient` | `test/phase5.test.js` | 49 | function declaration | Event / Internal | Handles makeClient execution in phase5.test.js |
| 287 | `request` | `test/phase5.test.js` | 53 | method | Event / Internal | Handles request execution in phase5.test.js |
| 288 | `cookieJar` | `test/phase5.test.js` | 73 | arrow/expression | Event / Internal | Handles cookieJar execution in phase5.test.js |
| 289 | `findChromePath` | `test/post_redesign_audit.test.js` | 29 | function declaration | Event / Internal | Handles findChromePath execution in post_redesign_audit.test.js |
| 290 | `sendCdp` | `test/post_redesign_audit.test.js` | 57 | function declaration | Event / Internal | Handles sendCdp execution in post_redesign_audit.test.js |
| 291 | `sleep` | `test/post_redesign_audit.test.js` | 80 | function declaration | Event / Internal | Handles sleep execution in post_redesign_audit.test.js |
| 292 | `runAudit` | `test/post_redesign_audit.test.js` | 84 | async function declaration | Event / Internal | Handles runAudit execution in post_redesign_audit.test.js |
| 293 | `record` | `test/post_redesign_audit.test.js` | 113 | function declaration | Event / Internal | Handles record execution in post_redesign_audit.test.js |
| 294 | `listener_message_line_139` | `test/post_redesign_audit.test.js` | 139 | async event listener callback | Event / Internal | Handles listener_message_line_139 execution in post_redesign_audit.test.js |
| 295 | `navigate` | `test/post_redesign_audit.test.js` | 156 | async function declaration | Event / Internal | Handles navigate execution in post_redesign_audit.test.js |
| 296 | `setViewport` | `test/post_redesign_audit.test.js` | 161 | async function declaration | Event / Internal | Handles setViewport execution in post_redesign_audit.test.js |
| 297 | `takeScreenshot` | `test/post_redesign_audit.test.js` | 171 | async function declaration | Event / Internal | Handles takeScreenshot execution in post_redesign_audit.test.js |
| 298 | `evalJs` | `test/post_redesign_audit.test.js` | 178 | async function declaration | Event / Internal | Handles evalJs execution in post_redesign_audit.test.js |
| 299 | `runSecurityTests` | `test/security.test.js` | 23 | async function declaration | Event / Internal | Handles runSecurityTests execution in security.test.js |
| 300 | `assert` | `test/security.test.js` | 31 | function declaration | Event / Internal | Handles assert execution in security.test.js |
| 301 | `createClient` | `test/security.test.js` | 48 | function declaration | Event / Internal | Handles createClient execution in security.test.js |
| 302 | `getCookieJar` | `test/security.test.js` | 52 | method | Event / Internal | Handles getCookieJar execution in security.test.js |
| 303 | `setCookieJar` | `test/security.test.js` | 55 | method | Event / Internal | Handles setCookieJar execution in security.test.js |
| 304 | `request` | `test/security.test.js` | 58 | method | Event / Internal | Handles request execution in security.test.js |
| 305 | `cookieJar` | `test/security.test.js` | 80 | arrow/expression | Event / Internal | Handles cookieJar execution in security.test.js |
| 306 | `runStage0Tests` | `test/stage0.test.js` | 20 | async function declaration | Event / Internal | Handles runStage0Tests execution in stage0.test.js |
| 307 | `assert` | `test/stage0.test.js` | 28 | function declaration | Event / Internal | Handles assert execution in stage0.test.js |
| 308 | `makeClient` | `test/stage0.test.js` | 83 | function declaration | Event / Internal | Handles makeClient execution in stage0.test.js |
| 309 | `request` | `test/stage0.test.js` | 87 | method | Event / Internal | Handles request execution in stage0.test.js |
| 310 | `cookieJar` | `test/stage0.test.js` | 107 | arrow/expression | Event / Internal | Handles cookieJar execution in stage0.test.js |

---

## 4.2 Individual Function Deep-Dive Analysis

### 4.2.1 Function: `calculateDailyKwh()`

#### A. Basic Information
- **Function Name:** `calculateDailyKwh`
- **File Path:** `src/services/calculator.js`
- **Line Number:** Line 34
- **Function Type:** Synchronous pure function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Calculates how much electrical energy in kilowatt-hours (kWh) an appliance uses in one day based on its power rating in watts, the quantity of identical appliances, and operating hours.

#### C. Technical Explanation
Validates that watts, quantity, and hours are finite positive numbers. Implements the fundamental electrical engineering formula \(E = (P \times Q \times t) / 1000\). Returns an unrounded 64-bit IEEE-754 double precision float to avoid premature rounding error.

#### D. Parameters
- `watts` (*number|string*): Rated wattage of the appliance (1 to 10000)
- `quantity` (*number|string*): Number of identical units in use (1 to 50)
- `hours` (*number|string*): Daily operating hours (0.1 to 24.0)

#### E. Return Value
number — Unrounded daily energy consumption in kilowatt-hours (kWh). Returns 0 if inputs are invalid or <= 0.

#### F. Step-by-Step Execution Order
1. Coerce watts, quantity, and hours to numbers via Number().
2. Validate that all three values are finite via Number.isFinite().
3. Verify that all values are strictly positive (> 0); otherwise return 0 immediately.
4. Multiply (w * q * h) to get total watt-hours per day.
5. Divide by 1000 to convert watt-hours to kilowatt-hours.
6. Return the resulting raw floating-point number.

#### G. Calls & Dependencies
- **Called By:** computeApplianceMetrics() in src/services/calculator.js
- **Calls:** None (Pure mathematical function)

#### H. Database Operations
None (In-memory calculation)

#### I. Real Example
```text
calculateDailyKwh(1500, 1, 6) -> returns 9.0 kWh/day (for a 1500W air conditioner running 6 hours/day).
```

#### J. Error Handling
Handles NaN, Infinity, negative values, and non-numeric strings safely by returning 0 without throwing exceptions.

#### K. Security Relevance
Ensures no invalid mathematical states (NaN or Infinity) corrupt downstream database writes or financial aggregations.

#### L. Viva Spoken Answer
> "calculateDailyKwh takes rated wattage, quantity, and daily operating hours, multiplies them to compute watt-hours, and divides by 1000 to return daily kilowatt-hours. It does not round intermediate results so that monthly totals remain mathematically exact."

#### M. Related Viva Questions
- **Q:** Why do we divide by 1000 in this formula? (Answer: Because 1 kilowatt equals 1000 watts, and utility billing is measured in kilowatt-hours).
- **Q:** Why is the return value left unrounded? (Answer: To avoid cumulative 1-paisa rounding errors when summing multiple appliances over 30 days).

#### N. Source Code Excerpt
```javascript
function calculateDailyKwh(watts, quantity, hours) {
  const w = Number(watts);
  const q = Number(quantity);
  const h = Number(hours);

  if (!Number.isFinite(w) || !Number.isFinite(q) || !Number.isFinite(h)) return 0;
  if (w <= 0 || q <= 0 || h <= 0) return 0;

  return (w * q * h) / 1000;
}
```

---

### 4.2.2 Function: `calculateMonthlyKwh()`

#### A. Basic Information
- **Function Name:** `calculateMonthlyKwh`
- **File Path:** `src/services/calculator.js`
- **Line Number:** Line 53
- **Function Type:** Synchronous pure function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Multiplies daily kilowatt-hours by the number of days the appliance operates in a month (typically 30 days) to get total monthly energy consumption.

#### C. Technical Explanation
Multiplies unrounded daily kWh by active days per month (1 to 31). Enforces positive bounds and returns full floating point precision.

#### D. Parameters
- `dailyKwh` (*number|string*): Daily energy consumption in kWh
- `days` (*number|string*): Days active in the billing month (1 to 31)

#### E. Return Value
number — Total monthly energy consumption in kilowatt-hours (kWh).

#### F. Step-by-Step Execution Order
1. Convert dailyKwh and days to numeric types.
2. Check that both numbers are finite and strictly greater than zero.
3. Compute dailyKwh * days.
4. Return unrounded monthly kWh.

#### G. Calls & Dependencies
- **Called By:** computeApplianceMetrics()
- **Calls:** None

#### H. Database Operations
None

#### I. Real Example
```text
calculateMonthlyKwh(9.0, 30) -> returns 270.0 kWh/month.
```

#### J. Error Handling
Returns 0 for negative, non-numeric, or null inputs.

#### K. Security Relevance
Guards against arithmetic exceptions.

#### L. Viva Spoken Answer
> "calculateMonthlyKwh computes total monthly consumption by multiplying daily kWh by active days per month. It supports appliances that do not run every day, such as a washing machine running 12 days a month."

#### M. Related Viva Questions
- **Q:** How does the application support appliances not used every day? (Answer: By allowing days_used_per_month between 1 and 31 instead of assuming a constant 30 days).

#### N. Source Code Excerpt
```javascript
function calculateMonthlyKwh(dailyKwh, days) {
  const dKwh = Number(dailyKwh);
  const d = Number(days);

  if (!Number.isFinite(dKwh) || !Number.isFinite(d)) return 0;
  if (dKwh <= 0 || d <= 0) return 0;

  return dKwh * d;
}
```

---

### 4.2.3 Function: `calculateFlatCost()`

#### A. Basic Information
- **Function Name:** `calculateFlatCost`
- **File Path:** `src/services/calculator.js`
- **Line Number:** Line 70
- **Function Type:** Synchronous pure function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Calculates the estimated monetary cost by multiplying total monthly kilowatt-hours by the user's electricity tariff rate (e.g. ₹8.00 per kWh).

#### C. Technical Explanation
Implements linear flat-rate cost evaluation: \(\text{Cost} = \text{Monthly kWh} \times \text{Rate}\). Retains full unrounded precision.

#### D. Parameters
- `monthlyKwh` (*number|string*): Monthly electricity consumption in kWh
- `ratePerKwh` (*number|string*): Cost per unit in rupees (e.g. 8.00)

#### E. Return Value
number — Unrounded monthly electricity cost in rupees.

#### F. Step-by-Step Execution Order
1. Convert inputs to numbers via Number().
2. Validate that inputs are finite and > 0.
3. Multiply monthlyKwh by ratePerKwh.
4. Return the raw cost product.

#### G. Calls & Dependencies
- **Called By:** computeApplianceMetrics()
- **Calls:** None

#### H. Database Operations
None

#### I. Real Example
```text
calculateFlatCost(270.0, 8.0) -> returns 2160.0 (₹2,160.00).
```

#### J. Error Handling
Returns 0 on invalid or non-numeric arguments.

#### K. Security Relevance
Prevents negative billing amounts.

#### L. Viva Spoken Answer
> "calculateFlatCost multiplies monthly kilowatt-hours by the flat tariff rate to determine the estimated monthly cost for an appliance or entire household."

#### M. Related Viva Questions
- **Q:** What type of tariff does the core release implement? (Answer: Flat-rate tariff where every unit costs a fixed rate, defaulting to ₹8.00/kWh).

#### N. Source Code Excerpt
```javascript
function calculateFlatCost(monthlyKwh, ratePerKwh) {
  const kwh = Number(monthlyKwh);
  const rate = Number(ratePerKwh);

  if (!Number.isFinite(kwh) || !Number.isFinite(rate)) return 0;
  if (kwh <= 0 || rate <= 0) return 0;

  return kwh * rate;
}
```

---

### 4.2.4 Function: `calculateHouseholdTotals()`

#### A. Basic Information
- **Function Name:** `calculateHouseholdTotals`
- **File Path:** `src/services/calculator.js`
- **Line Number:** Line 120
- **Function Type:** Synchronous aggregator function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Takes all appliances in a household, computes their individual consumption, and calculates aggregate metrics: total monthly kWh, total estimated bill, room-by-room breakdown, top consuming appliance, and budget status (Normal, Approaching, or Over Budget).

#### C. Technical Explanation
Iterates through an array of appliance records. Maintains running accumulators for total kWh and total cost while grouping by room into a dictionary. Computes room percentage shares and sorts descending. Evaluates budget utilization against monthly budget target. Returns an enriched summary object.

#### D. Parameters
- `appliances` (*Array*): Array of appliance database records
- `ratePerKwh` (*number|string*): Active electricity tariff rate
- `monthlyBudget` (*number|string*): Target monthly budget in currency
- `options` (*Object*): Options object, e.g. { round: true }

#### E. Return Value
Object — Comprehensive household overview containing total_monthly_kwh, total_monthly_cost, budget_status, highest_consumer, room_breakdown, and top_appliances.

#### F. Step-by-Step Execution Order
1. Initialize running accumulators totalMonthlyKwh = 0, totalMonthlyCost = 0, and roomMap = {}.
2. For each appliance, call computeApplianceMetrics() keeping values unrounded.
3. Accumulate individual appliance kWh and cost into household totals.
4. Group appliance data into roomMap by room name, tracking appliance count, room kWh, and room cost.
5. Convert roomMap into an array and compute each room's percentage of total household kWh.
6. Sort rooms descending by monthly kWh.
7. Identify the highest consumer appliance and calculate its percentage share.
8. Evaluate budget status: OVER_BUDGET (>100%), APPROACHING_BUDGET (>=80%), NORMAL (<80%), or NO_BUDGET_SET (budget <= 0).
9. Optionally round output metrics to 2 decimal places if options.round is true.
10. Return the complete summary object.

#### G. Calls & Dependencies
- **Called By:** dashboardController.getSummary(), savingsController.simulateSavings(), calculateScenarioDelta()
- **Calls:** computeApplianceMetrics(), roundTo()

#### H. Database Operations
None (Operates on memory data)

#### I. Real Example
```text
calculateHouseholdTotals(appliances, 8.0, 3500) -> returns { total_monthly_kwh: 322.8, total_monthly_cost: 2582.4, budget_status: "NORMAL", highest_consumer: { name: "Water Heater", monthly_kwh: 180, percentage: 55.76 } }
```

#### J. Error Handling
Handles empty appliance lists gracefully, returning 0 totals, null highest consumer, and empty room breakdown.

#### K. Security Relevance
Guards against division-by-zero errors when totalMonthlyKwh is zero.

#### L. Viva Spoken Answer
> "calculateHouseholdTotals is the central aggregation function of EnergySaver. It iterates through the household inventory, computes room consumption percentages, pinpoints the biggest electricity consumer, and evaluates whether the user is approaching or exceeding their monthly budget."

#### M. Related Viva Questions
- **Q:** What are the three budget threshold states? (Answer: NORMAL when spending is under 80%, APPROACHING_BUDGET between 80% and 100%, and OVER_BUDGET when exceeding 100%).
- **Q:** How does it prevent division by zero if a user has zero appliances? (Answer: It explicitly checks if totalMonthlyKwh > 0 before computing room and highest consumer percentages).

#### N. Source Code Excerpt
```javascript
function calculateHouseholdTotals(appliances, ratePerKwh, monthlyBudget, options = {}) {
  // Aggregates totals, room breakdowns, top consumer, and budget status
  // Full implementation shown in src/services/calculator.js lines 120-223
}
```

---

### 4.2.5 Function: `calculateScenarioDelta()`

#### A. Basic Information
- **Function Name:** `calculateScenarioDelta`
- **File Path:** `src/services/calculator.js`
- **Line Number:** Line 234
- **Function Type:** Synchronous comparison function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Compares a user's existing baseline appliance usage against proposed changes (from the What-If savings slider) and calculates exact kilowatt-hours saved and money saved per month.

#### C. Technical Explanation
Invokes calculateHouseholdTotals for baseline and proposed appliance inventories using unrounded options. Computes rawSavedKwh = unroundedBaseline.total_monthly_kwh - unroundedProposed.total_monthly_kwh and rawSavedCost = unroundedBaseline.total_monthly_cost - unroundedProposed.total_monthly_cost. Rounds only the final difference to eliminate cumulative rounding discrepancies.

#### D. Parameters
- `baselineAppliances` (*Array*): Current saved appliance records
- `proposedAppliances` (*Array*): Appliances with proposed runtime modifications
- `ratePerKwh` (*number|string*): Tariff rate
- `monthlyBudget` (*number|string*): Budget target
- `options` (*Object*): { round: boolean }

#### E. Return Value
Object — { baseline, proposed, saved_kwh, saved_cost, is_savings }

#### F. Step-by-Step Execution Order
1. Compute baseline and proposed totals.
2. Compute unrounded totals for baseline and proposed scenarios.
3. Subtract proposed unrounded monthly kWh from baseline unrounded monthly kWh.
4. Subtract proposed unrounded monthly cost from baseline unrounded monthly cost.
5. Round the delta values to 2 decimal places if options.round is true.
6. Return the delta object with an is_savings boolean flag.

#### G. Calls & Dependencies
- **Called By:** savingsController.simulateSavings()
- **Calls:** calculateHouseholdTotals(), roundTo()

#### H. Database Operations
None

#### I. Real Example
```text
calculateScenarioDelta(baseline, proposed, 8.0, 3500) -> returns { saved_kwh: 60.00, saved_cost: 480.00, is_savings: true }
```

#### J. Error Handling
Handles cases where proposed usage is higher than baseline (negative savings, is_savings: false).

#### K. Security Relevance
Ensures accurate financial simulation without database mutation.

#### L. Viva Spoken Answer
> "calculateScenarioDelta powers the What-If Savings Planner. It calculates the difference between current consumption and hypothetical proposed runtimes, computing exact kilowatt-hours and rupees saved per month."

#### M. Related Viva Questions
- **Q:** What was the cumulative rounding discrepancy resolved in this function? (Answer: Previously, subtracting already rounded numbers could introduce a 1-paisa variance; now unrounded totals are subtracted first before rounding).

#### N. Source Code Excerpt
```javascript
function calculateScenarioDelta(baselineAppliances, proposedAppliances, ratePerKwh, monthlyBudget, options = {}) {
  const shouldRound = options.round === true;
  const baseline = calculateHouseholdTotals(baselineAppliances, ratePerKwh, monthlyBudget, options);
  const proposed = calculateHouseholdTotals(proposedAppliances, ratePerKwh, monthlyBudget, options);

  const unroundedBaseline = calculateHouseholdTotals(baselineAppliances, ratePerKwh, monthlyBudget, { round: false });
  const unroundedProposed = calculateHouseholdTotals(proposedAppliances, ratePerKwh, monthlyBudget, { round: false });

  const rawSavedKwh = unroundedBaseline.total_monthly_kwh - unroundedProposed.total_monthly_kwh;
  const rawSavedCost = unroundedBaseline.total_monthly_cost - unroundedProposed.total_monthly_cost;

  return {
    baseline,
    proposed,
    saved_kwh: shouldRound ? roundTo(rawSavedKwh, 2) : rawSavedKwh,
    saved_cost: shouldRound ? roundTo(rawSavedCost, 2) : rawSavedCost,
    is_savings: rawSavedCost > 0
  };
}
```

---

### 4.2.6 Function: `requireAuth()`

#### A. Basic Information
- **Function Name:** `requireAuth`
- **File Path:** `src/middleware/auth.js`
- **Line Number:** Line 6
- **Function Type:** Express middleware function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Checks if an incoming HTTP request belongs to a logged-in user. If the user is logged in, it lets the request continue; if not, it blocks the request and returns an HTTP 401 Unauthorized error.

#### C. Technical Explanation
Inspects req.session to verify whether req.session.userId is populated. If truthy, invokes next() to pass execution to the next middleware or controller. If missing or falsy, halts request processing and returns HTTP 401 with a standardized JSON error envelope: { success: false, error: { code: "UNAUTHORIZED", message: "..." } }.

#### D. Parameters
- `req` (*Express.Request*): Incoming HTTP request with session attached
- `res` (*Express.Response*): HTTP response object
- `next` (*Function*): Next middleware callback in Express pipeline

#### E. Return Value
void (Calls next() or emits HTTP 401 JSON response)

#### F. Step-by-Step Execution Order
1. Inspect req.session to check if session object exists.
2. Check if req.session.userId is defined and truthy.
3. If present, call next() to proceed.
4. If absent, return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required to access this resource." } }).

#### G. Calls & Dependencies
- **Called By:** Protected Express routes in src/app.js (e.g. /api/appliances, /api/settings, /api/dashboard/*)
- **Calls:** next()

#### H. Database Operations
Implicitly validates against sessions table via express-session

#### I. Real Example
```text
GET /api/appliances without session cookie -> returns HTTP 401 {"success": false, "error": {"code": "UNAUTHORIZED", ...}}
```

#### J. Error Handling
Prevents unauthenticated access across all private REST endpoints.

#### K. Security Relevance
Foundational authorization barrier; enforces session-based access control and prevents unauthorized access to private personal appliances and settings.

#### L. Viva Spoken Answer
> "requireAuth is our session guard middleware. It checks whether req.session.userId exists. If it does, the user is authorized to proceed; otherwise, it stops the request and returns an HTTP 401 Unauthorized status."

#### M. Related Viva Questions
- **Q:** Where is the user ID stored during a session? (Answer: In req.session.userId on the server, which is backed by the sessions table in MySQL).
- **Q:** What happens if an unauthenticated user tries to fetch private appliances? (Answer: requireAuth rejects the request immediately with HTTP 401 before any database query executes).

#### N. Source Code Excerpt
```javascript
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required to access this resource.'
      }
    });
  }
  next();
}
```

---

### 4.2.7 Function: `csrfProtection()`

#### A. Basic Information
- **Function Name:** `csrfProtection`
- **File Path:** `src/middleware/security.js`
- **Line Number:** Line 40
- **Function Type:** Express middleware function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Protects the application from Cross-Site Request Forgery (CSRF) attacks. It verifies that every state-changing request (POST, PUT, DELETE) includes a secret anti-CSRF token that matches the token in the user's active session.

#### C. Technical Explanation
Exempts safe HTTP methods (GET, HEAD, OPTIONS). For state-mutating requests, extracts the token from req.headers["x-csrf-token"], req.body._csrf, or req.query._csrf. Validates that the session token exists and performs constant-time comparison via crypto.timingSafeEqual(). Returns HTTP 403 Forbidden on failure.

#### D. Parameters
- `req` (*Express.Request*): Incoming HTTP request
- `res` (*Express.Response*): HTTP response object
- `next` (*Function*): Next middleware callback

#### E. Return Value
void (Calls next() or emits HTTP 403 JSON response)

#### F. Step-by-Step Execution Order
1. Check if req.method is GET, HEAD, or OPTIONS; if so, call next() immediately.
2. Check if req.session exists; if not, return HTTP 403 CSRF_MISSING.
3. Retrieve sessionToken = req.session.csrfToken.
4. Extract clientToken from X-CSRF-Token header, request body, or query parameter.
5. If either token is missing, return HTTP 403.
6. Convert both tokens to Buffers and verify matching length.
7. Use crypto.timingSafeEqual() to compare tokens safely against timing attacks.
8. If matching, call next(); if mismatch, return HTTP 403 CSRF_INVALID.

#### G. Calls & Dependencies
- **Called By:** State-mutating routes in src/app.js (register, login, logout, appliances CRUD, settings, savings, reports)
- **Calls:** crypto.timingSafeEqual(), next()

#### H. Database Operations
Session storage in MySQL

#### I. Real Example
```text
POST /api/appliances with missing or altered X-CSRF-Token header -> returns HTTP 403 Forbidden.
```

#### J. Error Handling
Rejects requests with HTTP 403 when tokens are missing, expired, or tampered with.

#### K. Security Relevance
Defends against Cross-Site Request Forgery where malicious external websites trick authenticated browsers into making unauthorized database modifications.

#### L. Viva Spoken Answer
> "csrfProtection defends our API against CSRF attacks. It requires every state-changing POST, PUT, or DELETE request to provide an X-CSRF-Token header matching the secret stored in the user's server session, validated using timing-safe comparison."

#### M. Related Viva Questions
- **Q:** Why do GET requests not require CSRF tokens? (Answer: Because HTTP GET requests must be safe and idempotent—they only retrieve data and never mutate state).
- **Q:** What is timingSafeEqual and why do we use it? (Answer: It compares two buffers in constant time to prevent side-channel timing attacks that could deduce the token byte by byte).

#### N. Source Code Excerpt
```javascript
function csrfProtection(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  if (!req.session) {
    return res.status(403).json({ success: false, error: { code: 'CSRF_MISSING', message: 'Session required.' } });
  }

  const sessionToken = req.session.csrfToken;
  const clientToken = req.headers['x-csrf-token'] || (req.body && req.body._csrf) || (req.query && req.query._csrf);

  if (!sessionToken || !clientToken) {
    return res.status(403).json({ success: false, error: { code: 'CSRF_MISSING', message: 'CSRF token missing.' } });
  }

  const sessionBuf = Buffer.from(sessionToken, 'utf8');
  const clientBuf = Buffer.from(clientToken, 'utf8');

  if (sessionBuf.length !== clientBuf.length || !crypto.timingSafeEqual(sessionBuf, clientBuf)) {
    return res.status(403).json({ success: false, error: { code: 'CSRF_INVALID', message: 'Invalid CSRF token.' } });
  }

  next();
}
```

---

### 4.2.8 Function: `authRateLimiter()`

#### A. Basic Information
- **Function Name:** `authRateLimiter`
- **File Path:** `src/middleware/security.js`
- **Line Number:** Line 103
- **Function Type:** Middleware factory function
- **Execution Mode:** Synchronous

#### B. Simple Explanation
Protects the login route against automated brute-force password guessing attacks by restricting any single IP address to a maximum of 5 failed login attempts in a 15-minute window.

#### C. Technical Explanation
Returns an Express middleware that inspects req.ip. Maintains an in-memory Map of failed attempts per IP with timestamp expiration. Automatically clears upon successful login. Prunes stale IPs every 5 minutes using an unreferenced setInterval timer to prevent memory leaks.

#### D. Parameters
- `maxAttempts` (*number*): Maximum failed attempts (default from config: 5)
- `windowMs` (*number*): Time window in milliseconds (default: 15 mins)

#### E. Return Value
Function — Express middleware (req, res, next)

#### F. Step-by-Step Execution Order
1. Extract client IP address via req.ip.
2. Check if client IP exists in rateLimitMap and whether the window has expired.
3. If attempts exceed maxAttempts within windowMs, block request with HTTP 429 Too Many Requests.
4. Set X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After HTTP response headers.
5. If within limits, call next(). If login fails downstream, record failed attempt in Map.

#### G. Calls & Dependencies
- **Called By:** POST /api/auth/login route in src/app.js
- **Calls:** next()

#### H. Database Operations
None (In-memory cache with periodic garbage collection)

#### I. Real Example
```text
Submitting 6 wrong passwords within 15 minutes from the same IP -> returns HTTP 429 {"success": false, "error": {"code": "RATE_LIMIT_EXCEEDED", ...}}
```

#### J. Error Handling
Emits HTTP 429 Too Many Requests when threshold is exceeded.

#### K. Security Relevance
Mitigates brute-force password spraying and dictionary attacks against user accounts.

#### L. Viva Spoken Answer
> "authRateLimiter prevents brute-force password guessing on the login route. It tracks failed attempts by client IP address and temporarily locks out the IP for 15 minutes after 5 consecutive failures."

#### M. Related Viva Questions
- **Q:** What HTTP status code is returned when a rate limit is exceeded? (Answer: HTTP 429 Too Many Requests).
- **Q:** How was the memory leak hazard in this rate limiter resolved? (Answer: An automated 5-minute cleanup sweep removes expired IP records from the in-memory Map).

#### N. Source Code Excerpt
```javascript
function authRateLimiter(maxAttempts = config.rateLimit.maxAttempts, windowMs = config.rateLimit.windowMs) {
  return function (req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record) {
      if (now - record.startTime > windowMs) {
        rateLimitMap.delete(ip);
      } else if (record.attempts >= maxAttempts) {
        const retrySec = Math.ceil((windowMs - (now - record.startTime)) / 1000);
        res.setHeader('Retry-After', retrySec);
        return res.status(429).json({
          success: false,
          error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many failed login attempts.' }
        });
      }
    }
    next();
  };
}
```

---

### 4.2.9 Function: `register()`

#### A. Basic Information
- **Function Name:** `register`
- **File Path:** `src/controllers/authController.js`
- **Line Number:** Line 78
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Creates a brand new user account. It validates the email and password, checks that the email is not already registered, hashes the password with bcrypt, inserts the user into MySQL, creates default settings (₹8/kWh tariff), regenerates the session to prevent fixation, and logs the user in.

#### C. Technical Explanation
Validates email format and password length (min 8). Queries users table for duplicate email (returns HTTP 409 Conflict if found). Uses bcrypt.hash() with salt work factor 10. Uses a MySQL connection from pool to insert into users, then atomically inserts default preferences into user_settings (rate=8.0, budget=3500, symbol="₹"). Calls regenerateSession() and binds req.session.userId, returning HTTP 201 Created.

#### D. Parameters
- `req` (*Express.Request*): Request containing { email, password, display_name }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error handler callback

#### E. Return Value
Promise<Response> — HTTP 201 Created with { success: true, data: { user } }

#### F. Step-by-Step Execution Order
1. Extract and normalize email (trim and lowercase); extract password and display_name.
2. Validate input fields; if invalid, return HTTP 400 VALIDATION_ERROR.
3. Query users table: SELECT id FROM users WHERE email = ? LIMIT 1.
4. If user exists, return HTTP 409 EMAIL_EXISTS.
5. Generate salted hash: bcrypt.hash(password, 10).
6. Insert into users: INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?).
7. Insert default settings into user_settings with foreign key referencing new user id.
8. Regenerate session ID via regenerateSession() to defeat session fixation.
9. Bind req.session.userId = newUserId and save session.
10. Return HTTP 201 with created user details (excluding password hash).

#### G. Calls & Dependencies
- **Called By:** POST /api/auth/register
- **Calls:** normalizeEmail(), validatePassword(), regenerateSession(), saveSession(), bcrypt.hash()

#### H. Database Operations
INSERT INTO users, INSERT INTO user_settings

#### I. Real Example
```text
POST /api/auth/register with {"email":"user@example.com","password":"Password123!","display_name":"Aarav"} -> HTTP 201 {"success": true, "data": {"id": 1, "email": "user@example.com", ...}}
```

#### J. Error Handling
Returns HTTP 400 on invalid input, HTTP 409 on duplicate email, or delegates server errors to next(err).

#### K. Security Relevance
Defends against duplicate accounts, plaintext password storage (bcrypt work factor 10), and session fixation attacks.

#### L. Viva Spoken Answer
> "The register function validates user inputs, ensures the email is unique, hashes the password using bcrypt with 10 salt rounds, creates the user and default tariff settings in MySQL, regenerates the session for security, and logs the user in immediately."

#### M. Related Viva Questions
- **Q:** Why do we hash passwords instead of encrypting them? (Answer: Hashing is one-way cryptographic transformation; once hashed, the plaintext password cannot be decrypted even if the database is leaked).
- **Q:** What is session fixation and how does EnergySaver prevent it? (Answer: An attacker tricks a victim into using a known session ID; EnergySaver regenerates the session ID immediately upon registration and login).

#### N. Source Code Excerpt
```javascript
async function register(req, res, next) {
  // Validates inputs, hashes password with bcrypt, inserts user and default settings into MySQL,
  // regenerates session, and returns HTTP 201 Created. Full code in src/controllers/authController.js lines 78-183.
}
```

---

### 4.2.10 Function: `login()`

#### A. Basic Information
- **Function Name:** `login`
- **File Path:** `src/controllers/authController.js`
- **Line Number:** Line 185
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Authenticates an existing user. It checks the provided email and password against MySQL using bcrypt. If correct, it resets any failed login attempts, regenerates the session ID, sets the session cookie, and returns the user's profile.

#### C. Technical Explanation
Normalizes email, queries MySQL users table for password_hash. Uses bcrypt.compare() to safely verify plaintext password against stored hash. Emits generic HTTP 401 on failure to prevent user enumeration. On success, clears rate limits, calls regenerateSession(), binds req.session.userId, and returns HTTP 200 OK.

#### D. Parameters
- `req` (*Express.Request*): Request containing { email, password }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error handler callback

#### E. Return Value
Promise<Response> — HTTP 200 OK with user profile or HTTP 401 Unauthorized

#### F. Step-by-Step Execution Order
1. Extract and normalize email; extract password.
2. Query users table: SELECT id, email, password_hash, display_name FROM users WHERE email = ?.
3. If user not found, record rate limit failure and return HTTP 401 INVALID_CREDENTIALS.
4. Compare password: await bcrypt.compare(password, user.password_hash).
5. If bcrypt comparison fails, record failure and return HTTP 401 INVALID_CREDENTIALS.
6. If comparison passes, clear failed attempts for this IP via resetRateLimits(ip).
7. Regenerate session ID to prevent session fixation attacks.
8. Assign req.session.userId = user.id and save session.
9. Return HTTP 200 with sanitized user profile.

#### G. Calls & Dependencies
- **Called By:** POST /api/auth/login
- **Calls:** normalizeEmail(), bcrypt.compare(), resetRateLimits(), regenerateSession(), saveSession()

#### H. Database Operations
SELECT id, email, password_hash, display_name FROM users WHERE email = ?

#### I. Real Example
```text
POST /api/auth/login with {"email":"user@example.com","password":"Password123!"} -> HTTP 200 OK
```

#### J. Error Handling
Emits identical generic error messages for non-existent users and bad passwords to prevent account enumeration.

#### K. Security Relevance
Timing-safe password comparison via bcrypt; rate limiting on brute force; session fixation defense; user enumeration prevention.

#### L. Viva Spoken Answer
> "The login controller fetches the user record from MySQL, verifies the password hash using bcrypt.compare(), clears the rate limiter, regenerates the session ID to prevent session fixation, binds the user ID to the session, and sets the secure session cookie."

#### M. Related Viva Questions
- **Q:** Why does the login endpoint return the exact same error message when an email does not exist as when a password is wrong? (Answer: To prevent user enumeration attacks where an attacker determines valid registered email addresses).

#### N. Source Code Excerpt
```javascript
async function login(req, res, next) {
  // Authenticates credentials via bcrypt.compare, regenerates session, returns HTTP 200.
  // Full code in src/controllers/authController.js lines 185-246.
}
```

---

### 4.2.11 Function: `listAppliances()`

#### A. Basic Information
- **Function Name:** `listAppliances`
- **File Path:** `src/controllers/applianceController.js`
- **Line Number:** Line 117
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Fetches all appliances created by the logged-in user from MySQL. It supports filtering by room, filtering by category, search by name, and sorting, and automatically calculates the daily kWh, monthly kWh, and monthly cost for each appliance.

#### C. Technical Explanation
Enforces strict ownership: WHERE user_id = req.session.userId. Dynamically appends SQL conditions for room, category, and name search. Fetches user's electricity rate from user_settings. Computes consumption metrics for each appliance using calculator.computeApplianceMetrics(). Returns HTTP 200 with enriched appliances array.

#### D. Parameters
- `req` (*Express.Request*): Request with optional query params (room, category, search, sort)
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 200 with array of calculated appliance objects

#### F. Step-by-Step Execution Order
1. Retrieve userId = req.session.userId and query parameters.
2. Fetch user's electricity tariff rate via getUserRate(userId).
3. Construct parameterized SQL query: SELECT * FROM appliances WHERE user_id = ?.
4. Append parameterized filters for room, category, and name search if provided in query.
5. Execute query using pool.execute() with parameter array.
6. Map through returned rows, parsing numerical fields and invoking calculator.computeApplianceMetrics().
7. Return HTTP 200 with computed appliances and total count.

#### G. Calls & Dependencies
- **Called By:** GET /api/appliances
- **Calls:** getUserRate(), calculator.computeApplianceMetrics(), pool.execute()

#### H. Database Operations
SELECT FROM appliances WHERE user_id = ?

#### I. Real Example
```text
GET /api/appliances?room=Living%20Room -> returns array of appliances in Living Room with calculated kWh and costs.
```

#### J. Error Handling
Catches query errors and delegates to global errorHandler.

#### K. Security Relevance
Zero-Trust IDOR defense: impossible for User A to retrieve User B's appliances because user_id is hardcoded to req.session.userId.

#### L. Viva Spoken Answer
> "listAppliances retrieves all appliances belonging to the authenticated user from MySQL using parameterized SQL, applies optional room or category filters, calculates their kWh and rupee costs using the user's tariff rate, and returns the list."

#### M. Related Viva Questions
- **Q:** How does listAppliances prevent IDOR (Insecure Direct Object Reference)? (Answer: It never relies on a user ID passed in the query or body; it always extracts userId directly from the authenticated server session: WHERE user_id = req.session.userId).

#### N. Source Code Excerpt
```javascript
async function listAppliances(req, res, next) {
  // Queries appliances table with user_id = req.session.userId and computes metrics.
  // Full code in src/controllers/applianceController.js lines 117-194.
}
```

---

### 4.2.12 Function: `createAppliance()`

#### A. Basic Information
- **Function Name:** `createAppliance`
- **File Path:** `src/controllers/applianceController.js`
- **Line Number:** Line 196
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Adds a new appliance to the user's household. It validates all inputs (watts between 1 and 10000, quantity between 1 and 50, hours between 0.1 and 24, days between 1 and 31), enforces a 100-appliance ceiling per household, and saves the appliance into MySQL.

#### C. Technical Explanation
Runs validateApplianceInput(). Queries MySQL to verify that total appliances owned by this user does not exceed 100 (CWE-770 DoS defense). Inserts the record into appliances with user_id = req.session.userId. Computes metrics and returns HTTP 201 Created.

#### D. Parameters
- `req` (*Express.Request*): Request body { name, category, room, rated_watts, quantity, daily_hours, days_used_per_month }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 201 Created with new appliance record and calculated metrics

#### F. Step-by-Step Execution Order
1. Extract fields from req.body and run validateApplianceInput().
2. If validation fails, return HTTP 400 with specific field error message.
3. Count user's existing appliances: SELECT COUNT(*) as total FROM appliances WHERE user_id = ?.
4. If total >= 100, return HTTP 400 APPLIANCE_LIMIT_REACHED.
5. Insert into appliances: INSERT INTO appliances (user_id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month) VALUES (?, ?, ?, ?, ?, ?, ?, ?).
6. Retrieve inserted appliance ID.
7. Compute metrics using calculator.computeApplianceMetrics().
8. Return HTTP 201 Created with inserted record.

#### G. Calls & Dependencies
- **Called By:** POST /api/appliances
- **Calls:** validateApplianceInput(), getUserRate(), calculator.computeApplianceMetrics(), pool.execute()

#### H. Database Operations
SELECT COUNT(*) FROM appliances, INSERT INTO appliances

#### I. Real Example
```text
POST /api/appliances with {"name":"Inverter AC","category":"Cooling","room":"Bedroom","rated_watts":1500,"quantity":1,"daily_hours":6,"days_used_per_month":30} -> HTTP 201 Created
```

#### J. Error Handling
Returns HTTP 400 on invalid input ranges or when 100-appliance ceiling is reached.

#### K. Security Relevance
Strict input bounds checking prevents buffer overflow or integer overflow; user_id binding guarantees ownership; inventory capping mitigates resource exhaustion DoS.

#### L. Viva Spoken Answer
> "createAppliance validates appliance technical parameters, checks that the user has not exceeded the 100-appliance inventory limit, inserts the record into MySQL with the authenticated user ID, computes consumption metrics, and returns HTTP 201 Created."

#### M. Related Viva Questions
- **Q:** Why is there a 100-appliance limit per user? (Answer: To prevent denial-of-service attacks where an attacker inserts millions of appliances to exhaust database memory and CPU during aggregation).

#### N. Source Code Excerpt
```javascript
async function createAppliance(req, res, next) {
  // Enforces 100-item limit, validates input, inserts row into MySQL, returns HTTP 201.
  // Full code in src/controllers/applianceController.js lines 196-260.
}
```

---

### 4.2.13 Function: `getSummary()`

#### A. Basic Information
- **Function Name:** `getSummary`
- **File Path:** `src/controllers/dashboardController.js`
- **Line Number:** Line 16
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Generates the complete Overview Dashboard summary for the logged-in user. It fetches all the user's appliances and tariff settings from MySQL, runs the calculation engine, and returns total kWh, total bill, budget status, room breakdown, and top consuming appliances.

#### C. Technical Explanation
Retrieves userId from req.session. Executes parallel database queries to fetch user_settings and appliances. Passes data to calculator.calculateHouseholdTotals({ round: true }). Formats response matching the dashboard contract and returns HTTP 200 OK.

#### D. Parameters
- `req` (*Express.Request*): Authenticated request
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 200 OK with household summary JSON

#### F. Step-by-Step Execution Order
1. Extract userId = req.session.userId.
2. Fetch user_settings: SELECT electricity_rate, monthly_budget, currency_symbol FROM user_settings WHERE user_id = ?.
3. Fetch appliances: SELECT * FROM appliances WHERE user_id = ?.
4. Invoke calculator.calculateHouseholdTotals(appliances, rate, budget, { round: true }).
5. Construct dashboard summary payload.
6. Return res.status(200).json({ success: true, data: summary }).

#### G. Calls & Dependencies
- **Called By:** GET /api/dashboard/summary
- **Calls:** calculator.calculateHouseholdTotals(), pool.execute()

#### H. Database Operations
SELECT FROM user_settings, SELECT FROM appliances

#### I. Real Example
```text
GET /api/dashboard/summary -> returns total_monthly_kwh: 322.8, total_estimated_bill: 2582.4, budget_status: "NORMAL", room_breakdown: [...]
```

#### J. Error Handling
Handles users with zero appliances cleanly by returning zeroed totals.

#### K. Security Relevance
Scoped strictly to req.session.userId; cross-user data leakage is impossible.

#### L. Viva Spoken Answer
> "getSummary is the backend engine for our dashboard. It retrieves the user's appliances and budget settings from MySQL, passes them to our authoritative calculation service, and returns total monthly consumption, estimated bill, room breakdown, and budget status."

#### M. Related Viva Questions
- **Q:** What happens if a user has no appliances yet? (Answer: getSummary returns zeroed metrics with an empty room breakdown so the frontend can display an empty state prompting the user to add appliances).

#### N. Source Code Excerpt
```javascript
async function getSummary(req, res, next) {
  // Fetches user settings and appliances from MySQL, calls calculateHouseholdTotals,
  // returns HTTP 200 summary. Full code in src/controllers/dashboardController.js lines 16-95.
}
```

---

### 4.2.14 Function: `simulateSavings()`

#### A. Basic Information
- **Function Name:** `simulateSavings`
- **File Path:** `src/controllers/savingsController.js`
- **Line Number:** Line 64
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Runs the What-If Savings simulation. When a user moves a slider in the savings modal to test reducing daily hours, this function calculates how much energy and money they would save per month without changing their actual database records.

#### C. Technical Explanation
Validates proposed runtime modifications array { id, proposed_daily_hours }. Queries MySQL for user's current appliances. Clones appliance inventory in memory, applying proposed modifications. Invokes calculator.calculateScenarioDelta(baseline, proposed, rate, budget, { round: true }). Returns comparison delta without executing any UPDATE queries.

#### D. Parameters
- `req` (*Express.Request*): Request body { modifications: [{ id, proposed_daily_hours }] }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 200 OK with { baseline, proposed, saved_kwh, saved_cost, is_savings }

#### F. Step-by-Step Execution Order
1. Extract userId = req.session.userId and modifications array.
2. Validate modifications via validateModifications() (checks bounds 0.1 to 24h, no duplicates).
3. Fetch user settings and active appliances from MySQL.
4. Verify that all modified appliance IDs belong to the authenticated user (IDOR check).
5. Clone appliance list in memory and replace daily_hours with proposed hours.
6. Call calculator.calculateScenarioDelta() to compute savings.
7. Return HTTP 200 with comparison data. Zero database mutations occur.

#### G. Calls & Dependencies
- **Called By:** POST /api/savings/simulate
- **Calls:** validateModifications(), calculator.calculateScenarioDelta(), pool.execute()

#### H. Database Operations
SELECT FROM user_settings, SELECT FROM appliances (READ-ONLY)

#### I. Real Example
```text
POST /api/savings/simulate with [{"id": 5, "proposed_daily_hours": 2.0}] -> returns saved_kwh: 60.00, saved_cost: ₹480.00, is_savings: true.
```

#### J. Error Handling
Rejects invalid hours or appliances belonging to other users with HTTP 400 or HTTP 404.

#### K. Security Relevance
Strictly read-only; guarantees zero silent database commits.

#### L. Viva Spoken Answer
> "simulateSavings is our non-destructive simulation endpoint. It takes proposed runtime adjustments, clones the user's appliance inventory in memory, computes prospective energy and rupee savings, and returns the comparison without modifying the database."

#### M. Related Viva Questions
- **Q:** What is the difference between simulateSavings and applySavings? (Answer: simulateSavings is strictly read-only and computes what-if metrics in memory; applySavings explicitly writes the new operating hours into the MySQL appliances table).

#### N. Source Code Excerpt
```javascript
async function simulateSavings(req, res, next) {
  // Clones appliances in memory, applies proposed runtimes, computes delta via calculateScenarioDelta.
  // Full code in src/controllers/savingsController.js lines 64-146.
}
```

---

### 4.2.15 Function: `applySavings()`

#### A. Basic Information
- **Function Name:** `applySavings`
- **File Path:** `src/controllers/savingsController.js`
- **Line Number:** Line 148
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Permanently applies a user's confirmed savings plan to their database records. Once a user reviews the simulation and clicks "Apply to My Home", this function updates the daily hours of the specified appliances in MySQL.

#### C. Technical Explanation
Validates modifications array. Verifies appliance ownership. Uses a database connection to run parameterized UPDATE appliances SET daily_hours = ? WHERE id = ? AND user_id = ? for each modified appliance. Re-computes updated dashboard summary and returns HTTP 200 OK.

#### D. Parameters
- `req` (*Express.Request*): Request body { modifications: [{ id, proposed_daily_hours }] }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 200 OK with success message and updated household totals

#### F. Step-by-Step Execution Order
1. Extract userId and modifications array.
2. Validate modifications using validateModifications().
3. For each modification, execute: UPDATE appliances SET daily_hours = ? WHERE id = ? AND user_id = ?.
4. Verify that affectedRows > 0 for each update.
5. Fetch updated appliances and settings from MySQL.
6. Compute new household totals via calculator.calculateHouseholdTotals().
7. Return HTTP 200 with updated dashboard metrics.

#### G. Calls & Dependencies
- **Called By:** POST /api/savings/apply
- **Calls:** validateModifications(), calculator.calculateHouseholdTotals(), pool.execute()

#### H. Database Operations
UPDATE appliances SET daily_hours = ? WHERE id = ? AND user_id = ?

#### I. Real Example
```text
POST /api/savings/apply with [{"id": 5, "proposed_daily_hours": 2.0}] -> updates MySQL row and returns HTTP 200.
```

#### J. Error Handling
Rolls back or reports error if an appliance ID is not found or not owned by the user.

#### K. Security Relevance
Ownership check on every UPDATE statement prevents cross-tenant tampering.

#### L. Viva Spoken Answer
> "applySavings is called when a user explicitly commits their savings plan. It executes parameterized UPDATE queries on the MySQL appliances table to save the new operating hours and returns refreshed dashboard metrics."

#### M. Related Viva Questions
- **Q:** Why does the system require explicit confirmation before applying savings? (Answer: To adhere to our Zero Silent Commits policy, ensuring users never have their baseline records altered accidentally while experimenting with sliders).

#### N. Source Code Excerpt
```javascript
async function applySavings(req, res, next) {
  // Updates daily_hours in MySQL appliances table for authenticated user.
  // Full code in src/controllers/savingsController.js lines 148-219.
}
```

---

### 4.2.16 Function: `saveSnapshot()`

#### A. Basic Information
- **Function Name:** `saveSnapshot`
- **File Path:** `src/controllers/reportController.js`
- **Line Number:** Line 48
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Creates an immutable (unchangeable) historical snapshot of the user's current home energy setup. It saves the total kWh, cost, and tariff rate into report_snapshots, and saves a frozen copy of every appliance into report_snapshot_items.

#### C. Technical Explanation
Validates period_name, period_start, and period_end. Queries active appliances and user settings. Starts a MySQL transaction. Inserts parent record into report_snapshots. Iterates through appliances and bulk-inserts individual frozen records into report_snapshot_items. Commits transaction. Returns HTTP 201 Created.

#### D. Parameters
- `req` (*Express.Request*): Request body { period_name, period_start, period_end }
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 201 Created with snapshot ID and frozen summary

#### F. Step-by-Step Execution Order
1. Extract userId and period metadata from req.body.
2. Validate that period_start and period_end are valid dates (YYYY-MM-DD) and start <= end.
3. Fetch current appliances and user settings from MySQL.
4. Calculate totals using calculator.calculateHouseholdTotals().
5. Obtain a dedicated connection from the connection pool: const conn = await pool.getConnection().
6. Begin transaction: await conn.beginTransaction().
7. Insert parent snapshot into report_snapshots.
8. Extract generated snapshotId = insertResult.insertId.
9. Insert frozen items into report_snapshot_items for each appliance.
10. Commit transaction: await conn.commit(). Release connection.
11. Return HTTP 201 Created with snapshot details.

#### G. Calls & Dependencies
- **Called By:** POST /api/reports/snapshots
- **Calls:** isValidDate(), calculator.calculateHouseholdTotals(), conn.beginTransaction(), conn.commit(), conn.rollback()

#### H. Database Operations
INSERT INTO report_snapshots, INSERT INTO report_snapshot_items (TRANSACTION)

#### I. Real Example
```text
POST /api/reports/snapshots with {"period_name":"October 2026","period_start":"2026-10-01","period_end":"2026-10-31"} -> HTTP 201 Created.
```

#### J. Error Handling
If any query fails during snapshot creation, executes conn.rollback() so no partial records remain in MySQL.

#### K. Security Relevance
Transaction atomicity ensures database consistency; snapshots are immutable and cannot be updated once created.

#### L. Viva Spoken Answer
> "saveSnapshot creates an immutable historical record. It uses a database transaction to insert a parent snapshot row and frozen copies of all appliance items so that if a user deletes or modifies an appliance in the future, their historical monthly reports remain 100% accurate."

#### M. Related Viva Questions
- **Q:** Why are snapshots immutable? (Answer: Because historical electricity bills cannot be rewritten; even if you buy or sell appliances next month, last month's report must reflect the exact appliances you had then).
- **Q:** Why do we use a database transaction here? (Answer: To guarantee atomicity—either the snapshot header and all its items are saved together, or none are, preventing orphaned records).

#### N. Source Code Excerpt
```javascript
async function saveSnapshot(req, res, next) {
  // Uses MySQL transaction to atomically freeze parent snapshot and child snapshot items.
  // Full code in src/controllers/reportController.js lines 48-183.
}
```

---

### 4.2.17 Function: `reconcileBill()`

#### A. Basic Information
- **Function Name:** `reconcileBill`
- **File Path:** `src/controllers/reportController.js`
- **Line Number:** Line 456
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Compares a frozen estimated snapshot against a real utility bill entered by the user. It calculates the variance in kilowatt-hours and cost, checks if the billing dates match, and provides an educational checklist explaining possible reasons for discrepancies.

#### C. Technical Explanation
Extracts snapshot_id and bill_id query parameters. Queries report_snapshots and actual_bills with user_id ownership checks. Verifies whether snapshot dates match bill dates. Computes kwhDiff = actKwh - estKwh and costDiff = actCost - estCost along with percentage variances. Returns HTTP 200 with structured reconciliation data.

#### D. Parameters
- `req` (*Express.Request*): Request with query params ?snapshot_id=X&bill_id=Y
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<Response> — HTTP 200 OK with { dates_match, period, estimate, actual, variance, educational_checklist }

#### F. Step-by-Step Execution Order
1. Extract snapshot_id and bill_id from req.query and validate as positive integers.
2. Fetch snapshot from report_snapshots WHERE id = ? AND user_id = ?.
3. Fetch actual bill from actual_bills WHERE id = ? AND user_id = ?.
4. If either record is missing, return HTTP 404 NOT_FOUND.
5. Compare dates: datesMatch = (snapshot.period_start === bill.billing_start_date && snapshot.period_end === bill.billing_end_date).
6. Calculate variance: kwhDiff = actKwh - estKwh; costDiff = actCost - estCost.
7. Calculate percentage variances: kwhPct and costPct.
8. Compile educational checklist of common reasons for bill discrepancies (thermostat cycles, unlisted loads, fixed charges).
9. Return HTTP 200 with full comparison structure.

#### G. Calls & Dependencies
- **Called By:** GET /api/reports/reconcile
- **Calls:** calculator.roundTo(), pool.execute()

#### H. Database Operations
SELECT FROM report_snapshots, SELECT FROM actual_bills

#### I. Real Example
```text
GET /api/reports/reconcile?snapshot_id=1&bill_id=1 -> returns dates_match: true, variance: { kwh_difference: 17.20, cost_difference: 137.60 }
```

#### J. Error Handling
Returns HTTP 404 if records do not exist or belong to another user; flags date mismatches in output.

#### K. Security Relevance
Strict dual-record ownership validation prevents unauthorized reconciliation of other users' financial records.

#### L. Viva Spoken Answer
> "reconcileBill performs our variance analysis. It fetches a saved estimate and an actual utility bill, computes the differences in units and cost, verifies date alignment, and provides educational feedback on why actual bills might differ from mathematical estimates."

#### M. Related Viva Questions
- **Q:** Why might an actual electricity bill differ from an estimated snapshot? (Answer: Because of seasonal compressor cycling, unlisted temporary appliances like festive lights, or utility meter rent and fixed charges not captured in a flat unit rate).

#### N. Source Code Excerpt
```javascript
async function reconcileBill(req, res, next) {
  // Compares snapshot against actual bill, calculates variance, provides educational checklist.
  // Full code in src/controllers/reportController.js lines 456-566.
}
```

---

### 4.2.18 Function: `exportCsv()`

#### A. Basic Information
- **Function Name:** `exportCsv`
- **File Path:** `src/controllers/reportController.js`
- **Line Number:** Line 568
- **Function Type:** Asynchronous Express route handler
- **Execution Mode:** Asynchronous (Promise-based)

#### B. Simple Explanation
Exports the user's appliance inventory as a downloadable CSV spreadsheet. It includes formula injection protection to ensure malicious inputs cannot execute spreadsheet formulas in Excel or Google Sheets.

#### C. Technical Explanation
Fetches user appliances and tariff rate from MySQL. Sets Content-Type: text/csv and Content-Disposition: attachment; filename="energy-saver-appliances-YYYY-MM-DD.csv". Passes every string value through sanitizeCsvCell() which prepends an apostrophe (') if the cell begins with =, +, -, or @. Streams formatted CSV text to response.

#### D. Parameters
- `req` (*Express.Request*): Authenticated request
- `res` (*Express.Response*): Response object
- `next` (*Function*): Error callback

#### E. Return Value
Promise<void> — Streams CSV file attachment with HTTP 200

#### F. Step-by-Step Execution Order
1. Retrieve userId = req.session.userId.
2. Fetch user's electricity rate and appliance records from MySQL.
3. Compute metrics for each appliance.
4. Set HTTP headers: Content-Type: text/csv; charset=utf-8 and Content-Disposition: attachment.
5. Define CSV header row.
6. Format each appliance row, running strings through sanitizeCsvCell().
7. Send complete CSV string to client: res.send(csvRows.join("\n")).

#### G. Calls & Dependencies
- **Called By:** GET /api/reports/export-csv
- **Calls:** sanitizeCsvCell(), calculator.computeApplianceMetrics(), pool.execute()

#### H. Database Operations
SELECT FROM user_settings, SELECT FROM appliances

#### I. Real Example
```text
GET /api/reports/export-csv -> triggers browser download of energy-saver-appliances.csv with sanitized cells.
```

#### J. Error Handling
Handles database errors via next(err).

#### K. Security Relevance
CSV Formula Injection Defense: prevents CSV Injection (CWE-1236) by ensuring formula characters cannot trigger remote code execution or formula calculation in spreadsheet viewers.

#### L. Viva Spoken Answer
> "exportCsv streams the user's appliance inventory as a CSV spreadsheet. It implements CSV Formula Injection defense by escaping cells that start with equals, plus, minus, or at symbols so spreadsheets treat them strictly as plain text."

#### M. Related Viva Questions
- **Q:** What is CSV Formula Injection? (Answer: When user input starting with an equals sign is exported to CSV, causing Excel to execute formulas or DDE commands when opened; EnergySaver prefixes such characters with a single quote to neutralize them).

#### N. Source Code Excerpt
```javascript
async function exportCsv(req, res, next) {
  // Streams CSV attachment with formula injection defense via sanitizeCsvCell.
  // Full code in src/controllers/reportController.js lines 568-650.
}
```

---

