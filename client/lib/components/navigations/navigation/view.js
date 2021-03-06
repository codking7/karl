Template.navigation.rendered = function(){
  setTimeout(function() {
    // Initialize metisMenu
    $('#side-menu').metisMenu();
  }, 5000);
};

// Used only on OffCanvas layout
Template.navigation.events({
  'click .close-canvas-menu' : function(){
    $('body').toggleClass("mini-navbar");
  },

  'click #signOutButton': function(event) {
    event.preventDefault();
    Meteor.logout();
  },
});

Template.navigation.helpers({
  today: function() {
    var date = moment(new Date()).format("YYYY-MM-DD");
    return date;
  },

  week: function() {
    var week = moment().format("w");
    return week;
  }
});