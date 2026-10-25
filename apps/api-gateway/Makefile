# Makefile para automatizar comandos del entorno de desarrollo

# Variables
DOCKER_COMPOSE = docker-compose

up:
	$(DOCKER_COMPOSE) up --build -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

restart:
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up --build -d

gateway-logs:
	docker logs -f api-gateway

product-logs:
	docker logs -f product-service

auth-logs:
	docker logs -f auth-service

ps:
	docker ps --filter name=api-gateway --filter name=product-service --filter name=auth-service
