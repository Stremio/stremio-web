import React from 'react';
import { useState, useEffect } from 'react';
import KebabMenu from './KebabMenu';

const Discover = () => {
  const [items, setItems] = useState([]);
  const [markedAsWatched, setMarkedAsWatched] = useState({});

  const markAsWatched = (id) => {
    setMarkedAsWatched((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <KebabMenu>
            <button onClick={() => markAsWatched(item.id)}>Mark as watched</button>
          </KebabMenu>
          {markedAsWatched[item.id] && <span>Watched</span>}
        </div>
      ))}
    </div>
  );
};

export default Discover;