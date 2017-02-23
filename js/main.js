/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function(options) {

  var _this = this;

  this.render = options.render;

  /* Body Tag */
  this.bodyTag = document.getElementsByTagName('body')[0];

  /* Head Tag */
  this.headTag = document.getElementsByTagName('head')[0];

  /* json */
  if (typeof json == 'undefined' && typeof rma != 'undefined') {
    this.json = rma.customize.json;
  } else if (typeof json != 'undefined') {
    this.json = json;
  } else {
    this.json = '';
  }

  /* fet */
  if (typeof fet == 'undefined' && typeof rma != 'undefined') {
    this.fet = typeof rma.fet == 'string' ? [rma.fet] : rma.fet;
  } else if (typeof fet != 'undefined') {
    this.fet = fet;
  } else {
    this.fet = [];
  }

  this.fetTracked = false;

  /* load json for assets */
  this.loadJs(this.json, function() {
    _this.data = json_data;

    _this.render.render();
  });

  /* Get Tracker */
  if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
    this.custTracker = rma.customize.custTracker;
  } else if (typeof custTracker != 'undefined') {
    this.custTracker = custTracker;
  } else {
    this.custTracker = [];
  }

  /* CT */
  if (typeof ct == 'undefined' && typeof rma != 'undefined') {
    this.ct = rma.ct;
  } else if (typeof ct != 'undefined') {
    this.ct = ct;
  } else {
    this.ct = [];
  }

  /* CTE */
  if (typeof cte == 'undefined' && typeof rma != 'undefined') {
    this.cte = rma.cte;
  } else if (typeof cte != 'undefined') {
    this.cte = cte;
  } else {
    this.cte = [];
  }

  /* tags */
  if (typeof tags == 'undefined' && typeof tags != 'undefined') {
    this.tags = this.tagsProcess(rma.tags);
  } else if (typeof tags != 'undefined') {
    this.tags = this.tagsProcess(tags);
  } else {
    this.tags = '';
  }

  /* Unique ID on each initialise */
  this.id = this.uniqId();

  /* Tracked tracker */
  this.tracked = [];
  /* each engagement type should be track for only once and also the first tracker only */
  this.trackedEngagementType = [];
  /* trackers which should not have engagement type */
  this.engagementTypeExlude = [];
  /* first engagement */
  this.firstEngagementTracked = false;

  /* RMA Widget - Content Area */
  this.contentTag = document.getElementById('rma-widget');

  /* URL Path */
  this.path = typeof rma != 'undefined' ? rma.customize.src : '';

  /* Solve {2} issues */
  for (var i = 0; i < this.custTracker.length; i++) {
    if (this.custTracker[i].indexOf('{2}') != -1) {
      this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
    }
  }
};

/* Generate unique ID */
mads.prototype.uniqId = function() {

  return new Date().getTime();
}

mads.prototype.tagsProcess = function(tags) {

  var tagsStr = '';

  for (var obj in tags) {
    if (tags.hasOwnProperty(obj)) {
      tagsStr += '&' + obj + '=' + tags[obj];
    }
  }

  return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function(url) {

  if (typeof url != "undefined" && url != "") {

    if (typeof this.ct != 'undefined' && this.ct != '') {
      url = this.ct + encodeURIComponent(url);
    }

    if (typeof mraid !== 'undefined') {
      mraid.open(url);
    } else {
      window.open(url);
    }

    if (typeof this.cte != 'undefined' && this.cte != '') {
      this.imageTracker(this.cte);
    }
  }
}

/* tracker */
mads.prototype.tracker = function(tt, type, name, value) {

  /*
   * name is used to make sure that particular tracker is tracked for only once
   * there might have the same type in different location, so it will need the name to differentiate them
   */
  name = name || type;

  if (tt == 'E' && !this.fetTracked && this.fet) {
    for (var i = 0; i < this.fet.length; i++) {
      var t = document.createElement('img');
      t.src = this.fet[i];

      t.style.display = 'none';
      this.bodyTag.appendChild(t);
    }
    this.fetTracked = true;
  }

  if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
    for (var i = 0; i < this.custTracker.length; i++) {
      var img = document.createElement('img');

      if (typeof value == 'undefined') {
        value = '';
      }

      /* Insert Macro */
      var src = this.custTracker[i].replace('{{rmatype}}', type);
      src = src.replace('{{rmavalue}}', value);

      /* Insert TT's macro */
      if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
        src = src.replace('tt={{rmatt}}', '');
      } else {
        src = src.replace('{{rmatt}}', tt);
        this.trackedEngagementType.push(tt);
      }

      /* Append ty for first tracker only */
      if (!this.firstEngagementTracked && tt == 'E') {
        src = src + '&ty=E';
        this.firstEngagementTracked = true;
      }

      /* */
      img.src = src + this.tags + '&' + this.id;

      img.style.display = 'none';
      this.bodyTag.appendChild(img);

      this.tracked.push(name);
    }
  }
};

