import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const GT_TECH_PROJECT_SYSTEM_PROMPT = `
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Its mission is to make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

GT Tech's Project Categories:
- Digital Manufacturing Solutions
- 3D Printing & Prototyping Projects
- Electric Vehicle Development
- Automotive Engineering Solutions
- Aerospace Component Design
- Railway System Development
- Shipbuilding & Marine Engineering
- Construction & Smart City Projects
- Mining Technology Solutions
- AR/VR & Digital Twin Applications
- AI/ML Implementation Projects
- Robotics & Automation Systems
- IoT Integration Solutions
- Training & Certification Programs

Key Technologies GT Tech uses:
- Advanced 3D Printing & Additive Manufacturing
- Digital Twin Technology
- AR/VR Solutions
- AI/ML Algorithms
- Robotics & Automation
- IoT Integration
- CAD/CAM Software
- Simulation & Modeling
- Advanced Materials
- Digital Manufacturing Platforms

You are creating project/product content for GT Tech. Generate professional, engaging project descriptions that showcase GT Tech's technical capabilities and innovation.

Return ONLY a JSON object in the following format:
{
  "title": "Project/Product title reflecting GT Tech's expertise",
  "category": "Project category (e.g., Digital Manufacturing, 3D Printing, Electric Vehicles, etc.)",
  "description": "Detailed project description highlighting GT Tech's approach and capabilities (150-250 words)",
  "technologies": ["Array of 5-8 technologies used in the project"],
  "features": ["Array of 4-6 key features or capabilities"],
  "icon": "Icon value from available options (code, star, layers, lightbulb, zap, rocket, settings, monitor, smartphone, database, globe)",
  "isActive": true,
  "isFeatured": false
}

Ensure all content is professional, technically accurate, and reflects GT Tech's innovative approach to solving industry challenges through advanced technology.
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
          content: GT_TECH_PROJECT_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create a project/product for GT Tech based on this prompt: "${prompt.trim()}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
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
      const requiredFields = ['title', 'category', 'description']
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(parsedContent.technologies)) {
        parsedContent.technologies = parsedContent.technologies ? [parsedContent.technologies] : []
      }
      if (!Array.isArray(parsedContent.features)) {
        parsedContent.features = parsedContent.features ? [parsedContent.features] : []
      }

      // Set default icon if not provided or invalid
      const validIcons = ['code', 'star', 'layers', 'lightbulb', 'zap', 'rocket', 'settings', 'monitor', 'smartphone', 'database', 'globe']
      if (!parsedContent.icon || !validIcons.includes(parsedContent.icon)) {
        parsedContent.icon = 'rocket'
      }

      // Set default poster placeholder
      parsedContent.poster = "/placeholder.svg?height=400&width=600"
      parsedContent.images = [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400"
      ]

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback: create content based on the prompt
      const categories = [
        "Digital Manufacturing", "3D Printing", "Electric Vehicles", 
        "Automotive Engineering", "Aerospace", "Construction", 
        "Mining Technology", "AI/ML Solutions", "Robotics"
      ]
      const icons = ['rocket', 'zap', 'layers', 'lightbulb', 'settings', 'monitor']
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]
      
      parsedContent = {
        title: `GT Tech ${prompt.substring(0, 50)}`,
        category: randomCategory,
        description: `GT Tech's innovative approach to ${prompt.toLowerCase()} leverages cutting-edge technology and engineering expertise. Our solution combines advanced manufacturing techniques, digital transformation capabilities, and industry-leading practices to deliver exceptional results. Through our partnerships and technical excellence, we provide comprehensive solutions that drive efficiency, innovation, and competitive advantage in the modern marketplace.`,
        technologies: [
          "Advanced Manufacturing", "Digital Transformation", "3D Printing", 
          "AI/ML Integration", "Automation Systems", "IoT Solutions"
        ],
        features: [
          "Industry-leading performance",
          "Scalable architecture",
          "Advanced technology integration",
          "Comprehensive support",
          "Cost-effective solution",
          "Future-ready design"
        ],
        icon: randomIcon,
        poster: "/placeholder.svg?height=400&width=600",
        images: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400"
        ],
        isActive: true,
        isFeatured: false
      }
    }

    return NextResponse.json({
      success: true,
      content: JSON.stringify(parsedContent),
      message: 'Project content generated successfully'
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
      { success: false, message: 'Failed to generate project content' },
      { status: 500 }
    )
  }
}