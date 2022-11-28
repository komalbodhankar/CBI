# BACKEND COMMANDS


#### PREREQUISITES

1. Install Python version >= 3.7
2. Install virtualenv package
3. Execute below commands in terminal

   ```
   $ cd backend/
   $ virtualenv .venv -p python3.8
   $ source .venv/bin/activate
   $ pip install -r requirements.txt
   ```
4. Execute below commands in terminal for non-debug mode

   ```
    $ flask --app app run
   ```
5. Execute below commands in terminal for debug mode

   ```
    $ flask --app app --debug run
   ```
