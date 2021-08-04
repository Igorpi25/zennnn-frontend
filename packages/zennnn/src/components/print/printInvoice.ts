import { parseDate } from 'shared/utils/date'
import { ShipmentType, ClientType } from '@/graphql/types'
import Countries from '@/assets/countries/codes.json'
import { i18n } from '@/plugins'

import type {
  GetSpec_getSpec,
  ListOrgRequisites_listOrgRequisites,
  GetSpec_getSpec_client,
  GetSpec_getSpec_shipment,
  GetSpec_getSpec_customs,
  GetSpec_getSpec_invoices,
  GetPaperSpec_getPaperSpec,
  GetPaperSpec_getPaperSpec_client,
  GetPaperSpec_getPaperSpec_shipment,
  GetPaperSpec_getPaperSpec_customs,
  GetPaperSpec_getPaperSpec_invoices,
  GetPaperSpec_getPaperSpec_requisite,
  GetSpec_getSpec_invoices_products,
  GetPaperSpec_getPaperSpec_invoices_products,
} from '@/graphql/types'

type Spec = GetSpec_getSpec | GetPaperSpec_getPaperSpec
type Client = GetSpec_getSpec_client | GetPaperSpec_getPaperSpec_client
type Shipment = GetSpec_getSpec_shipment | GetPaperSpec_getPaperSpec_shipment
type Customs = GetSpec_getSpec_customs | GetPaperSpec_getPaperSpec_customs
type Invoice = GetSpec_getSpec_invoices | GetPaperSpec_getPaperSpec_invoices
type Company =
  | ListOrgRequisites_listOrgRequisites
  | GetPaperSpec_getPaperSpec_requisite
type Product = GetSpec_getSpec_invoices_products &
  GetPaperSpec_getPaperSpec_invoices_products

const genLabel = (path: string, clientLang: string, opt = {} as any) => {
  const flat = opt.flat
  const secondary = opt.secondary
  const value = opt.value
  const fallback = opt.fallback || ''
  const args = opt.args || {}
  const defaultLang = i18n.fallbackLocale.value.toString()
  const isDefaultLang = clientLang === defaultLang
  const title = i18n.te(path, defaultLang)
    ? i18n.t(path, args, { locale: defaultLang })
    : fallback
  const subtitle = i18n.te(path, clientLang)
    ? i18n.t(path, args, { locale: clientLang })
    : ''
  if (flat) {
    const v = subtitle && !isDefaultLang ? `${title} / ${subtitle}` : `${title}`
    return secondary ? v : `${v}:`
  }
  const stack = []
  if (secondary) {
    stack.push({
      text: title,
    })
  } else if (value) {
    stack.push({
      text: [
        {
          text: `${title}: `,
          bold: true,
        },
        {
          text: value,
        },
      ],
    })
  } else {
    stack.push({
      text: `${title}:`,
      bold: true,
    })
  }
  if (subtitle && !isDefaultLang) {
    stack.push({
      text: subtitle,
      color: '#595959',
      fontSize: 6.7,
      italics: true,
    })
  }
  return stack
}

const genValues = (...args: any[]) => {
  let result = ''
  if (args.length > 0) {
    args.forEach((v) => {
      const val = v || ''
      result += result ? ` / ${val}` : val
    })
  }
  return result
}

const genBillToBody = (client: Client, clientLang: string) => {
  const items = [
    [
      {
        stack: genLabel('print.billTo', clientLang),
      },
      {
        stack: [
          {
            text: client.fullName,
          },
        ],
      },
    ],
    client.clientType === ClientType.LEGAL
      ? [
          {
            stack: genLabel('print.addressTelFax', clientLang),
          },
          {
            stack: [
              {
                text: genValues(
                  client.legalAddress,
                  client.phone && client.phone.phone,
                  client.fax && client.fax.phone
                ),
              },
            ],
          },
        ]
      : [
          {
            stack: genLabel('print.addressTelFax', clientLang),
          },
          {
            stack: [
              {
                text: genValues(
                  client.legalAddress,
                  client.phone && client.phone.phone,
                  client.fax && client.fax.phone
                ),
              },
            ],
          },
        ],
  ]
  if (client.importerActive) {
    items.push([
      {
        stack: genLabel('print.importer', clientLang),
      },
      {
        stack: [
          {
            text: client.importerCompanyName,
          },
        ],
      },
    ])
    items.push([
      {
        stack: genLabel('print.addressTelFax', clientLang),
      },
      {
        stack: [
          {
            text: genValues(
              client.deliveryAddress,
              client.importerPhone && client.importerPhone.phone
              // TODO: importer fax
              // client.importerFax && client.importerFax.phone
            ),
          },
        ],
      },
    ])
    items.push([
      {
        stack: genLabel('print.contactPersonEmail', clientLang),
      },
      {
        stack: [
          {
            text: genValues(client.contactPerson, client.importerEmail),
          },
        ],
      },
    ])
  }
  return items
}

