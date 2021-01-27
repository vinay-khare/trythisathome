deepai.setApiKey("6ca3dc2d-887f-43df-a53b-9158ab9dcdb5");

var captionList;

var title = [
  "T",
  "R",
  "Y",
  " ",
  "T",
  "H",
  "I",
  "S",
  " ",
  "A",
  "T",
  " ",
  "H",
  "O",
  "M",
  "E",
  "!"
];
var titleCount = 0,
  titleInterval;

var img;

var imageLoader, canvas, ctx;

$(document).ready(function() {
  init();
  typeTitle();
});

function init() {
  $("#exp1").click(function() {
    loadExperience1();
  });
  $("#exp3").click(function() {
    loadExperience3();
  });
}

function typeTitle() {
  titleInterval = setInterval(function() {
    var h = document.getElementById("title");
    h.innerHTML += title[titleCount];
    titleCount++;
    if (titleCount > 16) {
      $("#intro").animate({ opacity: 1 }, 2000);
      setTimeout(revealExperience, 2000);
      clearInterval(titleInterval);
    }
  }, 150);
}

function revealExperience() {
  $("#experienceLink").animate({ opacity: 1 }, 1000);
}

function loadMenu() {
  console.log("menu");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("main").innerHTML = this.responseText;
      $("#experienceLink").css("opacity", "1");
      $("#intro").css("opacity", "1");
      init();
    }
  };
  xhttp.open("GET", "menu.txt", true);
  xhttp.send();
}

function loadExperience1() {
  console.log("1");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("main").innerHTML = this.responseText;
      imageLoader = document.getElementById("imageLoader");
      imageLoader.addEventListener("change", handleImage, false);
      canvas = document.getElementById("imageCanvas1");
      canvas.width =
        $("#imageCanvas1")
          .parent()
          .width() * 0.9;
      ctx = canvas.getContext("2d");
      $(".backBtn").click(function() {
        loadMenu();
      });
    }
  };
  xhttp.open("GET", "experience1.txt", true);
  xhttp.send();
}

function loadExperience3() {
  console.log("3");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("main").innerHTML = this.responseText;
      $(".backBtn").click(function() {
        loadMenu();
      });
    }
  };
  xhttp.open("GET", "experience3.txt", true);
  xhttp.send();
}


function handleImage(e) {
  $("#captions").empty();
  var reader = new FileReader();
  canvas.width =
    $("#imageCanvas1")
      .parent()
      .width() * 0.9;
  reader.onload = function(event) {
    img = new Image();
    img.onload = function() {
      canvas.height = canvas.width * (img.height / img.width);
      if (
        canvas.height >
        $("#imageCanvas1")
          .parent()
          .height() *
          0.9
      ) {
        canvas.height =
          $("#imageCanvas1")
            .parent()
            .height() * 0.9;
        canvas.width = canvas.height * (img.width / img.height);
      }
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      var imagebase64data = canvas.toDataURL("image/png");
      imagebase64data = imagebase64data.replace("data:image/png;base64,", "");
      (async function() {
        var resp2 = await deepai.callStandardApi("densecap", {
          image: imagebase64data
        });
        console.log(resp2.output.captions);
        captionList = resp2.output.captions;
        showList();
        
        // result = resp2.output.captions;
        // clearList();
        // writeCaptions();
      })();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
  // Get base64 data to send to server for upload
}


function showList() {
  for (var i = 0; i < captionList.length; i++){
    const newListItem = document.createElement("li");
    newListItem.innerText = captionList[i].caption;
    document.getElementById("captions").appendChild(newListItem);
  }
  hoverShow();
}

function hoverShow(){
  var list = document.getElementById("captions");
  var li = $('#captions li');
  console.log(li);
  li.on("mouseover", function( event ) {
    
    // highlight the mouseover target
    this.style.color = "#f745f1";
    var index = li.index(this);
    
    ctx.strokeStyle = "#f745f1";
    ctx.lineWidth = 5;
    ctx.strokeRect(captionList[index].bounding_box[0], captionList[index].bounding_box[1], captionList[index].bounding_box[2], captionList[index].bounding_box[3]);

  });
  
  li.on("mouseout", function( event ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    // highlight the mouseover target
    this.style.color = "";
  });
}
