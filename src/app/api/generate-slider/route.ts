import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env file
})

const GT_TECH_SYSTEM_PROMPT = `
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Its mission is to make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

Key Offerings:
- 3D Printing: In-house printers for design, prototyping, and production, engineered for efficiency and precision.
- Electric Vehicles: E-rickshaws and small commercial vehicles with integrated project management, modular design, and scalable manufacturing.
- Sector Solutions:
  * Automotive: Crash safety structures, interior engineering, system integration, simulation, homologation.
  * Railways: Locomotive component design, dynamic simulations.
  * Shipbuilding: Composite structure design, electrical & piping systems.
  * Aerospace: Full-cycle development, avionics, virtual builds.
  * Construction & Smart Cities: Sustainable infrastructure modeling.
  * Mining: Digital mine planning, scheduling, operations management.
  * Digital Manufacturing: Process optimization, automation, robotics, ergonomics.

Training & Certification: Tailored programs for students, faculty, unemployed youth, and professionals. Certifications are recognized nationally and globally across leading engineering platforms.

Services & Implementations: Custom deployment of mining solutions (Geovia), research tools (Biovia), Dassault's digital manufacturing platforms, and project management systems. Support for R&D centers, advanced skill hubs, and start-up incubation.

Culture & Careers: Driven by integrity, unity, and excellence, GT Tech values diversity and innovation. Employees are offered growth opportunities, cross-functional collaboration, and the chance to make industry-wide impact.

You are tasked with creating website slider content for GT Tech. Generate compelling, professional slider content that aligns with GT Tech's brand and services.

Return ONLY a JSON object in the following format:
{
  "title": "Engaging slider title (max 80 characters)",
  "category": "One of: Hero, Product, Service, Feature, Testimonial, About, Contact, Technology, Innovation, Training",
  "description": "Compelling description that highlights GT Tech's capabilities (max 200 characters)",
  "imageUrl": "Optional: Suggest a relevant image description or leave empty"
}

Make the content engaging, professional, and directly related to GT Tech's services and mission.
`

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-3.5-turbo' for cost efficiency
      messages: [
        {
          role: 'system',
          content: GT_TECH_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create a website slider for GT Tech based on this prompt: "${prompt.trim()}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { success: false, message: 'No response from AI' },
        { status: 500 }
      )
    }

    // Try to parse the JSON response
    let parsedContent
    try {
      // Clean up the response to ensure it's valid JSON
      const cleanedResponse = aiResponse.trim()
      parsedContent = JSON.parse(cleanedResponse)
      
      // Validate the required fields
      if (!parsedContent.title || !parsedContent.category || !parsedContent.description) {
        throw new Error('Missing required fields in AI response')
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback: create content based on the prompt
      const categories = ["Hero", "Product", "Service", "Feature", "Technology", "Innovation", "Training"]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      
      parsedContent = {
        title: `GT Tech: ${prompt.substring(0, 60)}`,
        category: randomCategory,
        description: `Experience GT Tech's innovative solutions in ${prompt.toLowerCase()}. Leading the future with cutting-edge technology.`,
        imageUrl: ""
      }
    }

    return NextResponse.json({
      success: true,
      content: JSON.stringify(parsedContent),
      message: 'Slider content generated successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    
    // Return a more specific error message
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, message: 'Invalid OpenAI API key' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, message: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { success: false, message: 'Failed to generate slider content' },
      { status: 500 }
    )
  }
}