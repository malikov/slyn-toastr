"use strict";
/**
* Toastr module
*
* @module toastr
*/
var q = require('q');
var _ = require("underscore");


//
var BackboneDustView = require("slyn-core-dust-base-view");
var ToastrTemplate = require('./templates/toastr-template.dust');



module.exports = function(Template){
    var template = Template || ToastrTemplate;
    
    var view = BackboneDustView.extend({
        name: 'ToastrView',
        initialize: function(options) {
            var opts = _.extend({
                el: 'div',
                type: 'info',
                position: 'top',
                root: document.body
            }, options)
    
            this.el = opts.el;
            this.template = template;
            this.type = opts.type;
            this.root = opts.root;
            this.pos = opts.position;
    
            _.bindAll(this, 'render', 'remove');
        },
        events: {
          'click .close': 'remove'  
        },
        render: function(content, opts) {
            var self = this;
            var options = _.extend({
                duration: 2000,
                removeAfter: true,
                type: self.type,
                position: self.pos
            }, opts);
    
            var deferred = q.defer();
    
            BackboneDustView.prototype.render.call(this, {
                    data: {
                        message: content,
                        type: options.type
                    }
                })
                .then(function(output) {
                    if (this.$el.hasClass('show')) {
                        this.remove();
                    }
    
                    this.$el.removeClass();
                    this.$el.addClass('toastr top ' + options.type+' '+options.position);
                    this.$el.appendTo(this.root);
    
                    setTimeout(function() {
                        this.$el.addClass('show');
    
                        if (options.removeAfter) {
                            setTimeout(function() {
                                this.remove();
                            }.bind(this), options.duration);
                        }
                    }.bind(this), 300);
    
    
                    deferred.resolve(this);
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                    console.log('error displaying toastr');
                    this.remove();
    
                    deferred.reject(error);
                }.bind(this));
    
            return deferred.promise;
        },
        remove: function() {
            setTimeout(function() {
                this.$el.removeClass('show');
            }.bind(this), 300);
        }
    });
    
    return view;
}

