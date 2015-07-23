var component = FlowComponents.define("teamHoursItem", function(props) {
  this.user = props.user;
});


component.state.user = function() {
  if(this.user) {
    return this.user;
  }
}

component.state.totaltime = function() {
  var total = 0;
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var date = day.date;
      var shift = Shifts.findOne({
        "assignedTo": userId, 
        "shiftDate": new Date(date).getTime(), 
        $or: [{"status": "finished"}, {"status": "started"}]
      });
      if(shift) {
        if(shift.finishedAt && shift.startedAt){
          total += (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          total += (new Date().getTime() - shift.startedAt);
        }
      }  
    });
    return total;
  }
}

component.state.wage = function() {
  var totalWage = 0;
  if(this.user) {
    var user = this.user;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var date = day.date;
      var time = 0;
      var shift = Shifts.findOne(
        {"assignedTo": user._id, 
        "shiftDate": new Date(date).getTime(), 
        $or: [{"status": "finished"}, {"status": "started"}]
      });
      if(shift) {
        if(shift.finishedAt && shift.startedAt){
          time = (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          time = (new Date().getTime() - shift.startedAt);
        }  
      } 

      if(time > 0) {
        var timeindecimalhours = Math.round(time*100)/100;
        var hours = moment.duration(timeindecimalhours).hours();
        var mins = moment.duration(timeindecimalhours).minutes();

        if(user.profile && user.profile.payrates) {
          var wageDoc = user.profile.payrates;
          var rate = 0;
          if(day.day == "Sunday") {
            rate = parseInt(wageDoc['sunday']);
          } else if(day.day == "Saturday") {
            rate = parseInt(wageDoc['saturday']);
          } else {
            rate = parseInt(wageDoc['weekdays']);
          }
          totalWage += rate * parseInt(hours);
          totalWage += (rate/60) * parseInt(mins);
        } 
      }
    });
    if(totalWage > 0 && (totalWage == totalWage)) {
      return Math.round(totalWage*100)/100;
    } else {
      return 0;
    }
  }
}

component.state.dailyHours = function() {
  var hours = [];
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var doc = {}
      var date = day.date;
      doc["date"] = date;
      var shift = Shifts.findOne({
        "assignedTo": userId, 
        "shiftDate": new Date(date).getTime(),
        $or: [{"status": "finished"}, {"status": "started"}]
      })
      if(shift) {
        if(shift.startedAt && shift.finishedAt) {
          doc["activeTime"] = (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          doc['activeTime'] = (new Date().getTime() - shift.startedAt);
        } else {
          doc['activeTime'] = 0;
        }
      }  
      hours.push(doc);
    });
    return hours;
  }
}

component.state.dailyShifts = function() {
  var shifts = [];
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var doc = {}
      var date = day.date;
      doc["date"] = date;
      var shift = Shifts.findOne({
        "assignedTo": userId, 
        "shiftDate": new Date(date).getTime()
      })
      if(shift) {
        doc["shift"] = shift._id;
      } 
      shifts.push(doc); 
    });
    return shifts;
  }
}

component.state.activeState = function() {
  var hash = Session.get("reportHash");
  if(hash == "shifts") {
    return true;
  } else {
    return false;
  }
}