const genDeliveryInfoTable = (shipment: Shipment, clientLang: string) => {
  const widths = shipment.sentThrough
    ? ['auto', '*', 'auto', '*', 'auto', '*']
    : ['auto', '*', '50%']
  const row1 = [
    {
      stack: genLabel('print.from', clientLang),
    },
    {
      fit: ['*', 3],
      margin: [0, 10, 0, 0],
      svg: '<svg viewBox="0 0 110 3" width="110" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="110" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="110" y2="2" stroke="black" stroke-width="1"/></svg>',
    },
    {
      stack: genLabel('print.via', clientLang),
    },
    {
      fit: ['*', 3],
      margin: [0, 10, 0, 0],
      svg: '<svg viewBox="0 0 110 3" width="110" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="110" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="110" y2="2" stroke="black" stroke-width="1"/></svg>',
    },
    {
      stack: genLabel('print.to', clientLang),
    },
    '',
  ]
  const row2 = [
    {
      stack: genLabel('print.from', clientLang),
    },
    {
      fit: ['*', 3],
      margin: [0, 10, 0, 0],
      svg: '<svg viewBox="0 0 180 3" width="180" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="180" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="180" y2="2" stroke="black" stroke-width="1"/></svg>',
    },
    {
      stack: genLabel('print.to', clientLang),
    },
  ]
  const row = shipment.sentThrough
    ? [
        {
          colSpan: 2,
          text: shipment.sentFrom,
        },
        '',
        {
          colSpan: 2,
          text: shipment.sentThrough,
        },
        '',
        {
          colSpan: 2,
          text: shipment.sentDestination,
        },
      ]
    : [
        {
          colSpan: 2,
          text: shipment.sentFrom,
        },
        '',
        {
          text: shipment.sentDestination,
        },
      ]
  return {
    widths,
    body: [shipment.sentThrough ? row1 : row2, row],
  }
}

