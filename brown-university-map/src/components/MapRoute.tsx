import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapRouteProps {
  route: { path: [number, number][]; description: string };
  color: string;
  media?: { audioUrl?: string; videoUrl?: string };
}

const MapRoute: React.FC<MapRouteProps> = ({ route, color, media }) => {
  const path: LatLngExpression[] = route.path.map((coord) => [coord[0], coord[1]]);

  return (
    <Polyline positions={path} color={color} weight={5}>
      <Popup>
        <div>
          <p>{route.description}</p>
          {/* Handle audio and video media */}
          {media?.audioUrl && media.audioUrl.includes("youtube.com") ? (
            <div>
              <p>YouTube Audio:</p>
              <iframe
                width="250"
                height="150"
                src={media.audioUrl.replace("music.youtube.com", "www.youtube.com").replace("watch?v=", "embed/")}
                title="YouTube Audio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            media?.audioUrl && (
              <div>
                <p>Audio:</p>
                <audio controls>
                  <source src={media.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )
          )}
          {media?.videoUrl && media.videoUrl.includes("youtube.com") ? (
            <div>
              <p>YouTube Video:</p>
              <iframe
                width="250"
                height="150"
                src={media.videoUrl.replace("watch?v=", "embed/")}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            media?.videoUrl && (
              <div>
                <p>Video:</p>
                <video width="250" controls>
                  <source src={media.videoUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            )
          )}
        </div>
      </Popup>
    </Polyline>
  );
};

export default MapRoute;