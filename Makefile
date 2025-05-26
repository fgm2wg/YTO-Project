.PHONY: backend frontend

backend:
	@echo Starting Django backend
	powershell -Command "backend\\.venv\\Scripts\\python.exe backend\\manage.py runserver"

frontend:
	@echo Starting Vite React frontend
	powershell -NoProfile -ExecutionPolicy Bypass -Command "cd frontend; npm run dev"