const genShipmentBody = (
  shipment: Shipment,
  customs: Customs,
  clientLang: string
) => {
  const result = []
  if (shipment.activeType === ShipmentType.MARINE) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang, {
          secondary: true,
        }),
      },
      {
        stack: genLabel('print.quanitiyOfContainers', clientLang),
      },
      {
        stack: [
          {
            text: shipment.marine?.containersCount,
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.billOfLadingNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.marine?.billOfLadingNo,
          },
        ],
      },
      {
        stack: genLabel('print.containersAndSealsNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.marine?.containersNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.vessel', clientLang),
      },
      {
        stack: [
          {
            text: shipment.marine?.ship || '',
          },
        ],
      },
      {
        stack: genLabel('print.exportDate', clientLang),
      },
      {
        stack: [
          {
            text: shipment.marine?.exportDate
              ? i18n.d(
                  parseDate(shipment.marine.exportDate) as Date,
                  'short',
                  clientLang
                )
              : '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.incoterms', clientLang),
      },
      {
        stack: [
          {
            text: customs.terms || '',
          },
        ],
      },
      '',
      '',
    ])
  } else if (shipment.activeType === ShipmentType.AIR) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang),
      },
      {
        stack: genLabel('print.quanitiyOfCartons', clientLang),
      },
      {
        stack: [
          {
            text: shipment.air?.numbersOfPkg,
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.airWaybillNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.air?.airWaybillNo,
          },
        ],
      },
      {
        stack: genLabel('print.flight', clientLang),
      },
      {
        stack: [
          {
            text: shipment.air?.flight || '',
          },
        ],
      },
    ])
  } else if (shipment.activeType === ShipmentType.RAILWAY) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang, {
          secondary: true,
        }),
      },
      {
        stack: genLabel('print.qtyOfContainersPlatforms', clientLang),
      },
      {
        stack: [
          {
            text: shipment.railway?.containersCount,
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.crmNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.railway?.internationalWaybillNo,
          },
        ],
      },
      {
        stack: genLabel('print.carriageNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.railway?.containersNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.train', clientLang),
      },
      {
        stack: [
          {
            text: shipment.railway?.train || '',
          },
        ],
      },
      {
        stack: genLabel('print.exportDate', clientLang),
      },
      {
        stack: [
          {
            text: shipment.railway?.exportDate
              ? i18n.d(
                  parseDate(shipment.railway.exportDate) as Date,
                  'short',
                  clientLang
                )
              : '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.incoterms', clientLang),
      },
      {
        stack: [
          {
            text: customs.terms || '',
          },
        ],
      },
      '',
      '',
    ])
  } else if (shipment.activeType === ShipmentType.CAR) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang, {
          secondary: true,
        }),
      },
      {
        stack: genLabel('print.vehicle', clientLang),
      },
      {
        stack: [
          {
            text: shipment.car?.vehicleNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.crmNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.car?.internationalWaybillNo,
          },
        ],
      },
      {
        stack: genLabel('print.trailer', clientLang),
      },
      {
        stack: [
          {
            text: shipment.car?.semitrailerNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.incoterms', clientLang),
      },
      {
        stack: [
          {
            text: customs.terms || '',
          },
        ],
      },
      {
        stack: genLabel('print.exportDate', clientLang),
      },
      {
        stack: [
          {
            text: shipment.car?.exportDate
              ? i18n.d(
                  parseDate(shipment.car.exportDate) as Date,
                  'short',
                  clientLang
                )
              : '',
          },
        ],
      },
    ])
  } else if (shipment.activeType === ShipmentType.MIXED) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang, {
          secondary: true,
        }),
      },
      '',
      '',
    ])
    result.push([
      {
        stack: genLabel('print.fblNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.internationalWaybillNo,
          },
        ],
      },
      {
        stack: genLabel('print.vehicleTrailerFlight', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.containersNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.vessel', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.ship || '',
          },
        ],
      },
      {
        stack: genLabel('print.flight', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.flight || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.train', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.train || '',
          },
        ],
      },
      {
        stack: genLabel('print.vehicle', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.vehicleNo || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.incoterms', clientLang),
      },
      {
        stack: [
          {
            text: customs.terms || '',
          },
        ],
      },
      {
        stack: genLabel('print.exportDate', clientLang),
      },
      {
        stack: [
          {
            text: shipment.mixed?.exportDate
              ? i18n.d(
                  parseDate(shipment.mixed.exportDate) as Date,
                  'short',
                  clientLang
                )
              : '',
          },
        ],
      },
    ])
  } else if (shipment.activeType === ShipmentType.EXPRESS) {
    result.push([
      {
        stack: genLabel('print.methodOfDespatch', clientLang),
      },
      {
        stack: genLabel(`shipmentType.${shipment.activeType}`, clientLang, {
          secondary: true,
        }),
      },
      {
        stack: genLabel('print.quanitiyOfCartons', clientLang),
      },
      {
        stack: [
          {
            text: shipment.express?.numbersOfPkg || '',
          },
        ],
      },
    ])
    result.push([
      {
        stack: genLabel('print.trackingNo', clientLang),
      },
      {
        stack: [
          {
            text: shipment.express?.postalNo,
          },
        ],
      },
      {
        stack: genLabel('print.deliveryCompany', clientLang),
      },
      {
        stack: [
          {
            text: shipment.express?.deliveryService || '',
          },
        ],
      },
    ])
  }
  // Static
  result.push([
    {
      stack: genLabel('print.shippingMarks', clientLang),
    },
    {
      stack: genLabel('print.accordingToContract', clientLang, {
        secondary: true,
      }),
    },
    {
      stack: genLabel('print.exportReference', clientLang),
    },
    {
      stack: genLabel('print.accordingToContract', clientLang, {
        secondary: true,
      }),
    },
  ])
  return result
}

