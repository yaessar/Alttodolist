$(document).ready(function(){
  var tasks = [];
  var filterType = 'all';

  var filterTasks = function (element) {
    var type = $(element).data('type');

    if (!type) {
      type = filterType;
    } else {
      filterType = type;
    }
    
    $('#todo-list').empty();

    tasks.filter(function(task) {
      if (type === 'all') {
        return true;
      } else if (type === 'completed') {
        return task.completed;
      } else if (type === 'active') {
        return !task.completed;
      }
    }).forEach(function (task) {
      $('#todo-list').append('<div class="row"><p class="col-xs-8">' + task.content + '</p><button class="delete btn btn-danger btn-sm" data-id="' + task.id + '">Delete</button><input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '>');
    });
  } 
  var getAndDisplayAllTasks = function () {
    $.ajax({
      type: 'GET',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=522',
      dataType: 'json',
      success: function (response, textStatus) {
        tasks = response.tasks;
        filterTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  
  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=522',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#new-task-content').val()
        }
      }),
      success: function (response, textStatus) {
        $('#new-task-content').val('');
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });  
  }
  
  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  $('.filter').on('click', function (e) {
    e.preventDefault();
    filterTasks(this)
  });
  

  var deleteTask = function (id) {
    $.ajax({
   type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=522',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'))
  });

  var markTaskComplete = function (id) {
    $.ajax({
   type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=522',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    }
  });

  var markTaskActive = function (id) {
    $.ajax({
   type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=522',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
       markTaskComplete($(this).data('id'));
     } else {
       markTaskActive($(this).data('id'));
     }
   });

   getAndDisplayAllTasks();

});