# Gunakan image Node.js resmi sebagai dasar
FROM node:18-slim

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh project files ke dalam container
COPY . .

# Expose port yang digunakan oleh Vite
EXPOSE 5173

# Jalankan Vite saat container dimulai
CMD ["npm", "run", "dev"]