const genItemBody = (invoices: Invoice[], clientLang: string) => {
  let index = 0
  const items = [] as any[]
  invoices.forEach((invoice) => {
    const products = (invoice.products || []) as any[]
    products.forEach((product: Product) => {
      index++
      const price =
        product?.cost?.price ||
        (product as unknown as GetPaperSpec_getPaperSpec_invoices_products)
          ?.costPrice ||
        0
      const amount =
        product?.cost?.amount ||
        (product as unknown as GetPaperSpec_getPaperSpec_invoices_products)
          ?.costAmount ||
        0
      const lang = clientLang
      const word = product?.name
      const wordDefaultLocale = word?.defaultLocale || 'en'
      const wordValues = word?.values || []
      const result = {} as any
      wordValues.forEach((el) => {
        const v = el.v || el.tr
        if (v) {
          result[el.k] = v
        }
      })
      let name = result.en || ''
      if (clientLang !== 'en') {
        const s = result[lang] || result[wordDefaultLocale] || ''
        name += name && s ? ` / ${s}` : s || ''
      }
      if (product?.article) {
        name += ` / ${product.article}`
      }
      const description =
        product?.info?.description ||
        (product as unknown as GetPaperSpec_getPaperSpec_invoices_products)
          ?.description
      if (description) {
        name += `\n${description}`
      }
      const unit = product?.unit || 'pcs'
      const unitText = genLabel(`unit.${unit}`, clientLang, {
        flat: true,
        secondary: true,
      })
      const item = [
        { text: `${index}`, alignment: 'center' },
        name,
        { text: `${product?.qty || 0} ${unitText}`, alignment: 'right' },
        { text: i18n.n(price, 'currency', 'en'), alignment: 'right' },
        { text: i18n.n(amount, 'currency', 'en'), alignment: 'right' },
      ]
      items.push(item)
    })
    if (invoice.discountInCurrency) {
      const item = [
        '',
        {
          text: genLabel('print.supplierDiscount', clientLang, {
            flat: true,
            secondary: true,
          }),
          colSpan: 3,
        },
        '',
        '',
        {
          text: `-${i18n.n(invoice.discountInCurrency, 'currency', 'en')}`,
          alignment: 'right',
        },
      ]
      items.push(item)
    }
  })
  return items
}

const genItemsAmounts = (spec: Spec, customs: Customs, clientLang: string) => {
  const body = [
    [
      '',
      '',
      '',
      {
        text: genLabel('print.subtotal', clientLang, { flat: true }),
        alignment: 'right',
      },
      {
        text: i18n.n(spec.subtotal || 0, 'currency', 'en'),
        alignment: 'right',
      },
    ],
  ] as any[]
  if (customs.discount) {
    body.push([
      '',
      '',
      '',
      {
        text: genLabel('print.discount', clientLang, { flat: true }),
        alignment: 'right',
      },
      {
        text: i18n.n(customs.discount, 'currency', 'en'),
        alignment: 'right',
      },
    ])
  }
  // body.push([
  //   '',
  //   '',
  //   '',
  //   {
  //     text: genLabel('print.vat', clientLang, { flat: true }),
  //     alignment: 'right',
  //   },
  //   {
  //     text: i18n.n(0, 'currency', 'en'),
  //     alignment: 'right',
  //   },
  // ])
  if (customs.cost) {
    body.push([
      '',
      '',
      '',
      {
        text: genLabel('print.shipping', clientLang, { flat: true }),
        alignment: 'right',
      },
      {
        text: i18n.n(customs.cost, 'currency', 'en'),
        alignment: 'right',
      },
    ])
  }
  body.push([
    '',
    '',
    '',
    {
      text: genLabel('print.total', clientLang, { flat: true }),
      alignment: 'right',
    },
    {
      text: i18n.n(spec.total || 0, 'currency', 'en'),
      alignment: 'right',
    },
  ])
  // body.push([
  //   '',
  //   '',
  //   '',
  //   {
  //     text: genLabel('print.withholdingTax', clientLang, { flat: true }),
  //     alignment: 'right',
  //   },
  //   {
  //     text: i18n.n(0, 'currency', 'en'),
  //     alignment: 'right',
  //   },
  // ])
  body.push([
    '',
    '',
    '',
    {
      text: genLabel('print.paid', clientLang, { flat: true }),
      alignment: 'right',
    },
    {
      text: i18n.n(spec.paid || 0, 'currency', 'en'),
      alignment: 'right',
    },
  ])
  const rowIndex = body.length > 3 ? 2 : 1
  body[rowIndex][0] = {
    rowSpan: 2,
    stack: genLabel('print.invoiceCurrency', clientLang),
  }
  body[rowIndex][1] = {
    rowSpan: 2,
    stack: genLabel('print.currencyUSD', clientLang),
  }
  return {
    table: {
      widths: [80, 80, '*', 220, 90],
      body,
    },
    layout: {
      defaultBorder: false,
    },
    margin: [0, 0, 0, 20],
  }
}

