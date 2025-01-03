import crypto from "node:crypto"

/**
 * 360ksiegowosc API
 * @see https://api.merit.ee/connecting-robots/reference-manual/
 */

export interface Invoice {
  SIHId: string
  DepartmentCode: string | null
  DepartmentName: string | null
  ProjectCode: string | null
  ProjectName: string | null
  AccountingDoc: number
  BatchInfo: string
  InvoiceNo: string
  DocumentDate: string; // ISO 8601 date string
  TransactionDate: string; // ISO 8601 date string
  CustomerId: string
  CustomerName: string
  CustomerRegNo: string | null
  HComment: string | null
  FComment: string
  DueDate: string; // ISO 8601 date string
  CurrencyCode: string
  CurrencyRate: number
  TaxAmount: number
  RoundingAmount: number
  TotalAmount: number
  ProfitAmount: number
  TotalSum: number
  UserName: string
  ReferenceNo: string
  PriceInclVat: boolean
  VatRegNo: string
  PaidAmount: number
  EInvSent: boolean
  EInvSentDate: string; // ISO 8601 date string
  EmailSent: string; // ISO 8601 date string
  EInvOperator: number
  OfferId: string
  OfferDocType: string | null
  OfferNo: string | null
  FileExists: boolean
  PerSHId: string
  ContractNo: string | null
  Paid: boolean
  Contact: string | null
}

/**
 * Represents an invoice object.
 */
export type CreateInvoicePayload = {
  /**
   * Customer details for the invoice.
   */
  Customer: {
    Id: string
  } | Omit<CustomerObject, "Id">

  /**
   * Accounting document type.
   * Values:
   * - 1: faktura
   * - 2: rachunek
   * - 3: paragon
   * - 4: nodoc
   * - 5: credit
   * - 6: prepinvoice
   * - 7: finchrg
   * - 8: deliverdoc
   * - 9: grpinv
   */
  AccountingDoc?: number

  /**
   * Array of procedure codes. (Poland only)
   * Values include: SW, EE, TP, TT_WNT, TT_D, MR_T, MR_UZ, I_42, I_63, B_SPV, B_SPV_DOSTAWA,
   * B_MRV_PROWIZJA, MPP, WSTO_EE, IED
   */
  ProcCodes?: string[]

  /**
   * Document type for Poland-specific usage.
   * Values:
   * - 1: RO
   * - 2: WEW
   * - 3: FP
   * - 4: OJPK
   */
  PolDocType?: number

  /**
   * Date of the document.
   */
  DocDate: string

  /**
   * Due date for the invoice.
   */
  DueDate: string

  /**
   * Transaction date for the invoice.
   */
  TransactionDate?: string

  /**
   * Invoice number. This field is required.
   */
  InvoiceNo: string

  /**
   * Reference number for the invoice. If not provided, it will be generated automatically.
   */
  RefNo?: string

  /**
   * Currency code (e.g., "EUR", "USD").
   */
  CurrencyCode?: string

  /**
   * Department code. If used, it must exist in the company database.
   */
  DepartmentCode?: string

  /**
   * Project code. If used, it must exist in the company database.
   */
  ProjectCode?: string

  /**
   * Array of invoice row objects representing individual items or services.
   */
  InvoiceRow: InvoiceRowObject[]

  /**
   * Array of VAT details, required for tax calculation.
   */
  TaxAmount: TaxObject[]

  /**
   * Amount to round off for generating the PDF invoice. Does not affect TotalAmount.
   */
  RoundingAmount?: number

  /**
   * Total amount without VAT.
   */
  TotalAmount: number

  /**
   * Payment details for the invoice.
   */
  Payment?: PaymentObject

  /**
   * Header comment for the invoice. If not specified, it is retrieved from the client record.
   */
  Hcomment?: string

  /**
   * Footer comment for the invoice. If not specified, it is retrieved from the client record.
   */
  Fcomment?: string

  /**
   * Contract number with the operator.
   */
  ContractNo?: string

  /**
   * PDF file of the invoice in Base64 format.
   */
  PDF?: string
}

