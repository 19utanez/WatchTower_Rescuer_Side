export const getImageUrlById = (id) => {
  const imageId = id.includes('http') ? id.split('/').pop() : id;
  return `http://172.20.23.3:5000/api/reports/image/${imageId}`;  // Update to include the '/api' prefix
};