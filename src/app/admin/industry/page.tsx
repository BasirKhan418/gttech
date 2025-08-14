'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Building2,
  Tag,
  Loader2
} from 'lucide-react'
import { IndustryModal } from '../../../../utils/industries/industry-modal'
import { CategoryModal } from '../../../../utils/industries/category-modal'
import { toast, Toaster } from 'sonner'

interface Industry {
  _id: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  technologies: string[]
  poster: string
  images: string[]
  icon?: string
  category: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
  hoverBorderColor: string
  textColor: string
  hoverTextColor: string
  buttonGradient: string
  iconBg: string
  iconBorder: string
  isActive: boolean
  isFeatured: boolean
  slug: string
  author: {
    _id: string
    name: string
    email: string
  }
  lastEditedAuthor: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  icon?: string
  color: string
  order: number
  isActive: boolean
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

const AdminIndustriesPage = () => {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{type: 'industry' | 'category', item: Industry | Category} | null>(null)
  const [activeTab, setActiveTab] = useState('industries')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchIndustries(), fetchCategories()])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Please refresh the page.')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchIndustries = async () => {
    try {
      console.log('Fetching industries...')
      const response = await fetch('/api/industry', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Industries response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Industries data:', data)

      if (data.success) {
        setIndustries(data.data || [])
        console.log('Industries set:', data.data?.length || 0, 'items')
      } else {
        console.error('Industries API error:', data.message)
        toast.error(data.message || 'Failed to fetch industries')
        setIndustries([])
      }
    } catch (error) {
      console.error('Error fetching industries:', error)
      toast.error('Failed to fetch industries')
      setIndustries([])
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const response = await fetch('/api/industry/category?all=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Categories response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Categories data:', data)

      if (data.success) {
        setCategories(data.data || [])
        console.log('Categories set:', data.data?.length || 0, 'items')
      } else {
        console.error('Categories API error:', data.message)
        toast.error(data.message || 'Failed to fetch categories')
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
      setCategories([])
    }
  }

  const handleCreateIndustry = () => {
    setSelectedIndustry(null)
    setIsIndustryModalOpen(true)
  }

  const handleEditIndustry = (industry: Industry) => {
    setSelectedIndustry(industry)
    setIsIndustryModalOpen(true)
  }

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    try {
      const isIndustry = deleteItem.type === 'industry'
      const endpoint = isIndustry ? '/api/industry' : '/api/industry/category'
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteItem.item._id }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${isIndustry ? 'Industry' : 'Category'} deleted successfully`)
        if (isIndustry) {
          await fetchIndustries()
        } else {
          await fetchCategories()
        }
      } else {
        toast.error(data.message || `Failed to delete ${isIndustry ? 'industry' : 'category'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${deleteItem.type}`)
    } finally {
      setDeleteItem(null)
    }
  }

  const handleModalSuccess = async () => {
    setIsIndustryModalOpen(false)
    setIsCategoryModalOpen(false)
    setSelectedIndustry(null)
    setSelectedCategory(null)
    await fetchData()
  }

  // Filter industries based on search term
  const filteredIndustries = industries.filter(industry =>
    industry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    industries: {
      total: industries.length,
      active: industries.filter(i => i.isActive).length,
      featured: industries.filter(i => i.isFeatured).length,
      inactive: industries.filter(i => !i.isActive).length,
    },
    categories: {
      total: categories.length,
      active: categories.filter(c => c.isActive).length,
      inactive: categories.filter(c => !c.isActive).length,
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Industries</h1>
            <p className="text-gray-600 mt-1">Loading your industry portfolio...</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading industries and categories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Industries</h1>
            <p className="text-gray-600 mt-1">Manage your industry portfolio</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="gap-2">
            <Building2 className="w-4 h-4" />
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Industries Management</h1>
          <p className="text-gray-600 mt-1">Manage your industry portfolio and categories</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="industries" className="gap-2">
            <Building2 className="w-4 h-4" />
            Industries ({industries.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="w-4 h-4" />
            Categories ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* Industries Tab */}
        <TabsContent value="industries" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.industries.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.industries.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Featured Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.industries.featured}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.industries.inactive}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreateIndustry} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Industry
            </Button>
          </div>

          {/* Industries Grid */}
          {filteredIndustries.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No industries found' : 'No industries yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by creating your first industry'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateIndustry} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Industry
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustries.map((industry) => (
                <Card key={industry._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Industry Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {industry.poster ? (
                      <img
                        src={industry.poster}
                        alt={industry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                        <Building2 className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {industry.isFeatured && (
                        <Badge className="bg-yellow-500/90 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={industry.isActive ? "default" : "secondary"}>
                        {industry.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(`/industries/${industry.category}/${industry.slug}`, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditIndustry(industry)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteItem({type: 'industry', item: industry})}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Industry Info */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {industry.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{industry.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{industry.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {industry.description}
                    </p>

                    {/* Technologies */}
                    {industry.technologies && industry.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {industry.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {industry.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{industry.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(industry.createdAt).toLocaleDateString()}</span>
                      <span>by {industry.author?.name || 'Unknown'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.categories.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.categories.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.categories.inactive}</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreateCategory} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by creating your first category'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateCategory} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Category
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card key={category._id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Order: {category.order}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{category.slug}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteItem({type: 'category', item: category})}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Color: {category.color}</span>
                      <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <IndustryModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        industry={selectedIndustry}
        categories={categories.filter(c => c.isActive)}
        onSuccess={handleModalSuccess}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteItem?.type === 'industry' ? 'Industry' : 'Category'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.type === 'industry' ? (deleteItem?.item as Industry)?.title : (deleteItem?.item as Category)?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminIndustriesPage