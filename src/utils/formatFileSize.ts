function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return bytes + " Bytes";
  } else if (bytes < 1000 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

export default formatFileSize;
