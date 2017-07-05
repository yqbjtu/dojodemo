define([
"dojo/_base/declare",
"dojo/_base/config",
"dojo/_base/lang",
"dojo/date/locale",
"dojo/dom-class",
"dijit/_Contained",
"dijit/_WidgetBase",
"dijit/form/Button",
"dijit/form/TextBox",
"dijit/_TemplatedMixin"
],
function(declare,
        config,
        lang,
        locale,
        domClass,
        contained,
        widgetBase,
        Button,
        TextBox,
        _TemplatedMixin
        ){
  return declare("common.MyButtonBox", [contained, widgetBase, _TemplatedMixin], {
       templateString:
            '<div>' +
            '<div style="height: 30px;">' +
                '<div data-dojo-attach-point="delButtonAttachUp" style="float: left;"></div>' +
            '</div>' +
            '<div class="textBox">' +
                '<div data-dojo-attach-point="textBoxAttachPoint"></div>' +
            '</div>' +
            '<div style="height: 30px;">' +
                '<div data-dojo-attach-point="delButtonAttachDown" style="float: left;"></div>' +
            '</div>' +
        '</div>',

     textField: null, // TextBox widget

  postCreate: function() {
      this.inherited(arguments);
      var self = this;
      self.createButtonAndBox();
      
      var myTextBox = new TextBox({
          name: "firstname",
          value: "test"
         });

       myTextBox.placeAt(this.textBoxAttachPoint);
   },

    createButtonAndBox: function() {
      var self = this;

      var deleteButtonUp = new Button({
          showTitle: true,
          title: "deleteTitleUp",
          label: "Delete",
          onClick: function() {
              self.deleteFun(self);
          }
      });
      self.own(deleteButtonUp);
      deleteButtonUp.placeAt(self.delButtonAttachUp);

      var deleteButtonDown = new Button({
          showTitle: true,
          title: "deleteTitleDown",
          label: "DeleteDown",
          onClick: function() {
              self.deleteFun(self);
          }
      });
      self.own(deleteButtonDown);
      deleteButtonDown.placeAt(self.delButtonAttachDown);


    },

    deleteFun: function(btn) {
      var self = btn;
      console.log("button is clicked.");
    }

    });
});