const genAmountBody = (
  spec: Spec,
  depositDueDate: Date | null,
  clientLang: string
) => {
  const border = depositDueDate
    ? [false, false, false, true]
    : [false, false, false, false]
  const result = [
    [
      '',
      {
        border,
        text: genLabel('print.balanceDue', clientLang, { flat: true }),
        alignment: 'right',
        fontSize: 13.3,
      },
      {
        border,
        text: i18n.n(spec.balanceDue || 0, 'currency', 'en'),
        alignment: 'right',
        fontSize: 13.3,
      },
    ],
  ] as any[]
  if (depositDueDate) {
    const date = i18n.d(depositDueDate, 'short', clientLang)
    result.push([
      '',
      {
        text: genLabel('print.depositeDue', clientLang, {
          flat: true,
          args: { date },
        }),
        alignment: 'right',
      },
      {
        text: i18n.n(spec.depositDue || 0, 'currency', 'en'),
        alignment: 'right',
      },
    ])
  }
  return result
}

const genAmountInWords = (spec: Spec, clientLang: string) => {
  const defaultLang = i18n.fallbackLocale.value.toString()
  const isDefaultLang = clientLang === defaultLang
  const result = []
  if (spec.amountInWords) {
    result.push([
      {
        text: `${i18n.t('print.amountInWords', '', {
          locale: defaultLang,
        })}: ${spec.amountInWords.toUpperCase()}`,
        alignment: 'right',
      },
    ])
  }
  if (!isDefaultLang && spec.amountInWordsClientLang) {
    result.push([
      {
        text: `${i18n.t('print.amountInWords', '', { locale: clientLang })}: ${
          spec.amountInWordsClientLang
        }`,
        alignment: 'right',
      },
    ])
  }
  return result.length > 0
    ? {
        table: {
          widths: ['*'],
          body: result,
        },
        layout: {
          defaultBorder: false,
        },
        margin: [0, 12, 0, 0],
      }
    : null
}

