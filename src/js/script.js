$(function () {
    // Get the container element
    let btnContainer = document.getElementById("navbar-nav");

    // Get all buttons with class="btn" inside the container
    let btns = btnContainer.getElementsByClassName("nav-item");

    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
});

$(function () {
    // In Firefox and Safari, the click event doesn't retain the focus
    // on the clicked button. Therefore, the blur event will not fire on
    // user clicking somewhere else in the page and the blur event handler
    // which is set up above will not be called.
    // Refer to issue #28 in the repo.
    // Solution: force focus on the element that the click event fired on
    $("#navbarToggle").click(function (event) {
        $(event.target).focus();
    });
});

(function(global) {
    let fm = {};
    let homeHtml = "snippets/home-snippet.html"
    let allServicesUrl = "../data/services.json"
    let serviceHtml = "snippets/service-snippet.html"
    let servicesTitleHtml = "snippets/services-title-snippet.html"
    let contactsHtml = "snippets/contacts-snippet.html";
    let faqHtml = "snippets/faq-snippet.html";

    // Convenience function for inserting innerHTML for 'select'
    let insertHtml = function (selector, html) {
        let targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    let showLoading = function (selector) {
        let html = "<div class='text-center'>";
        html += "<img src='../images/loading.gif'></div>";
        insertHtml(selector, html);
    };

    // Return substitute of '{{propName}}' with propValue in given 'string'
    let insertProperty = function (string, propName, propValue) {
        let propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    fm.loadHomePage = function () {
        // On first load, show home view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (homeHtml) {
                // Retrieve single service snippet
                $ajaxUtils.sendGetRequest(
                    servicesTitleHtml,
                    function (servicesTitleHtml) {
                        $ajaxUtils.sendGetRequest(allServicesUrl,
                            function (services) {
                                $ajaxUtils.sendGetRequest(serviceHtml,
                                    function (serviceHtml) {
                                        let servicesViewHtml = buildHomePageHtml(services, servicesTitleHtml, homeHtml, serviceHtml);
                                        insertHtml("#main-content", servicesViewHtml);
                                    },
                                    false);
                            },
                            true);
                    },
                    false);
            },
            false);
    }

    // On page load, show home view
    document.addEventListener("DOMContentLoaded", function (event){
        fm.loadHomePage();
    })

    //Using categories data and snippets html build services view HTML to be inserted into page
    function buildHomePageHtml(services, servicesTitleHtml, homeHtml, serviceHtml){
        let finalHtml = homeHtml;
        finalHtml += servicesTitleHtml;
        finalHtml += "<div id=\"overflow-wrapper\">"
        finalHtml += "<div class=\"container services-container\">"

        //Loop over services
        for(let i = 0; i < services.length; i++) {
            //Insert service values
            let html = serviceHtml;
            let name = "" + services[i].name;
            let short_name = services[i].short_name;
            let id = services[i].id;
            html = insertProperty(html, "status", "");
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            html = insertProperty(html, "id", id);
            finalHtml += html;
        }
        let html = "</div></div>";
        finalHtml += html
        finalHtml += "<div class=\"service-description\" id=\"service-description\">{{description}}</div>"
        return finalHtml;
    }

   fm.loadDescription = function (id) {
        let allServicesUrl = "../data/services.json";

        let html = document.getElementById('service-description');
        html.innerHTML = "{{description}}";
        html.style.display = "block";
        $ajaxUtils.sendGetRequest(allServicesUrl,
            function (services) {
                for (let i = 0; i < services.length; i++) {
                    if(i == id) {
                        html = insertProperty(html.outerHTML, "description", services[i].description);
                        let descriptionTitle = "<p>"+ services[i].name +"</p><br>"
                        let selector = "#service-description";
                        let finalHtml = descriptionTitle + html;
                        insertHtml(selector, finalHtml);
                        break;
                    }
                }
            },
            true);
        let footer = document.getElementById('footer');
        footer.style.position = "relative";
    }

    fm.collapseDescription =  function  () {
        document.getElementById('service-description').style.display = "none";
        let footer = document.getElementById('footer');
        footer.style.position = "absolute";
    }

    fm.loadContacts = function ()  {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            contactsHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);
    }

    $(document).on("click",".accordion button", function () {
        const itemToggle = $(this).attr('aria-expanded');
        const items = document.querySelectorAll(".accordion button");
        for (let i = 0; i < items.length; i++) {
            items[i].setAttribute('aria-expanded', 'false');
        }

        if (itemToggle == 'false') {
            $(this).attr('aria-expanded', 'true');
        }
    });


    fm.loadFaq = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            faqHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);
    }

    global.$fm = fm;
})(window);