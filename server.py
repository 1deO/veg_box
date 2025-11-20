from flask import Flask, render_template   # 從 flask模組載入 Flask、render_template

app = Flask(__name__)     # 建立一個 Flask 物件，並命名為app，其中__name__ 表示目前執行的程式

@app.route("/")           # 使用函式裝飾器，建立一個路由(或稱路徑)，執行時可針對路徑"/"發出請求，作為API負責前端與後端之間的互動

def index():               # 發出請求後會執行index()函式

    return render_template('home.html')   # 會使用樣板引擎回傳(home.html)網頁的內容

if __name__ == '__main__':    # 當執行__name__時，app開始執行

    app.run()        
