
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TransactionNotificationRequest {
  amount: number;
  description: string;
  type: 'sent' | 'received';
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, description, type, userEmail }: TransactionNotificationRequest = await req.json();

    const subject = type === 'sent' 
      ? `Transaction envoyée - ${amount}€`
      : `Transaction reçue - ${amount}€`;

    const actionText = type === 'sent' ? 'envoyé' : 'reçu';
    const colorClass = type === 'sent' ? '#ef4444' : '#22c55e';

    const emailResponse = await resend.emails.send({
      from: "HandyPay <onboarding@resend.dev>",
      to: [userEmail],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HandyPay</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid ${colorClass};">
            <h2 style="color: #1f2937; margin-top: 0;">Transaction ${actionText}</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Une transaction de <strong style="color: ${colorClass};">${amount}€</strong> a été ${actionText}e.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Description :</strong> ${description}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              Connectez-vous à votre compte HandyPay pour voir tous les détails de cette transaction.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Ceci est un email automatique de notification de transaction.<br>
              © 2024 HandyPay. Tous droits réservés.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Transaction notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-transaction-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
