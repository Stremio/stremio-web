import React from 'react';
import { useState, useEffect } from 'react';
import KebabMenu from './KebabMenu';

const DetailsPage = () => {
  const [item, setItem] = useState({});
  const [markedAsWatched, setMarkedAsWatched] = useState(false);

  const markAsWatched = () => {
    setMarkedAsWatched(true);
  };

  return (
    <div>
      <h1>{item.title}</h1>
      <KebabMenu>
        <button onClick={markAsWatched}>Mark as watched</button>
      </KebabMenu>
      {markedAsWatched && <span>Watched</span>}
    </div>
  );
};

export default DetailsPage;