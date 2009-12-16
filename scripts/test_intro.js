/* ------------------------- Introduction -------------------------
  Copyright (c) 2009 Mark Avery. Copious Inc. -- copiousinc.com --
  
  ther are two different 'acts', load_acts, and jax_acts
  load_acts are the functions to be called upon a 'load' action
  jax_acts are to be called upon an 'jax' action
  for the different 'acts' they take 3 paramaters..
  
  item : the jQuery selector being passed to the function
  handle : the fuction to be called
  extras : any additional argument to be passed as an array
  
  this.start_up() initiates the controler.. and will be called upon instantiation.. of all classes.
  
*/

function Introduction(element){
  Controler.call(this, element);
  var self = this;
  this.live_site = 'http://www.oz.com';
  
  this.linker_force = [{
    hookshot : /^gallery/i,
    handle : Gallery_tour,
    extras : ['/images/tour/JPEG/', ' /oz_gallery.json']
  },{
    hookshot : /youtube/i,
    handle : External_link
  }]
 
  this.scenes = [];
 
  this.acts = [{
    item : this.container.find('#gallery'),
    handle : Oz_gallery
  },{
    item : this.container.find('map area, div.sponser_list a, #content.home .content.main .body.right a'),
    handle : External_link
  },{
    item : this.container.find('#gallery'),
    handle : Gallery_tour,
    extras : ['/images/tour/JPEG/', ' /oz_gallery.json']
  },{
    item : this.container.find('#content.portfolio div.content'),
    handle : Gallery_tour,
    extras : ['/images/portfolio/large/', ' /portfolio_gallery.json']
  },{
    item : this.container.find('div#content.news div.article_list'),
    handle : Article_reader
  }];
 return this;
}

$(document).ready(function() {
  new Introduction($('#container')).start_up();
});
