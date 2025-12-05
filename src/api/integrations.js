import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'
import { Resend } from 'resend'

/**
 * LLM Integration - OpenAI API
 */
export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('OpenAI API key not found. LLM features will not work.')
    throw new Error('OpenAI API key not configured')
  }
  
  try {
    const openai = new OpenAI({ 
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: response_json_schema ? { type: 'json_object' } : undefined,
      temperature: 0.7,
      max_tokens: 2000
    })
    
    const content = completion.choices[0].message.content
    
    if (response_json_schema) {
      return JSON.parse(content)
    }
    return content
  } catch (error) {
    console.error('LLM invocation error:', error)
    throw error
  }
}

/**
 * Email Integration - Resend API
 */
export const SendEmail = async ({ to, subject, html, body, from = 'GenRizz <noreply@genrizz.com>' }) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY
  
  if (!apiKey) {
    console.warn('Resend API key not found. Email features will not work.')
    throw new Error('Resend API key not configured')
  }
  
  // Support both 'html' and 'body' for compatibility
  const emailBody = html || body || ''
  
  try {
    const resend = new Resend(apiKey)
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html: emailBody
    })
    return data
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

/**
 * File Upload - Supabase Storage
 */
export const UploadFile = async (file, path, options = {}) => {
  const bucket = options.bucket || 'uploads'
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options.upsert || false
      })
    
    if (error) throw error
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return {
      ...data,
      publicUrl: urlData.publicUrl
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

/**
 * Create Signed URL for File Access
 */
export const CreateFileSignedUrl = async (path, expiresIn = 3600, bucket = 'uploads') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Signed URL creation error:', error)
    throw error
  }
}

/**
 * Upload Private File
 */
export const UploadPrivateFile = async (file, path, options = {}) => {
  return UploadFile(file, path, { ...options, bucket: 'private-uploads' })
}

/**
 * Generate Image - OpenAI DALL-E
 */
export const GenerateImage = async ({ prompt, size = '1024x1024' }) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('OpenAI API key not found. Image generation will not work.')
    throw new Error('OpenAI API key not configured')
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }
    
    const data = await response.json()
    return data.data[0].url
  } catch (error) {
    console.error('Image generation error:', error)
    throw error
  }
}

/**
 * Extract Data from Uploaded File
 * Note: This would typically require a backend service
 * For now, we'll use a placeholder that could be extended
 */
export const ExtractDataFromUploadedFile = async (fileUrl, fileType) => {
  // This would typically call a backend service or use a library
  // For now, return a placeholder
  console.warn('ExtractDataFromUploadedFile is not fully implemented')
  throw new Error('File extraction not implemented. Requires backend service.')
}

// Export Core namespace for compatibility
export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
}
