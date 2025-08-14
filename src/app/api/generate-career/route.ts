import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const GT_TECH_CAREER_SYSTEM_PROMPT = `
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Its mission is to make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

Key Sectors & Technologies:
- 3D Printing & Additive Manufacturing
- Electric Vehicles (E-rickshaws, commercial vehicles)
- Automotive (crash safety, interior engineering, simulation)
- Railways (locomotive components, dynamic simulations)
- Shipbuilding (composite structures, electrical systems)
- Aerospace (avionics, virtual builds, full-cycle development)
- Construction & Smart Cities (sustainable infrastructure)
- Mining (digital planning, operations management)
- Digital Manufacturing (automation, robotics, ergonomics)

Training & Development:
- Centers of Excellence for skill development
- Certifications recognized globally
- Programs for students, faculty, unemployed youth, professionals
- R&D center support and start-up incubation

Company Culture:
- Driven by integrity, unity, and excellence
- Values diversity and innovation
- Growth opportunities and cross-functional collaboration
- Making industry-wide impact through technology accessibility

You are creating job postings for GT Tech. Generate professional, engaging career opportunities that align with GT Tech's mission, values, and technical focus areas.

Return ONLY a JSON object in the following format:
{
  "role": "Job title reflecting GT Tech's technical focus",
  "experience": "Experience level (e.g., '2-4 years', '5+ years', 'Entry Level')",
  "requirements": ["Array of specific requirements and qualifications"],
  "description": "Compelling job description highlighting GT Tech's mission and the role's impact",
  "location": "Work location (consider GT Tech's presence in India and global partnerships)",
  "mode": "Work mode: 'remote', 'hybrid', or 'onsite'",
  "applyUrl": "https://gttech.careers/apply",
  "salary": "Competitive salary range appropriate for the role and location",
  "department": "Relevant department (Engineering, R&D, Training, Operations, etc.)",
  "employmentType": "full-time, part-time, contract, or internship",
  "skills": ["Array of technical and soft skills relevant to GT Tech"],
  "benefits": ["Array of benefits that align with GT Tech's employee-focused culture"],
  "applicationDeadline": "Date in YYYY-MM-DD format (30 days from now)"
}

Ensure all content is professional, technically accurate, and reflects GT Tech's innovative culture and commitment to making advanced technologies accessible.
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
          content: GT_TECH_CAREER_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create a career posting for GT Tech based on this prompt: "${prompt.trim()}"`
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
      const requiredFields = ['role', 'experience', 'requirements', 'description', 'location', 'mode']
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(parsedContent.requirements)) {
        parsedContent.requirements = [parsedContent.requirements]
      }
      if (!Array.isArray(parsedContent.skills)) {
        parsedContent.skills = []
      }
      if (!Array.isArray(parsedContent.benefits)) {
        parsedContent.benefits = []
      }

      // Set default application deadline if not provided
      if (!parsedContent.applicationDeadline) {
        const deadline = new Date()
        deadline.setDate(deadline.getDate() + 30)
        parsedContent.applicationDeadline = deadline.toISOString().split('T')[0]
      }

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback: create content based on the prompt
      const departments = ["Engineering", "R&D", "Operations", "Training", "Digital Manufacturing", "Product Development"]
      const modes = ["hybrid", "onsite", "remote"]
      const randomDepartment = departments[Math.floor(Math.random() * departments.length)]
      const randomMode = modes[Math.floor(Math.random() * modes.length)]
      
      // Extract experience level from prompt
      let experience = "2-5 years"
      if (prompt.toLowerCase().includes("senior") || prompt.toLowerCase().includes("lead")) {
        experience = "5+ years"
      } else if (prompt.toLowerCase().includes("junior") || prompt.toLowerCase().includes("entry")) {
        experience = "0-2 years"
      }

      parsedContent = {
        role: `GT Tech ${prompt.substring(0, 50)}`,
        experience: experience,
        requirements: [
          "Bachelor's degree in relevant engineering field",
          "Strong problem-solving and analytical skills",
          "Experience with modern technologies and tools",
          "Excellent communication and teamwork abilities"
        ],
        description: `Join GT Tech's innovative team and contribute to cutting-edge ${prompt.toLowerCase()}. Work with industry-leading technologies in 3D printing, automation, and advanced manufacturing. Help make next-gen technologies accessible while driving industry competitiveness.`,
        location: "Bhubaneswar, Odisha / Remote",
        mode: randomMode,
        applyUrl: "https://gttech.careers/apply",
        salary: "Competitive package based on experience",
        department: randomDepartment,
        employmentType: "full-time",
        skills: ["Technical Excellence", "Innovation", "Collaboration", "Problem Solving"],
        benefits: [
          "Competitive salary and benefits",
          "Growth opportunities",
          "Cutting-edge technology exposure",
          "Industry-wide impact projects"
        ],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }

    return NextResponse.json({
      success: true,
      content: JSON.stringify(parsedContent),
      message: 'Career posting generated successfully'
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
      { success: false, message: 'Failed to generate career posting' },
      { status: 500 }
    )
  }
}