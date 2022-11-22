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
    let allServicesUrl = "data/services.json"

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

    // On page load, show home view
    document.addEventListener("DOMContentLoaded", function (event){
        // On first load, show home view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);
    })
})(window);