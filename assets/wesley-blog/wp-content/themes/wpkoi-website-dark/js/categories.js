/* all products sort */
jQuery(function($){

    const currentCat = $(".atg").data("cat");

  $(".theme-check input").prop("checked",true);

  $(".atg-wet #theme-count-total").text($(".home-theme-loop").length);

  if(currentCat != "all"){

    if(currentCat == "dark"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='dark']").prop("checked",true);
    }

    if(currentCat == "light"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='light']").prop("checked",true);
    }

    if(currentCat == "colorful"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='colorful']").prop("checked",true);
    }

    if(currentCat == "classic"){
      $(".theme-filter-list:eq(1) input").prop("checked",false);
      $(".theme-filter-list:eq(1) input[value='classic']").prop("checked",true);
    }

    if(currentCat == "hybrid-theme"){
      $(".theme-filter-list:eq(1) input").prop("checked",false);
      $(".theme-filter-list:eq(1) input[value='hybrid-theme']").prop("checked",true);
    }

  }

  function resetFilters(){

    $(".theme-check input").prop("checked",true);

    if(currentCat == "dark"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='dark']").prop("checked",true);
    }

    if(currentCat == "light"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='light']").prop("checked",true);
    }

    if(currentCat == "colorful"){
      $(".theme-filter-list:eq(0) input").prop("checked",false);
      $(".theme-filter-list:eq(0) input[value='colorful']").prop("checked",true);
    }

    if(currentCat == "classic"){
      $(".theme-filter-list:eq(1) input").prop("checked",false);
      $(".theme-filter-list:eq(1) input[value='classic']").prop("checked",true);
    }

    if(currentCat == "hybrid-theme"){
      $(".theme-filter-list:eq(1) input").prop("checked",false);
      $(".theme-filter-list:eq(1) input[value='hybrid-theme']").prop("checked",true);
    }

  }

    function sortThemes(){

        let items=$(".home-sort .home-theme-loop").get();

        items.sort(function(a,b){

            if($("#home-sort-popular").hasClass("home-sort-active")){

                return $(b).data("popular")-$(a).data("popular");

            }

      if($("#home-sort-abc").hasClass("home-sort-active")){

        return ($(a).data("abc")+"").localeCompare($(b).data("abc")+"");

      }

            return $(b).data("date")-$(a).data("date");

        });

        let parent = $(".home-sort");

    $.each(items,function(){

      parent.append(this);

    });

    }


    function filterThemes(){

        let styles=[];
        let structures=[];

        $(".theme-filter-list:eq(0) input:checked").each(function(){

            styles.push($(this).val());

        });

        $(".theme-filter-list:eq(1) input:checked").each(function(){

            structures.push($(this).val());

        });

        let count=0;

        $(".home-theme-loop").each(function(){

            let style=(( $(this).data("style") || "" )+"").split(" ");
      let structure=(( $(this).data("structure") || "" )+"").split(" ");

            let styleMatch=false;
            let structureMatch=false;

            $.each(styles,function(i,v){

                if(style.indexOf(v)>-1){

                    styleMatch=true;
                    return false;

                }

            });

            $.each(structures,function(i,v){

                if(structure.indexOf(v)>-1){

                    structureMatch=true;
                    return false;

                }

            });

            if(styleMatch && structureMatch){

                count+=parseInt($(this).data("count"));

                $(this)
                    .stop(true,true)
                    .fadeIn(150);

            }else{

                $(this)
                    .stop(true,true)
                    .fadeOut(150);

            }

        });

        $("#theme-count-current").text(count);

    if(count==0){

      $(".theme-no-results").fadeIn(200);

    }else{

      $(".theme-no-results").hide();

    }

    }

  function placeCtaCards(){

    $(".theme-cta-card").appendTo(".home-sort").hide();

    let visible = $(".home-theme-loop:visible").not(".theme-cta-card");

    if(visible.length>=14){
      visible.eq(13).after($(".cta-1"));
      $(".cta-1").show();
    }

    if(visible.length>=33){
      visible.eq(32).after($(".cta-2"));
      $(".cta-2").show();
    }

    if(visible.length>=55){
      visible.eq(54).after($(".cta-3"));
      $(".cta-3").show();
    }

  }


    function refresh(){

    $(".theme-cta-card").hide();

        sortThemes();

        filterThemes();

    setTimeout(function(){

      placeCtaCards();

    },170);

    }


    $("#home-sort-date").click(function(){

        $(".home-sort-b").removeClass("home-sort-active");

        $(this).addClass("home-sort-active");

        refresh();

    });


    $("#home-sort-popular").click(function(){

        $(".home-sort-b").removeClass("home-sort-active");

        $(this).addClass("home-sort-active");

        refresh();

    });

  $("#home-sort-abc").click(function(){

    $(".home-sort-b").removeClass("home-sort-active");

    $(this).addClass("home-sort-active");

    refresh();

  });


    $(".theme-check input").change(function(){

        refresh();

    });

  $(".theme-clear-filters").on("click",function(){

    resetFilters();
    refresh();

  });

  $(".theme-no-results-reset").click(function(){

    resetFilters();
    refresh();

  });


    refresh();

});

/* Hero Grid */
jQuery(document).ready(function(t){
  document.querySelectorAll(".nhh-gridl").forEach((row,i)=>{

    row.innerHTML += row.innerHTML;
    if (window.innerWidth > 1000) {
      row.innerHTML += row.innerHTML;

      const dir = row.classList.contains("nhh-gridl-2") ? 1 : -1;

      const width = row.scrollWidth / 3;

      const durations = [180, 260, 140, 220];

      gsap.set(row,{
        x: dir == 1 ? -width : 0
      });

      gsap.to(row,{
        x: dir == 1 ? 0 : -width,
        duration: durations[i],
        ease: "none",
        repeat: -1
      });
    }

  });

  const images = document.querySelectorAll(".nhh-gride");

  let loaded = 0;

  images.forEach(el=>{

    const img = new Image();

    img.onload = ()=>{
      loaded++;

      if(loaded==images.length){

        gsap.to(".nhh-gridh",{
          opacity:1,
          duration:1,
          ease:"power2.out"
        });

      }

    };

    img.src = el.style.backgroundImage
      .replace('url("','')
      .replace('")','')
      .replace("url(","")
      .replace(")","");

  });
});
