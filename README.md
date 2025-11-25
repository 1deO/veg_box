# veg_box

<!-- 最最一開始先裝虛擬環境 -->
pip3 install virtualenv
virtualenv venv

# 喚醒虛擬環境
<!-- Mac -->
source venv/bin/activate
<!-- Windows cmd -->
.\.venv\Scripts\Activate.ps1 
# 執行程式
<!-- Mac/Windows -->
python server.py

# optional:一件安裝需要的套件，後續更新也用它
<!-- Mac/Linux -->
pip3 install -r requirements.txt
<!-- Windows cmd -->
pip install -r requirements.txt


# frontend
1. Develop inside the Vite project (frontend/). Edit src/home.jsx (or any component files there); that’s the source before bundling.
2. Run "npm run dev" from frontend/. Vite serves the app at http://localhost:5173 with hot reloads, React DevTools support, readable stack traces, etc. You can iterate quickly there without involving Flask.
3. When you’re happy with the changes, run npm run build. That regenerates static/dist/assets/index.js (and index.css) for Flask. Refreshing /home in your Flask app will now show the updated UI.