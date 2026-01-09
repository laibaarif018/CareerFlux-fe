import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'

export interface CompanyProfileData {
  companyName: string
  websiteUrl?: string
  industry?: string
  companySize?: string
  description?: string
  contactName?: string
  contactEmail: string
  contactNumber?: string
}

export class CompanyService extends HttpService {
  private readonly prefix = '/company'

  // Get company profile
  getProfile = (): Promise<IApiResponse> => {
    return this.get(`${this.prefix}/profile`)
  }

  // Update company profile
  updateProfile = (
    data: CompanyProfileData,
    logoFile?: File,
  ): Promise<IApiResponse> => {
    console.log('🔧 CompanyService.updateProfile called');
    console.log('📊 Data received:', data);
    console.log('📎 Logo file received:', logoFile ? {
      name: logoFile.name,
      size: logoFile.size,
      type: logoFile.type,
      lastModified: new Date(logoFile.lastModified).toISOString(),
    } : 'NO FILE');

    const formData = new FormData()
    
    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
        console.log(`✅ Appended ${key}: ${value}`);
      }
    })
    
    // Append logo file if provided
    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name)
      console.log('✅ Logo file appended to FormData:', {
        fieldName: 'logo',
        fileName: logoFile.name,
        fileType: logoFile.type,
        fileSize: `${(logoFile.size / 1024).toFixed(2)} KB`,
      });
    } else {
      console.log('⚠️ No logo file to append');
    }

    // Verify FormData contents
    console.log('📋 Final FormData contents:');
    let fileCount = 0;
    let fieldCount = 0;
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileCount++;
        console.log(`  📁 ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        fieldCount++;
        console.log(`  📝 ${key}: ${value}`);
      }
    }
    console.log(`📊 Summary: ${fieldCount} fields, ${fileCount} files`);

    console.log('🚀 Calling PUT request...');
    
    // Don't set Content-Type header manually for FormData
    // The browser will set it automatically with the correct boundary
    return this.put(`${this.prefix}/profile`, formData)
  }

  // Delete company profile
  deleteProfile = (): Promise<IApiResponse> => {
    return this.delete(`${this.prefix}/profile`)
  }
}

export const companyService = new CompanyService()