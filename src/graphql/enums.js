export const InvoiceProfitType = {
  MARGIN: 'MARGIN',
  COMMISSION: 'COMMISSION',
}

export const SpecStatus = {
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const InvoiceStatus = {
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const ProductStatus = {
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const ClientType = {
  LEGAL: 'LEGAL',
  NATURAL: 'NATURAL',
}

export const ShipmentType = {
  UNDEFINED: 'UNDEFINED',
  MARINE: 'MARINE',
  AIR: 'AIR',
  RAILWAY: 'RAILWAY',
  CAR: 'CAR',
  MIXED: 'MIXED',
  EXPRESS: 'EXPRESS',
}

export const Role = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
  WAREHOUSEMAN: 'WAREHOUSEMAN',
  FREELANCER: 'FREELANCER',
}

export const Typename = {
  SPEC: 'Spec',
  INVOICE: 'Invoice',
  PRODUCT: 'Product',
  PAPER_SPEC: 'PaperSpec',
  PAPER_INVOICE: 'PaperInvoice',
  PAPER_PRODUCT: 'PaperProduct',
}

export const Operation = {
  INSERT_PRODUCT: 'INSERT_PRODUCT',
  INSERT_INVOICE: 'INSERT_INVOICE',
  INSERT_SPEC: 'INSERT_SPEC',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  UPDATE_INVOICE_WITH_PRODUCTS: 'UPDATE_INVOICE_WITH_PRODUCTS',
  UPDATE_SPEC: 'UPDATE_SPEC',
  UPDATE_SPEC_WITH_INVOICES: 'UPDATE_SPEC_WITH_INVOICES',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_INVOICE: 'DELETE_INVOICE',
  DELETE_SPEC: 'DELETE_SPEC',
}
