// name & id input field.
const selectedName = document.getElementById("searchName");
let selectedId = null;
if (document.getElementById("searchId")) {
    selectedId = document.getElementById("searchId");
}

// autocomplete div.
const autocomplete = document.querySelector(".autocomplete");

// Global ajax function.
let AJAX = (path, successFun, errorFun) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.responseText);
            successFun(resData);
        } else if (this.status == 404 && this.status == 403) {
            errorFun("error on the autocomplete ajax");
        }
    }

    xhttp.open("GET", path, true);
    xhttp.send();
};


// funtion to set the value of selected name and id.
let setNameAndId = (name, id) => {
    selectedName.value = name;
    if (selectedId) selectedId.value = id;
};

// setting preview of the data on input field on hovering the data.
let setSearchData = (self) => {
    setNameAndId(self.textContent, self.getAttribute("data-id"));
    removeAutocomplete();
};
// setting or showind preview of the data on input field on hovering the data.
let showSearchData = (self) => {
    selectedName.setAttribute("placeholder", selectedName.value);
    selectedName.value = self.textContent;
};
// sremoving preview of the data on input field on hovering the data.
let removeSearchData = (self) => {
    let value = selectedName.getAttribute("placeholder");
    selectedName.value = value;
};

// removing the auto complete
let removeAutocomplete = () => {
    autocomplete.innerHTML = "";
};
// creating chiled for autocomplete div.
let createAutocomplete = (autocompleteData) => {
    if (autocompleteData.length > 0) {
        let ul = document.createElement("ul");
        let li = null;
    
        autocompleteData.forEach((data) => {
            li = document.createElement("li");
            li.textContent = data.name;
            setAttrbt(li, "data-id", data._id);
            setAttrbt(li, "onclick", "setSearchData(this)");
            setAttrbt(li, "onmouseover", "showSearchData(this)");
            setAttrbt(li, "onmouseout", "removeSearchData(this)");
            ul.appendChild(li);
        });
    
        autocomplete.appendChild(ul);
    }
};
// setting attribute.
let setAttrbt = (li, attrbt, value) => {
    li.setAttribute(attrbt, value);
};

// listening to input event of selectedName.
selectedName.addEventListener("input", (e) => {
    if (e.target.value) {
        removeAutocomplete();
        AJAX(`/admin/customers/search/${e.target.value}`,
            (resData) => {
                createAutocomplete(resData.autocompleteData);
            },
            (err) => console.log(err));
    } else {
        removeAutocomplete();
        selectedName.setAttribute("placeholder", "Search For Name");
    }
});