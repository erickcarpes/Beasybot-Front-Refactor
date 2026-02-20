export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return String(Number.parseFloat((bytes / Math.pow(k, index)).toFixed(2))) + ' ' + sizes[index];
};

export const formatSecondsToTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return String(h) + 'h ' + String(m) + 'm';
  return String(m) + 'm';
};
