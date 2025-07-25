FROM node:alpine
WORKDIR /app
COPY prisma ./
COPY package.json package-lock.json ./
RUN npm install
RUN npx prisma generate dev
COPY . ./
RUN npm run build
CMD npm run start
