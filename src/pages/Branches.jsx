import { useState, useMemo } from 'react';
import { useBank, ACTIONS } from '../context/BankContext';

const INITIAL_FORM = {
  name: '',
  location: '',
  phone: '',
  manager: '',
  status: 'active'
};

const generateBranchId = () => `BR${String(Date.now()).slice(-5)}`;

const Branches = () => {
  const { branches, users, dispatch, getBranchStats } = useBank();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const managers = useMemo(() => users.filter(u => u.role === 'manager'), [users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingBranch) {
      dispatch({
        type: ACTIONS.UPDATE_BRANCH,
        payload: { ...editingBranch, ...formData }
      });
    } else {
      const newId = generateBranchId();
      dispatch({
        type: ACTIONS.CREATE_BRANCH,
        payload: { id: newId, ...formData }
      });
    }
    
    closeModal();
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      phone: branch.phone,
      manager: branch.manager,
      status: branch.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      dispatch({ type: ACTIONS.DELETE_BRANCH, payload: id });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData(INITIAL_FORM);
  };

  const getManagerName = (managerId) => {
    const manager = users.find(u => u.id === managerId);
    return manager ? manager.name : 'Unassigned';
  };

  const BranchCard = ({ branch }) => {
    const stats = getBranchStats(branch.id);

    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{branch.name}</h3>
          <span className={`px-2 py-1 rounded text-sm ${branch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {branch.status}
          </span>
        </div>
        
        <div className="space-y-1 mb-3 text-gray-600">
          <p>📍 {branch.location}</p>
          <p>📞 {branch.phone}</p>
          <p>👤 Manager: {getManagerName(branch.manager)}</p>
        </div>

        <div className="flex justify-between text-sm mb-3 p-2 bg-gray-50 rounded">
          <span>Accounts: {stats.accountCount}</span>
          <span>Balance: {stats.totalBalance.toLocaleString()} XAF</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => handleEdit(branch)} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
            Edit
          </button>
          <button onClick={() => handleDelete(branch.id)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Branch Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(branch => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={editingBranch ? 'Edit Branch' : 'New Branch'}>
            <h2 className="text-xl font-semibold mb-4">{editingBranch ? 'Edit Branch' : 'New Branch'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded px-3 py-2" required aria-label="Branch name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border rounded px-3 py-2" required aria-label="Location" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded px-3 py-2" required aria-label="Phone number" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Manager</label>
                <select value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full border rounded px-3 py-2" aria-label="Select manager">
                  <option value="">Select Manager</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border rounded px-3 py-2" aria-label="Select status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingBranch ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;