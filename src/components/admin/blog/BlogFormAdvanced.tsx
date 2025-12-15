'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  X, 
  Clock, 
  Eye, 
  FileText,
  Search,
  Calendar,
  Settings2,
  FileCode,
  Type
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { toast } from 'sonner'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ImageUpload from '@/components/admin/shared/ImageUpload'

const RichTextEditor = dynamic(
  () => import('@/components/admin/shared/RichTextEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] border border-border rounded-lg flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
      </div>
    )
  }
)

const MarkdownEditor = dynamic(
  () => import('@/components/admin/shared/MarkdownEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] border border-border rounded-lg flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
      </div>
    )
  }
)

interface BlogTag {
  id: string
  name: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  thumbnail: string | null
  categoryId: string | null
  author: string | null
  isPublished: boolean
  isFeatured: boolean
  isDraft: boolean
  publishedAt: string | null
  scheduledAt: string | null
  tags: BlogTag[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  ogImage: string | null
}

interface Category {
  id: string
  name: string
}

interface BlogFormAdvancedProps {
  post?: BlogPost
  categories: Category[]
}

export default function BlogFormAdvanced({ post, categories }: BlogFormAdvancedProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [seoOpen, setSeoOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'richtext' | 'markdown'>('richtext')
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    thumbnail: post?.thumbnail || '',
    categoryId: post?.categoryId || '',
    author: post?.author || '',
    isPublished: post?.isPublished ?? false,
    isFeatured: post?.isFeatured ?? false,
    isDraft: post?.isDraft ?? true,
    scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '',
    tags: post?.tags?.map(t => t.name) || [],
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    metaKeywords: post?.metaKeywords || '',
    ogImage: post?.ogImage || '',
  })
  const [newTag, setNewTag] = useState('')

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, post])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!formData.title || formData.isPublished) return

    const autoSave = setInterval(async () => {
      if (formData.title && formData.isDraft) {
        await saveDraft(true)
      }
    }, 30000)

    return () => clearInterval(autoSave)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const saveDraft = async (isAutoSave = false) => {
    if (!formData.title) return

    if (!isAutoSave) setIsSavingDraft(true)

    try {
      const url = post
        ? `/api/admin/blog/${post.id}`
        : '/api/admin/blog'
      const method = post ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
          isPublished: false,
          isDraft: true,
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        if (!isAutoSave) {
          toast.success('Draft saved')
          const data = await response.json()
          if (!post && data.post?.id) {
            router.replace(`/admin/blog/${data.post.id}`)
          }
        }
      }
    } catch {
      if (!isAutoSave) toast.error('Failed to save draft')
    } finally {
      if (!isAutoSave) setIsSavingDraft(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, publish = false) => {
    e.preventDefault()
    
    if (!formData.title) {
      toast.error('Title is required')
      return
    }
    
    setIsLoading(true)

    try {
      const url = post
        ? `/api/admin/blog/${post.id}`
        : '/api/admin/blog'
      const method = post ? 'PATCH' : 'POST'

      const isScheduled = formData.scheduledAt && new Date(formData.scheduledAt) > new Date()

      const payload = {
        ...formData,
        categoryId: formData.categoryId || null,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
        isPublished: publish && !isScheduled,
        isDraft: !publish,
        publishedAt: publish && !isScheduled ? new Date().toISOString() : post?.publishedAt || null,
      }

      console.log('Submitting blog post:', { url, method, payload })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        if (isScheduled && publish) {
          toast.success('Post scheduled for publishing')
        } else if (publish) {
          toast.success('Post published successfully')
        } else {
          toast.success(post ? 'Post updated' : 'Post created')
        }
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await response.json()
        console.error('Error response:', data)
        toast.error(data.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    })
  }

  // Calculate reading time
  const wordCount = formData.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0
  const readingTime = Math.ceil(wordCount / 200)

  // SEO score calculation
  const calculateSeoScore = () => {
    let score = 0
    if (formData.metaTitle && formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60) score += 25
    else if (formData.metaTitle) score += 10
    if (formData.metaDescription && formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) score += 25
    else if (formData.metaDescription) score += 10
    if (formData.metaKeywords) score += 15
    if (formData.ogImage || formData.thumbnail) score += 20
    if (formData.slug && formData.slug.length < 50) score += 15
    return score
  }

  const seoScore = calculateSeoScore()

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{wordCount} words</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
            {lastSaved && (
              <>
                <span>•</span>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => saveDraft()}
            disabled={isSavingDraft || !formData.title}
          >
            {isSavingDraft ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            type="button"
            size="sm"
            className="btn-primary"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading || !formData.title}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : formData.scheduledAt && new Date(formData.scheduledAt) > new Date() ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-background text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                  placeholder="Post title..."
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Permalink:</span>
                <span className="text-violet-400">/blog/</span>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-background h-7 text-sm max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'richtext' | 'markdown')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="richtext" className="text-xs px-3 h-7">
                      <Type className="w-3 h-3 mr-1" />
                      Rich Text
                    </TabsTrigger>
                    <TabsTrigger value="markdown" className="text-xs px-3 h-7">
                      <FileCode className="w-3 h-3 mr-1" />
                      Markdown
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {editorMode === 'richtext' ? (
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog post content here..."
                />
              ) : (
                <MarkdownEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog post in Markdown..."
                  height={400}
                />
              )}
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>A short summary that appears in blog listings</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="bg-background"
                rows={3}
                placeholder="Brief summary of the post..."
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
            <Card className="bg-card/50 border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-violet-400" />
                      <div>
                        <CardTitle>SEO Settings</CardTitle>
                        <CardDescription>Optimize for search engines</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={seoScore >= 80 ? "default" : seoScore >= 50 ? "secondary" : "destructive"}
                        className={seoScore >= 80 ? "bg-green-500/20 text-green-400" : seoScore >= 50 ? "bg-yellow-500/20 text-yellow-400" : ""}
                      >
                        SEO Score: {seoScore}%
                      </Badge>
                      <Settings2 className={`w-4 h-4 transition-transform ${seoOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {/* SEO Preview */}
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Search Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-400 text-lg hover:underline cursor-pointer truncate">
                        {formData.metaTitle || formData.title || 'Page Title'}
                      </p>
                      <p className="text-green-400 text-sm">
                        yourdomain.com/blog/{formData.slug || 'post-slug'}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formData.metaDescription || formData.excerpt || 'Add a meta description to improve your SEO...'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">
                        Meta Title
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({formData.metaTitle.length}/60)
                        </span>
                      </Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        className="bg-background"
                        placeholder={formData.title || 'SEO title'}
                        maxLength={60}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                        className="bg-background"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">
                      Meta Description
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formData.metaDescription.length}/160)
                      </span>
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="bg-background"
                      rows={3}
                      placeholder={formData.excerpt || 'SEO description'}
                      maxLength={160}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Open Graph Image</Label>
                    <ImageUpload
                      value={formData.ogImage}
                      onChange={(url) => setFormData({ ...formData, ogImage: url })}
                      folder="blog/og"
                      label=""
                      aspectRatio="wide"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured Post</Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>
              
              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Publish</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="bg-background"
                />
                {formData.scheduledAt && new Date(formData.scheduledAt) > new Date() && (
                  <p className="text-xs text-violet-400">
                    Will be published on {new Date(formData.scheduledAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Current Status */}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Current Status:</p>
                <Badge 
                  className={
                    formData.isPublished 
                      ? "bg-green-500/20 text-green-400 mt-1" 
                      : formData.scheduledAt && new Date(formData.scheduledAt) > new Date()
                        ? "bg-blue-500/20 text-blue-400 mt-1"
                        : "bg-yellow-500/20 text-yellow-400 mt-1"
                  }
                >
                  {formData.isPublished 
                    ? "Published" 
                    : formData.scheduledAt && new Date(formData.scheduledAt) > new Date()
                      ? "Scheduled"
                      : "Draft"
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                folder="blog/thumbnails"
                label=""
              />
            </CardContent>
          </Card>

          {/* Category & Author */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId || "none"}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-background"
                  placeholder="Author name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="bg-background"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
