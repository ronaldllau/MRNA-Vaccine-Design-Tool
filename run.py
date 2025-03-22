import subprocess
import sys
import os
from threading import Thread

def run_frontend():
    os.chdir("frontend")
    subprocess.run("npm run dev", shell=True)

def run_backend():
    os.chdir("backend")
    # Activate virtual environment if it exists
    if os.path.exists("venv"):
        if sys.platform == "win32":
            subprocess.run("venv\\Scripts\\activate && uvicorn app.main:app --reload", shell=True)
        else:
            subprocess.run("source venv/bin/activate && uvicorn app.main:app --reload", shell=True)
    else:
        subprocess.run("uvicorn app.main:app --reload", shell=True)

if __name__ == "__main__":
    # Create threads for each service
    frontend_thread = Thread(target=run_frontend)
    backend_thread = Thread(target=run_backend)

    # Start both services
    frontend_thread.start()
    backend_thread.start()

    try:
        # Keep the main thread alive
        frontend_thread.join()
        backend_thread.join()
    except KeyboardInterrupt:
        print("\nShutting down services...")
        sys.exit(0) 