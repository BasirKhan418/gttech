// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Configuration for GT Tech CRM
const CRM_BASE_URL = process.env.CRM_BASE_URL;
const CRM_USERNAME = process.env.CRM_API_USERNAME;
const CRM_ACCESS_TOKEN = process.env.CRM_ACCESS_TOKEN;

// Types
interface SubscribeRequest {
  email: string;
  name: string;
  status?: 'enabled' | 'disabled' | 'blocklisted';
  lists?: number[];
  preconfirm_subscriptions?: boolean;
}

interface SubscriberData {
  email: string;
  name: string;
  status: string;
  lists: number[];
  preconfirm_subscriptions: boolean;
  attribs: {
    source: string;
    signup_date: string;
    language_preference: string;
  };
}

interface CRMResponse {
  data?: {
    id: number;
    email: string;
    name: string;
    status: string;
  };
  message?: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data?: {
    id?: number;
    email: string;
    name: string;
    status: string;
    lists: number[];
  };
  error?: string;
  details?: string;
}

// Validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    // Parse request body
    const body: SubscribeRequest = await request.json();
    const { 
      email, 
      name, 
      status = 'enabled', 
      lists = [1], 
      preconfirm_subscriptions = true 
    } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email and name are required fields',
          error: 'Email and name are required fields'
        }, 
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email format',
          error: 'Invalid email format'
        }, 
        { status: 400 }
      );
    }

    // Check for environment variables
    if (!CRM_USERNAME || !CRM_ACCESS_TOKEN) {
      console.error('Missing CRM credentials in environment variables');
      return NextResponse.json(
        { 
          success: false,
          message: 'Server configuration error',
          error: 'Server configuration error'
        }, 
        { status: 500 }
      );
    }

    // Prepare the subscriber data
    const subscriberData: SubscriberData = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      status: status,
      lists: Array.isArray(lists) ? lists : [lists],
      preconfirm_subscriptions: preconfirm_subscriptions,
      attribs: {
        source: 'chatbot',
        signup_date: new Date().toISOString(),
        language_preference: 'en'
      }
    };

    // Create authentication header
    const auth = Buffer.from(`${CRM_USERNAME}:${CRM_ACCESS_TOKEN}`).toString('base64');

    // Make request to CRM API
    const response = await fetch(`${CRM_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(subscriberData)
    });

    const responseData: CRMResponse = await response.json();

    if (!response.ok) {
      console.error('CRM API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      // Handle specific error cases
      if (response.status === 409 || responseData.message?.includes('exists')) {
        return NextResponse.json({ 
          success: true, 
          message: 'User already subscribed',
          data: { 
            email: email.toLowerCase().trim(), 
            name: name.trim(),
            status: status,
            lists: Array.isArray(lists) ? lists : [lists]
          }
        });
      }

      // Handle authentication errors
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Authentication failed',
            error: 'Authentication failed'
          }, 
          { status: 401 }
        );
      }

      throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Success response
    return NextResponse.json({ 
      success: true, 
      message: 'User successfully subscribed',
      data: {
        id: responseData.data?.id,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        status: status,
        lists: Array.isArray(lists) ? lists : [lists]
      }
    });

  } catch (error) {
    console.error('Subscription error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to subscribe user. Please try again later.',
        error: 'Failed to subscribe user. Please try again later.',
        details: process.env.NODE_ENV === 'development' && error instanceof Error 
          ? error.message 
          : undefined
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods with proper error handling
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed',
      error: 'Method not allowed'
    }, 
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed',
      error: 'Method not allowed'
    }, 
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false,
      message: 'Method not allowed',
      error: 'Method not allowed'
    }, 
    { status: 405 }
  );
}