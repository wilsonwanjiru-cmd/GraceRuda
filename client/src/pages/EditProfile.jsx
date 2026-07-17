// client/src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { updateProfile, uploadPhoto, deletePhoto } from '../redux/slices/userSlice';
import { loadUser } from '../redux/slices/authSlice';
import './EditProfile.css'; // import modern CSS

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    city: '',
    bio: '',
    occupation: '',
    height: '',
    weight: '',
    bodyType: '',
    smoking: '',
    drinking: '',
    religion: '',
    education: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        age: user.age || '',
        city: user.city || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        height: user.height || '',
        weight: user.weight || '',
        bodyType: user.bodyType || '',
        smoking: user.smoking || '',
        drinking: user.drinking || '',
        religion: user.religion || '',
        education: user.education || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    await dispatch(loadUser());
    navigate('/profile');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    await dispatch(uploadPhoto(formData));
    await dispatch(loadUser());
    setUploading(false);
  };

  const handlePhotoDelete = async (photoUrl) => {
    if (window.confirm('Delete this photo?')) {
      await dispatch(deletePhoto(photoUrl));
      await dispatch(loadUser());
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Profile | Ruda Dating</title>
        <meta name="description" content="Update your profile information, photos, and preferences on Ruda Dating." />
      </Helmet>

      <div className="edit-profile">
        <h1>Edit Profile</h1>

        {/* Photos Section */}
        <div className="edit-section">
          <h2>Photos</h2>
          <div className="photo-upload-grid">
            {user?.photos?.map((photo, i) => (
              <div key={i} className="photo-upload-item">
                <img src={photo} alt={`Photo ${i + 1}`} />
                <button
                  onClick={() => handlePhotoDelete(photo)}
                  className="remove-btn"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}
            {user?.photos?.length < 6 && (
              <label className="photo-upload-item add-photo">
                <div>
                  <div className="plus-icon">+</div>
                  <span className="add-label">Add Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden-input"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          {uploading && <p className="upload-status">Uploading...</p>}
          <p className="photo-hint">Upload up to 6 photos. Max 5MB each.</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-section">
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nairobi"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell people about yourself..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  name="height"
                  type="text"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="bodyType">Body Type</label>
              <input
                id="bodyType"
                name="bodyType"
                type="text"
                value={formData.bodyType}
                onChange={handleChange}
                placeholder="Slim, Athletic, Average, etc."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="smoking">Smoking</label>
                <select
                  id="smoking"
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="drinking">Drinking</label>
                <select
                  id="drinking"
                  name="drinking"
                  value={formData.drinking}
                  onChange={handleChange}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="religion">Religion</label>
              <input
                id="religion"
                name="religion"
                type="text"
                value={formData.religion}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input
                id="education"
                name="education"
                type="text"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="edit-actions">
            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;