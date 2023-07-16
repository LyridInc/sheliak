# Sheliak

Sheliak is an open-source Single-Sign-On authentication service and application. It is built using Django, React and GraphQL.

This project is an extension of [django-graphql-auth](https://github.com/PedroBern/django-graphql-auth) and the documentation can be found [here](https://django-graphql-auth.readthedocs.io/en/latest/).

## Changes from Original Project

- Added administration UI.
- Capability to run on Lyrid Platform.
- Included sample client implementation.

## Setup and Installation

Follow these steps to set up the Sheliak project on your local environment:

1. **Install Node.js dependencies**:

    Navigate to the `root` directory and run the following commands:

    ```bash
    yarn install
    yarn build-emails
    ```

2. **Install Python dependencies**:

    Use pip to install the Python requirements:

    ```bash
    pip install -r requirements.txt --default-timeout=100 future
    ```

3. **Database Setup**:

    Run migrations to set up the database schema:

    ```bash
    python manage.py migrate
    ```

4. **Create Superuser**:

    Create a superuser for the Django administration:

    ```bash
    python manage.py createsuperuser
    ```

5. **Verify Installation**:

    Start the development server:

    ```bash
    python manage.py runserver
    ```

    Then open a browser and navigate to `http://127.0.0.1:8000/admin/`. You should be able to log in using the superuser credentials you created earlier. Remember to logout after checking.

6. **Frontend Setup**:

    Go to the `frontend` directory and install the required dependencies:

    ```bash
    yarn install
    ```

    Build the frontend:

    ```bash
    yarn build
    ```

7. **Generate Static Files**:

    Finally, generate static files for Django. This will ensure that your Django admin will still work when `DEBUG` is set to `False`:

    ```bash
    python manage.py collectstatic
    ```

This completes the setup for the Sheliak project.
