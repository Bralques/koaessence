import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation from "@/emails/OrderConfirmation";
import PaymentConfirmed from "@/emails/PaymentConfirmed";

let _resend: Resend | undefined;

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = "KOA <onboarding@resend.dev>"; // em produção, troque pelo seu domínio verificado

interface OrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export async function sendOrderConfirmation({
  orderId,
  customerName,
  customerEmail,
  total,
  paymentMethod,
  items,
  address,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipcode: string;
  };
}) {
  const html = await render(
    OrderConfirmation({ orderId, customerName, total, paymentMethod, items, address })
  );

  await getResend().emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Pedido #${orderId.slice(-8).toUpperCase()} recebido — KOA`,
    html,
  });
}

export async function sendPaymentConfirmed({
  orderId,
  customerName,
  customerEmail,
  total,
  items,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: OrderItem[];
}) {
  const html = await render(
    PaymentConfirmed({ orderId, customerName, total, items })
  );

  await getResend().emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Pagamento confirmado — KOA #${orderId.slice(-8).toUpperCase()}`,
    html,
  });
}
