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