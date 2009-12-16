function Oz_gallery() {
  var self = this;
  this.large_images = this.root.find('div.basin img, div.basin span');
  this.sliders = this.root.find('img.slider');
  this.preload_iter = 3;
  
  this.large_images.slice(self.preload_iter).remove();
  
  this.preload_go = function() {
    if(self.preload_iter >= self.large_images.length) { return false; }
    var temp = self.large_images.eq(self.preload_iter);
    if (temp.is('span')) {
      var temp = self.large_images.eq(self.preload_iter);
      temp = '<img src="' + unescape(temp.html()) + '" alt="' + temp.attr('title') + '" />'
    }
    self.gallery_interface.basin_wrapper.append(temp);
    self.gallery_interface.basins = self.gallery_interface.basin_wrapper.children();
    self.gallery_interface.slide_bind_up();
    self.gallery_interface.basin_bind_up();
    
    self.preload_iter++;
  }
  
  this.gallery_interface = new Runes({
    basins : this.large_images
  },{
    sliders : this.sliders,
    switch_method : 'all_slide_switch',
    auto : true,
    delay : 7,
    slide_animation: {
      over : { opacity : 1 },
      out : { opacity : .5 }
    }
  }).start_up();
  
    self.gallery_interface.basin_wrapper.bind('new_active', self.preload_go);
  
  return this;
}

function Gallery_tour(images_path, gallery_path) {
  var self = this;
  this.container = $('div#container');
  this.gallery_json = null;
  this.gallery = null;
  this.gallery_interface = null;
  this.images_path = images_path;
  this.preload_iter = 3;
  this.gallery_url = gallery_path;
  this.starting_point = 0;
  
  this.start_up = function() {
    self.root.bind('click', self.handle_click);
    if (self.root.children('h6').length > 0) {
      self.root.hover(function() {
        self.sketcher.draw(self.root.children('h6'), { opacity : .7 });
      }, function() {
        self.sketcher.draw(self.root.children('h6'), { opacity : .2 });
      });
    }
  }
  
  this.handle_click = function(e) {
    if (e) {
      var me = $(e.target);
      if (me.hasClass('slider')) {
        return false;
      } else if (me.is('img') || me.is('h4')) {
        if (me.attr('src').match(/portfolio/) || me.is('h4')) {
          me = me.parent();
        }
        self.starting_point = me.prevAll().length - 1;
      } else {
        self.starting_point = 0;
      }
      e.preventDefault();
    }
    self.bring_gallery_in()
  }
  
  this.bring_gallery_in = function() {
    window.scrollTo(0, 0);
    $(document.body).addClass('loading');
    $.ajax({
      dataType : 'json',
      url : self.gallery_url,
      success : self.build_gallery
    });
  }
  
  this.build_gallery = function(data) {
    self.sketcher.draw(self.container, {opacity : 0}, null, 1);
    self.gallery_json = data;
    var temp_gallery = '<div class="popin_gallery" ><img class="close" src="/images/icons/gallery/close_box.png" alt="close" /><div class="wrapper"><div class="holder">'
    for (var i = 0; i < self.preload_iter + self.starting_point; i++) {
      if (i >= self.gallery_json.length) {continue;}
      temp_gallery += '<img src="' + self.images_path + self.gallery_json[i].file_name + '" alt="' + self.gallery_json[i].title + '" />';
    }
    temp_gallery += '</div>';
    temp_gallery += '<img class="slider left" src="/images/icons/gallery/left_arrow.png" alt="scroll left" />';
    temp_gallery += '<img class="slider right" src="/images/icons/gallery/right_arrow.png" alt="scroll right" />';
    temp_gallery += '</div></div>';
    self.container.siblings('div#full_screen').html(temp_gallery);
    self.gallery = self.container.siblings('div#full_screen').children('div.popin_gallery').children('div.wrapper');;
    self.gallery.children('div.holder').children().eq(self.starting_point).bind('load', self.make_gallery);
  }
  
  this.preload_go = function() {
    setTimeout(function() {
      if(self.preload_iter >= self.gallery_json.length) { return false; }
      self.gallery_interface.basin_wrapper.append('<img src="' + self.images_path + self.gallery_json[self.preload_iter].file_name + '" alt="' + self.gallery_json[self.preload_iter].title + '" />');
      self.gallery_interface.basins = self.gallery_interface.basin_wrapper.children();
      self.gallery_interface.slide_bind_up();
      //self.gallery_interface.basins.trigger('rewidth');
      self.preload_iter++;
    }, 900);
  }
  
  this.make_gallery = function() {
    self.gallery_interface = new Runes({
      basins : self.gallery.children('div.holder').children(),
      change_wrapper_height : true,
      change_wrapper_width : true
    },{
      sliders : self.gallery.children('img.slider'),
      switch_method : 'all_slide_switch',
      basin_click_advance : true,
      auto : true,
      delay : 7,
      slide_animation: {
        over : { opacity : 1 },
        out : { opacity : .5 }
      }
    }).start_up();
    self.sketcher.draw(self.gallery.parent(), {opacity : 1}, function() {$(document.body).removeClass('loading');}, 1);
    self.gallery.siblings('img.close').bind('click', self.close_gallery);
    self.gallery_interface.basin_wrapper.bind('new_active', self.preload_go);
    self.gallery_interface.slide_goto(self.starting_point);
  }
  
  this.close_gallery = function() {
    self.sketcher.draw(self.gallery.parent(), {opacity : 0}, function() {
      self.container.siblings('div#full_screen').html('');
      self.sketcher.draw(self.container, {opacity : 1});
    }, 1);
  }
  
  return this;
}