export type CustomerObject = {
  /**
   * GUID of the customer. If provided and the customer exists in the database,
   * other fields are ignored. If not found, a new customer is added using other fields.
   */
  CustomerId: string

  /**
   * Name of the customer. Required when creating a new customer.
   */
  Name: string

  /**
   * Registration number of the customer.
   */
  RegNo?: string

  /**
   * Indicates whether the customer is a tax-deductible customer.
   * True for physical persons and foreign companies.
   */
  NotTDCustomer: boolean

  /**
   * VAT registration number of the customer.
   */
  VatRegNo?: string

  /**
   * The currency code for transactions with the customer (e.g., "EUR").
   */
  CurrencyCode?: string

  /**
   * Payment deadline in days. If missing, the default setting is used.
   */
  PaymentDeadLine?: number

  /**
   * Overdue charge in the specified currency. Defaults to settings if missing.
   */
  OverDueCharge?: number

  /**
   * Address of the customer.
   */
  Address?: string

  /**
   * City of the customer.
   */
  City?: string

  /**
   * County of the customer.
   */
  County?: string

  /**
   * Postal code of the customer.
   */
  PostalCode?: string

  /**
   * Two-letter country code (ISO 3166-1 alpha-2). Required for adding a new customer.
   */
  CountryCode: string

  /**
   * Primary phone number of the customer.
   */
  PhoneNo?: string

  /**
   * Secondary phone number of the customer.
   */
  PhoneNo2?: string

  /**
   * Homepage URL of the customer.
   */
  HomePage?: string

  /**
   * Email address of the customer.
   */
  Email?: string

  /**
   * Language code for sales invoices for this customer (e.g., "ET", "EN", "RU", "FI", "PL", "SV").
   */
  SalesInvLang?: string

  /**
   * Reference number base for invoices.
   */
  RefNoBase?: string

  /**
   * E-Invoice Payment ID.
   */
  EInvPaymId?: string

  /**
   * E-Invoice operator type:
   * - 1: Not exist
   * - 2: E-Invoices to the bank through Omniva
   * - 3: Bank (full extent E-Invoice)
   * - 4: Bank (limited extent E-Invoice)
   */
  EInvOperator?: number

  /**
   * Bank account details of the customer.
   */
  BankAccount?: string

  /**
   * Contact person for the customer.
   */
  Contact?: string

  /**
   * APIX E-Invoice ID.
   */
  ApixEinv?: string
}

export type TaxObject = {
  TaxId: string
  Amount?: number
}

/**
 * Represents a single row in an invoice.
 * Each row has its quantity, price, and specific tax details for accurate calculations.
 */
export type InvoiceRowObject = {
  /**
   * Item details for the row, including code, description, and type.
   */
  Item: ItemObject

  /**
   * Quantity of the item. Precision: Decimal(18, 3).
   */
  Quantity: number

  /**
   * Price of the item. If not provided, it will be fetched from the sales price table.
   * Precision: Decimal(18, 7).
   */
  Price?: number

  /**
   * Discount percentage applied to the row. Precision: Decimal(18, 2).
   */
  DiscountPct?: number

  /**
   * Discount amount applied to the row, calculated as `Amount * Price * (DiscountPct / 100)`.
   * Precision: Decimal(18, 2). This amount is subtracted before rounding.
   */
  DiscountAmount?: number

  /**
   * Tax ID for the row. This is required and must be fetched using the `gettaxes` endpoint.
   */
  TaxId: string

  /**
   * Location code for the stock item. If provided, it must exist in the company database.
   */
  LocationCode?: string

  /**
   * Department code for the row. If provided, it must exist in the company database.
   */
  DepartmentCode?: string

  /**
   * General Ledger account code for the row. If provided, it must exist in the company database.
   */
  GLAccountCode?: string

  /**
   * Array of dimension objects associated with the row for tracking or categorization purposes.
   */
  Dimensions?: DimensionsObject[]

  /**
   * Cost amount for the item. This is required for credit invoices when crediting stock items.
   * Precision: Decimal(18, 2).
   */
  ItemCostAmount?: number

  /**
   * VAT date in the format `YYYYMMDD`. Required in some countries.
   */
  VatDate?: string
}


/**
 * Represents an ItemObject, which is used to define an item for inventory or service.
 */
type ItemObject = {
  /**
   * The unique code of the item. Required.
   */
  Code: string;

  /**
   * The description of the item. Required.
   * If the description is more than 150 characters, it will be truncated.
   */
  Description: string;

  /**
   * The type of the item. Required.
   * - 1: stock item
   * - 2: service
   * - 3: item
   */
  Type: number;

  /**
   * The name of the unit of measurement for the item.
   */
  UOMName: string;

  /**
   * The default location code for the item.
   * Required for stock items if the company has more than one default stock location.
   */
  DefLocationCode?: string;

  /**
   * The GTU code for the item.
   * Only applicable for Poland and must be one of the values 1 to 13.
   */
  GTUCode?: number;

  /**
   * The sales account code for the item.
   * Can only be used when creating new stock items.
   */
  SalesAccCode?: string;

  /**
   * The purchase account code for the item.
   * Can only be used when creating new stock items.
   */
  PurchaseAccCode?: string;

  /**
   * The inventory account code for the item.
   * Can only be used when creating new stock items.
   */
  InventoryAccCode?: string;

  /**
   * The cost account code for the item.
   * Can only be used when creating new stock items.
   */
  CostAccCode?: string;
}

export type DimensionsObject = {
  DimId: number
  DimValueId: string
  DimCode: string
}


/**
 * Represents a PaymentObject, which is used to mark an invoice as already paid.
 * This is useful when creating invoices only after successful internet bank payments or cash receipts.
 */
