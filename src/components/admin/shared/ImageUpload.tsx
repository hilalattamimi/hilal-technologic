'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'images',
  folder = 'blog',
  label = 'Image',
  aspectRatio = 'video',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setIsUploading(true)

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) {
          throw error
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        onChange(urlData.publicUrl)
        toast.success('Image uploaded successfully')
      } catch (error: any) {
        console.error('Upload error:', error)
        toast.error(error.message || 'Failed to upload image')
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, folder, onChange]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadFile(e.dataTransfer.files[0])
      }
    },
    [uploadFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        uploadFile(e.target.files[0])
      }
    },
    [uploadFile]
  )

  const removeImage = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} rounded-lg overflow-hidden bg-violet-950/30 border border-border`}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={removeImage}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative ${aspectClasses[aspectRatio]} rounded-lg border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-border hover:border-violet-500/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-2" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">Drag & drop or click to upload</p>
                <p className="text-xs mt-1">Max file size: 5MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Input as alternative */}
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background"
        />
      </div>
    </div>
  )
}
