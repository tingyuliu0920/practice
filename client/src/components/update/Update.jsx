import React, { useState } from 'react';
import './update.scss';
import { makeRequest } from '../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Update({ setOpenUpdate, user }) {
  const [texts, setTexts] = useState({
    name: user.name || '',
    website: user.website || '',
    city: user.city || '',
  });
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleChange = (e) => {
    setTexts({ ...texts, [e.target.name]: e.target.value });
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (error) {}
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put('/users', user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl = user.coverPic;
    let profileUrl = user.profilePic;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };
  return (
    <div className="update">
      Update <span onClick={() => setOpenUpdate(false)}>X</span>
      <input
        type="file"
        name="profile"
        onChange={(e) => setProfile(e.target.files[0])}
      />
      <input
        type="file"
        name="cover"
        onChange={(e) => setCover(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="name"
        name="name"
        value={texts.name}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="city"
        value={texts.city}
        name="city"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="website"
        name="website"
        value={texts.website}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>update</button>
    </div>
  );
}
