import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', formData);
      setProfile(res.data);
      setEditing(false);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.put('/profile/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPassword(false);
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company Name' },
    { key: 'address', label: 'Business Address' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>⚙️ Profile & Settings</h1>
      </div>

      <div className="detail-card" style={{ maxWidth: '600px' }}>
        <h2>👤 Account Information</h2>

        {editing ? (
          <form onSubmit={handleUpdate}>
            {fields.map(field => (
              <div className="form-group" key={field.key}>
                <label>{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="detail-actions">
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setFormData(profile); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-grid">
              {fields.map(field => (
                <div className="detail-field" key={field.key}>
                  <label>{field.label}</label>
                  <div className="value">{profile[field.key] ?? '—'}</div>
                </div>
              ))}
              <div className="detail-field">
                <label>Member Since</label>
                <div className="value">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</div>
              </div>
            </div>
            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn btn-secondary" onClick={() => setChangingPassword(!changingPassword)}>
                {changingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
          </>
        )}
      </div>

      {changingPassword && (
        <div className="detail-card" style={{ maxWidth: '600px', marginTop: '20px' }}>
          <h2>🔒 Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
