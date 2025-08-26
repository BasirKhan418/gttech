import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const GT_TECH_INDUSTRY_SYSTEM_PROMPT = `
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Its mission is to make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

Key Industry Sectors GT Tech serves:
- 3D Printing & Additive Manufacturing
- Electric Vehicles (E-rickshaws, commercial vehicles)
- Automotive (crash safety, interior engineering, simulation)
- Railways (locomotive components, dynamic simulations)
- Shipbuilding (composite structures, electrical systems)
- Aerospace (avionics, virtual builds, full-cycle development)
- Construction & Smart Cities (sustainable infrastructure)
- Mining (digital planning, operations management)
- Digital Manufacturing (automation, robotics, ergonomics)

Key Technologies:
- AR/VR Solutions & Digital Twins
- AI/ML Implementation
- Robotics & Automation
- IoT Integration
- 3D Printing Technology
- Advanced Manufacturing
- Digital Transformation

You are creating industry content for GT Tech. Generate professional, engaging industry descriptions that align with GT Tech's expertise and technical focus areas.

Return ONLY a JSON object in the following format:
{
  "title": "Industry title reflecting GT Tech's expertise",
  "subtitle": "Compelling subtitle highlighting value proposition",
  "description": "Detailed description of GT Tech's capabilities in this industry (200-300 words)",
  "highlights": ["Array of 4-6 key highlights/benefits"],
  "technologies": ["Array of 6-10 relevant technologies GT Tech uses"],
  "category": "Relevant category slug (automotive, aerospace, construction, manufacturing, etc.)",
  "gradientFrom": "Tailwind gradient start class (e.g., 'from-blue-500/20')",
  "gradientTo": "Tailwind gradient end class (e.g., 'to-cyan-500/20')",
  "borderColor": "Tailwind border color class",
  "hoverBorderColor": "Tailwind hover border color class",
  "textColor": "Tailwind text color class",
  "hoverTextColor": "Tailwind hover text color class",
  "buttonGradient": "Tailwind button gradient classes",
  "iconBg": "Tailwind icon background gradient",
  "iconBorder": "Tailwind icon border color",
  "isActive": true,
  "isFeatured": false
}

Ensure all content is professional, technically accurate, and reflects GT Tech's innovative capabilities and commitment to making advanced technologies accessible across industries.
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
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: GT_TECH_INDUSTRY_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create industry content for GT Tech based on this prompt: "${prompt.trim()}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
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
      const cleanedResponse = aiResponse.trim()
      parsedContent = JSON.parse(cleanedResponse)
      
      // Validate required fields
      const requiredFields = ['title', 'subtitle', 'description', 'highlights', 'technologies']
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(parsedContent.highlights)) {
        parsedContent.highlights = [parsedContent.highlights]
      }
      if (!Array.isArray(parsedContent.technologies)) {
        parsedContent.technologies = [parsedContent.technologies]
      }

      // Set default values for styling if not provided
      if (!parsedContent.gradientFrom) parsedContent.gradientFrom = "from-blue-500/20"
      if (!parsedContent.gradientTo) parsedContent.gradientTo = "to-cyan-500/20"
      if (!parsedContent.borderColor) parsedContent.borderColor = "border-blue-500/20"
      if (!parsedContent.hoverBorderColor) parsedContent.hoverBorderColor = "hover:border-blue-400/40"
      if (!parsedContent.textColor) parsedContent.textColor = "text-blue-400"
      if (!parsedContent.hoverTextColor) parsedContent.hoverTextColor = "group-hover:text-blue-200"
      if (!parsedContent.buttonGradient) parsedContent.buttonGradient = "from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90"
      if (!parsedContent.iconBg) parsedContent.iconBg = "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
      if (!parsedContent.iconBorder) parsedContent.iconBorder = "border-blue-400/30"
      if (!parsedContent.category) parsedContent.category = "technology"

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback: create content based on the prompt
      const categories = ["automotive", "aerospace", "construction", "manufacturing", "technology", "mining"]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      
      parsedContent = {
        title: `GT Tech ${prompt.substring(0, 50)}`,
        subtitle: "Advanced Engineering Solutions",
        description: `GT Tech delivers cutting-edge solutions in ${prompt.toLowerCase()}. Our expertise in digital transformation, 3D printing, and advanced manufacturing enables us to provide innovative solutions that drive industry competitiveness and technological advancement.`,
        highlights: [
          "Industry-leading technology solutions",
          "Expert engineering capabilities",
          "Digital transformation expertise",
          "Proven track record of success",
          "Comprehensive support services",
          "Innovation-driven approach"
        ],
        technologies: [
          "3D Printing", "Digital Manufacturing", "AR/VR Solutions", 
          "AI/ML Implementation", "Robotics", "Automation", 
          "IoT Integration", "Advanced Materials", "Digital Twins"
        ],
        category: randomCategory,
        gradientFrom: "from-blue-500/20",
        gradientTo: "to-cyan-500/20",
        borderColor: "border-blue-500/20",
        hoverBorderColor: "hover:border-blue-400/40",
        textColor: "text-blue-400",
        hoverTextColor: "group-hover:text-blue-200",
        buttonGradient: "from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90",
        iconBg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
        iconBorder: "border-blue-400/30",
        isActive: true,
        isFeatured: false
      }
    }

    return NextResponse.json({
      success: true,
      content: JSON.stringify(parsedContent),
      message: 'Industry content generated successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    
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
      { success: false, message: 'Failed to generate industry content' },
      { status: 500 }
    )
  }
}