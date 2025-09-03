import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const TaskListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Not Started',
    due_date_c: '',
    assignee_c: '',
    Tags: '',
    Name: ''
  });

  // Status options from schema
  const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

  const loadTasks = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getAll(filters);
      setTasks(data);
      
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} tasks successfully`);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadTasks({ status: statusFilter });
  }, [isAuthenticated, navigate, statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      name_c: '',
      description_c: '',
      status_c: 'Not Started',
      due_date_c: '',
      assignee_c: '',
      Tags: '',
      Name: ''
    });
    setShowCreateForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      name_c: task.name_c || '',
      description_c: task.description_c || '',
      status_c: task.status_c || 'Not Started',
      due_date_c: task.due_date_c || '',
      assignee_c: task.assignee_c || '',
      Tags: task.Tags || '',
      Name: task.Name || ''
    });
    setShowCreateForm(true);
  };

  const handleDeleteTask = async (taskId, taskName) => {
    if (!confirm(`Are you sure you want to delete "${taskName}"?`)) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c && !formData.Name) {
      toast.error('Please enter a task name');
      return;
    }

    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, formData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? { ...task, ...updatedTask } : task
        ));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(formData);
        if (newTask) {
          setTasks(prev => [newTask, ...prev]);
          toast.success('Task created successfully');
        }
      }
      
      setShowCreateForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
      console.error('Error saving task:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-400';
      case 'In Progress': return 'text-blue-400';
      case 'On Hold': return 'text-yellow-400';
      case 'Cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return <Error message={error} onRetry={() => loadTasks({ status: statusFilter })} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
            <p className="text-white/70">Manage your tasks and track progress</p>
          </div>
          <Button onClick={handleCreateTask} className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={20} />
            <span>Add Task</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-white/70">Filter by status:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
            >
              <option value="">All Tasks</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Form */}
        {showCreateForm && (
          <div className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Task Name</label>
                  <input
                    type="text"
                    value={formData.name_c}
                    onChange={(e) => handleFormChange('name_c', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleFormChange('Name', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Status</label>
                  <select
                    value={formData.status_c}
                    onChange={(e) => handleFormChange('status_c', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date_c}
                    onChange={(e) => handleFormChange('due_date_c', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Description</label>
                <textarea
                  value={formData.description_c}
                  onChange={(e) => handleFormChange('description_c', e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.Tags}
                  onChange={(e) => handleFormChange('Tags', e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancelForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {(!tasks || tasks.length === 0) ? (
          <Empty onAction={handleCreateTask} />
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.Id} className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {task.name_c || task.Name || 'Untitled Task'}
                      </h3>
                      <span className={`text-sm font-medium ${getStatusColor(task.status_c)}`}>
                        {task.status_c || 'Not Started'}
                      </span>
                    </div>
                    {task.description_c && (
                      <p className="text-white/70 mb-3">{task.description_c}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-white/60">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" size={16} />
                        <span>Due: {formatDate(task.due_date_c)}</span>
                      </div>
                      {task.assignee_c?.Name && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="User" size={16} />
                          <span>Assigned to: {task.assignee_c.Name}</span>
                        </div>
                      )}
                      {task.Tags && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Tag" size={16} />
                          <span>{task.Tags}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditTask(task)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteTask(task.Id, task.name_c || task.Name)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;