import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicResourceLoader: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // Function to remove existing CSS and JS
    const removeExistingResources = () => {
      document
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach((link) => link.remove());
      document
        .querySelectorAll('link[rel="icon"]')
        .forEach((link) => link.remove());
      document
        .querySelectorAll("script[data-dynamic]")
        .forEach((script) => script.remove());
    };

    // Function to load CSS
    const loadCSS = (path: string) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = path;
      document.head.appendChild(link);
    };

    // Function to load JS
    const loadJS = (path: string, onLoad?: () => void) => {
      const script = document.createElement("script");
      script.src = path;
      script.dataset.dynamic = "true";
      if (onLoad) {
        script.onload = onLoad;
      }
      document.body.appendChild(script);
    };

    // Function to load favicon
    const loadFavicon = (path: string) => {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = path;
      link.type = "image/x-icon";
      document.head.appendChild(link);
    };

    removeExistingResources();

    if (path.startsWith("") && !path.startsWith("/admin")) {
      // User-specific CSS
      loadCSS(
        "https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700"
      );
      loadCSS(
        "https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i"
      );

      // Adding Font Awesome CSS
      const fontAwesomeLink = document.createElement("link");
      fontAwesomeLink.rel = "stylesheet";
      fontAwesomeLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
      fontAwesomeLink.integrity =
        "sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==";
      fontAwesomeLink.crossOrigin = "anonymous";
      fontAwesomeLink.referrerPolicy = "no-referrer";
      document.head.appendChild(fontAwesomeLink);

      loadCSS("/user/css/open-iconic-bootstrap.min.css");
      loadCSS("/user/css/animate.css");
      loadCSS("/user/css/owl.carousel.min.css");
      loadCSS("/user/css/owl.theme.default.min.css");
      loadCSS("/user/css/magnific-popup.css");
      loadCSS("/user/css/aos.css");
      loadCSS("/user/css/ionicons.min.css");
      loadCSS("/user/css/bootstrap-datepicker.css");
      loadCSS("/user/css/jquery.timepicker.css");
      loadCSS("/user/css/flaticon.css");
      loadCSS("/user/css/icomoon.css");
      loadCSS("/user/css/style.css");

      // User-specific JS
      loadJS("/user/js/jquery.min.js", () => {
        loadJS("/user/js/jquery-migrate-3.0.1.min.js", () => {
          loadJS("/user/js/popper.min.js", () => {
            loadJS("/user/js/bootstrap.min.js", () => {
              loadJS("/user/js/jquery.easing.1.3.js", () => {
                loadJS("/user/js/jquery.waypoints.min.js", () => {
                  loadJS("/user/js/jquery.stellar.min.js", () => {
                    loadJS("/user/js/owl.carousel.min.js", () => {
                      loadJS("/user/js/jquery.magnific-popup.min.js", () => {
                        loadJS("/user/js/aos.js", () => {
                          loadJS("/user/js/jquery.animateNumber.min.js", () => {
                            loadJS("/user/js/bootstrap-datepicker.js", () => {
                              loadJS("/user/js/scrollax.min.js", () => {
                                loadJS("/user/js/jquery.countup.js", () => {
                                  // Inline user-specific JS
                                  const inlineUserScripts = `
                                    setTimeout(function () {
                                    if ($("#ftco-loader").length > 0) {
                                      $("#ftco-loader").removeClass("show");
                                    }
                                  }, 1);

                                  $("nav .dropdown").hover(
                                    function () {
                                      var $this = $(this);
                                      // 	 timer;
                                      // clearTimeout(timer);
                                      $this.addClass("show");
                                      $this.find("> a").attr("aria-expanded", true);
                                      // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
                                      $this.find(".dropdown-menu").addClass("show");
                                    },
                                    function () {
                                      var $this = $(this);
                                      // timer;
                                      // timer = setTimeout(function(){
                                      $this.removeClass("show");
                                      $this.find("> a").attr("aria-expanded", false);
                                      // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
                                      $this.find(".dropdown-menu").removeClass("show");
                                      // }, 100);
                                    }
                                  );

                                  $("#dropdown04").on("show.bs.dropdown", function () {
                                    console.log("show");
                                  });

                                  $(window).stellar({
        responsive: true,
        parallaxBackgrounds: true,
        parallaxElements: true,
        horizontalScrolling: false,
        hideDistantElements: false,
        scrollProperty: "scroll",
      });

                                     $(document).ready(function () {
                                      $(".home-slider").owlCarousel({
                                        loop: true,
                                        autoplay: true,
                                        margin: 0,
                                        animateOut: "fadeOut",
                                        animateIn: "fadeIn",
                                        nav: false,
                                        dots: false,
                                        autoplayHoverPause: false,
                                        items: 1,
                                        navText: [
                                          "<span class='ion-md-arrow-back'></span>",
                                          "<span class='ion-chevron-right'></span>",
                                        ],
                                        responsive: {
                                          0: {
                                            items: 1,
                                          },
                                          600: {
                                            items: 1,
                                          },
                                          1000: {
                                            items: 1,
                                          },
                                        },
                                      });
                                      $(".carousel-testimony").owlCarousel({
                                        autoplay: true,
                                        loop: true,
                                        items: 1,
                                        margin: 0,
                                        stagePadding: 0,
                                        nav: false,
                                        navText: [
                                          '<span class="ion-ios-arrow-back">',
                                          '<span class="ion-ios-arrow-forward">',
                                        ],
                                        responsive: {
                                          0: {
                                            items: 1,
                                          },
                                          600: {
                                            items: 1,
                                          },
                                          1000: {
                                            items: 1,
                                          },
                                        },
                                      });

                                      $(".single-slider").owlCarousel({
                                        animateOut: "fadeOut",
                                        animateIn: "fadeIn",
                                        autoplay: true,
                                        loop: true,
                                        items: 1,
                                        margin: 0,
                                        stagePadding: 0,
                                        nav: true,
                                        dots: true,
                                        navText: [
                                          '<span class="ion-ios-arrow-back">',
                                          '<span class="ion-ios-arrow-forward">',
                                        ],
                                        responsive: {
                                          0: {
                                            items: 1,
                                          },
                                          600: {
                                            items: 1,
                                          },
                                          1000: {
                                            items: 1,
                                          },
                                        },
                                      });
                                    });

 $(".image-popup").magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: "mfp-no-margins mfp-with-zoom", // class to remove default margin from left and right side
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
        },
        image: {
          verticalFit: true,
        },
        zoom: {
          enabled: true,
          duration: 300, // don't foget to change the duration also in CSS
        },
      });

      $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
        disableOn: 700,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false,
      });

       $(".checkin_date, .checkout_date").datepicker({
        format: "m/d/yyyy",
        autoclose: true,
      });

       $(window).scroll(function () {
        var $w = $(this),
          st = $w.scrollTop(),
          navbar = $(".ftco_navbar"),
          sd = $(".js-scroll-wrap");

        if (st > 150) {
          if (!navbar.hasClass("scrolled")) {
            navbar.addClass("scrolled");
          }
        }
        if (st < 150) {
          if (navbar.hasClass("scrolled")) {
            navbar.removeClass("scrolled sleep");
          }
        }
        if (st > 350) {
          if (!navbar.hasClass("awake")) {
            navbar.addClass("awake");
          }

          if (sd.length > 0) {
            sd.addClass("sleep");
          }
        }
        if (st < 350) {
          if (navbar.hasClass("awake")) {
            navbar.removeClass("awake");
            navbar.addClass("sleep");
          }
          if (sd.length > 0) {
            sd.removeClass("sleep");
          }
        }
      });
      $("#section-counter").waypoint(
        function (direction) {
          if (
            direction === "down" &&
            !$(this.element).hasClass("ftco-animated")
          ) {
            var comma_separator_number_step =
              $.animateNumber.numberStepFactories.separator(",");
            $(".number").each(function () {
              var $this = $(this),
                num = $this.data("number");
              console.log(num);
              $this.animateNumber(
                {
                  number: num,
                  numberStep: comma_separator_number_step,
                },
                7000
              );
            });
          }
        },
        { offset: "95%" }
      );

      var i = 0;
      $(".ftco-animate").waypoint(
        function (direction) {
          if (
            direction === "down" &&
            !$(this.element).hasClass("ftco-animated")
          ) {
            i++;

            $(this.element).addClass("item-animate");
            setTimeout(function () {
              $("body .ftco-animate.item-animate").each(function (k) {
                var el = $(this);
                setTimeout(
                  function () {
                    var effect = el.data("animate-effect");
                    if (effect === "fadeIn") {
                      el.addClass("fadeIn ftco-animated");
                    } else if (effect === "fadeInLeft") {
                      el.addClass("fadeInLeft ftco-animated");
                    } else if (effect === "fadeInRight") {
                      el.addClass("fadeInRight ftco-animated");
                    } else {
                      el.addClass("fadeInUp ftco-animated");
                    }
                    el.removeClass("item-animate");
                  },
                  k * 50,
                  "easeInOutExpo"
                );
              });
            }, 100);
          }
        },
        { offset: "95%" }
      );

      $(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on(
        "click",
        function (e) {
          e.preventDefault();

          var hash = this.hash,
            navToggler = $(".navbar-toggler");
          $("html, body").animate(
            {
              scrollTop: $(hash).offset().top,
            },
            700,
            "easeInOutExpo",
            function () {
              window.location.hash = hash;
            }
          );

          if (navToggler.is(":visible")) {
            navToggler.click();
          }
        }
      );
      $("body").on("activate.bs.scrollspy", function () {
        console.log("nice");
      });
                                  `;
                                  const script =
                                    document.createElement("script");
                                  script.textContent = inlineUserScripts;
                                  document.body.appendChild(script);
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    } else if (path.startsWith("/admin")) {
      // Adding favicon for admin
      loadFavicon("/admin/img/kaiadmin/favicon.ico");

      // Admin-specific CSS
      loadCSS("/admin/css/bootstrap.min.css");
      loadCSS("/admin/css/plugins.min.css");
      loadCSS("/admin/css/kaiadmin.min.css");
      loadCSS("/admin/css/demo.css");

      // Admin-specific JS

      // Adding WebFont
      loadJS("/admin/js/plugin/webfont/webfont.min.js", () => {
        // Inline admin-specific JS with WebFont configuration
        const inlineAdminScripts = `
          WebFont.load({
            google: { families: ["Public Sans:300,400,500,600,700"] },
            custom: {
              families: [
                "Font Awesome 5 Solid",
                "Font Awesome 5 Regular",
                "Font Awesome 5 Brands",
                "simple-line-icons",
              ],
              urls: ["/admin/css/fonts.min.css"],
            },
            active: function () {
              sessionStorage.fonts = true;
            },
          });
    
          $("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
            type: "line",
            height: "70",
            width: "100%",
            lineWidth: "2",
            lineColor: "#177dff",
            fillColor: "rgba(23, 125, 255, 0.14)",
          });
    
          $("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
            type: "line",
            height: "70",
            width: "100%",
            lineWidth: "2",
            lineColor: "#f3545d",
            fillColor: "rgba(243, 84, 93, .14)",
          });
    
          $("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
            type: "line",
            height: "70",
            width: "100%",
            lineWidth: "2",
            lineColor: "#ffa534",
            fillColor: "rgba(255, 165, 52, .14)",
          });
        `;

        loadJS("/admin/js/core/jquery-3.7.1.min.js", () => {
          loadJS("/admin/js/core/popper.min.js", () => {
            loadJS("/admin/js/core/bootstrap.min.js", () => {
              loadJS(
                "/admin/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js",
                () => {
                  loadJS("/admin/js/plugin/chart.js/chart.min.js", () => {
                    loadJS(
                      "/admin/js/plugin/jquery.sparkline/jquery.sparkline.min.js",
                      () => {
                        loadJS(
                          "/admin/js/plugin/chart-circle/circles.min.js",
                          () => {
                            loadJS(
                              "/admin/js/plugin/datatables/datatables.min.js",
                              () => {
                                loadJS(
                                  "/admin/js/plugin/bootstrap-notify/bootstrap-notify.min.js",
                                  () => {
                                    loadJS(
                                      "/admin/js/plugin/jsvectormap/jsvectormap.min.js",
                                      () => {
                                        loadJS(
                                          "/admin/js/plugin/jsvectormap/world.js",
                                          () => {
                                            loadJS(
                                              "/admin/js/plugin/sweetalert/sweetalert.min.js",
                                              () => {
                                                loadJS(
                                                  "/admin/js/kaiadmin.min.js",
                                                  () => {
                                                    loadJS(
                                                      "/admin/js/setting-demo.js",
                                                      () => {
                                                        loadJS(
                                                          "/admin/js/demo.js",
                                                          () => {
                                                            // Inject inline admin-specific scripts
                                                            const script =
                                                              document.createElement(
                                                                "script"
                                                              );
                                                            script.textContent =
                                                              inlineAdminScripts;
                                                            document.body.appendChild(
                                                              script
                                                            );
                                                          }
                                                        );
                                                      }
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                }
              );
            });
          });
        });
      });
    }
  }, [location.pathname]);

  return null;
};

export default DynamicResourceLoader;
