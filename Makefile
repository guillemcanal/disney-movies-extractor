.PHONY: build shell install start run clean help
.DEFAULT_GOAL := help

docker_project_name := disney-movie-extractor
docker_image_name := $(shell id -nu)/$(docker_project_name)
docker_run := docker run --init --privileged --rm -it -v $(PWD):/app -w /app

##
## Docker
##

build: ## Build the Docker image
	@docker build -t $(docker_image_name) .

enter: build ## Enter the Docker container
	@$(docker_run) $(docker_image_name) bash

##
## Project
##

install: build ## Install the project
	@$(docker_run) $(docker_image_name) npm install

start: build ## Extract Disney's movies
	@$(docker_run) $(docker_image_name) npm start

run: install start ## Install and Extract Disney's movies

clean: ## Clean the project
	@rm -rf ./dist ./.cache ./extracted ./node_modules

help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-15s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
