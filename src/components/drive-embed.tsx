import React from "react";

interface DriveEmbedProps {
  link: string;
}

const DriveEmbed: React.FC<DriveEmbedProps> = ({ link }) => {
  // Extract the file ID from the link
  const match = link.match(/\/d\/([^/]+)\//);
  const fileId = match ? match[1] : null;

  if (!fileId) {
    return <p>Invalid Google Drive link</p>;
  }

  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <iframe
      src={embedUrl}
      allow="autoplay"
      allowFullScreen
      className="w-full h-full max-h-[300px] border-none rounded-2xl"
    />
  );
};

export default DriveEmbed;
