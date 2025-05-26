.PHONY: backend frontend

backend:
	@echo Starting Django backend
	powershell -NoExit -Command "cd backend; .\\.venv\\Scripts\\python.exe manage.py runserver"

frontend:
	@echo Starting Vite React frontend
	powershell -NoExit -Command "cd frontend; npm.cmd run dev"