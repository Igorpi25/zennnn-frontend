export const InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CANCELED: 'CANCELED',
}

export const InvoiceProfitType = {
  MARGIN: 'MARGIN',
  COMMISSION: 'COMMISSION',
}

export const SpecStatus = {
  IN_DRAFT: 'IN_DRAFT',
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const InvoiceStatus = {
  IN_DRAFT: 'IN_DRAFT',
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const ProductStatus = {
  IN_DRAFT: 'IN_DRAFT',
  IN_PROCESSING: 'IN_PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
}

export const ClientType = {
  LEGAL: 'LEGAL',
  PRIVATE: 'PRIVATE',
  OTHER: 'OTHER',
}

export const SpecCurrency = {
  USD: 'USD',
  CNY: 'CNY',
  RUB: 'RUB',
  EUR: 'EUR',
  UAH: 'UAH',
}

export const ContactType = {
  EMAIL: 'EMAIL',
  QQ: 'QQ',
  WE_CHAT: 'WE_CHAT',
  MESSENGER: 'MESSENGER',
  VIBER: 'VIBER',
  TELEGRAM: 'TELEGRAM',
  WHATSAPP: 'WHATSAPP',
  KAKAO_TALK: 'KAKAO_TALK',
  SKYPE: 'SKYPE',
}

export const BranchType = {
  OFFICE: 'OFFICE',
  PRODUCTION: 'PRODUCTION',
  WAREHOUSE: 'WAREHOUSE',
  SHOP: 'SHOP',
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

export const CustomsTerms = {
  EXW: 'EXW',
  FCA: 'FCA',
  CPT: 'CPT',
  CIP: 'CIP',
  DAT: 'DAT',
  DAP: 'DAP',
  DDP: 'DDP',
}

export const CustomsTermsMore = {
  FAS: 'FAS',
  FOB: 'FOB',
  CFR: 'CFR',
  CIF: 'CIF',
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
  CLIENT: 'Client',
  SUPPLIER: 'Supplier',
  REQUISITE: 'Requisite',
  REQUISITE_ITEMS: 'RequisiteItems',
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
  INSERT_CLIENT: 'INSERT_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  SET_REQUISITES: 'SET_REQUISITES',
  UPDATE_REQUISITES: 'UPDATE_REQUISITES',
}

export const emptyInvoice = {
  id: null,
  supplier: null,
  invoiceStatus: null,
  invoiceNo: null,
  purchaseDate: null,
  shippingDate: null,
  profitType: null,
  profitPercent: null,
  profitForAll: true,
  discount: null,
  discountInCurrency: null,
  prepayment: null,
  prepaymentInCurrency: null,
  prepaymentDate: null,
  obtainCost: null,
  obtainCostDate: null,
  clientDebt: null,
  clientDebtInCurrency: null,
  clientDebtDate: null,
  totalClientAmount: null,
  totalPurchaseAmount: null,
  totalNet: null,
  totalGross: null,
  totalVolume: null,
  totalWeight: null,
  totalPkgQty: null,
  createdAt: null,
  updatedAt: null,
  __typename: Typename.INVOICE,
  products: [],
}

export const emptyProduct = {
  id: null,
  productStatus: null,
  name: null,
  article: null,
  qty: null,
  unit: null,
  cost: null,
  store: null,
  info: null,
  link: null,
  comments: [],
  createdAt: null,
  updatedAt: null,
  __typename: Typename.PRODUCT,
}
