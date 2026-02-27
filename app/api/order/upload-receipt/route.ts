import { NextResponse } from "next/server";
import { query } from "@/db";
import { v2 as cloudinary } from "cloudinary";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const orderId = formData.get("orderId") as string | null;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "Archivo y orderId requeridos" },
        { status: 400 }
      );
    }

    // 🔎 Verificar orden
    const orderResult = await query(
      `SELECT id, payment_method, payment_status, payment_receipt_url
       FROM orders
       WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];

    if (order.payment_method !== "transfer") {
      return NextResponse.json(
        { error: "Solo transferencia puede subir comprobante" },
        { status: 400 }
      );
    }

    if (order.payment_status === "approved") {
      return NextResponse.json(
        { error: "Orden ya aprobada" },
        { status: 400 }
      );
    }

    if (order.payment_receipt_url) {
      return NextResponse.json(
        { error: "Comprobante ya subido" },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `payment_receipts/${orderId}`,
            resource_type: "auto",
            public_id: orderId,
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;

    await query(
      `UPDATE orders
       SET payment_receipt_url = $1,
           payment_status = 'receipt_uploaded',
           updated_at = NOW()
       WHERE id = $2`,
      [imageUrl, orderId]
    );

    return NextResponse.json({
      message: "Comprobante subido",
      url: imageUrl,
    });

  } catch (error) {
    console.error("Error upload receipt:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}