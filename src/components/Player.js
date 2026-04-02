import React, { useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const Player = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const videoElement = document.getElementById('video');
    const player = videojs('video', {
      controls: true,
      autoplay: false,
      playbackRates: [0.5, 1, 1.5, 2],
    });
    setVideo(player);

    // Load thumbnails
    fetch('thumbnails.vtt')
      .then(response => response.text())
      .then(data => {
        const thumbnailsData = data.split('\n').map(line => line.trim());
        const thumbnailsArray = [];
        for (let i = 0; i < thumbnailsData.length; i++) {
          if (thumbnailsData[i].startsWith('00:')) {
            const startTime = thumbnailsData[i].split(' --> ')[0];
            const spriteData = thumbnailsData[i + 1].split('#xywh=')[1];
            thumbnailsArray.push({
              startTime,
              spriteData,
            });
          }
        }
        setThumbnails(thumbnailsArray);
      });

    player.on('timeupdate', () => {
      const currentTime = player.currentTime();
      setCurrentTime(currentTime);
    });
  }, []);

  useEffect(() => {
    if (video && thumbnails.length > 0) {
      const thumbnail = thumbnails.find(thumbnail => {
        const startTime = thumbnail.startTime.split(':');
        const startSeconds = parseInt(startTime[0]) * 3600 + parseInt(startTime[1]) * 60 + parseInt(startTime[2].split('.')[0]);
        return startSeconds <= currentTime && startSeconds + 2 > currentTime;
      });
      if (thumbnail) {
        const spriteData = thumbnail.spriteData.split(',');
        const x = parseInt(spriteData[0]);
        const y = parseInt(spriteData[1]);
        const width = parseInt(spriteData[2]);
        const height = parseInt(spriteData[3]);
        // Display thumbnail
        document.getElementById('thumbnail').style.backgroundImage = `url('sprite_0001.jpg')`;
        document.getElementById('thumbnail').style.backgroundPosition = `-${x}px -${y}px`;
        document.getElementById('thumbnail').style.width = `${width}px`;
        document.getElementById('thumbnail').style.height = `${height}px`;
      }
    }
  }, [currentTime, thumbnails, video]);

  return (
    <div>
      <video id="video" className="video-js vjs-default-skin" width="640" height="360"></video>
      <div id="thumbnail" style={{ position: 'absolute', top: 0, left: 0 }}></div>
    </div>
  );
};

export default Player;