export interface LineItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export type TemplateType = "classic" | "modern" | "professional" | "minimal";
export type PaymentStatus = "paid" | "unpaid" | "pending" | "overdue";

export interface InvoiceParty {
  name: string;
  email: string;
  address: string;
  phone: string;
  website?: string;
  company?: string;
  gstin?: string;
}

export interface InvoiceMeta {
  number: string;
  date: string;
  dueDate: string;
  status: PaymentStatus;
}
