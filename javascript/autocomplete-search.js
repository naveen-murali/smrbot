// name & id input field.
const selectedName = document.getElementById("searchName");
const selectedId = document.getElementById("searchId");

// autocomplete div.
let autocomplete = document.querySelector(".autocomplete");

// temp data.
const tempData = [
    {
        "_id": "608aacfffd1fe10c504c0de4", "otp": "578031", "name": "naveen", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:56:31.891Z", "__v": 0, "exitTime": "2021-04-29T13:03:04.366Z"
    },
    {
        "_id": "608aad22fd1fe10c504c0de5", "otp": "566833", "name": "pranav", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:57:06.416Z", "__v": 0, "exitTime": "2021-04-29T13:02:51.350Z"
    },
    {
        "_id": "608aad45fd1fe10c504c0de6", "otp": "721417", "name": "rohith", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:57:41.235Z", "__v": 0, "exitTime": "2021-04-29T13:02:40.091Z"
    },
    {
        "_id": "608aad5bfd1fe10c504c0de7", "otp": "307085", "name": "jijo", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:03.138Z", "__v": 0, "exitTime": "2021-04-29T13:02:03.306Z"
    },
    {
        "_id": "608aad75fd1fe10c504c0de8", "otp": "137722", "name": "nijith", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:29.731Z", "__v": 0, "exitTime": "2021-04-29T13:01:48.700Z"
    },
    {
        "_id": "608aad8afd1fe10c504c0de9", "otp": "071125", "name": "vineetha", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T12:58:50.504Z", "__v": 0, "exitTime": "2021-04-29T13:00:38.436Z"
    },
    {
        "_id": "608abe889a1b134c84caa8ee", "otp": "868513", "name": "rahul", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T14:11:20.306Z", "__v": 0, "exitTime": "2021-04-29T14:11:35.955Z"
    },
    {
        "_id": "608acbcd4003e728646b6e5d", "otp": "014765", "name": "sanoop", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:07:57.893Z", "__v": 0, "exitTime": "2021-04-29T15:13:26.726Z"
    },
    {
        "_id": "608acc964003e728646b6e5e", "otp": "340263", "name": "anoop", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:11:18.517Z", "__v": 0, "exitTime": "2021-04-29T15:16:06.092Z"
    },
    {
        "_id": "608acce74003e728646b6e5f", "otp": "651831", "name": "sachin", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:12:39.124Z", "__v": 0, "exitTime": "2021-04-29T15:15:26.546Z"
    },
    {
        "_id": "608acd424003e728646b6e60", "otp": "535087", "name": "arjun", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-04-29T15:14:10.113Z", "__v": 0, "exitTime": "2021-04-29T15:16:55.886Z"
    },
    {
        "_id": "609242b7498f6e5dd02851dd", "otp": "051485", "name": "naveen murali", "phone": "+918086894243", "place": "trikkaripur", "entryTime": "2021-05-05T07:01:11.608Z", "__v": 0, "exitTime": "2021-05-05T07:01:21.715Z"
    }
];

// funtion to set the value of selected name and id.
let setNameAndId = (name, id) => {
    selectedName.value = name;
    selectedId.value = id;
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

// ajax function.
let AJAX = (data, successFun, errorFun) => {
    let xhttp = XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readystate == 4 && this.status == 200) {
            let resData = JSON.parse(this.responseText);
            successFun(resData);
        } else if (this.status == 404 && this.readystate == 403) {
            errorFun("error on the autocomplete ajax");
        }
    }
};

// listening to input event of selectedName.
selectedName.addEventListener("input", (e) => {
    if (e.target.value) {
        removeAutocomplete();
        createAutocomplete(tempData);
    } else {
        removeAutocomplete();
        selectedName.setAttribute("placeholder", "Search For Name");
    }
});

// removing the auto complete
let removeAutocomplete = () => {
    autocomplete.innerHTML = "";
};
// creating chiled for autocomplete div.
let createAutocomplete = (tempData) => {
    let ul = document.createElement("ul");
    let li = null;

    tempData.forEach((data) => {
        li = document.createElement("li");
        li.textContent = data.name;
        setAttrbt(li, "data-id", data._id);
        setAttrbt(li, "onclick", "setSearchData(this)");
        setAttrbt(li, "onmouseover", "showSearchData(this)");
        setAttrbt(li, "onmouseout", "removeSearchData(this)");
        ul.appendChild(li);
    });

    autocomplete.appendChild(ul);
};
// setting attribute.
let setAttrbt = (li, attrbt, value) => {
    li.setAttribute(attrbt, value);
};