export type PaymentObject = {
  /**
   * The name of the payment method. Must be found in the company database.
   */
  PaymentMethod: string;

  /**
   * The amount paid, including VAT.
   * If it's a partial payment, the amount should be less than or equal to the total amount.
   */
  PaidAmount: number;

  /**
   * The date and time of the payment, in the format YYYYmmddHHii.
   */
  PaymDate: string;
}

interface Tax {
  Id: string
  Code: string
  Name: string
  TaxPct: number
  NonActive: boolean
}

interface Bank {
  BankId: string
  Name: string
  IBANCode: string
  Description: string
  CurrencyCode: string
  AccountCode: string
}

export class Ksiegowosc360 {
  constructor(
    protected apiId: string,
    protected apiKey: string
  ) { }
  /**
   * Methods
   */
  getInvoices(payload: {
    PeriodStart?: string
    PeriodEnd?: string
    UnPaid?: boolean
  }, signal: AbortSignal) {
    return this.request<Invoice[]>("https://program.360ksiegowosc.pl/api/v1/getinvoices", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal
    })
  }

  /**
   * @see https://api.merit.ee/connecting-robots/reference-manual/sales-invoices/create-sales-invoice/
   */
  createInvoice(payload: CreateInvoicePayload, signal: AbortSignal) {
    return this.request<{
      InvoiceId: string
      InvoiceNo: string
    }>("https://program.360ksiegowosc.pl/api/v1/sendinvoice", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal
    })
  }

  getCustomers(payload = {}, signal: AbortSignal) {
    return this.request<CustomerObject[]>("https://program.360ksiegowosc.pl/api/v1/getcustomers", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal
    })
  }

  createCustomer(payload: Omit<CustomerObject, "CustomerId">, signal: AbortSignal) {
    return this.request<{ Id: string }>("https://program.360ksiegowosc.pl/api/v2/sendcustomer", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal,
    })
  }

  getTaxes(payload = {}, signal: AbortSignal) {
    return this.request<Tax[]>("https://program.360ksiegowosc.pl/api/v1/gettaxes", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal
    })
  }

  getBanks(payload = {}, signal: AbortSignal) {
    return this.request<Bank[]>(`https://program.360ksiegowosc.pl/api/v1/getbanks`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      signal
    })
  }

  request<T>(url: string, params: RequestInit) {
    const timestamp = getTimestamp()
    const dataString = this.apiId + timestamp + params.body
    const signature = crypto.createHmac("sha256", this.apiKey).update(dataString).digest("base64")
    const query = new URLSearchParams({ ApiId: this.apiId, timestamp, signature })
  
    return fetch(`${url}?${query}`, {
      method: params.method,
      body: params.body,
      headers: params.headers
    }).then(parseResponse<T>)
  }
}

function parseResponse<T>(resp: Pick<Response, "ok" | "text" | "url" | "status">): Promise<T> {
  return resp.text().then(function (text) {
    let data: any

    try {
      data = parseJSON(text)
    }
    catch (cause) {
      if (!resp.ok) {
        throw new ErrorWithCode(text, {
          code: "unknown_error",
          status: resp.status,
          data: {
            text,
            url: resp.url,
          }
        })
      }

      throw new ErrorWithCode("Unsupported response", {
        code: "unknown_response",
        status: resp.status,
        cause,
        data: {
          text,
          url: resp.url,
        }
      })
    }

    if (!resp.ok) {
      let message = "Unknown error"
      let code = "unknown_error"

      if (typeof data?.msg === "string") {
        message = data.msg
      }

      if (typeof data?.Message === "string") {
        message = data.Message.trim()
      }

      if (data?.code) {
        code = String(data.code)
      }

      throw new ErrorWithCode(message, {
        code,
        status: resp.status,
        data: {
          url: resp.url,
          raw: text
        }
      })
    }

    return data as T
  })
}

export function getTimestamp(d = new Date()) {
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const HH = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  const ss = String(d.getSeconds()).padStart(2, "0")

  return yyyy + MM + dd + HH + mm + ss
}

export function getDatestamp(d = new Date()) {
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")

  return yyyy + MM + dd
}

function parseJSON(text: string) {
  if (!text) {
    return text
  }

  if (typeof text !== "string") {
    throw new RangeError("`text` need to be a string, but it's type of " + typeof text)
  }

  try {
    return JSON.parse(text)
  }
  catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const content = String(text).substring(0, 4096)

    throw new SyntaxError(`Could not parse JSON with err: ${message}, origin text: ${content}`)
  }
}

interface ErrorWithCodeOptions {
  code: string
  status: number
  cause?: unknown
  data?: Record<string, string | number>
}

class ErrorWithCode extends Error {
  code: string
  status: number
  cause: unknown
  data: Record<string, string | number>

  constructor(message: string, options: ErrorWithCodeOptions) {
    super(message)

    this.code = options.code
    this.status = options.status || 0
    this.cause = options.cause
    this.data = options.data || {}
  }
}
