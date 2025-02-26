// pages/settings.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Fetch profile information from API
      fetch('/api/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setProfile(data);
            setFullName(data.fullName);
          } else {
            localStorage.removeItem('token');
            router.push('/login');
          }
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, apiKey }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Profile updated successfully.');
      // Optionally, update profile state with new data
      setProfile((prev) => ({ ...prev, fullName }));
    } else {
      setMessage(data.message || 'Error updating profile.');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-200 p-4 relative flex justify-center items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button 
          onClick={handleLogout} 
          className="absolute right-4 bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <p><strong>Username:</strong> {profile.username}</p>
        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center">
        Made with Enthusiasm by{' '}
        <a 
          href="https://my-portfolio-mp87eqzp7-sakthivel-azhakiamanavalans-projects.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 underline">
          DS4X
        </a>{' '}
        (Cyberwork LLC 🏢)
      </footer>
    </div>
  );
}
