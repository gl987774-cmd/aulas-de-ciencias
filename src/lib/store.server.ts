export interface Order {
  paymentId: number;
  accessToken: string;
  email: string;
  phone: string;
  name: string;
  planName: string;
  amount: number;
  whatsappDelivery: boolean;
  paid: boolean;
  emailSent: boolean;
  createdAt: string;
  paidAt?: string;
}

const orders = new Map<string, Order>();

export function createOrder(data: {
  paymentId: number;
  email: string;
  phone: string;
  name: string;
  planName: string;
  amount: number;
  whatsappDelivery: boolean;
}): Order {
  const accessToken = crypto.randomUUID();
  const order: Order = {
    ...data,
    accessToken,
    paid: false,
    emailSent: false,
    createdAt: new Date().toISOString(),
  };
  orders.set(data.paymentId.toString(), order);
  orders.set(accessToken, order);
  return order;
}

export function getOrderByPayment(paymentId: number | string): Order | undefined {
  return orders.get(paymentId.toString());
}

export function getOrderByToken(token: string): Order | undefined {
  return orders.get(token);
}

export function confirmOrder(paymentId: number | string): Order | undefined {
  const order = orders.get(paymentId.toString());
  if (order && !order.paid) {
    order.paid = true;
    order.paidAt = new Date().toISOString();
  }
  return order;
}

export function markEmailSent(paymentId: number | string): void {
  const order = orders.get(paymentId.toString());
  if (order) {
    order.emailSent = true;
  }
}
