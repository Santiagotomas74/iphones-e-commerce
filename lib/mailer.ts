import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

type Product = {
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
};

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  products: Product[],
  total: number
) {
    console.log("Preparando email para:", email);
    console.log("Productos a incluir en el email:", products);
    console.log("Total a incluir en el email:", total);
  const productsHtml = products
    .map(
      (p) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          <img src="${p.image || ""}" width="60" style="border-radius:8px;" />
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ${p.name}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          x${p.quantity}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          $${p.unit_price}
        </td>
      </tr>
    `
    )
    .join("");

  await transporter.sendMail({
    from: `"iPhone Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmación de compra",
    html: `
    
    <div style="background:#f5f5f7;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:30px;">
        
        <h1 style="margin:0;font-size:26px;">
          ¡Gracias por tu compra!
        </h1>

        <p style="color:#555;margin-top:10px;">
          Tu pago fue aprobado correctamente.
        </p>

        <div style="margin-top:20px;padding:15px;background:#f2f2f2;border-radius:8px;">
          <strong>Número de orden:</strong> ${orderId}
        </div>

        <h2 style="margin-top:30px;font-size:20px;">
          Resumen del pedido
        </h2>

        <table width="100%" style="border-collapse:collapse;margin-top:10px;">
          <thead>
            <tr style="text-align:left;color:#777;font-size:14px;">
              <th></th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>

          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div style="margin-top:20px;text-align:right;font-size:18px;">
          <strong>Total: $${total}</strong>
        </div>

        <p style="margin-top:30px;color:#555;">
          Tu pedido ya se encuentra en preparación.
        </p>

        <div style="margin-top:30px;text-align:center;">
          <a 
            href="https://tutienda.com/orders/${orderId}" 
            style="
              background:black;
              color:white;
              padding:12px 22px;
              border-radius:6px;
              text-decoration:none;
              font-weight:bold;
            "
          >
            Ver mi pedido
          </a>
        </div>

        <hr style="margin:40px 0;border:none;border-top:1px solid #eee;"/>

        <p style="font-size:12px;color:#999;text-align:center;">
          © iPhone Store — Todos los derechos reservados
        </p>

      </div>
    </div>

    `,
  });
}
export async function sendReceiptUploadedEmail(
  orderId: string,
  receiptUrl: string
) {
  const admins = process.env.ADMIN_EMAILS?.split(",") || [];

  await transporter.sendMail({
    from: `"iPhone Store" <${process.env.EMAIL_USER}>`,
    to: admins,
    subject: `Nuevo comprobante subido - Orden #${orderId}`,
    html: `
      <div style="font-family:Arial;padding:30px;">
        
        <h2>Nuevo comprobante de pago subido</h2>

        <p>
          Se ha subido un comprobante de pago para la orden:
        </p>

        <p>
          <strong>Orden:</strong> #${orderId}
        </p>

        <p>
          Podés revisar el comprobante aquí:
        </p>

        <p>
          <a href="${receiptUrl}" target="_blank">
            Ver comprobante
          </a>
        
        </p>
        
          <a 
          href="https://iphones-e-commerce.vercel.app/admin"
          style="
            background:black;
            color:white;
            padding:10px 16px;
            border-radius:6px;
            text-decoration:none;
          "
        >
          ir a la administración
        </a>

        <br/>

        <p>
          También podés revisarlo desde el panel de administración.
        </p>

      </div>
    `,
  });
}
export async function sendAdminPaymentNotification(
  orderId: string,
  amount: number,
  currency: string,
  userEmail: string
) {
  const admins = process.env.ADMIN_EMAILS?.split(",") || [];

  await transporter.sendMail({
    from: `"iPhone Store" <${process.env.EMAIL_USER}>`,
    to: admins,
    subject: `💰 Pago acreditado - Orden #${orderId}`,
    html: `
      <div style="font-family:Arial;padding:30px;">
        
        <h2>Pago acreditado en Mercado Pago</h2>

        <p><strong>Orden:</strong> #${orderId}</p>
        <p><strong>Cliente:</strong> ${userEmail}</p>
        <p><strong>Monto:</strong> ${currency} ${amount}</p>

        <br/>

        <a 
          href="https://iphones-e-commerce.vercel.app/admin"
          style="
            background:black;
            color:white;
            padding:10px 16px;
            border-radius:6px;
            text-decoration:none;
          "
        >
          Ver orden en admin
        </a>

      </div>
    `,
  });
}