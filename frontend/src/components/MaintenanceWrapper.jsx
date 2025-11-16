import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MaintenanceWrapper = ({ children }) => {
  const [maintenance, setMaintenance] = useState(null); // null = loading

  useEffect(() => {
    let mounted = true; // prevent setState after unmount

    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (mounted) setMaintenance(res.data?.maintenanceMode ?? false);
      } catch (err) {
        console.error(err);
        if (mounted) setMaintenance(false);
      }
    };

    fetchSettings();
    return () => { mounted = false }; // cleanup
  }, []); // empty dependency → run only once

  if (maintenance === null)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );

  if (maintenance)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Site Under Maintenance</h1>
        <p>Please check back later.</p>
      </div>
    );

  return children; // normal site
};

export default MaintenanceWrapper;
