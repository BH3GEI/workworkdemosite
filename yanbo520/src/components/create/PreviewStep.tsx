'use client'

import { useState } from 'react'
import { ProductData } from './ProductUploadFlow'
import { Eye, Heart, Star, CheckCircle } from 'lucide-react'
import { MultiImageEditor } from './MultiImageEditor'
import { ImageCarousel } from '../ImageCarousel'

interface PreviewStepProps {
  data: ProductData
  onUpdate: (updates: Partial<ProductData>) => void
  onNext: () => void
  onPrev: () => void
}

export function PreviewStep({ data, onUpdate, onNext, onPrev }: PreviewStepProps) {
  const [editMode, setEditMode] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState<Record<string, string | number>>({})
  const [isEditingImages, setIsEditingImages] = useState(false)

  if (!data.aiContent) {
    return <div>No content to preview</div>
  }

  const startEdit = (field: string, value: string | number) => {
    setEditMode(field)
    setTempValues({ [field]: value })
  }

  const saveEdit = (field: string) => {
    if (!data.aiContent) return
    
    const updatedContent = { ...data.aiContent, [field]: tempValues[field] }
    onUpdate({ aiContent: updatedContent })
    setEditMode(null)
    setTempValues({})
  }

  const cancelEdit = () => {
    setEditMode(null)
    setTempValues({})
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview & Edit</h2>
        <p className="text-gray-600">Review your product listing and make any final adjustments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Card Preview */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Product Card Preview</h3>
          <div className="w-full max-w-[280px] h-[360px] bg-bg-primary rounded-lg shadow-card overflow-hidden flex flex-col">
            <div className="h-[180px] w-full rounded-t-lg overflow-hidden">
              <ImageCarousel 
                images={data.aiContent.images || []}
                projectName={data.aiContent.title}
                className="h-full"
              />
            </div>
            
            <div className="h-[180px] px-4 py-3 bg-white flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-2 h-[50px] shrink-0">
                <div className="flex-1 mr-3">
                  <h3 className="text-text-primary text-base font-bold line-clamp-1 leading-tight mb-1">
                    {data.aiContent.title}
                  </h3>
                  <p className="text-text-tertiary text-[10px] line-clamp-1 leading-tight">
                    Digital Nomad
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="leading-tight">
                    <span className="text-primary text-base font-bold font-brand mr-1">
                      {data.aiContent.currency}
                    </span>
                    <span className="text-primary text-2xl font-bold font-brand">
                      {data.aiContent.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="h-[70px] mb-2 overflow-hidden shrink-0 relative">
                <p className="text-text-primary text-xs leading-[1.4] line-clamp-3 overflow-hidden mb-1">
                  {data.aiContent.description.length > 80 
                    ? data.aiContent.description.substring(0, 80) + '...' 
                    : data.aiContent.description
                  }
                </p>
                <div className="text-center absolute bottom-0 left-0 right-0">
                  <span className="text-primary text-xs cursor-pointer hover:underline bg-white px-2">
                    Click for details
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2 shrink-0">
                <span className="px-2 py-0.5 rounded-lg text-xs font-medium shadow-tag bg-[#ABD5FF] text-blue-800">
                  {data.aiContent.category}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 shrink-0">
                <div className="flex items-center space-x-3 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>0.0</span>
                  </div>
                </div>
                
                <div className="text-green-500 text-sm" title="Verified Creator">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <MultiImageEditor
            images={data.aiContent.images || []}
            onChange={(images) => {
              const updatedContent = { ...data.aiContent!, images }
              // 更新image_url用于向后兼容
              if (images.length > 0) {
                updatedContent.image_url = images[0].url
              }
              onUpdate({ aiContent: updatedContent })
            }}
            isEditing={isEditingImages}
            onEditToggle={() => setIsEditingImages(!isEditingImages)}
          />

          {/* Title */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Product Title</h4>
              {editMode !== 'title' && (
                <button
                  onClick={() => startEdit('title', data.aiContent!.title)}
                  className="text-primary hover:text-blue-600 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editMode === 'title' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempValues.title || ''}
                  onChange={(e) => setTempValues({ ...tempValues, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit('title')}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800">{data.aiContent.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Description</h4>
              {editMode !== 'description' && (
                <button
                  onClick={() => startEdit('description', data.aiContent!.description)}
                  className="text-primary hover:text-blue-600 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editMode === 'description' ? (
              <div className="space-y-2">
                <textarea
                  value={tempValues.description || ''}
                  onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit('description')}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 leading-relaxed">{data.aiContent.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Price</h4>
                {editMode !== 'price' && (
                  <button
                    onClick={() => startEdit('price', data.aiContent!.price)}
                    className="text-primary hover:text-blue-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editMode === 'price' ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={tempValues.price || ''}
                    onChange={(e) => setTempValues({ ...tempValues, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit('price')}
                      className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 font-bold">{data.aiContent.currency} {data.aiContent.price}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Category</h4>
                {editMode !== 'category' && (
                  <button
                    onClick={() => startEdit('category', data.aiContent!.category)}
                    className="text-primary hover:text-blue-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editMode === 'category' ? (
                <div className="space-y-2">
                  <select
                    value={tempValues.category || ''}
                    onChange={(e) => setTempValues({ ...tempValues, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="course">Course</option>
                    <option value="crypto">Crypto</option>
                    <option value="ai">AI</option>
                    <option value="education">Education</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit('category')}
                      className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 capitalize">{data.aiContent.category}</p>
              )}
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Marketing Copy</h4>
              {editMode !== 'marketingCopy' && (
                <button
                  onClick={() => startEdit('marketingCopy', data.aiContent!.marketingCopy)}
                  className="text-primary hover:text-blue-600 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editMode === 'marketingCopy' ? (
              <div className="space-y-2">
                <textarea
                  value={tempValues.marketingCopy || ''}
                  onChange={(e) => setTempValues({ ...tempValues, marketingCopy: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit('marketingCopy')}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 leading-relaxed">{data.aiContent.marketingCopy}</p>
            )}
          </div>

          {/* Keywords */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.aiContent.keywords.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Social Media Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-4">Social Media Posts Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Twitter Preview */}
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">𝕏</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">WorkWork Bot</p>
                    <p className="text-gray-500 text-xs">@WorkWorkBot</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {data.aiContent.socialPosts.twitter}
                </p>
              </div>

              {/* Xiaohongshu Preview */}
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 overflow-hidden">
                    <img 
                      src="https://www.szniego.com/uploads/image/20230408/1680945993.png" 
                      alt="小红书"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        e.currentTarget.style.display = 'none'
                        const fallback = document.createElement('div')
                        fallback.className = 'w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs'
                        fallback.textContent = '小红书'
                        e.currentTarget.parentNode?.appendChild(fallback)
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">WorkWork Bot</p>
                    <p className="text-gray-500 text-xs">小红书官方账号</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {data.aiContent.socialPosts.linkedin}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              💡 These will be shown on the final results page for easy copying and sharing
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Ready to Publish →
        </button>
      </div>
    </div>
  )
}