mads.prototype.imageTracker = function(url) {
  for (var i = 0; i < url.length; i++) {
    var t = document.createElement('img');
    t.src = url[i];

    t.style.display = 'none';
    this.bodyTag.appendChild(t);
  }
}

/* Load JS File */
mads.prototype.loadJs = function(js, callback) {
  var script = document.createElement('script');
  script.src = js;

  if (typeof callback != 'undefined') {
    script.onload = callback;
  }

  this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function(href) {
  var link = document.createElement('link');
  link.href = href;
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');

  this.headTag.appendChild(link);
}

mads.prototype.extractBit = function(selector, content) {
  var e = {};
  var elems = content.querySelectorAll(selector);
  for (var elem in elems) {
    var id = elems[elem].id
    if (id) {
      Object.defineProperty(elems[elem], 'CSSText', {
        set: function(text) {
          var pattern = /([\w-]*)\s*:\s*([^;]*)/g
          var match, props = {}
          while (match = pattern.exec(text)) {
            props[match[1]] = match[2]
            this.style[match[1]] = match[2]
          }
        }
      })
      Object.defineProperty(elems[elem], 'ClickEvent', {
        set: function(f) {
          this.addEventListener('click', f)
        }
      })
      elems[elem].fadeIn = function(duration) {
        duration = duration || 600
        var self = this
        self.CSSText = 'opacity:0;transition:opacity ' + (duration * 0.001) + 's;display:block;'
        setTimeout(function() {
          self.CSSText = 'opacity:1;'
        }, 1)
      }
      elems[elem].fadeOut = function(duration) {
        duration = duration || 600
        var self = this
        self.CSSText = 'opacity:1;transition:opacity ' + (duration * 0.001) + 's;display:block;'
        setTimeout(function() {
          self.CSSText = 'opacity:0;'
          setTimeout(function() {
            self.CSSText = 'display:none;'
          }, duration)
        }, 1)
      }
      e[id] = elems[elem]
    }
  }

  return e
}

var jir = function() {
  this.app = new mads({
    'render': this
  });

  document.body.style.padding = 0
  document.body.style.margin = 0

  this.app.loadCss( this.app.path + 'css/w3.css')

  this.render();
  this.style();
  this.event();
}

jir.prototype.render = function() {

  var cities = ["Bandung","Jakarta","Samarinda","Pekanbaru","Balikpapan","Padang","Patam","Malang","Medan","Pangaturan","Tebingtinggi","Sungailiat","Palembang","Bengkalis","Jambi City","Depok","Bogor","Sangereng","Bekasi","Karawang","Sukabumi","Tasikmalaya","Subang","Ciamis","Cirebon","Garut","Kuningan","Majalengka","Sumedang","Sukoharjo","Semarang","Pekalongan","Kudus","Klaten","Jepara","Demak","Salatiga","Tegal","Yogyakarta","Sleman","Cilacap","Magelang","Wonosobo","Surakarta","Bantul","Temanggung","Kebumen","Purwokerto","Purbalingga","Kulon","Surabaya","Bangkalan","Pasuruan","Mojokerto","Sidoarjo","Surabayan","Batu","Blitar","Lumajang","Tulungagung","Magetan","Kediri","Trenggalek","Madiun","Ngawi","Nganjuk","Bojonegoro","Banyuwangi","Jember","Situbondo","Probolinggo","Gresik","Lamongan","Pamekasan","Pontianak","Singkawang","Banjarmasin","Buntok","Bontang","Palangkaraya","Tarakan","Denpasar","Badung","Ubud","Mataram","Selong","Manado","Tondano","Bitung","Bima","Sungguminasa","Adiantorop","Makassar","Sekupang","Kota","Bangkinang","Binjai","Banda Aceh","Lhokseumawe","Serdang","Balige","Lampeong","Baturaja","Bandar","Cimahi","Indramayu","Banyumas","Jombang","Mojoagung","Kepanjen","Ponorogo","Pacitan","Palu","Sengkang","Gorontalo","Gianyar","Jayapura","Soasio","Wonosari","Bengkulu","Guntung","Langsa","Kerinci","Porsea","Bali","Cianjur","Tirtagangga","Purworejo","Pandeglang","Tigaraksa","Cilegon","Cilegon","Sanur","Darussalam","Kupang","Bandar Lampung","Pati","Panasuan","Darmaga","Dumai","Timur","Riau","Bukit Tinggi","Parman","Cihampelas","Tangsel","Duren","Angkasa","Jimbaran","Menara","Pamulang","Bantan","Baratjaya","Utara","Veteran","Tengah","Tenggara","Selatan","Simpang","Gunungsitoli","Pemalang","Tenggarong","Tanjung Balai","Serang","Cikarang","Cibitung","Bondowoso","Singaraja","Poso","Ambon City","Negeribesar","Cempaka","Lestari","Kandangan","Ciputat","Kartasura","Jagakarsa","Pondok","Solo","Polerejo","Muntilan","Boyolali","Nusantara","Cipinanglatihan","Kalimantan","Serang","Serpong","Cikini","Purwodadi Grobogan","Kendal","Tanjungpinang","Lubuk Pakam","Nusa","Kelapa Dua","Gandul","Gedung","Tanjung","Kuta","Kalideres","Mega","Area","Wilayah","Soho","Menteng","Tuban","Cilincing","Sunggal","Sijunjung","Kerobokan","Negara","Amlapura","Baubau","Karanganyar","Sampang","Depok Jaya","Parakan","Lawang","Pare","Airmadidi","Tembagapura","Banjarbaru","Palangka","Cimanggis","Kebayoran Baru","Lapan","Pusat","Sigli","Kabanjahe","Pematangsiantar","Payakumbuh","Kebayoran Lama Selatan","Tigarasa","Purwakarta","Cibubur","Wonogiri","Sragen","Ungaran","Batang","Ambarawa","Palaihari","Tanjung","Sampit","Bulukumba","Bangli","Soe","Nusa Dua","Stabat","Maros","Tipar Timur","Holis","Banjarnegara","Banjar","Kopeng","Duri","Bantaeng","Blora","Tomohon","Citeureup","Pekan","Mamuju","Badung","Abadi","Anggrek","Sejahtera","Cakrawala","Indo","Sentul","Utama","Mail","Udayana","Cengkareng","Kemang","Tabanan"];

  var content = this.app.contentTag;
  var path = this.app.path;
  content.innerHTML = '<div id="container">' +
    // '<div id="first" class="w3-content" style="max-width:320px;">'+
    //   '<img id="f1" src="' + path + 'img/IMS-img-04-d.gif" class="mys" style="width:100%;display:block;">' +
    //   // '<img id="f2" src="' + path + 'img/bg-1.png" class="mys" style="width:100%">' +
    // '</div>'+
    '<div id="second"><form id="form">'+
    '<input type="text" name="name" id="name" placeholder="NAME" required/>'+
    '<input type="email" name="email" id="email" placeholder="EMAIL" required/><br/>'+
    '<input type="number" name="no" id="no" placeholder="PHONE NUMBER" required/><br/>'+
    // '<datalist id="cities"></datalist>'+
    '<button id="submit" type="submit"><img id="submitimg" src="' + path + 'img/submitbutton.png"></button>'+
    '</form></div>'+
    '<img id="third" src="'+path+'img/ims-thankyou.jpg">'+
    '</div>';

  // for (var i = 0, len = cities.length; i < len; i++) {
  //   var option = document.createElement('option')
  //   option.innerText = cities[i]
  //   var citiesOption = content.querySelector('#cities')
  //   citiesOption.appendChild(option)
  // }

  this.bit = this.app.extractBit('div, img, button, form, input, datalist', content);
}

jir.prototype.style = function() {
  var content = this.app.contentTag;
  var path = this.app.path;
  var bit = this.bit;

  var HW = 'width:320px;height:480px;'
  var AOpacity = 'opacity:1;transition:opacity 0.6s;'
  var ABS = 'position:absolute;left:0;top:0;'

  bit.container.CSSText = HW + ''
  // bit.first.CSSText = [HW, ABS].join('')
  bit.second.CSSText = [HW, ABS].join('') + 'background:url(' + path + 'img/ims-rev.png);'
  bit.third.CSSText = [HW, ABS].join('') + 'display:none;'
  bit.form.CSSText = ABS + 'text-align:center;top:315px;'
  bit.name.CSSText = 'padding:10px;width: 260px;border: 1px solid #0089c3;'
  bit.email.CSSText = 'padding:10px;width: 260px;border: 1px solid #0089c3;margin-top:-1px;'
  bit.no.CSSText = 'padding:10px;width: 260px;border: 1px solid #0089c3;margin-top:-1px;'
  // bit.city.CSSText = 'padding:10px;width: 260px;border: 1px solid #0089c3;margin-top:-1px;'
  bit.submit.CSSText = 'border:none;padding:0;margin:0;outline:none;background:transparent;margin-top:-2px'
}

jir.prototype.event = function() {
  var self = this;
  var content = this.app.contentTag;
  var bit = this.bit;

  var myIndex = 0;
  // carousel();

  function carousel() {
      var i;
      var x = document.getElementsByClassName("mys");
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      myIndex++;
      if (myIndex > x.length) {myIndex = 1}
      x[myIndex-1].style.display = "block";
      setTimeout(carousel, 2500);
  }

  // bit.first.ClickEvent = function() {
  //   bit.first.fadeOut();
  //   bit.second.fadeIn();
  //
  //   self.app.tracker('E', 'first_page');
  // }

  bit.form.addEventListener('submit', function(e) {
    e.stopPropagation();
    e.preventDefault();

    var name = bit.name.value;
    var email = bit.email.value;
    var no = bit.no.value;
    // var city = bit.city.value;

    bit.submit.CSSText = 'display:none;'

    // self.app.loadJs('//www.mobileads.com/api/save_lf?'+
    // 'contactEmail=dickale@imx.co.id,karima@imx.co.id,adhie@mobileads.com,jeff@mobileads.com&'+
    // 'gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22'+name+'%22},{%22fieldname%22:%22text_2%22,%22value%22:%22'+no+'%22}]&'+
    // 'user-id=2901&studio-id=260&tab-id=1&trackid=2120&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback')

    // self.app.loadJs('//www.mobileads.com/api/save_lf?contactEmail=dickale@imx.co.id,hendika@mobileads.com,jeff@mobileads.com&'+
    // 'gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22'+name+'%22},{%22fieldname%22:%22textarea_2%22,%22value%22:%22'+no+'%22}]&'+
    // 'user-id=2901&studio-id=262&tab-id=1&trackid=2123&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback')

    self.app.loadJs('//www.mobileads.com/api/save_lf?contactEmail=dickale@imx.co.id,hendika@mobileads.com,jeff@mobileads.com&'+
      'gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22'+name+'%22},{%22fieldname%22:%22text_2%22,%22value%22:%22'+
      email+'%22},{%22fieldname%22:%22text_4%22,%22value%22:%22'+no+'%22}]&user-id=2901&studio-id=262&tab-id=1&trackid=2124&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback')

    return false;
  })

  bit.third.ClickEvent = function() {
    self.app.tracker('E', 'landing_page');
    self.app.linkOpener('//bit.ly/imsimx');
  }
}

jir.prototype.submitted = function() {
    var self = this;
    var bit = this.bit;

    bit.second.fadeOut();
    bit.third.fadeIn();

    this.app.tracker('E', 'submit');

    window.setTimeout(function() {
      self.app.tracker('E', 'landing_page');
      self.app.linkOpener('//bit.ly/imsimx');
    }, 1000)
}

var j = new jir()

function leadGenCallback(obj) {
  j.submitted();
}
