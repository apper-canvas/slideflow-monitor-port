// Task service for managing task operations with ApperClient integration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Task service class with complete CRUD operations
class TaskService {
  constructor() {
    this.tableName = 'task_c';
    
    // Define updateable fields based on task_c schema
    this.updateableFields = [
      'name_c', 'description_c', 'status_c', 'due_date_c', 'assignee_c', 'Tags', 'Name'
    ];
  }

  // Initialize ApperClient for data operations
  getClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Fetch all tasks with optional filtering
  async getAll(filters = {}) {
    try {
      await delay(200); // Realistic API delay
      
      const client = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      // Add status filter if provided
      if (filters.status) {
        params.where = [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [filters.status],
          "Include": true
        }];
      }

      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch tasks: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Fetch single task by ID
  async getById(id) {
    try {
      await delay(150);
      
      const client = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_c"}}
        ]
      };

      const response = await client.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Task not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Create new task with only updateable fields
  async create(taskData) {
    try {
      await delay(200);

      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined && taskData[field] !== null && taskData[field] !== '') {
          filteredData[field] = taskData[field];
        }
      });

      const client = this.getClient();
      const params = {
        records: [filteredData]
      };

      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create task: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create task: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Update existing task with only updateable fields
  async update(id, taskData) {
    try {
      await delay(200);

      // Filter to only include updateable fields
      const filteredData = { Id: id };
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field];
        }
      });

      const client = this.getClient();
      const params = {
        records: [filteredData]
      };

      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update task: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update task: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error(`Error updating task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Delete task by ID
  async delete(id) {
    try {
      await delay(150);

      const client = this.getClient();
      const params = { 
        RecordIds: [id]
      };

      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete task: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete task: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

// Create and export service instance
export const taskService = new TaskService();