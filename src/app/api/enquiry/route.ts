import { NextRequest, NextResponse } from 'next/server';
import { SendContactNotificationEmail, SendContactConfirmationEmail } from '../../../../email/contact/SendContactEmail';
import type { EnquiryFormData } from '../../../../types/enquiry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      full_name,
      organization_name,
      designation,
      industry_sector,
      interested_in,
      email,
      phone,
    } = body;

    // Required field validation (matches webhook requirements)
    if (!full_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number. Must be at least 10 digits.' },
        { status: 400 }
      );
    }

    // 1. Send to CRM webhook
    const webhookUrl = process.env.GTTECH_WEBHOOK_URL;
    let crmSuccess = false;
    let leadId: number | null = null;

    if (webhookUrl) {
      try {
        const crmRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: full_name.trim(),
            organization_name: organization_name?.trim() || '',
            designation: designation?.trim() || '',
            industry_sector: industry_sector?.trim() || '',
            interested_in: Array.isArray(interested_in) ? interested_in : [],
            email: email?.trim() || '',
            phone: cleanPhone,
          }),
        });

        const crmData = await crmRes.json();
        if (crmRes.ok && crmData.success) {
          crmSuccess = true;
          leadId = crmData.leadId ?? null;
          console.log(`[Enquiry] CRM lead created: ${leadId}`);
        } else {
          console.error('[Enquiry] CRM webhook error:', crmData.error);
        }
      } catch (err) {
        console.error('[Enquiry] CRM webhook unreachable:', err);
      }
    } else {
      console.warn('[Enquiry] GTTECH_WEBHOOK_URL not configured — skipping CRM submission');
    }

    // 2. Send email notifications (map to EnquiryFormData shape)
    if (email?.trim()) {
      const emailData: EnquiryFormData = {
        fullName: full_name.trim(),
        organizationName: organization_name?.trim() || '',
        designation: designation?.trim() || '',
        industrySector: industry_sector?.trim() || '',
        interestedIn: Array.isArray(interested_in) ? interested_in : [],
        productSolution: '',
        businessRequirement: '',
        briefRequirement: `Phone: ${phone}`,
        email: email.trim(),
        mobile: phone,
        city: '',
        state: '',
      };

      await Promise.allSettled([
        SendContactNotificationEmail(emailData),
        SendContactConfirmationEmail(emailData),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'GTTECH inquiry received',
      leadId,
    });

  } catch (err) {
    console.error('[Enquiry API Error]', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
