const BASE = process.env.APPMAX_BASE_URL ?? "https://api.appmax.com.br/api/v3";
const TOKEN = process.env.APPMAX_TOKEN ?? "";

interface AppmaxCustomer {
  firstname: string;
  email: string;
  phone: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

interface AppmaxProduct {
  sku: string;
  name: string;
  qty: number;
  price: number;
}

interface AppmaxPaymentPix {
  type: "pix";
}

interface AppmaxPaymentCard {
  type: "credit";
  installments: number;
  card_token: string;
}

export type AppmaxPayment = AppmaxPaymentPix | AppmaxPaymentCard;

async function request(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? `AppMax error: ${res.status}`);
  }

  return data;
}

export async function createOrder(
  customer: AppmaxCustomer,
  products: AppmaxProduct[],
  payment: AppmaxPayment,
  orderId: string
) {
  return request("/order", {
    customer,
    products,
    payment,
    external_id: orderId,
    postback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/appmax`,
  });
}

export async function getOrderStatus(appmaxOrderId: string) {
  const res = await fetch(`${BASE}/order/${appmaxOrderId}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.json();
}
