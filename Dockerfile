# Gunakan base image Node.js
FROM node:18

# Buat direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi, termasuk file kredensial
COPY . .

# Ekspos port aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
