// Image service with Apper Backend integration
export const imageService = {
  
  // Get ApperClient instance
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "width_c"}},
          {"field": {"Name": "height_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('image_c', params);
      
      if (!response.success) {
        console.error("Error fetching images:", response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI-expected format
      const images = (response.data || []).map(item => ({
        Id: item.Id,
        url: item.url_c || '',
        thumbnailUrl: item.thumbnail_url_c || item.url_c || '',
        title: item.title_c || '',
        description: item.description_c || '',
        width: item.width_c || 1920,
        height: item.height_c || 1080
      }));
      
      return images;
    } catch (error) {
      console.error("Error loading images:", error?.response?.data?.message || error.message);
      throw new Error(error?.response?.data?.message || error.message || "Failed to load images");
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "width_c"}},
          {"field": {"Name": "height_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('image_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching image ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Image with ID ${id} not found`);
      }

      // Map database fields to UI-expected format
      const image = {
        Id: response.data.Id,
        url: response.data.url_c || '',
        thumbnailUrl: response.data.thumbnail_url_c || response.data.url_c || '',
        title: response.data.title_c || '',
        description: response.data.description_c || '',
        width: response.data.width_c || 1920,
        height: response.data.height_c || 1080
      };
      
      return image;
    } catch (error) {
      console.error(`Error fetching image ${id}:`, error?.response?.data?.message || error.message);
      throw new Error(error?.response?.data?.message || error.message || `Image with ID ${id} not found`);
    }
  },

  async create(imageData) {
    try {
      const apperClient = this.getApperClient();
      
      // Map UI format to database fields - only include Updateable fields
      const dbData = {
        Name: imageData.title || 'New Image',
        Tags: imageData.tags || '',
        url_c: imageData.url || '',
        thumbnail_url_c: imageData.thumbnailUrl || imageData.url || '',
        title_c: imageData.title || '',
        description_c: imageData.description || '',
        width_c: imageData.width || 1920,
        height_c: imageData.height || 1080
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord('image_c', params);
      
      if (!response.success) {
        console.error("Error creating image:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdRecord = successful[0].data;
          // Map back to UI format
          return {
            Id: createdRecord.Id,
            url: createdRecord.url_c || '',
            thumbnailUrl: createdRecord.thumbnail_url_c || createdRecord.url_c || '',
            title: createdRecord.title_c || '',
            description: createdRecord.description_c || '',
            width: createdRecord.width_c || 1920,
            height: createdRecord.height_c || 1080
          };
        }
      }
      
      throw new Error("No records created");
    } catch (error) {
      console.error("Error creating image:", error?.response?.data?.message || error.message);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create image");
    }
  },

  async update(id, imageData) {
    try {
      const apperClient = this.getApperClient();
      
      // Map UI format to database fields - only include Updateable fields
      const dbData = {
        Id: parseInt(id)
      };
      
      // Only include fields that are being updated
      if (imageData.title !== undefined) dbData.title_c = imageData.title;
      if (imageData.description !== undefined) dbData.description_c = imageData.description;
      if (imageData.url !== undefined) dbData.url_c = imageData.url;
      if (imageData.thumbnailUrl !== undefined) dbData.thumbnail_url_c = imageData.thumbnailUrl;
      if (imageData.width !== undefined) dbData.width_c = imageData.width;
      if (imageData.height !== undefined) dbData.height_c = imageData.height;
      if (imageData.tags !== undefined) dbData.Tags = imageData.tags;
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord('image_c', params);
      
      if (!response.success) {
        console.error(`Error updating image ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedRecord = successful[0].data;
          // Map back to UI format
          return {
            Id: updatedRecord.Id,
            url: updatedRecord.url_c || '',
            thumbnailUrl: updatedRecord.thumbnail_url_c || updatedRecord.url_c || '',
            title: updatedRecord.title_c || '',
            description: updatedRecord.description_c || '',
            width: updatedRecord.width_c || 1920,
            height: updatedRecord.height_c || 1080
          };
        }
      }
      
      throw new Error("No records updated");
    } catch (error) {
      console.error(`Error updating image ${id}:`, error?.response?.data?.message || error.message);
      throw new Error(error?.response?.data?.message || error.message || `Failed to update image with ID ${id}`);
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('image_c', params);
      
      if (!response.success) {
        console.error(`Error deleting image ${id}:`, response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error?.response?.data?.message || error.message);
      throw new Error(error?.response?.data?.message || error.message || `Failed to delete image with ID ${id}`);
    }
  }
};