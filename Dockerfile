# Usar una imagen de Node.js oficial
FROM node:20.10

# Crear un directorio de trabajo
WORKDIR /app

# Copiar solo los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Recompilar bcrypt desde las fuentes para el entorno Docker
RUN npm rebuild bcrypt --build-from-source

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
