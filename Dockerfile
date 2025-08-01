FROM node:alpine
WORKDIR /app
COPY prisma ./
COPY package.json package-lock.json ./
RUN npm install
CMD npx prisma generate dev
COPY . ./
RUN npm run build
CMD npx prisma migrate deploy
CMD npm run start