export default async (
  spec: Spec,
  requisite: Company,
  client: Client,
  shipment: Shipment,
  customs: Customs,
  method = 'open' as 'open' | 'download' | 'print',
  isDraft = true
) => {
  try {
    const bankDetail = requisite?.bankDetails?.find(
      (el) => el.id === requisite.defaultBankDetail
    )
    let win = null
    if (method !== 'download') {
      win = window.open(`/print/${spec.specNo}`, '_blank')
    }
    const defaultLang = i18n.fallbackLocale.value.toString()
    const clientLang = client.locale || defaultLang
    const pdfMake = (
      await import(
        // @ts-ignore
        /* webpackChunkName: "pdfMake" */ 'pdfmake/build/pdfmake'
      )
    ).default

    let font
    if (clientLang === 'zh-Hans') {
      font = 'NotoSansCJKsc'
      pdfMake.fonts = {
        NotoSansCJKsc: {
          normal: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKsc/NotoSansCJKsc-Regular.ttf`,
          bold: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKsc/NotoSansCJKsc-Medium.ttf`,
          italics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKsc/NotoSansCJKsc-Regular.ttf`,
          bolditalics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKsc/NotoSansCJKsc-Medium.ttf`,
        },
      }
    } else if (clientLang === 'zh-Hant') {
      font = 'NotoSansCJKtc'
      pdfMake.fonts = {
        NotoSansCJKtc: {
          normal: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKtc/NotoSansCJKtc-Regular.ttf`,
          bold: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKtc/NotoSansCJKtc-Medium.ttf`,
          italics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKtc/NotoSansCJKtc-Regular.ttf`,
          bolditalics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/NotoSansCJKtc/NotoSansCJKtc-Medium.ttf`,
        },
      }
    } else {
      font = 'MyriadPro'
      pdfMake.fonts = {
        MyriadPro: {
          normal: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/MyriadPro/MyriadPro-Regular.ttf`,
          bold: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/MyriadPro/MyriadPro-Bold.ttf`,
          italics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/MyriadPro/MyriadPro-It.ttf`,
          bolditalics: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/pdf/fonts/MyriadPro/MyriadPro-BoldIt.ttf`,
        },
      }
    }

    const specCreatedAt = parseDate(spec.createdAt) as Date
    const specDueDate = parseDate(spec.createdAt) as Date
    const specDepositDueDate = spec.depositDueDate
      ? (parseDate(spec.depositDueDate) as Date)
      : null
    specDueDate.setTime(specDueDate.getTime() + 7 * 86400000)
    const dd: any = {
      info: {
        title: spec.specNo,
        creator: window.location.hostname,
        producer: window.location.hostname,
      },
      header: () => {
        return [
          {
            columns: [
              {
                width: '50%',
                text: '04021',
                margin: [4, 0, 4, 0],
              },
              {
                width: '50%',
                text: '', // 'Logotype / Логотип',
                alignment: 'right',
                margin: [4, 0, 4, 0],
              },
            ],
            fontSize: 10,
            margin: [40, 20, 40, 0],
          },
        ]
      },
      footer: (currentPage: number, pageCount: number) => {
        return [
          {
            columns: [
              {
                width: '50%',
                margin: [4, 0, 4, 0],
                text: 'This document created automtically by zennnn.com',
              },
              {
                width: '50%',
                margin: [4, 0, 4, 0],
                text: genLabel('print.sheet', clientLang, {
                  flat: true,
                  secondary: true,
                  args: {
                    p: currentPage.toString(),
                    t: pageCount.toString(),
                  },
                }),
                alignment: 'right',
              },
            ],
            fontSize: 8.3,
            italics: true,
            color: '#7b7b7b',
            margin: [40, 10, 40, 0],
          },
        ]
      },
      content: [
        // Requisite block
        {
          table: {
            widths: [110, '*'],
            body: [
              [
                {
                  stack: genLabel('print.seller', clientLang),
                },
                requisite.companyName || '',
              ],
              [
                {
                  stack: genLabel('print.addressTelFax', clientLang),
                },
                genValues(
                  requisite.legalAddress,
                  requisite.phone && requisite.phone.phone,
                  requisite.fax && requisite.fax.phone
                ),
              ],
              [
                {
                  stack: genLabel('print.emailWeb', clientLang),
                },
                genValues(requisite.email, requisite.website),
              ],
              [
                {
                  stack: genLabel('print.vatNo', clientLang),
                },
                requisite.vat || '',
              ],
              [
                {
                  stack: genLabel('print.beneficiyBank', clientLang),
                },
                bankDetail?.bankName || '',
              ],
              [
                {
                  stack: genLabel('print.bankAddress', clientLang),
                },
                bankDetail?.bankAddress || '',
              ],
              [
                {
                  stack: genLabel('print.accountNumberSwift', clientLang),
                },
                // TODO: check bankAccountNumber, replaced `requisite?.bankAccountNumber`
                genValues(bankDetail?.bankAccountNumber, bankDetail?.swift),
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 20],
        },
        // Spec info block
        {
          table: {
            widths: [110, '*', 85, 85],
            body: [
              [
                {
                  fontSize: 17.4,
                  characterSpacing: 4,
                  text: 'INVOICE',
                  bold: true,
                },
                {
                  stack: genLabel('print.invoiceNo', clientLang, {
                    value: spec.specNo,
                  }),
                },
                {
                  alignment: 'right',
                  stack: genLabel('print.invoiceDate', clientLang),
                },
                {
                  alignment: 'right',
                  text: i18n.d(
                    specDepositDueDate || new Date(),
                    'short',
                    clientLang
                  ),
                },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 0],
        },
        // Bill to block
        {
          table: {
            widths: [110, '*'],
            body: genBillToBody(client, clientLang),
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === 2 || i === node.table.body.length ? 1 : 0
            },
            vLineWidth: function () {
              return 0
            },
          },
          margin: [0, 0, 0, 16],
        },
        // Shipment delivery info
        {
          table: genDeliveryInfoTable(shipment, clientLang),
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 16],
        },
        // Shipment
        {
          table: {
            widths: [110, '*', 110, '*'],
            body: genShipmentBody(shipment, customs, clientLang),
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 8],
        },
        // Shipment Country of Origin
        {
          table: {
            widths: [110, '*', 110, '*'],
            body: [
              [
                {
                  stack: genLabel('print.countryOfOrigin', clientLang),
                },
                {
                  stack: genLabel(
                    `countries.${customs.countryOfOrigin}`,
                    clientLang,
                    {
                      fallback: customs.countryOfOrigin
                        ? Countries[customs.countryOfOrigin]
                        : '',
                      secondary: true,
                    }
                  ),
                },
                {
                  stack: genLabel('print.pkgListNo', clientLang),
                },
                {
                  stack: [
                    {
                      text: spec.specNo,
                    },
                  ],
                },
              ],
            ],
            margin: [0, 0, 0, 20],
          },
          layout: {
            hLineWidth: function (i: number) {
              return i === 0 ? 1 : 0
            },
            vLineWidth: function () {
              return 0
            },
          },
          margin: [0, 0, 0, 16],
        },
        // Items
        {
          table: {
            widths: [40, '*', 90, 90, 90],
            body: [
              [
                {
                  stack: genLabel('print.itemNo', clientLang, {
                    secondary: true,
                  }),
                },
                {
                  stack: genLabel('print.itemDescription', clientLang, {
                    secondary: true,
                  }),
                },
                {
                  stack: genLabel('print.itemQuantityUnit', clientLang, {
                    secondary: true,
                  }),
                  alignment: 'right',
                },
                {
                  stack: genLabel('print.itemRatePrice', clientLang, {
                    secondary: true,
                  }),
                  alignment: 'right',
                },
                {
                  stack: genLabel('print.itemAmount', clientLang, {
                    secondary: true,
                  }),
                  alignment: 'right',
                },
              ],
              ...genItemBody((spec.invoices || []) as Invoice[], clientLang),
            ],
          },
          headerRows: 1,
          layout: {
            hLineWidth: function (i: number, node: any) {
              return i === 1 || i === node.table.body.length ? 1 : 0
            },
            vLineWidth: function () {
              return 0
            },
          },
        },
        // Items Amounts
        genItemsAmounts(spec, customs, clientLang),
        // Amount
        {
          table: {
            widths: ['*', '40%', 90],
            body: genAmountBody(spec, specDepositDueDate, clientLang),
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 0],
        },
        // Amount in Words
        genAmountInWords(spec, clientLang),
        // Contract
        {
          table: {
            widths: [110, '*', 110, '*'],
            body: [
              [
                {
                  stack: genLabel('print.contractNo', clientLang),
                },
                {
                  stack: [
                    {
                      text: spec.specNo,
                    },
                  ],
                },
                {
                  stack: genLabel('print.contractDate', clientLang),
                },
                {
                  stack: [
                    {
                      text: i18n.d(specCreatedAt, 'short', clientLang),
                    },
                  ],
                },
              ],
              [
                {
                  stack: genLabel('print.terms', clientLang),
                },
                {
                  stack: genLabel('print.NET7', clientLang, {
                    secondary: true,
                  }),
                },
                {
                  stack: genLabel('print.dateDue', clientLang),
                },
                {
                  stack: [
                    {
                      text: i18n.d(specDueDate, 'short', clientLang),
                    },
                  ],
                },
              ],
              [
                {
                  stack: genLabel('print.paymentMethods', clientLang),
                },
                {
                  stack: genLabel('print.TTaccordingToContract', clientLang, {
                    secondary: true,
                  }),
                },
                '',
                '',
              ],
            ],
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 1 : 0
            },
            vLineWidth: function () {
              return 0
            },
          },
          margin: [0, 32, 0, 10],
        },
        // Contract confirmation text
        {
          stack: genLabel('print.confirmation', clientLang),
          margin: [4, 0, 4, 20],
        },
        // Sign
        // TODO: manager name transcript
        {
          table: {
            widths: [110, '*'],
            body: [
              [
                {
                  stack: genLabel('print.manager', clientLang),
                },
                {
                  stack: [
                    {
                      text: client.companyOwner && client.companyOwner.fullName,
                    },
                  ],
                },
              ],
              [
                {
                  stack: genLabel('print.sign', clientLang),
                },
                '',
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
      ],
      defaultStyle: {
        font,
        fontSize: 8.3,
      },
    }
    if (isDraft) {
      dd.watermark = {
        text: i18n.t('paper.draft'),
        color: 'gray',
        opacity: 0.3,
        bold: true,
        italics: false,
      }
    }
    const pdfDocGenerator = pdfMake.createPdf(dd)
    if (method === 'download') {
      pdfDocGenerator.download(spec.specNo)
    } else if (method === 'print') {
      pdfDocGenerator.print({}, win)
    } else {
      pdfDocGenerator.open({}, win)
    }
  } catch (error) {
    throw new Error(error)
  }
}
