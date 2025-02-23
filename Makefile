# Define container names
FRONTEND_CONTAINER=lms-pfa-frontend-1
BACKEND_CONTAINER=lms-pfa-backend-1

# Enter frontend container
enter-frontend:
    docker exec -it $(FRONTEND_CONTAINER) sh

# Enter backend container
enter-backend:
    docker exec -it $(BACKEND_CONTAINER) sh

# Build the frontend
build-frontend:
    docker-compose run frontend npm run build

# Build the backend
build-backend:
    docker-compose run backend npm run build

# Build everything
build:
    make build-frontend
    make build-backend
