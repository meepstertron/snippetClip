        # Use an official Node.js runtime as a parent image
        FROM node:14 AS build

        # Set the working directory
        WORKDIR /app

        # Copy the package.json and package-lock.json files
        COPY package*.json ./

        # Install dependencies
        RUN npm install

        # Copy the rest of the application code
        COPY . .

        # Build the application
        RUN npm run build

        RUN ls -la /app



        # Use an official Nginx runtime as a parent image
        FROM nginx:alpine

        # Copy the build output to the Nginx html directory
        COPY --from=build /app/dist /usr/share/nginx/html

        COPY nginx.conf /etc/nginx/conf.d/default.conf

        # Expose port 80
        EXPOSE 80

        # Start Nginx when the container launches
        CMD ["nginx", "-g", "daemon off;"]