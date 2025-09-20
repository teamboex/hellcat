import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProductManagement = () => {
  const { state, actions } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    rank: 'Bronze',
    loginType: 'Facebook',
    status: 'Available',
    mythics: [],
    vehicles: [],
    pets: [],
    level: '',
    rp: '',
    kd: '',
    matches: '',
    winRate: '',
    description: '',
    isHot: false,
    isLimited: false,
    isExclusive: false,
    featured: false,
    discount: 0,
  });
  const [newMythic, setNewMythic] = useState('');
  const [newVehicle, setNewVehicle] = useState('');
  const [newPet, setNewPet] = useState('');

  const rankOptions = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Crown',
    'Ace',
    'Conqueror',
  ];
  const loginTypeOptions = ['Facebook', 'Google', 'Guest', 'Twitter'];
  const statusOptions = ['Available', 'Sold Out', 'Reserved'];

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      rank: 'Bronze',
      loginType: 'Facebook',
      status: 'Available',
      mythics: [],
      vehicles: [],
      pets: [],
      level: '',
      rp: '',
      kd: '',
      matches: '',
      winRate: '',
      description: '',
      isHot: false,
      isLimited: false,
      isExclusive: false,
      featured: false,
      discount: 0,
    });
    setNewMythic('');
    setNewVehicle('');
    setNewPet('');
  };

  const handleAddProduct = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      title: product.title,
      price: product.price.toString(),
      rank: product.rank,
      loginType: product.loginType,
      status: product.status,
      mythics: [...product.mythics],
      vehicles: [...product.vehicles],
      pets: [...product.pets],
      level: product.level.toString(),
      rp: product.rp.toString(),
      kd: product.kd.toString(),
      matches: product.matches.toString(),
      winRate: product.winRate.toString(),
      description: product.description || '',
      isHot: product.isHot || false,
      isLimited: product.isLimited || false,
      isExclusive: product.isExclusive || false,
      featured: product.featured || false,
      discount: product.discount || 0,
    });
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await actions.deleteProduct(productId);
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        level: parseInt(formData.level),
        rp: parseInt(formData.rp),
        kd: parseFloat(formData.kd),
        matches: parseInt(formData.matches),
        winRate: parseFloat(formData.winRate),
        discount: parseInt(formData.discount),
        image: '/api/placeholder/300/200',
        originalPrice: formData.discount > 0 ? formData.price : null,
      };

      if (showAddModal) {
        await actions.addProduct(productData);
        setShowAddModal(false);
      } else if (showEditModal) {
        await actions.updateProduct(selectedProduct.id, productData);
        setShowEditModal(false);
      }

      resetForm();
    } catch (error) {
      // Handle error silently
    }
  };

  const addMythic = () => {
    if (newMythic.trim()) {
      setFormData({
        ...formData,
        mythics: [...formData.mythics, newMythic.trim()],
      });
      setNewMythic('');
    }
  };

  const removeMythic = (index) => {
    setFormData({
      ...formData,
      mythics: formData.mythics.filter((_, i) => i !== index),
    });
  };

  const addVehicle = () => {
    if (newVehicle.trim()) {
      setFormData({
        ...formData,
        vehicles: [...formData.vehicles, newVehicle.trim()],
      });
      setNewVehicle('');
    }
  };

  const removeVehicle = (index) => {
    setFormData({
      ...formData,
      vehicles: formData.vehicles.filter((_, i) => i !== index),
    });
  };

  const addPet = () => {
    if (newPet.trim()) {
      setFormData({
        ...formData,
        pets: [...formData.pets, newPet.trim()],
      });
      setNewPet('');
    }
  };

  const removePet = (index) => {
    setFormData({
      ...formData,
      pets: formData.pets.filter((_, i) => i !== index),
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'Sold Out':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'Reserved':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      default:
        return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-slate-100">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Product Management
          </h2>
          <p className="text-slate-400">
            Manage your Hellcat account inventory
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products - Desktop Table View */}
      <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Mythics
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {state.products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🎮</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-100">
                          {product.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {product.loginType} • Level {product.level}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/20 text-blue-300 border border-blue-500/30">
                      {product.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-100">
                      ₹{product.price.toLocaleString()}
                    </div>
                    {product.discount > 0 && (
                      <div className="text-xs text-green-400">
                        {product.discount}% off
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">
                      {product.mythics.length} mythics
                    </div>
                    <div className="text-xs text-slate-400">
                      {product.mythics.slice(0, 2).join(', ')}
                      {product.mythics.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products - Mobile Card View */}
      <div className="md:hidden space-y-3">
        {state.products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800 rounded-xl border border-slate-700 p-4"
          >
            {/* Product Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">🎮</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {product.loginType} • Level {product.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-300 border border-blue-500/30">
                  {product.rank}
                </span>
              </div>
            </div>

            {/* Product Stats */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-slate-400">Price</div>
                <div className="text-sm font-semibold text-slate-200">
                  ₹{product.price.toLocaleString()}
                  {product.discount > 0 && (
                    <span className="text-green-400 ml-1">
                      ({product.discount}% off)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Status</div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* Mythics Info */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-1">Mythic Weapons</div>
              <div className="text-sm text-slate-300">
                {product.mythics.length} mythics:{' '}
                {product.mythics.slice(0, 2).join(', ')}
                {product.mythics.length > 2 && '...'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handleViewProduct(product)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleEditProduct(product)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-xs"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        title={showAddModal ? 'Add New Product' : 'Edit Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rank
                  </label>
                  <select
                    value={formData.rank}
                    onChange={(e) =>
                      setFormData({ ...formData, rank: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {rankOptions.map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Login Type
                  </label>
                  <select
                    value={formData.loginType}
                    onChange={(e) =>
                      setFormData({ ...formData, loginType: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loginTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Account Stats
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Level
                  </label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    RP
                  </label>
                  <input
                    type="number"
                    value={formData.rp}
                    onChange={(e) =>
                      setFormData({ ...formData, rp: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    KD Ratio
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.kd}
                    onChange={(e) =>
                      setFormData({ ...formData, kd: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Matches
                  </label>
                  <input
                    type="number"
                    value={formData.matches}
                    onChange={(e) =>
                      setFormData({ ...formData, matches: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Win Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.winRate}
                  onChange={(e) =>
                    setFormData({ ...formData, winRate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mythic Weapons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">
              Mythic Weapons
            </h3>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMythic}
                onChange={(e) => setNewMythic(e.target.value)}
                placeholder="Add mythic weapon"
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addMythic())
                }
              />
              <button
                type="button"
                onClick={addMythic}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.mythics.map((mythic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-900/20 text-blue-300 border border-blue-500/30 rounded-full text-sm"
                >
                  {mythic}
                  <button
                    type="button"
                    onClick={() => removeMythic(index)}
                    className="ml-2 text-blue-400 hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Vehicles & Pets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100">Vehicles</h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  placeholder="Add vehicle"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addVehicle())
                  }
                />
                <button
                  type="button"
                  onClick={addVehicle}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.vehicles.map((vehicle, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-900/20 text-green-300 border border-green-500/30 rounded-full text-sm"
                  >
                    {vehicle}
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="ml-2 text-green-400 hover:text-green-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100">Pets</h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPet}
                  onChange={(e) => setNewPet(e.target.value)}
                  placeholder="Add pet"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addPet())
                  }
                />
                <button
                  type="button"
                  onClick={addPet}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.pets.map((pet, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-900/20 text-purple-300 border border-purple-500/30 rounded-full text-sm"
                  >
                    {pet}
                    <button
                      type="button"
                      onClick={() => removePet(index)}
                      className="ml-2 text-purple-400 hover:text-purple-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">
              Product Features
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={(e) =>
                    setFormData({ ...formData, isHot: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Hot Item</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isLimited}
                  onChange={(e) =>
                    setFormData({ ...formData, isLimited: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Limited</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isExclusive}
                  onChange={(e) =>
                    setFormData({ ...formData, isExclusive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Exclusive</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Featured</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this account..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={state.loading.admin}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {state.loading.admin ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{showAddModal ? 'Add Product' : 'Update Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Product Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Title:</span>
                    <span className="text-slate-100">
                      {selectedProduct.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-slate-100">
                      ₹{selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rank:</span>
                    <span className="text-slate-100">
                      {selectedProduct.rank}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Login Type:</span>
                    <span className="text-slate-100">
                      {selectedProduct.loginType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        selectedProduct.status
                      )}`}
                    >
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Account Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span className="text-slate-100">
                      {selectedProduct.level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RP:</span>
                    <span className="text-slate-100">
                      {selectedProduct.rp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">KD:</span>
                    <span className="text-slate-100">{selectedProduct.kd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Matches:</span>
                    <span className="text-slate-100">
                      {selectedProduct.matches}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Win Rate:</span>
                    <span className="text-slate-100">
                      {selectedProduct.winRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Mythic Weapons
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.mythics.map((mythic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-900/20 text-blue-300 border border-blue-500/30 rounded-full text-sm"
                  >
                    {mythic}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Vehicles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.vehicles.map((vehicle, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-900/20 text-green-300 border border-green-500/30 rounded-full text-sm"
                    >
                      {vehicle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-100">Pets</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.pets.map((pet, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-900/20 text-purple-300 border border-purple-500/30 rounded-full text-sm"
                    >
                      {pet}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Description
                </h3>
                <p className="text-slate-300">{selectedProduct.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagement;