function Article_reader() {
  var self = this;
  this.article_basin = this.root;
  this.page = this.root.parents('#content')
  this.article_basin_orig_height = 400;
  $(window).bind('load', function() {
    self.article_basin_orig_height = self.root.height();
  });
  this.articles = this.root.children('a');
  this.article_basin.after('<div class="article_viewer"><div class="actions"><h3></h3><img class="close" src="images/icons/close_box_green.png" alt="close" /></div><div class="window"></div></div>');
  this.article_viewer = this.article_basin.next();
  this.article_window = this.article_viewer.children('.window');
  this.article_actions = this.article_window.siblings('.actions');
  this.article_title_pag = this.article_actions.children('h3');
  this.article_closebox = this.article_actions.children('img.close');
  this.large_article = null;
  this.article_move = false;
  this.article_top = 0;
  this.article_left = 0;
  this.old_x_value = 0;
  this.old_y_value = 0;

  this.start_up = function() {
    self.articles.bind('click', self.bring_article);
    self.article_closebox.bind('click', self.close_article);
    self.article_window.bind('mousedown', function(e) {
      e.preventDefault();
      self.article_move = true;
      self.old_x_value = e.pageX;
      self.old_y_value = e.pageY;
      return false;
    });
    $(document).bind('mouseup', function(e) {
      self.article_move = false; 
    });
    self.article_window.bind('mousemove', self.reposition_article);
  }
  
  this.article_switch = function(e) {
    e.preventDefault();
    function article_in() {
      self.sketcher.draw(self.large_article, {opacity : 1 }, function() {self.page.removeClass('loading');});
    }
    self.page.addClass('loading');
    $(e.currentTarget).addClass('active').siblings().removeClass('active');
    self.sketcher.draw(self.large_article, {opacity : 0 }, function() {
      self.large_article.attr('src', $(e.currentTarget).attr('href'));
      if (!self.large_article[0].complete && self.large_article[0].complete != undefined) {
        self.large_article.bind('load', article_in);
      } else {
        article_in();
      }
    });    
  }
  
  this.bring_article = function(e) {
    e.preventDefault();
    var me = $(e.currentTarget);
    if (me.attr('href') == '') {
      return false;
    }
    var article_file = 'images/news/articles/' + me.attr('href');
    var article_title = me.attr('title') + '<strong>pages</strong>';
    for (var i = 1; i <= Number(me.attr('name')); i++) {
      article_title += '<a href="' + article_file.replace('page1', 'page' + i) + '">' + i + '</a>';
    }
    self.article_title_pag.html(article_title);
    self.article_title_pag.children('a:first').addClass('active');
    self.article_actions.children('h3').children('a').bind('click', self.article_switch);
    self.article_window.html('<img class="large_article" src="' + article_file + '" alt=""  />');
    self.large_article = self.article_window.children();
    self.page.addClass('loading');
    
    function window_in() {
      self.sketcher.draw(self.article_basin, {height: self.large_article.height()}, function() {self.page.removeClass('loading');});
      self.sketcher.draw(self.article_viewer.css('z-index', 1), {opacity : 1});      
    }
    self.sketcher.draw(self.article_basin, {opacity : 0 }, function() {
      if (!self.large_article[0].complete && self.large_article[0].complete != undefined) {
        self.large_article.bind('load', window_in);
      } else {
        window_in();
      }
    });
  }
  
  this.click_toggle = function() {
    
  }
  
  this.reposition_article = function(e) {
    if (self.article_move) {
      self.old_x_value = e.pageX - self.old_x_value;
      self.old_y_value = e.pageY - self.old_y_value;
      self.article_top += self.old_y_value;
      self.article_left += self.old_x_value;
      self.old_x_value = e.pageX;
      self.old_y_value = e.pageY;
      self.large_article.css({top: self.article_top, left : self.article_left});
    }
  }
  
  this.close_article = function() {
    self.article_top = 0;
    self.article_left = 0;
    self.sketcher.draw(self.article_viewer.css('z-index', -1), {opacity : 0}, function() {self.article_window.html('')});
    self.sketcher.draw(self.article_basin, {height : self.article_basin_orig_height, opacity : 1});
  }
  
  return this;
}
