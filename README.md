# veg_box

<!-- 最最一開始先裝虛擬環境 -->
pip3 install virtualenv
virtualenv venv

<!-- 之後每次開檔案都要 -->
# 喚醒虛擬環境
<!-- Windows cmd -->
.\.venv\Scripts\Activate.ps1 
# 執行程式
<!-- Windows cmd -->
python .\server.py

# optional:一件安裝需要的套件，後續更新也用它
<!-- Mac/Linux -->
pip3 install -r requirements.txt
<!-- Windows cmd -->
pip install -r requirements.txt