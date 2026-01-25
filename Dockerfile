FROM node:alpine
WORKDIR /app
COPY prisma ./
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD ["sh", "-c", "npm run db:deploy && npm run start"]
