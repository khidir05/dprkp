import ItemRequestController from './ItemRequestController'
import DashboardController from './DashboardController'
import StockController from './StockController'
import InboundController from './InboundController'
import StockAlertController from './StockAlertController'
import UnavailableItemController from './UnavailableItemController'
import RestockListController from './RestockListController'
import StockMutationController from './StockMutationController'
import StockOpnameController from './StockOpnameController'
import OutboundController from './OutboundController'
import GoodsReceiptController from './GoodsReceiptController'
import CategoryController from './CategoryController'
import UnitController from './UnitController'
import SupplierController from './SupplierController'
import WarehouseController from './WarehouseController'
import ProductController from './ProductController'
import UserManagementController from './UserManagementController'
import AuditLogController from './AuditLogController'
import NotificationController from './NotificationController'
import ReportController from './ReportController'
import Settings from './Settings'
const Controllers = {
    ItemRequestController: Object.assign(ItemRequestController, ItemRequestController),
DashboardController: Object.assign(DashboardController, DashboardController),
StockController: Object.assign(StockController, StockController),
InboundController: Object.assign(InboundController, InboundController),
StockAlertController: Object.assign(StockAlertController, StockAlertController),
UnavailableItemController: Object.assign(UnavailableItemController, UnavailableItemController),
RestockListController: Object.assign(RestockListController, RestockListController),
StockMutationController: Object.assign(StockMutationController, StockMutationController),
StockOpnameController: Object.assign(StockOpnameController, StockOpnameController),
OutboundController: Object.assign(OutboundController, OutboundController),
GoodsReceiptController: Object.assign(GoodsReceiptController, GoodsReceiptController),
CategoryController: Object.assign(CategoryController, CategoryController),
UnitController: Object.assign(UnitController, UnitController),
SupplierController: Object.assign(SupplierController, SupplierController),
WarehouseController: Object.assign(WarehouseController, WarehouseController),
ProductController: Object.assign(ProductController, ProductController),
UserManagementController: Object.assign(UserManagementController, UserManagementController),
AuditLogController: Object.assign(AuditLogController, AuditLogController),
NotificationController: Object.assign(NotificationController, NotificationController),
ReportController: Object.assign(ReportController, ReportController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers