import {
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Hr,
} from "@react-email/components";

interface Props {
  orderId: string;
  customerName: string;
  total: number;
  items: { name: string; color: string; size: string; quantity: number; price: number }[];
}

const brand = {
  dark: "#1c1c1a",
  green: "#2c5f4a",
  sand: "#f5f0e8",
  muted: "#4a3c2a",
  border: "#ede4d4",
};

export default function PaymentConfirmed({ orderId, customerName, total, items }: Props) {
  const shortId = orderId.slice(-8).toUpperCase();

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

            {/* Green checkmark badge */}
            <Section style={{ textAlign: "center", marginBottom: 28 }}>
              <Text style={{ fontSize: 32, margin: "0 0 8px" }}>✓</Text>
              <Text style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: brand.green, margin: 0 }}>
                Pagamento aprovado
              </Text>
            </Section>

            <Heading style={{ fontSize: 24, fontWeight: 300, color: brand.dark, margin: "0 0 8px", fontFamily: "Georgia, serif", textAlign: "center" }}>
              Seu pedido está confirmado
            </Heading>
            <Text style={{ fontSize: 13, color: brand.muted, margin: "0 0 28px", textAlign: "center" }}>
              {customerName}, seu pedido <strong>#{shortId}</strong> foi pago e está em preparação.
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

            <Row>
              <Column style={{ width: "60%" }}>
                <Text style={{ fontSize: 14, color: brand.dark, margin: 0, fontWeight: 600 }}>Total pago</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={{ fontSize: 16, color: brand.dark, margin: 0, fontWeight: 600 }}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </Text>
              </Column>
            </Row>

            <Hr style={{ borderColor: brand.border, margin: "24px 0" }} />

            {/* Delivery estimate */}
            <Section style={{ backgroundColor: brand.sand, padding: "16px 20px", borderRadius: 2 }}>
              <Text style={{ fontSize: 12, color: brand.muted, margin: 0, lineHeight: 1.7 }}>
                🚚 Entrega estimada em <strong>5 a 7 dias úteis</strong>.<br />
                Você receberá o código de rastreamento por email assim que o pedido for enviado.
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
