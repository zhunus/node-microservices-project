FROM node:lts-alpine

WORKDIR /app

ENV BASE_URL=http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

COPY ./package.json .

RUN npm install

COPY . .

# RUN npm run build

CMD ["npm", "run", "dev"]