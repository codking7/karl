Template.editJobItem.helpers({
  item: function() {
    var id = Session.get("thisJobItem");
    var item = JobItems.findOne(id);
    if(item.ingredients || item.ingredients.length > 0) {
      item.ingredients.forEach(function(doc) {
        var ing = Ingredients.findOne(doc.id);
        doc._id = ing._id;
        doc.description = ing.description;
        doc.portionUsed = ing.portionUsed;
        doc.costPerUnit = ing.costPerUnit;
        doc.unit = ing.unit;
        doc.unitSize = ing.unitSize;
      });
    }
    return item;
  },

  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}});
        return ingredientsList;
      }
    }
  }
});

Template.editJobItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisJobItem");
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();;
    var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var recipe = $(event.target).find('[name=recipe]').val();
    var shelfLife = $(event.target).find('[name=shelfLife]').val();
    // var ing = $(event.target).find("[name=ing_qty]").get();

    var info = {};
    info.name = name.trim();
    info.type = type.trim();
    info.portions = parseInt(portions.trim());
    info.activeTime = parseInt(activeTime.trim());
    info.recipe = recipe.trim();
    info.shelfLife = parseInt(shelfLife.trim());

    Meteor.call("editJobItem", id, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },
});