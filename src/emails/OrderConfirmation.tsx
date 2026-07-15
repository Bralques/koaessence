import {
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Hr, Img,
} from "@react-email/components";

interface OrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Props {
  orderId: string;
  customerName: string;
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
}

const brand = {
  dark: "#1c1c1a",
  green: "#2c5f4a",
  sand: "#f5f0e8",
  muted: "#4a3c2a",
  border: "#ede4d4",
};

export default function OrderConfirmation({
  orderId, customerName, total, paymentMethod, items, address,
}: Props) {
  const shortId = orderId.slice(-8).toUpperCase();
  const isPix = paymentMethod === "stripe" || paymentMethod === "pix";

  return (
    <Html lang="pt-BR">
      <Head />
      <Body style={{ backgroundColor: brand.sand, margin: 0, padding: 0, fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>

          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: 32 }}>
            <Text style={{ fontSize: 22, letterSpacing: 8, color: brand.dark, margin: 0, fontWeight: 300 }}>
              KOA
            </Text>
            <Text style={{ fontSize: 10, letterSpacing: 4, color: brand.green, margin: "4px 0 0", textTransform: "uppercase" }}>
              Algodão Peruano
            </Text>
          </Section>

          {/* Main card */}
          <Section style={{ backgroundColor: "#ffffff", padding: "40px 36px", borderRadius: 2 }}>
            <Heading style={{ fontSize: 24, fontWeight: 300, color: brand.dark, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
              Pedido recebido
            </Heading>
            <Text style={{ fontSize: 13, color: brand.muted, margin: "0 0 28px" }}>
              Olá, {customerName}. Seu pedido <strong>#{shortId}</strong> foi confirmado.
            </Text>

            <Hr style={{ borderColor: brand.border, margin: "0 0 24px" }} />

            {/* Items */}
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: 14 }}>
                <Column style={{ width: "60%" }}>
                  <Text style={{ fontSize: 13, color: brand.dark, margin: 0, fontWeight: 500 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: brand.muted, margin: "2px 0 0", opacity: 0.7 }}>
                    {item.color} · {item.size} · ×{item.quantity}
                  </Text>
                </Column>
                <Column style={{ width: "40%", textAlign: "right" }}>
                  <Text style={{ fontSize: 13, color: brand.dark, margin: 0 }}>
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ borderColor: brand.border, margin: "16px 0" }} />

            {/* Total */}
            <Row>
              <Column style={{ width: "60%" }}>
                <Text style={{ fontSize: 14, color: brand.dark, margin: 0, fontWeight: 600 }}>Total</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={{ fontSize: 16, color: brand.dark, margin: 0, fontWeight: 600 }}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </Text>
              </Column>
            </Row>

            <Hr style={{ borderColor: brand.border, margin: "24px 0" }} />

            {/* Address */}
            <Text style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: brand.muted, margin: "0 0 8px", opacity: 0.6 }}>
              Endereço de entrega
            </Text>
            <Text style={{ fontSize: 13, color: brand.muted, margin: 0, lineHeight: 1.6 }}>
              {address.street}, {address.number}
              {address.complement ? `, ${address.complement}` : ""}<br />
              {address.district} — {address.city}/{address.state}<br />
              CEP {address.zipcode}
            </Text>

            {/* Payment note */}
            <Section style={{ backgroundColor: brand.sand, padding: "16px 20px", marginTop: 24, borderRadius: 2 }}>
              <Text style={{ fontSize: 12, color: brand.muted, margin: 0, lineHeight: 1.6 }}>
                {isPix
                  ? "⏳ Aguardando confirmação do pagamento. Você receberá um novo email assim que o pagamento for aprovado."
                  : "✓ Pagamento em processamento. Você receberá um email de confirmação em breve."}
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", marginTop: 32 }}>
            <Text style={{ fontSize: 11, color: brand.muted, opacity: 0.5, lineHeight: 1.6 }}>
              Dúvidas? Responda este email.<br />
              © {new Date().getFullYear()} KOA · Algodão Peruano
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
