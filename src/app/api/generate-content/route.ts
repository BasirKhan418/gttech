import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a structured prompt for ChatGPT
    const structuredPrompt = `
    Here is the brief about GT-Tech:
    GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Its mission is to make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

Key Offerings

3D Printing: In-house printers for design, prototyping, and production, engineered for efficiency and precision.

Electric Vehicles: E-rickshaws and small commercial vehicles with integrated project management, modular design, and scalable manufacturing.

Sector Solutions:

Automotive: Crash safety structures, interior engineering, system integration, simulation, homologation.

Railways: Locomotive component design, dynamic simulations.

Shipbuilding: Composite structure design, electrical & piping systems.

Aerospace: Full-cycle development, avionics, virtual builds.

Construction & Smart Cities: Sustainable infrastructure modeling.

Mining: Digital mine planning, scheduling, operations management.

Digital Manufacturing: Process optimization, automation, robotics, ergonomics.

Training & Certification
Tailored programs for students, faculty, unemployed youth, and professionals. Certifications are recognized nationally and globally across leading engineering platforms.

Services & Implementations
Custom deployment of mining solutions (Geovia), research tools (Biovia), Dassault’s digital manufacturing platforms, and project management systems. Support for R&D centers, advanced skill hubs, and start-up incubation.

Culture & Careers
Driven by integrity, unity, and excellence, GT Tech values diversity and innovation. Employees are offered growth opportunities, cross-functional collaboration, and the chance to make industry-wide impact. Actively hiring in engineering, administration, mining, and content development.
Based on the following user request, generate content in JSON format with these exact fields:
- sectionName: A short name for this section (e.g., "Hero", "About", "Services")
- title: A compelling title/headline
- description: A detailed description (long form text)
- lists: An array of 3-5 bullet points or features
- designType: Either "hero", "about", "services", "feature", or "testimonial"

User request: "${prompt}"

Please respond with valid JSON only, no additional text or formatting.

Example format:
{
  "sectionName": "Hero Section",
  "title": "Revolutionary AI Solutions for Modern Business",
  "description": "Transform your business with cutting-edge artificial intelligence technology. Our innovative platform delivers unprecedented efficiency and insights to drive your success forward.",
  "lists": ["Advanced AI algorithms", "Real-time analytics", "Seamless integration", "24/7 support"],
  "designType": "hero"
}
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional content generator. Always respond with valid JSON format only, no additional text or code blocks."
        },
        {
          role: "user",
          content: structuredPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let generatedContent
    try {
      generatedContent = JSON.parse(aiResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback structure
      console.error('JSON parsing error:', parseError)
      generatedContent = {
        sectionName: "AI Generated",
        title: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
        description: aiResponse.slice(0, 200) + (aiResponse.length > 200 ? "..." : ""),
        lists: ["Generated feature 1", "Generated feature 2", "Generated feature 3"],
        designType: "feature"
      }
    }

    // Ensure all required fields are present
    const finalContent = {
      sectionName: generatedContent.sectionName || "AI Generated",
      title: generatedContent.title || `Content for: ${prompt.slice(0, 30)}...`,
      description: generatedContent.description || "AI-generated description based on your prompt.",
      poster: generatedContent.poster || "/placeholder.svg?height=400&width=600",
      images: generatedContent.images || [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400"
      ],
      lists: Array.isArray(generatedContent.lists) ? generatedContent.lists : 
             ["Generated point 1", "Generated point 2", "Generated point 3"],
      designType: generatedContent.designType || "feature"
    }

    return NextResponse.json(finalContent)

  } catch (error) {
    console.error('Error in generate-content API:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
}