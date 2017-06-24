var thinky = require("thinky")();


var tasks = thinky.createModel("tasks", {
        id: String,
        name: String,
        username: String,
        createTime: Date,
        completed: Number
    });


exports.list = function(req, res) {
    tasks.filter({username: req.user.username}).then(function(tasks) {
        res.render('tasks.hbs', {
            tasks: tasks || [],
            title: 'Todo List'
        }, function(err, html) {
            if (err) throw err;
            res.render('layout.hbs', {
                content: html,
                username: req.user.username
            });
        });
    })
};
exports.add = function(req, res, next) {
    if (!req.body || !req.body.name) return next(new Error('No data provided.'));
    var Task = new tasks({
        name: req.body.name,
        username: req.user.username,
        createTime: new Date(),
        completed: 0
    });

    Task.saveAll().then( function(result){
        res.redirect('/user');
    }).catch(function(error){
        if (error) return next(error);
        if (!task) return next(new Error('Failed to save.'));
    });
};
// exports.markAllCompleted = function(req, res, next) {
//     if (!req.body.all_done || req.body.all_done !== 'true') return next();
//     req.db.tasks.update({
//         completed: false
//     }, {
//         $set: {
//             completeTime: new Date(),
//             completed: true
//         }
//     }, {
//         multi: true
//     }, function(error, count) {
//         if (error) return next(error);
//         console.info('Marked %s task(s) completed.', count);
//         res.redirect('/tasks');
//     })
// };
exports.completeTask = function(req, res, next) {
    console.log(req.body);
    tasks.filter({id: req.body.id}).update({completed: req.body.value}).run();
};
// exports.markCompleted = function(req, res, next) {
//     if (!req.body.completed) return next(new Error('Param is missing.'));
//     var completed = req.body.completed === 'true';
//     req.db.tasks.updateById(req.task._id, {
//         $set: {
//             completeTime: completed ? new Date() : null,
//             completed: completed
//         }
//     }, function(error, count) {
//         if (error) return next(error);
//         if (count !== 1) return next(new Error('Something went wrong.'));
//         console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
//         res.redirect('/tasks');
//     })
// };
exports.del = function(req, res, next) {
    tasks.filter({id: req.body.id}).delete().then(function(){
        res.redirect("/user");
    })
};