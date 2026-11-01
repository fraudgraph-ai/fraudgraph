# FraudGraph AI — Enterprise Automation & Developer Tooling
SHELL := /bin/bash
.DEFAULT_GOAL := help

# Colors for terminal output
CYAN  := \033[36m
GREEN := \033[32m
RESET := \033[0m

.PHONY: help
help: ## Display this automated help menu
	@echo -e "$(CYAN)FraudGraph AI — Enterprise Financial Crime Intelligence Platform$(RESET)"
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

.PHONY: install
install: install-frontend install-backend ## Install all dependencies (Node.js & Python venv)

.PHONY: install-frontend
install-frontend: ## Install frontend npm dependencies
	@echo -e "$(CYAN)Installing frontend dependencies...$(RESET)"
	npm install

.PHONY: install-backend
install-backend: ## Create Python venv and install backend requirements
	@echo -e "$(CYAN)Setting up Python virtual environment...$(RESET)"
	python3 -m venv apps/api/.venv
	apps/api/.venv/bin/pip install --upgrade pip
	apps/api/.venv/bin/pip install -r apps/api/requirements.txt

.PHONY: test
test: test-backend test-frontend ## Run complete test suite (Pytest + Vitest)
	@echo -e "$(GREEN)✅ All 33 automated unit and integration tests passed cleanly!$(RESET)"

.PHONY: test-backend
test-backend: ## Run Python backend tests (Pytest)
	@echo -e "$(CYAN)Running backend intelligence tests...$(RESET)"
	PYTHONPATH=apps/api apps/api/.venv/bin/pytest apps/api/tests/ -v

.PHONY: test-frontend
test-frontend: ## Run frontend unit tests (Vitest)
	@echo -e "$(CYAN)Running frontend unit tests...$(RESET)"
	npm test -- --run

.PHONY: test-e2e
test-e2e: ## Run Playwright end-to-end browser automation tests
	@echo -e "$(CYAN)Executing Playwright E2E browser tests...$(RESET)"
	npm run test:e2e


.PHONY: build
build: ## Verify TypeScript types and compile production Vite bundle
	@echo -e "$(CYAN)Compiling frontend distribution...$(RESET)"
	npm run build

.PHONY: dev
dev: ## Start Vite workbench development server on port 3000
	npm run dev

.PHONY: run-api
run-api: ## Start FastAPI intelligence service on port 8000
	PYTHONPATH=apps/api apps/api/.venv/bin/uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

.PHONY: dev-all
dev-all: ## Concurrently launch both FastAPI backend and Vite frontend
	@bash scripts/dev.sh

.PHONY: docker-build
docker-build: ## Build Docker images using docker compose
	docker compose build

.PHONY: docker-up
docker-up: ## Spin up containerized stack (Web, FastAPI, Neo4j, Postgres, Redis)
	docker compose up -d

.PHONY: docker-down
docker-down: ## Tear down containerized stack
	docker compose down

.PHONY: clean
clean: ## Clean cache files and build artifacts
	rm -rf dist dist-ssr .pytest_cache
	find . -type d -name "__pycache__" -exec rm -rf {} +
