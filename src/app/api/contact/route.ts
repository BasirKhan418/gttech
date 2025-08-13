import { NextRequest, NextResponse } from 'next/server';
import { SendContactNotificationEmail, SendContactConfirmationEmail } from '../../../../email/contact/SendContactEmail';

interface ContactFormData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

const validateContactData = (data: ContactFormData): { valid: boolean; error?: string } => {
  const { name, email, mobile, message } = data;

  if (!name?.trim() || name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email address format' };
  }

  const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
  if (!phoneRegex.test(mobile.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  if (!message?.trim() || message.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long' };
  }

  return { valid: true };
};

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    
    const validation = validateContactData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const [notificationResult, confirmationResult] = await Promise.allSettled([
      SendContactNotificationEmail(data),
      SendContactConfirmationEmail(data)
    ]);

    const notificationSuccess = notificationResult.status === 'fulfilled' && notificationResult.value.success;
    const confirmationSuccess = confirmationResult.status === 'fulfilled' && confirmationResult.value.success;

    if (notificationSuccess && confirmationSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.'
      });
    } else if (notificationSuccess || confirmationSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent. We\'ll get back to you soon!'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again or contact us directly.' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}