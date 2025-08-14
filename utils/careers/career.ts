export interface Career {
  _id: string
  role: string
  experience: string
  requirements: string[]
  description: string
  location: string
  mode: "remote" | "offline" | "hybrid"
  applyUrl: string
  salary?: string
  department?: string
  employmentType: "full-time" | "part-time" | "contract" | "internship"
  skills?: string[]
  benefits?: string[]
  isActive: boolean
  applicationDeadline?: string
  lastEditedAuthor: string
  author: string
  createdAt: string
  updatedAt: string
}

export interface CreateCareerData {
  role: string
  experience: string
  requirements: string[]
  description: string
  location: string
  mode: "remote" | "offline" | "hybrid"
  applyUrl: string
  salary?: string
  department?: string
  employmentType: "full-time" | "part-time" | "contract" | "internship"
  skills?: string[]
  benefits?: string[]
  isActive: boolean
  applicationDeadline?: string
}
