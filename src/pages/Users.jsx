import { useState, useMemo, useCallback } from 'react';
import { useBank, ACTIONS } from '../context/BankContext';

// Constantes extraites pour éviter la duplication
const ROLE_OPTIONS = ['all', 'admin', 'manager', 'client'];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  role: 'client',
  branchId: ''
};

// Fonction utilitaire pour générer des IDs uniques
const generateUniqueId = (prefix, existingIds) => {
  let newId;
  do {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 5);
    newId = `${prefix}${timestamp}${random}`.toUpperCase();
  } while (existingIds.includes(newId));
  return newId;
};

const Users = () => {
  const { users, branches, dispatch } = useBank();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  // Mémoïsation pour éviter les recalculs inutiles
  const filteredUsers = useMemo(() => {
    return filterRole === 'all' 
      ? users 
      : users.filter(u => u.role === filterRole);
  }, [users, filterRole]);

  // Validation du formulaire
  const validateForm = useCallback((data, isEditing) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isEditing && !data.password) {
      errors.password = 'Password is required for new users';
    } else if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const errors = validateForm(formData, !!editingUser);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;
    
    try {
      if (editingUser) {
        // Ne pas envoyer le mot de passe vide lors de l'édition
        const updatePayload = {
          ...editingUser,
          ...formData,
          password: formData.password || editingUser.password
        };
        
        dispatch({
          type: ACTIONS.UPDATE_USER,
          payload: updatePayload
        });
      } else {
        const newId = generateUniqueId('USR', users.map(u => u.id));
        const userData = formData;
        
        dispatch({
          type: ACTIONS.CREATE_USER,
          payload: { 
            id: newId, 
            ...userData,
            password: formData.password
          }
        });
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      setFormErrors({ submit: 'Failed to save user. Please try again.' });
    }
  }, [formData, editingUser, users, dispatch, validateForm, closeModal]);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'client',
      branchId: user.branchId || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        dispatch({ type: ACTIONS.DELETE_USER, payload: id });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }, [dispatch]);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error for the field being edited
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [formErrors]);

  const getBranchName = useCallback((branchId) => {
    if (!branchId) return 'N/A';
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  }, [branches]);

  // Composant Modal extrait pour une meilleure organisation
  const UserModal = useMemo(() => {
    if (!isModalOpen) return null;
    
    return (
      <div 
        className="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-card">
          <h2 id="modal-title" className="text-xl font-bold mb-4">
            {editingUser ? 'Edit User' : 'New User'}
          </h2>
          
          {formErrors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {formErrors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="form-field">
              <label htmlFor="user-name">Name <span className="text-red-500">*</span></label>
              <input
                id="user-name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={`${formErrors.name ? 'border-red-500' : ''}`}
                required
                aria-required="true"
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && (
                <p id="name-error" className="form-error" role="alert">
                  {formErrors.name}
                </p>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="user-email">Email <span className="text-red-500">*</span></label>
              <input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`${formErrors.email ? 'border-red-500' : ''}`}
                required
                aria-required="true"
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
              />
              {formErrors.email && (
                <p id="email-error" className="form-error" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="user-password">Password {editingUser ? '(leave blank to keep current)' : <span className="text-red-500">*</span>}</label>
              <input
                id="user-password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`${formErrors.password ? 'border-red-500' : ''}`}
                required={!editingUser}
                aria-required={!editingUser}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? 'password-error' : undefined}
                minLength={6}
              />
              {formErrors.password && (
                <p id="password-error" className="form-error" role="alert">
                  {formErrors.password}
                </p>
              )}
            </div>
            
            <div className="form-field">
              <label htmlFor="user-role">Role</label>
              <select
                id="user-role"
                value={formData.role}
                onChange={handleInputChange('role')}
              >
                <option value="client">Client</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-field">
              <label htmlFor="user-branch">Branch</label>
              <select
                id="user-branch"
                value={formData.branchId}
                onChange={handleInputChange('branchId')}
              >
                <option value="">None</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="button-secondary w-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-primary w-full"
              >
                {editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }, [isModalOpen, editingUser, formData, formErrors, branches, handleSubmit, handleInputChange, closeModal]);

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="users-title">User Management</h1>
          <p className="text-sm text-gray-500 mt-2">View and manage all registered users, roles, and branch assignments.</p>
        </div>

        <div className="users-actions">
          <button
            onClick={() => setIsModalOpen(true)}
            className="button-primary"
            aria-label="Add new user"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="users-actions mb-6">
        <label htmlFor="role-filter" className="sr-only">Filter by role</label>
        <select
          id="role-filter"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="users-filter"
        >
          <option value="all">All Roles</option>
          {ROLE_OPTIONS.filter(role => role !== 'all').map(role => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="users-empty">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="users-table" role="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Branch</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`users-badge ${user.role || 'default'}`}>
                      {(user.role || 'default').charAt(0).toUpperCase() + (user.role || 'default').slice(1)}
                    </span>
                  </td>
                  <td>{getBranchName(user.branchId)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="button-link"
                        aria-label={`Edit ${user.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="button-link"
                        aria-label={`Delete ${user.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {UserModal}
    </div>
  );
};

export default Users;
