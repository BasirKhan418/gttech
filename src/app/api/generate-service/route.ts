import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const GT_TECH_SERVICE_SYSTEM_PROMPT = `
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

GT Tech's Service Sections:
- Development: Custom software development, web applications, mobile apps, enterprise solutions, API development, system integration
- Design: UI/UX design, product design, architectural visualization, 3D modeling, brand identity, design systems
- Marketing: Digital marketing, content strategy, SEO optimization, social media management, brand positioning, growth hacking
- Consulting: Technology consulting, digital transformation, process optimization, strategic planning, technical audits, innovation workshops

GT Tech's Core Technologies & Capabilities:
- Advanced 3D Printing & Additive Manufacturing
- Next.js, React, TypeScript for web development
- Cloud services (AWS, Azure, Google Cloud)
- AI/ML integration and automation
- Digital Twin technology and AR/VR solutions
- CAD/CAM software and engineering tools
- Database systems (PostgreSQL, MongoDB, Redis)
- DevOps and CI/CD pipelines
- Mobile development (React Native, Flutter)
- Blockchain and Web3 technologies

Service Design Types Available:
- Modern: Clean, contemporary aesthetics with latest trends
- Minimal: Simple, focused approach with essential elements
- Classic: Timeless design principles with proven effectiveness
- Brutalist: Bold, statement-making design with strong visual impact
- Glassmorphism: Translucent, layered visual effects with depth

You are creating service content for GT Tech. Generate professional, compelling service descriptions that showcase GT Tech's technical expertise and business value.

Return ONLY a JSON object in the following format:
{
  "title": "Service title that reflects GT Tech's expertise and the specific offering (max 80 characters)",
  "tagline": "Compelling one-liner that highlights key value proposition and competitive advantage",
  "description": "Detailed service description that showcases GT Tech's approach, methodology, and expected outcomes (250-400 words)",
  "technologies": ["Array of 5-10 relevant technologies, frameworks, or tools used"],
  "capabilities": ["Array of 4-8 key service capabilities or features"],
  "lists": ["Array of 4-6 service benefits, deliverables, or outcomes"],
  "icon": "Icon value from available options (code, lightbulb, rocket, settings, star, layers, zap, monitor, smartphone, database, globe, shield, tool)",
  "designType": "The specified design approach for the service"
}

Content Guidelines:
- Write compelling, professional copy that positions GT Tech as an industry leader
- Focus on technical excellence, innovation, and measurable business value
- Use appropriate technical terminology for enterprise clients
- Emphasize GT Tech's unique partnerships and academic connections
- Highlight competitive advantages and proven methodologies
- Include specific deliverables and expected outcomes
- Ensure content appeals to decision-makers and technical stakeholders
`

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, prompt:userPrompt, section, designType } = await request.json()
    console.log('Received request with:', { systemPrompt, userPrompt, section, designType })

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'User prompt is required' },
        { status: 400 }
      )
    }

    if (!section) {
      return NextResponse.json(
        { success: false, message: 'Service section is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create enhanced prompt with section and design type context
    const enhancedUserPrompt = `Create a ${section} service with ${designType} design approach based on this description: ${userPrompt.trim()}

Section: ${section}
Design Type: ${designType}

Please ensure the service aligns with GT Tech's expertise in advanced technology solutions and targets enterprise clients looking for innovative, high-quality services.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: GT_TECH_SERVICE_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: enhancedUserPrompt
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
      const requiredFields = ['title', 'tagline', 'description']
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // Ensure arrays are properly formatted
      if (!Array.isArray(parsedContent.technologies)) {
        parsedContent.technologies = parsedContent.technologies ? [parsedContent.technologies] : getDefaultTechnologies(section)
      }
      if (!Array.isArray(parsedContent.capabilities)) {
        parsedContent.capabilities = parsedContent.capabilities ? [parsedContent.capabilities] : getDefaultCapabilities(section)
      }
      if (!Array.isArray(parsedContent.lists)) {
        parsedContent.lists = parsedContent.lists ? [parsedContent.lists] : getDefaultLists(section)
      }

      // Set default icon if not provided or invalid
      const validIcons = ['code', 'lightbulb', 'rocket', 'settings', 'star', 'layers', 'zap', 'monitor', 'smartphone', 'database', 'globe', 'shield', 'tool']
      if (!parsedContent.icon || !validIcons.includes(parsedContent.icon)) {
        parsedContent.icon = getDefaultIconForSection(section)
      }

      // Set design type
      parsedContent.designType = designType

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback: create service content based on the prompt and section
      parsedContent = {
        title: generateFallbackTitle(userPrompt, section),
        tagline: generateFallbackTagline(section),
        description: generateFallbackDescription(userPrompt, section, designType),
        technologies: getDefaultTechnologies(section),
        capabilities: getDefaultCapabilities(section),
        lists: getDefaultLists(section),
        icon: getDefaultIconForSection(section),
        designType: designType
      }
    }

    return NextResponse.json({
      success: true,
      content: JSON.stringify(parsedContent),
      message: 'Service content generated successfully'
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
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, message: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { success: false, message: 'Failed to generate service content' },
      { status: 500 }
    )
  }
}

// Fallback functions for when AI response parsing fails
function generateFallbackTitle(prompt: string, section: string): string {
  const baseTitle = prompt.length > 50 ? prompt.substring(0, 47) + "..." : prompt
  return `GT Tech ${section}: ${baseTitle}`
}

function generateFallbackTagline(section: string): string {
  const taglines = {
    "Development": "Advanced software solutions with cutting-edge technology",
    "Design": "Innovative design services that transform user experiences",
    "Marketing": "Data-driven marketing strategies for technology leaders",
    "Consulting": "Strategic technology consulting for digital transformation"
  }
  return taglines[section as keyof typeof taglines] || "Expert technology services for modern businesses"
}

function generateFallbackDescription(prompt: string, section: string, designType: string): string {
  return `GT Tech delivers exceptional ${section.toLowerCase()} services using a ${designType} approach. Our team combines technical expertise with innovative methodologies to create solutions that drive business growth and technological advancement. 

Based on your requirements for ${prompt.toLowerCase()}, we leverage our partnerships with industry leaders like Dassault Systèmes and AWS to deliver enterprise-grade solutions. Our approach integrates cutting-edge technology with proven best practices, ensuring scalable, secure, and performance-optimized outcomes.

Through our Centers of Excellence and academic partnerships, we bring the latest industry knowledge and emerging technologies to every project. Our commitment to innovation and quality ensures that your ${section.toLowerCase()} needs are met with solutions that exceed expectations and provide long-term value.`
}

function getDefaultTechnologies(section: string): string[] {
  const techMap = {
    "Development": ["Next.js", "React", "TypeScript", "AWS", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    "Design": ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Principle", "Framer", "3D Modeling", "AR/VR"],
    "Marketing": ["Google Analytics", "HubSpot", "Salesforce", "SEMrush", "Google Ads", "Social Media APIs", "Marketing Automation", "CRM Integration"],
    "Consulting": ["Business Intelligence", "Data Analytics", "Cloud Architecture", "DevOps", "Agile Methodologies", "Digital Transformation", "Process Optimization", "Strategic Planning"]
  }
  return techMap[section as keyof typeof techMap] || ["Advanced Technology", "Innovation", "Best Practices"]
}

function getDefaultCapabilities(section: string): string[] {
  const capMap = {
    "Development": ["Full-Stack Development", "Cloud Architecture", "API Integration", "Performance Optimization", "Security Implementation", "CI/CD Pipeline"],
    "Design": ["User Experience Design", "Visual Design", "Prototyping", "Design Systems", "Accessibility", "Responsive Design"],
    "Marketing": ["Digital Strategy", "SEO Optimization", "Content Marketing", "Lead Generation", "Analytics & Reporting", "Brand Development"],
    "Consulting": ["Strategic Planning", "Technology Assessment", "Process Improvement", "Digital Transformation", "Innovation Strategy", "Risk Management"]
  }
  return capMap[section as keyof typeof capMap] || ["Expert Consultation", "Technical Excellence"]
}

function getDefaultLists(section: string): string[] {
  const listMap = {
    "Development": ["Custom application development", "Scalable cloud architecture", "Comprehensive testing", "Ongoing maintenance", "Documentation & training"],
    "Design": ["User research & analysis", "Interactive prototypes", "Design system creation", "Usability testing", "Brand guidelines"],
    "Marketing": ["Marketing strategy development", "Campaign execution", "Performance analytics", "Lead nurturing", "ROI optimization"],
    "Consulting": ["Strategic roadmap creation", "Technical architecture review", "Process optimization", "Team training", "Implementation support"]
  }
  return listMap[section as keyof typeof listMap] || ["Expert guidance", "Quality delivery", "Ongoing support"]
}

function getDefaultIconForSection(section: string): string {
  const iconMap = {
    "Development": "code",
    "Design": "lightbulb", 
    "Marketing": "rocket",
    "Consulting": "settings"
  }
  return iconMap[section as keyof typeof iconMap] || "star"
}