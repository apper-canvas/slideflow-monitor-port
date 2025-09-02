import mockImages from "@/services/mockData/images.json";

let images = [...mockImages];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const imageService = {
  async getAll() {
    await delay(300);
    return [...images];
  },

  async getById(id) {
    await delay(200);
    const image = images.find(img => img.Id === parseInt(id));
    if (!image) {
      throw new Error(`Image with ID ${id} not found`);
    }
    return { ...image };
  },

  async create(imageData) {
    await delay(400);
    const newImage = {
      Id: Math.max(...images.map(img => img.Id), 0) + 1,
      ...imageData
    };
    images.push(newImage);
    return { ...newImage };
  },

  async update(id, imageData) {
    await delay(300);
    const index = images.findIndex(img => img.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Image with ID ${id} not found`);
    }
    
    images[index] = { ...images[index], ...imageData };
    return { ...images[index] };
  },

  async delete(id) {
    await delay(300);
    const index = images.findIndex(img => img.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Image with ID ${id} not found`);
    }
    
    const deletedImage = { ...images[index] };
    images.splice(index, 1);
    return deletedImage;
  }
};