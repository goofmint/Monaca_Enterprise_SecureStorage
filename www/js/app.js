ons.ready(function() {
  let todos;
  
  class MonacaStorage {
    constructor(env) {
      this.monaca = env ? true : false;
    }
    
    getItem(name) {
      return new Promise((res, rej) => {
        if (this.monaca) {
          plugins.secureStorage.getItem(name, (data) => {
            res(data);
          });
        }else{
          res(localStorage.getItem(name));
        }
      });
    }
    
    setItem(name, value) {
      return new Promise((res, rej) => {
        if (this.monaca) {
          plugins.secureStorage.setItem(name, value, (e) => {
            e ? res() : rej();
          })
        }else{
          localStorage.setItem(name, value);
          res();
        }
      })
    }
  }
  
  let storage = new MonacaStorage(typeof cordova != 'undefined');
  
  storage.getItem('todos')
    .then(data => {
      todos = data;
      todos = todos ? JSON.parse(todos) : [];
      show_todos(todos);
    });

// タスクを追加するイベント
  $('.add').on('click', (e) => {
    e.preventDefault();
    
    let todo = $('#todo').val();
    todos.push(todo);
    
    // タスクを保存する
    storage.setItem('todos', JSON.stringify(todos))
      .then(() => {
        $('#todo').val('');
        show_todos(todos);
      }, 
      () => {
        // エラー
        alert('タスクの保存に失敗しました');
      });
    
  });
  
A});

let show_todos = (todos) => {
  $('#todos').empty();
  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    $('#todos').append(`
      <ons-list-item class="item">
        <div class="center">${todo}</div>
        <div class="right">
          <ons-icon icon="fa-trash-o" class="delete" data-index=${i}>
        </ons-icon>
        </div>
      </ons-list-item>
    `);
  }
}
