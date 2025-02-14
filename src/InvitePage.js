import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function InvitePag() {
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userIdParam = queryParams.get('user');
    setUserId(userIdParam);
  }, [location]);

  return (
    <div>
      <h1>Invite Page</h1>
      {userId ? <p>You're invited to join the pool! Invitee ID: {userId}</p> : <p>Loading...</p>}
    </div>
  );
}

export default InvitePag;
