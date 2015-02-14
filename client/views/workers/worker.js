Template.worker.events({
  'click .worker-profile': function(e, instance) {
    Session.set("thisWorker", this);
    $("#workerProfileModal").modal();
  },

  'click .shift-profile-btn': function() {
    Router.go("member", {"_id": this._id, "date": moment(new Date()).format("YYYY-MM-DD")});
  }
});

Template.worker.helpers({
  'resigned': function() {
    var worker = this;
    if(worker.resign) {
      return {
        "class": "resigned-worker",
        "option": false
      };
    } else {
      return {
        "class": "active-worker",
        "option": true
      };
    }
  }
});